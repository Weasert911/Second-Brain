# GraphQL-Expert Templates

## Template 1: Apollo Server Setup

**Name**: `apollo-server-template`
**Description**: Apollo Server with Express, context, and security.

```js
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import depthLimit from 'graphql-depth-limit';
import { typeDefs, resolvers } from './schema/index.js';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit({{maxDepth}})],
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors({{corsOptions}}),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      user: req.headers.authorization ? await getUser(req.headers.authorization) : null,
      db: {{dbInstance}},
      loaders: createLoaders({{dbInstance}}),
    }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: {{port}} }, resolve));
console.log(`Server ready at http://localhost:{{port}}/graphql`);
```

**Usage Notes**: Replace `{{maxDepth}}` (e.g., `10`), `{{corsOptions}}`, `{{dbInstance}}`, `{{port}}` (e.g., `4000`). Customize context creation for authentication and data sources.

## Template 2: DataLoader Factory

**Name**: `dataloader-template`
**Description**: Request-scoped DataLoader factory for batch loading.

```js
import DataLoader from 'dataloader';

export function createLoaders(db) {
  return {
    {{entity}}Loader: new DataLoader(async (keys) => {
      const items = await db.{{entity}}s.findMany({ where: { id: { in: keys } } });
      const map = new Map(items.map(item => [item.id, item]));
      return keys.map(key => map.get(key) || null);
    }),
    {{entity}}By{{field}}Loader: new DataLoader(async (keys) => {
      const items = await db.{{entity}}s.findMany({ where: { {{field}}: { in: keys } } });
      const grouped = new Map();
      keys.forEach(key => grouped.set(key, []));
      items.forEach(item => grouped.get(item.{{field}})?.push(item));
      return keys.map(key => grouped.get(key) || []);
    }),
  };
}

// Usage in resolver
const resolvers = {
  {{Type}}: {
    {{relatedField}}: (parent, _, { loaders }) =>
      loaders.{{entity}}Loader.load(parent.{{foreignKey}}),
    {{listField}}: (parent, _, { loaders }) =>
      loaders.{{entity}}By{{field}}Loader.load(parent.id),
  },
};
```

**Usage Notes**: Replace `{{entity}}` (e.g., `User`, `Post`), `{{field}}` (e.g., `authorId`, `categoryId`), `{{Type}}` (e.g., `Post`), `{{relatedField}}` (e.g., `author`), `{{listField}}` (e.g., `posts`), `{{foreignKey}}` (e.g., `authorId`).

## Template 3: Mutation with Union Result

**Name**: `mutation-template`
**Description**: Mutation returning a union type for success/error handling.

```graphql
# Schema
input Create{{Type}}Input {
  {{field1}}: String!
  {{field2}}: String!
}

union Create{{Type}}Result = Create{{Type}}Success | Create{{Type}}Error

type Create{{Type}}Success {
  {{entity}}: {{Type}}!
}

type Create{{Type}}Error {
  message: String!
  code: String!
  details: [FieldError!]
}

