# Express-Expert Templates

## Template 1: Express Application Setup

**Name**: `express-app-template`
**Description**: Complete Express app with standard middleware stack.

```js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler.js';
import { routes } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
  app.use(compression({ level: 6, threshold: 1024 }));
  app.use(express.json({ limit: '{{jsonLimit}}' }));
  app.use(express.urlencoded({ extended: true, limit: '{{urlLimit}}' }));
  app.use(morgan('{{logFormat}}'));

  app.use('/api/v{{apiVersion}}', routes);

  app.use(errorHandler);
  return app;
}
```

**Usage Notes**: Replace `{{jsonLimit}}` (e.g., `1mb`), `{{urlLimit}}` (e.g., `1mb`), `{{logFormat}}` (e.g., `combined`, `dev`, `short`), `{{apiVersion}}` (e.g., `1`).

## Template 2: Router with Validation

**Name**: `router-template`
**Description**: Modular router with Zod validation middleware.

```js
import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const {{resourceName}}Schema = z.object({
  {{field1}}: z.string().min(1, '{{field1Label}} is required'),
  {{field2}}: z.string().email('Invalid {{field2Label}}'),
});

router.get('/', asyncHandler(async (req, res) => {
  const items = await {{service}}.{{listMethod}}();
  res.json({ data: items });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const item = await {{service}}.{{getMethod}}(req.params.id);
  if (!item) return res.status(404).json({ error: '{{resourceName}} not found' });
  res.json({ data: item });
}));

router.post('/', asyncHandler(async (req, res) => {
  const validated = {{resourceName}}Schema.parse(req.body);
  const item = await {{service}}.{{createMethod}}(validated);
  res.status(201).json({ data: item });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const validated = {{resourceName}}Schema.partial().parse(req.body);
  const item = await {{service}}.{{updateMethod}}(req.params.id, validated);
  res.json({ data: item });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await {{service}}.{{deleteMethod}}(req.params.id);
  res.status(204).send();
}));

export default router;
```

**Usage Notes**: Replace `{{resourceName}}` (e.g., `User`, `Product`), `{{field1}}`/`{{field2}}` with field names, `{{service}}` with the service module, and methods accordingly.

## Template 3: Error Handler with Custom Classes

**Name**: `error-handler-template`
**Description**: Custom error classes and centralized error handler middleware.

```js
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends ApiError {
  constructor(errors) {
    super('Validation failed', 400);
    this.errors = errors;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const response = {
    error: {
      message: err.message || 'Internal server error',
      ...(err.errors && { details: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  if (statusCode === 500) {
    console.error('Unhandled error:', err);
  }

  res.status(statusCode).json(response);
}
```

**Usage Notes**: Add custom error types as needed. The stack trace is only exposed in development. Log 500 errors for monitoring.

## Template 4: Auth Middleware (JWT)

**Name**: `auth-middleware-template`
**Description**: JWT authentication middleware with role-based access control.

```js
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) throw new UnauthorizedError('Authentication required');
    if (!allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError('Insufficient permissions');
    }
    next();
  };
}

// Usage: router.post('/admin', authenticate, authorize('admin'), handler);
```

**Usage Notes**: Customize role checking logic as needed. The authenticate middleware must be used before authorize.

## Template 5: Rate Limiter by Route

**Name**: `rate-limiter-template`
**Description**: Rate limiters for different endpoint types.

```js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: {{apiWindowMs}},
  max: {{apiMax}},
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

export const authLimiter = rateLimit({
  windowMs: {{authWindowMs}},
  max: {{authMax}},
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts' },
  skipSuccessfulRequests: true,
});

export const uploadLimiter = rateLimit({
  windowMs: {{uploadWindowMs}},
  max: {{uploadMax}},
  message: { error: 'Upload limit exceeded' },
});
```

**Usage Notes**: Replace `{{apiWindowMs}}` (e.g., `60000`), `{{apiMax}}` (e.g., `100`), `{{authWindowMs}}` (e.g., `900000`), `{{authMax}}` (e.g., `5`), `{{uploadWindowMs}}` (e.g., `3600000`), `{{uploadMax}}` (e.g., `10`).

## Template 6: File Upload Configuration

**Name**: `upload-template`
**Description**: Multer configuration for file uploads with validation.

```js
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '{{uploadDir}}'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const allowedMimes = ['{{mimeType1}}', '{{mimeType2}}', '{{mimeType3}}'];

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: { fileSize: {{maxFileSize}} },
});
```

**Usage Notes**: Replace `{{uploadDir}}` (e.g., `uploads/`), `{{mimeType1}}`/`{{mimeType2}}`/`{{mimeType3}}` (e.g., `image/jpeg`, `image/png`, `application/pdf`), `{{maxFileSize}}` (e.g., `5 * 1024 * 1024` for 5MB).

## Template 7: Async Handler Wrapper

**Name**: `async-handler-template`
**Description**: Wrapper for catching async errors in route handlers.

```js
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Alternative: use 'express-async-errors' package for auto-catching
```

**Usage Notes**: Use with all async route handlers. Alternatively, import 'express-async-errors' once in entry point for automatic catching.

## Template 8: Supertest Integration Test

**Name**: `test-template`
**Description**: Supertest integration test template with setup and teardown.

```js
import supertest from 'supertest';
import { createApp } from '../app.js';

const app = createApp();
const request = supertest(app);

describe('{{resourceName}} API', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request
      .post('/api/v1/auth/login')
      .send({ email: '{{testEmail}}', password: '{{testPassword}}' });
    authToken = res.body.token;
  });

  describe('GET /api/v1/{{resourcePath}}', () => {
    it('returns 200 with data', async () => {
      const res = await request
        .get('/api/v1/{{resourcePath}}')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const res = await request.get('/api/v1/{{resourcePath}}');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/{{resourcePath}}', () => {
    it('creates resource with valid data', async () => {
      const res = await request
        .post('/api/v1/{{resourcePath}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ {{field1}}: '{{value1}}', {{field2}}: '{{value2}}' });
      expect(res.status).toBe(201);
      expect(res.body.data.{{field1}}).toBe('{{value1}}');
    });

    it('returns 400 with invalid data', async () => {
      const res = await request
        .post('/api/v1/{{resourcePath}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });
});
```

**Usage Notes**: Replace `{{resourceName}}` (e.g., `Users`), `{{resourcePath}}` (e.g., `users`), `{{field1}}`/`{{field2}}` with field names, `{{value1}}`/`{{value2}}` with test values, `{{testEmail}}`/`{{testPassword}}` with test credentials.
