---
name: "PostgreSQL-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when designing PostgreSQL schemas, optimizing query performance, implementing full-text search, managing partitions, or debugging database issues"
purpose: "Provides comprehensive guidance for designing efficient, scalable, and reliable PostgreSQL databases with proper indexing, query optimization, and advanced features"
---

## Capabilities

1. Design normalized database schemas with proper relationships, constraints, and data types
2. Implement various index types: B-tree for general purpose, Hash for equality, GiST for full-text/geometric, GIN for JSON/arrays, BRIN for large ordered tables
3. Analyze query performance with EXPLAIN ANALYZE, query plans, and pg_stat_statements
4. Write Common Table Expressions (WITH queries) for complex hierarchical and recursive queries
5. Apply window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, FIRST_VALUE, NTILE) for analytical queries
6. Implement full-text search with tsvector, tsquery, GIN indexes, and ranking
7. Store and query JSON data with JSONB including indexing (GIN, BTREE), operators (@>, ?), and functions
8. Manage transactions with ACID properties, isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE)
9. Implement locking strategies (row-level, table-level, advisory locks) for concurrency control
10. Partition large tables using range, list, and hash partitioning with partition pruning
11. Configure streaming and logical replication for high availability and read scaling
12. Set up connection pooling with PgBouncer or Pgpool for handling many concurrent connections
13. Manage database migrations with version control and rollback strategies
14. Perform backup and restore with pg_dump, pg_restore, and continuous archiving

## Limitations

1. Does not cover NoSQL databases (MongoDB, Cassandra) or NewSQL (CockroachDB)
2. Cloud-specific managed services (RDS, Aurora, Cloud SQL) have platform-specific features not covered
3. High-availability cluster management (Patroni, repmgr) details are environment-specific
4. Does not include comprehensive security auditing or compliance (SOC2, HIPAA)
5. Large-scale sharding solutions (Citus, TimescaleDB) are specialized extensions
6. Performance tuning requires workload-specific testing beyond general recommendations

## Required Tools

- PostgreSQL 14+ (LTS)
- pgAdmin or DBeaver for GUI management
- EXPLAIN ANALYZE for query analysis
- psql command-line tool
- pg_stat_statements extension for monitoring
- PgBouncer or Pgpool for connection pooling
- pg_dump/pg_restore for backup
- Migration tool (Prisma Migrate, Flyway, Sqitch)

## Execution Workflow

1. Analyze data requirements and relationships before schema design
2. Design normalized tables with proper data types, constraints (PK, FK, UNIQUE, CHECK, NOT NULL)
3. Create indexes based on query patterns (WHERE clauses, JOIN conditions, ORDER BY, text search)
4. Write and optimize queries using EXPLAIN ANALYZE to verify index usage
5. Implement views, materialized views, and functions for reusable logic
6. Set up full-text search configuration with dictionaries and stop words
7. Configure JSONB columns for flexible schema requirements with GIN indexes
8. Implement partitioning for large tables based on query patterns
9. Set up connection pooling and configure pool parameters
10. Create migration scripts for schema versioning
11. Configure backup strategy (WAL archiving, pg_dump schedule)
12. Set up monitoring with pg_stat_statements and custom queries
13. Tune PostgreSQL configuration (shared_buffers, work_mem, effective_cache_size)
14. Implement read replicas for scaling read workloads

## Decision Tree

1. **Query performance?** → Slow query → EXPLAIN ANALYZE → Missing index → Create appropriate index → Bad query plan → Rewrite query or update statistics
2. **Data volume?** → Small (< 10M rows) → Standard tables → Medium (10M-100M) → Index optimization → Large (100M+) → Partitioning → Time-series → TimescaleDB extension
3. **Data type need?** → Structured → Normalized tables → Semi-structured → JSONB column → Full-text → tsvector/tsquery → Geospatial → PostGIS extension
4. **Concurrency?** → Read-heavy → Read replicas → Write-heavy → Connection pooling → Mixed → Appropriate isolation level → Contentions → Advisory locks
5. **Search requirement?** → Simple → LIKE/ILIKE with index → Full-text → tsvector + GIN index → Fuzzy → pg_trgm extension → JSON search → JSONB + GIN index
6. **Backup need?** → Development → pg_dump nightly → Production → Continuous archiving (WAL) → High availability → Streaming replication → Disaster recovery → Multi-region replication
7. **Transaction isolation?** → Default → READ COMMITTED → Consistency important → REPEATABLE READ → Financial → SERIALIZABLE → Performance critical → READ UNCOMMITTED (rare)

