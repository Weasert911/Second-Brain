# Docker-for-Web-Apps Checklists

## Pre-Flight Checklist

- [ ] Docker Engine 24+ installed and running
- [ ] Docker Compose v2+ installed
- [ ] Docker Desktop (dev) or engine-only configured
- [ ] Container registry account (Docker Hub, GHCR, ECR)
- [ ] Docker CLI authenticated with registry
- [ ] BuildKit enabled (DOCKER_BUILDKIT=1)
- [ ] Hadolint or Dockerfile linter configured
- [ ] .dockerignore created in project root
- [ ] .env.example created with all required variables
- [ ] Docker Compose files versioned in git

## Implementation Checklist

- [ ] Dockerfile uses specific base image tags (not :latest)
- [ ] Multi-stage builds separate build deps from runtime
- [ ] Dockerfile ordered for optimal layer caching (least to most frequently changing)
- [ ] RUN commands combined where possible (reducing layers)
- [ ] COPY commands specify explicit files, not entire directories
- [ ] .dockerignore excludes node_modules, .git, .env, build artifacts, logs
- [ ] Containers run as non-root user
- [ ] EXPOSE documents listening ports
- [ ] HEALTHCHECK configured for each service
- [ ] Resource limits set (CPU, memory)
- [ ] Restart policy configured (no, always, unless-stopped, on-failure)
- [ ] Named volumes for persistent production data
- [ ] Bind mounts for development hot reload (not in production)
- [ ] Networks configured for inter-service communication
- [ ] Services on internal networks not exposed to host
- [ ] Environment variables from .env files (not hardcoded)
- [ ] Secrets managed via environment variables or Docker secrets
- [ ] Logging driver configured with rotation

## Testing Checklist

- [ ] Build succeeds: `docker compose build --no-cache`
- [ ] Services start: `docker compose up -d`
- [ ] Health checks pass for all services
- [ ] API responds: `curl http://localhost:<port>/health`
- [ ] Database connects from application service
- [ ] Volume data persists across container restart
- [ ] Hot reload works in development (bind mounts)
- [ ] Environment variables correctly injected
- [ ] Resource limits enforced (docker stats)
- [ ] Log rotation works (check log files)
- [ ] Network isolation verified (db not accessible from host)
- [ ] Graceful shutdown works (docker compose down)
- [ ] Image size acceptable (docker images; check with dive)
- [ ] No security vulnerabilities (docker scout quick)
- [ ] Multi-arch builds work (if applicable)

## Release Checklist

- [ ] Images built with production target
- [ ] Images pushed to container registry
- [ ] Image tags applied (version + git SHA)
- [ ] Production .env file configured with production values
- [ ] Production compose file validated: `docker compose -f compose.prod.yaml config`
- [ ] Secrets configured (not in .env for production)
- [ ] Database migration strategy in place (init container or script)
- [ ] Logging configured for production (journald or external)
- [ ] Resource limits production-appropriate
- [ ] Replica count configured for high availability (if Swarm/K8s)
- [ ] Health checks production-appropriate (start_period, interval)
- [ ] Monitoring configured (container metrics, logs aggregation)
- [ ] Backup strategy for database volumes
- [ ] Rollback plan documented (previous image tags)
- [ ] Changelog updated with deployment changes

## Maintenance Checklist

- [ ] Base images updated monthly (security patches)
- [ ] Docker Engine updates reviewed for breaking changes
- [ ] Docker Compose format updates applied
- [ ] Image vulnerability scanning run weekly
- [ ] Unused images and volumes cleaned up (docker system prune)
- [ ] Log sizes monitored and rotation adjusted
- [ ] Resource usage reviewed (CPU, memory, disk)
- [ ] Volume backups tested quarterly
- [ ] Dependencies in Dockerfiles updated (npm packages, pip packages)
- [ ] Compose file syntax updated for latest Docker Compose version
- [ ] Secrets rotated per security policy
- [ ] Health check endpoints reviewed for accuracy
