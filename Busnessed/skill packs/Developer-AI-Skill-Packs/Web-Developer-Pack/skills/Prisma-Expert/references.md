# Prisma-Expert References

## Official Documentation

- **Prisma Docs**: https://www.prisma.io/docs - Complete documentation, guides, and API reference
- **Schema Reference**: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference - Data sources, generators, models, attributes, functions
- **Prisma Client CRUD**: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference - findMany, create, update, delete, upsert, etc.
- **Relations**: https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/relations - One-to-one, one-to-many, many-to-many
- **Migrations**: https://www.prisma.io/docs/concepts/components/prisma-migrate - Create, deploy, reset, status, resolve
- **Raw Queries**: https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access - $queryRaw, $executeRaw
- **Middleware**: https://www.prisma.io/docs/concepts/components/prisma-client/middleware - $use, operations, params, next
- **Transactions**: https://www.prisma.io/docs/concepts/components/prisma-client/transactions - Interactive, batch, nested
- **Error Handling**: https://www.prisma.io/docs/reference/api-reference/error-reference - Error codes and messages
- **Connection Pooling**: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management - Pool size, timeouts, PgBouncer

## Terminology

1. **Schema**: The prisma/schema.prisma file defining data models, enums, relations, and configurations
2. **Model**: Represents a database table with fields, relations, and attributes
3. **Migration**: Version-controlled SQL file that evolves the database schema
4. **Generator**: Configuration for generating Prisma Client code
5. **Datasource**: Database connection configuration (provider, URL)
6. **Prisma Client**: Auto-generated query builder for Node.js/TypeScript
7. **Relation**: Connection between models via foreign keys (1:1, 1:N, M:N)
8. **Attribute**: Decorator on model/field (@id, @default, @unique, @relation, @map, @@index)
9. **Middleware**: Function that intercepts and modifies Prisma Client queries
10. **Interactive Transaction**: Transaction with callback providing a Prisma transaction client
11. **Batch Transaction**: Array of Prisma operations executed atomically
12. **Raw Query**: SQL query executed directly via $queryRaw or $executeRaw
13. **Upsert**: Create or update based on unique constraint
14. **Seed**: Script to populate database with initial/test data
15. **Introspection**: Generate Prisma schema from existing database

## Architecture Notes

- Prisma generates a type-safe client based on the schema definition
- The schema.prisma file is the single source of truth for the database structure
- Migrations can be created automatically (migrate dev) or custom (migrate diff --create-only)
- Prisma Client connects to the database via a connection pool managed internally
- Middleware runs for every Prisma Client operation and can modify params or results
- Interactive transactions use a Prisma.TransactionClient that shadows Prisma Client methods
- The relation mode (foreignKeys vs prisma) affects how relations are enforced
- Connection pooling is critical for production; use PgBouncer or built-in pool management

## Key APIs

- `prisma.model.findMany({ where, orderBy, skip, take, select, include })` - List records
- `prisma.model.findUnique({ where, select, include })` - Find by unique/ID
- `prisma.model.findFirst({ where, orderBy })` - Find first matching record
- `prisma.model.create({ data, select, include })` - Create record
- `prisma.model.update({ where, data, select })` - Update record
- `prisma.model.upsert({ where, create, update, select })` - Create or update
- `prisma.model.delete({ where })` - Delete record
- `prisma.model.createMany({ data, skipDuplicates })` - Bulk create
- `prisma.model.updateMany({ where, data })` - Bulk update
- `prisma.model.deleteMany({ where })` - Bulk delete
- `prisma.model.count({ where })` - Count matching records
- `prisma.model.aggregate({ where, _count, _avg, _sum, _min, _max })` - Aggregation
- `prisma.model.groupBy({ by, _count })` - Group by with aggregations
- `prisma.$queryRaw<TaggedTemplate>` - Execute raw SELECT query
- `prisma.$executeRaw<TaggedTemplate>` - Execute raw INSERT/UPDATE/DELETE
- `prisma.$transaction<R>(operations | fn)` - Execute operations in transaction

## Conventions

- **Model naming**: PascalCase, singular (User, Post, OrderItem)
- **Field naming**: camelCase (firstName, createdAt, email)
- **Enum naming**: PascalCase (Role, Status, Color)
- **Relation fields**: Related model name + Id suffix for scalar field (authorId, categoryId)
- **Date fields**: createdAt, updatedAt with @default(now()) and @updatedAt
- **Primary key**: id field with @default(cuid()) or @default(uuid())
- **Index naming**: @@index([field1, field2]) for composite indexes
- **Map attribute**: @map("column_name") and @@map("table_name") for snake_case DB names
- **File organization**: Single schema.prisma file for small projects; multiple files with imports for large

## Project Structure Recommendation

```
my-app/
  prisma/
    schema.prisma          # Main schema file
    migrations/            # Auto-generated migration files
    seed.ts                # Database seeding script
  src/
    db/
      prisma.ts            # Prisma Client singleton with middleware
      loaders.ts           # DataLoader instances for batching
    services/
      userService.ts       # User CRUD with Prisma Client
      postService.ts
    middleware/
      logging.ts           # Prisma middleware for log collection
      softDelete.ts        # Soft delete interceptor
    utils/
      prismaErrors.ts      # Error handling helpers
    __tests__/
      services/
        userService.test.ts
  package.json
  tsconfig.json
```
