# Git-Workflow-Expert: Checklists

## Pre-Flight Checklist
- [ ] Repository cloned with full history or appropriate depth
- [ ] Git user.name and user.email configured locally
- [ ] GPG signing key configured if using signed commits
- [ ] .gitignore in place covering build artifacts and IDE files
- [ ] .gitattributes configured for line endings
- [ ] pre-commit hooks installed and functional
- [ ] Remote origin set and connectivity verified
- [ ] Branch naming convention agreed upon by team
- [ ] Commit message template available in contributing guide
- [ ] Access to issue tracker for branch naming references

## Implementation Checklist
- [ ] Branch created from correct base (main/develop)
- [ ] Branch name follows convention: type/issue-description
- [ ] Commits are atomic (one logical change per commit)
- [ ] Commit messages follow conventional commits format
- [ ] Changes compile/pass linting before each commit
- [ ] Branch rebased on latest base before completing work
- [ ] Interactive rebase run to clean up history
- [ ] Merge conflicts resolved and verified
- [ ] All new files tracked or in .gitignore
- [ ] git diff --cached reviewed before final commit

## Testing Checklist
- [ ] git bisect run completes successfully identifying regression
- [ ] Cherry-picked commits apply cleanly to target branch
- [ ] Reflog shows expected entries after operations
- [ ] Stash list is clean; no orphaned stashes
- [ ] Submodule pins point to correct commits
- [ ] Worktree operations don't interfere with main repo
- [ ] Sparse checkout patterns include all needed files
- [ ] Partial clone fetches objects on demand without error
- [ ] Signed commits verify successfully (git verify-commit)
- [ ] git fsck reports no errors on repository

## Release Checklist
- [ ] Main branch is up to date with all features merged
- [ ] Semantic version determined (MAJOR.MINOR.PATCH)
- [ ] Release branch created from main if using GitFlow
- [ ] CHANGELOG.md updated with release notes
- [ ] Version bumped in relevant configuration files
- [ ] Annotated and signed tag created: git tag -s vX.Y.Z
- [ ] Tag pushed to remote: git push origin vX.Y.Z
- [ ] Release notes published on GitHub/GitLab
- [ ] Hotfix branch created for critical production fixes
- [ ] Stale release branches deleted after merge

## Maintenance Checklist
- [ ] git gc --auto run regularly for repository optimization
- [ ] Stale branches cleaned up (local and remote)
- [ ] Reflog retention period configured (gc.reflogExpire)
- [ ] Submodules/subtrees updated to latest compatible versions
- [ ] Hook scripts reviewed and updated as project evolves
- [ ] .gitignore updated for new tooling/generated files
- [ ] Access to repository verified for all team members
- [ ] Backup of repository exists (remotes and local clones)
