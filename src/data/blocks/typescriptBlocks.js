export const TYPESCRIPT_BLOCKS = [
  `interface UserData {

  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function getUser(id: number): Promise<UserData> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}`,

  `type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function parseJSON<T>(input: string): Result<T> {
  try {
    return { success: true, data: JSON.parse(input) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}`,

  `enum Status {

  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

interface Task {
  id: string;
  title: string;
  status: Status;
  assignee?: string;
  dueDate: Date;
}

const updateTaskStatus = (task: Task, newStatus: Status): Task => {
  return { ...task, status: newStatus };
};`,

  `type EventHandler<T = any> = (event: T) => void;

interface EventEmitter<T extends Record<string, any> = {}> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

class TypedEventEmitter<T extends Record<string, any> = {}> implements EventEmitter<T> {
  private handlers = new Map<keyof T, Set<EventHandler>>();

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }
}`,

  `interface Repository<T> {

  findById(id: string): Promise<T | null>;
  findAll(filters?: Partial<T>): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  private data = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async findAll(filters?: Partial<T>): Promise<T[]> {
    const items = Array.from(this.data.values());
    
    if (!filters) return items;
    
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => 
        item[key as keyof T] === value
      );
    });
  }

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = Math.random().toString(36);
    const newEntity = { ...entity, id } as T;
    this.data.set(id, newEntity);
    return newEntity;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const existing = this.data.get(id);
    if (!existing) throw new Error('Entity not found');
    
    const updated = { ...existing, ...updates };
    this.data.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }
}`,

  `type ApiResponse<T> = {

  data: T;
  status: number;
  message: string;
};

interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

class FetchHttpClient implements HttpClient {
  constructor(private baseURL: string, private defaultConfig?: RequestConfig) {}

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  private async request<T>(
    method: string, 
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const fullUrl = \`\${this.baseURL}\${url}\`;
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...mergedConfig.headers
      },
      body: data ? JSON.stringify(data) : undefined
    });

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status,
      message: response.statusText
    };
  }
}`,

  `abstract class Shape {

  abstract area(): number;
  abstract perimeter(): number;
  
  protected abstract getName(): string;
  
  describe(): string {
    return \`\${this.getName()}: Area = \${this.area()}, Perimeter = \${this.perimeter()}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  protected getName(): string {
    return 'Circle';
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }

  protected getName(): string {
    return 'Rectangle';
  }
}`,

  `type DeepPartial<T> = {

  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type Flatten<T> = T extends (infer U)[] ? U : T;

type NonNullable<T> = T extends null | undefined ? never : T;

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

type StringKeys = KeysOfType<User, string>;
type NumberKeys = KeysOfType<User, number>;
type PartialUser = DeepPartial<User>;
type ReadonlyUser = DeepReadonly<User>;`,

  `interface Validator<T> {

  validate(value: unknown): value is T;
  getErrors(value: unknown): string[];
}

class StringValidator implements Validator<string> {
  constructor(
    private minLength?: number,
    private maxLength?: number,
    private pattern?: RegExp
  ) {}

  validate(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    
    if (this.minLength && value.length < this.minLength) return false;
    if (this.maxLength && value.length > this.maxLength) return false;
    if (this.pattern && !this.pattern.test(value)) return false;
    
    return true;
  }

  getErrors(value: unknown): string[] {
    const errors: string[] = [];
    
    if (typeof value !== 'string') {
      errors.push('Value must be a string');
      return errors;
    }
    
    if (this.minLength && value.length < this.minLength) {
      errors.push(\`String must be at least \${this.minLength} characters\`);
    }
    
    if (this.maxLength && value.length > this.maxLength) {
      errors.push(\`String must be no more than \${this.maxLength} characters\`);
    }
    
    if (this.pattern && !this.pattern.test(value)) {
      errors.push('String does not match required pattern');
    }
    
    return errors;
  }
}`,

  `type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
    
    getAge(): number {
      return Date.now() - this.timestamp;
    }
  };
}

function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }
    
    static deserialize<T>(this: Constructor<T>, json: string): T {
      return Object.assign(new this(), JSON.parse(json));
    }
  };
}

class User {
  constructor(public name: string, public email: string) {}
}

const TimestampedUser = Timestamped(User);
const SerializableTimestampedUser = Serializable(Timestamped(User));

const user = new SerializableTimestampedUser('John', 'john@example.com');`,

  `namespace Database {

  export interface Connection {
    query<T>(sql: string, params?: any[]): Promise<T[]>;
    close(): Promise<void>;
  }

  export interface Transaction extends Connection {
    commit(): Promise<void>;
    rollback(): Promise<void>;
  }

  export class PostgreSQLConnection implements Connection {
    constructor(private connectionString: string) {}

    async query<T>(sql: string, params?: any[]): Promise<T[]> {
      console.log(\`Executing: \${sql}\`, params);
      return [] as T[];
    }

    async close(): Promise<void> {
      console.log('Closing PostgreSQL connection');
    }

    async beginTransaction(): Promise<Transaction> {
      return new PostgreSQLTransaction(this);
    }
  }

  class PostgreSQLTransaction implements Transaction {
    constructor(private connection: PostgreSQLConnection) {}

    async query<T>(sql: string, params?: any[]): Promise<T[]> {
      return this.connection.query<T>(sql, params);
    }

    async commit(): Promise<void> {
      console.log('Committing transaction');
    }

    async rollback(): Promise<void> {
      console.log('Rolling back transaction');
    }

    async close(): Promise<void> {
      await this.connection.close();
    }
  }

  export const createConnection = (connectionString: string): Connection => {
    return new PostgreSQLConnection(connectionString);
  };
}`,

  `interface Observer<T> {

  update(data: T): void;
}

interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

class Observable<T> implements Subject<T> {
  private observers: Set<Observer<T>> = new Set();

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => {
      try {
        observer.update(data);
      } catch (error) {
        console.error('Error notifying observer:', error);
      }
    });
  }
}

class DataService extends Observable<{ action: string; data: any }> {
  private data = new Map<string, any>();

  set(key: string, value: any): void {
    this.data.set(key, value);
    this.notify({ action: 'set', data: { key, value } });
  }

  get(key: string): any {
    return this.data.get(key);
  }

  delete(key: string): void {
    this.data.delete(key);
    this.notify({ action: 'delete', data: { key } });
  }
}`,

  `type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

interface RetryOptions {
  maxAttempts: number;
  delay: number;
  exponentialBackoff: boolean;
}

function withRetry<T extends any[], R>(
  fn: AsyncFunction<T, R>,
  options: RetryOptions
): AsyncFunction<T, R> {
  return async (...args: T): Promise<R> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === options.maxAttempts) {
          break;
        }
        
        const delay = options.exponentialBackoff 
          ? options.delay * Math.pow(2, attempt - 1)
          : options.delay;
          
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  };
}

const fetchWithRetry = withRetry(
  async (url: string): Promise<Response> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    return response;
  },
  {
    maxAttempts: 3,
    delay: 1000,
    exponentialBackoff: true
  }
);`,

  `class StateManager<T extends Record<string, any>> {

  private state: T;
  private listeners = new Set<(state: T) => void>();

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  getState(): Readonly<T> {
    return { ...this.state };
  }

  setState(updates: Partial<T> | ((prevState: T) => Partial<T>)): void {
    const newUpdates = typeof updates === 'function' 
      ? updates(this.state) 
      : updates;
      
    this.state = { ...this.state, ...newUpdates };
    this.notifyListeners();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }
}

interface AppState {
  user: { id: number; name: string } | null;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

const stateManager = new StateManager<AppState>({
  user: null,
  isLoading: false,
  error: null,
  theme: 'light'
});`,

  `type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

class TypeSafeEventEmitter<T extends EventMap> implements Emitter<T> {
  private events: {
    [K in keyof T]?: Set<EventReceiver<T[K]>>
  } = {};

  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = new Set();
    }
    this.events[eventName]!.add(fn);
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
    this.events[eventName]?.delete(fn);
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void {
    this.events[eventName]?.forEach(fn => {
      try {
        fn(params);
      } catch (error) {
        console.error(\`Error in event handler for \${eventName}:\`, error);
      }
    });
  }
}

interface MyEvents {
  userLoggedIn: { userId: number; timestamp: Date };
  dataUpdated: { entityType: string; entityId: string };
  errorOccurred: { message: string; code: number };
}

const eventEmitter = new TypeSafeEventEmitter<MyEvents>();`,

  `interface Command<TResult = void> {

  execute(): Promise<TResult>;
  canExecute(): boolean;
}

interface UndoableCommand<TResult = void> extends Command<TResult> {
  undo(): Promise<void>;
}

class CommandInvoker {
  private history: UndoableCommand[] = [];
  private currentIndex = -1;

  async executeCommand<T>(command: Command<T>): Promise<T> {
    if (!command.canExecute()) {
      throw new Error('Command cannot be executed');
    }

    const result = await command.execute();

    if (this.isUndoableCommand(command)) {
      this.history = this.history.slice(0, this.currentIndex + 1);
      this.history.push(command);
      this.currentIndex++;
    }

    return result;
  }

  async undo(): Promise<void> {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      await command.undo();
      this.currentIndex--;
    }
  }

  async redo(): Promise<void> {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      await command.execute();
    }
  }

  private isUndoableCommand(command: Command): command is UndoableCommand {
    return 'undo' in command;
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clearHistory(): void {
    this.history = [];
    this.currentIndex = -1;
  }
}`,

  `type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, 'UserId'>;
type ProductId = Brand<string, 'ProductId'>;
type Email = Brand<string, 'Email'>;

const createUserId = (id: number): UserId => id as UserId;
const createProductId = (id: string): ProductId => id as ProductId;
const createEmail = (email: string): Email => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  return email as Email;
};

interface User {
  id: UserId;
  email: Email;
  name: string;
}

interface Product {
  id: ProductId;
  name: string;
  price: number;
}

interface Order {
  id: string;
  userId: UserId;
  productIds: ProductId[];
  total: number;
}

class OrderService {
  createOrder(userId: UserId, productIds: ProductId[]): Order {
    return {
      id: Math.random().toString(36),
      userId,
      productIds,
      total: 0
    };
  }

  getUserOrders(userId: UserId): Order[] {
    return [];
  }
}`,

  `type APIEndpoint<TParams = {}, TResponse = unknown> = {

  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  params?: TParams;
  response: TResponse;
};

type ExtractParams<T> = T extends APIEndpoint<infer P, any> ? P : never;
type ExtractResponse<T> = T extends APIEndpoint<any, infer R> ? R : never;

const API = {
  getUser: {
    method: 'GET',
    url: '/api/users/:id',
    params: {} as { id: string },
    response: {} as { id: string; name: string; email: string }
  },
  createUser: {
    method: 'POST',
    url: '/api/users',
    params: {} as { name: string; email: string },
    response: {} as { id: string; name: string; email: string }
  },
  updateUser: {
    method: 'PUT',
    url: '/api/users/:id',
    params: {} as { id: string; name?: string; email?: string },
    response: {} as { id: string; name: string; email: string }
  }
} as const;

class APIClient {
  async request<T extends keyof typeof API>(
    endpoint: T,
    params: ExtractParams<typeof API[T]>
  ): Promise<ExtractResponse<typeof API[T]>> {
    const config = API[endpoint];
    const url = this.buildURL(config.url, params);
    
    const response = await fetch(url, {
      method: config.method,
      headers: { 'Content-Type': 'application/json' },
      body: config.method !== 'GET' ? JSON.stringify(params) : undefined
    });

    return response.json();
  }

  private buildURL(template: string, params: any): string {
    let url = template;
    
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(\`:\${key}\`)) {
        url = url.replace(\`:\${key}\`, String(value));
        delete params[key];
      }
    });
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    
    return url;
  }
}`,

  `type Middleware<TContext> = (

  context: TContext,
  next: () => Promise<void>
) => Promise<void>;

class Pipeline<TContext> {
  private middlewares: Middleware<TContext>[] = [];

  use(middleware: Middleware<TContext>): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(context: TContext): Promise<void> {
    let index = 0;

    const dispatch = async (): Promise<void> => {
      if (index >= this.middlewares.length) {
        return;
      }

      const middleware = this.middlewares[index++];
      return middleware(context, dispatch);
    };

    return dispatch();
  }
}

interface HttpContext {
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body?: any;
  };
  state: Record<string, any>;
}

const pipeline = new Pipeline<HttpContext>();

pipeline
  .use(async (ctx, next) => {
    console.log(\`\${ctx.request.method} \${ctx.request.url}\`);
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    console.log(\`Request completed in \${duration}ms\`);
  })
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: 'Internal Server Error' };
    }
  })
  .use(async (ctx, next) => {
    if (ctx.request.headers['authorization']) {
      ctx.state.user = { id: 1, name: 'User' };
    }
    await next();
  });`,

  `interface Factory<T> {

  create(...args: any[]): T;
}

interface Singleton<T> {
  getInstance(): T;
}

class ServiceContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, Factory<any>>();
  private singletons = new Map<string, any>();

  register<T>(name: string, factory: Factory<T>): void {
    this.factories.set(name, factory);
  }

  registerSingleton<T>(name: string, factory: Factory<T>): void {
    this.factories.set(name, factory);
    this.services.set(name, 'singleton');
  }

  registerInstance<T>(name: string, instance: T): void {
    this.singletons.set(name, instance);
  }

  resolve<T>(name: string, ...args: any[]): T {
    if (this.singletons.has(name)) {
      return this.singletons.get(name) as T;
    }

    if (this.services.get(name) === 'singleton') {
      if (!this.singletons.has(name)) {
        const factory = this.factories.get(name)!;
        this.singletons.set(name, factory.create(...args));
      }
      return this.singletons.get(name) as T;
    }

    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(\`Service '\${name}' not found\`);
    }

    return factory.create(...args);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }
}

class DatabaseFactory implements Factory<Database.Connection> {
  create(connectionString: string): Database.Connection {
    return new Database.PostgreSQLConnection(connectionString);
  }
}

const container = new ServiceContainer();
container.registerSingleton('database', new DatabaseFactory());`,

  `type OptionalKeys<T> = {

  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

interface BaseConfig {
  apiUrl: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

interface DatabaseConfig {
  host: string;
  port?: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
}

type ConfigBuilder<T> = {
  [K in keyof T]: (value: T[K]) => ConfigBuilder<T>;
} & {
  build(): T;
};

function createConfigBuilder<T>(): ConfigBuilder<Partial<T>> {
  let config: Partial<T> = {};

  const builder = new Proxy({} as ConfigBuilder<Partial<T>>, {
    get(target, prop) {
      if (prop === 'build') {
        return () => config;
      }

      return (value: any) => {
        config = { ...config, [prop]: value };
        return builder;
      };
    }
  });

  return builder;
}

const dbConfig = createConfigBuilder<DatabaseConfig>()
  .host('localhost')
  .port(5432)
  .username('user')
  .password('pass')
  .database('mydb')
  .ssl(true)
  .build();`
];
