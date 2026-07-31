# REST-API-Design Snippets

## Snippet 1: Consistent JSON Response Envelope

```js
function success(res, data, meta = {}, statusCode = 200) {
  return res.status(statusCode).json({ data, meta });
}

function created(res, data, location) {
  return res.status(201).location(location).json({ data });
}

function noContent(res) {
  return res.status(204).send();
}

function error(res, code, message, statusCode = 400, details = []) {
  return res.status(statusCode).json({
    error: { code, message, ...(details.length > 0 && { details }) },
  });
}

// Usage
success(res, user, { total: 1 });
created(res, newUser, `/api/v1/users/${newUser.id}`);
error(res, 'NOT_FOUND', 'User not found', 404);
```

**When to use**: Every response should use these helpers for consistent API response format.

## Snippet 2: Pagination Metadata

```js
function paginationMeta(page, limit, total) {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

function paginationLinks(baseUrl, page, limit, totalPages) {
  page = Number(page);
  return {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
    next: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
    prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
  };
}

// Usage
const meta = paginationMeta(req.query.page, req.query.limit, total);
const links = paginationLinks(baseUrl, req.query.page, req.query.limit, meta.totalPages);
res.json({ data: items, meta, links });
```

**When to use**: Every paginated list endpoint.

## Snippet 3: Cursor-Based Pagination

```js
async function cursorPaginate(model, args, cursor, limit = 20) {
  const take = Math.min(limit, 100);
  const items = await model.findMany({
    ...args,
    take: take + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  const hasNext = items.length > take;
  if (hasNext) items.pop();

  return {
    data: items,
    meta: { limit: take, hasNext, nextCursor: hasNext ? items[items.length - 1].id : null },
  };
}

// Usage
const result = await cursorPaginate(db.posts, { where: { published: true } }, req.query.cursor);
res.json(result);
```

**When to use**: Real-time feeds, activity logs, or any list where new items are frequently added.

## Snippet 4: Filter Parser

```js
function parseFilters(query, fieldMap) {
  const filters = {};
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('filter[')) {
      const field = key.match(/filter\[(.+?)\]/)[1];
      const mappedField = fieldMap[field] || field;
      filters[mappedField] = value;
    }
  }
  return filters;
}

// Usage with Prisma
const filterMap = {
  status: 'status',
  category: 'categoryId',
  minPrice: { field: 'price', op: 'gte' },
  maxPrice: { field: 'price', op: 'lte' },
};

// GET /products?filter[category]=electronics&filter[minPrice]=10&filter[maxPrice]=100
const filters = parseFilters(req.query, filterMap);
```

**When to use**: Any list endpoint that needs flexible filtering.

## Snippet 5: Sort Parser

```js
function parseSort(sort, allowedFields) {
  if (!sort) return undefined;
  const fields = sort.split(',');
  return fields.map(f => {
    const desc = f.startsWith('-');
    const field = desc ? f.slice(1) : f;
    if (!allowedFields.includes(field)) return null;
    return { [field]: desc ? 'desc' : 'asc' };
  }).filter(Boolean);
}

// GET /products?sort=-price,createdAt
const sort = parseSort(req.query.sort, ['price', 'createdAt', 'name', 'rating']);
```

**When to use**: Every list endpoint that supports sorting.

## Snippet 6: Field Selector

```js
function parseFields(fields, defaults = ['id']) {
  if (!fields) return undefined;
  return fields.split(',').reduce((acc, field) => {
    acc[field.trim()] = true;
    return acc;
  }, {});
}

// GET /products?fields=id,name,price
const select = parseFields(req.query.fields, ['id', 'name']);
```

**When to use**: Any endpoint where clients may want to limit response size by selecting specific fields.

## Snippet 7: ETag Generator

```js
import crypto from 'crypto';

function generateETag(data) {
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `"${hash}"`;
}

function conditionalGet(req, res, data) {
  const etag = generateETag(data);
  res.set('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  return null;
}

// Usage
router.get('/users/:id', async (req, res) => {
  const user = await db.users.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });

  if (conditionalGet(req, res, user) === null) return;
  res.json({ data: user });
});
```

**When to use**: Cacheable GET endpoints to reduce bandwidth and server load.

## Snippet 8: Idempotency Middleware

```js
const store = new Map();
const TTL = 24 * 60 * 60 * 1000;

function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const existing = store.get(key);
  if (existing) {
    return res.status(existing.status).json(existing.body);
  }

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    store.set(key, { status: res.statusCode, body });
    setTimeout(() => store.delete(key), TTL);
    return originalJson(body);
  };

  next();
}

app.post('/api/v1/transfers', idempotencyMiddleware, handler);
```

**When to use**: POST and PATCH endpoints where duplicate requests could cause issues (payments, transfers, orders).

## Snippet 9: HATEOAS Link Builder

```js
function resourceLinks(req, resource, id, relationships = {}) {
  const basePath = `${req.protocol}://${req.get('host')}/api/v1`;
  const links = {
    self: `${basePath}/${resource}/${id}`,
  };

  for (const [rel, path] of Object.entries(relationships)) {
    links[rel] = `${basePath}/${resource}/${id}/${path}`;
  }

  return links;
}

