# Prisma-Expert Templates

## Template 1: Prisma Schema

**Name**: `schema-template`
**Description**: Standard Prisma schema with common patterns.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "{{provider}}"
  url      = env("DATABASE_URL")
}

model {{Model}} {
  id        String   @id @default(cuid())
  {{field1}} {{type1}} @{{attribute1}}
  {{field2}} {{type2}}?
  {{relationField}}{{relationType}} {{RelatedModel}} @relation(fields: [{{relationField}}Id], references: [id])
  {{relationField}}Id String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([{{indexField}}])
  @@map("{{table_name}}")
}

enum {{EnumName}} {
  {{VALUE1}}
  {{VALUE2}}
  {{VALUE3}}
}
```

**Usage Notes**: Replace `{{provider}}` (e.g., `postgresql`, `mysql`, `sqlite`), `{{Model}}` (e.g., `User`, `Product`), fields, relations, and enums. Use `@@map` for snake_case table names if needed.

## Template 2: Prisma Client Singleton

**Name**: `client-template`
**Description**: Singleton Prisma Client with logging and error handling.

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export function handlePrismaError(error: any): never {
  const message = error.meta?.message || error.message || 'Database error';
  switch (error.code) {
    case 'P2002': throw new Error(`Duplicate value for ${error.meta?.target}`);
    case 'P2025': throw new Error('Record not found');
    case 'P2003': throw new Error('Referenced record does not exist');
    case 'P1001': throw new Error('Cannot connect to database');
    default: throw new Error(message);
  }
}

export default prisma;
```

**Usage Notes**: The global singleton prevents multiple Prisma Client instances during hot reloading in development. Customize log levels for production.

## Template 3: Service Layer

**Name**: `service-template`
**Description**: CRUD service with pagination, filtering, and error handling.

```typescript
import { prisma, handlePrismaError } from '../db/prisma';
import type { Prisma } from '@prisma/client';

interface FindManyParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

export const {{model}}Service = {
  async findMany({ page = 1, limit = 10, sort = '-createdAt', filter = {} }: FindManyParams) {
    const orderField = sort.replace(/^-/, '');
    const orderDir = sort.startsWith('-') ? 'desc' : 'asc';
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.{{model}}.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { [orderField]: orderDir },
        select: {{selectFields}},
      }),
      prisma.{{model}}.count({ where: filter }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async findById(id: string) {
    const item = await prisma.{{model}}.findUnique({ where: { id }, select: {{selectFields}} });
    if (!item) throw new Error('{{ModelName}} not found');
    return item;
  },

  async create(data: {{CreateInput}}) {
    try {
      return await prisma.{{model}}.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  },

  async update(id: string, data: Partial<{{CreateInput}}>) {
    try {
      return await prisma.{{model}}.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  },

  async delete(id: string) {
    try {
      await prisma.{{model}}.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  },
};
```

**Usage Notes**: Replace `{{model}}` (lowercase, e.g., `user`), `{{ModelName}}` (e.g., `User`), `{{CreateInput}}` (TypeScript interface), `{{selectFields}}`.

## Template 4: Transaction with Rollback

**Name**: `transaction-template`
**Description**: Interactive transaction with validation and rollback.

```typescript
async function {{transactionName}}({{params}}) {
  return prisma.$transaction(async (tx) => {
    // Pre-validation
    const {{entity}} = await tx.{{model}}.findUniqueOrThrow({
      where: { id: {{entity}}Id },
    });

    if ({{validationCondition}}) {
      throw new Error('{{validationMessage}}');
    }

    // Main operation
    const result = await tx.{{model}}.{{action}}({
      where: { id: {{entity}}Id },
      data: {{updateData}},
    });

    // Side effects
    await tx.{{relatedModel}}.{{relatedAction}}({
      where: { {{relatedField}}: {{entity}}Id },
      data: {{relatedData}},
    });

    return result;
  }, {
    maxWait: 5000,
    timeout: 10000,
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  });
}
```

