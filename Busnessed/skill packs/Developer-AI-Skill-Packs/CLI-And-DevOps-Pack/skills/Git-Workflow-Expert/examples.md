# Git-Workflow-Expert: Examples

## Beginner: Interactive Rebase to Squash Commits
```bash
# Before: 3 messy commits
git log --oneline
# a1b2c3d WIP
# e4f5g6h Fix typo
# i7j8k9l Add feature

# Squash last 3 commits into 1
git rebase -i HEAD~3
# In editor: pick a1b2c3d, squash e4f5g6h, squash i7j8k9l

# After: clean single commit
git log --oneline
# m0n1o2p Add feature with complete implementation
```
**Explanation**: Interactive rebase rewrites commit history. Use `squash` to combine commits, `reword` to edit messages, `fixup` to discard messages. Never rebase pushed commits on shared branches.

## Intermediate: Recover Lost Commit with Reflog
```bash
# Accidentally reset --hard and lost work
git reflog
# a1b2c3d (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
# e4f5g6h HEAD@{1}: commit: important work

# Recover the lost commit
git cherry-pick e4f5g6h
# Or create a branch at that commit
git branch recover-important-work e4f5g6h
```
**Explanation**: Reflog records every HEAD movement for 90 days by default. Use `git reflog show` to see history, then `cherry-pick` or `branch` to recover. Reflog is local and not shared via remotes.

## Advanced: Git Worktrees for Parallel Features
```bash
# Main repository
git worktree add ../feature-auth feature/auth
git worktree add ../bugfix-login bugfix/login

# In ../feature-auth
cd ../feature-auth
git checkout feature/auth
# Work on feature without touching main working tree

# In ../bugfix-login
cd ../bugfix-login
git checkout bugfix/login
# Fix bug on separate branch simultaneously

# List worktrees
git worktree list
# /repo/main        main     a1b2c3d
# /repo/feature-auth feature/auth e4f5g6h
# /repo/bugfix-login bugfix/login i7j8k9l

# Prune worktree when done
cd ../main
git worktree remove ../feature-auth
```
**Explanation**: Worktrees allow checking out multiple branches simultaneously in separate directories. They share the same `.git` directory but maintain separate working trees and indexes. Ideal for parallel feature development without stashing.

## Production: Bisect for Regression Finding
```bash
git bisect start
git bisect bad           # Current version is broken
git bisect good v1.0.0   # Last known good version

# Git checks out middle commit
# Run tests and mark
git bisect good          # If commit is good
# OR
git bisect bad           # If commit is bad

# After ~log2(n) steps, git identifies the first bad commit
# a1b2c3d is the first bad commit

# Automate with script
git bisect start HEAD v1.0.0
git bisect run npm test

# Clean up
git bisect reset
```
**Explanation**: Bisect performs binary search through commit history. For `n` commits, it finds the bad commit in ~log2(n) steps. Use `bisect run` with a test script for fully automated regression finding. Always end with `bisect reset` to restore original HEAD.
