# Authentication-Systems Examples

## Beginner: JWT Authentication with Refresh Tokens

**Description**: Complete JWT auth system with access and refresh tokens.

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// Token service
export function generateTokenPair(user: UserPayload): TokenPair {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): UserPayload {
  return jwt.verify(token, ACCESS_SECRET) as UserPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string };
}

// Password service
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Auth routes
import { Router } from 'express';
const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await db.users.findByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const passwordHash = await hashPassword(password);
  const user = await db.users.create({ email, passwordHash, role: 'user' });
  const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });

  res.status(201).json({ user: { id: user.id, email: user.email }, ...tokens });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });
  res.json({ user: { id: user.id, email: user.email }, ...tokens });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await db.users.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });
    res.json(tokens);
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  // Add token to blacklist with expiration
  const { refreshToken } = req.body;
  const payload = jwt.decode(refreshToken) as any;
  if (payload?.exp) {
    await db.tokenBlacklist.create({ token: refreshToken, expiresAt: new Date(payload.exp * 1000) });
  }
  res.status(204).send();
});

// Auth middleware
function authenticate(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    req.user = verifyAccessToken(header.split(' ')[1]);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

**Explanation**: This demonstrates complete JWT auth with password hashing (bcrypt, cost 12), token generation with distinct access/refresh secrets and expirations, token verification, refresh flow, logout with blacklisting, and authentication middleware.

## Intermediate: OAuth2 with PKCE and Social Login

**Description**: OAuth2 authorization code flow with PKCE and social provider integration.

```typescript
import crypto from 'crypto';

// PKCE code challenge generation
function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
}

function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

// OAuth2 client configuration
const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scopes: ['openid', 'email', 'profile'],
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
    scopes: ['user:email'],
  },
};

// Initiate OAuth2 login
router.get('/auth/:provider/login', (req, res) => {
  const provider = oauthConfig[req.params.provider];
  if (!provider) return res.status(400).json({ error: 'Unsupported provider' });

  const state = generateState();
  const { codeChallenge } = generatePKCE();

  // Store state and challenge temporarily (session/redis)
  tempStore.set(state, { provider: req.params.provider, codeChallenge });

  const authUrl = new URL(provider.authorizationUrl);
  authUrl.searchParams.set('client_id', provider.clientId);
  authUrl.searchParams.set('redirect_uri', `${process.env.BASE_URL}/auth/${req.params.provider}/callback`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', provider.scopes.join(' '));
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
});

// OAuth2 callback
router.get('/auth/:provider/callback', async (req, res) => {
  const { code, state } = req.query;
  const stored = tempStore.get(state as string);

  if (!stored || stored.provider !== req.params.provider) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  tempStore.delete(state as string);
  const provider = oauthConfig[stored.provider];

  // Exchange code for tokens
  const tokenResponse = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      code,
      code_verifier: stored.codeChallenge,
      redirect_uri: `${process.env.BASE_URL}/auth/${req.params.provider}/callback`,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  // Fetch user info
  const userResponse = await fetch(provider.userinfoUrl, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await userResponse.json();

  // Find or create user
  let user = await db.users.findByOAuth(stored.provider, profile.sub || String(profile.id));
  if (!user) {
    user = await db.users.create({
      email: profile.email,
      name: profile.name || profile.login,
      oauthProvider: stored.provider,
      oauthId: profile.sub || String(profile.id),
    });
  }

  const jwtTokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?access_token=${jwtTokens.accessToken}&refresh_token=${jwtTokens.refreshToken}`);
});
```

**Explanation**: This shows OAuth2 authorization code flow with PKCE for security, state parameter validation for CSRF prevention, code verifier/challenge generation, token exchange, userinfo fetching, and automatic account creation/linking.

## Advanced: MFA with TOTP and Session-Based Auth

**Description**: Session-based authentication with TOTP MFA and CSRF protection.

```typescript
import session from 'express-session';
import otplib from 'otplib';
import QRCode from 'qrcode';

// Session configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// CSRF token generation and validation
function csrfProtection(req: any, res: any, next: any) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const token = req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}

router.get('/auth/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = token;
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Need for JS access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ token });
});

// Login with MFA support
router.post('/auth/login', rateLimiter, async (req, res) => {
  const { email, password, mfaCode } = req.body;
  const user = await db.users.findByEmail(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.mfaEnabled) {
    if (!mfaCode) {
      return res.status(200).json({ requiresMfa: true, mfaToken: generateMfaToken(user.id) });
    }
    const verified = otplib.authenticator.check(mfaCode, user.mfaSecret);
    if (!verified) {
      return res.status(401).json({ error: 'Invalid MFA code' });
    }
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.createdAt = Date.now();

  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

// MFA setup
router.post('/auth/mfa/setup', authenticate, async (req, res) => {
  const secret = otplib.authenticator.generateSecret();
  const otpauth = otplib.authenticator.keyuri(req.user.email, 'MyApp', secret);

  // Store temp secret until verified
  req.session.pendingMfaSecret = secret;

  const qrCode = await QRCode.toDataURL(otpauth);

  // Generate backup codes
  const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(4).toString('hex'));

  res.json({
    secret,
    qrCode,
    backupCodes,
    message: 'Scan QR code with authenticator app, then verify with /auth/mfa/verify',
  });
});

router.post('/auth/mfa/verify', authenticate, async (req, res) => {
  const { code } = req.body;
  const secret = req.session.pendingMfaSecret;

  const verified = otplib.authenticator.check(code, secret);
  if (!verified) {
    return res.status(400).json({ error: 'Invalid code. Try again.' });
  }

  await db.users.update({
    where: { id: req.user.id },
    data: { mfaEnabled: true, mfaSecret: secret },
  });

  delete req.session.pendingMfaSecret;
  res.json({ success: true, message: 'MFA enabled successfully' });
});

// Authorization middleware
function authorize(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (roles.length > 0 && !roles.includes(req.session.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

**Explanation**: This production example demonstrates session-based auth with Redis store, TOTP MFA enrollment and verification with QR code, backup codes, CSRF protection with double submit cookie pattern, rate limiting on login, session-based authentication middleware, and role-based authorization middleware.
