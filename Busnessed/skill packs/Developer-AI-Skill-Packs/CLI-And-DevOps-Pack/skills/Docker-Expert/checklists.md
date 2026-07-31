# Docker-Expert: Checklists

## Pre-Flight Checklist
- [ ] Docker Engine version 20.10+ installed
- [ ] Docker daemon running and accessible
- [ ] .dockerignore file exists in build context
- [ ] Base image chosen with specific version tag
- [ ] Multi-stage build planned for production images
- [ ] Container runs as non-root user
- [ ] Health check configured for service
- [ ] Resource limits planned (CPU, memory)
- [ ] Logging driver configured
- [ ] Only necessary ports exposed

## Implementation Checklist
- [ ] FROM uses specific tag (not :latest)
- [ ] RUN commands combined with && to minimize layers
- [ ] apt-get uses --no-install-recommends
- [ ] npm ci used instead of npm install
- [ ] COPY --chown sets correct ownership
- [ ] WORKDIR used instead of RUN mkdir + cd
- [ ] EXPOSE documents intended ports
- [ ] CMD/ENTRYPOINT uses exec syntax
- [ ] HEALTHCHECK defined with reasonable intervals
- [ ] LABEL with maintainer and version info
- [ ] .dockerignore excludes node_modules, .git, build artifacts
- [ ] Build cache optimized (least-changed layers first)

## Testing Checklist
- [ ] Image builds without errors
- [ ] Container starts and process runs in foreground
- [ ] Health check reports healthy after startup
- [ ] Port mapping works (curl localhost:port)
- [ ] Volume mounts have correct permissions
- [ ] Environment variables set correctly
- [ ] Resource limits enforced (docker stats)
- [ ] No secrets exposed in image layers (docker history)
- [ ] Logs contain expected output (docker logs)
- [ ] Container stops cleanly (docker stop)

## Release Checklist
- [ ] Image scanned for vulnerabilities (docker scan)
- [ ] Image tagged with semantic version
- [ ] Image pushed to registry
- [ ] Multi-architecture build if needed (--platform)
- [ ] Release notes document image changes
- [ ] Docker Compose or deployment config updated
- [ ] Image digest recorded for traceability
- [ ] Old untagged images cleaned from registry
- [ ] Rollback plan documented (previous tag)
- [ ] Monitoring configured for new containers

## Maintenance Checklist
- [ ] Base images updated for security patches
- [ ] docker system prune run periodically
- [ ] Unused volumes and networks cleaned up
- [ ] Docker daemon logs reviewed for errors
- [ ] Image vulnerability scans scheduled
- [ ] Docker version checked for updates
- [ ] Compose files reviewed for best practices
- [ ] Dockerfile linter (hadolint) run on changes
