# Snippets — Axum-Expert

## 1. Router with State

```rust
let app = Router::new()
    .route("/users", get(list_users))
    .with_state(Arc::new(AppState::default()));
```

**Usage**: Always use `State<Arc<AppState>>` for shared mutable state. Pass the Arc at the topmost router level.

## 2. Json Extractor and Response

```rust
async fn create_user(Json(user): Json<CreateUser>) -> impl IntoResponse {
    let id = insert_user(user);
    (StatusCode::CREATED, Json(json!({ "id": id })))
}
```

**Usage**: Extract JSON body with `Json<T>` extractor. Return JSON with `Json(...)` wrapped in tuple with status.

## 3. Path and Query Parameters

```rust
async fn get_item(Path(id): Path<u64>, Query(params): Query<HashMap<String, String>>) -> impl IntoResponse {
    format!("Item {id} with params {params:?}")
}
```

**Usage**: Extract path parameters with `Path<T>` and query strings with `Query<T>`.

## 4. Unified Error Handling

```rust
enum AppError {
    NotFound(String),
    BadRequest(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match self {
            AppError::NotFound(m) => (StatusCode::NOT_FOUND, m),
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m),
        };
        (status, Json(json!({ "error": msg }))).into_response()
    }
}
```

**Usage**: Implement `IntoResponse` for your error enum to get consistent JSON error responses.

## 5. Custom Middleware

```rust
async fn timing_middleware<B>(
    req: Request<B>,
    next: Next<B>,
) -> impl IntoResponse {
    let start = Instant::now();
    let response = next.run(req).await;
    println!("Request took: {:?}", start.elapsed());
    response
}

// Usage: .layer(middleware::from_fn(timing_middleware))
```

**Usage**: Create reusable middleware with `from_fn`. Middleware wraps all inner routes.

## 6. WebSocket Handler

```rust
async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| async move {
        let (mut sender, mut receiver) = socket.split();
        while let Some(Ok(Message::Text(text))) = receiver.next().await {
            sender.send(Message::Text(format!("Echo: {text}"))).await.unwrap();
        }
    })
}
```

**Usage**: Upgrade HTTP to WebSocket. Split for concurrent read/write. Handle lifecycle with stream.

## 7. Multipart Upload

```rust
async fn upload(mut multipart: Multipart) -> Result<Json<Value>, AppError> {
    let mut files = vec![];
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        let data = field.bytes().await.unwrap();
        files.push(json!({ "name": name, "size": data.len() }));
    }
    Ok(Json(json!({ "files": files })))
}

// Route: .route("/upload", post(upload))
```

**Usage**: Process file uploads. Each field is iterated from the multipart stream.

## 8. OpenAPI Annotation

```rust
#[utoipa::path(
    get,
    path = "/items/{id}",
    responses(
        (status = 200, description = "Item found", body = Item),
        (status = 404, description = "Item not found"),
    ),
)]
async fn get_item(Path(id): Path<u64>) -> impl IntoResponse { todo!() }
```

**Usage**: Annotate handlers with `#[utoipa::path]` for automatic OpenAPI spec generation.

## 9. Static Files Serving

```rust
use tower_http::services::ServeDir;

let app = Router::new()
    .route("/api/...", get(handler))
    .nest_service("/static", ServeDir::new("static/"));
```

**Usage**: Serve static files from a directory using `ServeDir` from tower-http.

## 10. CORS Configuration

```rust
use tower_http::cors::{CorsLayer, Any};

let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);

let app = Router::new().layer(cors);
```

**Usage**: Configure CORS for cross-origin requests. Use `Any` for development; restrict for production.

## 11. Graceful Shutdown

```rust
axum::serve(listener, app)
    .with_graceful_shutdown(async {
        signal::ctrl_c().await.ok();
    })
    .await
    .unwrap();
```

**Usage**: Gracefully shutdown on Ctrl+C, allowing in-flight requests to complete.

## 12. Timeout Middleware

```rust
use tower_http::timeout::TimeoutLayer;
use std::time::Duration;

let app = Router::new()
    .route("/slow", get(slow_handler))
    .layer(TimeoutLayer::new(Duration::from_secs(30)));
```

**Usage**: Set request timeouts to prevent long-running requests from blocking resources.

## 13. Request Tracing

```rust
use tower_http::trace::TraceLayer;

let app = Router::new()
    .route("/api", get(api_handler))
    .layer(TraceLayer::new_for_http());
```

**Usage**: Log all incoming requests with method, URI, status code, and duration.

## 14. Connection State with AppState

```rust
struct AppState {
    db: PgPool,
    config: Config,
}

let state = Arc::new(AppState { db, config });
let app = Router::new()
    .route("/users", get(list_users))
    .with_state(state);
```

**Usage**: Bundle all shared resources (DB pool, config, caches) into a single state struct.

## 15. Fallback 404 Handler

```rust
async fn fallback_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, Json(json!({ "error": "Not found" })))
}

let app = Router::new()
    .route("/api", get(api_handler))
    .fallback(fallback_404);
```

**Usage**: Provide a custom 404 response instead of the default empty message.
