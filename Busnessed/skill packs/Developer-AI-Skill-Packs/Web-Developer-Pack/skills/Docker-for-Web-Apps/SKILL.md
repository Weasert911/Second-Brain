---
name: "Docker-for-Web-Apps"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when containerizing web applications with Docker, writing Dockerfiles, configuring docker-compose for full-stack apps, or setting up CI/CD pipelines"
purpose: "Provides comprehensive guidance for containerizing web applications with Docker including multi-stage builds, docker-compose orchestration, networking, volumes, and production deployment"
---

## Capabilities

1. Write optimized Dockerfiles with multi-stage builds, layer caching, and minimal image sizes
2. Configure docker-compose for full-stack applications (frontend, backend, database, cache)
3. Manage container networking with bridge, host, overlay, and custom networks
4. Implement data persistence with bind mounts, named volumes, and tmpfs mounts
5. Configure environment management with .env files, env_file, and ARG/ENV instructions
6. Set up health checks for containers with proper intervals, retries, and start periods
7. Configure logging drivers for container log aggregation and management
8. Set resource limits on containers (CPU, memory, restart policies)
9. Manage secrets securely with Docker secrets and environment variables
10. Optimize builds with BuildKit features (cache mounts, inline caching, parallel builds)
11. Integrate Docker with CI/CD pipelines (GitHub Actions, GitLab CI)
12. Configure production vs development configurations with Compose profiles
13. Implement basic orchestration with Docker Swarm or Kubernetes references

## Limitations

1. Does not cover Kubernetes in depth (K8s-specific patterns, operators, Helm)
2. Cloud-specific container services (ECS, EKS, AKS, GKE) have platform-specific features
3. Does not cover container security scanning and vulnerability management in depth
4. Multi-architecture builds (ARM/AMD64) are covered but platform-specific issues may arise
5. Docker Desktop vs Docker Engine differences for production are noted but not exhaustive
6. Does not cover service mesh (Istio, Linkerd) or advanced networking patterns

## Required Tools

- Docker Engine 24+ and Docker Compose v2+
- Docker Desktop for local development (Windows/Mac)
- Docker Hub or container registry (Docker Hub, GHCR, ECR)
- BuildKit (included with Docker Engine 23+)
- Hadolint for Dockerfile linting
- Dive for image layer analysis
- Docker Scout for vulnerability scanning

## Execution Workflow

1. Analyze application architecture and dependencies (web server, database, cache, workers)
2. Write Dockerfiles for each service with multi-stage builds for production optimization
3. Implement .dockerignore to exclude unnecessary files from build context
4. Configure docker-compose.yml for local development with hot reload
5. Set up networks for inter-service communication (frontend → api → db)
6. Configure volumes for persistent data (database, uploads, logs)
7. Add environment variables through .env files and env_file directives
8. Implement health checks for each service
9. Configure resource limits and restart policies
10. Set up logging driver and log rotation
11. Create production docker-compose.override.yml with optimized settings
12. Build and test locally with docker compose up
13. Set up CI/CD pipeline for automated builds and deployment
14. Push images to container registry
15. Deploy with Docker Swarm, single host, or orchestration platform

## Decision Tree

1. **Build strategy?** → Simple app → Single-stage Dockerfile → Production optimization → Multi-stage → Monorepo → Build context optimization → Need cache → BuildKit cache mounts
2. **Service communication?** → Single host → Docker bridge network → Multi-host → Overlay network → External → Expose ports → Internal only → Internal network without port exposure
3. **Data persistence?** → Development → Bind mounts for hot reload → Production database → Named volumes → Temporary data → tmpfs → Shared between services → Named volume + volume_from
4. **Environment config?** → Few variables → Environment in compose → Many → .env file → Secrets → Docker secrets → Different per environment → Multiple .env files + profiles
5. **Production deployment?** → Single server → Docker Compose → Swarm cluster → Docker Swarm stack → Kubernetes → K8s manifests → Serverless → Container with cloud run
6. **CI/CD pipeline?** → GitHub → GitHub Actions → GitLab → GitLab CI → Custom → Jenkins/Drone → Registry → Docker Hub / GHCR / ECR

## Review Checklist

- [ ] Dockerfile uses specific base image tags (not :latest)
- [ ] Multi-stage builds separate dev dependencies from production
- [ ] Layer caching optimized (copy package.json before source, combine RUN commands)
- [ ] .dockerignore excludes node_modules, .git, env files, and build artifacts
- [ ] Containers run as non-root user (USER directive)
- [ ] Health checks configured for each service
- [ ] Resource limits set (CPU, memory) for all containers
- [ ] Networks configured with appropriate driver and scope
- [ ] Named volumes used for persistent production data
- [ ] Environment variables use .env files (not inlined in compose)
- [ ] Secrets not hardcoded in Dockerfiles or compose files
- [ ] Restart policies configured (no for dev, always/unless-stopped for prod)
- [ ] Logging driver configured with rotation limits
- [ ] Build images are minimized (scratch/alpine/distroless for production)
- [ ] Port mapping avoids conflicts (host ports mapped to container ports)

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Container exits immediately | Entrypoint/command fails | Check container logs; test entrypoint script locally |
| Port already in use | Host port conflict | Use different host port mapping; check for other containers |
| Volume permission denied | Volume owned by root | Use user: "${UID}:${GID}" or chown in entrypoint |
| Build slow | Cache not used or large context | Order Dockerfile for cache; optimize .dockerignore |
| Connection refused between containers | Network isolation | Ensure both containers on same network; use service name as host |
| Image too large | Unnecessary layers or files | Use multi-stage; optimize .dockerignore; use distroless base |
| docker-compose up fails | Version mismatch or syntax | Check Compose file format version; validate with docker compose config |
| Secret not available | Secret not mounted | Check secret exists; verify service has secret access |
| Container restarting | Unhealthy or crash loop | Check logs; increase health check start_period |
| Network timeout | DNS resolution in container | Use custom DNS; check network DNS settings |

## Best Practices

1. Use specific base image tags (node:20-slim, not node:latest)
2. Implement multi-stage builds for production images
3. Order Dockerfile instructions from least to most frequently changing for cache optimization
4. Use .dockerignore to reduce build context size
5. Run containers as non-root user for security
6. Configure health checks for all services
7. Set resource limits to prevent resource starvation
8. Use named volumes for persistent data, bind mounts for development
9. Use Docker Compose profiles for environment-specific configurations
10. Pin dependency versions in package managers for reproducible builds
11. Use BuildKit for faster builds with cache mounts
12. Scan images for vulnerabilities regularly
13. Use environment variables for configuration (12-factor app)
14. Implement proper signal handling (SIGTERM) in applications for graceful shutdown

## Anti-Patterns

1. Using :latest tag in production (unpredictable builds)
2. Running as root inside container (security risk)
3. Storing secrets in Dockerfiles or environment variables in compose
4. Combining multiple services in a single container
5. Using --force-recreate unnecessarily (causes downtime)
6. Not setting resource limits (leads to resource starvation)
7. Using `:` as volume syntax without proper path quoting
8. Hardcoding environment-specific values in compose files
9. Ignoring .dockerignore (sends unnecessary files to build context)
10. Using ADD instead of COPY (ADD has unexpected behavior with archives)

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
