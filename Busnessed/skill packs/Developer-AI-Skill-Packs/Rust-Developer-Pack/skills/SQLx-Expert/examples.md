# Examples — SQLx-Expert

## Beginner: Basic Query with FromRow

```rust
use sqlx::FromRow;

#[derive(Debug, FromRow)]
struct User {
    id: i64,
    name: String,
    email: String,
}

async fn get_user(pool: &sqlx::PgPool, user_id: i64) -> Result<User, sqlx::Error> {
    sqlx::query_as::<_, User>(
        "SELECT id, name, email FROM users WHERE id = $1"
    )
    .bind(user_id)
    .fetch_one(pool)
    .await
}
```

**Explanation**: Basic compile-time-safe query using `query_as!` (or `query_as` with runtime SQL). The `FromRow` derive maps column names to struct fields.

## Intermediate: Transaction with Rollback

```rust
use sqlx::{PgPool, Postgres, Transaction};

async fn transfer_funds(
    pool: &PgPool,
    from_id: i64,
    to_id: i64,
    amount: f64,
) -> Result<(), sqlx::Error> {
    let mut tx: Transaction<'_, Postgres> = pool.begin().await?;

    let from_balance: f64 = sqlx::query_scalar(
        "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE"
    )
    .bind(from_id)
    .fetch_one(&mut *tx)
    .await?;

    if from_balance < amount {
        tx.rollback().await?;
        return Err(sqlx::Error::Protocol("Insufficient funds".into()));
    }

    sqlx::query("UPDATE accounts SET balance = balance - $1 WHERE id = $2")
        .bind(amount)
        .bind(from_id)
        .execute(&mut *tx)
        .await?;

    sqlx::query("UPDATE accounts SET balance = balance + $1 WHERE id = $2")
        .bind(amount)
        .bind(to_id)
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;
    Ok(())
}
```

**Explanation**: Transaction with rollback on error. `FOR UPDATE` locks the row for the transaction duration. If funds are insufficient, the transaction is rolled back.

## Advanced: Dynamic Query Building

```rust
use sqlx::QueryBuilder;

#[derive(Debug, sqlx::FromRow)]
struct User { id: i64, name: String, email: String, active: bool }

struct UserFilter {
    name_contains: Option<String>,
    active_only: bool,
    limit: i64,
    offset: i64,
}

async fn search_users(pool: &sqlx::PgPool, filter: UserFilter) -> Result<Vec<User>, sqlx::Error> {
    let mut builder = QueryBuilder::new(
        "SELECT id, name, email, active FROM users WHERE 1=1"
    );

    if let Some(name) = filter.name_contains {
        builder.push(" AND name ILIKE ");
        builder.push_bind(format!("%{name}%"));
    }

    if filter.active_only {
        builder.push(" AND active = true");
    }

    builder.push(" ORDER BY name ASC");
    builder.push(" LIMIT ");
    builder.push_bind(filter.limit);
    builder.push(" OFFSET ");
    builder.push_bind(filter.offset);

    builder.build_query_as::<User>().fetch_all(pool).await
}
```

**Explanation**: QueryBuilder constructs a query dynamically with proper parameter binding (preventing SQL injection). Each `push_bind` adds a parameter placeholder.

## Production: Full Setup with Migrations and Offline Mode

```rust
use sqlx::postgres::PgPoolOptions;
use sqlx::migrate::Migrator;

static MIGRATOR: Migrator = sqlx::migrate!("migrations");

#[derive(Debug, sqlx::FromRow, serde::Serialize, serde::Deserialize)]
struct User {
    id: i64,
    name: String,
    email: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

async fn create_pool(database_url: &str) -> Result<sqlx::PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(20)
        .min_connections(5)
        .connect(database_url)
        .await
}

async fn run_migrations(pool: &sqlx::PgPool) -> Result<(), sqlx::migrate::MigrateError> {
    MIGRATOR.run(pool).await
}

async fn list_users(pool: &sqlx::PgPool) -> Result<Vec<User>, sqlx::Error> {
    sqlx::query_as::<_, User>("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC")
        .fetch_all(pool)
        .await
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")?;
    let pool = create_pool(&database_url).await?;
    run_migrations(&pool).await?;

    let users = list_users(&pool).await?;
    println!("Users: {users:?}");
    Ok(())
}
```

**Explanation**: Production setup with connection pool optimization, runtime migrations, and dotenvy for environment configuration. Run `cargo sqlx prepare` for offline mode.
