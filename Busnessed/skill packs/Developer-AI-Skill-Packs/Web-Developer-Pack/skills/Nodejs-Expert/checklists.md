# Nodejs-Expert Checklists

## Pre-Flight Checklist

- [ ] Node.js version matched to project requirements (check engines in package.json)
- [ ] Package.json contains name, version, description, main, scripts, dependencies, devDependencies
- [ ] .gitignore includes node_modules, .env, logs, dist
- [ ] .env.example created with all required variables (no secrets)
- [ ] Module system chosen and consistent (type: module in package.json or .mjs files)
- [ ] ESLint configured with Node.js plugin and recommended rules
- [ ] Prettier configured for consistent formatting
- [ ] nodemon or ts-node-dev configured for development
- [ ] Environment variable validation set up at application entry point
- [ ] Logging configured with appropriate transports and levels
- [ ] Production process manager chosen (PM2, Docker)
- [ ] Health check and readiness endpoints planned

## Implementation Checklist

- [ ] All async operations use try/catch or proper Promise error handling
- [ ] Streams use pipeline() instead of .pipe() for automatic cleanup
- [ ] EventEmitter max listeners set to appropriate limit
- [ ] Event listeners properly removed on cleanup
- [ ] File descriptors closed after operations (streams, file handles)
- [ ] Database connections configured with pool limits and retry logic
- [ ] Worker threads used for CPU-intensive operations only
- [ ] Cluster mode configured for production multi-core usage
- [ ] Graceful shutdown handles in-flight requests
- [ ] Error responses sanitized (no stack traces in production)
- [ ] Buffer encoding specified explicitly (utf8, base64, hex)
- [ ] HTTP agents configured with keepAlive and maxSockets
- [ ] Memory usage monitored with periodic heap snapshots if needed
- [ ] Circular dependencies identified and eliminated
- [ ] Sensitive data not logged or exposed in error messages

## Testing Checklist

- [ ] Unit tests cover all services and utilities
- [ ] Integration tests cover API endpoints with supertest
- [ ] Async operations tested with proper await and timeouts
- [ ] Error scenarios tested: network failures, invalid input, auth failures
- [ ] Stream backpressure tested with large datasets
- [ ] Worker thread communication tested with various data sizes
- [ ] Graceful shutdown tested with in-flight requests
- [ ] Cluster mode tested with process kills and restarts
- [ ] Module resolution tested with relative and absolute imports
- [ ] Environment variable variations tested (missing, invalid, production)
- [ ] Performance benchmarked for critical paths
- [ ] Test coverage threshold met (80%+)
- [ ] Tests run in CI pipeline with no flaky tests
- [ ] Memory leak tests with heap comparison before/after operations
- [ ] Concurrent request handling verified

## Release Checklist

- [ ] Application builds without errors: `npm run build` if applicable
- [ ] TypeScript checks pass: `npx tsc --noEmit` if using TypeScript
- [ ] Lint passes: `npm run lint`
- [ ] All tests pass: `npm test`
- [ ] Dependencies audited: `npm audit` (no critical/high vulnerabilities)
- [ ] Outdated dependencies identified: `npm outdated`
- [ ] Production .env file configured with production values
- [ ] Logging level set to appropriate for production
- [ ] Process manager configured for production (PM2 ecosystem file)
- [ ] Health check endpoints verified in production-like environment
- [ ] Memory limits configured (--max-old-space-size)
- [ ] Clustering configured if using multi-core
- [ ] Graceful shutdown verified with SIGTERM
- [ ] Error tracking configured (Sentry, Rollbar, etc.)
- [ ] Performance monitoring set up (New Relic, Datadog, etc.)
- [ ] Deployment rollback plan documented

## Maintenance Checklist

- [ ] Node.js LTS version schedule tracked for upgrades
- [ ] Dependencies updated monthly with review of breaking changes
- [ ] Deprecated APIs tracked and replaced before removal
- [ ] Logs reviewed for recurring errors or warnings
- [ ] Performance metrics reviewed (CPU, memory, event loop lag)
- [ ] Heap dump analysis performed if memory grows over time
- [ ] Security vulnerabilities patched within SLA
- [ ] Test coverage maintained for new code
- [ ] Documentation updated for API changes
- [ ] Configuration reviewed for environment drift
- [ ] Backup and restore procedures tested
- [ ] Incident response runbook updated
