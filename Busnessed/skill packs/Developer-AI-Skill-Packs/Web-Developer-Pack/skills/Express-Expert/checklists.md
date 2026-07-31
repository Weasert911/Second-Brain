# Express-Expert Checklists

## Pre-Flight Checklist

- [ ] Node.js version specified in package.json engines field
- [ ] Express installed with TypeScript types (if using TypeScript)
- [ ] Essential middleware installed (helmet, cors, compression, morgan, express-rate-limit)
- [ ] Environment variables configured with .env and .env.example
- [ ] Configuration validation at startup with Zod or envalid
- [ ] Linter configured with Express-specific rules
- [ ] Test framework set up (Jest/Vitest with supertest)
- [ ] Project structure established (routes, controllers, middleware, services)
- [ ] Git initialized with .gitignore for node_modules, .env, logs
- [ ] Logging strategy chosen (pino, winston, morgan)
- [ ] Health check endpoints planned (/health, /ready)
- [ ] Error tracking service configured (Sentry, Rollbar)

## Implementation Checklist

- [ ] Middleware order follows best practices: security → parsing → compression → logging → routes → 404 → error handler
- [ ] Body parsers have explicit size limits configured
- [ ] CORS configured with specific origin whitelist (no wildcard in production)
- [ ] Helmet configured with custom CSP directives
- [ ] Rate limiting applied with different limits for auth vs regular endpoints
- [ ] Error handler middleware has 4 parameters and is last in stack
- [ ] Custom error classes extend Error and include statusCode
- [ ] All async route handlers use express-async-errors or async wrapper
- [ ] Input validation with schemas (Zod/Joi) before route handler execution
- [ ] Route parameters validated for type and format
- [ ] Authentication middleware properly extracts and verifies tokens
- [ ] File upload endpoints have size and type validation
- [ ] Static files served with proper caching headers (maxAge, immutable)
- [ ] Response format consistent across all endpoints (envelope pattern)
- [ ] API versioning strategy implemented (URL prefix or header)
- [ ] Graceful shutdown with connection draining
- [ ] 404 catch-all route registered before error handler

## Testing Checklist

- [ ] All routes tested with supertest for success and error responses
- [ ] Validation tests for invalid input: missing fields, wrong types, out of range
- [ ] Authentication tests: missing token, expired token, invalid token
- [ ] Authorization tests: insufficient role, no role
- [ ] Rate limiting tests: requests exceeding limit return 429
- [ ] File upload tests: valid file, oversized file, wrong type
- [ ] Error handling tests: 404, 400, 401, 403, 500 responses
- [ ] CORS tests: preflight OPTIONS, cross-origin requests
- [ ] Integration tests with real database or in-memory mock
- [ ] Middleware tests: each middleware in isolation
- [ ] Test coverage thresholds configured and met
- [ ] Tests do not share state (isolated database per test)
- [ ] No flaky tests (deterministic, no timing dependencies)
- [ ] Tests run in CI pipeline

## Release Checklist

- [ ] All tests pass in CI environment
- [ ] Lint check passes with no errors
- [ ] TypeScript compilation succeeds (if applicable)
- [ ] Dependencies audited (npm audit) with no critical vulnerabilities
- [ ] Environment variables verified in production environment
- [ ] CORS origins updated to production domains
- [ ] Helmet CSP directives updated for production (no unsafe-inline for scripts)
- [ ] Rate limits adjusted for expected production traffic
- [ ] Compression threshold appropriate for production (1024+ bytes)
- [ ] Body size limits appropriate for production use cases
- [ ] Morgan logging format set to combined for production
- [ ] Error stack traces disabled in production
- [ ] Process manager configured (PM2 ecosystem file)
- [ ] Graceful shutdown verified with SIGTERM
- [ ] Monitoring and alerting configured

## Maintenance Checklist

- [ ] Dependencies updated monthly with review of breaking changes
- [ ] Express security advisories monitored and patches applied
- [ ] Deprecated middleware versions tracked and upgraded
- [ ] Rate limit thresholds reviewed against traffic patterns
- [ ] Logs reviewed for recurring errors or attack patterns
- [ ] CORS origins audited for unused or suspicious entries
- [ ] Helmet policies reviewed for new security best practices
- [ ] API versioning lifecycle managed (deprecate old versions)
- [ ] Test coverage maintained above threshold
- [ ] Performance benchmarks run periodically
- [ ] Error tracking reviewed and actioned weekly
- [ ] Documentation updated for new endpoints and changes
