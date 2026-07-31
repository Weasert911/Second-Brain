# Authentication-Systems References

## Official Documentation

- **JWT RFC 7519**: https://datatracker.ietf.org/doc/html/rfc7519 - JSON Web Token specification
- **OAuth2 RFC 6749**: https://datatracker.ietf.org/doc/html/rfc6749 - OAuth 2.0 authorization framework
- **OAuth2 PKCE RFC 7636**: https://datatracker.ietf.org/doc/html/rfc7636 - PKCE extension for public clients
- **OpenID Connect Core**: https://openid.net/specs/openid-connect-core-1_0.html - OIDC specification
- **bcrypt Docs**: https://github.com/kelektiv/node.bcrypt.js - Password hashing library
- **argon2 Docs**: https://github.com/ranisalt/node-argon2 - Modern password hashing
- **OTP Lib**: https://github.com/yeojz/otplib - TOTP/HOTP implementation
- **WebAuthn Spec**: https://www.w3.org/TR/webauthn-2/ - Web Authentication specification
- **OWASP Auth Cheatsheet**: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html - Security best practices

## Terminology

1. **JWT**: JSON Web Token - self-contained token with claims (header + payload + signature)
2. **Access Token**: Short-lived token used to authorize API requests
3. **Refresh Token**: Long-lived token used to obtain new access tokens
4. **OAuth2**: Authorization framework for delegated access to resources
5. **Authorization Code**: Temporary code exchanged for tokens in OAuth2 flow
6. **PKCE**: Proof Key for Code Exchange - prevents authorization code interception
7. **OIDC**: OpenID Connect - identity layer on top of OAuth2 for authentication
8. **ID Token**: JWT containing authenticated user identity claims (OIDC)
9. **CSRF**: Cross-Site Request Forgery - attack that tricks user into performing actions
10. **TOTP**: Time-based One-Time Password - 6-digit code based on time + shared secret
11. **RBAC**: Role-Based Access Control - permissions assigned through roles
12. **MFA/2FA**: Multi-Factor Authentication / Two-Factor Authentication
13. **WebAuthn**: Web Authentication standard for passwordless auth with biometrics/security keys
14. **Synchronizer Token**: CSRF token pattern where server sends token, client returns it
15. **httpOnly Cookie**: Cookie inaccessible to JavaScript (prevents XSS token theft)

## Architecture Notes

- JWT is stateless; the server does not need to store sessions, but tokens cannot be revoked server-side
- Refresh token rotation improves security by invalidating tokens after use
- Session-based auth is stateful; tokens are stored server-side and can be revoked any time
- OAuth2 separates roles: resource owner (user), client (app), authorization server, resource server
- OIDC extends OAuth2 with an ID token (JWT) for user authentication
- PKCE is required for public clients (mobile apps, SPAs) that cannot keep secrets
- Rate limiting should be per-user/IP, not global, to avoid locking out legitimate traffic
- CSRF protection is needed for cookie-based auth; JWT in Authorization header is not vulnerable
- Password hashing algorithms should be computationally expensive to resist brute force

## Key APIs

- `bcrypt.hash(password, saltRounds)` - Hash password
- `bcrypt.compare(password, hash)` - Verify password
- `jwt.sign(payload, secret, options)` - Create JWT
- `jwt.verify(token, secret)` - Verify JWT signature
- `jwt.decode(token)` - Decode JWT without verification
- `crypto.randomBytes(size)` - Generate cryptographically random bytes
- `otplib.authenticator.generate(secret)` - Generate TOTP code
- `otplib.authenticator.check(token, secret)` - Verify TOTP code
- `otplib.authenticator.generateSecret()` - Generate TOTP shared secret
- `speakeasy.totp({ secret, encoding })` - Alternative TOTP implementation

## Conventions

- **Token naming**: access_token, refresh_token, id_token (OIDC)
- **Cookie naming**: session, refresh_token, XSRF-TOKEN (CSRF)
- **Header naming**: Authorization: Bearer <token>
- **Endpoint naming**: /auth/login, /auth/register, /auth/refresh, /auth/logout, /auth/mfa/setup
- **Rate limit naming**: authLimiter, apiLimiter, uploadLimiter
- **Role naming**: admin, moderator, user, guest
- **Permission naming**: resource:action (users:read, posts:create)

## Project Structure Recommendation

```
src/
  auth/
    strategies/
      jwt.ts
      session.ts
      oauth2.ts
    middleware/
      authenticate.ts
      authorize.ts
      rateLimiter.ts
      csrf.ts
    services/
      passwordService.ts
      tokenService.ts
      mfaService.ts
      oauthService.ts
    controllers/
      authController.ts
      mfaController.ts
      oauthController.ts
    validators/
      authValidators.ts
    types/
      auth.ts
  config/
    auth.ts
    oauth.ts
  utils/
    crypto.ts
    errors.ts
  routes/
    authRoutes.ts
```
