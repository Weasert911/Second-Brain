# Docker-Expert: Examples

## Beginner: Simple Node.js Web App
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```
```bash
docker build -t my-web-app:v1 .
docker run -d -p 3000:3000 --name web-app my-web-app:v1
docker logs web-app
docker stop web-app && docker rm web-app
```
**Explanation**: Minimal Dockerfile using Alpine for small size. Multi-step: install deps first (cached layer), then copy source. Run detached with port mapping.

## Intermediate: Multi-Stage Build for Go App
```dockerfile
# Build stage
FROM golang:1.22-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app .

# Run stage
FROM alpine:3.19
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /build/app /app/
USER app
EXPOSE 8080
CMD ["/app/app"]
```
**Explanation**: Multi-stage build: first stage compiles Go binary, second stage contains only the binary (no compiler tools). Creates non-root user. Result image is ~15MB instead of ~800MB.

## Advanced: Full-Stack App with Compose and Health Checks
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./api
      target: production
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://myapp:$(cat /run/secrets/db_password)@db:5432/myapp
    secrets:
      - db_password
    ports:
      - "8080:8080"
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: "0.5"
          memory: "256M"

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
    depends_on:
      - api

secrets:
  db_password:
    file: ./secrets/db_password.txt

volumes:
  pgdata:
```
**Explanation**: Production-grade setup with Postgres health check (API waits for healthy DB), secrets management via Docker secrets, service scaling with resource limits, Nginx reverse proxy, and named volumes for persistence.

## Production: CI/CD Pipeline with Multi-Stage and Caching
```dockerfile
# Cache dependencies layer
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build application
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1
LABEL maintainer="devops@company.com" version="1.0.0"
```
```bash
# Build with cache optimizations
docker build --cache-from myapp:latest --tag myapp:$(git rev-parse --short HEAD) .

# Security scan
docker scan myapp:$(git rev-parse --short HEAD)

# Push with multiple tags
docker tag myapp:$(git rev-parse --short HEAD) registry.example.com/myapp:latest
docker push registry.example.com/myapp:latest
```
**Explanation**: CI-optimized Dockerfile with separate dependency layer (cached until package.json changes), multi-stage for minimal production image, Nginx for serving static content, health check, and labels. Build with cache-from for pipeline performance.
