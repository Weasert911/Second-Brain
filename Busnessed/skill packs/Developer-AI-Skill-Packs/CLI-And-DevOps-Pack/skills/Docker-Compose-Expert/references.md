# Docker-Compose-Expert: References

## Official Documentation Summaries
- **Compose file reference** – All top-level keys (services, networks, volumes, configs, secrets)
- **Compose specification** – Official specification for compose file format
- **Docker Compose CLI** – All compose commands and flags
- **Docker Compose in production** – Best practices and configuration guidance

## Glossary (15+ Terms)
- **Service** – Container definition in compose file
- **Volume** – Named Docker volume for data persistence
- **Network** – Communication channel between services
- **Profile** – Named group of services for selective activation
- **Replicas** – Number of container instances for a service
- **Depends_on** – Service startup ordering declaration
- **Healthcheck** – Periodic test of service readiness
- **Override file** – Additional compose file that merges with base
- **Secrets** – Sensitive data mounted into containers at runtime
- **Configs** – Non-sensitive configuration files mounted into containers
- **Extends** – Inherit service configuration from another service
- **Project name** – Prefix for resource naming, set with -p or COMPOSE_PROJECT_NAME

## Architecture Notes
- Compose creates an isolated environment per project (name-based)
- Networks and volumes are prefixed with project name
- Each service gets a DNS entry equal to the service name
- Compose V2 is a Docker CLI plugin, V1 was a separate binary
- Override files are merged top-level key by top-level key

## Key Commands / APIs
- `docker compose up/down/start/stop/restart` – Lifecycle
- `docker compose ps/logs/events/top` – Monitoring
- `docker compose build/pull/push` – Image management
- `docker compose run/exec` – Ad-hoc command execution
- `docker compose config` – Validate and view merged configuration
- `docker compose scale` – Adjust replica count (V1; V2 uses --scale)

## Conventions
- File naming: `compose.yml`, `compose.override.yml`, `compose.prod.yml`
- Service naming: `lowercase_with_underscores`
- Volume naming: `lowercase_with_underscores` (Docker generates if not specified)
- Environment variables: UPPER_CASE in `.env` file

## Structure Recommendations
```
project/
├── compose.yml              # Base configuration
├── compose.override.yml     # Dev overrides (git-ignored)
├── compose.prod.yml         # Production overrides
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Template environment variables
└── docker/                  # Dockerfiles and configs
    ├── Dockerfile
    └── nginx.conf
```

## Keyboard Shortcuts
- `Ctrl+C` – Stop all services and exit
- `Tab` – Auto-complete service names and compose commands
