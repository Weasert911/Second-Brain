# PostgreSQL-Expert Checklists

## Pre-Flight Checklist

- [ ] PostgreSQL version selected (14+ recommended for latest features)
- [ ] Server hardware sized appropriately (CPU, RAM, disk I/O for workload)
- [ ] PostgreSQL configuration tuned (shared_buffers, work_mem, effective_cache_size)
- [ ] Extensions installed (pg_stat_statements for monitoring, pgcrypto for gen_random_uuid)
- [ ] Connection pooling strategy chosen (PgBouncer or application-level)
- [ ] Backup strategy defined (pg_dump schedule, WAL archiving)
- [ ] Monitoring set up (pg_stat_statements, custom health queries)
- [ ] Migration tool chosen (Prisma Migrate, Flyway, Sqitch)
- [ ] Migration directory structure created with versioning
- [ ] Database naming conventions documented

## Implementation Checklist

- [ ] All tables have primary keys (UUID recommended)
- [ ] Foreign keys indexed for JOIN performance
- [ ] Columns use appropriate data types (not all TEXT or VARCHAR)
- [ ] CHECK constraints for data integrity (positive prices, valid status values)
- [ ] UNIQUE constraints for deduplication (email, slugs)
- [ ] NOT NULL for required columns
- [ ] DEFAULT values for timestamp columns
- [ ] Indexes match WHERE, JOIN, ORDER BY query patterns
- [ ] Partial indexes for frequently filtered subsets
- [ ] Composite indexes for multi-column queries
- [ ] Full-text search uses GIN indexes on tsvector
- [ ] JSONB columns have GIN indexes for query operators
- [ ] Large tables (> 100M rows) partitioned by range or hash
- [ ] Migrations version-controlled and reversible
- [ ] Triggers for updated_at timestamps

## Testing Checklist

- [ ] All queries analyzed with EXPLAIN ANALYZE
- [ ] Indexes used in execution plans (index scans, not sequential scans on large tables)
- [ ] N+1 queries detected and eliminated with JOINs or batching
- [ ] Insert/update performance acceptable for expected load
- [ ] Concurrent write tests pass without deadlocks
- [ ] Partition pruning verified on partitioned tables
- [ ] Full-text search returns relevant results (ts_rank ordering)
- [ ] JSONB queries use GIN index (verify with EXPLAIN)
- [ ] Connection pooling handles expected concurrency
- [ ] Read replicas maintain acceptable lag
- [ ] Backup and restore tested (restore from backup)
- [ ] Migration rollback tested (down migrations work)
- [ ] Data integrity verified (constraints, triggers, cascades)
- [ ] Performance under load tested (response times, connection count)

## Release Checklist

- [ ] All migrations run and verified against target database
- [ ] Rollback migration scripts ready for each new migration
- [ ] Index creation tested (CONCURRENTLY for production)
- [ ] VACUUM and ANALYZE run after data migration
- [ ] Connection pooling configuration deployed
- [ ] Backup tested and verified
- [ ] Monitoring queries deployed
- [ ] pg_stat_statements reset for new version tracking
- [ ] Database configuration tuned for production hardware
- [ ] Statement timeout set (statement_timeout)
- [ ] Connection limits configured (max_connections)
- [ ] Read replica lag monitoring set up if replicas used
- [ ] Changelog updated with schema changes

## Maintenance Checklist

- [ ] Table bloat monitored monthly (pg_stat_user_tables)
- [ ] Index bloat checked (unused or oversized indexes)
- [ ] Long-running queries reviewed weekly
- [ ] Cache hit ratio monitored (target > 99%)
- [ ] Connection usage trends tracked
- [ ] VACUUM frequency tuned based on update activity
- [ ] Autovacuum settings reviewed per table
- [ ] Partition maintenance scheduled (new partitions, detach old)
- [ ] Replication lag monitored if replicas used
- [ ] Backup integrity verified monthly
- [ ] WAL archiving space usage monitored
- [ ] Performance regression checks run after schema changes
