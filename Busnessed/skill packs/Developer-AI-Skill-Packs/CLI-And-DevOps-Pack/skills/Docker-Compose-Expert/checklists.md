# Docker-Compose-Expert: Checklists

## Pre-Flight Checklist
- [ ] Docker Engine and Compose V2 installed
- [ ] Compose file syntax valid (docker compose config)
- [ ] .env file exists with required variables
- [ ] .env added to .gitignore
- [ ] Image tags pinned (no :latest in production)
- [ ] Network plan defined (bridge, overlay, external)
- [ ] Volume plan defined (named vs bind mounts)
- [ ] Port conflict checked (no overlapping host ports)
- [ ] Service dependencies documented
- [ ] Health checks defined for dependent services

## Implementation Checklist
- [ ] Service names short, DNS-compatible (no underscores)
- [ ] depends_on with condition: service_healthy for critical deps
- [ ] restart: unless-stopped for production services
- [ ] Resource limits set for CPU and memory
- [ ] Logging driver configured (max-size, max-file)
- [ ] Secrets managed via docker secrets or env file
- [ ] Environment variables use ${VAR:-default} syntax
- [ ] Profiles used for dev-only services
- [ ] Multi-file Compose for environment-specific configs
- [ ] YAML anchors used for DRY configuration
- [ ] Container access limited to necessary networks only
- [ ] Health check test commands verified to work

## Testing Checklist
- [ ] docker compose up starts all services
- [ ] docker compose ps shows all services healthy
- [ ] Service-to-service DNS resolution works
- [ ] Port mapping accessible from host
- [ ] Volume data persists across restarts
- [ ] Environment variables interpolated correctly
- [ ] Profile filtering works (--profile flag)
- [ ] Health check conditions respected (depends_on)
- [ ] docker compose down -v cleans up volumes
- [ ] Resource limits enforced (docker stats)

## Release Checklist
- [ ] Override files merged (docker compose config > merged.yml)
- [ ] Production-specific compose file tested
- [ ] Secrets externalized (not in compose file)
- [ ] Image tags updated to release versions
- [ ] Replica count set for stateless services
- [ ] Deployment environment documented
- [ ] Backup strategy for database volumes
- [ ] Monitoring configuration included
- [ ] Docker stack deploy tested (if using Swarm)
- [ ] Rollback procedure documented

## Maintenance Checklist
- [ ] Compose file format version reviewed
- [ ] Service updates (version bumps) tracked
- [ ] Volume disk usage monitored
- [ ] Log files rotated via logging driver config
- [ ] Unused networks and volumes cleaned
- [ ] Compose file compared with production config
- [ ] .env.example kept in sync with actual .env
- [ ] Security updates applied to service images
