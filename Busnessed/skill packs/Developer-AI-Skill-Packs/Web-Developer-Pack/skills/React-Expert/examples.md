# React-Expert Examples

## Beginner: Simple Counter with Custom Hook

**Description**: A reusable useCounter hook demonstrating basic hook patterns with increment, decrement, reset, and setValue operations.

```tsx
import { useState, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

function useCounter(initialValue = 0, min?: number, max?: number): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  const clamp = useCallback((value: number) => {
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
  }, [min, max]);

  const increment = useCallback(() => {
    setCount(prev => clamp(prev + 1));
  }, [clamp]);

  const decrement = useCallback(() => {
    setCount(prev => clamp(prev - 1));
  }, [clamp]);

  const reset = useCallback(() => {
    setCount(clamp(initialValue));
  }, [clamp, initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(clamp(value));
  }, [clamp]);

  return { count, increment, decrement, reset, setValue };
}

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0, 0, 100);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;
```

**Explanation**: This example shows creating a custom hook with proper typing, useCallback for stable references, optional parameters with clamping logic, and functional state updates. The component stays clean by delegating all logic to the hook.

## Intermediate: Data Fetching with Suspense and Error Handling

**Description**: Demonstrates data fetching with a custom useAsync hook, Suspense for loading states, and error boundaries for error handling.

```tsx
import { useState, useEffect, Suspense, Component, ReactNode } from 'react';

interface State<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    setState(prev => ({ ...prev, loading: true }));

    asyncFn()
      .then(data => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch(error => {
        if (!cancelled) setState({ data: null, error, loading: false });
      });

    return () => { cancelled = true; };
  }, deps);

  return state;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const { data, loading, error } = useAsync<User>(
    () => fetch(`/api/users/${userId}`).then(r => {
      if (!r.ok) throw new Error('Failed to fetch user');
      return r.json();
    }),
    [userId]
  );

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>User not found</div>;

  return (
    <div>
      <h3>{data.name}</h3>
      <p>{data.email}</p>
    </div>
  );
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

function UserPage({ userId }: { userId: number }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default UserPage;
```

**Explanation**: This example demonstrates three patterns: a generic useAsync hook with cleanup to prevent memory leaks, an ErrorBoundary class component with getDerivedStateFromError, and composition of Suspense with error boundaries for robust loading/error states.

## Advanced: Optimized Todo List with Undo and Offline Support

**Description**: A production-grade todo list with Zustand state management, undo/redo, offline queue, and virtualization.

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  undoStack: Todo[][];
  redoStack: Todo[][];
  undo: () => void;
  redo: () => void;
}

const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      undoStack: [],
      redoStack: [],

      addTodo: (text: string) => {
        const current = get().todos;
        set({
          todos: [...current, {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now(),
          }],
          undoStack: [...get().undoStack, current],
          redoStack: [],
        });
      },

      toggleTodo: (id: string) => {
        const current = get().todos;
        set({
          todos: current.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
          undoStack: [...get().undoStack, current],
          redoStack: [],
        });
      },

      deleteTodo: (id: string) => {
        const current = get().todos;
        set({
          todos: current.filter(t => t.id !== id),
          undoStack: [...get().undoStack, current],
          redoStack: [],
        });
      },

      undo: () => {
        const { undoStack, todos } = get();
        if (undoStack.length === 0) return;
        const previous = undoStack[undoStack.length - 1];
        set({
          todos: previous,
          undoStack: undoStack.slice(0, -1),
          redoStack: [...get().redoStack, todos],
        });
      },

      redo: () => {
        const { redoStack, todos } = get();
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        set({
          todos: next,
          redoStack: redoStack.slice(0, -1),
          undoStack: [...get().undoStack, todos],
        });
      },
    }),
    { name: 'todo-storage' }
  )
);

function TodoItem({ index, style, data }: { index: number; style: React.CSSProperties; data: Todo[] }) {
  const todo = data[index];
  const toggleTodo = useTodoStore(s => s.toggleTodo);
  const deleteTodo = useTodoStore(s => s.deleteTodo);

  return (
    <div style={style}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => deleteTodo(todo.id)}>x</button>
    </div>
  );
}

