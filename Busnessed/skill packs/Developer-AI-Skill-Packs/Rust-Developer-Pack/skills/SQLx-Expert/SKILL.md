---
name: "SQLx-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate SQLx expert skill for compile-time checked SQL, database migrations, connection pooling, transactions, and multi-DBMS support."
purpose: "Provides authoritative guidance on database access with SQLx, including compile-time query verification, migration management, connection pooling strategies, transaction handling, dynamic query building, and multi-database support across PostgreSQL, MySQL, and SQLite."
---

## Capabilities

1. Use compile-time checked queries with query!, query_as!, query_scalar! macros for SQL verification at build time.
2. Implement custom SQLx types for database-specific column types.
3. Manage database migrations with CLI and runtime execution.
4. Configure and manage connection pools (PgPool, MySqlPool, SqlitePool).
5. Handle transactions with begin, commit, rollback, and savepoints.
6. Build dynamic queries with QueryBuilder for flexible WHERE clauses.
7. Use offline mode with cargo sqlx prepare for CI/CD environments without a database.
8. Work with PostgreSQL-specific features: arrays, enums, INTERVAL, JSON/JSONB, UUID.
9. Work with MySQL-specific features and SQLite-specific features.
10. Handle errors with sqlx::Error and custom error mapping.
11. Test database code with test databases and isolated test transactions.
12. Integrate logging and tracing for query performance monitoring.

## Limitations

1. Cannot execute database queries — provides code design and configuration guidance only.
2. Does not cover diesel, sea-orm, or other ORM frameworks.
3. Limited to SQLx 0.7+ API patterns.
4. Database-specific features limited to widely-used types.

## Required Tools

- SQLx crate with appropriate feature flags (postgres, mysql, sqlite, runtime-tokio)
- sqlx-cli for migration management
- cargo sqlx prepare for offline mode
- Database server (PostgreSQL, MySQL, or SQLite) for development

## Execution Workflow

1. Determine database backend (PostgreSQL, MySQL, SQLite).
2. Add sqlx with correct features to Cargo.toml.
3. Set up database connection URL (environment variable or config file).
4. Create initial migration with sqlx migrate add.
5. Write SQL migration files (up and down).
6. Create Rust structs matching database schema with FromRow derive.
7. Write compile-time checked queries with query_as! or query!.
8. Create connection pool and integrate with application state.
9. Implement CRUD operations with queries.
10. Add transaction support for atomic operations.
11. Implement dynamic queries with QueryBuilder where needed.
12. Run cargo sqlx prepare for offline builds.
13. Write tests with test database and transaction rollback.
14. Set up logging and monitoring.

## Decision Tree

1. **Which database?**
   - PostgreSQL → Use sqlx with postgres feature, leverage array, enum, JSONB types.
   - MySQL → Use sqlx with mysql feature.
   - SQLite → Use sqlx with sqlite feature (no connection pooling needed for file-based).

2. **Is compile-time verification needed?**
   - YES → Use query! macros with DATABASE_URL set.
   - NO → Use query_as::<T>() with runtime string queries.

3. **Is offline build needed?**
   - YES → Run cargo sqlx prepare and check in sqlx-data.json.
   - NO → Direct database connection at compile time.

4. **Are custom SQL types needed?**
   - YES → Implement Type<DB> for custom types.
   - NO → Built-in types suffice.

5. **Is dynamic query building needed?**
   - YES → Use QueryBuilder for dynamic WHERE/ORDER BY.
   - NO → Static SQL with query! macros.

6. **Is transaction isolation needed?**
   - YES → Use begin(), commit(), rollback() with isolation levels.
   - NO → Single queries are fine.

## Review Checklist

- [ ] DATABASE_URL configured for development and CI.
- [ ] SQLx features match the database backend.
- [ ] Migrations are reversible (up + down for each).
- [ ] Compile-time queries use correct parameter types.
- [ ] FromRow structs match table column types.
- [ ] Connection pool size is appropriate for workload.
- [ ] Transactions handle errors with rollback.
- [ ] Dynamic queries use QueryBuilder with proper parameterization (no SQL injection).
- [ ] Offline mode data checked in (sqlx-data.json).
- [ ] Error handling converts sqlx::Error to application errors.
- [ ] Test databases use transaction rollback for isolation.
- [ ] Logging/tracing integrated for slow query detection.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "can't find column" in compile-time query | Column missing or typo | Check SQL and schema match |
| Prepare error: no DATABASE_URL | Environment variable not set | Export DATABASE_URL or use .env |
| Pool timeout waiting for connection | All connections in use | Increase pool size, check connection leaks |
| Migration not found | Migration directory path | Check migrations/ directory location |
| Type mismatch in query | Rust type doesn't match SQL column | Check column types and Rust types |
| Offline mode: query not prepared | Need to re-run cargo sqlx prepare | Run prepare after schema changes |
| Transaction rollback not working | Error type doesn't propagate | Use ? operator for transaction errors |
| Connection refused | Database server not running | Start database or check connection URL |

## Best Practices

1. Always use compile-time checked queries (query!, query_as!, etc.) for static SQL.
2. Use QueryBuilder for dynamic parts, never string concatenation.
3. Wrap related operations in transactions for atomicity.
4. Set appropriate pool sizes (min_connections, max_connections).
5. Use offline mode for CI/CD to avoid database dependency at build time.
6. Write down migrations for every schema change.
7. Use FROM row derive with rename_all = "camelCase" for API JSON compatibility.
8. Convert sqlx::Error to application-specific errors at the boundary.
9. Use `ENUM` types in PostgreSQL with custom Rust enums via sqlx::Type.
10. Log slow queries with tracing for performance monitoring.

## Anti-Patterns

1. **String interpolation in queries**: Risk of SQL injection — always use parameterized queries.
2. **No connection pooling**: Creating a new connection for every request.
3. **Ignoring transaction errors**: Not rolling back on error.
4. **Giant migrations**: Single migration with many changes — small, incremental migrations.
5. **Hardcoded DATABASE_URL**: Committing credentials to version control.
6. **Not using offline mode**: Breaking CI builds because no database is available.
7. **Missing FromRow**: Manually mapping result rows instead of using derive.
8. **Exposing database errors to clients**: Returning raw sqlx::Error in HTTP responses.

## References

SQLx Docs: https://docs.rs/sqlx/latest/sqlx/
SQLx GitHub: https://github.com/launchbadge/sqlx
SQLx CLI Guide: https://github.com/launchbadge/sqlx/blob/main/sqlx-cli/README.md
SQLx Offline Mode: https://docs.rs/sqlx/latest/sqlx/macro.query.html#offline-mode
PostgreSQL Docs: https://www.postgresql.org/docs/
MySQL Docs: https://dev.mysql.com/doc/
SQLite Docs: https://www.sqlite.org/docs.html
