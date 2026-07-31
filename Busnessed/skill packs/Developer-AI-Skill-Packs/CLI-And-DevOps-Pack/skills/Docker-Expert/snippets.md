# Docker-Expert: Snippets

## 1. Multi-Stage Build
```dockerfile
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o app .

FROM alpine:3.19
COPY --from=builder /app/app /app/
CMD ["/app/app"]
```
**When to use**: Produce minimal production images by separating build and runtime stages.

## 2. Non-Root User Setup
```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```
**When to use**: Run containers as non-root for security best practices.

## 3. Optimized apt-get
```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    package1 package2 && rm -rf /var/lib/apt/lists/*
```
**When to use**: Install system packages while minimizing image layer size.

## 4. Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```
**When to use**: Monitor container health for orchestration and service discovery.

## 5. Web-Optimized MP4 (faststart)
```dockerfile
RUN ffmpeg -i input.mp4 -movflags +faststart -c copy output.mp4
```
**When to use**: Move moov atom to beginning of file for faster web streaming start.

## 6. Container Cleanup
```bash
docker system prune -a --volumes -f
```
**When to use**: Clean up all unused containers, images, networks, and volumes.

## 7. Run with Resource Limits
```bash
docker run -d --memory=512m --cpus=0.5 --pids-limit=100 --restart=unless-stopped myapp
```
**When to use**: Prevent containers from consuming excessive host resources.

## 8. Interactive Debugging
```bash
docker run -it --rm --entrypoint /bin/sh myimage -c "apk add curl && curl example.com"
```
**When to use**: Debug container issues interactively with a shell.

## 9. Export Container Filesystem
```bash
docker export container_name | gzip > container_backup.tar.gz
```
**When to use**: Create a backup of a container's filesystem for migration.

## 10. View Image Layers
```bash
docker history --no-trunc myimage:latest
```
**When to use**: Inspect image layers to understand size contributions and verify no secrets.

## 11. Label Image Metadata
```dockerfile
LABEL maintainer="devops@company.com" version="1.0.0" description="My application"
```
**When to use**: Add metadata to images for organization and automation.

## 12. Copy with Ownership
```dockerfile
COPY --chown=app:app files/ /app/files/
```
**When to use**: Ensure copied files have correct ownership for the non-root user.

## 13. Build with BuildKit Cache
```bash
DOCKER_BUILDKIT=1 docker build --cache-from myapp:latest --tag myapp:1.0 .
```
**When to use**: Speed up CI builds by using BuildKit's improved caching.

## 14. Registry Login and Push
```bash
echo $TOKEN | docker login ghcr.io -u $USERNAME --password-stdin
docker tag myapp:1.0 ghcr.io/org/myapp:1.0
docker push ghcr.io/org/myapp:1.0
```
**When to use**: Authenticate and publish images to container registries in CI.

## 15. Inspect Container Resources
```bash
docker stats --no-stream mycontainer
```
**When to use**: Check real-time resource usage of running containers.
