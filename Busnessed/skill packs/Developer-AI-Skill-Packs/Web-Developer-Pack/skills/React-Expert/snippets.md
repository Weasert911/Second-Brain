# React-Expert Snippets

## Snippet 1: useDebounce Hook

```tsx
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**When to use**: Debounce search inputs, filter controls, or any rapidly changing value before making API calls.

## Snippet 2: useMediaQuery Hook

```tsx
import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

**When to use**: Responsive component logic that needs to change based on viewport size (render different layouts, show/hide elements).

## Snippet 3: useLocalStorage Hook

```tsx
import { useState, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
```

**When to use**: Persist user preferences, form drafts, or any state that should survive page refreshes.

## Snippet 4: useIntersectionObserver Hook

```tsx
import { useEffect, useRef, useState, type RefObject } from 'react';

function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}
```

**When to use**: Lazy loading images, infinite scroll triggers, animation on scroll, or tracking ad/viewport visibility.

## Snippet 5: usePrevious Hook

```tsx
import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

**When to use**: Compare previous and current values to detect changes, show previous state, or trigger effects on specific transitions.

## Snippet 6: useWindowSize Hook

```tsx
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}
```

**When to use**: Components that need to adapt layout based on viewport dimensions, or calculate positions relative to window.

## Snippet 7: useClickOutside Hook

```tsx
import { useEffect, type RefObject } from 'react';

function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

**When to use**: Close dropdowns, modals, popovers, or context menus when clicking outside the element.

## Snippet 8: useAsyncEffect Hook

```tsx
import { useEffect, type DependencyList } from 'react';

function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: DependencyList
): void {
  useEffect(() => {
    const cleanupPromise = effect();
    return () => {
      cleanupPromise.then(cleanup => cleanup?.());
    };
  }, deps);
}
```

**When to use**: When you need an async function in useEffect with proper cleanup handling (avoids the "useEffect must not return anything besides a function" warning).

## Snippet 9: Optimistic Update Pattern

```tsx
import { useState } from 'react';

function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (newData: T) => Promise<void>
) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<Error | null>(null);

  const update = async (optimisticData: T) => {
    const previousData = data;
    setData(optimisticData);
    setError(null);

    try {
      await updateFn(optimisticData);
    } catch (err) {
      setData(previousData);
      setError(err instanceof Error ? err : new Error('Update failed'));
    }
  };

  return { data, error, update };
}
```

**When to use**: Implementing optimistic UI updates where you show the result immediately and revert on failure (likes, follows, toggles).

## Snippet 10: ForwardedRef Input Component

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input ref={ref} id={id} aria-invalid={!!error} {...props} />
        {error && <span role="alert">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**When to use**: Creating reusable form input components that need to forward refs for react-hook-form integration.

## Snippet 11: Portal Wrapper Component

```tsx
import { createPortal } from 'react-dom';
import { useEffect, useState, type ReactNode } from 'react';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

function Portal({ children, containerId = 'portal-root' }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      document.body.appendChild(el);
    }
    setContainer(el);
    return () => {
      if (el?.parentNode && el.children.length === 0) {
        el.parentNode.removeChild(el);
      }
    };
  }, [containerId]);

  if (!container) return null;
  return createPortal(children, container);
}
```

**When to use**: Rendering modals, tooltips, dropdowns, or notifications outside the parent component's DOM hierarchy.

## Snippet 12: Lazy Loaded Route Component

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
```

**When to use**: Code-splitting at the route level to reduce initial bundle size and load pages on demand.

## Snippet 13: Controlled Form with useReducer

```tsx
import { useReducer, type ChangeEvent, type FormEvent } from 'react';

type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: string }
  | { type: 'RESET'; initialValues: T };

function formReducer<T extends Record<string, string>>(
  state: T,
  action: FormAction<T>
): T {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return action.initialValues;
    default:
      return state;
  }
}

function useFormState<T extends Record<string, string>>(initialValues: T) {
  const [values, dispatch] = useReducer(formReducer<T>, initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name as keyof T,
      value: e.target.value,
    });
  };

  const reset = () => dispatch({ type: 'RESET', initialValues });

  return { values, handleChange, reset, dispatch };
}

// Usage
function LoginForm() {
  const { values, handleChange, reset } = useFormState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      <input name="password" type="password" value={values.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
```

**When to use**: When useState for each field becomes unwieldy and you want a single reducer to manage all form fields.

## Snippet 14: Suspense Wrapper with Error Handling

```tsx
import { Component, Suspense, type ReactNode } from 'react';

interface AsyncBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

class AsyncBoundary extends Component<AsyncBoundaryProps, ErrorState> {
  constructor(props: AsyncBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.errorFallback
        ? this.props.errorFallback(this.state.error!, this.handleRetry)
        : (
          <div role="alert">
            <p>Error: {this.state.error?.message}</p>
            <button onClick={this.handleRetry}>Retry</button>
          </div>
        );
    }

    return (
      <Suspense fallback={this.props.loadingFallback || <div>Loading...</div>}>
        {this.props.children}
      </Suspense>
    );
  }
}
```

**When to use**: Drop-in replacement for Suspense that also catches render errors and provides retry capability.

## Snippet 15: Zustand Store with Middleware

```tsx
import { create } from 'zustand';
import { persist, devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  completedCount: () => number;
}

const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          todos: [],
          addTodo: (text) =>
            set((state) => {
              state.todos.push({
                id: crypto.randomUUID(),
                text,
                completed: false,
              });
            }),
          toggleTodo: (id) =>
            set((state) => {
              const todo = state.todos.find((t) => t.id === id);
              if (todo) todo.completed = !todo.completed;
            }),
          deleteTodo: (id) =>
            set((state) => {
              const index = state.todos.findIndex((t) => t.id === id);
              if (index !== -1) state.todos.splice(index, 1);
            }),
          completedCount: () => get().todos.filter((t) => t.completed).length,
        }))
      ),
      { name: 'todo-storage' }
    ),
    { name: 'TodoStore' }
  )
);
```

**When to use**: Production-grade Zustand store with devtools for debugging, persist for offline support, subscribeWithSelector for granular subscriptions, and immer for mutable-style state updates.
