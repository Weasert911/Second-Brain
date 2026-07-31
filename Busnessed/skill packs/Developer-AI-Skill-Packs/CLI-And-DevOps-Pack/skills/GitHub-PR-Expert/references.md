# GitHub-PR-Expert: References

## Official Documentation Summaries
- **GitHub Docs: Pull Requests** – Full lifecycle documentation
- **GitHub Docs: About branches** – Branch management and protection
- **GitHub CLI Manual (`gh help pr`)** – CLI commands for PR operations
- **GitHub Docs: CODEOWNERS** – Auto-assignment based on file paths
- **GitHub Docs: Merge queue** – Automated merge ordering

## Glossary (15+ Terms)
- **Pull Request (PR)** – Proposed changes to be merged into a base branch
- **Draft PR** – PR marked as not ready for review/merge
- **Review** – Process of examining code changes before merge
- **Approval** – Reviewer confirming changes are acceptable
- **Changes requested** – Reviewer blocking merge until addressed
- **Status check** – CI/test result associated with a commit
- **Required checks** – Mandatory status checks for merging
- **Branch protection** – Rules that restrict merging to certain branches
- **Merge queue** – System for ordering and testing merges
- **Auto-merge** – Automatic merge when all conditions are met
- **CODEOWNERS** – File specifying default reviewers by path
- **Squash merge** – Combine all commits into one when merging
- **Merge commit** – Preserve all commits with a merge commit
- **Rebase merge** – Reapply commits onto base branch linearly
- **PR template** – Markdown template for PR description

## Architecture Notes
- PRs are Git references (refs/pulls/) under the hood
- GitHub creates a merge ref for testing PR merges
- Status checks are associated with commit SHA, not PR directly
- Branch protection rules are evaluated server-side
- Merge queue creates temporary branches for testing merge order

## Key Commands / APIs
- `gh pr create` – Create PR from command line
- `gh pr view` – View PR details
- `gh pr checkout` – Checkout PR locally
- `gh pr review` – Submit review (approve/request changes/comment)
- `gh pr merge` – Merge PR (squash/rebase/merge)
- `gh pr status` – Show PRs relevant to current user
- `GET /repos/{owner}/{repo}/pulls` – REST API for PRs
- `POST /repos/{owner}/{repo}/pulls/{number}/reviews` – API for reviews

## Conventions
- PR titles: `type(scope): description` matching conventional commits
- Branch names for PRs: `type/issue-number-description`
- Issue linking: `Closes #123`, `Fixes #456`, `Resolves #789`
- Labels: `bug`, `enhancement`, `documentation`, `dependencies`, `breaking-change`

## Structure Recommendations
- `.github/PULL_REQUEST_TEMPLATE.md` – Default PR template
- `.github/CODEOWNERS` – Review ownership rules
- `.github/labels.yml` – Label definitions for automation
- `.github/settings.yml` – Branch protection configuration
- `docs/CONTRIBUTING.md` – PR workflow documentation

## Keyboard Shortcuts
- `Shift + /` – Open keyboard shortcuts dialog in GitHub
- `.` – Open GitHub web editor
- `c` – Create new PR when viewing branches
- `r` – Request review
- `m` – Merge PR (when eligible)
- `s` – Focus search bar
