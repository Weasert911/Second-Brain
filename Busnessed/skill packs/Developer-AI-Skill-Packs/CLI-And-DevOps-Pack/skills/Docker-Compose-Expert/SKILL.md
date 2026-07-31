---
name: Docker-Compose-Expert
version: 1.0.0
domain: Container Orchestration
activation_description: Activate when defining or managing multi-container Docker applications with Compose
purpose: Master Docker Compose for defining and running multi-container applications with production-ready configurations
---

# Docker-Compose-Expert

## Capabilities
- Define multi-service applications in Compose YAML files
- Configure networks and volumes for service isolation and data persistence
- Manage environment variables and .env files for configuration
- Implement depends_on with health check conditions
- Configure health checks and inter-service dependencies
- Use profiles for environment-specific service activation
- Extend services with the `extends` keyword for DRY configuration
- Configure replicas for service scaling
- Set resource limits and restart policies per service
- Implement logging drivers for centralized logging
- Manage secrets and configs for sensitive data
- Use multi-file Compose with override files for different environments

## Limitations
- Cannot manage containers across multiple hosts natively (use Swarm or K8s)
- Cannot perform rolling updates without Docker Swarm
- Cannot auto-scale services based on load
- Cannot handle complex service discovery without external tools
- Cannot enforce network policies beyond basic driver selection
- Cannot guarantee ordering beyond depends_on conditions

## Required Tools
- Docker Engine 20.10+
- Docker Compose V2 (docker compose, not docker-compose)
- Docker Desktop or Linux Docker Engine

## Execution Workflow

1. Identify application components and their relationships
2. Create project directory with compose.yml or docker-compose.yml
3. Define services with appropriate images, ports, and volumes
4. Configure networks for service isolation (frontend, backend, db)
5. Add volume mounts for persistent data
6. Use environment variables and .env file for configuration
7. Set health checks for service dependency ordering
8. Implement depends_on with condition for startup ordering
9. Configure resource limits and restart policies
10. Use profiles for dev/test/prod variations
11. Create override files for environment-specific settings
12. Test with `docker compose up` and verify inter-service communication
13. Use `docker compose logs` to verify startup order
14. Configure production settings (logging driver, resource limits, secrets)

## Decision Tree

```
Single host deployment?
├── Yes → Compose is sufficient
├── No  → Compose + Swarm, or migrate to Kubernetes

Need different configs per environment?
├── Yes → Use multiple compose files with -f flag
│   ├── docker-compose.yml (base)
│   ├── docker-compose.override.yml (dev, default)
│   └── docker-compose.prod.yml (production)
└── No  → Single compose file with environment variables

Service startup ordering required?
├── No  → Simple depends_on without condition
├── Yes → depends_on with condition: service_healthy
└── Complex → Use init container pattern

Need secret management?
├── Simple → .env file (never commit)
├── Swarm → docker secret create
└── Production → External secret manager (HashiCorp Vault, AWS Secrets Manager)

Need scaling?
├── Stateless services → replicas in compose
├── Stateful services → Use volumes with replica pinning
└── Auto-scaling → Not supported, use Kubernetes

Network isolation needed?
├── All services communicate → Default network
├── Need isolation tiers → Multiple networks (frontend, backend, db)
└── External access needed → Publish specific ports
```

## Review Checklist
- [ ] Compose file format version matches Docker Engine version
- [ ] Service names follow naming conventions (no underscores for DNS)
- [ ] .env file listed in .gitignore (never commit secrets)
- [ ] depends_on conditions configure startup ordering
- [ ] Health checks defined for all services
- [ ] Volume paths use named volumes, not host paths (for portability)
- [ ] Resource limits set for all services
- [ ] Restart policy configured (unless-stopped or always for production)
- [ ] Networks scoped appropriately (internal vs external)
- [ ] Port mappings avoid conflicts (use different host ports)
- [ ] Logging driver configured for production
- [ ] Profiles used for environment-specific services

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Service not starting | Port conflict on host | Change host port mapping |
| Container exits immediately | No foreground process | Check CMD/entrypoint; add `tty: true` for debugging |
| depends_on not waiting | No condition set | Use `condition: service_healthy` |
| Environment variables not set | .env file not loaded | Ensure .env in same directory; check variable syntax |
| Volume permission denied | UID/GID mismatch | Set user: "1000:1000" or use user namespace remapping |
| Network not found | Network defined but not created | Use `external: true` for pre-existing networks |
| Build cache not used | Changing context frequently | Order build steps by change frequency |
| Service unreachable by name | Wrong network | Ensure services are on same network |

## Best Practices
- Use Compose V2 (`docker compose`, not `docker-compose`)
- Keep base compose file generic, use override files for environment specifics
- Use .env file for environment-specific variables, never hard-code
- Name volumes explicitly for better readability
- Use `healthcheck` across all services that need dependency ordering
- Pin image versions to specific tags (avoid `:latest`)
- Use `container_name` only when necessary (Docker Compose generates names)
- Set `restart: unless-stopped` for production services
- Use `profiles` to exclude dev-only services in production
- Validate compose file with `docker compose config`
- Document environment variables in a .env.example file
- Use `--project-name` for multiple instances of the same project

## Anti-Patterns
- Hard-coding secrets in compose files or Dockerfiles
- Using `:latest` image tags in production
- Not setting resource limits (containers can exhaust host resources)
- Mounting host filesystem paths in production
- Using `network_mode: host` unnecessarily (breaks Docker networking)
- Putting all services in a single compose file without profiles
- Depending on `depends_on` without health check conditions
- Using `build` in production (should use pre-built images)
- Sharing volumes between services without access control
- Committing .env files with real credentials to version control

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
