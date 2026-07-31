# Checklists — SQLx-Expert

## Pre-Flight Checklist

- [ ] Database backend chosen (PostgreSQL, MySQL, SQLite)
- [ ] SQLx features selected (postgres/mysql/sqlite, runtime-tokio, migrate, chrono, uuid)
- [ ] DATABASE_URL configured in .env or environment
- [ ] sqlx-cli installed (cargo install sqlx-cli)
- [ ] Database server running for development
- [ ] Migration strategy planned (timestamp-based naming)
- [ ] Offline mode considered for CI

## Implementation Checklist

- [ ] Connection pool created with appropriate size
- [ ] Migrations have both up and down files
- [ ] MIGRATOR added to application startup
- [ ] FromRow structs match table columns
- [ ] Compile-time queries use query! macros where possible
- [ ] QueryBuilder used for dynamic SQL (no string concat)
- [ ] Transactions used for multi-step operations
- [ ] Custom SQLx types implement Type<DB> trait
- [ ] Error handling converts sqlx::Error to app errors
- [ ] Connection pooling configured (min/max connections)
- [ ] Timeouts configured for queries
- [ ] Environment-specific config (dev/staging/prod)

## Testing Checklist

- [ ] sqlx::test attribute used for database tests
- [ ] Each test runs in its own transaction (rollback after)
- [ ] CRUD operations tested for all models
- [ ] Edge cases: empty results, NULL values, duplicate keys
- [ ] Transaction rollback tested
- [ ] Dynamic query builder tested with all filter combinations
- [ ] Custom types tested (round-trip to database)
- [ ] Migration tests (up and down)
- [ ] Concurrent access tests
- [ ] Connection pool exhaustion handled

## Release Checklist

- [ ] offline mode prepared (sqlx-data.json checked in)
- [ ] DATABASE_URL configured in production environment
- [ ] Pool size tuned for production load
- [ ] Migration run as part of deployment
- [ ] Query performance reviewed (EXPLAIN ANALYZE)
- [ ] Indexes created for common queries
- [ ] Database backup strategy in place
- [ ] Connection encryption (TLS) configured
- [ ] Prepared statement caching considered
- [ ] Slow query logging enabled

## Maintenance Checklist

- [ ] Migrations reviewed for backward compatibility
- [ ] Query performance monitored
- [ ] Database connection pool metrics reviewed
- [ ] Old migrations squashed periodically
- [ ] sqlx version checked for updates
- [ ] Database schema documented
- [ ] Dead tuple bloat monitored (PostgreSQL VACUUM)
- [ ] Connection leak detection in place
