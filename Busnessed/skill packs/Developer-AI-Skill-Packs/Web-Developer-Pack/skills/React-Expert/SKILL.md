---
name: "React-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when building, debugging, or optimizing any React application (functional components, hooks, state management, performance, testing)"
purpose: "Provides expert-level guidance for building production-ready React applications with modern patterns, performance optimizations, testing strategies, and state management"
---

## Capabilities

1. Architect React component trees with proper composition patterns, lifting state, and component splitting for maintainability
2. Implement all React hooks (useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, useLayoutEffect, useImperativeHandle, useDebugValue, useDeferredValue, useTransition, useId, useSyncExternalStore) with correct dependency arrays
3. Build and compose custom hooks for reusable logic extraction across components
4. Manage global state with Context API, Redux Toolkit, Zustand, and Jotai with proper provider patterns
5. Implement React Router v6 with nested routes, loaders, actions, error elements, and navigation guards
6. Optimize rendering performance using memoization (React.memo, useMemo, useCallback), virtualization (react-window, react-virtuoso), lazy loading (React.lazy, Suspense), and code splitting
7. Handle forms with react-hook-form including validation (Zod, Yup), controlled/uncontrolled inputs, and complex form state
8. Write comprehensive tests with React Testing Library, Jest, and Cypress component testing
9. Implement error boundaries, portals, refs (forwardRef, useImperativeHandle), and server-side rendering patterns
10. Apply React 18/19 concurrent features including Suspense, useTransition, useDeferredValue, and automatic batching
11. Integrate React Server Components in frameworks like Next.js with client/server boundaries
12. Establish folder structure, naming conventions, and code review standards for React codebases

## Limitations

1. Does not cover React Native or mobile-specific React patterns
2. Cannot automatically migrate class components to functional components without manual review
3. Does not include framework-specific optimizations for all meta-frameworks (Next.js, Remix, Gatsby specifics are in separate skills)
4. Cannot fix third-party library bugs or limitations outside the React ecosystem
5. Performance profiling recommendations require browser DevTools knowledge beyond this skill scope
6. Does not cover accessibility (a11y) or internationalization (i18n) in depth

## Required Tools

- Node.js 18+
- npm/yarn/pnpm
- Code editor with TypeScript support
- React DevTools browser extension
- Browser DevTools Performance tab
- Testing framework (Jest, Vitest)
- ESLint with react/recommended and react-hooks/recommended
- Prettier for consistent formatting

## Execution Workflow

1. Understand the component requirements, state shape, and data flow before writing code
2. Identify whether state should be local (useState/useReducer), lifted, or global (Context/Zustand/Redux)
3. Plan component tree hierarchy with clear parent-child responsibilities and prop interfaces
4. Choose between client components and server components based on data needs and interactivity
5. Implement components using functional components with hooks for all stateful logic
6. Extract reusable logic into custom hooks following the naming convention use* prefix
7. Add React.memo for expensive renders, useMemo for computed values, useCallback for stable callbacks
8. Set up routing with React Router including lazy-loaded route components
9. Implement form handling with react-hook-form, connecting validation schemas
10. Write unit tests for hooks, integration tests for components, and snapshot tests for UI
11. Add error boundaries at strategic points in the component tree
12. Profile rendering performance with React DevTools Profiler and optimize re-renders
13. Verify accessibility basics (ARIA labels, keyboard navigation, focus management)
14. Run linting and type checking before finalizing implementation
15. Document complex component APIs with JSDoc or Storybook stories

## Decision Tree

1. **State type?** → UI state → useState → Form state → react-hook-form → Server state → React Query/SWR → Global state → Context/Zustand/Redux
2. **Performance issue?** → Unnecessary re-renders → React.memo + useCallback + useMemo → Large lists → Virtualization (react-window) → Heavy computations → Web Workers + useMemo → Bundle size → Code splitting + lazy loading
3. **Data fetching pattern?** → Client-side → useEffect + fetch → Server-side → Server Components/SSR → Real-time → WebSocket/SSE + Suspense → On demand → React Query/SWR
4. **Component type?** → Presentational → Pure function → Stateful → Class → migrate to hooks → Logic reuse → Custom hook → Layout → Children prop or slots pattern → Error-prone → Error boundary wrapper
5. **Testing approach?** → Hook logic → renderHook + act → Component behavior → screen queries + userEvent → Async operations → waitFor + findBy → Integration flows → Jest + MSW
6. **Form complexity?** → Simple 1-3 fields → uncontrolled form → Medium 4-10 fields → react-hook-form + Zod → Complex wizard/multi-step → useFormContext + FieldArray → Dynamic fields → useFieldArray + conditional rendering
7. **Route requirements?** → Public/private routes → ProtectedRoute wrapper → Data loading → loaders + Suspense → Navigation side effects → useBlocker + useBeforeUnload → Deep linking → URL search params + useSearchParams

