# Checklists — Axum-Expert

## Pre-Flight Checklist

- [ ] Axum version selected (0.7+ latest stable)
- [ ] Tokio runtime flavor chosen (multi_thread for server)
- [ ] Route hierarchy designed (nesting, versioning)
- [ ] State type defined and Send + Sync satisfied
- [ ] Error type designed with IntoResponse
- [ ] Middleware stack planned (order matters)
- [ ] Authentication strategy chosen
- [ ] CORS policy defined
- [ ] OpenAPI documentation approach decided

## Implementation Checklist

- [ ] Router created with all routes and state
- [ ] Handlers use correct extractors for their needs
- [ ] Error types implement IntoResponse for all variants
- [ ] State added via .with_state() on the top-level Router
- [ ] Middleware layers applied in correct order
- [ ] Authentication middleware implemented
- [ ] Request body size limits set
- [ ] File upload size limits configured
- [ ] WebSocket handlers manage connection lifecycle
- [ ] Graceful shutdown with signal handling
- [ ] Fallback handler for 404 responses
- [ ] Input validation on all endpoints

## Testing Checklist

- [ ] All endpoints have integration tests
- [ ] Test error cases: 400, 401, 403, 404, 500
- [ ] Authentication tested (valid and invalid tokens)
- [ ] CORS headers verified in responses
- [ ] File upload tested (single and multi-file)
- [ ] WebSocket connection and message flow tested
- [ ] Rate limiting behavior tested
- [ ] Large payloads handled correctly
- [ ] Concurrent requests don't corrupt state

## Release Checklist

- [ ] CORS policy tightened for production
- [ ] Rate limiting configured
- [ ] Body size limits set appropriate for production
- [ ] Error responses don't leak internal details
- [ ] Logging level set to info/warn/error
- [ ] Health check endpoint available
- [ ] Timeout configured for long requests
- [ ] Compression enabled for responses
- [ ] HTTPS/TLS termination configured
- [ ] Number of worker threads tuned

## Maintenance Checklist

- [ ] Dependencies updated regularly
- [ ] Axum version tracked for breaking changes
- [ ] Middleware performance reviewed
- [ ] Rate limit thresholds adjusted based on traffic
- [ ] Error logs monitored for unexpected patterns
- [ ] OpenAPI docs kept in sync with implementation
- [ ] Dependency vulnerabilities checked (cargo audit)
- [ ] Graceful shutdown tested on deployments
