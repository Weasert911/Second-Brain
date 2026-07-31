# Authentication-Systems Checklists

## Pre-Flight Checklist

- [ ] Authentication strategy chosen (JWT vs sessions vs hybrid)
- [ ] Password hashing algorithm selected (bcrypt recommended, cost 12+)
- [ ] JWT signing algorithm chosen (RS256 for multi-service, HS256 for single service)
- [ ] Secret/key management strategy defined (environment variables, secret manager)
- [ ] Token storage approach decided (httpOnly cookies vs localStorage vs memory)
- [ ] MFA requirements defined (optional, required for admin, always)
- [ ] OAuth2 providers selected and registered
- [ ] Rate limiting strategy defined for auth endpoints
- [ ] CSRF protection approach decided (if using cookies)
- [ ] HTTPS configured for all environments
- [ ] Session store chosen (Redis, database, memory)
- [ ] Password policy defined (length, complexity, expiration)

## Implementation Checklist

- [ ] Passwords hashed with bcrypt (cost 12+) or argon2id
- [ ] JWT access tokens expire within appropriate window (15-60 min)
- [ ] Refresh tokens expire within 7-30 days and support rotation
- [ ] Old refresh tokens invalidated on rotation
- [ ] Token blacklist/revocation implemented for logout
- [ ] Rate limiting on login, register, password reset, MFA endpoints
- [ ] CSRF protection for cookie-based auth (double submit cookie or synchronizer token)
- [ ] Session cookies: httpOnly, secure, sameSite strict
- [ ] OAuth2 state parameter implemented for CSRF prevention
- [ ] OAuth2 PKCE implemented for public clients
- [ ] Redirect URIs validated (exact match, not prefix)
- [ ] MFA verification with configurable time window (1-2 steps)
- [ ] Backup codes generated and stored hashed
- [ ] Account lockout after N failed attempts
- [ ] Password reset tokens expire within 15-60 minutes
- [ ] Email verification flow for new registrations
- [ ] RBAC middleware for role-based endpoint protection
- [ ] Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)

## Testing Checklist

- [ ] Registration: valid data succeeds, duplicates rejected, weak passwords rejected
- [ ] Login: correct credentials succeed, wrong password returns 401
- [ ] Rate limiting: N+1 requests in window return 429
- [ ] Token refresh: valid refresh returns new tokens, expired returns 401
- [ ] Token rotation: old refresh token invalid after use
- [ ] Logout: tokens revoked, cannot be reused
- [ ] Password reset: email sent, token expires, valid reset works
- [ ] MFA: setup works, valid codes pass, invalid codes fail, backup codes work
- [ ] OAuth2: login succeeds, callback validates state, creates/link accounts
- [ ] CSRF: requests without token return 403
- [ ] Role-based access: authorized requests pass, unauthorized return 403
- [ ] Session persistence: survives page refresh, expires correctly
- [ ] Concurrent sessions: multiple devices can authenticate simultaneously
- [ ] Account lockout: after N failures, account is temporarily locked
- [ ] Security: no user info in error messages, no timing attacks on login
- [ ] SQL injection: special characters in email/password handled safely

## Release Checklist

- [ ] JWT secrets rotated from development values
- [ ] Session secret rotated from development values
- [ ] OAuth2 client credentials configured for production
- [ ] Redirect URIs updated to production domain
- [ ] CORS origins limited to production frontend domains
- [ ] HTTPS enforced with HSTS
- [ ] CSP headers configured for production assets
- [ ] Rate limit values reviewed for expected production traffic
- [ ] Session store (Redis) configured for production
- [ ] Database indexes on email, token lookup fields
- [ ] MFA enforced for admin roles
- [ ] Audit logging for auth events configured
- [ ] Password policy enforced at registration
- [ ] Email service configured for verification/reset emails
- [ ] Monitoring for auth failures and suspicious patterns
- [ ] Changelog updated with security changes

## Maintenance Checklist

- [ ] Password hashing cost factor reviewed annually (increase as hardware improves)
- [ ] JWT signing algorithm reviewed for vulnerabilities
- [ ] OAuth2 provider configurations reviewed (API changes)
- [ ] Rate limit values adjusted based on traffic patterns
- [ ] Token blacklist/revocation storage cleaned periodically
- [ ] Failed login attempts log reviewed for attack patterns
- [ ] Security headers reviewed for new best practices
- [ ] Dependencies updated for security patches (bcrypt, jsonwebtoken, etc.)
- [ ] MFA backup codes usage reviewed (prompt re-generation)
- [ ] Session store cleanup of expired sessions
- [ ] OAuth2 provider scopes reviewed (least privilege)
- [ ] RBAC permissions reviewed for privilege creep
