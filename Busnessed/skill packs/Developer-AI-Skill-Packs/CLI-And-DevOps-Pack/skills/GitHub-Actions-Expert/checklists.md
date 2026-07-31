# GitHub-Actions-Expert: Checklists

## Pre-Flight Checklist
- [ ] Workflow uses valid YAML (no tabs, proper indentation)
- [ ] Actions pinned to specific SHAs or major versions (not latest)
- [ ] Secrets stored in repo/org secrets (not in YAML files)
- [ ] OIDC configured for cloud provider authentication
- [ ] Self-hosted runners registered and online if needed
- [ ] Required permissions set in workflow or token
- [ ] Actions marketplace actions reviewed for security
- [ ] Workflow has descriptive name and job names
- [ ] Trigger events correctly configured (push, PR, schedule)
- [ ] Branch filters match intended behavior

## Implementation Checklist
- [ ] Checkout action uses appropriate fetch-depth
- [ ] Caching configured for all package managers
- [ ] Matrix strategy covers required OS/version combinations
- [ ] max-parallel set to limit concurrent jobs
- [ ] timeouts configured for jobs and steps
- [ ] Environment variables scoped correctly (job vs step)
- [ ] Secrets accessed via ${{ secrets.NAME }} syntax
- [ ] Artifacts uploaded after build steps
- [ ] Reusable workflows called with correct syntax
- [ ] Composite actions properly defined with action.yml

## Testing Checklist
- [ ] workflow_dispatch can trigger workflow manually
- [ ] All matrix combinations complete successfully
- [ ] Cache restores correctly on subsequent runs
- [ ] Secrets are masked in logs (not exposed)
- [ ] Artifacts download with expected content
- [ ] Deployment reaches target environment
- [ ] OIDC tokens authenticate correctly
- [ ] Self-hosted runners execute jobs
- [ ] Concurrency controls work as expected
- [ ] CRON-triggered workflows run on schedule

## Release Checklist
- [ ] Workflow tested on release branch before merge
- [ ] Release workflow has manual approval gates
- [ ] Deployment environments configured with protection
- [ ] Release artifacts published to registry
- [ ] Version tags trigger correct release workflow
- [ ] Changelog generated or updated
- [ ] Release notes link to relevant commits
- [ ] Rollback workflow defined if needed
- [ ] Notifications configured for release events
- [ ] Post-release cleanup workflow runs

## Maintenance Checklist
- [ ] Action versions updated quarterly (dependabot helps)
- [ ] Workflow run history reviewed for recurring failures
- [ ] Cache hit rates monitored and optimized
- [ ] Self-hosted runner software updated
- [ ] OIDC provider trust relationship verified
- [ ] Deprecated actions replaced (set-output → GITHUB_OUTPUT)
- [ ] Unused workflows archived or deleted
- [ ] GitHub Actions usage/cost reviewed monthly