## Review Checklist

- [ ] Component props are properly typed with TypeScript interfaces
- [ ] Hook dependency arrays are complete and correct (no missing deps, no unnecessary deps)
- [ ] No direct DOM manipulation outside refs or effects
- [ ] Event handlers and callbacks use useCallback when passed as props
- [ ] Expensive computations are memoized with useMemo
- [ ] State updates use functional form when depending on previous state
- [ ] Effects have proper cleanup functions (returned function for subscriptions, timers, listeners)
- [ ] Large lists use virtualization with fixed or dynamic item heights
- [ ] Route components are lazy-loaded with React.lazy and Suspense boundaries
- [ ] Error boundaries wrap isolated component sections with fallback UI
- [ ] Forms validate on submit and provide clear error messages per field
- [ ] Tests cover happy path, error states, loading states, and edge cases
- [ ] No console.log or debugger statements in production code
- [ ] Imports are organized (React, third-party, local) with no unused imports
- [ ] Component files follow consistent naming (PascalCase, index.ts barrel exports)
- [ ] Custom hooks return stable references and handle cleanup properly
- [ ] Context providers are memoized and split by update frequency
- [ ] Refs are used for DOM access, instance variables, or previous values only

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Infinite re-render loop | Effect dependencies changing on every render | Check dependency array; use useCallback/useMemo for object/function deps |
| useState not updating | Closing over stale state in closures | Use functional updater `setState(prev => newState)` |
| useEffect running on every render | Missing dependency array | Add [] for mount-only or include specific dependencies |
| React.memo not preventing re-render | Props are new references each render | Memoize object/array/function props with useMemo/useCallback |
| Context causing wide re-renders | Context value changing too frequently | Split context by concern; use useMemo for context value |
| Custom hook returning stale data | Closure captures old state | Use refs for callbacks that need latest values; use functional state updates |
| Suspense not triggering fallback | Component not wrapped in Suspense | Add `<Suspense fallback={...}>` around the lazy component |
| react-hook-form not validating | Schema not connected or validation mode | Set `resolver` with zodResolver; configure `mode: 'onChange'` |
| Error boundary not catching errors | Error in event handlers or async code | Error boundaries only catch render/ lifecycle errors; use try-catch in handlers |
| Key prop warning in lists | Missing or non-unique key prop | Use stable unique IDs, not array index unless list is static |

## Best Practices

1. Keep components small and focused on a single responsibility
2. Prefer composition over inheritance for sharing logic between components
3. Type everything with TypeScript (props, state, context, hooks return types)
4. Use custom hooks to extract complex stateful logic from components
5. Co-locate styles, tests, and stories with their components
6. Follow the principle of lifting state up only when necessary
7. Use React DevTools Profiler to identify and fix performance bottlenecks
8. Write tests that resemble how users interact with the application
9. Use strict mode in development to catch side-effect bugs
10. Keep effects minimal and focused; extract logic into hooks when possible
11. Normalize nested state shapes to avoid deeply nested updates
12. Prefer useState for simple state; useReducer for complex state with multiple sub-values
13. Use TypeScript satisfies operator for type-safe conditional rendering
14. Implement proper error boundaries at module/feature boundaries
15. Use React 18 automatic batching to reduce unnecessary renders

## Anti-Patterns

1. Using useEffect for derived state that can be computed during render
2. Spreading props directly onto DOM elements without filtering
3. Creating new functions, objects, or arrays in render without memoization
4. Using array index as key prop for dynamic lists with reordering
5. Nesting too many Context providers in a single provider component
6. Overusing React.memo without profiling; memoizing cheap components adds overhead
7. Calling hooks conditionally or inside loops (violates rules of hooks)
8. Directly mutating state objects instead of creating new references
9. Creating overly complex reducers with deeply nested state updates
10. Fetching data in useEffect without cleanup (race conditions, memory leaks)

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
