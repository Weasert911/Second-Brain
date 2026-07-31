# REST-API-Design Templates

## Template 1: List Endpoint with Pagination

**Name**: `list-endpoint-template`
**Description**: Paginated list endpoint with filtering, sorting, and field selection.

```js
// GET /api/v1/{{resources}}?page=1&limit=20&sort=-createdAt&filter[status]=active&fields=id,name

router.get('/{{resources}}', async (req, res) => {
  const { page = 1, limit = {{defaultLimit}}, sort, fields } = req.query;
  const filter = req.query.filter || {};

  const where = {};
  {{#each filters}}
  if (filter.{{this.field}}) where.{{this.field}} = filter.{{this.field}};
  {{/each}}

  let orderBy = { createdAt: 'desc' };
  if (sort) {
    const field = sort.replace(/^-/, '');
    const direction = sort.startsWith('-') ? 'desc' : 'asc';
    orderBy = { [field]: direction };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    db.{{resource}}.{{findMethod}}({
      where,
      skip,
      take: limit,
      orderBy,
      select: fields ? fields.split(',').reduce((acc, f) => ({ ...acc, [f]: true }), {}) : undefined,
    }),
    db.{{resource}}.{{countMethod}}({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

  res.json({
    data: items,
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
```

**Usage Notes**: Replace `{{resources}}` (e.g., `products`), `{{resource}}` (e.g., `product`), `{{defaultLimit}}` (e.g., `20`), `{{findMethod}}`/`{{countMethod}}` with Prisma/ORM methods. Add filter fields to the `filters` array.

## Template 2: Single Resource Endpoint

**Name**: `single-resource-template`
**Description**: Get, create, update, and delete endpoints for a single resource.

```js
// GET /api/v1/{{resources}}/:id
router.get('/{{resources}}/:id', async (req, res) => {
  const item = await db.{{resource}}.{{findUniqueMethod}}({ where: { id: req.params.id } });
  if (!item) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: '{{ResourceName}} not found' },
    });
  }
  res.json({ data: item });
});

// POST /api/v1/{{resources}}
router.post('/{{resources}}', async (req, res) => {
  const item = await db.{{resource}}.{{createMethod}}({ data: req.body });
  res.status(201).location(`/api/v1/{{resources}}/${item.id}`).json({ data: item });
});

// PUT /api/v1/{{resources}}/:id
router.put('/{{resources}}/:id', async (req, res) => {
  const item = await db.{{resource}}.{{updateMethod}}({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ data: item });
});

// PATCH /api/v1/{{resources}}/:id
router.patch('/{{resources}}/:id', async (req, res) => {
  const item = await db.{{resource}}.{{updateMethod}}({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ data: item });
});

// DELETE /api/v1/{{resources}}/:id
router.delete('/{{resources}}/:id', async (req, res) => {
  await db.{{resource}}.{{deleteMethod}}({ where: { id: req.params.id } });
  res.status(204).send();
});
```

**Usage Notes**: Replace `{{resources}}` (e.g., `users`), `{{ResourceName}}` (e.g., `User`), `{{resource}}` (e.g., `user`), and methods accordingly.

## Template 3: Error Response Template

**Name**: `error-response-template`
**Description**: Standardized error response format for all error scenarios.

```json
{
  "error": {
    "code": "{{ERROR_CODE}}",
    "message": "{{Human readable message}}",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "code": "INVALID_FORMAT"
      }
    ]
  }
}
```

**HTTP Status Codes**:
- `400 BAD_REQUEST` - General client error
- `401 UNAUTHORIZED` - Missing or invalid authentication
- `403 FORBIDDEN` - Authenticated but not authorized
- `404 NOT_FOUND` - Resource does not exist
- `409 CONFLICT` - Resource state conflict
- `422 UNPROCESSABLE_ENTITY` - Validation errors
- `429 TOO_MANY_REQUESTS` - Rate limit exceeded
- `500 INTERNAL_ERROR` - Server error

**Usage Notes**: Map error codes to enum constants. Always include a human-readable message. Include details for validation errors with field-level information.

## Template 4: Cursor-Based Pagination

**Name**: `cursor-pagination-template`
**Description**: Cursor-based pagination for stable, real-time list endpoints.

```js
// GET /api/v1/{{resources}}?cursor=abc123&limit=20

router.get('/{{resources}}', async (req, res) => {
  const { cursor, limit = {{defaultLimit}} } = req.query;
  const take = Math.min(Number(limit), {{maxLimit}});

  const items = await db.{{resource}}.{{findMethod}}({
    take: take + 1, // Fetch one extra to check if more exist
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
  });

  const hasNext = items.length > take;
  if (hasNext) items.pop();

  res.json({
    data: items,
    meta: {
      limit: take,
      hasNext,
      cursor: hasNext ? items[items.length - 1].id : null,
    },
    links: {
      self: `/api/v1/{{resources}}?limit=${take}${cursor ? `&cursor=${cursor}` : ''}`,
      next: hasNext ? `/api/v1/{{resources}}?limit=${take}&cursor=${items[items.length - 1].id}` : null,
    },
  });
});
```

