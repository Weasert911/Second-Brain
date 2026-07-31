# Docker-for-Web-Apps References

## Official Documentation

- **Docker Docs**: https://docs.docker.com/ - Installation, guides, reference for all Docker products
- **Dockerfile Reference**: https://docs.docker.com/engine/reference/builder/ - All Dockerfile instructions
- **docker-compose Reference**: https://docs.docker.com/compose/compose-file/ - Compose file format and options
- **Docker Networking**: https://docs.docker.com/network/ - Bridge, host, overlay, Macvlan
- **Docker Volumes**: https://docs.docker.com/storage/volumes/ - Volume management and drivers
- **Docker Secrets**: https://docs.docker.com/engine/swarm/secrets/ - Secret management for Swarm
- **Multi-stage Builds**: https://docs.docker.com/build/building/multi-stage/ - Optimized build patterns
- **BuildKit**: https://docs.docker.com/build/buildkit/ - Enhanced build capabilities
- **Docker Compose Profiles**: https://docs.docker.com/compose/profiles/ - Environment-specific configs
- **Docker Swarm**: https://docs.docker.com/engine/swarm/ - Orchestration with Swarm

## Terminology

1. **Image**: Read-only template with instructions for creating a container
2. **Container**: Runnable instance of an image
3. **Dockerfile**: Script with instructions to build a Docker image
4. **Layer**: Intermediate image produced by each Dockerfile instruction; cached for reuse
5. **Multi-stage Build**: Using multiple FROM statements in one Dockerfile to optimize final image size
6. **Volume**: Persistent storage managed by Docker, outside container filesystem
7. **Bind Mount**: Directory from host filesystem mounted into container
8. **tmpfs**: Temporary filesystem stored in memory, not persisted to disk
9. **Bridge Network**: Default Docker network that enables container-to-container communication
10. **Overlay Network**: Multi-host network for Swarm services
11. **Compose**: Tool for defining and running multi-container Docker applications
12. **Health Check**: Command Docker runs to determine container health status
13. **Dockerfile Cache**: Build cache that reuses unchanged layers
14. **Entrypoint**: Command that runs when container starts; can accept arguments
15. **CMD**: Default command or parameters for the entrypoint

## Architecture Notes

- Each container runs as an isolated process with its own filesystem, network, and process space
- Images are built in layers; each instruction creates a new layer that can be cached
- Containers should be ephemeral and stateless; state goes in volumes or external services
- Docker Compose is for single-host orchestration; Swarm/K8s for multi-host
- BuildKit improves build performance with parallel operations and better cache handling
- Multi-stage builds allow separate build and runtime environments in one Dockerfile
- The .dockerignore file reduces build context size, speeding up builds

## Key APIs

- `FROM <image>[:<tag>] [AS <name>]` - Base image with optional stage name
- `COPY [--chown=<user>:<group>] <src> <dest>` - Copy files from context/build stage
- `RUN <command>` - Execute command in new layer
- `CMD ["executable", "param1", "param2"]` - Default command (exec form)
- `ENTRYPOINT ["executable", "param"]` - Container entrypoint (exec form)
- `ENV <key>=<value>` - Set environment variable
- `ARG <name>[=<default>]` - Build-time variable
- `EXPOSE <port>` - Document listening port
- `WORKDIR <path>` - Set working directory
- `USER <user>[:<group>]` - Set user for RUN/CMD/ENTRYPOINT
- `HEALTHCHECK [OPTIONS] CMD <command>` - Container health check
- `VOLUME <path>` - Create mount point for volume
- `docker build -t <tag> .` - Build image
- `docker compose up -d` - Start services
- `docker compose logs -f` - Follow logs
- `docker compose exec <service> <cmd>` - Execute in running container

## Conventions

- **Image naming**: `<registry>/<project>/<service>:<tag>` (ghcr.io/myorg/api:1.0.0)
- **Tagging**: Semantic versioning, git SHA, or `latest` for bleeding edge
- **Dockerfile naming**: `Dockerfile` (default) or `Dockerfile.prod` for variants
- **Compose file naming**: `compose.yaml` or `docker-compose.yml`
- **Environment files**: `.env`, `.env.development`, `.env.production`
- **Service naming**: Match application service names (api, web, db, cache)
- **Network naming**: `<project>_<network>` for Compose; explicit names for manual

## Project Structure Recommendation

```
my-web-app/
  Dockerfile               # Production Dockerfile
  Dockerfile.dev           # Development Dockerfile (hot reload)
  .dockerignore            # Build context exclusions
  compose.yaml             # Main compose file
  compose.override.yaml    # Development overrides (auto-loaded)
  compose.prod.yaml        # Production overrides (docker compose -f compose.yaml -f compose.prod.yaml)
  .env                     # Environment variables
  .env.example             # Example env for developers
  docker/
    nginx/
      Dockerfile
      nginx.conf
    scripts/
      entrypoint.sh        # Custom entrypoint script
      healthcheck.sh       # Health check script
  src/
    ...
```
