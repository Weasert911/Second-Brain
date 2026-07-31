# Docker-for-Web-Apps Examples

## Beginner: Simple Node.js Web App

**Description**: A single Dockerfile for a Node.js Express app with optimization.

```dockerfile
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM base AS development
RUN npm install --include=dev
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm prune --production
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/index.js"]
```

```dockerignore
node_modules
npm-debug.log
.env
.git
.gitignore
coverage
dist
*.md
```

**Explanation**: This demonstrates multi-stage build with base, development, and production stages, npm ci for deterministic installs, non-root user, health check, and .dockerignore to exclude unnecessary files.

## Intermediate: Full-Stack App with Docker Compose

**Description**: A full-stack app with Next.js, Express, PostgreSQL, and Redis.

```yaml
# compose.yaml
services:
  frontend:
    build:
      context: ./frontend
      target: development
      args:
        - NODE_ENV=development
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    depends_on:
      api:
        condition: service_healthy
    networks:
      - app-network

  api:
    build:
      context: ./api
      target: development
    ports:
      - "4000:4000"
    volumes:
      - ./api:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://cache:6379
      - PORT=4000
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:4000/health', r => process.exit(r.statusCode===200?0:1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  cache:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      retries: 5
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**Explanation**: This shows multi-service orchestration with named volumes for database persistence, bind mounts for hot reload, health check dependencies, anonymous volumes for node_modules to prevent overwrite, and a dedicated app network for inter-service communication.

## Advanced: Production Deployment with Swarm

**Description**: Production-ready Docker Swarm stack with scaling and secrets.

```yaml
# compose.prod.yaml
services:
  api:
    build:
      context: ./api
      target: production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
        window: 120s
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://cache:6379
    secrets:
      - jwt_secret
      - api_key
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:4000/health || exit 1"]
      interval: 15s
      timeout: 3s
      retries: 3
      start_period: 30s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - traefik-public
      - internal

  frontend:
    build:
      context: ./frontend
      target: production
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
    environment:
      - NEXT_PUBLIC_API_URL=https://api.example.com
    networks:
      - traefik-public

  nginx:
    image: nginx:alpine
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - api
    deploy:
      labels:
        - traefik.enable=true
        - traefik.http.routers.app.rule=Host(`example.com`)
        - traefik.http.services.app.loadbalancer.server.port=80
    networks:
      - traefik-public

secrets:
  jwt_secret:
    external: true
  api_key:
    external: true

networks:
  traefik-public:
    external: true
  internal:
    driver: overlay
```

**Explanation**: This production Swarm stack demonstrates multi-service scaling with replica counts, resource limits and reservations, rolling update strategy with start-first, external secrets for sensitive data, structured logging with rotation, Traefik integration for reverse proxy and SSL termination, and overlay network for multi-host communication.

## Production: Kubernetes Deployment

**Description**: Kubernetes manifests for deploying the web application.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/myorg/api:1.0.0
          ports:
            - containerPort: 4000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 4000
            initialDelaySeconds: 5
            periodSeconds: 5
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 4000
      targetPort: 4000
  type: ClusterIP
```

**Explanation**: This demonstrates Kubernetes deployment with replica management, resource requests/limits, liveness and readiness probes for health checks, environment variables from secrets, and ClusterIP service for internal routing.
