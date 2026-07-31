# PostgreSQL-Expert Examples

## Beginner: Basic Schema and Indexes

**Description**: A normalized e-commerce schema with proper indexes and constraints.

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = true;

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category_id UUID NOT NULL REFERENCES categories(id),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_published ON products(is_published) WHERE is_published = true;

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

**Explanation**: This demonstrates proper data types (UUID, TIMESTAMPTZ, DECIMAL), constraints (CHECK, NOT NULL, UNIQUE, DEFAULT), partial indexes for active users and published products, and foreign key indexes for JOIN performance.

## Intermediate: Full-Text Search and Window Functions

**Description**: Full-text search setup and analytical queries with window functions.

```sql
-- Add full-text search to products
ALTER TABLE products ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_search
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Search query
SELECT id, name, price,
  ts_rank(search_vector, query) AS rank
FROM products, plainto_tsquery('english', 'red running shoes') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;

-- Monthly sales report with window functions
SELECT
  date_trunc('month', o.created_at) AS month,
  p.category_id,
  COUNT(*) AS order_count,
  SUM(o.total) AS revenue,
  RANK() OVER (PARTITION BY date_trunc('month', o.created_at)
               ORDER BY SUM(o.total) DESC) AS category_rank,
  LAG(SUM(o.total)) OVER (
    PARTITION BY p.category_id
    ORDER BY date_trunc('month', o.created_at)
  ) AS prev_month_revenue,
  SUM(SUM(o.total)) OVER (
    PARTITION BY p.category_id
    ORDER BY date_trunc('month', o.created_at)
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS rolling_3month
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.status = 'delivered'
  AND o.created_at >= NOW() - INTERVAL '1 year'
GROUP BY month, p.category_id
ORDER BY month DESC, revenue DESC;
```

**Explanation**: This shows tsvector trigger for automatic full-text search indexing, GIN index for search performance, ts_rank for relevance sorting, window functions (RANK, LAG, SUM with window frame) for month-over-month analytics.

## Advanced: Partitioning and Performance Optimization

**Description**: Partitioned orders table and query optimization.

```sql
-- Create partitioned orders table
CREATE TABLE orders_partitioned (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE orders_2024_01
  PARTITION OF orders_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02
  PARTITION OF orders_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Create function to auto-create partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
  next_month DATE;
  partition_name TEXT;
BEGIN
  next_month := date_trunc('month', NOW() + INTERVAL '1 month');
  partition_name := 'orders_' || to_char(next_month, 'YYYY_MM');

  IF NOT EXISTS (
    SELECT 1 FROM pg_class WHERE relname = partition_name
  ) THEN
    EXECUTE format(
      'CREATE TABLE %I PARTITION OF orders_partitioned
       FOR VALUES FROM (%L) TO (%L)',
      partition_name, next_month, next_month + INTERVAL '1 month'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes on parent (applies to all partitions)
CREATE INDEX idx_orders_part_user ON orders_partitioned(user_id);
CREATE INDEX idx_orders_part_status ON orders_partitioned(status);
CREATE INDEX idx_orders_part_created ON orders_partitioned(created_at DESC);

-- Query that benefits from partition pruning
EXPLAIN ANALYZE
SELECT * FROM orders_partitioned
WHERE created_at >= '2024-01-15' AND created_at < '2024-02-15'
  AND user_id = 'abc-123';

-- Use pg_stat_statements to find expensive queries
SELECT
  query,
  calls,
  total_exec_time / calls AS avg_time_ms,
  rows,
  shared_blks_hit,
  shared_blks_read
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
ORDER BY total_exec_time DESC
LIMIT 10;
```

**Explanation**: This advanced example shows range partitioning by month, automatic partition creation function, partition pruning in queries, and query performance monitoring with pg_stat_statements.

## Production: Connection Pooling and Monitoring

**Description**: PgBouncer configuration and health monitoring queries.

```ini
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 500
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 50
query_timeout = 30
idle_transaction_timeout = 60
server_idle_timeout = 600
```

```sql
-- Health check queries
SELECT count(*) AS active_connections FROM pg_stat_activity WHERE state = 'active';
SELECT count(*) AS idle_connections FROM pg_stat_activity WHERE state = 'idle';
SELECT count(*) AS waiting FROM pg_stat_activity WHERE wait_event IS NOT NULL;

-- Long running queries
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state,
  wait_event
FROM pg_stat_activity
WHERE state != 'idle'
  AND query_start < now() - interval '5 minutes'
ORDER BY duration DESC;

-- Table bloat estimation
SELECT
  schemaname,
  tablename,
  ROUND(100 * n_dead_tup::numeric / (n_live_tup + n_dead_tup), 2) AS bloat_pct
FROM pg_stat_user_tables
WHERE n_live_tup > 0
  AND n_dead_tup > 0
ORDER BY bloat_pct DESC;

-- Cache hit ratio
SELECT
  'index hit' AS type,
  (sum(idx_blks_hit) * 100 / NULLIF(sum(idx_blks_hit + idx_blks_read), 0))::numeric(5,2) AS ratio
FROM pg_statio_user_indexes
UNION ALL
SELECT
  'table hit',
  (sum(heap_blks_hit) * 100 / NULLIF(sum(heap_blks_hit + heap_blks_read), 0))::numeric(5,2)
FROM pg_statio_user_tables;

-- Current locks
SELECT
  pg_class.relname,
  pg_locks.locktype,
  pg_locks.mode,
  pg_locks.granted,
  pg_stat_activity.query
FROM pg_locks
JOIN pg_class ON pg_locks.relation = pg_class.oid
JOIN pg_stat_activity ON pg_locks.pid = pg_stat_activity.pid
WHERE NOT pg_locks.granted
ORDER BY pg_locks.locktype;
```

**Explanation**: This production example shows PgBouncer configuration with transaction pooling, comprehensive health monitoring queries for connection count, long-running queries, table bloat, cache hit ratio, and lock monitoring.
