export const GO_BLOCKS = [
  `package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func main() {
	server := &http.Server{
		Addr:         ":8080",
		Handler:      setupRoutes(),
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Println("Starting server on :8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

func setupRoutes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthCheckHandler)
	mux.HandleFunc("/api/users", usersHandler)
	return mux
}`,

  `type User struct {

	ID        int       \`json:"id" db:"id"\`
	Name      string    \`json:"name" db:"name"\`
	Email     string    \`json:"email" db:"email"\`
	CreatedAt time.Time \`json:"created_at" db:"created_at"\`
	UpdatedAt time.Time \`json:"updated_at" db:"updated_at"\`
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetByID(id int) (*User, error) {
	query := "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1"
	
	var user User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user with id %d not found", id)
	}
	
	if err != nil {
		return nil, fmt.Errorf("error fetching user: %w", err)
	}
	
	return &user, nil
}

func (r *UserRepository) Create(user *User) error {
	query := \`
		INSERT INTO users (name, email, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	\`
	
	now := time.Now()
	err := r.db.QueryRow(query, user.Name, user.Email, now, now).Scan(&user.ID)
	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}
	
	user.CreatedAt = now
	user.UpdatedAt = now
	return nil
}`,

  `func processItems(items []Item) ([]Result, error) {

	results := make([]Result, 0, len(items))
	
	type processResult struct {
		result Result
		err    error
		index  int
	}
	
	resultCh := make(chan processResult, len(items))
	
	for i, item := range items {
		go func(idx int, item Item) {
			result, err := processItem(item)
			resultCh <- processResult{
				result: result,
				err:    err,
				index:  idx,
			}
		}(i, item)
	}
	
	resultSlice := make([]Result, len(items))
	var firstError error
	
	for i := 0; i < len(items); i++ {
		res := <-resultCh
		if res.err != nil && firstError == nil {
			firstError = res.err
		}
		resultSlice[res.index] = res.result
	}
	
	if firstError != nil {
		return nil, firstError
	}
	
	return resultSlice, nil
}

func processItem(item Item) (Result, error) {
	time.Sleep(time.Millisecond * 100)
	
	if item.ID <= 0 {
		return Result{}, fmt.Errorf("invalid item ID: %d", item.ID)
	}
	
	return Result{
		ID:        item.ID,
		Data:      strings.ToUpper(item.Name),
		ProcessedAt: time.Now(),
	}, nil
}`,

  `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type APIResponse struct {
	Success bool        \`json:"success"\`
	Data    interface{} \`json:"data,omitempty"\`
	Error   string      \`json:"error,omitempty"\`
}

type ProductHandler struct {
	repository ProductRepository
}

func NewProductHandler(repo ProductRepository) *ProductHandler {
	return &ProductHandler{repository: repo}
}

func (h *ProductHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
	products, err := h.repository.GetAll()
	if err != nil {
		writeErrorResponse(w, http.StatusInternalServerError, "Failed to fetch products")
		return
	}
	
	writeSuccessResponse(w, products)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "Invalid product ID")
		return
	}
	
	product, err := h.repository.GetByID(id)
	if err != nil {
		writeErrorResponse(w, http.StatusNotFound, "Product not found")
		return
	}
	
	writeSuccessResponse(w, product)
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var product Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "Invalid JSON")
		return
	}
	
	if err := h.repository.Create(&product); err != nil {
		writeErrorResponse(w, http.StatusInternalServerError, "Failed to create product")
		return
	}
	
	writeSuccessResponse(w, product)
}

func writeSuccessResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    data,
	})
}

func writeErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(APIResponse{
		Success: false,
		Error:   message,
	})
}`,

  `package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type RedisCache struct {
	client *redis.Client
}

func NewRedisCache(addr, password string, db int) *RedisCache {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})
	
	return &RedisCache{client: rdb}
}

func (r *RedisCache) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal value: %w", err)
	}
	
	return r.client.Set(ctx, key, data, expiration).Err()
}

func (r *RedisCache) Get(ctx context.Context, key string, dest interface{}) error {
	val, err := r.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return fmt.Errorf("key not found: %s", key)
	}
	if err != nil {
		return fmt.Errorf("failed to get value: %w", err)
	}
	
	return json.Unmarshal([]byte(val), dest)
}

func (r *RedisCache) Delete(ctx context.Context, key string) error {
	return r.client.Del(ctx, key).Err()
}

func (r *RedisCache) Exists(ctx context.Context, key string) (bool, error) {
	result, err := r.client.Exists(ctx, key).Result()
	return result > 0, err
}

// Usage example
func ExampleUsage() {
	cache := NewRedisCache("localhost:6379", "", 0)
	ctx := context.Background()
	
	user := User{ID: 1, Name: "John Doe", Email: "john@example.com"}
	err := cache.Set(ctx, "user:1", user, time.Hour)
	if err != nil {
		fmt.Printf("Error setting cache: %v\n", err)
		return
	}
	
	var cachedUser User
	err = cache.Get(ctx, "user:1", &cachedUser)
	if err != nil {
		fmt.Printf("Error getting cache: %v\n", err)
		return
	}
	
	fmt.Printf("Cached user: %+v\n", cachedUser)
}`,

  `package middleware

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug"
	"time"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		wrapped := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}
		
		next.ServeHTTP(wrapped, r)
		
		duration := time.Since(start)
		log.Printf(
			"%s %s %d %v %s",
			r.Method,
			r.RequestURI,
			wrapped.statusCode,
			duration,
			r.UserAgent(),
		)
	})
}

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v\n%s", err, debug.Stack())
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		
		next.ServeHTTP(w, r)
	})
}

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}

func RateLimit(requestsPerMinute int) func(http.Handler) http.Handler {
	type client struct {
		requests int
		lastReset time.Time
	}
	
	clients := make(map[string]*client)
	
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := r.RemoteAddr
			now := time.Now()
			
			if c, exists := clients[ip]; exists {
				if now.Sub(c.lastReset) > time.Minute {
					c.requests = 0
					c.lastReset = now
				}
				
				if c.requests >= requestsPerMinute {
					http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
					return
				}
				
				c.requests++
			} else {
				clients[ip] = &client{
					requests: 1,
					lastReset: now,
				}
			}
			
			next.ServeHTTP(w, r)
		})
	}
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}`,

  `package worker

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"
)

type Job interface {
	Execute(ctx context.Context) error
	GetID() string
}

type WorkerPool struct {
	workers    int
	jobQueue   chan Job
	resultChan chan JobResult
	quit       chan bool
	wg         sync.WaitGroup
}

type JobResult struct {
	JobID string
	Error error
	CompletedAt time.Time
}

type EmailJob struct {
	ID        string
	Recipient string
	Subject   string
	Body      string
}

func (j EmailJob) Execute(ctx context.Context) error {
	time.Sleep(time.Millisecond * 500)
	
	if j.Recipient == "" {
		return fmt.Errorf("recipient cannot be empty")
	}
	
	log.Printf("Email sent to %s: %s", j.Recipient, j.Subject)
	return nil
}

func (j EmailJob) GetID() string {
	return j.ID
}

func NewWorkerPool(workers int, queueSize int) *WorkerPool {
	return &WorkerPool{
		workers:    workers,
		jobQueue:   make(chan Job, queueSize),
		resultChan: make(chan JobResult, queueSize),
		quit:       make(chan bool),
	}
}

func (wp *WorkerPool) Start(ctx context.Context) {
	for i := 0; i < wp.workers; i++ {
		wp.wg.Add(1)
		go wp.worker(ctx, i)
	}
	
	log.Printf("Started worker pool with %d workers", wp.workers)
}

func (wp *WorkerPool) worker(ctx context.Context, id int) {
	defer wp.wg.Done()
	
	for {
		select {
		case job := <-wp.jobQueue:
			start := time.Now()
			err := job.Execute(ctx)
			
			wp.resultChan <- JobResult{
				JobID:       job.GetID(),
				Error:       err,
				CompletedAt: time.Now(),
			}
			
			if err != nil {
				log.Printf("Worker %d: Job %s failed: %v (took %v)", 
					id, job.GetID(), err, time.Since(start))
			} else {
				log.Printf("Worker %d: Job %s completed (took %v)", 
					id, job.GetID(), time.Since(start))
			}
			
		case <-wp.quit:
			log.Printf("Worker %d stopping", id)
			return
			
		case <-ctx.Done():
			log.Printf("Worker %d stopped due to context cancellation", id)
			return
		}
	}
}

func (wp *WorkerPool) Submit(job Job) error {
	select {
	case wp.jobQueue <- job:
		return nil
	default:
		return fmt.Errorf("job queue is full")
	}
}

func (wp *WorkerPool) Results() <-chan JobResult {
	return wp.resultChan
}

func (wp *WorkerPool) Stop() {
	close(wp.quit)
	wp.wg.Wait()
	close(wp.jobQueue)
	close(wp.resultChan)
}`,

  `package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type Database struct {
	db *sql.DB
}

func NewDatabase(connStr string) (*Database, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}
	
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}
	
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)
	
	return &Database{db: db}, nil
}

func (d *Database) Migrate() error {
	migrations := []string{
		\`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)\`,
		
		\`CREATE TABLE IF NOT EXISTS posts (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			title VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			published BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)\`,
		
		\`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)\`,
		\`CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published)\`,
	}
	
	for i, migration := range migrations {
		if _, err := d.db.Exec(migration); err != nil {
			return fmt.Errorf("migration %d failed: %w", i+1, err)
		}
	}
	
	log.Println("Database migrations completed successfully")
	return nil
}

func (d *Database) Close() error {
	return d.db.Close()
}

func (d *Database) Health() error {
	return d.db.Ping()
}

func (d *Database) WithTx(fn func(*sql.Tx) error) error {
	tx, err := d.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()
	
	err = fn(tx)
	return err
}`,

  `package auth

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/argon2"
)

type AuthService struct {
	jwtSecret []byte
	issuer    string
}

type Claims struct {
	UserID int    \`json:"user_id"\`
	Email  string \`json:"email"\`
	jwt.StandardClaims
}

type PasswordHash struct {
	Hash string
	Salt string
}

func NewAuthService(secret string, issuer string) *AuthService {
	return &AuthService{
		jwtSecret: []byte(secret),
		issuer:    issuer,
	}
}

func (a *AuthService) GenerateToken(userID int, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	
	claims := &Claims{
		UserID: userID,
		Email:  email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
			Issuer:    a.issuer,
			IssuedAt:  time.Now().Unix(),
		},
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(a.jwtSecret)
}

func (a *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return a.jwtSecret, nil
	})
	
	if err != nil {
		return nil, err
	}
	
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	
	return claims, nil
}

func (a *AuthService) HashPassword(password string) (*PasswordHash, error) {
	salt := make([]byte, 32)
	if _, err := rand.Read(salt); err != nil {
		return nil, err
	}
	
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	
	return &PasswordHash{
		Hash: base64.RawStdEncoding.EncodeToString(hash),
		Salt: base64.RawStdEncoding.EncodeToString(salt),
	}, nil
}

func (a *AuthService) VerifyPassword(password string, stored *PasswordHash) (bool, error) {
	salt, err := base64.RawStdEncoding.DecodeString(stored.Salt)
	if err != nil {
		return false, err
	}
	
	storedHash, err := base64.RawStdEncoding.DecodeString(stored.Hash)
	if err != nil {
		return false, err
	}
	
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	
	return subtle.ConstantTimeCompare(hash, storedHash) == 1, nil
}`,

  `package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
	Email    EmailConfig
}

type ServerConfig struct {
	Host         string
	Port         int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	Environment  string
}

type DatabaseConfig struct {
	Host         string
	Port         int
	User         string
	Password     string
	Database     string
	SSLMode      string
	MaxOpenConns int
	MaxIdleConns int
}

type RedisConfig struct {
	Host     string
	Port     int
	Password string
	Database int
}

type JWTConfig struct {
	Secret     string
	Issuer     string
	Expiration time.Duration
}

type EmailConfig struct {
	SMTPHost     string
	SMTPPort     int
	Username     string
	Password     string
	FromAddress  string
	FromName     string
}

func Load() (*Config, error) {
	config := &Config{
		Server: ServerConfig{
			Host:         getEnv("SERVER_HOST", "localhost"),
			Port:         getEnvInt("SERVER_PORT", 8080),
			ReadTimeout:  getEnvDuration("SERVER_READ_TIMEOUT", 30*time.Second),
			WriteTimeout: getEnvDuration("SERVER_WRITE_TIMEOUT", 30*time.Second),
			Environment:  getEnv("ENVIRONMENT", "development"),
		},
		Database: DatabaseConfig{
			Host:         getEnv("DB_HOST", "localhost"),
			Port:         getEnvInt("DB_PORT", 5432),
			User:         getEnv("DB_USER", "postgres"),
			Password:     getEnv("DB_PASSWORD", ""),
			Database:     getEnv("DB_NAME", "myapp"),
			SSLMode:      getEnv("DB_SSLMODE", "disable"),
			MaxOpenConns: getEnvInt("DB_MAX_OPEN_CONNS", 25),
			MaxIdleConns: getEnvInt("DB_MAX_IDLE_CONNS", 25),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnvInt("REDIS_PORT", 6379),
			Password: getEnv("REDIS_PASSWORD", ""),
			Database: getEnvInt("REDIS_DB", 0),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "your-secret-key"),
			Issuer:     getEnv("JWT_ISSUER", "myapp"),
			Expiration: getEnvDuration("JWT_EXPIRATION", 24*time.Hour),
		},
		Email: EmailConfig{
			SMTPHost:    getEnv("SMTP_HOST", "localhost"),
			SMTPPort:    getEnvInt("SMTP_PORT", 587),
			Username:    getEnv("SMTP_USERNAME", ""),
			Password:    getEnv("SMTP_PASSWORD", ""),
			FromAddress: getEnv("FROM_EMAIL", "noreply@example.com"),
			FromName:    getEnv("FROM_NAME", "MyApp"),
		},
	}

	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	return config, nil
}

func (c *Config) Validate() error {
	if c.Database.Password == "" && c.Server.Environment == "production" {
		return fmt.Errorf("database password is required in production")
	}
	
	if c.JWT.Secret == "your-secret-key" && c.Server.Environment == "production" {
		return fmt.Errorf("JWT secret must be set in production")
	}
	
	return nil
}

func (c *Config) DatabaseURL() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Database.Host,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.Database,
		c.Database.SSLMode,
	)
}

func (c *Config) RedisAddr() string {
	return fmt.Sprintf("%s:%d", c.Redis.Host, c.Redis.Port)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}`
];
