# Authentication-Systems Templates

## Template 1: Password Hashing Service

**Name**: `password-service-template`
**Description**: Password hashing and verification with bcrypt.

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = {{saltRounds}};

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function isPasswordWeak(password: string): Promise<boolean> {
  return password.length < {{minLength}} || !/[A-Z]/.test(password) || !/[0-9]/.test(password);
}
```

**Usage Notes**: Replace `{{saltRounds}}` (e.g., `12`), `{{minLength}}` (e.g., `8`). Increase salt rounds as hardware improves (aim for ~300ms hash time).

## Template 2: JWT Token Service

**Name**: `jwt-service-template`
**Description**: JWT token generation, verification, and refresh rotation.

```typescript
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = '{{accessExpiry}}';
const REFRESH_EXPIRY = '{{refreshExpiry}}';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(userId: string, tokenId: string): string {
  return jwt.sign({ sub: userId, jti: tokenId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; jti: string } {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string; jti: string };
}

export function generateTokenPair(user: { id: string; email: string; role: string }) {
  const tokenId = crypto.randomUUID();
  return {
    accessToken: generateAccessToken({ sub: user.id, email: user.email, role: user.role }),
    refreshToken: generateRefreshToken(user.id, tokenId),
    tokenId,
  };
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}
```

**Usage Notes**: Replace `{{accessExpiry}}` (e.g., `15m`), `{{refreshExpiry}}` (e.g., `7d`). Use separate secrets for access and refresh tokens.

## Template 3: OAuth2 Client Setup

**Name**: `oauth2-template`
**Description**: OAuth2 configuration for multiple social providers.

```typescript
export const oauthProviders = {
  {{provider1}}: {
    clientId: process.env.{{PROVIDER1}}_CLIENT_ID!,
    clientSecret: process.env.{{PROVIDER1}}_CLIENT_SECRET!,
    authorizationUrl: '{{provider1AuthUrl}}',
    tokenUrl: '{{provider1TokenUrl}}',
    userinfoUrl: '{{provider1UserinfoUrl}}',
    scopes: ['{{provider1Scopes}}'],
  },
  {{provider2}}: {
    clientId: process.env.{{PROVIDER2}}_CLIENT_ID!,
    clientSecret: process.env.{{PROVIDER2}}_CLIENT_SECRET!,
    authorizationUrl: '{{provider2AuthUrl}}',
    tokenUrl: '{{provider2TokenUrl}}',
    userinfoUrl: '{{provider2UserinfoUrl}}',
    scopes: ['{{provider2Scopes}}'],
  },
};

export function generatePKCEChallenge(): { verifier: string; challenge: string } {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}
```

**Usage Notes**: Replace `{{provider1}}`/`{{provider2}}` (e.g., `google`, `github`), URLs, scopes. Use PKCE for public clients.

## Template 4: Session-Based Auth Middleware

**Name**: `session-auth-template`
**Description**: Express session authentication with security.

```typescript
import session from 'express-session';
import { RedisStore } from 'connect-redis';

// Session configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  name: '{{sessionCookieName}}',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: '{{sameSite}}',
    maxAge: {{maxAgeMs}},
    path: '/',
  },
}));

// Authenticate middleware
function authenticate(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Authorize middleware
function authorize(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (roles.length > 0 && !roles.includes(req.session.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

**Usage Notes**: Replace `{{sessionCookieName}}` (e.g., `sid`), `{{sameSite}}` (e.g., `strict`, `lax`), `{{maxAgeMs}}` (e.g., `86400000` for 24h).

## Template 5: MFA/TOTP Setup

**Name**: `mfa-template`
**Description**: TOTP multi-factor authentication setup and verification.

```typescript
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

const APP_NAME = '{{appName}}';

export function generateMFASecret(): string {
  return authenticator.generateSecret();
}

export function generateOTPAuthURL(email: string, secret: string): string {
  return authenticator.keyuri(email, APP_NAME, secret);
}

export async function generateQRCode(otpauth: string): Promise<string> {
  return QRCode.toDataURL(otpauth);
}

export function verifyMFACode(token: string, secret: string): boolean {
  return authenticator.check(token, secret);
}

export function generateBackupCodes(count: number = {{backupCodeCount}}): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );
}
```

**Usage Notes**: Replace `{{appName}}` (e.g., `MyApp`), `{{backupCodeCount}}` (e.g., `8`). Store backup codes hashed in database.

## Template 6: CSRF Protection

**Name**: `csrf-template`
**Description**: Double submit cookie CSRF protection pattern.

```typescript
import crypto from 'crypto';

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function csrfMiddleware(req: any, res: any, next: any) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const headerToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

// Set CSRF cookie on GET request
app.get('/api/csrf-token', (req, res) => {
  const token = generateCSRFToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  res.json({ token });
});
```

**Usage Notes**: The cookie must be readable by JavaScript (httpOnly: false). The client reads it and sends it in the X-CSRF-Token header.

## Template 7: Rate Limiter for Auth Endpoints

**Name**: `auth-rate-limiter-template`
**Description**: Rate limiting specifically for authentication endpoints.

```typescript
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: {{loginWindowMs}},
  max: {{loginMax}},
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.email || req.ip;
  },
});

export const registerLimiter = rateLimit({
  windowMs: {{registerWindowMs}},
  max: {{registerMax}},
  message: { error: 'Too many registration attempts.' },
});

export const passwordResetLimiter = rateLimit({
  windowMs: {{resetWindowMs}},
  max: {{resetMax}},
  message: { error: 'Too many password reset requests.' },
});

export const mfaLimiter = rateLimit({
  windowMs: {{mfaWindowMs}},
  max: {{mfaMax}},
  message: { error: 'Too many MFA attempts.' },
});
```

**Usage Notes**: Replace window/limit values. Login: 5 per 15 min per email. Register: 3 per hour per IP. Password reset: 3 per hour per email. MFA: 5 per 15 min.

## Template 8: RBAC Authorization System

**Name**: `rbac-template`
**Description**: Role-Based Access Control with permissions matrix.

```typescript
interface Permission {
  action: string;
  resource: string;
}

interface Role {
  name: string;
  permissions: Permission[];
}

const roles: Record<string, Role> = {
  admin: {
    name: 'admin',
    permissions: [
      { action: '*', resource: '*' },
    ],
  },
  moderator: {
    name: 'moderator',
    permissions: [
      { action: 'read', resource: '*' },
      { action: 'update', resource: 'posts' },
      { action: 'delete', resource: 'posts' },
    ],
  },
  user: {
    name: 'user',
    permissions: [
      { action: 'read', resource: 'posts' },
      { action: 'create', resource: 'posts' },
      { action: 'update', resource: 'own_posts' },
      { action: 'delete', resource: 'own_posts' },
    ],
  },
};

export function hasPermission(userRole: string, action: string, resource: string, isOwner: boolean = false): boolean {
  const role = roles[userRole];
  if (!role) return false;

  return role.permissions.some(p =>
    (p.action === '*' || p.action === action) &&
    (p.resource === '*' || p.resource === resource || (p.resource === 'own_' + resource && isOwner))
  );
}

export function requirePermission(action: string, resource: string) {
  return (req: any, res: any, next: any) => {
    const isOwner = req.params.id === req.user?.id;
    if (!hasPermission(req.user?.role, action, resource, isOwner)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

**Usage Notes**: Extend roles and permissions as needed. The `own_` prefix pattern allows users to act on their own resources.
