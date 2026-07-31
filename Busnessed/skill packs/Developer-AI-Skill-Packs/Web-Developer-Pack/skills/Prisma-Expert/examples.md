# Prisma-Expert Examples

## Beginner: Basic CRUD Service

**Description**: A simple user service with CRUD operations and error handling.

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}

export const userService = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  },

  async findMany(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, createdAt: true },
      }),
      prisma.user.count(),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async create(input: CreateUserInput) {
    return prisma.user.create({ data: input });
  },

  async update(id: string, data: Partial<CreateUserInput>) {
    try {
      return await prisma.user.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('User not found');
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('User not found');
      if (error.code === 'P2003') throw new Error('User has related records');
      throw error;
    }
  },
};
```

**Explanation**: This demonstrates basic Prisma Client CRUD, selective field queries with select, pagination with skip/take, Prisma-specific error handling with P2025 and P2003 codes, and proper TypeScript return types.

## Intermediate: Relations and Aggregations

**Description**: E-commerce schema with relations, aggregation, and raw queries.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String    @id @default(cuid())
  name        String
  price       Decimal   @db.Decimal(10, 2)
  stock       Int       @default(0)
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime  @default(now())

  @@index([categoryId])
  @@index([price])
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  products Product[]
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Decimal     @db.Decimal(12, 2)
  items      OrderItem[]
  createdAt  DateTime    @default(now())

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10, 2)

  @@index([orderId])
  @@index([productId])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

```typescript
// Aggregation with relations
async function getCategorySales(startDate: Date, endDate: Date) {
  const result = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { products: true } },
      products: {
        select: {
          _count: { select: { orderItems: true } },
          orderItems: {
            where: {
              order: { createdAt: { gte: startDate, lte: endDate } },
            },
            select: { quantity: true, price: true },
          },
        },
      },
    },
  });
  return result;
}

// Transaction with relations
async function createOrder(userId: string, items: { productId: string; quantity: number }[]) {
  return prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await tx.product.findUniqueOrThrow({
        where: { id: item.productId },
      });

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      const lineTotal = Number(product.price) * item.quantity;
      total += lineTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    return tx.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });
  });
}

// Raw query for complex reporting
async function getMonthlyRevenue(year: number) {
  const result = await prisma.$queryRaw`
    SELECT
      date_trunc('month', created_at) AS month,
      COUNT(*) AS order_count,
      SUM(total) AS revenue
    FROM "Order"
    WHERE status = 'DELIVERED'
      AND EXTRACT(YEAR FROM created_at) = ${year}
    GROUP BY month
    ORDER BY month
  `;
  return result;
}
```

**Explanation**: This demonstrates complex schemas with one-to-many, many-to-many through explicit join table, interactive transactions with stock decrement and validation, aggregation with nested includes, and raw SQL with parameterization for complex reporting.

## Advanced: Middleware, Soft Delete, and Batch Operations

**Description**: Production patterns with middleware, soft delete, and batch processing.

```typescript
// prisma.ts - Prisma Client with middleware
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

// Query logging middleware
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  logger.debug(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

// Soft delete middleware
prisma.$use(async (params, next) => {
  const softDeleteModels = ['user', 'post', 'comment'];

  if (softDeleteModels.includes(params.model ?? '')) {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (!params.args.data) params.args.data = {};
      params.args.data.deletedAt = new Date();
    }
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      params.args.where = { ...params.args.where, deletedAt: null };
    }
    if (params.action === 'findMany') {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
  }

  return next(params);
});

// Batch operations
async function bulkUpdatePrices(
  updates: { id: string; price: number }[]
) {
  return prisma.$transaction(
    updates.map(({ id, price }) =>
      prisma.product.update({
        where: { id },
        data: { price },
      })
    )
  );
}

async function syncProducts(
  products: { id: string; name: string; price: number; stock: number }[]
) {
  return prisma.$transaction(
    products.map(({ id, ...data }) =>
      prisma.product.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      })
    )
  );
}

// Error handling utility
function handlePrismaError(error: any): never {
  switch (error.code) {
    case 'P2002':
      throw new Error(`Unique constraint violation on ${error.meta?.target}`);
    case 'P2003':
      throw new Error('Foreign key constraint failed');
    case 'P2025':
      throw new Error('Record not found');
    case 'P2014':
      throw new Error('Relation violation');
    default:
      throw error;
  }
}

export { prisma, handlePrismaError };
```

**Explanation**: This advanced example shows query logging middleware for performance monitoring, soft delete interceptor that transparently handles deletedAt, batch upsert transactions for data sync, batch update transactions for bulk price changes, and comprehensive Prisma error handling utility.
