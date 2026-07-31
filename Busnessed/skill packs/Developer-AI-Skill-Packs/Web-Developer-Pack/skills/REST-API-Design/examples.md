# REST-API-Design Examples

## Beginner: Simple Blog API

**Description**: A basic REST API for blog posts with CRUD operations and consistent response format.

```js
// Design
// GET    /api/v1/posts          - List posts (paginated)
// GET    /api/v1/posts/:id      - Get single post
// POST   /api/v1/posts          - Create post
// PUT    /api/v1/posts/:id      - Update post (full)
// DELETE /api/v1/posts/:id      - Delete post

// Response format
// Success: { data: {...} } or { data: [...], meta: {...} }
// Error: { error: { code: "NOT_FOUND", message: "Post not found" } }

router.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    db.posts.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    db.posts.count(),
  ]);

  res.json({
    data: posts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

router.get('/posts/:id', async (req, res) => {
  const post = await db.posts.findUnique({ where: { id: req.params.id } });
  if (!post) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' },
    });
  }
  res.json({ data: post });
});

router.post('/posts', async (req, res) => {
  const { title, content, authorId } = req.body;
  const post = await db.posts.create({
    data: { title, content, authorId },
  });
  res.status(201).location(`/api/v1/posts/${post.id}`).json({ data: post });
});
```

**Explanation**: This demonstrates consistent JSON envelope format, pagination with metadata, proper status codes (200, 201, 404), Location header for created resources, and error response format.

## Intermediate: E-Commerce API with Filtering and HATEOAS

**Description**: An e-commerce product API with advanced filtering, sorting, field selection, and HATEOAS links.

```js
// Design
// GET /api/v1/products?filter[category]=electronics&sort=-price&fields=id,name,price&page=1&limit=20
// GET /api/v1/products/:id
// POST /api/v1/products
// GET /api/v1/products/:id/reviews
// POST /api/v1/products/:id/reviews

router.get('/products', async (req, res) => {
  const { page = 1, limit = 20, sort, fields } = req.query;
  const filter = req.query.filter || {};

  const where = {};
  if (filter.category) where.category = filter.category;
  if (filter.minPrice) where.price = { ...where.price, gte: parseFloat(filter.minPrice) };
  if (filter.maxPrice) where.price = { ...where.price, lte: parseFloat(filter.maxPrice) };
  if (filter.inStock) where.stock = { gt: 0 };

  let orderBy = { createdAt: 'desc' };
  if (sort) {
    const field = sort.replace(/^-/, '');
    const direction = sort.startsWith('-') ? 'desc' : 'asc';
    orderBy = { [field]: direction };
  }

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    db.products.findMany({ where, skip, take: limit, orderBy, select: fields ? fields.split(',').reduce((acc, f) => ({ ...acc, [f]: true }), {}) : undefined }),
    db.products.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

  res.json({
    data: products,
    meta: { page: Number(page), limit: Number(limit), total, totalPages },
    links: {
      self: `${baseUrl}?page=${page}&limit=${limit}`,
      first: `${baseUrl}?page=1&limit=${limit}`,
      last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
      next: page < totalPages ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}` : null,
      prev: page > 1 ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}` : null,
    },
  });
});

router.get('/products/:id', async (req, res) => {
  const product = await db.products.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });

  if (!product) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Product not found' },
    });
  }

  res.json({
    data: product,
    links: {
      self: `/api/v1/products/${product.id}`,
      reviews: `/api/v1/products/${product.id}/reviews`,
      category: `/api/v1/categories/${product.categoryId}`,
    },
  });
});

router.post('/products/:id/reviews', async (req, res) => {
  const product = await db.products.findUnique({ where: { id: req.params.id } });
  if (!product) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Product not found' },
    });
  }
  const review = await db.reviews.create({
    data: { ...req.body, productId: req.params.id },
  });
  res.status(201).json({
    data: review,
    links: { self: `/api/v1/products/${req.params.id}/reviews/${review.id}` },
  });
});
```

**Explanation**: This shows advanced filtering with filter[field]=value syntax, sorting with direction prefix, field selection with fields parameter, HATEOAS links for related resources, and pagination links for navigation.

## Advanced: Banking API with Idempotency and Caching

**Description**: A banking transfer API with idempotency keys, ETags, and proper error handling.

```js
// POST /api/v1/transfers - Create transfer (idempotent with Idempotency-Key header)
//   Headers: Idempotency-Key: uuid
//   Body: { fromAccount, toAccount, amount, currency }

const idempotencyStore = new Map();

router.post('/transfers', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).json({
      error: { code: 'MISSING_IDEMPOTENCY_KEY', message: 'Idempotency-Key header required' },
    });
  }

  // Check for duplicate
  const existing = idempotencyStore.get(idempotencyKey);
  if (existing) {
    return res.status(200).json({
      data: existing,
      meta: { idempotent: true },
    });
  }

  const { fromAccount, toAccount, amount, currency } = req.body;

  if (!fromAccount || !toAccount || !amount || amount <= 0) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid transfer parameters',
        details: [
          { field: 'amount', message: 'Must be a positive number' },
        ],
      },
    });
  }

  if (fromAccount === toAccount) {
    return res.status(409).json({
      error: { code: 'SAME_ACCOUNT', message: 'Cannot transfer to the same account' },
    });
  }

  const from = await db.accounts.findUnique({ where: { id: fromAccount } });
  if (!from) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Source account not found' },
    });
  }

  if (from.balance < amount) {
    return res.status(422).json({
      error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient balance' },
    });
  }

  try {
    const transfer = await db.$transaction(async (tx) => {
      await tx.accounts.update({
        where: { id: fromAccount },
        data: { balance: { decrement: amount } },
      });
      await tx.accounts.update({
        where: { id: toAccount },
        data: { balance: { increment: amount } },
      });
      return tx.transfers.create({
        data: { fromAccount, toAccount, amount, currency, status: 'completed' },
      });
    });

    idempotencyStore.set(idempotencyKey, transfer);
    // Clean old entries after 24 hours
    setTimeout(() => idempotencyStore.delete(idempotencyKey), 86400000);

    res.status(201).json({ data: transfer });
  } catch (err) {
    res.status(500).json({
      error: { code: 'TRANSFER_FAILED', message: 'Transfer could not be processed' },
    });
  }
});

// GET /api/v1/transfers/:id - With ETag caching
router.get('/transfers/:id', async (req, res) => {
  const transfer = await db.transfers.findUnique({ where: { id: req.params.id } });
  if (!transfer) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Transfer not found' },
    });
  }

  const etag = `"${hash(JSON.stringify(transfer))}"`;

  // Check If-None-Match
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.set({
    'ETag': etag,
    'Last-Modified': transfer.createdAt.toUTCString(),
    'Cache-Control': 'private, max-age=60',
  });

  res.json({ data: transfer });
});
```

**Explanation**: This production example demonstrates idempotency key implementation for safe retries, ETag-based caching with 304 Not Modified responses, proper validation with 422 status, conflict detection with 409, transaction atomicity, and cleanup of old idempotency keys.
