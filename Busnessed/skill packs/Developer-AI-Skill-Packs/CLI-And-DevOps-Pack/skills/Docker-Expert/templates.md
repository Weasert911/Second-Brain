# Docker-Expert: Templates

## 1. Node.js Dockerfile Template
```
Name: nodejs-dockerfile
Description: Optimized Dockerfile for Node.js applications
Template:
FROM node:{{NODE_VERSION}}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:{{NODE_VERSION}}-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:{{NODE_VERSION}}-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
USER nodejs
EXPOSE {{PORT}}
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
Usage Notes: Multi-stage for minimal production image. Uses npm ci for deterministic installs. Runs as non-root user. Use NODE_VERSION=20-alpine for current LTS.
```

## 2. Python Dockerfile Template
```
Name: python-dockerfile
Description: Optimized Dockerfile for Python applications
Template:
FROM python:{{PYTHON_VERSION}}-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:{{PYTHON_VERSION}}-slim
WORKDIR /app
RUN addgroup --system app && adduser --system --group app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
USER app
EXPOSE {{PORT}}
CMD ["python", "main.py"]
Usage Notes: Slim image for smaller size. Separates build deps (compilers) from runtime. Uses pip --user for non-root install. PYTHON_VERSION=3.12-slim recommended.
```

## 3. Multi-Service Docker Compose Template
```
Name: multi-service-compose
Description: Multi-service Compose template with database and cache
Template:
version: "3.9"
services:
  app:
    build: .
    ports:
      - "{{APP_PORT}}:{{APP_PORT}}"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
      - {{ENV_VAR}}={{ENV_VALUE}}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:{{PG_VERSION}}-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: {{DB_NAME}}
      POSTGRES_USER: {{DB_USER}}
      POSTGRES_PASSWORD: {{DB_PASSWORD}}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U {{DB_USER}}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:{{REDIS_VERSION}}-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  pgdata:
  redis_data:
Usage Notes: Replace version numbers for your stack. Health checks ensure startup ordering. Named volumes for persistent data.
```

## 4. Docker Ignore Template
```
Name: dockerignore
Description: .dockerignore for Node.js and Python projects
Template:
node_modules/
npm-debug.log
.git
.gitignore
.env
.env.local
.vscode/
.idea/
*.md
dist/
coverage/
.nyc_output/
__pycache__/
*.pyc
.venv/
*.egg-info/
.virtualenvs/
Usage Notes: Reduces build context size significantly. Add project-specific entries (build directories, secrets). Commit alongside Dockerfile.
```

## 5. Health Check Template
```
Name: healthcheck-instruction
Description: HEALTHCHECK instruction for various services
Template:
HEALTHCHECK --interval={{INTERVAL}}s --timeout={{TIMEOUT}}s --start-period={{START}}s --retries={{RETRIES}} \
  CMD {{COMMAND}} || exit 1
Usage Notes: INTERVAL=30, TIMEOUT=10, START=5, RETRIES=3 for most services. HTTP: `curl -f http://localhost:{{PORT}}/health`. PostgreSQL: `pg_isready -U {{USER}}`. MySQL: `mysqladmin ping -u root -p{{PASSWORD}}`.
```

## 6. Resource Constraints Template
```
Name: resource-constraints
Description: Docker run/compose resource limit configuration
Template:
docker run \
  --memory={{MEMORY_LIMIT}} \
  --memory-reservation={{MEMORY_RESERVE}} \
  --cpus={{CPU_LIMIT}} \
  --pids-limit={{PIDS_LIMIT}} \
  --restart={{RESTART_POLICY}} \
  {{IMAGE}}

# Compose equivalent:
services:
  {{SERVICE}}:
    deploy:
      resources:
        limits:
          cpus: '{{CPU_LIMIT}}'
          memory: {{MEMORY_LIMIT}}
        reservations:
          cpus: '{{CPU_RESERVE}}'
          memory: {{MEMORY_RESERVE}}
    restart: {{RESTART_POLICY}}
Usage Notes: MEMORY_LIMIT=512M, CPU_LIMIT=0.5, PIDS_LIMIT=100, RESTART_POLICY=unless-stopped. Set reservations for guaranteed resources.
```

## 7. Security Scan Script
```
Name: security-scan
Description: Scan Docker images for vulnerabilities before push
Template:
#!/bin/bash
IMAGE="{{REGISTRY}}/{{IMAGE}}:{{TAG}}"

echo "Scanning $IMAGE..."

# Docker Scan (Snyk)
docker scan "$IMAGE" --severity high > scan-report.txt

# Grype (open source alternative)
grype "$IMAGE" -o json > grype-report.json

# Trivy (comprehensive scanner)
trivy image --severity HIGH,CRITICAL "$IMAGE"

# Check for high/critical vulnerabilities
if grep -q "CRITICAL\|HIGH" scan-report.txt 2>/dev/null; then
    echo "WARNING: Image has high/critical vulnerabilities!"
    exit 1
fi

echo "Scan complete. No critical issues found."
Usage Notes: Integrate into CI pipeline before push. Fail build on critical vulnerabilities. Combine multiple scanners for comprehensive coverage.
```

## 8. Container Logging Setup
```
Name: logging-config
Description: Docker logging driver configuration
Template:
# JSON file logging (default)
docker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 {{IMAGE}}

# Splunk logging
docker run --log-driver splunk \
  --log-opt splunk-token={{TOKEN}} \
  --log-opt splunk-url=https://{{SPLUNK_HOST}}:8088 \
  {{IMAGE}}

# Fluentd logging
docker run --log-driver fluentd \
  --log-opt fluentd-address={{FLUENTD_HOST}}:24224 \
  --log-opt tag="{{TAG}}" \
  {{IMAGE}}

# Daemon default (/etc/docker/daemon.json)
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
Usage Notes: Configure log rotation to prevent disk full. Use structured logging for production. Set daemon defaults for consistency across all containers.
