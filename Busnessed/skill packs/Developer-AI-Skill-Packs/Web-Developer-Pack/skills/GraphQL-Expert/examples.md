# GraphQL-Expert Examples

## Beginner: Simple Blog Schema and Resolvers

**Description**: A basic GraphQL API for a blog with posts and authors.

```graphql
type Query {
  posts(page: Int, limit: Int): PostConnection!
  post(id: ID!): Post
  user(id: ID!): User
}

type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload!
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!
  createdAt: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
}

type CreatePostPayload {
  post: Post
  errors: [Error!]
}

type Error {
  field: String!
  message: String!
}

type PostConnection {
  edges: [Post!]!
  pagination: PaginationInfo!
}

type PaginationInfo {
  page: Int!
  limit: Int!
  total: Int!
  totalPages: Int!
}
```

```js
const resolvers = {
  Query: {
    posts: async (_, { page = 1, limit = 10 }, { db }) => {
      const skip = (page - 1) * limit;
      const [posts, total] = await Promise.all([
        db.posts.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
        db.posts.count(),
      ]);
      return {
        edges: posts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    },
    post: (_, { id }, { db }) => db.posts.findUnique({ where: { id } }),
    user: (_, { id }, { db }) => db.users.findUnique({ where: { id } }),
  },
  Mutation: {
    createPost: async (_, { input }, { db }) => {
      try {
        const post = await db.posts.create({ data: input });
        return { post, errors: null };
      } catch (err) {
        return { post: null, errors: [{ field: 'title', message: err.message }] };
      }
    },
  },
  Post: {
    author: (post, _, { db }) => db.users.findUnique({ where: { id: post.authorId } }),
  },
  User: {
    posts: (user, _, { db }) => db.posts.findMany({ where: { authorId: user.id } }),
  },
};
```

**Explanation**: This demonstrates basic query/mutation setup, paginated list queries, mutation payload pattern with errors, and resolver relationships. Note the N+1 problem in Post.author and User.posts (addressed in next example).

## Intermediate: DataLoader and Error Handling

**Description**: Blog API with DataLoader for N+1 prevention, custom errors, and proper mutation patterns.

```js
// loaders.js
import DataLoader from 'dataloader';

export function createLoaders(db) {
  return {
    userLoader: new DataLoader(async (ids) => {
      const users = await db.users.findMany({ where: { id: { in: ids } } });
      const userMap = new Map(users.map(u => [u.id, u]));
      return ids.map(id => userMap.get(id) || null);
    }),
    postLoader: new DataLoader(async (ids) => {
      const posts = await db.posts.findMany({ where: { id: { in: ids } } });
      const postMap = new Map(posts.map(p => [p.id, p]));
      return ids.map(id => postMap.get(id) || null);
    }),
    postsByAuthorLoader: new DataLoader(async (authorIds) => {
      const posts = await db.posts.findMany({ where: { authorId: { in: authorIds } } });
      const grouped = new Map();
      authorIds.forEach(id => grouped.set(id, []));
      posts.forEach(p => grouped.get(p.authorId)?.push(p));
      return authorIds.map(id => grouped.get(id) || []);
    }),
  };
}

// resolvers.js
const resolvers = {
  Query: {
    posts: async (_, { page = 1, limit = 10 }, { db }) => {
      const [posts, total] = await Promise.all([
        db.posts.findMany({ skip: (page - 1) * limit, take: limit }),
        db.posts.count(),
      ]);
      return {
        edges: posts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    },
    post: (_, { id }, { loaders }) => loaders.postLoader.load(id),
  },
  Mutation: {
    createPost: async (_, { input }, { db }) => {
      try {
        const post = await db.posts.create({ data: input });
        return { __typename: 'CreatePostSuccess', post };
      } catch (err) {
        return { __typename: 'CreatePostError', message: err.message, code: 'CREATE_FAILED' };
      }
    },
  },
  Post: {
    author: (post, _, { loaders }) => loaders.userLoader.load(post.authorId),
  },
  User: {
    posts: (user, _, { loaders }) => loaders.postsByAuthorLoader.load(user.id),
  },
};

// Type definitions with union for mutation result
const typeDefs = `
  union CreatePostResult = CreatePostSuccess | CreatePostError
  type CreatePostSuccess { post: Post! }
  type CreatePostError { message: String!, code: String! }
  extend type Mutation {
    createPost(input: CreatePostInput!): CreatePostResult!
  }
