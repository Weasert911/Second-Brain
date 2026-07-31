# Templates — Axum-Expert

## Template 1: Basic Router with State

```rust
use axum::{Router, routing::get, extract::State};
use std::sync::Arc;

struct AppState { {{field}}: {{field_type}} }

async fn handler(State(state): State<Arc<AppState>>) -> &'static str {
    "Hello"
}

fn app() -> Router {
    let state = Arc::new(AppState { {{field}}: {{default_value}} });
    Router::new()
        .route("/{{path}}", get(handler))
        .with_state(state)
}
```

## Template 2: CRUD Resource

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post, put, delete},
    Json, Router,
};
use serde::{Serialize, Deserialize};
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct {{Resource}} { id: u64, {{fields}} }

#[derive(Debug, Deserialize)]
struct Create{{Resource}} { {{create_fields}} }

#[derive(Default)]
struct AppState { items: RwLock<Vec<{{Resource}}>> }

async fn list(State(state): State<Arc<AppState>>) -> Json<Vec<{{Resource}}>> {
    Json(state.items.read().await.clone())
}

async fn get(State(state): State<Arc<AppState>>, Path(id): Path<u64>) -> impl IntoResponse {
    let items = state.items.read().await;
    items.iter().find(|i| i.id == id).map(|i| Json(i.clone()).into_response())
        .unwrap_or(StatusCode::NOT_FOUND.into_response())
}

async fn create(State(state): State<Arc<AppState>>, Json(input): Json<Create{{Resource}}>) -> impl IntoResponse {
    let mut items = state.items.write().await;
    let id = items.len() as u64 + 1;
    let item = {{Resource}} { id, {{field_init}} };
    items.push(item.clone());
    (StatusCode::CREATED, Json(item))
}

async fn remove(State(state): State<Arc<AppState>>, Path(id): Path<u64>) -> StatusCode {
    state.items.write().await.retain(|i| i.id != id);
    StatusCode::NO_CONTENT
}

pub fn routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/{{resources}}", get(list).post(create))
        .route("/{{resources}}/:id", get(get).delete(remove))
}
```

## Template 3: Error Handling

```rust
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    BadRequest(String),
    Internal(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound(m) => (StatusCode::NOT_FOUND, m),
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m),
            AppError::Internal(m) => (StatusCode::INTERNAL_SERVER_ERROR, m),
        };
        (status, Json(serde_json::json!({ "error": message }))).into_response()
    }
}

impl From<anyhow::Error> for AppError {
    fn from(e: anyhow::Error) -> Self { AppError::Internal(e.to_string()) }
}
```

## Template 4: Authentication Middleware

```rust
use axum::{
    extract::{FromRequestParts, Request},
    http::{request::Parts, StatusCode},
    middleware::{from_fn, Next},
    response::{IntoResponse, Response},
};

pub struct AuthUser { pub id: String, pub role: String }

impl<S> FromRequestParts<S> for AuthUser where S: Send + Sync {
    type Rejection = (StatusCode, &'static str);
    async fn from_request_parts(parts: &mut Parts, _: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts.headers
            .get("Authorization")
            .and_then(|v| v.to_str().ok())
            .and_then(|v| v.strip_prefix("Bearer "));
        match auth_header {
            Some(token) if token == "{{valid_token}}" => {
                Ok(AuthUser { id: "user1".into(), role: "admin".into() })
            }
            _ => Err((StatusCode::UNAUTHORIZED, "Invalid token")),
        }
    }
}

pub async fn auth_middleware<B>(
    req: Request<B>,
    next: Next<B>,
) -> Result<impl IntoResponse, (StatusCode, &'static str)> {
    let _user = AuthUser::from_request_parts(&mut req.method().into(), &())
        .await?;
    Ok(next.run(req).await)
}
```

## Template 5: WebSocket Handler

```rust
use axum::extract::ws::{Message, WebSocket, WebSocketUpgrade};
use futures::stream::StreamExt;

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    // optionally: State(state),
) -> impl axum::response::IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = match msg {
            Ok(Message::Text(text)) => Message::Text(format!("echo: {text}")),
            Ok(Message::Close(_)) => break,
            _ => continue,
        };
        if socket.send(msg).await.is_err() { break; }
    }
}
```

## Template 6: Multipart Upload

```rust
use axum::extract::Multipart;

pub async fn upload_handler(mut multipart: Multipart) -> Result<Json<serde_json::Value>, (StatusCode, &'static str)> {
    let mut files = Vec::new();
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap_or("").to_string();
        let data = field.bytes().await.unwrap();
        files.push(serde_json::json!({ "name": name, "size": data.len() }));
    }
    Ok(Json(serde_json::json!({ "files": files })))
}
```

## Template 7: OpenAPI with Utoipa

```rust
use utoipa::{OpenApi, ToSchema, IntoParams};

#[derive(OpenApi)]
#[openapi(
    paths({{handler1}}, {{handler2}}),
    components(schemas({{Schema1}}, {{Schema2}})),
    tags((name = "{{tag}}", description = "{{description}}")),
)]
pub struct ApiDoc;

// On handler:
// #[utoipa::path(
//     get, path = "/{{path}}",
//     responses((status = 200, body = {{ResponseType}}))
// )]
```

## Template 8: Graceful Shutdown

```rust
use axum::Router;
use tokio::signal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let app = Router::new(){{routes}};
    let listener = tokio::net::TcpListener::bind("{{addr}}").await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    Ok(())
}

async fn shutdown_signal() {
    signal::ctrl_c().await.unwrap();
    println!("Shutdown signal received");
}
```
