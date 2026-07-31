---
name: "Axum-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Axum expert skill for web framework, extractors, middleware, routing, state management, WebSockets, and OpenAPI integration."
purpose: "Provides authoritative guidance on building web applications with Axum, including routing, request extraction, response generation, middleware integration, state management, WebSocket support, OpenAPI documentation, and production deployment."
---

## Capabilities

1. Set up Axum Router with nested routes, merging, and fallback handlers.
2. Use extractors: Path, Query, Json, Form, Extension, State, and custom extractors.
3. Implement responses with IntoResponse, Json, Html, Redirect, and StatusCode.
4. Integrate Tower middleware layers (compression, CORS, tracing, timeout, rate limiting).
5. Handle errors with IntoResponse for custom error types and unified error responses.
6. Manage application state with Extension vs State extractor and Arc<AppState>.
7. Handle multipart file uploads with multer or axum-extra.
8. Implement WebSocket upgrades and message handling.
9. Generate OpenAPI specs with utoipa and serve Swagger UI.
10. Serve static files with tower-http or axum-extra.
11. Implement authentication middleware (Bearer token, session, OAuth2).
12. Configure graceful shutdown with Tokio signal handling.

## Limitations

1. Does not cover actix-web, warp, or other web frameworks beyond comparative mentions.
2. Cannot test endpoints or run the server directly.
3. Limited to Axum 0.7+ API patterns.
4. Database integration guidance limited to patterns, not specific ORM queries.

## Required Tools

- Axum crate 0.7+
- Tower and tower-http for middleware
- Tokio for async runtime
- utoipa for OpenAPI
- serde/serde_json for serialization
- reqwest for integration testing

## Execution Workflow

1. Understand the web application requirements (REST, GraphQL, static files, WebSockets).
2. Design route hierarchy with nesting and state structure.
3. Define request and response types with serde Serialize/Deserialize.
4. Choose state management approach (State extractor with Arc<AppState>).
5. Implement error handling strategy with unified error type implementing IntoResponse.
6. Add middleware layers in correct order (tracing -> CORS -> compression -> auth -> routes).
7. Implement handlers with appropriate extractors.
8. Add authentication/authorization middleware.
9. Set up OpenAPI documentation with utoipa.
10. Configure graceful shutdown with Tokio signal::ctrl_c.
11. Write integration tests with reqwest and axum::TestServer.
12. Tune production settings (timeouts, rate limiting, CORS).

## Decision Tree

1. **Is the API read-only?**
   - YES → Use GET handlers with State and Query extractors.
   - NO → Use appropriate HTTP methods with body extractors (Json, Form, Multipart).

2. **Is authentication needed?**
   - YES → Implement auth middleware (Bearer token, session cookie, or custom header).
   - NO → Public endpoints.

3. **Is there shared state?**
   - YES → Use State<Arc<AppState>> for shared state.
   - NO → Stateless handlers.

4. **Are WebSockets needed?**
   - YES → Use axum::extract::ws::WebSocketUpgrade.
   - NO → HTTP-only responses.

5. **Is OpenAPI documentation needed?**
   - YES → Use utoipa with #[derive(ToSchema)] and #[utoipa::path].
   - NO → Manual documentation sufficient.

6. **Is the API internal or external?**
   - INTERNAL → Minimal security, simple CORS.
   - EXTERNAL → Full auth, rate limiting, request validation, strict CORS.

## Review Checklist

- [ ] All route handlers use appropriate extractors.
- [ ] Error types implement IntoResponse for consistent error JSON.
- [ ] State is wrapped in Arc for thread safety.
- [ ] Middleware order is correct (outer wraps inner).
- [ ] OpenAPI annotations are complete for all endpoints.
- [ ] File uploads handle size limits.
- [ ] WebSocket handlers have graceful close.
- [ ] CORS configuration matches deployment requirements.
- [ ] Rate limiting applied to public endpoints.
- [ ] Request validation (length, format) applied.
- [ ] Graceful shutdown configured.
- [ ] Integration tests cover main endpoints.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| `State` extractor fails | State type not added to router | Add `.with_state(app_state)` |
| `Extension` not found | Extension not added via middleware | Add `.layer(Extension(value))` |
| Json body extract fails | Missing serde derives or field mismatch | Add `#[derive(Deserialize)]` and match field names |
| CORS errors in browser | CORS middleware not configured | Add `CorsLayer::permissive()` or custom configuration |
| WebSocket upgrade fails | Missing WebSocket support flag | Enable `ws` feature on axum |
| Router merge conflicts | Overlapping route paths | Use `.nest()` for path-prefixed routes |
| Middleware not applied | Layer added after routes | Layers wrap routes they're defined before |
| OpenAPI docs missing | Missing utoipa annotations | Add `#[utoipa::path]` and `#[derive(ToSchema)]` |

## Best Practices

1. Use `State<Arc<AppState>>` for shared state instead of Extension.
2. Define a unified `AppError` type implementing `IntoResponse`.
3. Order middleware: tracing, CORS, compression, auth, routes.
4. Use nested routers for versioned APIs (`/api/v1/...`).
5. Validate request input at the boundary (deserialization, custom extractors).
6. Set appropriate body size limits for Json and Form extractors.
7. Use `axum::serve` with `TcpListener` for graceful shutdown.
8. Document all endpoints with utoipa.
9. Return consistent JSON error responses.
10. Use `with_state` at the outermost router level.

## Anti-Patterns

1. **State as global variable**: Using static mut or global state instead of State extractor.
2. **Panic in handlers**: Unwrapping in handlers; return errors instead.
3. **Missing fallback routes**: Not handling 404 with a custom fallback.
4. **Over-extraction**: Using too many extractors in one handler (max 16).
5. **Synchronous blocking in handlers**: Blocking the async runtime.
6. **Missing request validation**: Trusting user input without validation.
7. **Exposing internal errors**: Returning debug error messages to clients.
8. **Hardcoded config values**: Not using environment variables or config files.

## References

Axum Docs: https://docs.rs/axum/latest/axum/
Axum Examples: https://github.com/tokio-rs/axum/tree/main/examples
Tower Docs: https://docs.rs/tower/latest/tower/
Utoipa Docs: https://docs.rs/utoipa/latest/utoipa/
Axum vs Actix: https://www.shuttle.rs/blog/2024/comparing-actix-and-axum
