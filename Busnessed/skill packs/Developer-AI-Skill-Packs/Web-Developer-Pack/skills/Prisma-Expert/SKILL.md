---
name: "Prisma-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when modeling database schemas with Prisma, writing migrations, optimizing Prisma Client queries, managing relations, or deploying Prisma to production"
purpose: "Provides comprehensive guidance for designing database schemas, writing efficient queries, and managing migrations with Prisma ORM in production applications"
---

## Capabilities

1. Model database schemas with Prisma schema language including relations, enums, composite types, views, and indexes
2. Manage database migrations with create, deploy, reset, status, and resolve operations
3. Perform CRUD operations with Prisma Client including advanced filtering, sorting, pagination, and aggregation
4. Define and query all relation types: one-to-one, one-to-many, many-to-many (explicit and implicit)
5. Execute raw SQL queries with queryRaw (SELECT) and executeRaw (INSERT/UPDATE/DELETE) for complex operations
6. Implement middleware/interceptors for cross-cutting concerns (logging, soft delete, audit, encryption)
7. Manage transactions with interactive (callback-based) and sequential (batch) patterns
8. Perform batch operations (createMany, updateMany, deleteMany) for bulk data processing
9. Configure logging and events for query monitoring and debugging
10. Handle Prisma errors with proper error types (PrismaClientKnownRequestError, PrismaClientValidationError)
11. Optimize connection management with connection pooling, timeouts, and connection limits
12. Optimize query performance with select, include, raw queries, and query batching
13. Use Prisma Studio for data exploration and management
14. Implement database seeding for development and testing data
15. Deploy Prisma to production with migration strategies and connection pooling

## Limitations

1. Does not cover database-specific features beyond Prisma's abstraction (postgres-specific types, functions)
2. Cannot replace deep SQL knowledge for complex query optimization
3. Prisma's raw query support has limitations compared to native SQL drivers
4. Does not cover Prisma Accelerate or Pulse (Prisma Data Platform features) in depth
5. Large-scale migration strategies for billion-row tables may need custom approaches
6. Does not cover alternative ORMs (TypeORM, Drizzle, Knex) for comparison

## Required Tools

- Node.js 18+
- Prisma CLI (npx prisma)
- Prisma VS Code extension
- Database CLI (psql for PostgreSQL)
- Prisma Studio for data browsing
- Prisma Data Platform (optional, for Accelerate/Pulse)

## Execution Workflow

1. Install Prisma CLI and initialize with `npx prisma init`
2. Define data models in schema.prisma with proper relations, types, and attributes
3. Map existing database with `npx prisma db pull` (if working with existing DB)
4. Create initial migration with `npx prisma migrate dev --name init`
5. Generate Prisma Client with `npx prisma generate`
6. Implement application queries using Prisma Client methods
7. Add middleware/interceptors for logging, soft delete, or audit
8. Implement data access layer with proper error handling
9. Set up seeding with prisma/seed.ts
10. Write integration tests with Prisma Client
11. Create production migration with `npx prisma migrate deploy`
12. Configure connection pooling for production
13. Optimize query performance with select, include, and raw queries
14. Set up monitoring and logging for query performance
15. Implement backup and migration rollback strategy

## Decision Tree

1. **Relation type?** → 1:1 → @relation + unique → 1:N → @relation on child → M:N → Implicit many-to-many (automatic) vs explicit (with extra fields)
2. **Query pattern?** → Simple CRUD → Prisma Client methods → Complex aggregation → groupBy + aggregate → Raw SQL needed → $queryRaw / $executeRaw → Full-text search → Raw SQL with tsvector
3. **Performance concern?** → Over-fetching → Use select → N+1 → Use include → Too many queries → Batch/flatten → Large dataset → Paginate + raw query
4. **Migration strategy?** → Development → migrate dev → Production → migrate deploy → Existing DB → db pull + introspection → Schema change → migrate dev --create-only
5. **Error handling?** → Unique violation → P2002 → Foreign key → P2003 → Not found → P2025 → Connection → P1001
6. **Transaction type?** → Simple batch → $transaction([operations]) → Complex logic → Interactive $transaction → Nested → Prisma.TransactionClient passed to functions
7. **Deployment?** → Serverless → Data Proxy/Accelerate → Server → Connection pooling → Edge → Accelerate HTTP → Docker → Direct connection with pooler

## Review Checklist

- [ ] Schema models use proper naming (PascalCase, singular)
- [ ] Relations defined with @relation directive and proper field mappings
- [ ] Indexes created for frequently queried fields (@@index)
- [ ] Unique constraints for deduplication (@@unique or @unique)
- [ ] Enums used for fields with limited set of values
- [ ] Default values set for timestamp fields (@default(now()))
- [ ] Optional fields properly marked with ? type modifier
- [ ] Migrations version-controlled and not modified after creation
- [ ] Connection pooling configured for production
- [ ] Error handling covers PrismaClientKnownRequestError codes
- [ ] N+1 queries avoided with include or select
- [ ] Batch operations used for bulk data (createMany, updateMany)
- [ ] Raw queries parameterized (no SQL injection)
- [ ] Middleware implemented for cross-cutting concerns
- [ ] Seeding script handles idempotent data insertion

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| P2002 unique violation | Duplicate value for unique field | Check constraint; use upsert or handle error with retry |
| P2025 record not found | Record to update/delete doesn't exist | Verify record exists first; use upsert for create-or-update |
| P1001 connection refused | Database not running or wrong URL | Check DATABASE_URL; verify DB is running and accessible |
| P2014 relation violation | Conflicting foreign key values | Check related records exist; cascade deletes if appropriate |
| Migration failed | Schema conflict or data loss | Run `prisma migrate resolve` to mark as applied/rolled back |
| Slow queries | Missing index or over-fetching | Add @@index; use select to limit fields; use raw queries |
| N+1 queries | Relations fetched without include | Add include to parent query or use batch loading |
| Client not generated | Schema changed without generate | Run `prisma generate` after schema changes |
| Connection pool exhausted | Too many concurrent queries | Limit pool size; implement connection retry; use PgBouncer |
| Timeout errors | Long-running queries | Set statement timeout; optimize query; use pagination |

## Best Practices

1. Always generate Prisma Client after schema changes
2. Use migrations in development (migrate dev), not db push (except prototyping)
3. Use select to fetch only needed fields (avoid SELECT *)
4. Use include to eagerly load relations and avoid N+1
5. Use batch operations (createMany, updateMany) for bulk operations
6. Use interactive transactions for operations that need atomicity
7. Implement middleware for cross-cutting concerns (logging, soft delete, audit)
8. Handle Prisma errors by catching specific error codes
9. Use connection pooling in production (PgBouncer with transaction mode)
10. Keep schema.prisma as the single source of truth
11. Use Prisma Studio for data exploration during development
12. Seed data for development and testing environments
13. Run migrations in CI/CD pipeline with migrate deploy
14. Use raw queries only when Prisma methods are insufficient
15. Document schema decisions with comments in schema.prisma

## Anti-Patterns

1. Using db push in production instead of migrate deploy
2. Including all relations in every query (over-fetching)
3. Not using select to limit fields (always fetching all columns)
4. Modifying migration files after they've been applied
5. Using findMany without pagination for large tables
6. Not handling Prisma-specific errors with proper codes
7. Creating too many database connections per request
8. Using raw queries without parameterization (SQL injection risk)
9. Placing business logic in Prisma middleware
10. Ignoring the N+1 problem in list queries

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
