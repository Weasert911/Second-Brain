# Prisma-Expert Snippets

## Snippet 1: Prisma Client Singleton

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**When to use**: Prevents multiple Prisma Client instances during Next.js/Vite hot reloading.

## Snippet 2: Paginated Query with Filtering

```typescript
async function findPosts(page: number, limit: number, status?: string) {
  const where = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, createdAt: true },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
```

**When to use**: Every list endpoint needs pagination. Use Promise.all for parallel count + data queries.

## Snippet 3: Nested Create with Relations

```typescript
const order = await prisma.order.create({
  data: {
    userId: 'user-123',
    total: 99.99,
    items: {
      create: [
        { productId: 'prod-1', quantity: 2, price: 29.99 },
        { productId: 'prod-2', quantity: 1, price: 39.99 },
      ],
    },
  },
  include: { items: { include: { product: true } } },
});
```

**When to use**: Creating records with related child records in a single atomic operation.

## Snippet 4: Upsert Pattern

```typescript
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated Name', lastLoginAt: new Date() },
  create: {
    email: 'user@example.com',
    name: 'New User',
    passwordHash: hashedPassword,
  },
});
```

**When to use**: Create-or-update patterns like user registration, sync operations, or seed data.

## Snippet 5: Interactive Transaction

```typescript
const result = await prisma.$transaction(async (tx) => {
  const product = await tx.product.findUniqueOrThrow({
    where: { id: productId },
  });

  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });

  return tx.order.create({
    data: {
      userId,
      total: Number(product.price) * quantity,
      items: {
        create: { productId, quantity, price: product.price },
      },
    },
  });
});
```

**When to use**: Complex multi-step operations that need atomicity (order creation, fund transfers).

## Snippet 6: Batch Transaction

```typescript
const [user1, user2] = await prisma.$transaction([
  prisma.user.update({ where: { id: 'user-1' }, data: { name: 'Alice' } }),
  prisma.user.update({ where: { id: 'user-2' }, data: { name: 'Bob' } }),
]);
```

**When to use**: Multiple independent operations that should succeed or fail together.

## Snippet 7: Soft Delete Middleware

```typescript
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'findMany' || params.action === 'findFirst') {
      if (!params.args) params.args = {};
      if (!params.args.where) params.args.where = {};
      params.args.where.deletedAt = null;
    }
  }
  return next(params);
});
```

**When to use**: Instead of hard-deleting records, mark them as deleted and filter them out automatically.

## Snippet 8: Raw Query with Parameterization

```typescript
const users = await prisma.$queryRaw<Array<{ id: string; name: string }>>`
  SELECT id, name FROM "User"
  WHERE email = ${email}
    AND "isActive" = true
  ORDER BY "createdAt" DESC
  LIMIT 10
`;
```

**When to use**: Complex queries that Prisma's query builder cannot express efficiently.

## Snippet 9: Aggregation with groupBy

```typescript
const stats = await prisma.order.groupBy({
  by: ['status'],
  _count: { id: true },
  _sum: { total: true },
  _avg: { total: true },
  _min: { total: true },
  _max: { total: true },
  where: { createdAt: { gte: startDate } },
});
```

**When to use**: Dashboard metrics, reporting, or any aggregate data grouped by categories.

## Snippet 10: Cursor-Based Pagination

```typescript
async function cursorPaginate(cursor?: string, limit = 20) {
  const items = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true },
  });

  const hasNext = items.length > limit;
  if (hasNext) items.pop();

  return {
    items,
    meta: { hasNext, nextCursor: hasNext ? items[items.length - 1].id : null },
  };
}
```

**When to use**: Efficient pagination for frequently updated lists where offset-based pagination would be slow.

## Snippet 11: Middleware for Query Timing

```typescript
prisma.$use(async (params, next) => {
  const start = performance.now();
  const result = await next(params);
  const duration = performance.now() - start;

  if (duration > 1000) {
    console.warn(`Slow query: ${params.model}.${params.action} took ${duration.toFixed(0)}ms`);
  }

  return result;
});
```

**When to use**: Performance monitoring to detect slow queries in development and production.

## Snippet 12: Connection Pool Configuration

```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings via DATABASE_URL query params
  // postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
});
```

**When to use**: Configure connection pool size via DATABASE_URL query parameters for production.

## Snippet 13: Create Many with Skip Duplicates

```typescript
const result = await prisma.user.createMany({
  data: [
    { email: 'alice@example.com', name: 'Alice' },
    { email: 'bob@example.com', name: 'Bob' },
    { email: 'alice@example.com', name: 'Alice Duplicate' },
  ],
  skipDuplicates: true,
});
```

**When to use**: Bulk insert of data that may have duplicates, continuing without errors.

## Snippet 14: Relation Connect/Disconnect

```typescript
// Connect existing records
const post = await prisma.post.update({
  where: { id: 'post-1' },
  data: {
    categories: {
      connect: [{ id: 'cat-1' }, { id: 'cat-2' }],
    },
  },
  include: { categories: true },
});

// Disconnect and set
await prisma.user.update({
  where: { id: 'user-1' },
  data: {
    currentProject: {
      disconnect: true,
      connect: { id: 'project-2' },
    },
  },
});
```

**When to use**: Managing many-to-many relations and one-to-one relation reassignment.

## Snippet 15: Error Handler Wrapper

```typescript
import { Prisma } from '@prisma/client';

function prismaErrorHandler(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new Error(`Unique constraint violation on ${error.meta?.target}`);
      case 'P2025':
        throw new Error('Record not found');
      case 'P2003':
        throw new Error('Foreign key constraint failed');
      default:
        throw new Error(`Database error: ${error.code}`);
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('Invalid data provided to database');
  }
  throw error;
}

async function safeQuery<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    return prismaErrorHandler(error);
  }
}
```

**When to use**: Centralized error handling for all Prisma operations, distinguishing between known (P2002, P2025) and unknown errors.
