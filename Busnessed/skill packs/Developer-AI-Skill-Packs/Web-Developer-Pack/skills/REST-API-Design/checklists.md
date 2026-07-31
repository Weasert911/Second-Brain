# REST-API-Design Checklists

## Pre-Flight Checklist

- [ ] API goals and consumers identified (internal, external, mobile, web)
- [ ] Resource model defined with nouns, relationships, and attributes
- [ ] HTTP methods mapped to operations semantically (GET read, POST create, PUT replace, PATCH update, DELETE remove)
- [ ] Naming conventions established (plural nouns, kebab-case, camelCase vs snake_case)
- [ ] API versioning strategy chosen and documented
- [ ] Authentication method selected (JWT, API key, OAuth2)
- [ ] OpenAPI specification started or planned
- [ ] Error response format defined and consistent
- [ ] Pagination strategy chosen (offset vs cursor)
- [ ] Rate limiting limits planned per endpoint type
- [ ] Caching strategy defined (ETag, Last-Modified, Cache-Control)
- [ ] CORS configuration planned

## Implementation Checklist

- [ ] URLs use plural nouns for collections
- [ ] HTTP methods used correctly for all operations
- [ ] Status codes correct: 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500
- [ ] Error responses match the defined format with code, message, details
- [ ] Pagination metadata returned with every list endpoint
- [ ] Filtering uses consistent syntax (filter[field]=value or ?field=value)
- [ ] Sorting supports multiple fields and direction prefix (+/-)
- [ ] Field selection implemented with fields[] parameter
- [ ] Authentication required for non-public endpoints
- [ ] Authorization checks implemented per endpoint
- [ ] Rate limiting applied with response headers
- [ ] Caching headers set (ETag, Last-Modified, Cache-Control)
- [ ] CORS configured with specific origins
- [ ] Idempotency keys supported for mutating endpoints
- [ ] HATEOAS links provided for resource navigation
- [ ] Location header returned for created resources (201)
- [ ] Date fields in ISO 8601 format
- [ ] UUIDs used for resource identifiers

## Testing Checklist

- [ ] All endpoints tested with valid requests and expected responses
- [ ] Error scenarios: missing resources (404), validation (422), auth (401/403)
- [ ] Rate limiting tested: requests exceed limit return 429
- [ ] Pagination tested: page boundaries, empty pages, large offsets
- [ ] Filtering tested: single filter, multiple filters, no results
- [ ] Sorting tested: ascending, descending, multiple fields
- [ ] Field selection tested: subset of fields, no fields parameter
- [ ] Authentication tested: missing token, expired token, invalid token
- [ ] Idempotency tested: same key multiple times returns same result
- [ ] CORS tested: preflight OPTIONS, cross-origin requests
- [ ] Content negotiation tested: different Accept headers
- [ ] Versioning tested: different versions return different responses
- [ ] Edge cases: empty body, very large payloads, special characters
- [ ] Performance tested: response times under target, pagination performance
- [ ] Security tested: injection attempts, mass assignment, parameter pollution

## Release Checklist

- [ ] OpenAPI specification up-to-date with all endpoints
- [ ] Authentication flow documented with examples
- [ ] Rate limits documented per endpoint
- [ ] Error codes documented with meanings and examples
- [ ] Pagination documented with request/response format
- [ ] Changelog updated with new endpoints and changes
- [ ] Deprecation schedule documented for old versions
- [ ] API keys/credentials rotated if pre-production keys exposed
- [ ] CORS origins updated to production domains
- [ ] Rate limits adjusted for expected production traffic
- [ ] Monitoring set up for endpoint error rates and latency
- [ ] API gateway rules configured if applicable
- [ ] Documentation published (Swagger UI, Redoc, developer portal)
- [ ] Load testing completed with expected traffic patterns

## Maintenance Checklist

- [ ] Deprecated endpoints tracked with sunset headers
- [ ] Breaking changes communicated with migration guides
- [ ] OpenAPI spec updated with every endpoint change
- [ ] Error rates monitored and investigated for anomalies
- [ ] Rate limit thresholds reviewed against traffic patterns
- [ ] CORS origins audited for unused or suspicious entries
- [ ] API usage metrics reviewed for unused/deprecated endpoints
- [ ] Security vulnerabilities patched within SLA
- [ ] Authentication tokens rotated per schedule
- [ ] Performance benchmarks run quarterly
- [ ] Documentation reviewed for accuracy
- [ ] Client libraries updated for backward compatibility