`;
```

**Explanation**: This shows DataLoader per request (in context), elimination of N+1 with batch loading, union types for mutation results (type-safe errors), and proper loader factory that creates fresh instances per request.

## Advanced: Apollo Federation with Subscriptions

**Description**: Federated GraphQL with user and post subgraphs, subscriptions, and real-time updates.

```graphql
# users-subgraph/schema.graphql
extend type Query {
  me: User
  user(id: ID!): User
}

type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
  posts: [Post!] @requires(fields: "id")
}

extend type Post @key(fields: "id") {
  id: ID! @external
}

# posts-subgraph/schema.graphql
extend type Query {
  posts: [Post!]!
  post(id: ID!): Post
}

type Post @key(fields: "id") {
  id: ID!
  title: String!
  content: String!
  authorId: ID!
  author: User!
  createdAt: String!
}

extend type User @key(fields: "id") {
  id: ID! @external
  posts: [Post!]!
}

type Subscription {
  postCreated: Post!
  postUpdated: Post!
}
```

```js
// posts-subgraph/resolvers.js
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
  Query: {
    posts: (_, __, { db }) => db.posts.findMany(),
    post: (_, { id }, { db }) => db.posts.findUnique({ where: { id } }),
  },
  Mutation: {
    createPost: async (_, { input }, { db }) => {
      const post = await db.posts.create({ data: input });
      pubsub.publish('POST_CREATED', { postCreated: post });
      return post;
    },
  },
  Subscription: {
    postCreated: { subscribe: () => pubsub.asyncIterator(['POST_CREATED']) },
    postUpdated: { subscribe: () => pubsub.asyncIterator(['POST_UPDATED']) },
  },
  Post: {
    __resolveReference: (ref, { db }) => db.posts.findUnique({ where: { id: ref.id } }),
    author: (post, _, { loaders }) => loaders.userLoader.load(post.authorId),
  },
  User: {
    __resolveReference: (ref) => ({ __typename: 'User', id: ref.id }),
    posts: (user, _, { db }) => db.posts.findMany({ where: { authorId: user.id } }),
  },
};
```

**Explanation**: This demonstrates Apollo Federation with @key, @external, @requires directives, __resolveReference for entity resolution, pub/sub for subscriptions with async iterators, and cross-subgraph type references.

## Production: Rate Limiting and Security

**Description**: Production GraphQL server with security, caching, and monitoring.

```js
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-query-complexity';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(10),
    createComplexityLimitRule(1000, {
      onCost: (cost) => console.log(`Query cost: ${cost}`),
      formatErrorMessage: (cost) => `Query too complex: ${cost}. Max 1000`,
    }),
  ],
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) => {
        if (requestContext.request.http?.headers.get('x-cache-key')) {
          return requestContext.request.http.headers.get('x-cache-key');
        }
        return null;
      },
    }),
    ...(process.env.APOLLO_KEY
      ? [ApolloServerPluginUsageReporting({ sendReportsImmediately: true })]
      : []),
  ],
  formatError: (formattedError, error) => {
    return {
      ...formattedError,
      extensions: {
        ...formattedError.extensions,
        code: error.extensions?.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    };
  },
});

await server.start();

app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      user: await authenticateUser(req),
      db,
      loaders: createLoaders(db),
      dataSources: { api: new ExternalAPI({ cache: { get: async () => null, set: async () => null } }) },
    }),
  })
);
```

**Explanation**: This production example shows query depth limit (10 levels), query complexity limit (1000 cost), response caching plugin, Apollo usage reporting for monitoring, structured error formatting with extensions, and request-scoped context with authentication and DataLoader.
