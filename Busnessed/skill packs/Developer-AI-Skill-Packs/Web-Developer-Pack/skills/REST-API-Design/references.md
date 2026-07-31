# REST-API-Design References

## Official Documentation

- **REST API Tutorial**: https://restfulapi.net/ - Comprehensive guide to REST principles, methods, and best practices
- **Microsoft REST API Guidelines**: https://github.com/microsoft/api-guidelines - Industry-standard REST design guidelines
- **OpenAPI Specification**: https://spec.openapis.org/oas/v3.1.0 - OpenAPI 3.1 specification for API documentation
- **JSON:API Specification**: https://jsonapi.org/ - Specification for JSON API responses, relationships, and pagination
- **HTTP Semantics (RFC 9110)**: https://httpwg.org/specs/rfc9110.html - Official HTTP semantics and status codes
- **HTTP Caching (RFC 9111)**: https://httpwg.org/specs/rfc9111.html - Caching specifications for HTTP
- **OAuth2 RFC 6749**: https://datatracker.ietf.org/doc/html/rfc6749 - OAuth 2.0 authorization framework
- **Idempotency-Key Draft**: https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/ - Idempotency key header specification

## Terminology

1. **Resource**: Any named object that can be accessed via a URI (user, order, product)
2. **Collection**: Group of resources of the same type (/users, /orders)
3. **Endpoint**: Specific URL + HTTP method combination
4. **Idempotent**: Operation that produces the same result regardless of how many times it is executed
5. **Safe Method**: HTTP method that does not modify state (GET, HEAD, OPTIONS)
6. **HATEOAS**: Hypermedia as the Engine of Application State - responses include links for navigation
7. **Idempotency Key**: Unique client-generated identifier that ensures a request is processed only once
8. **Cursor**: Opaque pointer to a position in a list for pagination
9. **Content Negotiation**: Server/client agree on response format via Accept header
10. **ETag**: Entity tag - hash representing resource state for conditional requests
11. **OpenAPI**: Standard format for describing REST APIs in YAML/JSON
12. **Rate Limiting**: Restriction of request count per time window with response headers
13. **CORS**: Cross-Origin Resource Sharing - browser security mechanism for cross-origin requests
14. **Preflight**: OPTIONS request that checks CORS permissions before actual request

## Architecture Notes

- URLs represent resources, not actions; actions are represented by HTTP methods
- Resources should be nouns, not verbs: /users not /getUsers
- Relationships can be represented as nested routes or link objects in responses
- The API should be versioned from the first release to avoid breaking clients
- Error responses must be consistent and informative across all endpoints
- Authentication and authorization should be handled centrally, not per-endpoint
- Caching at the HTTP level reduces server load; implement ETags and Last-Modified
- Pagination prevents server overload; always paginate list endpoints
- Rate limiting protects against abuse; return 429 with Retry-After header
- HATEOAS makes APIs self-documenting and navigable by clients

## Key APIs

- `GET /resources` - List collection with pagination, filtering, sorting
- `GET /resources/:id` - Retrieve single resource
- `POST /resources` - Create new resource (returns 201 with Location header)
- `PUT /resources/:id` - Full replacement of resource (all fields required)
- `PATCH /resources/:id` - Partial update (only provided fields changed)
- `DELETE /resources/:id` - Delete resource (returns 204)
- `GET /resources/:id/relationships/subresources` - Get relationship data
- `OPTIONS /resources` - Return allowed methods for the endpoint
- `HEAD /resources/:id` - Return headers only (for cache validation)

## Conventions

- **URL naming**: Plural nouns, kebab-case, all lowercase
- **URL hierarchy**: /resources/:id/subresources/:subId
- **Query parameters**: camelCase or snake_case (choose one, be consistent)
- **Request body**: JSON with camelCase field names
- **Response body**: Wrapped in data envelope: `{ data: ..., meta?: ..., links?: ... }`
- **Error format**: `{ error: { code: "ERROR_CODE", message: "Human readable", details: [...] } }`
- **Pagination response**: `{ data: [...], meta: { page, limit, total, totalPages }, links: { next, prev, first, last } }`
- **Date format**: ISO 8601 (2024-01-15T10:30:00Z)
- **IDs**: UUIDs preferred over auto-increment integers for public API

## Project Structure Recommendation

```
api/
  spec/
    openapi.yaml     # OpenAPI specification
  src/
    routes/
      v1/
        users.js
        orders.js
        products.js
    controllers/
      userController.js
      orderController.js
    middleware/
      auth.js
      rateLimiter.js
      validator.js
      errorHandler.js
      pagination.js
    services/
      userService.js
    utils/
      response.js
      errors.js
      pagination.js
    __tests__/
      routes/
        users.test.js
  docs/
    getting-started.md
    authentication.md
    errors.md
```
