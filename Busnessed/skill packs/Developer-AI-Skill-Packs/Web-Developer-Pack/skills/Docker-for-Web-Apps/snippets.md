# Docker-for-Web-Apps Snippets

## Snippet 1: Optimized Node.js Dockerfile

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM base AS development
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
RUN npm run build && npm prune --production
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',r=>process.exit(r.statusCode===200?0:1))"
CMD ["node", "dist/index.js"]
```

**When to use**: Every Node.js project should use multi-stage build with development and production targets.

## Snippet 2: .dockerignore

```
node_modules
.git
.gitignore
.env
.env.local
.env.production
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage
.next
dist
build
*.md
.vscode
.idea
Dockerfile
docker-compose*.yml
```

**When to use**: Every project needs a .dockerignore to reduce build context size and speed up builds.

## Snippet 3: Named Volume for Database

```yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}

volumes:
  postgres-data:
```

**When to use**: Always use named volumes for database data in production to ensure data persistence.

## Snippet 4: Bind Mount for Hot Reload

```yaml
services:
  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

**When to use**: Development environment where code changes should trigger hot reload without rebuilding.

## Snippet 5: Health Check with Dependencies

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 15s

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5
```

**When to use**: Ensure services start in correct order and only when dependencies are healthy.

## Snippet 6: Resource Limits

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

**When to use**: Prevent a single container from consuming all host resources.

## Snippet 7: Multi-Stage Build with BuildKit Cache

```dockerfile
# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --prefer-offline

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
```

**When to use**: Speed up builds by caching npm packages and intermediate build artifacts with BuildKit.

## Snippet 8: Docker Compose with Profiles

```yaml
services:
  api:
    profiles: ["prod", "staging"]
    build: ./api
    deploy:
      replicas: 3

  db:
    image: postgres:16-alpine

  redis:
    image: redis:7-alpine

  mailhog:
    profiles: ["dev"]
    image: mailhog/mailhog
```

**When to use**: Different service sets for different environments (dev, staging, prod) using Compose profiles.

## Snippet 9: Secret Management with Docker Secrets

```yaml
# Swarm mode
version: "3.8"
services:
  api:
    secrets:
      - db_password
      - jwt_secret

secrets:
  db_password:
    external: true
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

**When to use**: Sensitive data like database passwords and API keys should never be in environment variables in production.

## Snippet 10: Logging with Rotation

```yaml
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        compress: "true"
```

**When to use**: Prevent logs from consuming all disk space by configuring rotation limits.

## Snippet 11: Docker Network with Internal Service

```yaml
services:
  api:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

**When to use**: Isolate database and backend services from external access while allowing API to connect to both.

## Snippet 12: Init Container for Migrations

```yaml
services:
  migration:
    build:
      context: ./api
      target: migration
    command: npx prisma migrate deploy
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URL=${DATABASE_URL}

  api:
    build: ./api
    depends_on:
      migration:
        condition: service_completed_successfully
```

**When to use**: Run database migrations as a one-off task before starting the main application.

## Snippet 13: Docker Compose with Extends

```yaml
x-app-base: &app-base
  restart: unless-stopped
  logging:
    driver: json-file
    options:
      max-size: "10m"
      max-file: "3"
  networks:
    - app-network

services:
  api:
    <<: *app-base
    build: ./api
    ports:
      - "4000:4000"

  worker:
    <<: *app-base
    build:
      context: ./api
      target: worker
    command: node worker.js
```

**When to use**: Share common configuration (restart policy, logging, networks) across multiple services.

## Snippet 14: Build Arguments

```dockerfile
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "development" ]; then \
  npm install --include=dev; \
  else \
  npm ci --only=production; \
  fi
```

```yaml
services:
  api:
    build:
      context: ./api
      args:
        NODE_ENV: development
```

**When to use**: Conditional logic in Dockerfile based on build-time variables like environment.

## Snippet 15: Docker System Prune Command

```bash
# Clean unused resources
docker system prune -a --volumes

# Check disk usage
docker system df

# Clean builder cache
docker builder prune

# Remove stopped containers
docker container prune

# Remove unused volumes
docker volume prune
```

**When to use**: Regular cleanup of unused Docker resources to free disk space. Be careful with `--volumes` as it removes all unused volumes including database data.
