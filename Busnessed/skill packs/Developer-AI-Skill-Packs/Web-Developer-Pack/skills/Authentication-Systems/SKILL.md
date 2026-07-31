---
name: "Authentication-Systems"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when implementing authentication systems including JWT, OAuth2, OIDC, session-based auth, MFA, password hashing, RBAC, or passwordless authentication"
purpose: "Provides comprehensive guidance for designing and implementing secure authentication and authorization systems for web applications"
---

## Capabilities

1. Implement JWT authentication with proper token structure, signing (HS256, RS256), verification, and expiration
2. Design refresh token rotation with blacklisting, rotation policies, and secure storage
3. Implement OAuth2 authorization code flow with PKCE for public clients and confidential clients
4. Configure OAuth2 client credentials flow for machine-to-machine communication
5. Implement OpenID Connect with ID token validation and userinfo endpoint integration
6. Build session-based authentication with secure cookie configuration, session stores, and CSRF protection
7. Implement multi-factor authentication with TOTP, SMS codes, and backup codes
8. Hash passwords securely with bcrypt, argon2, and scrypt including cost factor tuning
9. Implement CSRF protection with synchronizer token pattern and double submit cookie
10. Configure rate limiting for authentication endpoints to prevent brute force attacks
11. Integrate social login providers (Google, GitHub, Facebook, Apple) with OAuth2/OIDC
12. Implement Role-Based Access Control (RBAC) with roles, permissions, and policy enforcement
13. Implement token storage best practices with httpOnly cookies and secure storage mechanisms
14. Build passwordless authentication with magic links and WebAuthn/FIDO2 passkeys

## Limitations

1. Does not cover SAML 2.0 enterprise federation in depth
2. WebAuthn passkey implementation requires browser/device-level considerations beyond scope
3. Compliance (SOC2, HIPAA, GDPR audit logging) requires additional implementation details
4. Does not cover Identity Provider (IdP) server implementation (Keycloak, Auth0 configuration)
5. Hardware security modules (HSM) for key management are not covered
6. Does not replace security audit by a professional security team

## Required Tools

- bcrypt/argon2 library for password hashing
- jsonwebtoken library for JWT operations
- crypto module for token generation
- OAuth2 client library (openid-client, oauth4webapi)
- Session middleware (express-session, iron-session)
- TOTP library (otplib, speakeasy)
- QR code library (qrcode) for TOTP setup
- authenticator app (Google Authenticator, Authy)

## Execution Workflow

1. Determine authentication strategy (JWT vs session, stateless vs stateful)
2. Set up user model with credential storage and hashing strategy
3. Implement password hashing with appropriate algorithm and cost factor
4. Implement registration endpoint with input validation and rate limiting
5. Implement login endpoint with credential verification and token generation
6. Implement authentication middleware to verify tokens/sessions
7. Add refresh token endpoint with rotation and revocation
8. Implement Role-Based Access Control with middleware
9. Add OAuth2/OIDC social login integration
10. Implement MFA/TOTP enrollment and verification
11. Add CSRF protection for state-changing requests
12. Implement rate limiting for auth endpoints
13. Add account recovery (password reset, email verification)
14. Implement session/token revocation on logout
15. Security audit: test all auth flows for vulnerabilities

## Decision Tree

1. **Auth strategy?** → Stateless API → JWT with refresh tokens → Server-rendered app → Session-based → Mobile app → OAuth2 + PKCE → Microservices → OAuth2 + JWT introspection
2. **Password hashing?** → General web app → bcrypt (cost 10-12) → High security → argon2id → Legacy system → scrypt → Already hashed → Verify existing algorithm
3. **Social login?** → One provider → Direct OAuth2 integration → Multiple providers → Social login library → Enterprise SSO → OIDC → Custom IdP → Keycloak/Auth0
4. **MFA required?** → Time-based → TOTP → SMS → SMS gateway → Backup codes → Recovery codes → Hardware → WebAuthn/FIDO2
5. **Authorization model?** → Simple → Roles → Complex → Permissions + roles → Fine-grained → ABAC (attribute-based) → Multi-tenant → Tenant-scoped roles
6. **Token storage?** → Web app → httpOnly cookie → SPA → Memory + refresh cookie → Mobile → Secure keychain → Native desktop → OS credential manager
7. **Security concern?** → Brute force → Rate limiting → Session hijacking → Rotate tokens + secure cookies → CSRF → CSRF token → XSS → httpOnly cookies + CSP

