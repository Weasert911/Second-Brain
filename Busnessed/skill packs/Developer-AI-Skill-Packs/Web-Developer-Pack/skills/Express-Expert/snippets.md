# Express-Expert Snippets

## Snippet 1: Custom Error Classes

```js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
```

**When to use**: Every Express application needs consistent error types for the error handler to process.

## Snippet 2: Centralized Error Handler

```js
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const body = {
    error: {
      message: err.message || 'Internal server error',
      ...(err.errors && { details: err.errors }),
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    body.error.stack = err.stack;
  }

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${err.stack}`);
  }

  res.status(statusCode).json(body);
}
```

**When to use**: Always as the last middleware in the Express stack to catch all errors.

## Snippet 3: Async Handler Wrapper

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/users', asyncHandler(async (req, res) => {
  const users = await db.users.findMany();
  res.json({ data: users });
}));
```

**When to use**: Prevents unhandled promise rejections in async route handlers. Use with every async route.

## Snippet 4: Zod Validation Middleware

```js
import { z } from 'zod';

const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    next(err);
  }
};

// Schema definition
const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

// Usage
router.post('/users', validate(userSchema), createUser);
```

**When to use**: All POST, PUT, and PATCH routes that accept a request body.

## Snippet 5: JWT Authentication Middleware

```js
import jwt from 'jsonwebtoken';

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ error: message });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

**When to use**: Protect routes that require authentication. Use `authorize` for role-based access control.

## Snippet 6: Pagination Helper

```js
function paginate(query = {}) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function paginatedResponse(data, total, { page, limit }) {
  return {
    data,
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

// Usage
router.get('/users', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const [users, total] = await Promise.all([
    db.users.findMany({ skip, take: limit }),
    db.users.count(),
  ]);
  res.json(paginatedResponse(users, total, { page, limit }));
}));
```

**When to use**: Every list endpoint that needs pagination support.

## Snippet 7: Rate Limiter Factory

```js
import rateLimit from 'express-rate-limit';

function createRateLimiter({ windowMs = 60000, max = 60, message = 'Too many requests' } = {}) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
    keyGenerator: (req) => {
      return req.headers['x-forwarded-for'] || req.ip;
    },
    skip: (req) => req.path === '/health',
  });
}

const apiLimiter = createRateLimiter({ windowMs: 60000, max: 100 });
const authLimiter = createRateLimiter({ windowMs: 900000, max: 5, message: 'Too many login attempts' });
```

**When to use**: Different rate limits for different endpoint groups (public API vs auth vs upload).

## Snippet 8: File Upload with Size Validation

```js
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = 'uploads';
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP files are allowed'));
    }
  },
});

// Routes
router.post('/upload', upload.single('file'), handler);
router.post('/uploads', upload.array('files', 5), handler);
```

**When to use**: Any endpoint that accepts file uploads with size and type restrictions.

## Snippet 9: CORS Configuration

```js
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-RateLimit-Remaining'],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
```

**When to use**: Configure CORS once at the application level with specific origins, methods, and headers.

## Snippet 10: Structured Logging (Morgan + pino)

```js
import morgan from 'morgan';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (req) => req.path === '/health',
  }
);

app.use(morganMiddleware);
export default logger;
```

**When to use**: Production logging with structured JSON output for log aggregation.

## Snippet 11: Health Check Endpoint

```js
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.APP_VERSION || '1.0.0',
  });
});

router.get('/ready', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: 'ready', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'disconnected' });
  }
});
```

**When to use**: Required for container orchestration (Kubernetes liveness/readiness probes) and load balancer health checks.

## Snippet 12: Graceful Shutdown

```js
function gracefulShutdown(server, options = {}) {
  const { timeout = 10000, cleanup } = options;

  const shutdown = async (signal) => {
    console.log(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log('HTTP server closed');
      if (cleanup) await cleanup();
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, timeout);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Usage
const server = app.listen(PORT, () => console.log(`Server on port ${PORT}`));
gracefulShutdown(server, {
  cleanup: async () => {
    await db.$disconnect();
    await redis.quit();
  },
});
```

**When to use**: Every production server to ensure clean shutdown and proper cleanup of resources.

## Snippet 13: Request ID Middleware

```js
import { randomUUID } from 'crypto';

function requestId(req, res, next) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}

// Usage in logger
const logger = pino();
app.use(requestId);
app.use((req, res, next) => {
  req.log = logger.child({ requestId: req.id });
  next();
});
```

**When to use**: Distributed tracing, debugging, and correlating log entries across microservices.

## Snippet 14: Conditional Middleware

```js
function unless(path, middleware) {
  return (req, res, next) => {
    if (path === req.path || (path instanceof RegExp && path.test(req.path))) {
      return next();
    }
    return middleware(req, res, next);
  };
}

// Skip rate limiter for health checks
app.use(unless('/health', rateLimiter));

// Apply auth except to public routes
const publicPaths = ['/login', '/register', '/health'];
app.use((req, res, next) => {
  if (publicPaths.includes(req.path)) return next();
  return authenticate(req, res, next);
});
```

**When to use**: Apply middleware conditionally based on the request path or other criteria.

## Snippet 15: API Versioning Middleware

```js
function apiVersion(options = {}) {
  const { defaultVersion = '1', supportedVersions = ['1', '2'] } = options;

  return (req, res, next) => {
    let version = defaultVersion;

    // Check Accept header
    const accept = req.headers.accept;
    if (accept) {
      const match = accept.match(/version=(\d+)/);
      if (match && supportedVersions.includes(match[1])) {
        version = match[1];
      }
    }

    // Check URL prefix
    const urlMatch = req.path.match(/^\/api\/v(\d+)\//);
    if (urlMatch && supportedVersions.includes(urlMatch[1])) {
      version = urlMatch[1];
    }

    req.apiVersion = version;
    res.setHeader('X-API-Version', version);
    next();
  };
}

// V1 routes
const v1Router = Router();
v1Router.get('/users', v1UserHandler);

// V2 routes 
const v2Router = Router();
v2Router.get('/users', v2UserHandler);

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

**When to use**: When you need to support multiple API versions simultaneously for backward compatibility.
