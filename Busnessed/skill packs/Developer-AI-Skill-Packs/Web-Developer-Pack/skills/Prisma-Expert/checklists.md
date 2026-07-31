# Prisma-Expert Checklists

## Pre-Flight Checklist

- [ ] Prisma CLI installed (npm install prisma --save-dev)
- [ ] Prisma Client added as dependency (@prisma/client)
- [ ] Prisma initialized (npx prisma init)
- [ ] Database provider chosen (PostgreSQL, MySQL, SQLite, MongoDB, CockroachDB)
- [ ] DATABASE_URL environment variable configured
- [ ] Prisma VS Code extension installed for schema highlighting
- [ ] Migration strategy chosen (migrate dev for dev, migrate deploy for prod)
- [ ] Seed script configured in package.json
- [ ] TypeScript configured for Prisma Client generation
- [ ] Global Prisma Client singleton pattern established

## Implementation Checklist

- [ ] Schema models properly defined with correct types and attributes
- [ ] All tables have primary keys (id with @default(uuid()) or @default(cuid()))
- [ ] Foreign keys defined with proper @relation and field references
- [ ] Unique constraints on fields that should be unique (@unique or @@unique)
- [ ] Indexes on frequently queried fields (@@index)
- [ ] Enums for fields with limited value sets
- [ ] Default values for timestamp and status fields
- [ ] Appropriate data types (Decimal for money, JSON for unstructured)
- [ ] Not null constraints on required fields
- [ ] Cascading deletes configured where appropriate (onDelete: Cascade)
- [ ] Prisma Client generated after schema changes
- [ ] N+1 queries avoided with include or select
- [ ] Transactions used for atomic multi-table operations
- [ ] Error handling for all Prisma error codes
- [ ] Middleware for logging, soft delete, or audit implemented

## Testing Checklist

- [ ] CRUD operations tested for all models
- [ ] Relation queries tested (include, nested create, connect)
- [ ] Error handling tested: unique violation, not found, foreign key
- [ ] Transaction tests: success case, rollback on error, concurrent access
- [ ] Pagination tested: offset and cursor-based
- [ ] Batch operations tested: createMany, updateMany, deleteMany
- [ ] Raw query tests: type safety, parameterization, SQL injection prevention
- [ ] Migration tests: up and down migrations work
- [ ] Seed tests: data inserted correctly, idempotent
- [ ] Performance tests: query times, N+1 detection, connection pool usage
- [ ] Middleware tests: logging output, soft delete behavior, audit trail
- [ ] Integration tests with real database (not mocking Prisma)

## Release Checklist

- [ ] All migrations created and verified against staging database
- [ ] generate command run in build pipeline
- [ ] DATABASE_URL configured for production environment
- [ ] Connection pooling configured (PgBouncer or direct pool settings)
- [ ] Connection pool size appropriate for server resources
- [ ] Statement timeout set (statement_timeout in datasource)
- [ ] Migration command included in deployment script (migrate deploy)
- [ ] Prisma Client binary targets configured for deployment OS
- [ ] Seed data not run in production
- [ ] Log level set to appropriate for production (errors only)
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Performance monitoring set up (query logging, slow query alerts)
- [ ] Rollback plan documented for migration failures
- [ ] Changelog updated with schema changes

## Maintenance Checklist

- [ ] Prisma CLI updated to latest version monthly
- [ ] Migration files reviewed for accumulated schema changes
- [ ] Schema comments reviewed for outdated documentation
- [ ] Unused models or fields identified and cleaned up
- [ ] Index usage analyzed (remove unused, add missing)
- [ ] Query performance reviewed with logging data
- [ ] Connection pool usage monitored
- [ ] Prisma Studio used for ad-hoc data review
- [ ] Seed data refreshed for development environments
- [ ] Migration history reviewed for squash opportunities
- [ ] Breaking changes planned with version migrations
- [ ] Data integrity verified periodically with custom checks
