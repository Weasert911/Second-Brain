---
name: Docker-Expert
version: 1.0.0
domain: Containerization
activation_description: Activate when creating Docker images, managing containers, or optimizing Docker workflows
purpose: Master Docker for container image creation, management, orchestration, and production deployment
---

# Docker-Expert

## Capabilities
- Optimize Dockerfiles with layer caching and multi-stage builds
- Manage images with tags, layers, history inspection, and cleanup
- Control container lifecycle (run, exec, logs, stop, rm)
- Configure networking modes (bridge, host, overlay, macvlan, ipvlan)
- Manage data with volumes, bind mounts, and tmpfs mounts
- Set resource constraints (CPU, memory, PIDs, restart policies)
- Implement container security (user namespaces, seccomp, AppArmor, rootless)
- Scan images for vulnerabilities
- Manage registries (Docker Hub, Harbor, Amazon ECR, Google Artifact Registry)
- Integrate with Docker Compose for multi-container apps
- Implement health checks for container monitoring
- Deploy and manage Docker Swarm clusters

## Limitations
- Cannot run Windows containers on Linux hosts (or vice versa without virtualization)
- Cannot bypass kernel sharing between host and containers
- Cannot guarantee identical behavior across different kernel versions
- Cannot run containers without Docker daemon running
- Cannot access host devices without explicit --device mappings
- Cannot automatically scale without orchestration (Swarm/Kubernetes)

## Required Tools
- Docker Engine 20.10+
- Docker CLI
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Docker Compose (V2, included with Docker Desktop)
- Container registry access (Docker Hub, ECR, etc.)

## Execution Workflow

1. Define application requirements and base image selection
2. Write Dockerfile with .dockerignore for build optimization
3. Use multi-stage builds for separate build and runtime stages
4. Build image with meaningful tags (semantic versioning, commit SHA)
5. Test container locally with appropriate port and volume mappings
6. Implement health checks for container monitoring
7. Set resource limits and restart policies for production
8. Scan image for vulnerabilities before pushing
9. Push image to registry with appropriate tags
10. Pull and run on target environment
11. Monitor container logs and resource usage
12. Clean up unused images, containers, and volumes regularly

## Decision Tree

```
Which base image?
├── Alpine → Smallest size, good for Go/Rust/static binaries
├── Debian/Slim → Balanced size and compatibility
├── Distroless → Smallest, most secure (no shell)
├── Ubuntu → Maximum compatibility, larger size
└── FROM scratch → For statically compiled binaries

How to manage data?
├── Permanent data → Volume (docker volume create)
├── Temporary data → tmpfs mount (in-memory)
├── Host access needed → Bind mount (absolute path)
└── Config files → Configs (Swarm) or bind mount

How to configure networking?
├── Single container → Bridge (default)
├── Host performance → Host mode (no network isolation)
├── Multi-host → Overlay (Swarm or external key-value store)
└── Static IP → Macvlan/Ipvlan

Production requirements?
├── Auto-restart → restart: unless-stopped or always
├── Resource limits → --memory, --cpus, --pids-limit
├── Security → --read-only, --cap-drop ALL, --security-opt=no-new-privileges
└── Monitoring → Health check with HEALTHCHECK instruction
```

## Review Checklist
- [ ] Base image is minimal and appropriate for the application
- [ ] .dockerignore excludes unnecessary files (node_modules, .git, build caches)
- [ ] Multi-stage build separates build and runtime dependencies
- [ ] Layers ordered by change frequency (least changing first)
- [ ] No secrets or credentials in Dockerfile or image layers
- [ ] Container runs as non-root user
- [ ] HealthCheck configured for service monitoring
- [ ] Resource limits set (memory, CPU)
- [ ] Only necessary ports exposed
- [ ] Logging driver configured (json-file, syslog, or fluentd)
- [ ] Image scanned for vulnerabilities before push
- [ ] Tags follow semantic versioning or commit SHA pattern

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Container exits immediately | Process not running in foreground | Use CMD that keeps process running (e.g., `nginx -g daemon off;`) |
| Image build slow | Cache invalidated by early layer change | Reorder Dockerfile: install deps before copying source |
| Permission denied | Running as root inside container | Create user with `RUN addgroup -S app && adduser -S app -G app` |
| Port already allocated | Host port in use | Use different host port: `-p 8081:80` |
| Disk space full | Unused images, containers, volumes | `docker system prune -a --volumes` |
| DNS resolution fails | Docker DNS configuration | Check `/etc/docker/daemon.json` DNS settings |
| Container cannot write | Read-only filesystem | Mount volume at write location or remove --read-only |
| Connection refused | Service not started or wrong port | Check container logs: `docker logs <container>` |

## Best Practices
- Use specific image tags, never `:latest` in production
- Minimize layers by combining RUN commands with `&&`
- Use `COPY --chown` to set file ownership during build
- Implement health checks for all production containers
- Set resource constraints on every container
- Use `docker scan` or third-party tools for vulnerability scanning
- Clean up unused resources regularly with `docker system prune`
- Use labels for metadata and organization
- Pin base image versions for reproducible builds
- Use `.dockerignore` to reduce build context size
- Log to stdout/stderr, not files (Docker captures these)
- Prefer array syntax for CMD and ENTRYPOINT: `["cmd", "arg"]`

## Anti-Patterns
- Running containers as root without need
- Storing secrets in environment variables (use secrets or vault)
- Using `:latest` tag in production deployments
- Building code inside the container (should be multi-stage)
- Using one container for multiple processes
- Ignoring build context size (sending GBs to Docker daemon)
- Not cleaning up intermediate images during multi-stage builds
- Exposing unnecessary ports (attack surface increase)
- Mounting entire host filesystem into container
- Disabling security features without understanding consequences

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
