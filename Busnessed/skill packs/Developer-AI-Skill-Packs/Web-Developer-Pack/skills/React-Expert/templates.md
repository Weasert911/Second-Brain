# React-Expert Templates

## Template 1: Custom Hook with TypeScript

**Name**: `custom-hook-template`
**Description**: A reusable custom hook template with proper typing, cleanup, and error handling.

```tsx
import { useState, useEffect, useCallback } from 'react';

interface Use{{hookName}}Options {
  initialValue?: {{returnType}};
  onChange?: (value: {{returnType}}) => void;
}

interface Use{{hookName}}Return {
  value: {{returnType}};
  setValue: (value: {{returnType}}) => void;
  reset: () => void;
  isDirty: boolean;
}

function use{{hookName}}(
  options: Use{{hookName}}Options = {}
): Use{{hookName}}Return {
  const [value, setValue] = useState<{{returnType}}>(
    options.initialValue as {{returnType}}
  );
  const [isDirty, setIsDirty] = useState(false);

  const handleSetValue = useCallback((newValue: {{returnType}}) => {
    setValue(newValue);
    setIsDirty(true);
    options.onChange?.(newValue);
  }, [options.onChange]);

  const reset = useCallback(() => {
    setValue(options.initialValue as {{returnType}});
    setIsDirty(false);
  }, [options.initialValue]);

  useEffect(() => {
    return () => {
      // Cleanup logic here
    };
  }, []);

  return { value, setValue: handleSetValue, reset, isDirty };
}

export default use{{hookName}};
```

**Usage Notes**: Replace `{{hookName}}` with the hook name (e.g., `useDebouncedSearch`), `{{returnType}}` with the actual return type (e.g., `string`, `User | null`). Add side effects in the useEffect as needed.

## Template 2: React Component with Props

**Name**: `component-template`
**Description**: Standard React component with typed props and optional children.

```tsx
import { type ReactNode } from 'react';

interface {{ComponentName}}Props {
  title: string;
  description?: string;
  isLoading?: boolean;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
}

function {{ComponentName}}({
  title,
  description,
  isLoading = false,
  onAction,
  children,
  className,
}: {{ComponentName}}Props) {
  if (isLoading) {
    return <div className={className}>Loading...</div>;
  }

  return (
    <div className={className}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {onAction && <button onClick={onAction}>Action</button>}
      {children}
    </div>
  );
}

export default {{ComponentName}};
```

**Usage Notes**: Replace `{{ComponentName}}` with PascalCase name. Extend the interface with additional props as needed. Use `React.memo` for expensive renders.

## Template 3: Context Provider with Hook

**Name**: `context-provider-template`
**Description**: React Context provider with a custom consumer hook and type safety.

```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface {{ContextName}}State {
  {{stateProp}}: {{stateType}};
}

interface {{ContextName}}Actions {
  update{{stateProp}}: (value: {{stateType}}) => void;
  reset: () => void;
}

type {{ContextName}}Context = {{ContextName}}State & {{ContextName}}Actions;

const {{ContextName}}Context = createContext<{{ContextName}}Context | null>(null);

const initialState: {{ContextName}}State = {
  {{stateProp}}: {{initialValue}},
};

function {{ContextName}}Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{{ContextName}}State>(initialState);

  const update{{stateProp}} = useCallback((value: {{stateType}}) => {
    setState(prev => ({ ...prev, {{stateProp}}: value }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <{{ContextName}}Context.Provider value={{ ...state, update{{stateProp}}, reset }}>
      {children}
    </{{ContextName}}Context.Provider>
  );
}

function use{{ContextName}}(): {{ContextName}}Context {
  const context = useContext({{ContextName}}Context);
  if (!context) {
    throw new Error('use{{ContextName}} must be used within {{ContextName}}Provider');
  }
  return context;
}

export { {{ContextName}}Provider, use{{ContextName}} };
```

**Usage Notes**: Replace `{{ContextName}}` (e.g., `Theme`, `Auth`), `{{stateProp}}` (e.g., `theme`, `user`), `{{stateType}}` (e.g., `'light' | 'dark'`, `User | null`), and `{{initialValue}}` (e.g., `'light'`, `null`).

## Template 4: Form with react-hook-form and Zod

**Name**: `form-template`
**Description**: Form component with validation using react-hook-form and Zod.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const {{formName}}Schema = z.object({
  {{fieldName}}: z.string().min(1, '{{fieldName}} is required'),
  {{emailField}}: z.string().email('Invalid email'),
});

type {{FormName}}Data = z.infer<typeof {{formName}}Schema>;

