# Express-Expert References

## Official Documentation

- **Express.js Docs**: https://expressjs.com/ - Guide, routing, middleware, API reference
- **Express Middleware**: https://expressjs.com/en/guide/writing-middleware.html - Writing and using middleware
- **Error Handling**: https://expressjs.com/en/guide/error-handling.html - Error-handling middleware patterns
- **Routing**: https://expressjs.com/en/guide/routing.html - Route parameters, Router, route methods
- **Helmet Docs**: https://helmetjs.github.io/ - Security headers middleware configuration
- **CORS Docs**: https://github.com/expressjs/cors - CORS middleware options
- **express-rate-limit Docs**: https://express-rate-limit.mintlify.app/ - Rate limiting configuration
- **Multer Docs**: https://github.com/expressjs/multer - File upload middleware
- **Supertest Docs**: https://github.com/ladjs/supertest - HTTP testing library
- **express-async-errors**: https://github.com/davidbanham/express-async-errors - Async error catching

## Terminology

1. **Middleware**: Function with access to req, res, and next; can execute code, modify request/response, end request cycle, or call next
2. **Router**: Isolated middleware and route instance; mini-application for modular routes
3. **Route Handler**: Middleware function that specifically handles a matched route pattern
4. **Error-Handling Middleware**: Middleware with four parameters (err, req, res, next) that catches errors
5. **Query String**: URL parameters after ? accessed via req.query
6. **Route Parameters**: Named segments in URL path accessed via req.params
7. **Body Parser**: Middleware that parses request body (JSON, URL-encoded, raw, text)
8. **Template Engine**: Library that renders dynamic HTML with embedded templates (Pug, EJS, Handlebars)
9. **Static Files**: Files served directly from disk without processing (CSS, JS, images)
10. **Rate Limiting**: Restriction of request count per time window per client
11. **CORS**: Cross-Origin Resource Sharing - mechanism for controlling cross-origin requests
12. **Content Security Policy**: HTTP header that controls resource loading (scripts, styles, fonts)
13. **HSTS**: HTTP Strict Transport Security - enforces HTTPS connections
14. **CORS Preflight**: OPTIONS request that checks if cross-origin request is allowed

## Architecture Notes

- Express is a minimal, unopinionated web framework; architecture decisions are left to the developer
- Middleware runs in the order it is registered; this order is critical for correct behavior
- Application-level middleware (app.use) affects all routes; router-level middleware (router.use) affects only that router
- Error-handling middleware must be registered after all routes to catch errors from any middleware
- Each route can have multiple middleware functions for modular validation, auth, and processing
- Template engines render views server-side and send HTML; data is injected during rendering
- Static files should be served with caching headers and often placed on a CDN in production
- The response object methods (res.json, res.send, res.render, res.redirect) terminate the request-response cycle

## Key APIs

- `express()` - Create Express application
- `express.Router()` - Create modular route handler
- `app.use(path, middleware)` - Mount middleware at path
- `app.get/post/put/patch/delete(path, handlers)` - Route HTTP methods
- `app.set(name, value)` - Set application settings
- `router.param(name, handler)` - Route parameter middleware
- `res.json(body)` - Send JSON response
- `res.status(code)` - Set HTTP status code
- `res.send(body)` - Send various response types
- `res.render(view, data)` - Render template engine view
- `res.redirect(url)` - Redirect to URL
- `res.type(type)` - Set Content-Type header
- `next(err)` - Pass error to error-handling middleware
- `express.json(options)` - JSON body parser
- `express.urlencoded(options)` - URL-encoded body parser
- `express.static(root, options)` - Static file serving
- `express.Router` - Create modular router
- `express-async-errors` - Patch Express to catch async errors automatically

## Conventions

- **File structure**: routes/ for route files, controllers/ for handler logic, middleware/ for custom middleware, services/ for business logic
- **Route naming**: Plural nouns for resources, kebab-case for multi-word routes
- **Handler naming**: PascalCase for controller classes, camelCase for handler functions
- **Error response format**: `{ error: { message: string, code?: string, details?: any } }`
- **Success response format**: `{ data: any, meta?: { page, limit, total } }`
- **Configuration**: Environment-based config files in config/ directory
- **Testing**: Separate __tests__/ directory mirroring src/ structure

## Project Structure Recommendation

```
my-express-app/
  src/
    index.js           # Entry point
    app.js             # Express app setup, middleware, routes
    config/
      index.js         # Configuration loader
      env.js           # Environment validation
    routes/
      index.js         # Route aggregator
      userRoutes.js
      authRoutes.js
    controllers/
      userController.js
      authController.js
    middleware/
      errorHandler.js
      validator.js
      auth.js
      rateLimiter.js
    services/
      userService.js
      authService.js
    validators/
      userSchemas.js
      authSchemas.js
    types/
      index.ts
      express.d.ts
    utils/
      asyncHandler.js
      ApiError.js
      response.js
    __tests__/
      routes/
        userRoutes.test.js
      middleware/
        auth.test.js
  public/
    css/
    js/
    images/
  views/
    layouts/
    partials/
    pages/
  package.json
  tsconfig.json
```