## Review Checklist

- [ ] Passwords hashed with bcrypt (cost 12+) or argon2id
- [ ] JWT signed with RS256 or HS256 using strong secret/key
- [ ] JWT expiration set appropriately (15-60 min for access, 7-30 days for refresh)
- [ ] Refresh tokens rotated and old tokens invalidated
- [ ] Rate limiting on login, registration, password reset endpoints
- [ ] CSRF protection for cookie-based auth
- [ ] Session tokens stored in httpOnly, secure, sameSite cookies
- [ ] MFA enforced for privileged actions or admin roles
- [ ] OAuth2 state parameter used to prevent CSRF on OAuth flow
- [ ] OAuth2 PKCE used for public clients (SPA, mobile)
- [ ] RBAC implemented with middleware for protected routes
- [ ] Password reset tokens expire after short duration (15-60 min)
- [ ] Login attempts tracked and account locked after N failures
- [ ] HTTPS enforced for all auth-related endpoints
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| JWT verification fails | Wrong algorithm or expired token | Check signing algorithm matches; verify token expiration |
| Refresh token rejected | Token revoked or rotated | Implement token family tracking; allow grace period |
| OAuth callback fails | State mismatch or redirect URI | Verify state parameter matches; check exact redirect URI |
| TOTP not verifying | Clock skew or wrong secret | Allow 1-2 step window; check server time sync |
| bcrypt comparison slow | Cost factor too high | Set cost to 10-12 (balance between security and speed) |
| CSRF token mismatch | Token not sent or expired | Ensure token included in requests; check token generation |
| Social login email mismatch | Different email from existing account | Implement account linking; handle email conflicts |
| Session not persisting | Cookie config incorrect | Check httpOnly, secure, sameSite, path, domain settings |
| Rate limiter blocking valid users | Threshold too low | Analyze traffic patterns; adjust limits per endpoint |
| Password reset link expired | Token TTL too short | Increase to 1 hour; implement resend capability |

## Best Practices

1. Hash passwords with bcrypt (cost 12+) or argon2id - never store plaintext
2. Use short-lived JWT access tokens (15-60 min) with refresh token rotation
3. Implement rate limiting on all auth endpoints (login, register, password reset)
4. Use httpOnly, secure, sameSite cookies for session tokens
5. Implement CSRF protection for all state-changing requests
6. Use OAuth2 PKCE for public clients (SPA, mobile applications)
7. Implement proper token revocation on logout
8. Enforce MFA for administrative and privileged actions
9. Validate all OAuth2 state parameters to prevent CSRF
10. Use separate signing keys for access and refresh tokens
11. Implement account lockout after repeated failed login attempts
12. Use parameterized queries for any user lookup (prevent SQL injection)
13. Monitor auth endpoints for unusual patterns (multiple failures, geographic anomalies)
14. Implement proper session/ token expiration and cleanup
15. Keep dependencies updated for security patches

## Anti-Patterns

1. Storing passwords in plaintext or with weak hashing (MD5, SHA1)
2. Using excessively long JWT expiration (days without refresh)
3. Not implementing refresh token rotation (tokens reusable forever)
4. Storing tokens in localStorage (vulnerable to XSS)
5. Disabling CSRF protection because "we use JWT"
6. Using single secret key for all token operations
7. Not validating redirect URIs in OAuth flows
8. Ignoring OAuth2 state parameter for CSRF protection
9. Implementing custom cryptography instead of well-vetted libraries
10. Returning user details (email, username) in error messages

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