interface {{FormName}}FormProps {
  onSubmit: (data: {{FormName}}Data) => Promise<void>;
  defaultValues?: Partial<{{FormName}}Data>;
}

function {{FormName}}Form({ onSubmit, defaultValues }: {{FormName}}FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{{FormName}}Data>({
    resolver: zodResolver({{formName}}Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="{{fieldName}}">{{fieldLabel}}</label>
        <input id="{{fieldName}}" {...register('{{fieldName}}')} />
        {errors.{{fieldName}} && <span>{errors.{{fieldName}}.message}</span>}
      </div>
      <div>
        <label htmlFor="{{emailField}}">{{emailLabel}}</label>
        <input id="{{emailField}}" type="email" {...register('{{emailField}}')} />
        {errors.{{emailField}} && <span>{errors.{{emailField}}.message}</span>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default {{FormName}}Form;
```

**Usage Notes**: Replace `{{formName}}` (e.g., `login`, `contact`), `{{fieldName}}`/`{{emailField}}` with actual field names, `{{FormName}}` with PascalCase name, and labels.

## Template 5: Test with React Testing Library

**Name**: `test-template`
**Description**: Component test template with user interactions and async assertions.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {{ComponentName}} from './{{ComponentName}}';

describe('{{ComponentName}}', () => {
  it('renders with default props', () => {
    render(<{{ComponentName}} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<{{ComponentName}} title="Test" onAction={onAction} />);
    await user.click(screen.getByRole('button', { name: /action/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<{{ComponentName}} title="Test" isLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <{{ComponentName}} title="Test">
        <span>child content</span>
      </{{ComponentName}}>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
```

**Usage Notes**: Replace `{{ComponentName}}` with the component name. Add tests for error states, empty states, and edge cases specific to your component.

## Template 6: Error Boundary with Fallback

**Name**: `error-boundary-template`
**Description**: Error boundary with retry mechanism and fallback UI.

```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface {{BoundaryName}}Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, retry: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface {{BoundaryName}}State {
  hasError: boolean;
  error: Error | null;
}

class {{BoundaryName}} extends Component<{{BoundaryName}}Props, {{BoundaryName}}State> {
  constructor(props: {{BoundaryName}}Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): {{BoundaryName}}State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('{{BoundaryName}} caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.handleRetry);
      }
      return (
        this.props.fallback || (
          <div role="alert">
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={this.handleRetry}>Try Again</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default {{BoundaryName}};
```

**Usage Notes**: Replace `{{BoundaryName}}` with a descriptive name (e.g., `ApiErrorBoundary`, `RouteErrorBoundary`). Place strategically around feature modules, not the entire app.

## Template 7: Custom Hook for API Data Fetching

**Name**: `data-hook-template`
**Description**: Custom hook for API data fetching with loading, error, and refresh states.

```tsx
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface Use{{serviceName}}Return<T> extends FetchState<T> {
  refresh: () => void;
  setData: (data: T) => void;
}

function use{{serviceName}}<T = unknown>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): Use{{serviceName}}Return<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await fetcher();
      setState({ data, error: null, isLoading: false });
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      });
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return { ...state, refresh, setData };
}

export default use{{serviceName}};
```

**Usage Notes**: Replace `{{serviceName}}` (e.g., `UserProfile`, `ProductList`). Pass the API call function as the first argument and dependencies as the second.

## Template 8: Virtualized List Component

**Name**: `virtualized-list-template`
**Description**: A virtualized list using react-window for rendering large datasets efficiently.

```tsx
import { useRef, useCallback } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface {{ListName}}Item {
  id: string;
  {{itemProp}}: {{itemType}};
}

interface {{ListName}}Props {
  items: {{ListName}}Item[];
  onItemClick?: (item: {{ListName}}Item) => void;
  itemHeight?: number;
}

function {{ListName}}({ items, onItemClick, itemHeight = 50 }: {{ListName}}Props) {
  const listRef = useRef<FixedSizeList>(null);

  const ItemRenderer = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const item = items[index];
      return (
        <div
          style={style}
          onClick={() => onItemClick?.(item)}
          role="button"
          tabIndex={0}
        >
          {item.{{itemProp}}}
        </div>
      );
    },
    [items, onItemClick]
  );

  if (items.length === 0) {
    return <div>No items</div>;
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          ref={listRef}
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={itemHeight}
        >
          {ItemRenderer}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}

export default {{ListName}};
```

**Usage Notes**: Replace `{{ListName}}` (e.g., `UserList`, `ProductGrid`), `{{itemProp}}` (e.g., `name`, `title`), `{{itemType}}` (e.g., `string`, `number`). Requires `react-window` and `react-virtualized-auto-sizer` packages.