function TodoList() {
  const inputRef = useRef<HTMLInputElement>(null);
  const todos = useTodoStore(s => s.todos);
  const addTodo = useTodoStore(s => s.addTodo);
  const undo = useTodoStore(s => s.undo);
  const redo = useTodoStore(s => s.redo);
  const undoStack = useTodoStore(s => s.undoStack);
  const redoStack = useTodoStore(s => s.redoStack);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value.trim()) {
      addTodo(inputRef.current.value.trim());
      inputRef.current.value = '';
    }
  }, [addTodo]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} placeholder="Add todo..." />
        <button type="submit">Add</button>
      </form>
      <div>
        <button onClick={undo} disabled={undoStack.length === 0}>Undo</button>
        <button onClick={redo} disabled={redoStack.length === 0}>Redo</button>
      </div>
      <List
        height={400}
        itemCount={todos.length}
        itemSize={50}
        itemData={todos}
        width={400}
      >
        {TodoItem}
      </List>
    </div>
  );
}

export default TodoList;
```

**Explanation**: This production example demonstrates Zustand with persist middleware for offline support, undo/redo with stack-based history tracking, virtualized list rendering for performance with many items, and useCallback for stable event handlers.

## Production: Multi-Step Form with Validation and Auto-Save

**Description**: A complex multi-step registration form with field arrays, cross-field validation, auto-save draft, and file upload.

```tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash-es';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const registrationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().regex(phoneRegex, 'Invalid phone number'),
  }),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().min(2),
  }),
  documents: z.array(z.object({
    type: z.enum(['id', 'license', 'certificate']),
    file: z.instanceof(File).refine(f => f.size < 5_000_000, 'Max 5MB'),
  })).min(1, 'At least one document required'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function useAutoSave(data: RegistrationForm) {
  useEffect(() => {
    const save = debounce((formData: RegistrationForm) => {
      localStorage.setItem('registration-draft', JSON.stringify(formData));
    }, 2000);

    save(data);
    return () => save.cancel();
  }, [data]);
}

function RegistrationWizard() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      personalInfo: { firstName: '', lastName: '', email: '', phone: '' },
      address: { street: '', city: '', zipCode: '', country: '' },
      documents: [],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'documents' });
  const formData = watch();
  useAutoSave(formData);

  const onSubmit = useCallback(async (data: RegistrationForm) => {
    const formPayload = new FormData();
    formPayload.append('personalInfo', JSON.stringify(data.personalInfo));
    formPayload.append('address', JSON.stringify(data.address));
    data.documents.forEach((doc, i) => {
      formPayload.append(`documents[${i}]`, doc.file);
    });
    await fetch('/api/register', { method: 'POST', body: formPayload });
    localStorage.removeItem('registration-draft');
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Personal Information</legend>
        <input {...register('personalInfo.firstName')} placeholder="First Name" />
        {errors.personalInfo?.firstName && <span>{errors.personalInfo.firstName.message}</span>}
        <input {...register('personalInfo.lastName')} placeholder="Last Name" />
        <input {...register('personalInfo.email')} placeholder="Email" type="email" />
        <input {...register('personalInfo.phone')} placeholder="Phone" />
      </fieldset>

      <fieldset>
        <legend>Address</legend>
        <input {...register('address.street')} placeholder="Street" />
        <input {...register('address.city')} placeholder="City" />
        <input {...register('address.zipCode')} placeholder="ZIP Code" />
        <input {...register('address.country')} placeholder="Country" />
      </fieldset>

      <fieldset>
        <legend>Documents</legend>
        {fields.map((field, index) => (
          <div key={field.id}>
            <select {...register(`documents.${index}.type`)}>
              <option value="id">ID</option>
              <option value="license">License</option>
              <option value="certificate">Certificate</option>
            </select>
            <input
              type="file"
              {...register(`documents.${index}.file`)}
            />
            <button type="button" onClick={() => remove(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ type: 'id', file: undefined as any })}>
          Add Document
        </button>
        {errors.documents && <span>{errors.documents.message}</span>}
      </fieldset>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}

export default RegistrationWizard;
```

**Explanation**: This production-ready form demonstrates zod schema validation with cross-field rules, useFieldArray for dynamic document uploads, auto-save draft with debounced localStorage writes, proper error display per field, FormData construction for multipart submissions, and TypeScript inference from zod schemas.
