export const PYTHON_BLOCKS = [
  `def calculate_average(numbers):

    if not numbers:
        return 0
    total = sum(numbers)
    return total / len(numbers)`,

  `class BankAccount:

    def __init__(self, balance=0):
        self._balance = balance
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if amount <= self._balance:
            self._balance -= amount
            return True
        return False
    
    @property
    def balance(self):
        return self._balance`,

  `try:

    with open('data.json', 'r') as file:
        data = json.load(file)
        process_data(data)
except FileNotFoundError:
    print("File not found")
except json.JSONDecodeError:
    print("Invalid JSON format")
finally:
    print("Cleanup completed")`,

  `def fibonacci_generator(n):

    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b`,

  `import asyncio

async def fetch_data(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def main():
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks)
    return results`,

  `class DataProcessor:

    def __init__(self, data):
        self.data = data
        self.processed = []
    
    def filter_data(self, condition):
        return [item for item in self.data if condition(item)]
    
    def transform_data(self, transformer):
        return [transformer(item) for item in self.data]
    
    def reduce_data(self, reducer, initial=None):
        from functools import reduce
        return reduce(reducer, self.data, initial)`,

  `def decorator_with_args(prefix=""):

    def decorator(func):
        def wrapper(*args, **kwargs):
            print(f"{prefix} Calling {func.__name__}")
            result = func(*args, **kwargs)
            print(f"{prefix} Finished {func.__name__}")
            return result
        return wrapper
    return decorator

@decorator_with_args("DEBUG")
def process_data(data):
    return len(data)`,

  `from dataclasses import dataclass
from typing import List, Optional

@dataclass
class User:
    name: str
    email: str
    age: int
    is_active: bool = True
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []`,

  `def context_manager_example():

    from contextlib import contextmanager
    
    @contextmanager
    def database_transaction():
        print("Starting transaction")
        try:
            yield "connection"
            print("Committing transaction")
        except Exception:
            print("Rolling back transaction")
            raise
        finally:
            print("Closing connection")`,

  `import threading
import time

class ThreadSafeCounter:

    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()
    
    def increment(self):
        with self._lock:
            self._value += 1
    
    def decrement(self):
        with self._lock:
            self._value -= 1
    
    @property
    def value(self):
        with self._lock:
            return self._value`,

  `def memoize(func):

    cache = {}
    
    def wrapper(*args, **kwargs):
        key = str(args) + str(sorted(kwargs.items()))
        
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        
        return cache[key]
    
    return wrapper

@memoize
def expensive_function(n):
    time.sleep(1)
    return n * n`,

  `class SingletonMeta(type):

    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class DatabaseConnection(metaclass=SingletonMeta):
    
    def __init__(self):
        self.connection = None
    
    def connect(self):
        if not self.connection:
            self.connection = "database_connection"`,

  `def validate_data(data, schema):

    errors = []
    
    for field, rules in schema.items():
        if field not in data:
            if rules.get('required', False):
                errors.append(f"Field '{field}' is required")
            continue
        
        value = data[field]
        
        if 'type' in rules and not isinstance(value, rules['type']):
            errors.append(f"Field '{field}' must be of type {rules['type'].__name__}")
        
        if 'min_length' in rules and len(value) < rules['min_length']:
            errors.append(f"Field '{field}' must be at least {rules['min_length']} characters")
    
    return errors`,

  `import logging
from functools import wraps

def log_function_calls(logger):

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
            try:
                result = func(*args, **kwargs)
                logger.info(f"{func.__name__} returned: {result}")
                return result
            except Exception as e:
                logger.error(f"{func.__name__} raised {type(e).__name__}: {e}")
                raise
        return wrapper
    return decorator`,

  `class EventEmitter:

    def __init__(self):
        self._events = {}
    
    def on(self, event, callback):
        if event not in self._events:
            self._events[event] = []
        self._events[event].append(callback)
    
    def emit(self, event, *args, **kwargs):
        if event in self._events:
            for callback in self._events[event]:
                try:
                    callback(*args, **kwargs)
                except Exception as e:
                    print(f"Error in event callback: {e}")
    
    def off(self, event, callback=None):
        if event in self._events:
            if callback:
                self._events[event].remove(callback)
            else:
                del self._events[event]`,

  `def retry_with_backoff(max_retries=3, backoff_factor=2):

    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    
                    wait_time = backoff_factor ** attempt
                    print(f"Attempt {attempt + 1} failed, retrying in {wait_time}s...")
                    time.sleep(wait_time)
        
        return wrapper
    return decorator`,

  `class ConfigManager:

    def __init__(self, config_file):
        self.config_file = config_file
        self._config = {}
        self.load_config()
    
    def load_config(self):
        try:
            with open(self.config_file, 'r') as f:
                self._config = json.load(f)
        except FileNotFoundError:
            print(f"Config file {self.config_file} not found")
    
    def get(self, key, default=None):
        keys = key.split('.')
        value = self._config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def set(self, key, value):
        keys = key.split('.')
        config = self._config
        
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        
        config[keys[-1]] = value`,

  `from abc import ABC, abstractmethod

class Animal(ABC):

    def __init__(self, name):
        self.name = name
    
    @abstractmethod
    def make_sound(self):
        pass
    
    @abstractmethod
    def move(self):
        pass

class Dog(Animal):
    
    def make_sound(self):
        return "Woof!"
    
    def move(self):
        return "Running on four legs"

class Bird(Animal):
    
    def make_sound(self):
        return "Tweet!"
    
    def move(self):
        return "Flying in the sky"`,

  `def process_csv_file(filename):

    import csv
    
    with open(filename, 'r', newline='') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            yield {
                'name': row['name'].strip().title(),
                'age': int(row['age']) if row['age'].isdigit() else None,
                'email': row['email'].lower().strip()
            }`,

  `@app.route('/api/users/<int:user_id>')

def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email
    })`,

  `class TaskQueue:

    def __init__(self):
        self.queue = []
        self.workers = []
        self.running = False
    
    def add_task(self, func, *args, **kwargs):
        self.queue.append((func, args, kwargs))
    
    def start_workers(self, num_workers=3):
        import threading
        
        self.running = True
        
        for _ in range(num_workers):
            worker = threading.Thread(target=self._worker)
            worker.daemon = True
            worker.start()
            self.workers.append(worker)
    
    def _worker(self):
        while self.running:
            if self.queue:
                func, args, kwargs = self.queue.pop(0)
                try:
                    func(*args, **kwargs)
                except Exception as e:
                    print(f"Task failed: {e}")
            else:
                time.sleep(0.1)`,

  `def create_property_decorator():

    def property_decorator(func):
        class PropertyDescriptor:
            def __init__(self, getter):
                self.getter = getter
                self.setter = None
                self.deleter = None
            
            def __get__(self, obj, objtype=None):
                if obj is None:
                    return self
                return self.getter(obj)
            
            def __set__(self, obj, value):
                if self.setter is None:
                    raise AttributeError("can't set attribute")
                self.setter(obj, value)
            
            def __delete__(self, obj):
                if self.deleter is None:
                    raise AttributeError("can't delete attribute")
                self.deleter(obj)
            
            def setter(self, func):
                self.setter = func
                return self
            
            def deleter(self, func):
                self.deleter = func
                return self
        
        return PropertyDescriptor(func)
    
    return property_decorator`,

  `import sqlite3

class DatabaseManager:

    def __init__(self, db_path):
        self.db_path = db_path
        self.connection = None
    
    def __enter__(self):
        self.connection = sqlite3.connect(self.db_path)
        self.connection.row_factory = sqlite3.Row
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            if exc_type is None:
                self.connection.commit()
            else:
                self.connection.rollback()
            self.connection.close()
    
    def execute(self, query, params=None):
        params = params or []
        return self.connection.execute(query, params)
    
    def fetchone(self, query, params=None):
        cursor = self.execute(query, params)
        return cursor.fetchone()
    
    def fetchall(self, query, params=None):
        cursor = self.execute(query, params)
        return cursor.fetchall()`,

  `from collections import namedtuple, deque
from enum import Enum

class Priority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3

Task = namedtuple('Task', ['id', 'name', 'priority', 'timestamp'])

class PriorityQueue:

    def __init__(self):
        self._queues = {
            Priority.HIGH: deque(),
            Priority.NORMAL: deque(),
            Priority.LOW: deque()
        }
    
    def add(self, task):
        self._queues[task.priority].append(task)
    
    def get_next(self):
        for priority in [Priority.HIGH, Priority.NORMAL, Priority.LOW]:
            if self._queues[priority]:
                return self._queues[priority].popleft()
        return None`,

  `def create_pipeline(*functions):

    def pipeline(data):
        result = data
        for func in functions:
            result = func(result)
        return result
    
    return pipeline

def add_one(x):
    return x + 1

def multiply_by_two(x):
    return x * 2

def square(x):
    return x ** 2

process = create_pipeline(add_one, multiply_by_two, square)`,

  `import weakref

class Observer:

    def __init__(self):
        self._observers = weakref.WeakSet()
    
    def attach(self, observer):
        self._observers.add(observer)
    
    def detach(self, observer):
        self._observers.discard(observer)
    
    def notify(self, *args, **kwargs):
        for observer in self._observers:
            try:
                observer.update(*args, **kwargs)
            except Exception as e:
                print(f"Error notifying observer: {e}")

class ConcreteObserver:
    
    def __init__(self, name):
        self.name = name
    
    def update(self, message):
        print(f"{self.name} received: {message}")`,

  `def create_state_machine(states, initial_state):

    current_state = initial_state
    
    def transition(event):
        nonlocal current_state
        
        if current_state in states and event in states[current_state]:
            old_state = current_state
            current_state = states[current_state][event]
            print(f"Transitioned from {old_state} to {current_state}")
            return True
        else:
            print(f"Invalid transition: {event} from {current_state}")
            return False
    
    def get_current_state():
        return current_state
    
    return transition, get_current_state`,

  `class ResourcePool:

    def __init__(self, create_resource, max_size=10):
        self.create_resource = create_resource
        self.max_size = max_size
        self.pool = []
        self.in_use = set()
        self._lock = threading.Lock()
    
    def acquire(self):
        with self._lock:
            if self.pool:
                resource = self.pool.pop()
            elif len(self.in_use) < self.max_size:
                resource = self.create_resource()
            else:
                raise Exception("Resource pool exhausted")
            
            self.in_use.add(resource)
            return resource
    
    def release(self, resource):
        with self._lock:
            if resource in self.in_use:
                self.in_use.remove(resource)
                self.pool.append(resource)`,

  `from contextlib import contextmanager
import tempfile
import os

@contextmanager
def temporary_file(suffix='', prefix='tmp'):

    fd, path = tempfile.mkstemp(suffix=suffix, prefix=prefix)
    try:
        with os.fdopen(fd, 'w') as f:
            yield f, path
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass`,

  `def create_cache_decorator(max_size=128):

    from functools import wraps
    from collections import OrderedDict
    
    def decorator(func):
        cache = OrderedDict()
        
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(sorted(kwargs.items()))
            
            if key in cache:
                cache.move_to_end(key)
                return cache[key]
            
            result = func(*args, **kwargs)
            cache[key] = result
            
            if len(cache) > max_size:
                cache.popitem(last=False)
            
            return result
        
        wrapper.cache = cache
        wrapper.cache_clear = lambda: cache.clear()
        return wrapper
    
    return decorator`,

  `class CommandPattern:

    def __init__(self):
        self.history = []
        self.current = -1
    
    def execute(self, command):
        self.history = self.history[:self.current + 1]
        
        command.execute()
        self.history.append(command)
        self.current += 1
    
    def undo(self):
        if self.current >= 0:
            command = self.history[self.current]
            command.undo()
            self.current -= 1
    
    def redo(self):
        if self.current < len(self.history) - 1:
            self.current += 1
            command = self.history[self.current]
            command.execute()

class Command:
    
    def execute(self):
        raise NotImplementedError
    
    def undo(self):
        raise NotImplementedError`,

  `import pickle
import os

class PersistentDict:

    def __init__(self, filename):
        self.filename = filename
        self._data = {}
        self.load()
    
    def load(self):
        if os.path.exists(self.filename):
            try:
                with open(self.filename, 'rb') as f:
                    self._data = pickle.load(f)
            except Exception as e:
                print(f"Error loading data: {e}")
    
    def save(self):
        try:
            with open(self.filename, 'wb') as f:
                pickle.dump(self._data, f)
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def __getitem__(self, key):
        return self._data[key]
    
    def __setitem__(self, key, value):
        self._data[key] = value
        self.save()
    
    def __delitem__(self, key):
        del self._data[key]
        self.save()
    
    def __contains__(self, key):
        return key in self._data`,

  `def create_rate_limiter(max_calls, time_window):

    import time
    from collections import deque
    
    calls = deque()
    
    def rate_limited_function(func):
        def wrapper(*args, **kwargs):
            now = time.time()
            
            while calls and calls[0] <= now - time_window:
                calls.popleft()
            
            if len(calls) >= max_calls:
                raise Exception("Rate limit exceeded")
            
            calls.append(now)
            return func(*args, **kwargs)
        
        return wrapper
    
    return rate_limited_function`,

  `class LazyProperty:

    def __init__(self, func):
        self.func = func
        self.name = func.__name__
    
    def __get__(self, obj, cls):
        if obj is None:
            return self
        
        value = self.func(obj)
        setattr(obj, self.name, value)
        return value

class Example:
    
    @LazyProperty
    def expensive_computation(self):
        print("Computing expensive value...")
        time.sleep(1)
        return sum(range(1000000))`,

  `def create_fluent_interface(obj):

    class FluentWrapper:
        
        def __init__(self, wrapped):
            self._wrapped = wrapped
        
        def __getattr__(self, name):
            attr = getattr(self._wrapped, name)
            
            if callable(attr):
                def wrapper(*args, **kwargs):
                    result = attr(*args, **kwargs)
                    if result is None:
                        return self
                    return result
                return wrapper
            
            return attr
    
    return FluentWrapper(obj)`,

  `import asyncio
from typing import AsyncGenerator

async def async_batch_processor(items, batch_size=10):

    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        
        tasks = [process_item(item) for item in batch]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for item, result in zip(batch, results):
            if isinstance(result, Exception):
                print(f"Error processing {item}: {result}")
            else:
                yield result

async def process_item(item):
    await asyncio.sleep(0.1)  # Simulate async work
    return item * 2`,

  `class Builder:

    def __init__(self):
        self._product = {}
    
    def set_property(self, key, value):
        self._product[key] = value
        return self
    
    def add_component(self, name, component):
        if 'components' not in self._product:
            self._product['components'] = {}
        self._product['components'][name] = component
        return self
    
    def configure(self, config_dict):
        self._product.update(config_dict)
        return self
    
    def build(self):
        product = self._product.copy()
        self._product = {}  # Reset for next build
        return product`,

  `def measure_performance(func):

    import functools
    import time
    
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        memory_before = get_memory_usage()
        
        try:
            result = func(*args, **kwargs)
        finally:
            end_time = time.perf_counter()
            memory_after = get_memory_usage()
            
            execution_time = end_time - start_time
            memory_used = memory_after - memory_before
            
            print(f"{func.__name__}:")
            print(f"  Execution time: {execution_time:.6f} seconds")
            print(f"  Memory used: {memory_used} MB")
        
        return result
    
    return wrapper

def get_memory_usage():
    import psutil
    import os
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024`,

  `from itertools import chain, combinations

def powerset(iterable):

    s = list(iterable)
    return chain.from_iterable(
        combinations(s, r) for r in range(len(s) + 1)
    )

def partition(collection, condition):
    
    true_items = []
    false_items = []
    
    for item in collection:
        if condition(item):
            true_items.append(item)
        else:
            false_items.append(item)
    
    return true_items, false_items

def chunk(iterable, size):
    
    iterator = iter(iterable)
    while True:
        chunk = list(itertools.islice(iterator, size))
        if not chunk:
            break
        yield chunk`,

  `class StateMachine:

    def __init__(self, initial_state):
        self.state = initial_state
        self.transitions = {}
        self.handlers = {}
    
    def add_transition(self, from_state, to_state, trigger):
        key = (from_state, trigger)
        self.transitions[key] = to_state
    
    def add_handler(self, state, handler):
        self.handlers[state] = handler
    
    def trigger(self, event):
        key = (self.state, event)
        
        if key in self.transitions:
            old_state = self.state
            self.state = self.transitions[key]
            
            if self.state in self.handlers:
                self.handlers[self.state](old_state, self.state, event)
            
            return True
        
        return False
    
    def get_state(self):
        return self.state`,

  `def create_dependency_injector():

    registry = {}
    
    def register(name, factory, singleton=False):
        registry[name] = {
            'factory': factory,
            'singleton': singleton,
            'instance': None
        }
    
    def resolve(name):
        if name not in registry:
            raise ValueError(f"Service '{name}' not registered")
        
        service = registry[name]
        
        if service['singleton']:
            if service['instance'] is None:
                service['instance'] = service['factory']()
            return service['instance']
        else:
            return service['factory']()
    
    def inject(func):
        import inspect
        
        def wrapper(*args, **kwargs):
            sig = inspect.signature(func)
            
            for param_name, param in sig.parameters.items():
                if param_name not in kwargs and param_name in registry:
                    kwargs[param_name] = resolve(param_name)
            
            return func(*args, **kwargs)
        
        return wrapper
    
    return register, resolve, inject`,

  `class CircuitBreaker:

    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            
            if self.state == 'HALF_OPEN':
                self.state = 'CLOSED'
                self.failure_count = 0
            
            return result
        
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = 'OPEN'
            
            raise e`,

  `def create_middleware_pipeline():

    middlewares = []
    
    def add_middleware(middleware):
        middlewares.append(middleware)
    
    def execute(context):
        def run_next(index):
            if index >= len(middlewares):
                return context
            
            middleware = middlewares[index]
            return middleware(context, lambda: run_next(index + 1))
        
        return run_next(0)
    
    return add_middleware, execute

def logging_middleware(context, next_func):
    print(f"Before: {context}")
    result = next_func()
    print(f"After: {result}")
    return result`,

  `import hashlib
import json

class HashableDict(dict):

    def __hash__(self):
        return hash(json.dumps(self, sort_keys=True))
    
    def __eq__(self, other):
        return dict.__eq__(self, other)

class ContentHashCache:
    
    def __init__(self):
        self._cache = {}
    
    def get(self, content):
        content_hash = hashlib.md5(
            json.dumps(content, sort_keys=True).encode()
        ).hexdigest()
        
        return self._cache.get(content_hash)
    
    def set(self, content, value):
        content_hash = hashlib.md5(
            json.dumps(content, sort_keys=True).encode()
        ).hexdigest()
        
        self._cache[content_hash] = value
    
    def clear(self):
        self._cache.clear()`,

  `def create_event_loop():

    import heapq
    import time
    
    events = []
    running = False
    
    def schedule(delay, callback, *args):
        run_time = time.time() + delay
        heapq.heappush(events, (run_time, callback, args))
    
    def run():
        nonlocal running
        running = True
        
        while running and events:
            run_time, callback, args = heapq.heappop(events)
            
            now = time.time()
            if run_time <= now:
                try:
                    callback(*args)
                except Exception as e:
                    print(f"Error in event callback: {e}")
            else:
                heapq.heappush(events, (run_time, callback, args))
                time.sleep(min(0.01, run_time - now))
    
    def stop():
        nonlocal running
        running = False
    
    return schedule, run, stop`
];