## Review Checklist

- [ ] All tables have primary keys (preferably UUID or bigserial)
- [ ] Foreign keys have appropriate indexes for JOIN performance
- [ ] Columns use appropriate data types (not all VARCHAR or TEXT)
- [ ] Indexes exist for all query WHERE, JOIN, ORDER BY, and GROUP BY columns
- [ ] No duplicate or unused indexes (redundant index combinations)
- [ ] EXPLAIN ANALYZE shows index scans (not sequential scans) for frequent queries
- [ ] Full-text search uses GIN indexes on tsvector columns
- [ ] JSONB columns have GIN indexes for @> and ? operators
- [ ] Large tables are partitioned by appropriate key
- [ ] Connection pool size configured for workload
- [ ] Shared_buffers, work_mem, and effective_cache_size tuned for hardware
- [ ] Transactions use appropriate isolation levels
- [ ] Migrations are version-controlled and reversible
- [ ] Regular VACUUM and ANALYZE are scheduled

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Slow query despite index | Wrong index type or stale statistics | Run ANALYZE; check index type matches query pattern |
| Full table scan on large table | Missing or unused index | Add index for WHERE/JOIN columns; check index expression match |
| Deadlock detected | Concurrent conflicting transactions | Retry transaction; use consistent lock ordering; reduce transaction scope |
| Connection limit reached | Too many idle connections | Use PgBouncer; reduce max_connections; close idle connections |
| Checkpoint spikes | Too frequent checkpoints | Tune checkpoint parameters (checkpoint_timeout, max_wal_size) |
| MVCC bloat | Long-running transactions or no VACUUM | Set autovacuum properly; avoid long idle in transaction |
| Replication lag | Heavy write load or network | Monitor lag; use synchronous replication for critical data |
| High CPU usage | Expensive queries or missing indexes | Find expensive queries with pg_stat_statements; add indexes |
| Disk space growing | No VACUUM on frequently updated tables | Configure autovacuum for aggressive cleanup on hot tables |
| JSONB query slow | Missing GIN index on JSONB | Create GIN index on JSONB column with proper operator class |

## Best Practices

1. Always use EXPLAIN ANALYZE before optimizing queries
2. Index columns used in WHERE, JOIN, ORDER BY, and GROUP BY clauses
3. Use appropriate index types: B-tree for general, GIN for JSON/arrays, GiST for full-text
4. Keep indexes selective (high cardinality columns)
5. Use partial indexes for frequently filtered subsets of data
6. Use covering indexes (INCLUDE columns) for index-only scans
7. Prefer JSONB over JSON for queryable JSON data
8. Use tsvector/tsquery for full-text search, not LIKE
9. Partition tables over 100M rows by range or hash
10. Use connection pooling for applications with many concurrent connections
11. Set appropriate statement_timeout and lock_timeout
12. Use SERIALIZABLE isolation only when necessary (higher overhead)
13. Schedule regular VACUUM and ANALYZE
14. Use CTEs for recursive queries and readability
15. Monitor with pg_stat_statements and pg_stat_activity

## Anti-Patterns

1. Using SELECT * in production queries (fetching unnecessary columns)
2. Not having primary keys on tables
3. Over-indexing (too many indexes on write-heavy tables)
4. Using VARCHAR without length limits
5. Storing JSON as text instead of JSONB
6. Not using transactions for related operations
7. Ignoring connection pooling in high-traffic applications
8. Running VACUUM during peak hours
9. Using SERIALIZABLE isolation unnecessarily
10. Not monitoring query performance

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
