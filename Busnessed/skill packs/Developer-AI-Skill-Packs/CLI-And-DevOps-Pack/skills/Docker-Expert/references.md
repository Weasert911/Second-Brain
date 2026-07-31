# Docker-Expert: References

## Official Documentation Summaries
- **Docker Docs** – Complete Docker Engine and CLI reference
- **Dockerfile reference** – All instructions (FROM, RUN, CMD, ENTRYPOINT, etc.)
- **Docker Compose specification** – Compose file format reference
- **Docker networking overview** – Bridge, host, overlay, macvlan drivers
- **Docker security** – Seccomp, AppArmor, user namespaces, rootless mode

## Glossary (15+ Terms)
- **Image** – Read-only template with instructions for creating a container
- **Container** – Runnable instance of an image
- **Layer** – Filesystem change in an image (each RUN/COPY creates a layer)
- **Dockerfile** – Script with instructions to build an image
- **Registry** – Repository for storing and distributing images
- **Volume** – Persistent storage managed by Docker
- **Bind mount** – Host directory mounted into container
- **Bridge network** – Default network driver for single-host communication
- **Overlay network** – Multi-host network for swarm services
- **Multi-stage build** – Multiple FROM statements for optimized images
- **Health check** – Command that tests container health status
- **Compose** – Tool for defining multi-container applications
- **Swarm** – Docker's native orchestration solution
- **Seccomp** – Linux kernel security feature for restricting syscalls
- **Rootless** – Running Docker daemon without root privileges

## Architecture Notes
- Docker uses a client-server architecture (CLI ↔ daemon via REST API)
- Images are built from layers that are cached and shared
- Containers share the host kernel but have isolated filesystem, network, PID namespaces
- The Docker daemon runs as root by default; rootless mode isolates user namespaces
- Images are immutable; all changes at runtime are in the container's writable layer

## Key Commands / APIs
- `docker build/image/pull/push/tag` – Image management
- `docker run/exec/start/stop/restart/rm` – Container lifecycle
- `docker ps/logs/stats/inspect/top` – Container monitoring
- `docker network/create/ls/connect/disconnect` – Network management
- `docker volume/create/ls/rm` – Volume management
- `docker system/prune/df/events` – System management
- `docker compose up/down/logs/ps/build` – Compose management

## Conventions
- Image naming: `registry/namespace/repo:tag`
- Dockerfile: `FROM base:tag`, `RUN commands`, `COPY context destination`
- Layer optimization: order by change frequency (infrequent changes first)
- Tags: `v1.2.3`, `latest`, `sha-a1b2c3d`, `stable`, `alpine`, `slim`

## Structure Recommendations
```
project/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── Dockerfile.dev
├── Dockerfile.prod
└── .env
```

## Keyboard Shortcuts
- `Ctrl+P Ctrl+Q` – Detach from container (interactive mode)
- `Ctrl+C` – Stop container process
- `Tab` – Auto-complete container names and image tags
- `Up/Down` – Navigate command history in docker exec session
