# PostgreSQL-Expert Snippets

## Snippet 1: EXPLAIN ANALYZE with JSON Output

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT * FROM users WHERE email = 'user@example.com';
```

**When to use**: Detailed query plan analysis with buffer information for performance tuning. Parse the JSON for programmatic analysis.

## Snippet 2: Find Unused Indexes

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename, indexname;
```

**When to use**: Identify indexes that are never used and can be removed to speed up writes.

## Snippet 3: Kill Long-Running Queries

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
  AND query_start < NOW() - INTERVAL '30 minutes'
  AND pid <> pg_backend_pid()
  AND query NOT LIKE '%pg_stat_activity%';
```

**When to use**: Terminate queries that have been running too long and consuming resources.

## Snippet 4: Table Size Information

```sql
SELECT
  relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  pg_size_pretty(pg_relation_size(relid)) AS table_size,
  pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size,
  n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

**When to use**: Monitor database sizes, identify large tables for optimization or partitioning.

## Snippet 5: Recursive Category Tree

```sql
WITH RECURSIVE category_tree AS (
  SELECT id, name, parent_id, 1 AS level, name::text AS path
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, ct.level + 1,
    ct.path || ' > ' || c.name
  FROM categories c
  INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT id, name, level, path
FROM category_tree
ORDER BY path;
```

**When to use**: Hierarchical data like categories, org charts, or nested comments.

## Snippet 6: Paginated Query with Keyset Pagination

```sql
SELECT id, name, created_at
FROM posts
WHERE created_at < (SELECT created_at FROM posts WHERE id = :cursor)
ORDER BY created_at DESC
LIMIT 20;
```

**When to use**: Efficient pagination for large datasets where OFFSET would be slow.

## Snippet 7: Upsert (INSERT ON CONFLICT)

```sql
INSERT INTO users (email, name, password_hash)
VALUES ('new@example.com', 'New User', 'hash123')
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();
```

**When to use**: Insert or update pattern without race conditions.

## Snippet 8: JSONB Query Operators

```sql
-- Existence operator
SELECT * FROM products WHERE metadata ? 'color';

-- Contains operator
SELECT * FROM products WHERE metadata @> '{"color": "red", "size": "M"}';

-- Path access
SELECT metadata->>'color' AS color FROM products;

-- Nested path
SELECT data#>'{address,city}' AS city FROM users;

-- GIN index for JSONB
CREATE INDEX idx_products_metadata ON products USING GIN(metadata jsonb_path_ops);
```

**When to use**: Querying semi-structured data stored in JSONB columns. The `jsonb_path_ops` GIN index is more efficient for `@>` queries.

## Snippet 9: Generate Series for Time Filling

```sql
SELECT
  date_trunc('day', days.d) AS day,
  COALESCE(SUM(orders.total), 0) AS revenue
FROM generate_series(
  '2024-01-01'::date,
  '2024-01-31'::date,
  '1 day'::interval
) AS days(d)
LEFT JOIN orders ON date_trunc('day', orders.created_at) = days.d
GROUP BY day
ORDER BY day;
```

**When to use**: Fill gaps in time-series data for reporting (days with no orders show 0).

## Snippet 10: Moving Average

```sql
SELECT
  date_trunc('day', created_at) AS day,
  COUNT(*) AS orders,
  AVG(COUNT(*)) OVER (
    ORDER BY date_trunc('day', created_at)
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7day
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;
```

**When to use**: Smooth out daily fluctuations in reporting dashboards.

## Snippet 11: Find Duplicate Rows

```sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Remove duplicates keeping the oldest
DELETE FROM users
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) AS rn
    FROM users
  ) t
  WHERE rn > 1
);
```

**When to use**: Data cleanup for tables that accumulated duplicates before unique constraints were added.

## Snippet 12: Query Performance Monitoring

```sql
SELECT
  queryid,
  query,
  calls,
  ROUND(total_exec_time::numeric, 2) AS total_time_ms,
  ROUND(mean_exec_time::numeric, 2) AS avg_time_ms,
  ROUND((shared_blks_hit * 100) / NULLIF(shared_blks_hit + shared_blks_read, 0)::numeric, 2) AS cache_hit_ratio,
  rows,
  ROUND(rows::numeric / NULLIF(calls, 0), 2) AS avg_rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
ORDER BY total_exec_time DESC
LIMIT 20;
```

**When to use**: Identify the most expensive queries in the database for optimization targeting.

## Snippet 13: Add Column with Default Without Locking

```sql
-- PostgreSQL 11+: Adding a column with a non-volatile default does not rewrite the table
ALTER TABLE orders ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD';

-- For very large tables, add as nullable first, then fill in batches, then set NOT NULL
ALTER TABLE orders ADD COLUMN currency VARCHAR(3);
UPDATE orders SET currency = 'USD' WHERE id IN (SELECT id FROM orders WHERE currency IS NULL LIMIT 10000);
-- Repeat until all rows updated
ALTER TABLE orders ALTER COLUMN currency SET NOT NULL;
ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'USD';
```

**When to use**: Adding columns to large production tables without blocking reads/writes.

## Snippet 14: Row-Level Security

```sql
-- Enable RLS on table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own orders
CREATE POLICY user_orders_policy ON orders
  USING (user_id = current_setting('app.current_user_id')::UUID);

-- Admin policy: admins can see all orders
CREATE POLICY admin_orders_policy ON orders
  USING (current_setting('app.user_role') = 'admin');

-- Test
SET app.current_user_id = 'user-123';
SELECT * FROM orders; -- Only user-123's orders
```

**When to use**: Multi-tenant databases where each user should only see their own data.

## Snippet 15: Concurrent Index Creation

```sql
-- Create index without blocking writes
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);

-- Validate the index
SELECT * FROM pg_indexes WHERE indexname = 'idx_orders_user_id';

-- Drop old index if replacing
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_user_id_old;
```

**When to use**: Adding indexes to production tables that cannot afford downtime. CONCURRENTLY allows reads/writes during index creation.
