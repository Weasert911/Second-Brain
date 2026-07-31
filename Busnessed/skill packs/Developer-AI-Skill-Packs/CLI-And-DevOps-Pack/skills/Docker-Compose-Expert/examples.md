# Docker-Compose-Expert: Examples

## Beginner: LAMP Stack
```yaml
version: "3.9"
services:
  web:
    image: httpd:latest
    ports:
      - "8080:80"
    volumes:
      - ./www:/usr/local/apache2/htdocs/

  db:
    image: mariadb:11
    environment:
      MARIADB_ROOT_PASSWORD: example
      MARIADB_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```
```bash
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```
**Explanation**: Simple LAMP stack with Apache and MariaDB. Source code in `./www` is mounted into the web container. Database data persists in a named volume.

## Intermediate: Full-Stack App with Profiles
```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    environment:
      - DB_HOST=db
      - DB_NAME=${DB_NAME:-myapp}
      - DB_USER=${DB_USER:-myapp}
      - DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}
      POSTGRES_USER: ${DB_USER:-myapp}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-myapp}"]
      interval: 10s
      timeout: 5s
      retries: 5

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    profiles:
      - dev
      - tools

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    profiles:
      - dev

volumes:
  pgdata:
```
```bash
# Start dev services (all except adminer, mailhog)
docker compose --profile dev up -d

# Start with adminer/mailhog
docker compose --profile tools up -d

# Production (no dev tools)
docker compose -f compose.yml up -d
```
**Explanation**: Uses profiles to separate dev tools (adminer, mailhog) from core services. Environment variables via .env file. Health check ensures backend waits for database. Different configs for dev vs production.

## Advanced: Multi-File Compose for Environments
```yaml
# docker-compose.yml (base)
version: "3.9"
services:
  app:
    build: .
    environment:
      - NODE_ENV=${NODE_ENV:-development}
    volumes:
      - app_data:/app/data

volumes:
  app_data:
```
```yaml
# docker-compose.override.yml (dev - auto-loaded)
services:
  app:
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - /app/node_modules
    environment:
      - DEBUG=true
    command: npm run dev

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: devpassword
```
```yaml
# docker-compose.prod.yml (production)
services:
  app:
    image: registry.example.com/myapp:${TAG:-latest}
    ports:
      - "80:3000"
    restart: unless-stopped
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: "0.5"
          memory: "512M"

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    external: true

volumes:
  pgdata:
```
**Explanation**: Multi-file Compose pattern. Base file has shared config. Override file dev settings (source mounts, debug). Production file has specific image registry, resource limits, scaling, and secrets. Override is automatically applied, prod must be explicit: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`.

## Production: CI/CD with Compose
```yaml
# compose.ci.yml
services:
  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - CI=true
      - DB_HOST=db
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: testpass
      POSTGRES_DB: testdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
```
```bash
# CI pipeline script
docker compose -f compose.ci.yml up --abort-on-container-exit --exit-code-from test
exit_code=$?
docker compose -f compose.ci.yml down -v
exit $exit_code
```
```yaml
# compose.e2e.yml
services:
  app:
    build: .
    environment:
      - DB_HOST=db
      - DB_PASSWORD=testpass
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: testpass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

  cypress:
    image: cypress/included:latest
    depends_on:
      - app
    environment:
      - CYPRESS_BASE_URL=http://app:3000
    working_dir: /e2e
    volumes:
      - ./cypress:/e2e
```
**Explanation**: CI-specific Compose files with test service, health-checked dependencies, and exit code propagation. The `--abort-on-container-exit` flag stops all containers when the test service exits. The E2E variant runs Cypress tests against the app stack.
