# Docker-Compose-Expert: Templates

## 1. Web App with Database Template
```
Name: web-app-compose
Description: Web application with PostgreSQL database
Template:
version: "3.9"
services:
  web:
    build: .
    ports:
      - "{{HOST_PORT}}:{{CONTAINER_PORT}}"
    environment:
      - DATABASE_URL=postgresql://{{DB_USER}}:{{DB_PASSWORD}}@db:5432/{{DB_NAME}}
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
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

volumes:
  pgdata:
  redis_data:
Usage Notes: Replace versions. Use strong DB password. Health check ensures web waits for DB.
```

## 2. Reverse Proxy (Nginx) Template
```
Name: nginx-reverse-proxy
Description: Nginx reverse proxy for backend services
Template:
version: "3.9"
services:
  nginx:
    image: nginx:{{NGINX_VERSION}}-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
      - frontend

  api:
    build: ./api
    expose:
      - "{{API_PORT}}"
    environment:
      - DB_HOST=db
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    expose:
      - "{{FRONTEND_PORT}}"

  db:
    image: postgres:{{PG_VERSION}}-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    expose:
      - "5432"

volumes:
  pgdata:
Usage Notes: Services expose internal ports (not published). Nginx routes /api to API service, / to frontend. SSL certificates in ./ssl directory.
```

## 3. Multi-File Compose Template
```
Name: multi-file-compose
Description: Base + override compose files for environments
Template:
# docker-compose.yml (base)
version: "3.9"
services:
  app:
    build: .
    environment:
      - NODE_ENV={{NODE_ENV}}

# docker-compose.override.yml (dev - auto-loaded)
services:
  app:
    ports:
      - "{{DEV_PORT}}:{{APP_PORT}}"
    volumes:
      - ./src:/app/src
    environment:
      - DEBUG=true
    command: npm run dev

# docker-compose.prod.yml (production)
services:
  app:
    image: {{REGISTRY}}/{{IMAGE}}:{{TAG}}
    ports:
      - "80:{{APP_PORT}}"
    restart: unless-stopped
    deploy:
      replicas: {{REPLICAS}}
      resources:
        limits:
          cpus: "{{CPU_LIMIT}}"
          memory: "{{MEMORY_LIMIT}}"
Usage Notes: Override auto-applied (dev). Prod explicit: `-f docker-compose.yml -f docker-compose.prod.yml`. Keep .env for environment-specific variables.
```

## 4. Profiles-Based Service Template
```
Name: profiles-compose
Description: Use profiles for environment-specific services
Template:
version: "3.9"
services:
  app:
    build: .
    ports:
      - "{{PORT}}:{{PORT}}"
    profiles: [""]

  db:
    image: postgres:{{PG_VERSION}}-alpine
    profiles: [""]

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    profiles: ["dev", "tools"]
    depends_on:
      - db

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    profiles: ["dev"]

  prometheus:
    image: prom/prometheus
    profiles: ["monitoring"]

  grafana:
    image: grafana/grafana
    profiles: ["monitoring"]
    depends_on:
      - prometheus
Usage Notes: Core services have empty profile (always started). Dev tools (adminer, mailhog) in "dev" profile. Monitoring stack in "monitoring" profile. Start with: `docker compose --profile dev up -d`.
```

## 5. Secrets Management Template
```
Name: compose-secrets
Description: Use Docker secrets for sensitive data
Template:
version: "3.9"
services:
  app:
    build: .
    secrets:
      - db_password
      - api_key
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - API_KEY_FILE=/run/secrets/api_key

  db:
    image: postgres:{{PG_VERSION}}-alpine
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
Usage Notes: Secrets mounted as files at /run/secrets/. Never commit ./secrets/ directory. For Swarm: `docker secret create db_password ./secrets/db_password.txt`. Use environment _FILE suffix pattern for compatible images.
```

## 6. CI Pipeline Compose Template
```
Name: ci-compose
Description: Compose configuration for CI testing
Template:
version: "3.9"
services:
  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - CI=true
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgres:{{PG_VERSION}}-alpine
    environment:
      POSTGRES_PASSWORD: testpass
      POSTGRES_DB: testdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10

  redis:
    image: redis:{{REDIS_VERSION}}-alpine
Usage Notes: Run in CI: `docker compose -f compose.ci.yml up --abort-on-container-exit --exit-code-from test`. Clean up: `docker compose -f compose.ci.yml down -v`.
```

## 7. Extends Template (Deprecated but Useful)
```
Name: extends-pattern
Description: Service inheritance with extends (Compose V2)
Template:
version: "3.9"
services:
  base-app:
    image: {{BASE_IMAGE}}
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  api:
    extends:
      service: base-app
    environment:
      - SERVICE_TYPE=api
      - {{API_VAR}}={{API_VAL}}
    ports:
      - "{{API_PORT}}:{{API_PORT}}"

  worker:
    extends:
      service: base-app
    environment:
      - SERVICE_TYPE=worker
      - {{WORKER_VAR}}={{WORKER_VAL}}
    command: ["npm", "run", "worker"]
Usage Notes: extends shares configuration between services. Deprecated in Compose V2 but still functional. Prefer YAML anchors (&) for more control.
```

## 8. YAML Anchor Template
```
Name: yaml-anchors
Description: Use YAML anchors for DRY service configuration (preferred over extends)
Template:
version: "3.9"

x-logging: &default-logging
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"

x-restart: &restart-policy
  restart: unless-stopped

services:
  api:
    <<: *restart-policy
    logging: *default-logging
    build: ./api
    ports:
      - "{{API_PORT}}:{{API_PORT}}"

  worker:
    <<: *restart-policy
    logging: *default-logging
    build: ./worker
    command: ["node", "worker.js"]

  cron:
    <<: *restart-policy
    logging: *default-logging
    build: ./cron
    command: ["node", "cron.js"]
Usage Notes: YAML anchors (&) and references (*) are merged with <<: . More flexible than extends. Works with all Compose versions. Keeps configuration DRY.
