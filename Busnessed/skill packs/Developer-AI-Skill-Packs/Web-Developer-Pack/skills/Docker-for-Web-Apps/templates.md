# Docker-for-Web-Apps Templates

## Template 1: Node.js Multi-Stage Dockerfile

**Name**: `nodejs-dockerfile-template`
**Description**: Optimized multi-stage Dockerfile for Node.js applications.

```dockerfile
ARG NODE_VERSION={{nodeVersion}}
ARG ALPINE_VERSION={{alpineVersion}}

# Build stage
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS build
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production
WORKDIR /app

RUN addgroup --system {{appGroup}} && adduser --system --ingroup {{appGroup}} {{appUser}}

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=build /build/{{buildOutputDir}} ./{{buildOutputDir}}
COPY --from=build /build/public ./public

USER {{appUser}}

EXPOSE {{port}}

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:{{port}}/health', r => process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "{{entryPoint}}"]
```

**Usage Notes**: Replace `{{nodeVersion}}` (e.g., `20`), `{{alpineVersion}}` (e.g., `3.19`), `{{appGroup}}`/`{{appUser}}` (e.g., `nodejs`), `{{buildOutputDir}}` (e.g., `dist`, `.next`), `{{port}}`, `{{entryPoint}}` (e.g., `dist/index.js`).

## Template 2: Python/Flask Dockerfile

**Name**: `python-dockerfile-template`
**Description**: Multi-stage Dockerfile for Python web applications.

```dockerfile
FROM python:{{pythonVersion}}-slim AS build
WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:{{pythonVersion}}-slim AS production
WORKDIR /app

RUN groupadd -r {{appGroup}} && useradd -r -g {{appGroup}} {{appUser}}

COPY --from=build /usr/local/lib/python{{pythonShortVersion}}/site-packages /usr/local/lib/python{{pythonShortVersion}}/site-packages
COPY . .

USER {{appUser}}

EXPOSE {{port}}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:{{port}}/health')"

CMD ["gunicorn", "--bind", "0.0.0.0:{{port}}", "{{appModule}}:app"]
```

**Usage Notes**: Replace `{{pythonVersion}}` (e.g., `3.12`), `{{pythonShortVersion}}` (e.g., `3.12`), `{{appGroup}}`/`{{appUser}}`, `{{port}}`, `{{appModule}}` (e.g., `app` for app.py).

## Template 3: Docker Compose for Development

**Name**: `compose-dev-template`
**Description**: Development docker-compose with hot reload mounts.

```yaml
services:
  frontend:
    build:
      context: ./{{frontendDir}}
      target: development
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    volumes:
      - ./{{frontendDir}}:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:${API_PORT:-4000}
    depends_on:
      - api
    networks:
      - app-network

  api:
    build:
      context: ./{{apiDir}}
      target: development
    ports:
      - "${API_PORT:-4000}:4000"
    volumes:
      - ./{{apiDir}}:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@db:5432/${DB_NAME}
      - PORT=4000
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:4000/health',r=>process.exit(r.statusCode===200?0:1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 15s
    networks:
      - app-network

  db:
    image: postgres:{{postgresVersion}}-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
      - POSTGRES_DB=${DB_NAME}
    ports:
      - "${DB_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

**Usage Notes**: Replace service directory names, port defaults, database versions. Create a `.env` file with `DB_USER`, `DB_PASS`, `DB_NAME` variables.

## Template 4: Production Compose with Profiles

**Name**: `compose-prod-template`
**Description**: Production docker-compose with profiles and Traefik reverse proxy.

```yaml
services:
  traefik:
    image: traefik:{{traefikVersion}}
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email={{adminEmail}}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-data:/letsencrypt
    networks:
      - public

  api:
    build:
      context: ./{{apiDir}}
      target: production
    deploy:
      replicas: {{apiReplicas}}
      resources:
        limits:
          cpus: '{{apiCpuLimit}}'
          memory: {{apiMemLimit}}
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`${DOMAIN}`) && PathPrefix(`/api`)"
      - "traefik.http.services.api.loadbalancer.server.port=4000"
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:4000/health',r=>process.exit(r.statusCode===200?0:1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 15s
    networks:
      - public
      - internal

  db:
    image: postgres:{{postgresVersion}}-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
      - POSTGRES_DB=${DB_NAME}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
    networks:
      - internal

volumes:
  postgres-data:
  traefik-data:

networks:
  public:
    driver: bridge
  internal:
    driver: bridge
    internal: true
```

**Usage Notes**: Replace version numbers, domain, email, replica counts, resource limits. Use `docker compose --profile prod up -d` for production.

## Template 5: Health Check Script

**Name**: `healthcheck-template`
**Description**: Custom health check script for Docker container.

```bash
#!/bin/sh
# healthcheck.sh

SERVICE_URL="${HEALTHCHECK_URL:-http://localhost:{{port}}/health}"
TIMEOUT={{timeout}}

if [ -z "$SERVICE_URL" ]; then
  echo "HEALTHCHECK_URL not set"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT $SERVICE_URL 2>/dev/null)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
  exit 0
fi

exit 1
```

**Usage Notes**: Replace `{{port}}`, `{{timeout}}` (e.g., `5`). Make executable with `chmod +x healthcheck.sh`. Reference in Dockerfile: `COPY healthcheck.sh /healthcheck.sh` and `HEALTHCHECK CMD /healthcheck.sh`.

## Template 6: CI/CD Pipeline (GitHub Actions)

**Name**: `cicd-template`
**Description**: GitHub Actions workflow for building, testing, and deploying Docker images.

```yaml
name: {{pipelineName}}

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          docker compose -f compose.yaml run --rm api npm test

  build-and-push:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./{{serviceDir}}
          target: production
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/{{serviceName}}:latest
            ghcr.io/${{ github.repository }}/{{serviceName}}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**Usage Notes**: Replace `{{pipelineName}}`, `{{serviceDir}}`, `{{serviceName}}`. Adjust registry and tags for your container registry.

## Template 7: Reverse Proxy Config (Nginx)

**Name**: `nginx-template`
**Description**: Nginx configuration for reverse proxying Docker services.

```nginx
upstream api {
    server api:{{apiPort}};
}

upstream frontend {
    server frontend:{{frontendPort}};
}

server {
    listen 80;
    server_name {{domain}};

    client_max_body_size {{maxBodySize}};

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    location /api/ {
        proxy_pass http://api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Usage Notes**: Replace `{{apiPort}}`, `{{frontendPort}}`, `{{domain}}`, `{{maxBodySize}}` (e.g., `10M`). Place in `docker/nginx/nginx.conf`.

## Template 8: Multi-Architecture Build

**Name**: `multiarch-template`
**Description**: Build Docker images for multiple architectures.

```yaml
# docker-bake.hcl
group "default" {
  targets = ["app"]
}

target "app" {
  context = "."
  dockerfile = "Dockerfile"
  target = "production"
  tags = ["ghcr.io/{{org}}/{{image}}:latest"]
}

target "app-multiarch" {
  inherits = ["app"]
  platforms = ["linux/amd64", "linux/arm64"]
  tags = [
    "ghcr.io/{{org}}/{{image}}:latest",
    "ghcr.io/{{org}}/{{image}}:${SHA_TAG}"
  ]
  cache-from = ["type=gha"]
  cache-to = ["type=gha,mode=max"]
}
```

**Usage Notes**: Replace `{{org}}`, `{{image}}`. Build with: `docker buildx bake app-multiarch`. Requires `docker buildx create --use` for multi-architecture builds.
