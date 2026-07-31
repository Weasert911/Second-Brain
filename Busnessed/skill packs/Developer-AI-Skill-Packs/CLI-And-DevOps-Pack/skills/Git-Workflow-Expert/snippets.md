# Git-Workflow-Expert: Snippets

## 1. Interactive Rebase Last N Commits
```bash
git rebase -i HEAD~n
```
**When to use**: Clean up the last n commits before pushing. Squash fixup commits, reword messages, reorder commits.

## 2. Cherry-Pick with Preserve Committer
```bash
git cherry-pick -x <commit-hash>
```
**When to use**: Apply a specific commit to the current branch while preserving original author info.

## 3. Stash Specific Files Only
```bash
git stash push -m "description" -- <file1> <file2>
```
**When to use**: Stash only certain files instead of all unstaged changes.

## 4. Recover Deleted Branch from Reflog
```bash
git reflog
git checkout -b <branch-name> <commit-hash>
```
**When to use**: Restore a branch that was accidentally deleted (reflog must still contain the commit).

## 5. Bisect Automated with Script
```bash
git bisect start HEAD v1.0.0
git bisect run npm test
git bisect reset
```
**When to use**: Automatically find regression when a test script can determine good/bad state.

## 6. Soft Reset to Amend
```bash
git reset --soft HEAD~1
git commit --amend
```
**When to use**: Undo last commit but keep changes staged for re-committing.

## 7. Show All Remote Tracking Branches
```bash
git branch -r -v
```
**When to use**: List all remote branches with their latest commit hashes and messages.

## 8. Git Log with Custom Format
```bash
git log --graph --pretty=format:'%C(yellow)%h%Creset %s %Cgreen(%an)%Creset %Cblue(%ar)%Creset' --all
```
**When to use**: Visualize commit history with colored graph, hashes, authors, and relative dates.

## 9. Force Push with Lease (Safe Force Push)
```bash
git push --force-with-lease origin <branch>
```
**When to use**: Overwrite remote branch history only if no one else has pushed to it.

## 10. Create Worktree for Parallel Development
```bash
git worktree add ../<directory> <branch>
```
**When to use**: Work on multiple branches simultaneously without stashing or cloning.

## 11. Sparse Checkout Setup
```bash
git sparse-checkout init --cone
git sparse-checkout set <directory1> <directory2>
```
**When to use**: Check out only specific directories in a monorepo for performance.

## 12. Signed Commit with GPG
```bash
git commit -S -m "feat: implement login"
```
**When to use**: Ensure commit authenticity when project policy requires signed commits.

## 13. Add Submodule with Specific Branch
```bash
git submodule add -b <branch> <repository-url> <path>
```
**When to use**: Embed an external repository as a subdirectory while tracking a specific branch.

## 14. Dry Run Merge to Check for Conflicts
```bash
git merge --no-commit --no-ff <branch>
git merge --abort
```
**When to use**: Preview merge conflicts without actually completing the merge.

## 15. Delete All Local Branches Except Main
```bash
git branch | grep -v "main" | xargs git branch -D
```
**When to use**: Clean up stale local branches after PRs have been merged.
