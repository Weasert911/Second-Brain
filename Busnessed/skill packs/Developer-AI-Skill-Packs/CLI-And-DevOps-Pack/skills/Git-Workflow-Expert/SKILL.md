---
name: Git-Workflow-Expert
version: 1.0.0
domain: Version Control
activation_description: Activate when working with Git branching, history rewriting, or repository management
purpose: Master Git workflows including branching strategies, history manipulation, recovery, and repository optimization
---

# Git-Workflow-Expert

## Capabilities
- Implement GitFlow, trunk-based development, and GitHub Flow branching strategies
- Execute interactive rebase for commit history cleanup and squashing
- Perform cherry-pick to selectively apply commits across branches
- Use git bisect for efficient regression finding
- Recover lost commits and branches using git reflog
- Manage stashes with advanced operations (partial stashing, branches from stashes)
- Execute reset operations (soft, mixed, hard) with full understanding of each mode
- Configure and manage Git hooks (pre-commit, pre-push, commit-msg, post-merge)
- Work with submodules and subtrees for dependency management
- Set up and manage Git worktrees for parallel development
- Create signed commits and tags with GPG
- Optimize repository performance with sparse checkout and partial clone

## Limitations
- Cannot resolve merge conflicts automatically without human judgment
- Cannot recover commits that have been garbage-collected (expired from reflog)
- Cannot override remote repository protection rules (server-side hooks, branch protection)
- Cannot handle binary file merges beyond simple pick strategies
- Cannot fix corrupted repositories without git fsck or manual intervention
- Cannot enforce workflow policies without server-side configuration

## Required Tools
- Git 2.x+
- GPG (for signed commits)
- diff/merge tool (for conflict resolution)
- GitHub CLI or GitLab CLI (for remote operations)

## Execution Workflow

1. Identify the Git workflow model appropriate for the project (GitFlow, trunk-based, GitHub Flow)
2. Configure repository settings: core.autocrlf, user.name, user.email, signing keys
3. Create branches from appropriate base (main/develop) following naming conventions
4. Make atomic commits with descriptive messages following conventional commits
5. Keep branch synchronized with base via rebase (preferred for feature branches) or merge
6. Use interactive rebase to clean up commit history before sharing
7. Run hooks (pre-commit linting, pre-push testing) to validate changes
8. Submit changes via pull request or direct push to shared branch
9. Handle merge conflicts using appropriate strategy (recursive, octopus, ours/theirs)
10. Verify commit history is clean and logical using git log with custom formatting
11. Tag releases with semantic versioning and GPG signatures
12. Clean up stale branches locally and remotely after merge
13. Document workflow decisions and conventions in CONTRIBUTING.md
14. Periodically audit repository health with git fsck and gc --auto

## Decision Tree

```
Is this a shared branch?
├── Yes → Is rebase already pushed?
│   ├── Yes → Use merge with --no-ff (never rebase public history)
│   └── No  → Use rebase for clean linear history
└── No  → Use either rebase or merge based on team convention

Need to undo a commit?
├── Has it been pushed?
│   ├── Yes → Use git revert (safe for public history)
│   └── No  → Use git reset with appropriate mode
│       ├── --soft: Keep changes staged
│       ├── --mixed: Keep changes unstaged (default)
│       └── --hard: Discard changes entirely

Lost a commit?
├── Check reflog (git reflog)
│   ├── Found → git cherry-pick or git branch to recover
│   └── Not found → Check ORIG_HEAD or FETCH_HEAD

Finding a bug introduction?
├── Use git bisect with automated test script
└── Narrow down to specific commit

Need to work on multiple features simultaneously?
├── Use git worktree add for parallel branches
└── Use git stash for quick context switching

Managing external dependencies?
├── Read-only and simple → git submodule
├── Need to modify upstream → git subtree
└── Both are acceptable → Consider package manager instead
```

## Review Checklist
- [ ] Branch name follows project convention (feature/, bugfix/, hotfix/)
- [ ] Commit messages follow conventional commits specification
- [ ] No merge commits in feature branches (rebased before PR)
- [ ] All merge conflicts resolved correctly
- [ ] Sensitive information (passwords, keys) not committed
- [ ] Large binary files not committed (use .gitignore or Git LFS)
- [ ] Signed commits enabled for all commits
- [ ] Hooks configured and running correctly
- [ ] Stale branches cleaned up after merge
- [ ] Tags created for releases with semantic versioning
- [ ] Submodules/subtrees pinned to specific commit (not branch)
- [ ] .gitignore covers all generated files and IDE artifacts
- [ ] reflog retention period configured appropriately
- [ ] Sparse checkout or partial clone configured if working with monorepo

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Detached HEAD state | Checked out a commit instead of a branch | Create a branch: `git checkout -b new-branch` |
| Merge conflict in binary file | Both branches modified same binary | Use `git checkout --ours/theirs -- file` or manual re-generation |
| Reflog entry expired | Default 90-day retention passed | Increase gc.reflogExpire setting |
| submodule not updating | Submodule pointer changed | Run `git submodule update --init --recursive` |
| Commit signed but verification fails | GPG key not in known hosts | Export public key and add to Git hosting provider |
| Large repository clone slow | Full history not needed | Use `git clone --depth 1` for shallow clone |
| pre-commit hook bypassed | --no-verify flag used | Enforce hooks via CI pipeline instead |
| Diverged branches after rebase | Rebased pushed commits | Force push with `--force-with-lease` |

## Best Practices
- Always rebase feature branches onto updated main before PR
- Write commit messages that explain why, not what
- Use `git --force-with-lease` instead of `--force`
- Keep commits atomic: one logical change per commit
- Use `git diff --check` to catch whitespace errors before commit
- Name branches consistently: `type/issue-number-description`
- Never commit secrets, build artifacts, or dependencies
- Use `.gitattributes` for consistent line endings across OS
- Review your own diff before pushing with `git diff --cached`
- Configure `pull.rebase=true` to avoid accidental merge commits
- Use `git stash --keep-index` to test staged changes
- Regularly run `git gc --auto` to optimize repository

## Anti-Patterns
- Rebasing shared branches that others have based work on
- Using `git push --force` instead of `--force-with-lease`
- Making large monolithic commits that mix unrelated changes
- Storing credentials or secrets in repository files
- Committing generated files that should be in .gitignore
- Merging main into feature branches repeatedly instead of rebasing
- Using git reset --hard without first checking git status
- Ignoring pre-commit hook failures with --no-verify
- Using git add . without reviewing changes first
- Keeping long-lived feature branches that diverge significantly

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
