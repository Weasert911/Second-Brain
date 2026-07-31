# PostgreSQL-Expert References

## Official Documentation

- **PostgreSQL Docs**: https://www.postgresql.org/docs/ - Official documentation covering all features
- **Index Types**: https://www.postgresql.org/docs/current/indexes-types.html - B-tree, Hash, GiST, GIN, BRIN, SP-GiST
- **EXPLAIN**: https://www.postgresql.org/docs/current/using-explain.html - Query planning and analysis
- **Full-Text Search**: https://www.postgresql.org/docs/current/textsearch.html - tsvector, tsquery, dictionaries, ranking
- **JSON Functions**: https://www.postgresql.org/docs/current/functions-json.html - JSONB operators and functions
- **Window Functions**: https://www.postgresql.org/docs/current/functions-window.html - Window function reference
- **Partitioning**: https://www.postgresql.org/docs/current/ddl-partitioning.html - Range, list, hash partitioning
- **Replication**: https://www.postgresql.org/docs/current/high-availability.html - Streaming and logical replication
- **pg_stat_statements**: https://www.postgresql.org/docs/current/pgstatstatements.html - Query performance monitoring
- **PgBouncer Docs**: https://www.pgbouncer.org/config.html - Connection pooling configuration

## Terminology

1. **MVCC**: Multi-Version Concurrency Control - mechanism for concurrent access with snapshots
2. **VACUUM**: Process that reclaims storage occupied by dead tuples
3. **CTE**: Common Table Expression - temporary result set within a query (WITH clause)
4. **Window Function**: Function that computes values across a set of rows related to the current row
5. **Partial Index**: Index on a subset of rows defined by a WHERE clause
6. **Covering Index**: Index that includes additional columns for index-only scans (INCLUDE)
7. **GIN Index**: Generalized Inverted Index for composite types (JSONB, arrays, full-text)
8. **GiST Index**: Generalized Search Tree for complex data types (full-text, geometry)
9. **BRIN Index**: Block Range Index for large, naturally ordered tables
10. **tsvector**: Text search vector - document format optimized for text search
11. **tsquery**: Text search query - search query format for full-text matching
12. **Isolation Level**: Transaction isolation level controlling visibility of concurrent changes
13. **Advisory Lock**: Application-defined lock that doesn't depend on database rows
14. **WAL**: Write-Ahead Log - ensures data integrity and enables replication
15. **CTID**: Physical location of a row within a table (system column)

## Architecture Notes

- PostgreSQL uses process-per-connection model (each connection spawns a process)
- MVCC creates multiple versions of rows; vacuum removes old versions
- Indexes are separate structures that point to table rows via CTID
- Query planner uses statistics to estimate row counts and choose access methods
- WAL ensures durability; all changes are written to WAL before data files
- Shared buffers cache frequently accessed data pages in memory
- Checkpoints flush dirty buffers to disk; tuning prevents performance spikes

## Key APIs

- `EXPLAIN ANALYZE <query>` - Execute and explain query performance
- `ANALYZE <table>` - Update table statistics for the query planner
- `VACUUM <table>` - Reclaim storage and update visibility map
- `VACUUM ANALYZE <table>` - Both VACUUM and ANALYZE in one command
- `REINDEX INDEX <index>` - Rebuild index to remove bloat
- `CREATE INDEX CONCURRENTLY` - Create index without locking table writes
- `CLUSTER <table> USING <index>` - Physically reorder table by index
- `pg_stat_statements_reset()` - Reset query statistics
- `pg_terminate_backend(pid)` - Terminate a database connection
- `pg_cancel_backend(pid)` - Cancel a running query

## Conventions

- **Table naming**: snake_case, plural nouns (users, orders, products)
- **Column naming**: snake_case (created_at, first_name, is_active)
- **Index naming**: idx_{table}_{column(s)} (idx_users_email, idx_orders_created_at)
- **Constraint naming**: pk_{table}, fk_{table}_{ref_table}, uq_{table}_{column}, chk_{table}_{rule}
- **Primary keys**: UUID preferred (gen_random_uuid()) or identity columns
- **Foreign keys**: REFERENCES {table}({column}) with appropriate ON DELETE
- **Timestamps**: created_at, updated_at with DEFAULT and triggers
- **Boolean**: is_ or has_ prefix (is_active, has_completed)

## Project Structure Recommendation

```
db/
  migrations/
    001_create_users.sql
    002_create_orders.sql
    003_add_fulltext_search.sql
    004_partition_orders.sql
  seeds/
    users.sql
    products.sql
  functions/
    updated_at_trigger.sql
    search_vector_update.sql
  scripts/
    backup.sh
    restore.sh
    analyze.sh
  monitoring/
    queries.sql       # pg_stat_statements queries
    health.sql        # Health check queries
  schema/
    erd.md
    conventions.md
```
