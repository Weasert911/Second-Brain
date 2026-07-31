# References — Axum-Expert

## Official Documentation

- [Axum API Docs](https://docs.rs/axum/latest/axum/) — complete API reference
- [Axum Examples Repo](https://github.com/tokio-rs/axum/tree/main/examples) — example applications
- [Axum Guide](https://docs.rs/axum/latest/axum/guide/index.html) — framework guide
- [Tower Docs](https://docs.rs/tower/latest/tower/) — middleware service abstraction
- [Tower-HTTP Docs](https://docs.rs/tower-http/latest/tower_http/) — HTTP-specific middleware
- [Utoipa Docs](https://docs.rs/utoipa/latest/utoipa/) — OpenAPI documentation
- [Tokio Docs](https://docs.rs/tokio/latest/tokio/) — async runtime

## Key Terms

1. **Router**: The main routing component that maps paths to handlers.
2. **Extractor**: A type that extracts data from the request (Path, Query, Json, etc.).
3. **Handler**: An async function that processes requests and returns responses.
4. **IntoResponse**: A trait for converting values into HTTP responses.
5. **State**: Application state shared across handlers via the extractor.
6. **Extension**: Middleware-extracted request extensions.
7. **Middleware**: A service that wraps other services for cross-cutting concerns.
8. **Layer**: A factory for creating middleware.
9. **Nested Router**: A router mounted at a path prefix.
10. **WebSocket**: A bidirectional communication protocol upgrade.
11. **OpenAPI**: A specification for REST API documentation.
12. **CORS**: Cross-Origin Resource Sharing middleware.
13. **Rate Limiting**: Limiting the number of requests per time window.
14. **Graceful Shutdown**: Allowing in-flight requests to complete before stopping.
15. **Multipart**: File upload handling.

## Architecture Notes

Axum is built on Tower, a generic service abstraction. Each handler is converted into a Service. Extractors implement FromRequestParts or FromRequest. Middleware are Tower Layers that wrap services. The Router is a collection of paths to method-routed handler services. State is stored in the router's extension map and retrieved via the State extractor.

## Key APIs

- `axum::Router::new().route(path, method_handler).with_state(state)`
- `axum::extract::{Path, Query, Json, Form, Extension, State, Multipart, WebSocketUpgrade}`
- `axum::response::{IntoResponse, Json, Html, Redirect, StatusCode}`
- `axum::error_handling::{HandleError, HandleErrorLayer}`
- `axum::middleware::{from_fn, from_fn_with_state, from_extractor}`
- `tower_http::cors::CorsLayer`
- `tower_http::compression::CompressionLayer`
- `tower_http::trace::TraceLayer`
- `tower_http::timeout::TimeoutLayer`
- `utoipa::OpenApi`, `utoipa::ToSchema`, `utoipa::path`

## Conventions

- Routes defined as: `Router::new().route("/users", get(list_users).post(create_user))`
- State type: `State<Arc<AppState>>`
- Error type: `AppError` implementing `IntoResponse`
- Module structure: `routes/` directory with one file per resource
- Handler naming: `list_{resource}`, `get_{resource}`, `create_{resource}`, `update_{resource}`, `delete_{resource}`

## Project Structure

```
web_app/
├── Cargo.toml
├── src/
│   ├── main.rs           # server setup and startup
│   ├── lib.rs            # app creation function
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── users.rs
│   │   ├── posts.rs
│   │   └── ws.rs
│   ├── models.rs         # request/response types
│   ├── error.rs          # error handling
│   ├── state.rs          # application state
│   ├── middleware/
│   │   ├── mod.rs
│   │   └── auth.rs
│   └── docs.rs           # OpenAPI configuration
├── tests/
│   └── integration.rs
└── examples/
    └── client.rs
```
