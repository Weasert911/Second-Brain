# Changelog

## [1.0.0] - 2026-07-05

### Added
- Initial commercial release of CLI & DevOps Pack
- 12 expert-level skills covering the complete CLI and DevOps toolchain:
  - Git-Workflow-Expert: Branching strategies, rebase, bisect, reflog, hooks, submodules, worktrees, and advanced Git workflows
  - GitHub-PR-Expert: Pull request lifecycle, code review automation, merge queues, branch protection, and GitHub CLI integration
  - GitHub-Actions-Expert: Workflow orchestration, matrix builds, reusable workflows, composite actions, and self-hosted runners
  - Linux-Terminal-Expert: File operations, text processing, process management, networking, and package management on Linux
  - Bash-Scripting-Expert: Strict mode scripting, arrays, parameter expansion, error handling, and shellcheck compliance
  - PowerShell-Expert: Cmdlet design, pipeline processing, remoting, DSC, advanced functions, and splatting
  - Docker-Expert: Dockerfile optimization, multi-stage builds, networking, volumes, security, and registry management
  - Docker-Compose-Expert: Compose file formats, service definitions, health checks, profiles, and production deployment
  - FFmpeg-Expert: Codec selection, filter graphs, hardware acceleration, streaming, and batch multimedia processing
  - CMake-Expert: Build system design, find_package, generator expressions, presets, CPack, and cross-compilation
  - Makefile-Expert: Rule structure, variables, functions, automatic dependencies, VPATH, and parallel builds
  - SSH-Deployment-Expert: Key management, config aliases, port forwarding, jump hosts, and deployment automation
- Each skill includes: SKILL.md, references.md, examples.md, templates.md, checklists.md, snippets.md
- Comprehensive decision trees, troubleshooting tables, best practices, and anti-patterns for every skill
- Production-ready templates using Handlebars syntax for rapid workflow generation
- Pre-flight, implementation, testing, release, and maintenance checklists for each domain

### Pack Structure
- `README.md` – Pack overview, installation, compatibility, licensing
- `LICENSE` – MIT License
- `CHANGELOG.md` – Version history
- `skills/<Skill-Name>/` – Individual skill directories with 6 files each
