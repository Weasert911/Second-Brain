# Express-Expert Examples

## Beginner: Basic REST API with CRUD Operations

**Description**: A simple Express API for managing users with validation and error handling.

```js
import express from 'express';

const app = express();
app.use(express.json({ limit: '1mb' }));

let users = [];
let nextId = 1;

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const user = { id: nextId++, name, email, createdAt: new Date() };
  users.push(user);
  res.status(201).json(user);
});

app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  const paginated = users.slice(start, start + limit);
  res.json({
    data: paginated,
    meta: { page: Number(page), limit: Number(limit), total: users.length },
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000);
```

**Explanation**: This demonstrates CRUD routes, request body validation, pagination with query params, route params for resource identification, proper status codes (201, 204, 400, 404, 500), and error handling middleware.

## Intermediate: Secure API with Validation and Auth

**Description**: A secure Express API with Zod validation, JWT authentication, and rate limiting.

```js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts' },
});

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    });
  }
  req.validatedBody = result.data;
  next();
};

app.post('/api/auth/register', validate(userSchema), async (req, res) => {
  const { name, email, password } = req.validatedBody;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await db.users.create({ name, email, password: hashedPassword });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: { id: user.id, name, email }, token });
});

app.post('/api/auth/login', authLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await db.users.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email }, token });
});

app.get('/api/users/me', authenticate, (req, res) => {
  res.json(req.user);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
```

**Explanation**: This demonstrates helmet for security headers, CORS configuration, rate limiting with separate limits for auth routes, Zod validation middleware, JWT authentication middleware, password hashing, and proper error response format.

## Advanced: File Upload with Validation and Thumbnail Generation

**Description**: File upload API with multer, file type validation, thumbnail generation, and progress events.

```js
import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.post('/api/upload/single', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl = `/uploads/${req.file.filename}`;
  let thumbnailUrl = null;

  if (req.file.mimetype.startsWith('image/')) {
    const thumbnailName = `thumb_${req.file.filename}`;
    await sharp(req.file.path)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 70 })
      .toFile(`uploads/${thumbnailName}`);
    thumbnailUrl = `/uploads/${thumbnailName}`;
  }

  res.status(201).json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
    url: fileUrl,
    thumbnailUrl,
  });
}));

app.post('/api/upload/multiple', upload.array('files', 5), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploaded = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    url: `/uploads/${file.filename}`,
  }));

  res.status(201).json({ count: uploaded.length, files: uploaded });
}));

app.get('/api/files/:filename', asyncHandler(async (req, res) => {
  const filePath = path.join('uploads', req.params.filename);
  try {
    await fs.access(filePath);
    res.sendFile(filePath, { root: process.cwd() });
  } catch {
    res.status(404).json({ error: 'File not found' });
  }
}));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Max 10MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(3000);
```

**Explanation**: This advanced example demonstrates multer with disk storage and file filtering, Sharp thumbnail generation for images, asyncHandler wrapper for async error catching, multer-specific error handling (file size, type), and file serving with access checks.

## Production: Full Middleware Stack with WebSocket and Testing

**Description**: Production-ready Express app with WebSocket, compression, structured logging, and tests.

```js
// app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import expressWs from 'express-ws';
import { errorHandler } from './middleware/errorHandler.js';
import { routes } from './routes/index.js';
import logger from './utils/logger.js';

export function createApp() {
  const app = express();
  expressWs(app);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"] },
    },
  }));
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') }));
  app.use(compression({ level: 6, threshold: 1024 }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

  const limiter = rateLimit({ windowMs: 60000, max: 60 });
  app.use('/api', limiter);

  app.use('/api/v1', routes);

  app.ws('/ws', (ws, req) => {
    ws.on('message', msg => ws.send(`Echo: ${msg}`));
  });

  app.use(errorHandler);
  return app;
}

// test/app.test.js
import supertest from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('API Tests', () => {
  it('GET /api/v1/health returns 200', async () => {
    const res = await supertest(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/v1/users with invalid data returns 400', async () => {
    const res = await supertest(app)
      .post('/api/v1/users')
      .send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/v1/users with valid data returns 201', async () => {
    const res = await supertest(app)
      .post('/api/v1/users')
      .send({ name: 'John', email: 'john@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('John');
  });

  it('Rate limits auth endpoint', async () => {
    const authLimiter = rateLimit({ windowMs: 60000, max: 2 });
    app.use('/api/v1/auth', authLimiter);

    const requests = Array(3).fill().map(() =>
      supertest(app).post('/api/v1/auth/login').send({ email: 'test@test.com', password: 'pass' })
    );
    const responses = await Promise.all(requests);
    expect(responses[2].status).toBe(429);
  });
});
```

**Explanation**: This production example shows a complete middleware pipeline with helmet, CORS, compression, structured logging, WebSocket integration, rate limiting, API versioning, and comprehensive supertest integration tests with rate limit verification.
