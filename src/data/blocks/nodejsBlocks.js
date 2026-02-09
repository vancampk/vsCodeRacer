export const NODEJS_BLOCKS = [
  `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,

  `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists with this email'
        });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        isVerified: false
      });

      await user.save();

      const verificationUrl = \`\${process.env.FRONTEND_URL}/verify-email?token=\${verificationToken}\`;
      await sendEmail({
        to: email,
        subject: 'Verify your email address',
        html: \`
          <h1>Welcome to our platform!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="\${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        \`
      });

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        userId: user._id
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isVerified) {
        return res.status(401).json({
          error: 'Please verify your email address before logging in'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
          issuer: 'your-app-name'
        }
      );

      user.lastLoginAt = new Date();
      await user.save();

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();`,

  `const mongoose = require('mongoose');
const Redis = require('ioredis');

class DatabaseService {
  constructor() {
    this.mongoose = mongoose;
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    this.setupMongooseEvents();
    this.setupRedisEvents();
  }

  setupMongooseEvents() {
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  }

  setupRedisEvents() {
    this.redis.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async connectMongoDB() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log('MongoDB connection established');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  async cacheGet(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(\`Cache get error for key \${key}:\`, error);
      return null;
    }
  }

  async cacheSet(key, value, ttlSeconds = 3600) {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error(\`Cache set error for key \${key}:\`, error);
      return false;
    }
  }

  async checkMongoHealth() {
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', latency: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkRedisHealth() {
    try {
      const start = Date.now();
      await this.redis.ping();
      return { status: 'healthy', latency: Date.now() - start };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async shutdown() {
    try {
      await mongoose.connection.close();
      await this.redis.quit();
      console.log('Database connections closed gracefully');
    } catch (error) {
      console.error('Error during database shutdown:', error);
    }
  }
}

module.exports = new DatabaseService();`,
];