**Usage Notes**: Replace `{{resources}}`, `{{resource}}`, `{{defaultLimit}}` (e.g., `20`), `{{maxLimit}}` (e.g., `100`). Use cursor-based for live-updating lists (feeds, notifications). Offset-based for admin panels.

## Template 5: OpenAPI Spec Snippet

**Name**: `openapi-template`
**Description**: OpenAPI 3.0 specification template for a resource endpoint.

```yaml
openapi: 3.0.0
info:
  title: {{API_NAME}}
  version: "{{API_VERSION}}"
  description: {{API_DESCRIPTION}}

paths:
  /api/v1/{{resources}}:
    get:
      summary: List all {{resources}}
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
        - name: sort
          in: query
          schema: { type: string, example: "-createdAt" }
        - name: filter[{{filterField}}]
          in: query
          schema: { type: string }
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/{{ResourceName}}'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    post:
      summary: Create a {{resourceName}}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Create{{ResourceName}}'
      responses:
        "201":
          description: Resource created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/{{ResourceName}}'

components:
  schemas:
    {{ResourceName}}:
      type: object
      properties:
        id: { type: string, format: uuid }
        {{field1}}: { type: string }
        {{field2}}: { type: string }
        createdAt: { type: string, format: date-time }
    PaginationMeta:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        total: { type: integer }
        totalPages: { type: integer }
        hasNext: { type: boolean }
        hasPrev: { type: boolean }
```

**Usage Notes**: Replace `{{API_NAME}}`, `{{API_VERSION}}`, `{{API_DESCRIPTION}}`, `{{resources}}`, `{{ResourceName}}`, `{{resourceName}}`, `{{field1}}`/`{{field2}}` with actual values.

## Template 6: Rate Limiter with Response Headers

**Name**: `rate-limiter-template`
**Description**: Rate limiter that sets standard rate limit response headers.

```js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: {{windowMs}},
  max: {{maxRequests}},
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip;
  },
});

// Headers set automatically:
// X-RateLimit-Limit: {{maxRequests}}
// X-RateLimit-Remaining: {remaining}
// X-RateLimit-Reset: {unix timestamp}
// Retry-After: {seconds}
```

**Usage Notes**: Replace `{{windowMs}}` (e.g., `60000` for 1 min), `{{maxRequests}}` (e.g., `100`). Use different instances for different endpoints.

## Template 7: Filter/Sort/Select Utility

**Name**: `filter-sort-select-template`
**Description**: Utility functions for parsing common query parameters.

```js
export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || {{defaultLimit}}));
  return { page, limit, skip: (page - 1) * limit };
}

export function parseSort(query, allowedFields = ['createdAt', 'updatedAt', 'name']) {
  if (!query.sort) return { createdAt: 'desc' };
  const field = query.sort.replace(/^-/, '');
  if (!allowedFields.includes(field)) return { createdAt: 'desc' };
  return { [field]: query.sort.startsWith('-') ? 'desc' : 'asc' };
}

export function parseFilter(query, filterMapping = {}) {
  const filter = query.filter || {};
  const where = {};
  for (const [key, value] of Object.entries(filter)) {
    const mapper = filterMapping[key];
    if (mapper) {
      Object.assign(where, mapper(value));
    }
  }
  return where;
}

export function parseFields(query, defaults = ['id', 'createdAt']) {
  if (!query.fields) return undefined;
  return query.fields.split(',').reduce((acc, f) => {
    if (f.trim()) acc[f.trim()] = true;
    return acc;
  }, {});
}
```

**Usage Notes**: Replace `{{defaultLimit}}` (e.g., `20`). Customize `filterMapping` for each resource to map query params to database where clauses.

## Template 8: Idempotency Middleware

**Name**: `idempotency-middleware-template`
**Description**: Middleware for handling idempotency keys on mutating endpoints.

```js
const idempotencyStore = new Map();
const TTL = {{ttlMs}}; // 24 hours

export function idempotent(req, res, next) {
  if (req.method === 'GET' || req.method === 'DELETE') return next();

  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const existing = idempotencyStore.get(key);
  if (existing) {
    return res.status(existing.status).json(existing.body);
  }

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    idempotencyStore.set(key, { status: res.statusCode, body });
    setTimeout(() => idempotencyStore.delete(key), TTL);
    originalJson(body);
  };

  next();
}
```

**Usage Notes**: Replace `{{ttlMs}}` (e.g., `86400000`). Use with POST and PATCH endpoints. Consider using Redis for distributed idempotency storage in production.
