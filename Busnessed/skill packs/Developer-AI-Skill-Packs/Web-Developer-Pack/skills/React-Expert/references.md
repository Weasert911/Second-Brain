# React-Expert References

## Official Documentation

- **React Docs**: https://react.dev - Official React documentation with tutorials, API references, and thinking in React guide
- **React 18 Blog Post**: https://react.dev/blog/2022/03/29/react-v18 - Concurrent features, automatic batching, transitions, Suspense improvements
- **React 19 Overview**: https://react.dev/blog/2024/12/05/react-19 - Actions, useActionState, useFormStatus, useOptimistic, Server Components stable
- **React Router v6 Docs**: https://reactrouter.com/en/main - Loaders, actions, nested routes, lazy loading, navigation hooks
- **Redux Toolkit Docs**: https://redux-toolkit.js.org/ - configureStore, createSlice, createAsyncThunk, RTK Query
- **Zustand Docs**: https://github.com/pmndrs/zustand - Minimal state management with create, subscribe, middleware
- **Jotai Docs**: https://jotai.org/ - Atomic state management with Provider pattern, derived atoms
- **React Testing Library Docs**: https://testing-library.com/docs/react-testing-library/intro - Query priorities, fireEvent vs userEvent, async queries
- **react-hook-form Docs**: https://react-hook-form.com/ - useForm, useFieldArray, Controller, resolvers, performance

## Terminology

1. **JSX**: JavaScript XML syntax extension for writing React component markup
2. **Component**: Reusable UI piece that returns React elements; function or class
3. **Hook**: Function that lets you use state and lifecycle features in function components
4. **Virtual DOM**: In-memory representation of the real DOM; React diffs and patches
5. **Reconciliation**: Process of comparing virtual DOM trees to determine updates
6. **Fiber**: React 16+ reconciliation engine that enables incremental rendering
7. **Suspense**: Component that lets you declaratively specify loading states
8. **Concurrent Mode**: Set of features enabling interruptible rendering and prioritization
9. **Server Component**: Component that runs and renders on the server, never sent to client
10. **Portals**: Renders children into a different DOM subtree outside the parent
11. **Error Boundary**: Component that catches JavaScript errors in its child tree
12. **Higher-Order Component (HOC)**: Function that takes a component and returns an enhanced component
13. **Render Prop**: Technique for sharing code using a prop whose value is a function
14. **Controlled Component**: Form element where React state is the single source of truth
15. **Uncontrolled Component**: Form element that manages its own state via DOM ref

## Architecture Notes

- Component tree should mirror the application's data flow and visual structure
- Split application into feature-based modules rather than technical layers
- Use barrel exports (index.ts) to clean up import paths for feature modules
- Prefer co-location of assets, styles, and tests with their components
- State should live as close to where it is needed as possible
- Provider components should wrap only the subtree that needs the context
- Custom hooks abstract complex state logic and side effects from components
- Use the container/presentational pattern for separating data concerns from rendering
- Implement feature flags at the router or layout level for gradual rollouts
- Use TypeScript strict mode for maximum type safety across component boundaries

## Key APIs

- `createRoot(domNode).render(<App />)` - React 18 entry point with concurrent features
- `hydrateRoot(domNode, <App />)` - Hydrate server-rendered React
- `createPortal(children, domNode)` - Render outside parent DOM hierarchy
- `Profiler({id, onRender})` - Measure rendering performance of a tree
- `lazy(() => import('./Component'))` - Code-split components for lazy loading
- `Suspense({fallback, children})` - Declare loading UI for async operations
- `startTransition(() => setState(...))` - Mark state update as non-urgent transition
- `useDeferredValue(value)` - Defer re-rendering a value for urgent updates
- `useOptimistic(state, updateFn)` - Show optimistic UI before server confirms
- `useActionState(action, initialState)` - Manage form actions with pending state
- `useFormStatus()` - Access form submission status in nested components
- `createContext(defaultValue)` + `useContext(Context)` - Share values across tree

## Conventions

- **File naming**: PascalCase for components (`UserProfile.tsx`), camelCase for hooks (`useAuth.ts`), kebab-case for utilities
- **Component naming**: Noun or noun phrase reflecting what the component renders
- **Prop naming**: camelCase, descriptive, prefix boolean props with is/has/should (isLoading, hasError)
- **Handler naming**: Prefix with handle (handleSubmit, handleChange) or on for callbacks passed as props
- **State variable naming**: Noun for state (user, posts), set prefix for setter (setUser, setPosts)
- **Custom hooks**: Always start with use, return object or tuple, stable reference functions
- **Folder structure**: Feature-based with components/, hooks/, utils/, types/, __tests__/ subfolders
- **Import order**: React/external libraries → feature modules → shared components → utils → styles
- **TypeScript interfaces**: Prefix with I optional; use `interface` for public APIs, `type` for unions/computed

## Project Structure Recommendation

```
src/
  features/
    auth/
      components/
        LoginForm.tsx
        RegisterForm.tsx
        OAuthButtons.tsx
      hooks/
        useAuth.ts
        useLogin.ts
      services/
        authApi.ts
      types/
        auth.ts
      __tests__/
        LoginForm.test.tsx
        useAuth.test.ts
    dashboard/
      components/
        DashboardLayout.tsx
        StatsCard.tsx
      hooks/
        useDashboardData.ts
  shared/
    components/
      Button.tsx
      Modal.tsx
      Spinner.tsx
    hooks/
      useDebounce.ts
      useMediaQuery.ts
    utils/
      cn.ts
      formatDate.ts
    types/
      common.ts
  layouts/
    MainLayout.tsx
    AuthLayout.tsx
  routes/
    index.tsx
    ProtectedRoute.tsx
  providers/
    AuthProvider.tsx
    ThemeProvider.tsx
  App.tsx
  main.tsx
```
