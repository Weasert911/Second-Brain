---
name: "GraphQL-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when designing GraphQL schemas, implementing resolvers, optimizing query performance, or building federated GraphQL architectures"
purpose: "Provides comprehensive guidance for designing efficient, secure, and maintainable GraphQL APIs with proper schema design, resolver patterns, and performance optimization"
---

## Capabilities

1. Design GraphQL schemas using SDL with object types, input types, enums, unions, interfaces, and custom scalars
2. Implement resolver hierarchy with root resolvers (Query, Mutation, Subscription) and field-level resolvers
3. Solve N+1 query problem using DataLoader with batching and caching strategies
4. Design mutations with input validation, error handling, and optimistic responses
5. Implement subscriptions using WebSocket (graphql-ws) and Server-Sent Events
6. Build federated graphs with Apollo Federation including entity types and @key directives
7. Choose between code-first (TypeGraphQL, NestJS) and SDL-first (GraphQL Tools) approaches
8. Configure Apollo Server with Express, Fastify, or Lambda integrations
9. Implement Relay-style pagination with connections, edges, nodes, and cursors
10. Create custom scalars for dates, URLs, JSON objects, and other special types
11. Implement custom directives for auth, formatting, rate limiting, and deprecation
12. Handle errors with partial error responses, custom error codes, and extensions
13. Implement caching with Apollo cache-persist, response caching, and query complexity analysis
14. Apply security measures: query depth limiting, cost analysis, auth directives, and rate limiting

## Limitations

1. Does not cover GraphQL client development (Apollo Client, Relay) in depth
2. Cannot automatically migrate existing REST APIs to GraphQL without schema design decisions
3. Does not cover database-specific optimizations beyond generic DataLoader patterns
4. Subscription infrastructure (WebSocket, Redis pub/sub) setup details are environment-specific
5. Federation supergraph composition with Rover CLI requires external tooling knowledge
6. Does not replace domain knowledge of the business logic being exposed

## Required Tools

- Apollo Server or Yoga GraphQL server
- GraphQL Schema Definition Language tools
- DataLoader (facebook/dataloader)
- Apollo Studio or GraphQL Playground for exploration
- graphql-query-complexity and graphql-depth-limit for security
- graphql-ws for subscription support
- Rover CLI (for Apollo Federation)
- TypeGraphQL or Pothos (for code-first approach)

## Execution Workflow

1. Define domain model and map to GraphQL types with relationships
2. Choose schema approach (SDL-first or code-first) based on team preference
3. Write type definitions (SDL) including all types, inputs, enums, unions, interfaces
4. Implement resolvers for Query root with efficient data fetching
5. Implement resolvers for Mutation with input validation and error handling
6. Configure DataLoader for batch loading to eliminate N+1 queries
7. Add custom scalars for domain-specific data types
8. Implement field-level resolvers with DataLoader integration
9. Set up subscriptions for real-time features with pub/sub system
10. Add security measures: depth limiting, cost analysis, auth directives
11. Implement error handling with structured error extensions
12. Set up Apollo Studio or GraphQL Playground for development
13. Write integration tests for queries, mutations, and subscriptions
14. Configure caching (response caching, persisted queries)
15. Deploy with appropriate server configuration (serverless, dedicated, federated)

## Decision Tree

1. **Schema approach?** → TypeScript-first → Code-first (TypeGraphQL/Pothos) → Collaborative → SDL-first (GraphQL Tools) → Legacy → Schema stitching
2. **Data fetching?** → Single resource → Direct resolver → Related resources → DataLoader → Aggregated data → Batch resolver → External API → REST DataSource
3. **Error handling?** → Validation → UserInputError → Auth → AuthenticationError → Business logic → ApolloError with extensions → Expected errors → Error union types
4. **Paginate?** → Simple → Offset/limit → Relay spec → Connection type → Infinite scroll → Cursor-based → Page-based → Offset/limit
5. **Real-time need?** → Live updates → Subscription → One-time notification → Subscription with filter → Presence/cursors → Subscription with payload
6. **Authentication?** → Simple token → Context-based → Role-based → Directive-based → Fine-grained → Field-level resolver checks → Federation → @requiresScopes directive
7. **Multiple services?** → Merge schemas → Schema stitching → Federation → Apollo Federation → Gateway → Apollo Router

## Review Checklist

- [ ] All types have proper descriptions in schema
- [ ] Input types used for mutation arguments (not bare scalars)
- [ ] Enums used for fields with fixed set of values
- [ ] Nullable types preferred; non-null used only when field always returns a value
- [ ] DataLoader configured for all relationship fields
- [ ] Queries have complexity limits set
- [ ] Depth limiting configured (max depth 7-10)
- [ ] Auth directives or resolver checks on protected fields
- [ ] Mutations return proper payload types with user-visible errors
- [ ] Subscriptions use proper filter arguments
- [ ] Custom scalars have proper serialize/parseValue/parseLiteral implementations
- [ ] Error handling uses extensions for error codes
- [ ] DataLoader instance created per request (not global)
- [ ] N+1 queries eliminated (verified with DataLoader stats)
- [ ] Query batching considered for high-traffic endpoints

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| N+1 query problem | Fields resolved individually without batching | Implement DataLoader for each relationship |
| Query returns null unexpectedly | Resolver returns null for non-null field | Check resolver error; wrap in try-catch |
| Mutation not idempotent | No duplicate checking | Add idempotency key mechanism |
| Subscription not connecting | WebSocket handshake failing | Check CORS, ws:// vs wss://, auth token in connectionParams |
| Circular type reference | Types referencing each other | Use functions for type references (() => Type) |
| Complexity error | Query too expensive | Limit depth; use cost analysis; implement pagination |
| DataLoader not caching per request | Global DataLoader instance | Create new DataLoader per request in context |
| Auth directive not working | Directive not in schema or not implemented | Add directive definition; implement visitor in schema transforms |
| Slow federation query | Subgraph resolver inefficient | Check @key resolution; verify _entities resolver |
| Schema build error | Missing type or circular dependency | Check type imports; use buildSubgraphSchema for federation |

## Best Practices

1. Always use DataLoader for resolving relationship fields to avoid N+1
2. Create a new DataLoader instance per request (stored in context)
3. Use input types for mutation arguments, never bare scalars
4. Return proper mutation payload types with client-visible errors
5. Use enums instead of strings for fields with fixed values
6. Prefer nullable fields over non-null to avoid breaking changes
7. Implement query complexity and depth limiting for security
8. Use Apollo Federation for multi-service GraphQL architecture
9. Write integration tests for all queries and mutations
10. Document schema with descriptions for all types and fields
11. Use custom scalars for domain-specific validation (Email, URL, Date)
12. Implement persisted queries for production to reduce request size
13. Use the extensions field for structured error information
14. Monitor query performance with Apollo Studio or similar tools

## Anti-Patterns

1. Not using DataLoader for relationship fields (causing N+1 queries)
2. Exposing database models directly as GraphQL types (leaking internals)
3. Using non-null for everything (causes breaking changes when fields become nullable)
4. Putting business logic in resolvers (should be in service layer)
5. Over-fetching in resolvers (selecting too many fields from database)
6. Not validating mutation inputs (trusting client data)
7. Using strings for enum-like fields (loses type safety)
8. Creating overly deep nested queries without pagination
9. Sharing DataLoader instances across requests (cache leaks)
10. Ignoring the N+1 problem in list queries (each list item triggers queries)

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