// Usage
res.json({
  data: user,
  links: resourceLinks(req, 'users', user.id, {
    posts: 'posts',
    settings: 'settings',
  }),
});
```

**When to use**: When you want to make your API discoverable by providing navigation links in responses.

## Snippet 10: Versioning Middleware

```js
function apiVersion(options = {}) {
  const { default: defaultVer = '1', paramName = 'version' } = options;

  return (req, res, next) => {
    let version = defaultVer;

    // Check URL prefix: /api/v2/users
    const urlMatch = req.path.match(/\/api\/v(\d+)\//);
    if (urlMatch) version = urlMatch[1];

    // Check Accept header: Accept: application/vnd.api+json;version=2
    const accept = req.headers.accept || '';
    const acceptMatch = accept.match(/version=(\d+)/);
    if (acceptMatch) version = acceptMatch[1];

    // Check custom header: X-API-Version: 2
    const headerVersion = req.headers['x-api-version'];
    if (headerVersion) version = headerVersion;

    req.apiVersion = version;
    res.set('X-API-Version', version);
    next();
  };
}

app.use('/api', apiVersion());
```

**When to use**: When supporting multiple API versions simultaneously.

## Snippet 11: Rate Limit Response Headers

```js
function rateLimitHeaders(res, { limit, remaining, reset }) {
  res.set({
    'X-RateLimit-Limit': limit,
    'X-RateLimit-Remaining': remaining,
    'X-RateLimit-Reset': reset,
    'Retry-After': Math.ceil((reset - Date.now() / 1000)),
  });
}

// Custom rate limiter with headers
const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
  handler: (req, res) => {
    rateLimitHeaders(res, { limit: 100, remaining: 0, reset: Date.now() + 60000 });
    res.status(429).json({ error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } });
  },
});
```

**When to use**: Custom rate limiter implementations that need to set standard rate limit headers.

## Snippet 12: Problem Details Error Format (RFC 7807)

```js
function problemDetails(req, res, { type, title, status, detail, instance, errors }) {
  const body = {
    type: type || `https://api.example.com/errors/${status}`,
    title: title || 'Unknown Error',
    status,
    detail: detail || 'An unexpected error occurred',
    instance: req.originalUrl,
    ...(errors && { errors }),
  };

  res.status(status).json(body);
}

// Usage
problemDetails(req, res, {
  type: 'https://api.example.com/errors/validation-error',
  title: 'Validation Error',
  status: 422,
  detail: 'The request body contains invalid fields.',
  errors: [
    { field: 'email', message: 'Must be a valid email address' },
  ],
});
```

**When to use**: When you want a standardized error format that follows RFC 7807 Problem Details specification.

## Snippet 13: Bulk Operations

```js
// POST /api/v1/products/bulk
router.post('/products/bulk', async (req, res) => {
  const { operations } = req.body;

  if (!Array.isArray(operations) || operations.length > 100) {
    return res.status(422).json({
      error: { code: 'INVALID_BULK', message: 'Operations must be an array of max 100 items' },
    });
  }

  const results = [];
  for (const [index, op] of operations.entries()) {
    try {
      switch (op.method) {
        case 'create':
          results.push({ index, status: 201, data: await db.products.create({ data: op.data }) });
          break;
        case 'update':
          results.push({ index, status: 200, data: await db.products.update({ where: { id: op.id }, data: op.data }) });
          break;
        case 'delete':
          await db.products.delete({ where: { id: op.id } });
          results.push({ index, status: 204 });
          break;
        default:
          results.push({ index, status: 400, error: `Unknown method: ${op.method}` });
      }
    } catch (err) {
      results.push({ index, status: 500, error: err.message });
    }
  }

  res.json({ data: results });
});
```

**When to use**: When clients need to perform multiple operations in a single request to reduce network round trips.

## Snippet 14: Async Job Pattern

```js
// POST /api/v1/exports - Start async job
router.post('/exports', async (req, res) => {
  const job = await db.jobs.create({ data: { type: 'export', status: 'pending' } });

  // Process asynchronously
  processJob(job.id).catch(console.error);

  res.status(202).json({
    data: { jobId: job.id, status: 'pending' },
    links: { status: `/api/v1/exports/${job.id}` },
  });
});

// GET /api/v1/exports/:id - Check job status
router.get('/exports/:id', async (req, res) => {
  const job = await db.jobs.findUnique({ where: { id: req.params.id } });
  if (!job) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found' } });

  const response = { data: { id: job.id, status: job.status } };

  if (job.status === 'completed') {
    response.data.url = job.resultUrl;
    response.links = { download: job.resultUrl };
  }

  res.json(response);
});
```

**When to use**: Long-running operations that cannot complete within a normal request timeout.

## Snippet 15: OpenAPI Response Schema Example

```yaml
components:
  schemas:
    ApiResponse:
      type: object
      properties:
        data: {}
        meta:
          type: object
          properties:
            page: { type: integer }
            limit: { type: integer }
            total: { type: integer }
            totalPages: { type: integer }
            hasNext: { type: boolean }
            hasPrev: { type: boolean }
        links:
          type: object
          properties:
            self: { type: string }
            next: { type: string, nullable: true }
            prev: { type: string, nullable: true }
    ApiError:
      type: object
      properties:
        error:
          type: object
          properties:
            code: { type: string }
            message: { type: string }
            details:
              type: array
              items:
                type: object
                properties:
                  field: { type: string }
                  message: { type: string }
                  code: { type: string }
```

**When to use**: Reference these schemas in all OpenAPI endpoint definitions to maintain consistency.
