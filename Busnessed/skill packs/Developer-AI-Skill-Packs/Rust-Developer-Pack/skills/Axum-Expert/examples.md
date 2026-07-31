# Examples — Axum-Expert

## Beginner: REST API with In-Memory Store

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct User { id: u64, name: String }

#[derive(Default)]
struct AppState { users: RwLock<HashMap<u64, User>> }

async fn list_users(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let users = state.users.read().await;
    Json(users.values().cloned().collect::<Vec<_>>())
}

async fn get_user(State(state): State<Arc<AppState>>, Path(id): Path<u64>) -> impl IntoResponse {
    let users = state.users.read().await;
    match users.get(&id) {
        Some(user) => Json(user.clone()).into_response(),
        None => StatusCode::NOT_FOUND.into_response(),
    }
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::default());
    let app = Router::new()
        .route("/users", get(list_users))
        .route("/users/:id", get(get_user))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

**Explanation**: Basic REST API with two endpoints. Uses `State<Arc<AppState>>` for shared state with RwLock for concurrent access. `IntoResponse` converts Json or StatusCode to responses.

## Intermediate: Error Handling and Middleware

```rust
use axum::{
    extract::State, http::StatusCode, middleware, response::IntoResponse,
    routing::get, Json, Router,
};
use serde::Serialize;
use std::sync::Arc;

#[derive(Debug)]
struct AppError(anyhow::Error);

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let body = serde_json::json!({ "error": self.0.to_string() });
        (StatusCode::INTERNAL_SERVER_ERROR, Json(body)).into_response()
    }
}

impl<E: Into<anyhow::Error>> From<E> for AppError {
    fn from(err: E) -> Self { AppError(err.into()) }
}

async fn handler() -> Result<Json<serde_json::Value>, AppError> {
    let data = std::fs::read_to_string("config.json")?;
    let value: serde_json::Value = serde_json::from_str(&data)?;
    Ok(Json(value))
}

async fn logging_middleware<B>(
    req: axum::http::Request<B>,
    next: axum::middleware::Next<B>,
) -> impl IntoResponse {
    let start = std::time::Instant::now();
    let method = req.method().clone();
    let uri = req.uri().clone();
    let response = next.run(req).await;
    println!("{method} {uri} took {:?}", start.elapsed());
    response
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/config", get(handler))
        .layer(middleware::from_fn(logging_middleware));
    // ...
}
```

**Explanation**: Unified error handling with `AppError` implementing `IntoResponse`. Middleware wraps all routes with logging. `anyhow::Error` is used as the internal error type.

## Advanced: Full Production Server with Auth and OpenAPI

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{delete, get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use utoipa::{OpenApi, ToSchema, IntoParams};
use utoipa::openapi::security::{ApiKey, ApiKeyValue, SecurityScheme};
use utoipa_swagger_ui::SwaggerUi;

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
struct Item { id: u64, name: String, price: f64 }

#[derive(Debug, Deserialize, ToSchema)]
struct CreateItem { name: String, price: f64 }

#[derive(Default)]
struct AppState { items: RwLock<Vec<Item>> }

#[derive(OpenApi)]
#[openapi(paths(list_items, create_item, delete_item), components(schemas(Item, CreateItem)))]
struct ApiDoc;

#[utoipa::path(get, path = "/items", responses((status = 200, body = Vec<Item>)))]
async fn list_items(State(state): State<Arc<AppState>>) -> Json<Vec<Item>> {
    Json(state.items.read().await.clone())
}

#[utoipa::path(post, path = "/items", request_body = CreateItem, responses((status = 201, body = Item)))]
async fn create_item(State(state): State<Arc<AppState>>, Json(input): Json<CreateItem>) -> impl IntoResponse {
    let mut items = state.items.write().await;
    let id = items.len() as u64 + 1;
    let item = Item { id, name: input.name, price: input.price };
    items.push(item.clone());
    (StatusCode::CREATED, Json(item))
}

#[utoipa::path(delete, path = "/items/{id}", params(("id" = u64, Path)), responses((status = 204)))]
async fn delete_item(State(state): State<Arc<AppState>>, Path(id): Path<u64>) -> impl IntoResponse {
    let mut items = state.items.write().await;
    items.retain(|i| i.id != id);
    StatusCode::NO_CONTENT
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::default());
    let app = Router::new()
        .route("/items", get(list_items).post(create_item))
        .route("/items/:id", delete(delete_item))
        .layer(tower_http::cors::CorsLayer::permissive())
        .layer(tower_http::trace::TraceLayer::new_for_http())
        .layer(tower_http::compression::CompressionLayer::new())
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

**Explanation**: Production-grade server with OpenAPI docs via utoipa, CORS middleware, request tracing, response compression, and Swagger UI at `/swagger-ui`.
