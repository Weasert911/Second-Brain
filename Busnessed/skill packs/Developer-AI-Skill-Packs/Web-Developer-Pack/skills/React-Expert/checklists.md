# React-Expert Checklists

## Pre-Flight Checklist

- [ ] Node.js version 18+ is installed and active
- [ ] Project scaffolded with Vite, Create React App, or framework CLI (Next.js, Remix)
- [ ] TypeScript configured with strict mode in tsconfig.json
- [ ] ESLint configured with react/recommended, react-hooks/recommended, and @typescript-eslint rules
- [ ] Prettier configured for consistent code formatting
- [ ] React DevTools extension installed in browser
- [ ] Testing framework set up (Vitest/Jest) with React Testing Library
- [ ] Package manager chosen and lockfile committed (npm/pnpm/yarn)
- [ ] Environment variables (.env.local, .env.development, .env.production) configured
- [ ] Path aliases configured in tsconfig.json (e.g., @/ -> src/)
- [ ] Git hooks set up (husky + lint-staged) for pre-commit linting
- [ ] Browser compatibility targets defined in browserslist

## Implementation Checklist

- [ ] Component receives all necessary props with TypeScript interfaces
- [ ] Props use appropriate types: union types for options, Record for maps, generics for reusable components
- [ ] Default values provided for optional props using destructuring defaults
- [ ] State initialized with the correct type, including null/undefined states
- [ ] Effect dependencies array correctly lists all external values
- [ ] Cleanup function returned from useEffect for subscriptions, timers, or listeners
- [ ] useCallback wraps functions passed as props to child components
- [ ] useMemo wraps expensive computations and derived data
- [ ] Keys on list items are stable unique identifiers, not array indices
- [ ] Context consumers wrapped in a custom hook with null-check and error message
- [ ] Error boundary placed at appropriate granularity (feature/page level)
- [ ] Forms handle loading, disabled, and error states for all inputs
- [ ] Event handlers typed with correct React event types
- [ ] Custom hooks return stable references and handle cleanup
- [ ] No direct state mutation (always use setState with new references)
- [ ] Portal used for modals, tooltips, and dropdowns to avoid z-index issues

## Testing Checklist

- [ ] Rendering tests for each component with default and all prop combinations
- [ ] User interaction tests using userEvent (not fireEvent) for realistic behavior
- [ ] Async operations tested with waitFor, findBy, or waitForElementToBeRemoved
- [ ] Error states tested: API failures, validation errors, unexpected data shapes
- [ ] Empty states tested: no data, empty arrays, null values
- [ ] Loading states tested: spinners shown during async operations
- [ ] Edge cases: boundary values, special characters, very long strings
- [ ] Accessibility checked with jest-axe or @testing-library/jest-dom matchers
- [ ] Custom hooks tested with renderHook and act for state updates
- [ ] Mock service worker (MSW) used for API mocking to avoid network calls
- [ ] Snapshot tests used sparingly for stable UI components only
- [ ] Coverage thresholds configured and met (at least 80% line, branch coverage)
- [ ] Tests run in CI with no --watch flag, all passing
- [ ] Console.log/warn/error assertions for expected error logging
- [ ] Tests isolated and don't share state (cleanup after each test)

## Release Checklist

- [ ] All tests pass: `npm test -- --run` or `npm run test:ci`
- [ ] TypeScript compilation passes with no errors: `npx tsc --noEmit`
- [ ] ESLint passes with no errors or warnings: `npm run lint`
- [ ] Build succeeds: `npm run build` with no warnings
- [ ] Bundle size checked with `npx vite-bundle-visualizer` or source-map-explorer
- [ ] Production build serves correctly: `npm run preview` and manual smoke test
- [ ] Environment variables verified for production (no dev-only URLs/keys)
- [ ] Console.log and debugger statements removed from production code
- [ ] Changelog updated with new version and changes
- [ ] Version bumped in package.json
- [ ] Git tag created matching the version number
- [ ] Deploy to staging environment for integration testing
- [ ] Performance monitoring set up (Vercel Analytics, Sentry, etc.)
- [ ] Error tracking configured for runtime error capture
- [ ] Feature flags verified for any gated functionality

## Maintenance Checklist

- [ ] Dependencies updated monthly with `npm outdated` and `npx taze`
- [ ] Breaking changes reviewed in dependency changelogs before updating
- [ ] Deprecated APIs replaced (e.g., componentWillMount -> useEffect)
- [ ] Bundle size monitored over time; regressions investigated
- [ ] Performance profiles run quarterly with React DevTools Profiler
- [ ] Test coverage reviewed and improved for new features
- [ ] Accessibility audit performed with axe DevTools or Lighthouse
- [ ] Documentation updated (Storybook stories, component API docs)
- [ ] Dead code removed (unused components, hooks, utilities)
- [ ] Security patches applied within the vulnerability window
- [ ] Migration path planned for upcoming React major versions
- [ ] Refactoring debt items tracked and prioritized in backlog