**Usage Notes**: Replace `{{transactionName}}`, `{{model}}`, `{{entity}}`, parameters, validation, and operations. Use Serializable isolation for financial transactions.

## Template 5: Seeding Script

**Name**: `seed-template`
**Description**: Database seeding with idempotent data insertion.

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const {{seeds}} = [
  { id: '{{id1}}', {{field1}}: '{{value1}}' },
  { id: '{{id2}}', {{field1}}: '{{value2}}' },
];

async function main() {
  console.log('Seeding database...');

  for (const seed of {{seeds}}) {
    await prisma.{{model}}.upsert({
      where: { id: seed.id },
      update: seed,
      create: seed,
    });
  }

  const count = await prisma.{{model}}.count();
  console.log(`Seeded ${count} {{model}} records`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Usage Notes**: Replace `{{seeds}}` array, `{{model}}`, fields. Use upsert for idempotent seeding. Create separate seed files per domain.

## Template 6: Middleware/Interceptor

**Name**: `middleware-template`
**Description**: Prisma middleware for cross-cutting concerns.

```typescript
prisma.$use(async (params, next) => {
  // Before
  const start = Date.now();

  // Modify params
  if (params.action === '{{action}}' && params.model === '{{Model}}') {
    params.args = {
      ...params.args,
      {{modification}},
    };
  }

  // Execute
  const result = await next(params);

  // After
  const duration = Date.now() - start;
  console.log(`[Prisma] ${params.model}.${params.action} took ${duration}ms`);

  // Modify result
  if (params.action === '{{readAction}}' && params.model === '{{Model}}') {
    return result.filter((item: any) => !item.deletedAt);
  }

  return result;
});
```

**Usage Notes**: Replace `{{action}}`, `{{Model}}`, `{{modification}}`, `{{readAction}}`. Common use cases: soft delete, audit logging, field encryption, query timing.

## Template 7: Raw Query with Typed Result

**Name**: `raw-query-template`
**Description**: Type-safe raw query with Prisma.

```typescript
import { Prisma } from '@prisma/client';

interface {{ResultType}} {
  id: string;
  {{field1}}: string;
  {{field2}}: number;
}

async function {{queryName}}({{params}}) {
  const result = await prisma.$queryRaw<{{ResultType}}[]>`
    SELECT id, {{field1}}, {{field2}}
    FROM "{{table}}"
    WHERE {{condition}} = {{param}}
    ORDER BY {{orderField}} DESC
    LIMIT {{limit}}
  `;
  return result;
}

async function {{mutationName}}({{params}}) {
  const result = await prisma.$executeRaw`
    UPDATE "{{table}}"
    SET {{field}} = {{value}}
    WHERE id = {{id}}
  `;
  return result;
}
```

**Usage Notes**: Replace `{{ResultType}}`, `{{queryName}}`, `{{mutationName}}`, table, fields, and conditions. Use tagged template literals with `$queryRaw` for parameter safety.

## Template 8: Pagination Utility

**Name**: `pagination-template`
**Description**: Reusable pagination helper for Prisma queries.

```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  cursor?: string | null;
}

async function paginate<T>(
  model: any,
  args: any,
  { page = 1, limit = 10, cursor }: PaginationParams
): Promise<PaginatedResult<T>> {
  if (cursor) {
    const take = limit + 1;
    const items = await model.findMany({
      ...args,
      take,
      skip: 1,
      cursor: { id: cursor },
    });

    const hasNext = items.length > limit;
    if (hasNext) items.pop();

    return {
      items,
      meta: {
        page, limit, total: 0, totalPages: 0,
        hasNext, hasPrev: true,
      },
      cursor: hasNext ? items[items.length - 1].id : null,
    };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.findMany({ ...args, skip, take: limit }),
    model.count({ where: args.where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

**Usage Notes**: Supports both offset-based and cursor-based pagination. Works with any Prisma model.
