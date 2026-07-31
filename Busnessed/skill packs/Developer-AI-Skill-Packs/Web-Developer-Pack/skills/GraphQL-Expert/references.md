# GraphQL-Expert References

## Official Documentation

- **GraphQL Spec**: https://spec.graphql.org/ - Official GraphQL specification
- **GraphQL Docs**: https://graphql.org/learn/ - Introduction, queries, mutations, schemas, validation, execution
- **Apollo Server Docs**: https://www.apollographql.com/docs/apollo-server/ - Server setup, resolvers, data sources, testing
- **Apollo Federation Docs**: https://www.apollographql.com/docs/federation/ - Federation spec, subgraphs, supergraph
- **DataLoader**: https://github.com/graphql/dataloader - Batching and caching for data fetching
- **Relay Pagination**: https://relay.dev/graphql/connections.htm - Connection specification for pagination
- **GraphQL Tools**: https://www.graphql-tools.com/ - Schema stitching, mocking, remote schemas
- **TypeGraphQL**: https://typegraphql.com/ - Code-first GraphQL with TypeScript decorators
- **Pothos GraphQL**: https://pothos-graphql.dev/ - Code-first schema builder
- **graphql-query-complexity**: https://github.com/slicknode/graphql-query-complexity - Query cost analysis

## Terminology

1. **Schema**: Defines the types, queries, mutations, and subscriptions available in the API
2. **Resolver**: Function that resolves a field's value for a given parent object and arguments
3. **Query**: Root type for read operations (fetching data)
4. **Mutation**: Root type for write operations (creating, updating, deleting)
5. **Subscription**: Root type for real-time events (WebSocket/SSE)
6. **DataLoader**: Utility that batches and caches database requests within a single request
7. **N+1 Problem**: Issue where querying a list results in 1 query for the list + N queries for related data
8. **Union**: Type that can be one of several object types (no common fields required)
9. **Interface**: Abstract type that defines common fields implemented by multiple types
10. **Input Type**: Special object type used for mutation arguments
11. **Custom Scalar**: User-defined scalar type with custom serialization/deserialization
12. **Directive**: Annotation that modifies execution behavior (@deprecated, @skip, @include)
13. **Federation**: Architecture for composing multiple GraphQL services into a single graph
14. **Connection**: Relay pagination pattern with edges and nodes
15. **Extensions**: Additional metadata in errors (error codes, stack traces in dev)

## Architecture Notes

- GraphQL has a single endpoint (/graphql) compared to REST's multiple endpoints
- The schema is the contract between client and server; changes must be backward compatible
- Resolvers form a tree that mirrors the query structure; each field can have its own resolver
- DataLoader should be request-scoped to prevent data leaking between requests
- Federation enables multiple teams to own subgraphs that compose into a unified graph
- Mutations are executed sequentially, while field resolvers can run in parallel
- Subscriptions use WebSocket or SSE for persistent connections
- Query complexity analysis prevents expensive queries from impacting server performance

## Key APIs

- `buildSchema(sdl)` - Build schema from SDL string
- `makeExecutableSchema({ typeDefs, resolvers })` - Create executable schema from typeDefs and resolvers
- `ApolloServer({ typeDefs, resolvers })` - Apollo Server instance
- `new DataLoader(batchFn)` - Create batched data fetcher
- `buildSubgraphSchema({ typeDefs, resolvers })` - Create federated subgraph schema
- `@key(fields: "id")` - Federation directive for entity identification
- `@external` - Federation directive for fields defined in other subgraphs
- `@requires(fields: "field")` - Federation directive for computed fields
- `@provides(fields: "field")` - Federation directive for fields provided by this subgraph
- `GraphQLScalarType({ name, serialize, parseValue, parseLiteral })` - Custom scalar definition
- `mapSchema()` - Apply schema transforms including custom directives
- `graphqlDepthLimit(maxDepth)` - Query depth limiting middleware
- `createComplexityRule(options)` - Query complexity analysis rule

## Conventions

- **Type naming**: PascalCase for type names (User, Product, Order)
- **Field naming**: camelCase for field names (firstName, createdAt, totalPrice)
- **Enum naming**: PascalCase for enum types, UPPER_CASE for values
- **Input naming**: PascalCase with Input suffix (CreateUserInput, UpdateUserInput)
- **Mutation naming**: Verb + noun format (createUser, updateProduct, deleteOrder)
- **Payload naming**: PascalCase with Payload suffix (CreateUserPayload)
- **Subscription naming**: Noun + verb format (userCreated, orderUpdated)
- **File organization**: schema/ with typeDefs/ and resolvers/ subdirectories per domain

## Project Structure Recommendation

```
graphql-api/
  src/
    schema/
      index.js              # Merge typeDefs and resolvers
      user/
        typeDefs.graphql    # SDL type definitions
        resolvers.js        # Resolvers for User type
        dataLoader.js       # DataLoader for User
      product/
        typeDefs.graphql
        resolvers.js
        dataLoader.js
    directives/
      auth.js               # @auth directive implementation
    scalars/
      Date.js               # Custom Date scalar
      Email.js              # Custom Email scalar
    utils/
      createLoaders.js      # DataLoader factory per request
      errors.js             # Custom error classes
    context.js              # Request context (user, loaders, db)
    server.js               # Apollo Server setup
    index.js                # Entry point
  test/
    queries/
      user.test.js
    mutations/
      createUser.test.js
```