type FieldError {
  field: String!
  message: String!
}
```

```js
// Resolver
const resolvers = {
  Mutation: {
    create{{Type}}: async (_, { input }, { db }) => {
      try {
        const {{entity}} = await db.{{entity}}s.create({ data: input });
        return { __typename: 'Create{{Type}}Success', {{entity}} };
      } catch (err) {
        return {
          __typename: 'Create{{Type}}Error',
          message: err.message,
          code: '{{ERROR_CODE}}',
          details: [{ field: '{{field1}}', message: 'Invalid value' }],
        };
      }
    },
  },
  Create{{Type}}Result: {
    __resolveType: (obj) => obj.__typename,
  },
};
```

**Usage Notes**: Replace `{{Type}}` (e.g., `User`, `Product`, `Order`), `{{entity}}` (lowercase), `{{field1}}`/`{{field2}}`, `{{ERROR_CODE}}` (e.g., `VALIDATION_ERROR`).

## Template 4: Relay Pagination Connection

**Name**: `relay-connection-template`
**Description**: Relay-style pagination with connections and cursors.

```graphql
type {{Type}}Connection {
  edges: [{{Type}}Edge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type {{Type}}Edge {
  node: {{Type}}!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

```js
const resolvers = {
  Query: {
    {{entities}}: async (_, { first = 20, after, last, before }, { db }) => {
      const take = first || last || 20;
      const cursor = after || before;

      const items = await db.{{entity}}s.findMany({
        take: take + 1,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { createdAt: 'desc' },
      });

      const hasNextPage = items.length > take;
      if (hasNextPage) items.pop();

      const edges = items.map(item => ({
        node: item,
        cursor: Buffer.from(`cursor:${item.id}`).toString('base64'),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!before,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        totalCount: await db.{{entity}}s.count(),
      };
    },
  },
};
```

**Usage Notes**: Replace `{{Type}}` (e.g., `Post`, `Product`), `{{entities}}` (e.g., `posts`, `products`), `{{entity}}` (lowercase singular).

## Template 5: Custom Scalar

**Name**: `custom-scalar-template`
**Description**: Custom GraphQL scalar with validation.

```js
import { GraphQLScalarType, Kind } from 'graphql';

export const {{ScalarName}} = new GraphQLScalarType({
  name: '{{ScalarName}}',
  description: '{{ScalarDescription}}',
  serialize(value) {
    // Convert from internal to output format
    return {{serializeLogic}};
  },
  parseValue(value) {
    // Convert from client input to internal format
    {{parseLogic}}
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.{{AST_KIND}}) {
      throw new {{ErrorType}}('Must be a {{kindName}}');
    }
    return {{parseLiteralLogic}};
  },
});

// Register in schema
const typeDefs = `scalar {{ScalarName}}`;
```

**Usage Notes**: Replace `{{ScalarName}}` (e.g., `Date`, `Email`, `URL`), `{{ScalarDescription}}`, `{{serializeLogic}}`, `{{parseLogic}}`, `{{AST_KIND}}` (e.g., `STRING`, `INT`), `{{ErrorType}}` (e.g., `GraphQLError`), `{{kindName}}` (e.g., `string`, `integer`).

## Template 6: Auth Directive

**Name**: `auth-directive-template`
**Description**: Custom @auth directive for field-level authentication.

```js
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';

export function authDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directives = getDirectives(schema, fieldConfig);
      const authDirective = directives['auth'];
      if (!authDirective) return;

      const { roles } = authDirective;
      const originalResolver = fieldConfig.resolve || defaultFieldResolver;

      fieldConfig.resolve = async (source, args, context, info) => {
        if (!context.user) {
          throw new AuthenticationError('Authentication required');
        }

        if (roles && roles.length > 0 && !roles.includes(context.user.role)) {
          throw new ForbiddenError('Insufficient permissions');
        }

        return originalResolver(source, args, context, info);
      };
    },
  });
}

// Schema usage
// directive @auth(roles: [String]) on FIELD_DEFINITION
// type Query {
//   me: User @auth
//   adminData: String @auth(roles: ["admin"])
// }
```

**Usage Notes**: Apply `authDirectiveTransformer(schema)` when building executable schema. Define the directive in type definitions. Use `@auth` and `@auth(roles: ["admin"])` on protected fields.

## Template 7: Subscription with Filtering

**Name**: `subscription-template`
**Description**: GraphQL subscription with topic filtering.

```js
import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
  Subscription: {
    {{subscriptionName}}: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['{{TOPIC}}']),
        (payload, variables) => {
          // Filter: only send if matches variables
          return variables.{{filterField}}
            ? payload.{{subscriptionName}}.{{filterField}} === variables.{{filterField}}
            : true;
        }
      ),
    },
  },
};

// Publishing
pubsub.publish('{{TOPIC}}', {
  {{subscriptionName}}: { id: '1', {{filterField}}: 'value', data: '...' },
});
```

**Usage Notes**: Replace `{{subscriptionName}}` (e.g., `postCreated`, `messageReceived`), `{{TOPIC}}` (e.g., `POST_CREATED`), `{{filterField}}` (field to filter on).

## Template 8: Integration Test

**Name**: `graphql-test-template`
**Description**: Apollo Server integration test with supertest.

```js
import { ApolloServer } from '@apollo/server';
import { createTestServer } from '../server.js';

describe('{{QueryName}}', () => {
  let server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('returns data successfully', async () => {
    const result = await server.executeOperation({
      query: `
        query Get{{Type}}($id: ID!) {
          {{queryName}}(id: $id) {
            id
            {{field1}}
            {{field2}}
          }
        }
      `,
      variables: { id: '{{testId}}' },
    });

    expect(result.body.kind).toBe('single');
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data.{{queryName}}).toBeDefined();
    expect(result.body.singleResult.data.{{queryName}}.{{field1}}).toBe('{{expectedValue}}');
  });

  it('returns error for non-existent resource', async () => {
    const result = await server.executeOperation({
      query: `query { {{queryName}}(id: "nonexistent") { id } }`,
    });

    expect(result.body.singleResult.data.{{queryName}}).toBeNull();
  });
});
```

**Usage Notes**: Replace `{{QueryName}}` (e.g., `GetUser`), `{{Type}}` (e.g., `User`), `{{queryName}}` (e.g., `user`), `{{field1}}`/`{{field2}}`, `{{testId}}`, `{{expectedValue}}`.
