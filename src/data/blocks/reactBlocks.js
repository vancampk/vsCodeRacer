export const REACT_BLOCKS = [
  `function TodoItem({ todo, onToggle }) {

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
    </div>
  );
}`,

  `const [state, setState] = useState({

  loading: false,
  data: null,
  error: null
});

useEffect(() => {
  setState(prev => ({ ...prev, loading: true }));
  
  fetchData()
    .then(data => setState(prev => ({ ...prev, data, loading: false })))
    .catch(error => setState(prev => ({ ...prev, error, loading: false })));
}, []);`,

  `function UserProfile({ userId }) {

  const { data: user, error, isLoading } = useSWR(
    \`/api/users/\${userId}\`,
    fetcher
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`,

  `const UserContext = createContext();

export function UserProvider({ children }) {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}`,

  `function SearchableList({ items, renderItem }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  return (
    <div className="searchable-list">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="list-container">
        {filteredItems.map((item, index) => (
          <div key={item.id || index}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}`,

  `const useCounter = (initialValue = 0) => {

  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value) => {
    setCount(value);
  }, []);

  return { count, increment, decrement, reset, setValue };
};`,

  `function Modal({ isOpen, onClose, title, children }) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}`,

  `function InfiniteScrollList({ loadMore, hasMore, loading }) {

  const [items, setItems] = useState([]);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="infinite-scroll-list">
      {items.map(item => (
        <div key={item.id} className="list-item">
          {item.content}
        </div>
      ))}
      {hasMore && (
        <div ref={observerTarget} className="loading-trigger">
          {loading ? <Spinner /> : 'Load more...'}
        </div>
      )}
    </div>
  );
}`,

  `const FormProvider = ({ children, onSubmit }) => {

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validateField = useCallback((name, value, rules) => {
    let error = null;

    if (rules.required && (!value || value.trim() === '')) {
      error = \`\${name} is required\`;
    } else if (rules.minLength && value.length < rules.minLength) {
      error = \`\${name} must be at least \${rules.minLength} characters\`;
    } else if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email address';
    }

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    return !error;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateField,
    handleSubmit
  };

  return (
    <FormContext.Provider value={value}>
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};`,

  `function DataTable({ columns, data, sortable = true }) {

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(column => (
            <th
              key={column.key}
              onClick={sortable ? () => handleSort(column.key) : undefined}
              className={sortable ? 'sortable' : ''}
            >
              {column.label}
              {sortConfig.key === column.key && (
                <span className="sort-indicator">
                  {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index}>
            {columns.map(column => (
              <td key={column.key}>
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,

  `const useAsync = (asyncFunction, dependencies = []) => {

  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFunction();
        
        if (!cancelled) {
          setState({
            data: result,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error.message
          });
        }
      }
    };

    execute();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return state;
};`,

  `function VirtualizedList({ items, itemHeight, containerHeight, renderItem }) {

  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      className="virtual-list-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
              className="virtual-list-item"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,

  `const useDebounce = (value, delay) => {

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function SearchComponent() {
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}`,

  `function ErrorBoundary({ children, fallback }) {

  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (event) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback ? fallback(error) : (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <details>
          {error && error.toString()}
        </details>
      </div>
    );
  }

  return children;
}`,

  `const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    toggleTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};`,

  `function LazyImage({ src, alt, placeholder, ...props }) {

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="lazy-image-container" {...props}>
      {isInView && (
        <>
          {!isLoaded && placeholder && (
            <div className="image-placeholder">{placeholder}</div>
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            style={{ opacity: isLoaded ? 1 : 0 }}
            className="lazy-image"
          />
        </>
      )}
    </div>
  );
}`,

  `const useLocalStorage = (key, initialValue) => {

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(\`Error removing localStorage key "\${key}":\`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};`,

  `function DragAndDrop({ onDrop, children, allowedTypes = [] }) {

  const [isDragOver, setIsDragOver] = useState(false);
  const dropRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dropRef.current.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (allowedTypes.length > 0) {
      const validFiles = files.filter(file =>
        allowedTypes.includes(file.type)
      );
      
      if (validFiles.length !== files.length) {
        console.warn('Some files were filtered out due to type restrictions');
      }
      
      onDrop(validFiles);
    } else {
      onDrop(files);
    }
  };

  return (
    <div
      ref={dropRef}
      className={\`drop-zone \${isDragOver ? 'drag-over' : ''}\`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragOver && (
        <div className="drop-overlay">
          Drop files here
        </div>
      )}
    </div>
  );
}`,

  `function AutoComplete({ suggestions, onSelect, placeholder }) {

  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef();
  const suggestionRefs = useRef([]);

  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        selectSuggestion(filteredSuggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const selectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    onSelect(suggestion);
  };

  return (
    <div className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="autocomplete-input"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={el => suggestionRefs.current[index] = el}
              className={\`suggestion-item \${index === activeSuggestion ? 'active' : ''}\`}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,

  `const useWebSocket = (url) => {

  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setReadyState(WebSocket.OPEN);
    };

    ws.onclose = () => {
      setReadyState(WebSocket.CLOSED);
    };

    ws.onerror = () => {
      setReadyState(WebSocket.CLOSED);
    };

    ws.onmessage = (event) => {
      setLastMessage({
        data: event.data,
        timestamp: Date.now()
      });
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (socket && readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, readyState]);

  return {
    socket,
    lastMessage,
    readyState,
    sendMessage
  };
};`,

  `function Tooltip({ children, content, position = 'top' }) {

  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef();
  const tooltipRef = useRef();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top, left;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      default:
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    }

    setTooltipStyle({ top, left });
  }, [position]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="tooltip-trigger"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={\`tooltip tooltip-\${position}\`}
          style={tooltipStyle}
        >
          {content}
        </div>
      )}
    </>
  );
}`,

  `const usePagination = (data, itemsPerPage) => {

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};`,

  `function ProgressBar({ value, max = 100, showPercentage = true, animated = false }) {

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      let start = displayValue;
      const end = percentage;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: \`\${displayValue}%\` }}
        />
      </div>
      {showPercentage && (
        <span className="progress-text">
          {Math.round(displayValue)}%
        </span>
      )}
    </div>
  );
}`,

  `function ImageCarousel({ images }) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef();

  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-viewport">
        <div 
          className="carousel-track"
          style={{ transform: \`translateX(-\${currentIndex * 100}%)\` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={prevSlide} className="carousel-btn prev">
        ‹
      </button>
      <button onClick={nextSlide} className="carousel-btn next">
        ›
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={\`indicator \${index === currentIndex ? 'active' : ''}\`}
          />
        ))}
      </div>

      <button onClick={toggleAutoPlay} className="autoplay-toggle">
        {isAutoPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}`,

  `const useKeyboardShortcut = (keys, callback, node = null) => {

  useEffect(() => {
    const targetNode = node ?? document;
    
    const handleKeyDown = (event) => {
      const keysPressed = {
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
        key: event.key.toLowerCase()
      };

      const shortcutMatched = keys.every(key => {
        if (typeof key === 'string') {
          return keysPressed.key === key.toLowerCase();
        }
        
        if (typeof key === 'object') {
          return Object.entries(key).every(([modifier, value]) => {
            return keysPressed[modifier] === value;
          });
        }
        
        return false;
      });

      if (shortcutMatched) {
        event.preventDefault();
        callback(event);
      }
    };

    targetNode.addEventListener('keydown', handleKeyDown);

    return () => {
      targetNode.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback, node]);
};`,

  `function MultiStepForm({ steps, onComplete }) {

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = completedSteps.has(currentStep);

  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCompletedSteps(prev => new Set([...prev, currentStep]));
  }, [currentStep]);

  const nextStep = () => {
    if (!isLastStep && canProceed) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (isLastStep && canProceed) {
      onComplete(formData);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="multi-step-form">
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div
            key={index}
            className={\`step \${
              index === currentStep ? 'active' : ''
            } \${completedSteps.has(index) ? 'completed' : ''}\`}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="step-content">
        <h2>{steps[currentStep].title}</h2>
        <CurrentStepComponent
          data={formData}
          onUpdate={updateFormData}
        />
      </div>

      <div className="form-navigation">
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className="btn-secondary"
        >
          Previous
        </button>
        
        {!isLastStep ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleComplete}
            disabled={!canProceed}
            className="btn-primary"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
}`,

  `const useInfiniteQuery = (queryFn, options = {}) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  
  const pageParamRef = useRef(options.initialPageParam || 0);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    setError(null);

    try {
      const result = await queryFn({
        pageParam: pageParamRef.current
      });

      setData(prev => [...prev, ...result.data]);
      
      if (result.nextPage !== undefined) {
        pageParamRef.current = result.nextPage;
        setHasNextPage(!!result.nextPage);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [queryFn, hasNextPage, isFetchingNextPage]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData([]);
    pageParamRef.current = options.initialPageParam || 0;
    setHasNextPage(true);

    try {
      await fetchNextPage();
    } finally {
      setLoading(false);
    }
  }, [fetchNextPage, options.initialPageParam]);

  useEffect(() => {
    refetch();
  }, []);

  return {
    data,
    loading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  };
};`,

  `function ResponsiveGrid({ children, minItemWidth = 250, gap = 16 }) {

  const containerRef = useRef();
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const availableWidth = containerWidth - gap;
        const itemsPerRow = Math.floor((availableWidth + gap) / (minItemWidth + gap));
        setColumns(Math.max(1, itemsPerRow));
      }
    };

    updateColumns();
    
    const resizeObserver = new ResizeObserver(updateColumns);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [minItemWidth, gap]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
    gap: \`\${gap}px\`,
    width: '100%'
  };

  return (
    <div ref={containerRef} style={gridStyle} className="responsive-grid">
      {children}
    </div>
  );
}`
];
