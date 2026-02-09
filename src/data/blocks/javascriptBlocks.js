export const JAVASCRIPT_BLOCKS = [
  `function calculateTotal(items) {

  let sum = 0;
  for (const item of items) {
    sum += item.price;
  }
  return sum;
}`,

  `const fetchData = async (url) => {

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`,

  `class UserProfile {

  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.created = new Date();
  }
  
  toString() {
    return \`\${this.name} <\${this.email}>\`;
  }
}`,

  `if (user.isAuthenticated) {

  console.log('Welcome back!');
  loadUserData();
} else {
  redirectToLogin();
}`,

  `const numbers = [1, 2, 3, 4, 5];

const doubled = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);`,

  `function debounce(func, delay) {

  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`,

  `const apiClient = {

  baseURL: 'https://api.example.com',
  
  async get(endpoint) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}`,

  `function validateEmail(email) {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}`,

  `const storage = {

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }
}`,

  `function createCounter() {

  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    reset: () => count = 0
  };
}`,

  `const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
});`,

  `function throttle(func, limit) {

  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`,

  `const eventEmitter = {

  events: {},
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}`,

  `function deepClone(obj) {

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}`,

  `class TaskQueue {

  constructor() {
    this.queue = [];
    this.running = false;
  }
  
  add(task) {
    this.queue.push(task);
    this.process();
  }
  
  async process() {
    if (this.running || this.queue.length === 0) {
      return;
    }
    
    this.running = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await task();
    }
    
    this.running = false;
  }
}`,

  `function formatCurrency(amount, currency = 'USD') {

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}`,

  `const cache = new Map();

function memoize(fn) {
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,

  `function generateUUID() {

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}`,

  `class Timer {

  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.running = false;
  }
  
  start() {
    this.startTime = Date.now();
    this.running = true;
    this.endTime = null;
  }
  
  stop() {
    if (this.running) {
      this.endTime = Date.now();
      this.running = false;
    }
    return this.getElapsed();
  }
  
  getElapsed() {
    if (this.startTime) {
      const end = this.endTime || Date.now();
      return end - this.startTime;
    }
    return 0;
  }
}`,

  `function sortObjectsByProperty(array, property, ascending = true) {

  return array.sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (ascending) {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
}`,

  `const router = {

  routes: new Map(),
  
  add(path, handler) {
    this.routes.set(path, handler);
  },
  
  navigate(path) {
    const handler = this.routes.get(path);
    if (handler) {
      handler();
    } else {
      console.error('Route not found:', path);
    }
  }
}`,

  `function createPromiseWithResolvers() {

  let resolve, reject;
  
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return { promise, resolve, reject };
}`,

  `const logger = {

  levels: { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 },
  currentLevel: 2,
  
  log(level, message, ...args) {
    if (this.levels[level] <= this.currentLevel) {
      const timestamp = new Date().toISOString();
      console.log(\`[\${timestamp}] \${level}: \${message}\`, ...args);
    }
  },
  
  error(message, ...args) { this.log('ERROR', message, ...args); },
  warn(message, ...args) { this.log('WARN', message, ...args); },
  info(message, ...args) { this.log('INFO', message, ...args); },
  debug(message, ...args) { this.log('DEBUG', message, ...args); }
}`,

  `function retry(fn, maxAttempts = 3, delay = 1000) {

  return async function(...args) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
    
    throw lastError;
  };
}`,

  `class StateManager {

  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = [];
  }
  
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    this.listeners.forEach(listener => {
      listener(this.state, prevState);
    });
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  getState() {
    return { ...this.state };
  }
}`,

  `function parseQueryString(queryString) {

  const params = {};
  const searchParams = new URLSearchParams(queryString);
  
  for (const [key, value] of searchParams) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
}`,

  `const animationFrame = {

  callbacks: new Map(),
  id: 0,
  
  request(callback) {
    const callbackId = this.id++;
    this.callbacks.set(callbackId, callback);
    
    requestAnimationFrame(() => {
      const cb = this.callbacks.get(callbackId);
      if (cb) {
        cb();
        this.callbacks.delete(callbackId);
      }
    });
    
    return callbackId;
  },
  
  cancel(id) {
    this.callbacks.delete(id);
  }
}`,

  `function formatFileSize(bytes) {

  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}`,

  `class ImageLoader {

  constructor() {
    this.cache = new Map();
  }
  
  load(src) {
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src));
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(\`Failed to load image: \${src}\`));
      };
      
      img.src = src;
    });
  }
  
  preload(sources) {
    return Promise.all(sources.map(src => this.load(src)));
  }
}`,

  `function createDeferredPromise() {

  let resolve, reject;
  let settled = false;
  
  const promise = new Promise((res, rej) => {
    resolve = (value) => {
      if (!settled) {
        settled = true;
        res(value);
      }
    };
    
    reject = (error) => {
      if (!settled) {
        settled = true;
        rej(error);
      }
    };
  });
  
  return { promise, resolve, reject };
}`,

  `const cookies = {

  set(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = \`\${name}=\${value};expires=\${expires.toUTCString()};path=/\`;
  },
  
  get(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  
  delete(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}`,

  `function createWorkerFromFunction(fn) {

  const blob = new Blob([
    '(',
    fn.toString(),
    ').call(this);'
  ], { type: 'application/javascript' });
  
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}`,

  `class DataValidator {

  constructor() {
    this.rules = new Map();
  }
  
  addRule(field, validator, message) {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field).push({ validator, message });
  }
  
  validate(data) {
    const errors = {};
    
    for (const [field, rules] of this.rules) {
      const value = data[field];
      
      for (const rule of rules) {
        if (!rule.validator(value)) {
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(rule.message);
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}`,

  `function flattenArray(arr) {

  const result = [];
  
  function flatten(item) {
    if (Array.isArray(item)) {
      item.forEach(flatten);
    } else {
      result.push(item);
    }
  }
  
  flatten(arr);
  return result;
}`,

  `const mediaQuery = {

  matches: new Map(),
  
  add(query, callback) {
    const mql = window.matchMedia(query);
    const handler = (e) => callback(e.matches);
    
    mql.addListener(handler);
    handler(mql);
    
    this.matches.set(query, { mql, handler, callback });
  },
  
  remove(query) {
    const match = this.matches.get(query);
    if (match) {
      match.mql.removeListener(match.handler);
      this.matches.delete(query);
    }
  }
}`,

  `function createChainableAPI(obj) {

  const chain = {};
  
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'function') {
      chain[key] = function(...args) {
        obj[key].apply(obj, args);
        return chain;
      };
    }
  });
  
  return chain;
}`,

  `class PubSub {

  constructor() {
    this.events = {};
  }
  
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    return {
      unsubscribe: () => {
        const index = this.events[event].indexOf(callback);
        if (index > -1) {
          this.events[event].splice(index, 1);
        }
      }
    };
  }
  
  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event callback:', error);
        }
      });
    }
  }
  
  clear(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}`,

  `function createProxy(target, handlers) {

  return new Proxy(target, {
    get(obj, prop) {
      if (handlers.get) {
        return handlers.get(obj, prop);
      }
      return obj[prop];
    },
    
    set(obj, prop, value) {
      if (handlers.set) {
        return handlers.set(obj, prop, value);
      }
      obj[prop] = value;
      return true;
    },
    
    has(obj, prop) {
      if (handlers.has) {
        return handlers.has(obj, prop);
      }
      return prop in obj;
    },
    
    deleteProperty(obj, prop) {
      if (handlers.delete) {
        return handlers.delete(obj, prop);
      }
      delete obj[prop];
      return true;
    }
  });
}`,

  `async function* asyncGenerator(array) {

  for (const item of array) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield item;
  }
}`,

  `function createBatcher(batchSize, processFn) {

  let batch = [];
  let timeout;
  
  return function(item) {
    batch.push(item);
    
    if (batch.length >= batchSize) {
      processFn([...batch]);
      batch = [];
      clearTimeout(timeout);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (batch.length > 0) {
          processFn([...batch]);
          batch = [];
        }
      }, 1000);
    }
  };
}`,

  `class CircularBuffer {

  constructor(size) {
    this.size = size;
    this.buffer = new Array(size);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }
  
  push(item) {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.size;
    
    if (this.count < this.size) {
      this.count++;
    } else {
      this.head = (this.head + 1) % this.size;
    }
  }
  
  toArray() {
    const result = [];
    for (let i = 0; i < this.count; i++) {
      result.push(this.buffer[(this.head + i) % this.size]);
    }
    return result;
  }
  
  get length() {
    return this.count;
  }
}`,

  `function createRateLimiter(maxRequests, windowMs) {

  const requests = [];
  
  return function() {
    const now = Date.now();
    
    while (requests.length > 0 && requests[0] <= now - windowMs) {
      requests.shift();
    }
    
    if (requests.length < maxRequests) {
      requests.push(now);
      return true;
    }
    
    return false;
  };
}`,

  `class WeakCache {

  constructor() {
    this.cache = new WeakMap();
  }
  
  set(key, value) {
    if (typeof key === 'object' && key !== null) {
      this.cache.set(key, value);
    }
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
}`,

  `function createImmutableUpdate(obj) {

  return function(path, value) {
    const keys = path.split('.');
    const result = JSON.parse(JSON.stringify(obj));
    
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  };
}`
];
