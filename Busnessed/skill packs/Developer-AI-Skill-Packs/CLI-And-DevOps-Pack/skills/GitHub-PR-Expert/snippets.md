# GitHub-PR-Expert: Snippets

## 1. Create PR from Current Branch
```bash
gh pr create --title "feat: add feature" --body "Description" --label "enhancement"
```
**When to use**: Quickly create a PR from the command line without using the GitHub UI.

## 2. Checkout PR Locally
```bash
gh pr checkout <number>
```
**When to use**: Fetch and checkout a PR branch locally for testing or modification.

## 3. View PR Details in Terminal
```bash
gh pr view <number> --json title,body,state,mergeable,additions,deletions
```
**When to use**: Inspect PR metadata without opening a browser.

## 4. Submit PR Approval
```bash
gh pr review <number> --approve --body "LGTM"
```
**When to use**: Approve a PR from the CLI after local review.

## 5. Request Changes on PR
```bash
gh pr review <number> --request-changes --body "Please fix the typo in line 42"
```
**When to use**: Request changes when review identifies issues that need fixing.

## 6. Enable Auto-Merge
```bash
gh pr merge <number> --auto --squash
```
**When to use**: Enable automatic merging once all required checks pass.

## 7. List PRs Requiring My Review
```bash
gh pr list --state open --search "review-required:@me"
```
**When to use**: See all PRs that need your review across the organization.

## 8. Close PR Without Merging
```bash
gh pr close <number> --comment "Superseded by PR #456"
```
**When to use**: Close a PR that is no longer needed, with an explanation.

## 9. Add Label to PR
```bash
gh pr edit <number> --add-label "bug,priority-high"
```
**When to use**: Update PR labels for better organization and filtering.

## 10. Link Issue in PR Description
```bash
gh pr edit <number> --body "Closes #42"
```
**When to use**: Update PR description to link to an issue after PR creation.

## 11. View CI Status for PR
```bash
gh pr checks <number> --interval 10 --watch
```
**When to use**: Monitor CI checks in real-time from the terminal.

## 12. Rebase PR Branch onto Base
```bash
gh pr checkout <number> && git rebase main && git push --force-with-lease
```
**When to use**: Update a PR branch with latest base branch changes.

## 13. List All Open PRs with Details
```bash
gh pr list --state open --json number,title,author,headRefName,createdAt --limit 50
```
**When to use**: Get an overview of all open PRs for project management.

## 14. Create PR with Template from File
```bash
gh pr create --title "feat: new feature" --body-file .github/PULL_REQUEST_TEMPLATE.md
```
**When to use**: Use a PR template file to pre-fill the PR description.

## 15. Diff of PR Changes
```bash
gh pr diff <number> --color always | less -R
```
**When to use**: View the full diff of a PR in the terminal with colored output.
