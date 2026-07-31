# GitHub-PR-Expert: Checklists

## Pre-Flight Checklist
- [ ] Repository cloned and remote configured
- [ ] GitHub CLI (`gh`) installed and authenticated (`gh auth status`)
- [ ] Feature branch created from correct base branch
- [ ] Branch follows naming convention
- [ ] All commits are atomic with conventional commit messages
- [ ] Branch is up to date with base branch (rebased)
- [ ] Local tests pass before pushing
- [ ] PR template is present in .github/ directory
- [ ] CODEOWNERS file configured if needed
- [ ] Labels and milestones defined for the repository

## Implementation Checklist
- [ ] PR title follows conventional commits format
- [ ] PR description includes motivation and changes summary
- [ ] Related issues linked with keywords (Closes, Fixes, Resolves)
- [ ] Correct reviewers selected or CODEOWNERS auto-assigned
- [ ] Appropriate labels applied
- [ ] Milestone assigned if applicable
- [ ] Draft PR used if work is in progress
- [ ] Changes are scoped (not mixing unrelated changes)
- [ ] No merge conflicts with base branch
- [ ] Required files not modified unnecessarily

## Testing Checklist
- [ ] All CI checks pass (test, lint, build)
- [ ] No new warnings introduced
- [ ] Test coverage added or updated for changes
- [ ] Manual testing completed for critical paths
- [ ] Edge cases handled in code
- [ ] Error handling verified
- [ ] Performance impact assessed if relevant
- [ ] Cross-browser/platform compatibility checked
- [ ] API changes tested with curl or Postman
- [ ] Security implications reviewed

## Release Checklist
- [ ] Release PR branch created from main
- [ ] All feature PRs merged into release branch
- [ ] Version bumped in package manifest
- [ ] CHANGELOG.md updated with all changes
- [ ] Release PR reviewed and approved
- [ ] All checks passing on release branch
- [ ] Merge queue enabled for ordered merge
- [ ] Release tag created after merge
- [ ] Release notes published
- [ ] Hotfix branch prepared if needed

## Maintenance Checklist
- [ ] Stale PRs reviewed weekly (close or update)
- [ ] Dependabot PRs reviewed and merged regularly
- [ ] Branch protection rules audited quarterly
- [ ] CODEOWNERS file updated for team changes
- [ ] PR template updated as workflows evolve
- [ ] Labels reviewed and cleaned up
- [ ] Milestones closed when completed
- [ ] GitHub CLI updated to latest version
