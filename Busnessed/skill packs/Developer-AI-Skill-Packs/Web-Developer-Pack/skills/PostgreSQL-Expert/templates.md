# PostgreSQL-Expert Templates

## Template 1: Migration Script

**Name**: `migration-template`
**Description**: Version-controlled database migration with rollback.

```sql
-- Migration: {{MIGRATION_NAME}}
-- Version: {{VERSION}}
-- Description: {{DESCRIPTION}}

-- UP
BEGIN;

CREATE TABLE {{table_name}} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  {{column1}} {{type1}} NOT NULL,
  {{column2}} {{type2}} DEFAULT {{default2}},
  {{column3}} {{type3}} REFERENCES {{ref_table}}({{ref_column}}),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_{{table_name}}_{{column1}} ON {{table_name}}({{column1}});
CREATE UNIQUE INDEX idx_{{table_name}}_{{column2}} ON {{table_name}}({{column2}});

COMMIT;

-- DOWN
BEGIN;
DROP TABLE IF EXISTS {{table_name}};
COMMIT;
```

**Usage Notes**: Replace `{{MIGRATION_NAME}}`, `{{VERSION}}` (e.g., `001`), `{{table_name}}`, column definitions, and index names.

## Template 2: Index Strategy

**Name**: `index-template`
**Description**: Index creation template for different query patterns.

```sql
-- B-tree index for equality and range queries
CREATE INDEX idx_{{table}}_{{column}} ON {{table}}({{column}});

-- Composite index for multi-column WHERE/JOIN
CREATE INDEX idx_{{table}}_{{col1}}_{{col2}} ON {{table}}({{col1}}, {{col2}});

-- Partial index for frequently filtered subset
CREATE INDEX idx_{{table}}_{{column}}_active ON {{table}}({{column}}) WHERE {{condition}};

-- Covering index for index-only scans
CREATE INDEX idx_{{table}}_{{column}}_covering ON {{table}}({{column}}) INCLUDE ({{include_col1}}, {{include_col2}});

-- GIN index for JSONB
CREATE INDEX idx_{{table}}_{{column}}_gin ON {{table}} USING GIN({{jsonb_column}} {{jsonb_ops}});

-- GIN index for full-text search
CREATE INDEX idx_{{table}}_search ON {{table}} USING GIN({{tsvector_column}});

-- BRIN index for large ordered tables
CREATE INDEX idx_{{table}}_{{column}}_brin ON {{table}} USING BRIN({{column}}) WITH (pages_per_range = {{pages}});

-- Descending index for ORDER BY DESC
CREATE INDEX idx_{{table}}_{{column}}_desc ON {{table}}({{column}} DESC);
```

**Usage Notes**: Choose index type based on query pattern. Use EXPLAIN ANALYZE to verify index usage.

## Template 3: Full-Text Search Setup

**Name**: `fulltext-template`
**Description**: Full-text search configuration with trigger.

```sql
-- Add search vector column
ALTER TABLE {{table}}
  ADD COLUMN search_vector tsvector;

-- Create trigger function
CREATE OR REPLACE FUNCTION {{table}}_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('{{dictionary}}',
    coalesce(NEW.{{field1}}, '') || ' ' ||
    coalesce(NEW.{{field2}}, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trg_{{table}}_search_vector
  BEFORE INSERT OR UPDATE ON {{table}}
  FOR EACH ROW EXECUTE FUNCTION {{table}}_search_vector_update();

-- Create GIN index
CREATE INDEX idx_{{table}}_search ON {{table}} USING GIN(search_vector);

-- Query
SELECT {{columns}},
  ts_rank(search_vector, query) AS rank
FROM {{table}}, plainto_tsquery('{{dictionary}}', '{{searchTerms}}') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT {{limit}};
```

**Usage Notes**: Replace `{{table}}`, `{{dictionary}}` (e.g., `english`), `{{field1}}`/`{{field2}}` (text columns to search), `{{searchTerms}}`, `{{limit}}`.

## Template 4: Partitioned Table

**Name**: `partition-template`
**Description**: Range-partitioned table with auto-creation function.

```sql
-- Create partitioned table
CREATE TABLE {{table}} (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  {{columns}}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create initial partitions
CREATE TABLE {{table}}_{{partition1}}
  PARTITION OF {{table}}
  FOR VALUES FROM ('{{start1}}') TO ('{{end1}}');

CREATE TABLE {{table}}_{{partition2}}
  PARTITION OF {{table}}
  FOR VALUES FROM ('{{start2}}') TO ('{{end2}}');

-- Auto-create function
CREATE OR REPLACE FUNCTION create_{{table}}_partition()
RETURNS void AS $$
DECLARE
  next_part DATE;
  part_name TEXT;
BEGIN
  next_part := date_trunc('month', NOW() + INTERVAL '1 month');
  part_name := '{{table}}_' || to_char(next_part, 'YYYY_MM');
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = part_name) THEN
    EXECUTE format(
      'CREATE TABLE %I PARTITION OF {{table}}
       FOR VALUES FROM (%L) TO (%L)',
      part_name, next_part, next_part + INTERVAL '1 month'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
```

