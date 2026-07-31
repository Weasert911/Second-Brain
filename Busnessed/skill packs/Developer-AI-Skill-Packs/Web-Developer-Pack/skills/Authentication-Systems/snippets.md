# Authentication-Systems Snippets

## Snippet 1: bcrypt Password Hashing

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

**When to use**: Every password storage operation should use bcrypt with cost factor 12+.

## Snippet 2: JWT Generation and Verification

```typescript
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(user: { id: string; role: string }) {
  return jwt.sign({ sub: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { sub: string; role: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string };
}
```

**When to use**: Stateless authentication where you need short-lived access tokens with long-lived refresh tokens.

## Snippet 3: Refresh Token Rotation

```typescript
async function rotateRefreshToken(oldToken: string, userId: string) {
  // Verify old token
  const payload = verifyRefreshToken(oldToken);

  // Add old token to blacklist
  await db.tokenBlacklist.create({
    token: oldToken,
    userId,
    expiresAt: new Date(payload.exp! * 1000),
  });

  // Generate new token
  const newRefreshToken = generateRefreshToken(userId);
  const accessToken = generateAccessToken({ id: userId, role: 'user' });

  return { accessToken, refreshToken: newRefreshToken };
}
```

**When to use**: Every token refresh operation should invalidate the old refresh token to prevent token reuse.

## Snippet 4: OAuth2 State Generator

```typescript
import crypto from 'crypto';

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Store in session/Redis with expiry
export function storeOAuthState(state: string, data: any) {
  redis.setex(`oauth:state:${state}`, 600, JSON.stringify(data));
}

export function verifyOAuthState(state: string): any {
  return redis.get(`oauth:state:${state}`).then(data => {
    if (data) redis.del(`oauth:state:${state}`);
    return data ? JSON.parse(data) : null;
  });
}
```

**When to use**: Every OAuth2 authorization request should generate and validate a state parameter to prevent CSRF attacks.

## Snippet 5: CSRF Double Submit Cookie

```typescript
function csrfMiddleware(req: any, res: any, next: any) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const headerToken = req.headers['x-xsrf-token'] || req.headers['x-csrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  next();
}

// Set CSRF cookie
app.get('/api/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
  });
  res.json({ csrfToken: token });
});
```

**When to use**: Any application using cookie-based authentication needs CSRF protection for state-changing requests.

## Snippet 6: TOTP Multi-Factor Authentication

```typescript
import { authenticator } from 'otplib';

const APP_NAME = 'MyApp';

export function generateMFASecret(): string {
  return authenticator.generateSecret();
}

export function getOTPAuthURL(email: string, secret: string): string {
  return authenticator.keyuri(email, APP_NAME, secret);
}

export function verifyTOTP(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );
}
```

**When to use**: Adding an extra layer of security beyond passwords, especially for admin accounts.

## Snippet 7: Password Reset Flow

```typescript
import crypto from 'crypto';

async function requestPasswordReset(email: string) {
  const user = await db.users.findByEmail(email);
  if (!user) return; // Don't reveal if email exists

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour

  await db.passwordResetTokens.create({
    userId: user.id,
    token,
    expiresAt,
  });

  await sendEmail({
    to: email,
    subject: 'Password Reset',
    body: `Reset link: https://example.com/reset-password?token=${token}`,
  });
}

async function resetPassword(token: string, newPassword: string) {
  const resetToken = await db.passwordResetTokens.findUnique({ where: { token } });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);
  await db.users.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  await db.passwordResetTokens.delete({ where: { id: resetToken.id } });
  await db.userSessions.deleteMany({ where: { userId: resetToken.userId } });
}
```

**When to use**: Allow users to regain access to their accounts when they forget their passwords.

## Snippet 8: Rate Limiter for Auth

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
  keyGenerator: (req) => {
    // Rate limit by email for login, by IP for other endpoints
    return req.body?.email || req.ip;
  },
  skipSuccessfulRequests: true, // Only count failures
});

app.use('/api/auth/login', authLimiter);
```

**When to use**: All authentication endpoints to prevent brute force and credential stuffing attacks.

## Snippet 9: RBAC Enforcement

```typescript
function authorize(action: string, resource: string) {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const hasPermission = permissions[user.role]?.some(
      (p: any) => (p.action === '*' || p.action === action) &&
        (p.resource === '*' || p.resource === resource || p.resource === `own_${resource}`)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
router.delete('/posts/:id', authorize('delete', 'posts'), deletePost);
router.get('/profile', authorize('read', 'profile'), getProfile);
```

