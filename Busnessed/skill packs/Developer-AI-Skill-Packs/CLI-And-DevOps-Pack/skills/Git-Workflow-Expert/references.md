# Git-Workflow-Expert: References

## Official Documentation Summaries
- **git help <command>** – Built-in man pages for every git command
- **git config --help** – All configuration options documented
- **Pro Git Book (git-scm.com)** – Comprehensive reference for all Git concepts
- **git hooks --help (githooks(5))** – Hook types, trigger points, and return codes
- **gitrevisions(7)** – Specifying revisions, ranges, and refspecs

## Glossary (15+ Terms)
- **HEAD** – Pointer to the current commit/branch checkout
- **ORIG_HEAD** – Backup of HEAD before dangerous operations (merge, rebase, reset)
- **FETCH_HEAD** – References fetched from remote branches
- **Reflog** – Local record of HEAD movements; recovery tool for lost commits
- **Fast-forward merge** – Linear merge where target branch has not diverged
- **Three-way merge** – Merge using two branch tips and their common ancestor
- **Cherry-pick** – Apply specific commits from one branch to another
- **Interactive rebase** – Rewrite, reorder, squash, or edit commits in history
- **Detached HEAD** – State where HEAD points to a commit instead of a branch
- **Worktree** – Additional working tree attached to same repository
- **Submodule** – Embedded repository as a subdirectory with pinned commit
- **Subtree** – Merged external repository into subdirectory with history
- **Bisect** – Binary search to find the commit that introduced a bug
- **Sparse checkout** – Checkout only a subset of files from the repository
- **Partial clone** – Clone without downloading all objects; fetch on demand

## Architecture Notes
- Git is a content-addressable filesystem; objects are SHA-1 hashed
- Three trees: working directory, staging area (index), repository (HEAD)
- Objects: blob (file), tree (directory), commit (snapshot), tag (annotation)
- Refs: branches, tags, HEAD, remote tracking (refs/heads, refs/tags, refs/remotes)
- Packfiles compress loose objects for efficiency

## Key Commands / APIs
- `git init/clone/remote` – Repository setup
- `git add/reset/restore` – Staging area manipulation
- `git commit/tag/notes` – Creating history
- `git branch/checkout/switch/restore` – Branch management
- `git merge/rebase/cherry-pick` – History integration
- `git log/show/diff/blame` – Inspection
- `git stash/stash pop/stash drop` – Temporary saving
- `git bisect start/bad/good/reset` – Regression finding
- `git reflog show/expire/delete` – Reflog management
- `git gc/fsck/prune/repack` – Maintenance

## Conventions
- **Branch naming**: `feature/ISSUE-42-add-login`, `bugfix/ISSUE-71-fix-crash`, `hotfix/1.2.3-security-patch`
- **Commit messages**: `<type>(<scope>): <description>\n\n<body>\n\n<footer>`
- **Types**: feat, fix, docs, style, refactor, perf, test, chore, ci
- **Tag format**: vMAJOR.MINOR.PATCH (e.g., v1.2.3)

## Structure Recommendations
- `.gitignore` at repository root for all generated/IDE files
- `.gitattributes` for line endings and diff configuration
- `hooks/` directory with example hooks (reference: `.git/hooks/`)
- `CONTRIBUTING.md` documenting workflow and conventions
- `.github/` or `docs/` for templates and policies

## Keyboard Shortcuts
- `Tab` – Auto-complete branches, files, commands in git bash
- `q` – Quit pager (git log, git diff)
- `/` – Search within pager output
- `n`/`N` – Next/previous search match in pager
- `Ctrl+C` – Cancel current operation