**Usage Notes**: Replace `{{table}}`, partition names, date ranges. Schedule create function via cron for automatic partition creation.

## Template 5: Window Function Analytics

**Name**: `window-function-template`
**Description**: Common analytical queries with window functions.

```sql
-- Row numbering per group
SELECT
  {{columns}},
  ROW_NUMBER() OVER (PARTITION BY {{partition_col}} ORDER BY {{order_col}} {{order_dir}}) AS row_num
FROM {{table}};

-- Ranking
SELECT
  {{columns}},
  RANK() OVER (ORDER BY {{metric}} DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY {{metric}} DESC) AS dense_rank
FROM {{table}};

-- Running total
SELECT
  {{columns}},
  {{metric}},
  SUM({{metric}}) OVER (ORDER BY {{order_col}} ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM {{table}};

-- Moving average
SELECT
  {{columns}},
  {{metric}},
  AVG({{metric}}) OVER (ORDER BY {{order_col}} ROWS BETWEEN {{n}} PRECEDING AND CURRENT ROW) AS moving_avg
FROM {{table}};

-- Compare with previous
SELECT
  {{columns}},
  {{metric}},
  LAG({{metric}}, 1) OVER (ORDER BY {{order_col}}) AS prev_value,
  {{metric}} - LAG({{metric}}, 1) OVER (ORDER BY {{order_col}}) AS change
FROM {{table}};

-- Percentile
SELECT
  {{columns}},
  {{metric}},
  NTILE({{buckets}}) OVER (ORDER BY {{metric}} DESC) AS percentile_group
FROM {{table}};
```

**Usage Notes**: Replace columns, metrics, partitioning columns, ordering columns, and parameters.

## Template 6: CTE (WITH) Query

**Name**: `cte-template`
**Description**: Recursive and non-recursive CTE patterns.

```sql
-- Non-recursive CTE for readability
WITH {{cte_name}} AS (
  SELECT {{columns}}
  FROM {{table}}
  WHERE {{condition}}
)
SELECT {{columns}}
FROM {{cte_name}}
JOIN {{other_table}} ON {{join_condition}}
WHERE {{filter}};

-- Recursive CTE for hierarchies
WITH RECURSIVE {{cte_name}} AS (
  -- Base case: roots
  SELECT id, parent_id, name, 1 AS level
  FROM {{table}}
  WHERE parent_id IS NULL
  UNION ALL
  -- Recursive: children
  SELECT c.id, c.parent_id, c.name, p.level + 1
  FROM {{table}} c
  JOIN {{cte_name}} p ON c.parent_id = p.id
)
SELECT id, name, level
FROM {{cte_name}}
ORDER BY level, name;

-- CTE with aggregation
WITH {{cte_name}} AS (
  SELECT {{group_col}}, COUNT(*) AS cnt, SUM({{metric}}) AS total
  FROM {{table}}
  GROUP BY {{group_col}}
)
SELECT *
FROM {{cte_name}}
WHERE cnt > {{min_count}}
ORDER BY total DESC;
```

**Usage Notes**: Use CTEs for complex queries, recursive hierarchies (org charts, categories), or breaking down complex logic.

## Template 7: Trigger for Updated At

**Name**: `trigger-template`
**Description**: Auto-update updated_at timestamp on row modification.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_{{table}}_updated_at
  BEFORE UPDATE ON {{table}}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Usage Notes**: Apply to all tables that have an updated_at column.

## Template 8: Connection Pool Configuration

**Name**: `connection-pool-template`
**Description**: PgBouncer configuration for web application.

```ini
[databases]
{{database}} = host={{host}} port=5432 dbname={{database}}

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = {{maxClientConn}}
default_pool_size = {{defaultPoolSize}}
min_pool_size = {{minPoolSize}}
reserve_pool_size = {{reservePoolSize}}
reserve_pool_timeout = 3.0
max_db_connections = {{maxDbConn}}
query_timeout = {{queryTimeout}}
idle_transaction_timeout = {{idleTxTimeout}}
server_idle_timeout = {{serverIdleTimeout}}
```

**Usage Notes**: Replace `{{database}}`, `{{host}}`. Pool sizes: default_pool_size = CPU cores * 2-4, max_client_conn = expected concurrent users, reserve_pool_size = 10-20% of default.
