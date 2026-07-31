# GitHub-Actions-Expert: References

## Official Documentation Summaries
- **GitHub Docs: Workflow syntax** – Complete `on:`, `jobs:`, `steps:` reference
- **GitHub Docs: Contexts** – `github`, `env`, `secrets`, `matrix`, `runner` contexts
- **GitHub Docs: Expressions** – `${{ }}` syntax, functions (contains, startsWith, hashFiles)
- **GitHub Docs: Reusable workflows** – `workflow_call` and `workflow_run` triggers
- **GitHub Docs: Security hardening** – OIDC, secret scanning, token permissions

## Glossary (15+ Terms)
- **Workflow** – YAML file defining automation pipeline
- **Job** – Set of steps running on the same runner
- **Step** – Individual unit of work (action or command)
- **Action** – Reusable unit of code (Docker, JS, or composite)
- **Runner** – Server that executes workflow jobs
- **Self-hosted runner** – Runner you manage on your infrastructure
- **Matrix** – Strategy for running jobs with multiple configurations
- **Reusable workflow** – Workflow called by other workflows
- **Composite action** – Action combining multiple steps
- **Context** – Object with workflow information (github, env, secrets)
- **Expression** – `${{ }}` syntax for dynamic values
- **Artifact** – Files persisted after workflow completion
- **OIDC** – OpenID Connect for cloud authentication without secrets
- **Concurrency** – Controls parallel execution of workflow runs
- **Deployment environment** – Target with protection rules

## Architecture Notes
- Workflows run in isolated VMs with ephemeral file systems
- Each job gets a fresh runner instance
- `needs:` determines job execution order (DAG-based)
- Actions are versioned via Git tags or SHAs
- Secrets are masked in logs automatically
- OIDC tokens are short-lived and workload-specific

## Key Commands / APIs
- `gh workflow list` – List workflows
- `gh workflow run` – Trigger workflow_dispatch
- `gh run list` – List workflow runs
- `gh run view` – View run details and logs
- `gh run download` – Download artifacts
- `POST /repos/{owner}/{repo}/actions/workflows/{id}/dispatches` – API trigger
- `GET /repos/{owner}/{repo}/actions/runs` – List runs via API

## Conventions
- Workflow files: `.github/workflows/<name>.yml`
- Action naming: `owner/action-name@v1`
- Job naming: `snake_case` identifiers
- Step naming: Descriptive `name:` fields
- Secrets: `UPPER_SNAKE_CASE` naming

## Structure Recommendations
- `.github/workflows/` – All workflow YAML files
- `.github/actions/` – Composite actions and Docker actions
- `.github/workflows/reusable/` – Reusable workflows
- `action.yml` – Action metadata in action directories

## Keyboard Shortcuts
- `.` – Open web editor while viewing workflow file
- `Ctrl+F` – Search within workflow run logs
- `g + n` – Go to next run in series