**When to use**: Protect routes based on user roles and permissions instead of simple role checks.

## Snippet 10: Secure Token Storage Configuration

```typescript
// Server-set httpOnly cookie for JWT
res.cookie('access_token', accessToken, {
  httpOnly: true,      // Not accessible from JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict',  // Same-site requests only
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/api',        // Only sent to API routes
});

res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',   // Only sent to auth endpoints
});
```

**When to use**: Storing tokens in httpOnly cookies prevents XSS attacks from stealing tokens.

## Snippet 11: Authentication Middleware

```typescript
function authenticate(req: any, res: any, next: any) {
  // Try cookie first, then Authorization header
  const token = req.cookies?.access_token ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired'
      : 'Invalid token';
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message },
    });
  }
}
```

**When to use**: Middleware for protected routes that checks for a valid JWT in either cookies or Authorization header.

## Snippet 12: Account Lockout

```typescript
async function checkAccountLockout(email: string): Promise<void> {
  const attempts = await db.loginAttempts.count({
    where: {
      email,
      createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });

  if (attempts >= 5) {
    const firstAttempt = await db.loginAttempts.findFirst({
      where: { email },
      orderBy: { createdAt: 'asc' },
    });
    const unlockAt = new Date(firstAttempt!.createdAt.getTime() + 15 * 60 * 1000);
    throw new Error(`Account locked. Try again after ${unlockAt.toLocaleTimeString()}`);
  }
}

async function recordLoginAttempt(email: string, success: boolean) {
  await db.loginAttempts.create({ email, success, createdAt: new Date() });
  // Clean up old attempts
  await db.loginAttempts.deleteMany({
    where: { email, createdAt: { lt: new Date(Date.now() - 15 * 60 * 1000) } },
  });
}
```

**When to use**: Prevent brute force attacks by locking accounts after repeated failed login attempts.

## Snippet 13: Passwordless Magic Link

```typescript
async function sendMagicLink(email: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.magicLinks.create({ email, token, expiresAt });

  await sendEmail({
    to: email,
    subject: 'Sign in to MyApp',
    body: `Click to sign in: https://example.com/auth/magic?token=${token}`,
  });
}

async function verifyMagicLink(token: string) {
  const magicLink = await db.magicLinks.findUnique({ where: { token } });
  if (!magicLink || magicLink.expiresAt < new Date() || magicLink.usedAt) {
    throw new Error('Invalid or expired link');
  }

  await db.magicLinks.update({ where: { id: magicLink.id }, data: { usedAt: new Date() } });

  let user = await db.users.findByEmail(magicLink.email);
  if (!user) {
    user = await db.users.create({ email: magicLink.email, passwordless: true });
  }

  return generateTokenPair({ id: user.id, email: user.email, role: 'user' });
}
```

**When to use**: Passwordless authentication for a frictionless login experience, especially for mobile or occasional users.

## Snippet 14: Permission Check Utility

```typescript
const permissions = {
  admin: ['*:*'],
  moderator: ['read:*', 'update:post', 'delete:post'],
  user: ['read:post', 'create:post', 'update:own_post', 'delete:own_post'],
};

function can(role: string, action: string, resource: string, ownerId?: string): boolean {
  const userPermissions = permissions[role];
  if (!userPermissions) return false;

  return userPermissions.some(p => {
    const [permAction, permResource] = p.split(':');
    if (permAction === '*' && permResource === '*') return true;
    if (permAction === '*' && permResource === resource) return true;
    if (permAction === action && permResource === '*') return true;
    if (permAction === action && permResource === resource) return true;
    if (permAction === action && permResource === `own_${resource}` && ownerId) return true;
    return false;
  });
}

// Usage
if (!can(req.user.role, 'update', 'post', post.authorId)) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

**When to use**: Fine-grained permission checks within route handlers for complex authorization logic.

## Snippet 15: Secure Logout

```typescript
async function logout(req: any, res: any) {
  const refreshToken = req.cookies?.refresh_token;
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      // Blacklist the token
      await db.tokenBlacklist.create({
        token: refreshToken,
        userId: payload.sub,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } catch { /* Token already invalid */ }
  }

  // Clear cookies
  res.clearCookie('access_token', { path: '/api' });
  res.clearCookie('refresh_token', { path: '/api/auth' });
  res.clearCookie('XSRF-TOKEN');

  // Clear session if using sessions
  if (req.session) {
    req.session.destroy();
  }

  res.status(204).send();
}
```

**When to use**: Comprehensive logout that blacklists refresh tokens, clears all auth cookies, destroys server sessions, and prevents token reuse after logout.
