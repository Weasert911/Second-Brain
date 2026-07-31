---
name: "REST-API-Design"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when designing, documenting, or refactoring RESTful APIs, defining endpoints, response formats, authentication, or pagination strategies"
purpose: "Provides comprehensive guidance for designing consistent, scalable, and developer-friendly REST APIs following industry best practices and standards"
---

## Capabilities

1. Design resource-oriented APIs with consistent naming conventions (plural nouns, kebab-case, hierarchical relationships)
2. Apply HTTP method semantics correctly: GET for retrieval, POST for creation, PUT for full update, PATCH for partial update, DELETE for removal
3. Select appropriate HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error
4. Implement pagination with cursor-based and offset-based strategies including metadata
5. Provide filtering, sorting, and field selection with consistent query parameter conventions
6. Design HATEOAS responses with rel-based links for API discoverability
7. Implement API versioning strategies: URL prefix, custom header, and content negotiation
8. Document APIs with OpenAPI/Swagger including schemas, endpoints, auth, and examples
9. Configure authentication with JWT bearer tokens and API key headers
10. Apply rate limiting with response headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
11. Implement caching with ETag and Last-Modified headers including conditional requests
12. Maintain consistent error response format with error codes, messages, and details
13. Ensure idempotency for PUT, DELETE, and safe methods with idempotency keys
14. Design nested resource URLs and relationship representations (embedding, linking)

## Limitations

1. Does not cover GraphQL, gRPC, or WebSocket API design (separate skills)
2. Cannot replace domain knowledge of the specific business logic being exposed
3. Does not handle real-time API patterns (SSE, WebSocket) beyond basic REST
4. Large-scale API gateway patterns (rate limiting aggregation, routing) are out of scope
5. Does not cover hypermedia format details (JSON:API, HAL, Siren) in depth
6. Security patterns beyond basic auth, CORS, and rate limiting are limited

## Required Tools

- OpenAPI/Swagger (stoplight.io, Swagger Editor, Redoc)
- API testing tools (Postman, Insomnia, Bruno)
- HTTP proxy (mitmproxy, Charles) for debugging
- curl for quick API testing
- JSON Schema validator
- API documentation generator (Swagger UI, Redoc, Scalar)

## Execution Workflow

1. Identify resources (nouns) and actions (verbs mapped to HTTP methods)
2. Define URL structure with plural nouns, nested resources, and query parameters
3. Choose response format (JSON:API, plain JSON, HAL) and consistency envelope
4. Define request/response schemas for each endpoint
5. Select authentication method (JWT bearer, API key, OAuth2)
6. Implement status codes for all response scenarios
7. Add pagination, filtering, sorting, and field selection support
8. Implement error handling with consistent error response format
9. Add caching headers (ETag, Last-Modified, Cache-Control)
10. Configure CORS for allowed origins, methods, and headers
11. Add rate limiting with response headers
12. Implement idempotency for POST and PATCH endpoints
13. Document with OpenAPI specification
14. Test all endpoints for correctness, edge cases, and security
15. Version API and plan deprecation strategy

## Decision Tree

1. **Resource relationship?** → Top-level → /resources → Nested → /resources/:id/subresources → Related → /resources/:id/relationships/subresources
2. **Operation type?** → Read collection → GET /resources → Read single → GET /resources/:id → Create → POST /resources → Full update → PUT /resources/:id → Partial update → PATCH /resources/:id → Delete → DELETE /resources/:id
3. **Versioning strategy?** → Simple → /api/v1/resources → Content negotiation → Accept: application/vnd.api+json;version=1 → Custom header → X-API-Version: 1 → No versioning → Forward compatibility
4. **Pagination method?** → Simple → Offset/page-based → Stable cursor → Cursor-based → Real-time → Cursor + polling → Large datasets → Keyset pagination
5. **Error scenario?** → Client error (4xx) → Error response body → Server error (5xx) → Error + retry → Validation → Field-level details → Rate limit → 429 with retry header
6. **Auth required?** → Session → Cookie + CSRF → Third-party → OAuth2 → Machine-to-machine → API keys → User authentication → JWT bearer

## Review Checklist

- [ ] URLs use plural nouns (users, not user) for collections
- [ ] URLs use kebab-case for multi-word resources (order-items, not orderItems)
- [ ] HTTP methods used semantically (GET safe, PUT/PATCH idempotent, DELETE idempotent)
- [ ] Status codes correct for each response scenario
- [ ] Error responses have consistent format with code, message, and details
- [ ] Pagination metadata includes page, limit, total, totalPages, hasNext, hasPrev
- [ ] Filtering uses consistent query parameter convention (filter[field]=value)
- [ ] Sorting uses field names with optional prefix for direction
- [ ] Field selection implemented with fields[resource]=field1,field2
- [ ] Authentication required for all non-public endpoints
- [ ] Rate limiting headers present in responses
- [ ] Caching headers set for cacheable responses
- [ ] CORS configured for appropriate origins
- [ ] OpenAPI spec exists and matches implementation
- [ ] Idempotency keys accepted for mutating endpoints

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| 405 Method Not Allowed | Wrong HTTP method used | Check endpoint supports the method; add OPTIONS for CORS preflight |
| 413 Payload Too Large | Request body exceeds limit | Increase body parser limit; implement chunked upload |
| 429 Too Many Requests | Rate limit exceeded | Check Retry-After header; implement backoff strategy |
| CORS preflight failure | Missing OPTIONS handler | Ensure server handles OPTIONS with correct CORS headers |
| ETag not matching | Conditional request headers wrong | Use If-None-Match for GET; use If-Match for PUT/PATCH |
| Idempotency not working | Missing idempotency key header | Client must send Idempotency-Key header; server deduplicates |
| Nested resource 404 | Parent resource not found first | Verify parent exists before checking child; return 404 if parent missing |
| Slow pagination on large data | OFFSET-based pagination | Migrate to cursor-based or keyset pagination for large datasets |

## Best Practices

1. Use plural nouns for collection endpoints (/users, /orders, /products)
2. Use HTTP methods semantically: GET read, POST create, PUT replace, PATCH update, DELETE remove
3. Return appropriate status codes for every response
4. Use consistent error response format: { error: { code, message, details? } }
5. Implement pagination with cursor-based for large/real-time datasets, offset for simple cases
6. Use consistent filter query format: filter[field]=value or ?field=value
7. Version your API from day one (/api/v1/)
8. Document with OpenAPI 3.0+ before or alongside implementation
9. Use HATEOAS links for discoverability and client navigation
10. Implement idempotency keys for safe mutations (POST, PATCH)
11. Set caching headers (ETag, Last-Modified, Cache-Control) for GET responses
12. Use proper authentication (JWT bearer for user, API keys for machine)
13. Return 202 Accepted for long-running operations with status URL
14. Use 409 Conflict for resource state conflicts (version mismatch, duplicate)
15. Avoid returning 200 for errors; use appropriate 4xx/5xx codes

## Anti-Patterns

1. Using actions in URLs (/users/createUser instead of POST /users)
2. Mixing camelCase and snake_case in the same API
3. Returning 200 with error body instead of proper 4xx status code
4. Using GET for operations that modify state
5. Not paginating list endpoints with unbounded results
6. Exposing internal IDs or database structure in URLs
7. Returning passwords, tokens, or sensitive data in responses
8. Using single endpoint for all operations (/api.php)
9. Not versioning the API
10. Returning 500 for predictable client errors

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
