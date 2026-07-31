# Docker-Compose-Expert: Snippets

## 1. Compose Config Validation
```bash
docker compose config
docker compose config --services
```
**When to use**: Validate compose file formatting and see merged configuration.

## 2. Service Logs
```bash
docker compose logs -f --tail=100 service_name
```
**When to use**: Follow logs for specific services during development or debugging.

## 3. Run One-Off Command
```bash
docker compose run --rm web npm run migrate
```
**When to use**: Execute a command in a new container from an existing service definition.

## 4. Restart with Rebuild
```bash
docker compose up -d --build --force-recreate
```
**When to use**: Rebuild images and recreate containers with latest code changes.

## 5. Scale Services
```bash
docker compose up -d --scale web=3 --scale worker=2
```
**When to use**: Scale stateless services for load testing or increased capacity.

## 6. Clean Everything
```bash
docker compose down -v --rmi all --remove-orphans
```
**When to use**: Complete teardown including volumes, images, and orphaned containers.

## 7. Environment Variable Interpolation
```yaml
environment:
  - DB_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
```
**When to use**: Reference .env variables in compose files for configuration flexibility.

## 8. Wait for Health Check
```yaml
depends_on:
  db:
    condition: service_healthy
```
**When to use**: Ensure dependent services wait for healthy state before starting.

## 9. Resource Limits
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```
**When to use**: Set resource constraints in Swarm mode or Compose V2.

## 10. Named Volume
```yaml
services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```
**When to use**: Create persistent named volumes for database storage.

## 11. Multi-Network Isolation
```yaml
networks:
  frontend:
  backend:
  db_net:
    internal: true
```
**When to use**: Isolate network tiers (frontend can't directly access database).

## 12. YAML Anchor for DRY Config
```yaml
x-logging: &logging
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"

services:
  app:
    logging: *logging
  worker:
    logging: *logging
```
**When to use**: Share common configuration across multiple services.

## 13. Profile-Based Service
```yaml
services:
  adminer:
    image: adminer
    profiles: ["dev", "tools"]
```
**When to use**: Exclude dev tools from production with profile filters.

## 14. External Network
```yaml
networks:
  proxy:
    external: true
```
**When to use**: Connect services to pre-existing Docker networks (e.g., shared reverse proxy).

## 15. Secrets from File
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
```
**When to use**: Mount sensitive data as files without embedding in compose or env.
