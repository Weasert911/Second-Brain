---
name: "Express-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when building, securing, or optimizing Express.js web applications, APIs, middleware pipelines, and request handling"
purpose: "Provides comprehensive guidance for building production-ready Express.js applications with proper middleware architecture, security, validation, testing, and API design"
---

## Capabilities

1. Design middleware architectures distinguishing application-level vs router-level middleware with proper ordering
2. Implement error handling middleware with custom error classes and formatted error responses
3. Handle route parameters, query strings, and URL encoding with validation and sanitization
4. Validate request bodies with Joi and Zod schemas including custom error messages
5. Configure body parsing for JSON, URL-encoded, and raw text with size limits
6. Handle file uploads with multer including storage configuration, file filtering, and size limits
7. Implement rate limiting with express-rate-limit, custom key generators, and skip strategies
8. Configure security headers with helmet including CSP, HSTS, and X-Frame-Options
9. Set up CORS with specific origins, methods, allowed headers, and credentials
10. Apply compression with express-compression for response size optimization
11. Integrate template engines (Pug, EJS) with layouts, partials, and data injection
12. Handle async errors with express-async-errors or custom wrapper utilities
13. Write integration tests with supertest and Jest including auth tokens and database setup
14. Implement API versioning strategies (URL prefix, header-based, content negotiation)
15. Configure HTTPS with SSL certificates and HTTP to HTTPS redirection

## Limitations

1. Does not cover Fastify, Koa, or other Express alternatives in depth
2. Cannot automatically migrate from Express to serverless or edge functions
3. WebSocket implementation details beyond basic express-ws integration are not covered
4. Does not cover GraphQL or REST API design patterns (separate skills)
5. Large-scale microservice architectures and service discovery are beyond scope
6. Does not include deployment to specific cloud platforms (AWS, Azure, GCP)

## Required Tools

- Node.js 18+
- npm/yarn/pnpm
- Express.js 4.x
- TypeScript (preferred) for type safety
- Postman/curl for API testing
- ESLint with Express plugin
- Morgan or pino-http for HTTP logging
- nodemon for development

## Execution Workflow

1. Initialize project with Express, TypeScript, and essential middleware dependencies
2. Create application entry point with middleware stack ordering (security → parsing → logging → routes → error handling)
3. Set up configuration for environment, CORS, rate limiting, and body size limits
4. Implement custom error classes with HTTP status codes and error response format
5. Create route files using Express.Router with parameter validation and middleware composition
6. Add request validation middleware with schemas (Joi/Zod) for each route
7. Set up error handling middleware as the last middleware in the stack
8. Configure static file serving for public assets with caching headers
9. Implement file upload endpoints with multer configuration
10. Add security headers with helmet and CORS configuration
11. Set up rate limiting for API endpoints with different limits per route group
12. Add request logging with structured logging format
13. Implement API versioning strategy for future-proofing
14. Write integration tests with supertest for all API endpoints
15. Configure graceful shutdown and production process management

## Decision Tree

1. **Middleware type?** → Application-level → app.use() → Router-level → router.use() → Error-handling → 4-param middleware → Third-party → wrapped in custom middleware
2. **Validation approach?** → Simple validation → Manual checks → Complex schemas → Zod → Reusable schemas → Custom middleware factory → Async validation → zod + async refinement
3. **Security need?** → Headers → helmet → CORS → cors() → Rate limiting → express-rate-limit → Input sanitization → express-mongo-sanitize → SQL injection → Parameterized queries
4. **File upload?** → Simple single → upload.single('file') → Multiple files → upload.array('files', 5) → Mixed fields → upload.fields([...]) → Custom storage → multer.diskStorage
5. **Template engine?** → Simple HTML → Static files → Dynamic pages → EJS → Complex layouts → Pug → Email templates → Handlebars
6. **API versioning?** → Simple version → /api/v1/users → Header version → Accept: application/vnd.api+json;version=1 → Content negotiation → Accept header parsing → No versioning → Forward compatibility headers
7. **Testing strategy?** → Unit routes → supertest(app) → Auth protected → Set auth headers → Database dependent → Test DB setup/teardown → File upload → supertest + fixtures

## Review Checklist

- [ ] Middleware order correct: security → parsing → logging → compression → routes → 404 → error handler
- [ ] Error handling middleware has 4 parameters (err, req, res, next)
- [ ] Route parameters validated with schema before handler execution
- [ ] Body parsers have size limits configured (express.json({ limit: '1mb' }))
- [ ] CORS configured with specific origin whitelist, not wildcard in production
- [ ] Helmet configured with appropriate CSP directives for the application
- [ ] Rate limiting applied to routes with different limits per endpoint type
- [ ] File upload size limits and file type restrictions configured
- [ ] Compression enabled for text-based responses
- [ ] Static files served with immutable caching for versioned assets
- [ ] HTTP logging uses structured format (JSON for production)
- [ ] Async route handlers have error catching (express-async-errors or wrapper)
- [ ] API responses follow consistent JSON envelope format
- [ ] Sensitive headers (x-powered-by) removed
- [ ] Environment-specific configurations separated

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Route not matching | Wrong path or middleware order | Check router.use order; verify path pattern; move routes before error handler |
| Request body undefined | Missing body parser middleware | Add express.json() before route handlers |
| CORS error in browser | Wrong origin or missing CORS headers | Check cors() options; verify origin matches request Origin header |
| File upload fails | Missing multer config or wrong field name | Check upload.fields/single name matches form field name |
| Rate limit not working | Wrong key generator or middleware order | Ensure rate limiter before route handlers; check key generator |
| Error not caught by handler | Middleware not after routes | Error handler must be last middleware |
| Static files 404 | Wrong static directory path | Use absolute path with path.join(__dirname, 'public') |
| Session not persisting | Express-session config | Check secret, resave, saveUninitialized, cookie settings |
| HTTPS not redirecting | Missing redirect middleware | Add app.use(redirectToHTTPS) or helmet HSTS |
| 413 Entity Too Large | Body parser size limit | Increase limit in express.json({ limit: '10mb' }) |

## Best Practices

1. Always order middleware correctly: helmet, cors, compression, body-parser, morgan, routes, error handler
2. Use Express.Router for modular route organization
3. Implement centralized error handling with custom error classes
4. Validate all input with schemas (Zod recommended for TypeScript projects)
5. Use express-async-errors or async wrapper to catch promise rejections
6. Set reasonable body size limits to prevent DOS attacks
7. Configure CORS with explicit origin whitelist in production
8. Use helmet to set security headers with custom CSP
9. Apply rate limiting per endpoint type (stricter for auth routes)
10. Use compression for text responses, not for binary data (images, videos)
11. Keep routes thin; business logic in services
12. Use environment-specific configuration files
13. Implement health check endpoint (/health, /ready)
14. Use morgan or pino-http for HTTP request logging
15. Always close database connections on server shutdown

## Anti-Patterns

1. Putting routes before global middleware (body parsers, cors won't apply)
2. Using app.use instead of router-level middleware for scoped functionality
3. Not catching async errors in route handlers (unhandled promise rejections)
4. Hardcoding configuration values instead of using environment variables
5. Exposing stack traces in production error responses
6. Using res.send with status codes inconsistently (mix of res.json and res.send)
7. Mounting static files at root path without proper caching
8. Ignoring CORS errors by using wildcard in production
9. Placing error handling middleware before routes
10. Not handling 404 as a catch-all route

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
