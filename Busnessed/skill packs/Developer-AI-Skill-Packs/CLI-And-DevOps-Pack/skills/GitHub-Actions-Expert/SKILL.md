---
name: GitHub-Actions-Expert
version: 1.0.0
domain: CI/CD
activation_description: Activate when creating or debugging GitHub Actions workflows
purpose: Master GitHub Actions for CI/CD pipeline automation including workflow design, optimization, and maintenance
---

# GitHub-Actions-Expert

## Capabilities
- Design workflow files with precise trigger conditions using `on:` syntax
- Implement matrix builds for multi-OS, multi-version testing
- Create reusable workflows and composite actions for DRY CI/CD
- Build Docker container actions and JavaScript actions
- Manage environment secrets securely with OIDC for cloud authentication
- Implement caching strategies for dependencies (npm, pip, Maven, Docker)
- Configure artifact upload/download for build outputs
- Use workflow commands for status reporting and output setting
- Set up and maintain self-hosted runners
- Control concurrency for workflow runs
- Design deployment environments with protection rules
- Schedule workflows with CRON expressions

## Limitations
- Cannot access secrets in forked PRs without approval
- Cannot run indefinitely (6-hour timeout on hosted runners)
- Cannot use nested reusable workflows more than 4 levels deep
- Cannot bypass environment protection rules from workflow
- Cannot customize hosted runner hardware (CPU, RAM, storage)
- Cannot access GitHub internal API without dedicated token

## Required Tools
- GitHub account with Actions-enabled repository
- GitHub CLI (`gh`) for workflow management
- Docker (for container actions)
- Node.js (for JavaScript actions)

## Execution Workflow

1. Define the CI/CD pipeline requirements (test, build, deploy stages)
2. Create `.github/workflows/` directory in repository
3. Write workflow YAML with trigger conditions (`on:`)
4. Configure jobs with appropriate `runs-on` and dependencies (`needs:`)
5. Add steps with actions (marketplace, custom, or inline scripts)
6. Set up matrix strategy for multi-version testing
7. Configure caching for dependencies to optimize run time
8. Add secrets and environment variables for sensitive data
9. Implement OIDC for cloud provider authentication
10. Set up artifact storage for build outputs
11. Add deployment environments with protection rules
12. Configure concurrency to prevent overlapping runs
13. Test workflow with `workflow_dispatch` trigger
14. Monitor runs and optimize based on timing and failure patterns

## Decision Tree

```
What type of action?
├── Simple script → Use run step with shell command
├── Multi-step logic → Composite action
├── Custom tool → Docker container action
└── Node.js tool → JavaScript action

Need multi-platform testing?
├── Yes → Use matrix strategy with os and version
└── No  → Single runner configuration

Need to reuse workflow across repos?
├── Yes → Create reusable workflow with workflow_call trigger
├── No  → Keep workflow in current repository

Deploying to cloud?
├── Yes → Use OIDC for authentication (no static secrets)
├── No  → Use repository secrets

Large dependencies?
├── Yes → Implement caching (actions/cache)
├── No  → Default install each run

Need to control parallel runs?
├── Yes → Use concurrency with cancel-in-progress
├── No  → Default behavior (all runs in parallel)

Self-hosted runner needed?
├── Yes → Required for: GPU, specific hardware, air-gapped
└── No  → Use GitHub-hosted runners
```

## Review Checklist
- [ ] Workflow file is valid YAML syntax
- [ ] Trigger conditions cover intended events only
- [ ] Secrets are not exposed in logs or error messages
- [ ] Caching is configured for all dependency managers
- [ ] Matrix strategy includes all required versions
- [ ] Job dependencies (`needs:`) correctly ordered
- [ ] Environment variables scoped appropriately (job vs step)
- [ ] Artifacts uploaded for build outputs
- [ ] OIDC configured for cloud authentication
- [ ] Concurrency settings prevent duplicate runs
- [ ] Workflow has a `workflow_dispatch` trigger for manual runs
- [ ] Error handling included (continue-on-error, if: failure())

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Workflow not triggering | Wrong trigger syntax | Check `on:` configuration, branch filters |
| Secret not available | Wrong scope (env vs repo) | Verify secret scope; use env context |
| Action fails silently | Missing error handling | Add `|| true` or check `if: failure()` |
| Cache miss | Cache key mismatch | Debug cache key with `hashFiles()` function |
| Matrix build timeout | Too many combinations | Limit matrix with `max-parallel` |
| Self-hosted runner offline | Runner not polling | Check runner service status and logs |
| OIDC token failure | Wrong audience/config | Verify OIDC configuration in cloud provider |
| Artifact upload fails | Path does not exist | Verify artifact path is relative to workspace |

## Best Practices
- Pin actions to specific SHAs for supply chain security
- Use `actions/checkout` with `fetch-depth: 0` for full git history
- Cache dependencies with platform-specific keys
- Use `if:` conditions to skip unnecessary steps
- Keep secrets in repository/org secrets, not workflow files
- Use reusable workflows for common CI patterns
- Set `max-parallel` in matrix builds to avoid rate limits
- Add `workflow_dispatch` with inputs for manual testing
- Monitor Actions usage for cost optimization
- Use `needs:` to parallelize independent jobs
- Validate YAML with `yamllint` before committing
- Set appropriate timeout-minutes for each job

## Anti-Patterns
- Hard-coding secrets in workflow YAML files
- Using `pull_request_target` without understanding security implications
- Running untrusted code from forked PRs without approval
- Caching entire node_modules instead of package manager cache
- Ignoring workflow run failures (red builds)
- Using `latest` tag for action versions
- Running all jobs sequentially when they could be parallel
- Not setting `timeout-minutes` (runs can hang for 6 hours)
- Committing debug tokens or access keys in workflow files
- Over-using matrix builds with unnecessary combinations

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
