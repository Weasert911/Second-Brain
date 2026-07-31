# GraphQL-Expert Checklists

## Pre-Flight Checklist

- [ ] GraphQL server framework chosen (Apollo Server, Yoga, GraphQL Helix)
- [ ] Schema approach decided (SDL-first vs code-first)
- [ ] Domain model mapped to GraphQL types with relationships
- [ ] Database access layer established (Prisma, TypeORM, Drizzle)
- [ ] Authentication strategy defined (JWT, session, API key)
- [ ] Authorization model designed (RBAC, ABAC, directive-based)
- [ ] Pagination strategy chosen (Relay connection vs simple offset)
- [ ] Subscription infrastructure planned (WebSocket library, pub/sub backend)
- [ ] Federation or monolithic approach decided
- [ ] Security measures planned (depth limit, complexity limit, rate limiting)
- [ ] Caching strategy defined (response caching, persisted queries)
- [ ] Testing strategy defined (integration tests for all queries/mutations)

## Implementation Checklist

- [ ] All types have descriptions in schema for documentation
- [ ] Input types used for all mutation arguments
- [ ] Enums used for fields with limited set of values
- [ ] Unions or interfaces used for polymorphic results
- [ ] Custom scalars implement serialize, parseValue, parseLiteral
- [ ] Resolvers use DataLoader for all relationship fetching
- [ ] DataLoader instances request-scoped (created per request)
- [ ] Mutations return payload types with client-visible errors
- [ ] Arguments validated using custom scalars or resolver validation
- [ ] Nullable types preferred; non-null only for guaranteed fields
- [ ] Auth checks implemented on protected queries/mutations/fields
- [ ] Query depth limited to reasonable value (7-10)
- [ ] Query complexity limits computed and enforced
- [ ] Subscriptions have proper cleanup on disconnect
- [ ] Persisted queries or automatic persisted queries configured

## Testing Checklist

- [ ] All queries tested with valid arguments
- [ ] Mutations tested with valid and invalid inputs
- [ ] Error cases: authentication failure, authorization failure, validation failure
- [ ] Null handling: nullable fields return null, non-null fields throw
- [ ] Pagination tested: empty list, single page, multiple pages, cursor boundary
- [ ] DataLoader tested: batch loading works, cache hit/miss
- [ ] Subscription tested: connect, receive event, disconnect
- [ ] Federation tested: @key resolution, cross-subgraph queries
- [ ] Complexity tests: simple query passes, complex query blocked
- [ ] Depth tests: nested query within limit passes, beyond limit blocked
- [ ] Performance tests: N+1 queries eliminated, response times acceptable
- [ ] Security tests: injection attempts, unauthorized access, rate limiting
- [ ] Existing queries don't break after schema changes (backward compatibility)

## Release Checklist

- [ ] Schema finalized with no unintended changes or missing fields
- [ ] Schema diff reviewed for breaking changes
- [ ] All queries and mutations documented in schema descriptions
- [ ] Apollo Studio or similar schema registry updated
- [ ] Persisted queries updated if using APQ
- [ ] Complexity and depth limits appropriate for production
- [ ] Rate limits configured per query complexity
- [ ] Caching configured for appropriate queries
- [ ] Subscription infrastructure tested under load
- [ ] Federation supergraph composed and tested
- [ ] Error tracking configured (Sentry, Apollo Studio)
- [ ] Performance monitoring set up (Apollo usage reporting)
- [ ] Changelog updated with schema changes
- [ ] Deployment tested in staging environment

## Maintenance Checklist

- [ ] Schema monitored for deprecated fields
- [ ] Query performance reviewed monthly with Apollo Studio
- [ ] DataLoader batch efficiency monitored
- [ ] Subscription connection stability monitored
- [ ] Dependencies updated (Apollo Server, DataLoader, graphql)
- [ ] Breaking changes in graphql-js tracked
- [ ] Federation version updates reviewed
- [ ] Query complexity limits adjusted based on usage patterns
- [ ] Cache hit rates reviewed and tuning applied
- [ ] Security advisories monitored and patches applied
- [ ] Deprecated fields removed per deprecation schedule
- [ ] New features added with backward compatibility
