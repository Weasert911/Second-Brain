# GitHub-PR-Expert: Examples

## Beginner: Create PR with GitHub CLI
```bash
# Create a feature branch and push
git checkout -b feature/add-login
git commit -m "feat: add login form"
git push -u origin feature/add-login

# Create PR with title, body, and draft flag
gh pr create --title "feat: add login form" \
  --body "Implements user login form with email and password fields.\nCloses #42" \
  --draft

# Convert to ready when complete
gh pr ready

# View PR status
gh pr status
```
**Explanation**: The `gh pr create` command creates a PR from the current branch. The `--draft` flag makes it a draft PR. Use `gh pr ready` to mark it as ready for review when work is complete.

## Intermediate: Review and Merge Workflow
```bash
# List PRs awaiting review
gh pr list --state open --search "review:required"

# Checkout PR locally for testing
gh pr checkout 123

# Run tests locally
npm test

# Submit review with approval
gh pr review 123 --approve --body "LGTM! Code is clean and well-tested."

# Add labels and milestone
gh pr edit 123 --add-label "enhancement" --milestone "v2.0"

# Enable auto-merge with squash strategy
gh pr merge 123 --auto --squash
```
**Explanation**: Use `gh pr review` to submit reviews from the CLI. The `--auto` flag with `gh pr merge` enables auto-merge, which merges the PR automatically once all conditions are met.

## Advanced: Multi-Repo PR with Branch Protection
```bash
# Create branch from main
git checkout -b feat/api-endpoint

# Make changes across multiple files
git add src/api/endpoint.ts src/api/tests/endpoint.test.ts
git commit -m "feat(api): add user endpoint"

# Push and create PR
git push -u origin feat/api-endpoint

# Create PR with full template
gh pr create \
  --title "feat(api): add user GET endpoint" \
  --body "## Motivation\nNeed to expose user data via API.\n\n## Changes\n- New GET /api/users/:id endpoint\n- Input validation middleware\n- Unit and integration tests\n\n## Testing\n- Manual tested with curl\n- All existing tests pass\n\nCloses #89" \
  --label "api,enhancement" \
  --reviewer "@myorg/backend-team" \
  --project "Sprint 23"

# Wait for checks and auto-merge
gh pr merge 124 --auto --squash --delete-branch
```
**Explanation**: Branch protection requires passing checks and approvals before merge. The `--delete-branch` flag automatically removes the feature branch after merge. The `--project` flag assigns the PR to a GitHub Project.

## Production: Merge Queue with Required Checks
```bash
# After approval, PR is added to merge queue
# GitHub automatically:
# 1. Creates a temporary branch merging PR into base
# 2. Runs all required CI checks on the merged result
# 3. If checks pass, merges the PR
# 4. If checks fail, removes PR from queue

# Check merge queue status
gh pr view 125 --json mergeQueue

# Remove from merge queue if needed
gh pr merge 125 --disable-auto

# Monitor queue position
gh run list --workflow "mergequeue.yml"

# Configure merge queue in repository settings:
# Settings > Branches > Branch protection > Require merge queue
# Settings > Actions > General > Allow GitHub Actions to create and approve pull requests
```
**Explanation**: Merge queues ensure that PRs are tested in combination before merging to main. This prevents the common issue where two separately passing PRs cause a failure when merged together. The queue serializes and tests merges in a specific order.
