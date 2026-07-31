# Snippets — SQLx-Expert

## 1. Compile-Time Checked Query

```rust
let user = sqlx::query_as::<_, User>(
    "SELECT id, name, email FROM users WHERE id = $1"
)
.bind(user_id)
.fetch_one(&pool)
.await?;
```

**Usage**: Use `query_as!` for compile-time verification. `query_as` without `!` for runtime-checked queries.

## 2. Retrieve Single Row (Optional)

```rust
let user: Option<User> = sqlx::query_as::<_, User>(
    "SELECT * FROM users WHERE email = $1"
)
.bind(email)
.fetch_optional(&pool)
.await?;
```

**Usage**: `fetch_optional` returns None when no rows match, vs `fetch_one` which errors on no rows.

## 3. Scalar Query

```rust
let count: i64 = sqlx::query_scalar(
    "SELECT COUNT(*) FROM users WHERE active = $1"
)
.bind(true)
.fetch_one(&pool)
.await?;
```

**Usage**: Fetch a single column value. Supports compile-time check with `query_scalar!`.

## 4. Insert and Return

```rust
let user = sqlx::query_as::<_, User>(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *"
)
.bind(&new_user.name)
.bind(&new_user.email)
.fetch_one(&pool)
.await?;
```

**Usage**: PostgreSQL RETURNING clause returns the inserted row. MySQL uses LAST_INSERT_ID().

## 5. Transaction with Commit/Rollback

```rust
let mut tx = pool.begin().await?;
match operation(&mut tx).await {
    Ok(result) => { tx.commit().await?; Ok(result) }
    Err(e) => { tx.rollback().await?; Err(e) }
}
```

**Usage**: Begin a transaction, perform operations, then commit or rollback based on success.

## 6. Dynamic QueryBuilder

```rust
let mut qb = QueryBuilder::new("SELECT * FROM users WHERE 1=1");
if let Some(name) = filter.name {
    qb.push(" AND name ILIKE ").push_bind(format!("%{name}%"));
}
qb.push(" LIMIT ").push_bind(limit);
qb.push(" OFFSET ").push_bind(offset);
let users: Vec<User> = qb.build_query_as().fetch_all(&pool).await?;
```

**Usage**: Build dynamic queries safely. Each `push_bind` adds a parameterized value.

## 7. Connection Pool Creation

```rust
let pool = PgPoolOptions::new()
    .max_connections(20)
    .min_connections(5)
    .acquire_timeout(Duration::from_secs(30))
    .connect(&database_url)
    .await?;
```

**Usage**: Configure pool with appropriate sizes. `acquire_timeout` prevents hanging on pool exhaustion.

## 8. Run Migrations at Startup

```rust
static MIGRATOR: Migrator = sqlx::migrate!("migrations");

MIGRATOR.run(&pool).await?;
```

**Usage**: Run pending migrations at application startup. The `Migrator` is a static that reads migration files at compile time.

## 9. Custom PostgreSQL Enum Type

```rust
#[derive(Debug, Clone, sqlx::Type)]
#[sqlx(type_name = "user_role", rename_all = "lowercase")]
enum UserRole { Admin, User, Guest }
```

**Usage**: Map a PostgreSQL ENUM to a Rust enum. The `type_name` must match the database ENUM name.

## 10. JSONB Column with Serde

```rust
#[derive(Debug, sqlx::FromRow)]
struct Event {
    id: i64,
    #[sqlx(json)]
    metadata: serde_json::Value,
}
```

**Usage**: Use `#[sqlx(json)]` attribute to deserialize JSONB columns automatically via serde.

## 11. Batch Insert

```rust
let mut qb = QueryBuilder::new("INSERT INTO users (name, email) ");
qb.push_values(users.iter(), |mut b, user| {
    b.push_bind(&user.name).push_bind(&user.email);
});
qb.build().execute(&pool).await?;
```

**Usage**: Efficient batch inserts using QueryBuilder's `push_values` method.

## 12. Raw Query Execution

```rust
sqlx::query("UPDATE users SET active = false WHERE last_login < $1")
    .bind(six_months_ago)
    .execute(&pool)
    .await?;
```

**Usage**: Execute a query without returning rows. Use for UPDATE, DELETE, or INSERT without RETURNING.

## 13. Savepoint Within Transaction

```rust
let mut tx = pool.begin().await?;
let savepoint = tx.begin().await?; // creates savepoint
sqlx::query("UPDATE ...").execute(&mut *tx).await?;
tx.commit().await?; // main transaction commit
```

**Usage**: Nested transactions in SQLx create savepoints. Partial rollback with `tx.rollback()` rolls back to the savepoint.

## 14. Custom Type Implementation

```rust
struct MyPoint { x: f64, y: f64 }

impl sqlx::Type<sqlx::Postgres> for MyPoint {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("point")
    }
}
```

**Usage**: Implement `Type` for custom database types. Requires implementing `Encode` and `Decode` as well.

## 15. Database Test with SQLx

```rust
#[sqlx::test]
async fn test_create_user(pool: sqlx::PgPool) {
    let user = create_user(&pool, "test@test.com").await.unwrap();
    assert_eq!(user.email, "test@test.com");
}
```

**Usage**: `#[sqlx::test]` creates a test database, runs migrations, and provides a pool. Tests run in transactions that roll back.
