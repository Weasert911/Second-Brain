# GitHub-Actions-Expert: Snippets

## 1. Checkout Full Git History
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```
**When to use**: When you need all tags, branches, or full git history for versioning or analysis.

## 2. Cache npm Dependencies
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
    restore-keys: ${{ runner.os }}-npm-
```
**When to use**: Cache npm packages between runs to speed up dependency installation. Adjust path for other package managers.

## 3. Set Output Variable from Step
```yaml
- name: Set output
  id: step_id
  run: echo "key=value" >> $GITHUB_OUTPUT
- name: Use output
  run: echo "${{ steps.step_id.outputs.key }}"
```
**When to use**: Pass values between steps in the same job. Use `$GITHUB_OUTPUT` (not deprecated `set-output`).

## 4. Conditional Step Execution
```yaml
- name: Run only on main branch
  if: github.ref == 'refs/heads/main'
  run: echo "Deploying to production"
```
**When to use**: Conditionally execute steps based on branch, event type, or previous step status.

## 5. Matrix Strategy with Exclude
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [16, 18, 20]
    exclude:
      - os: windows-latest
        node: 16
```
**When to use**: Test multiple combinations but exclude invalid or unsupported configurations.

## 6. Upload Build Artifact
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
```
**When to use**: Persist build outputs beyond workflow run for download or use in other jobs.

## 7. Download Artifact in Another Job
```yaml
- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: ./downloaded
```
**When to use**: Retrieve artifacts created in a previous job (requires `needs:` dependency).

## 8. Reusable Workflow Call
```yaml
jobs:
  ci:
    uses: org/repo/.github/workflows/ci.yml@main
    with:
      node-version: '20'
    secrets:
      token: ${{ secrets.GH_TOKEN }}
```
**When to use**: Invoke a reusable workflow from another repository or the same repo.

## 9. OIDC Authentication to AWS
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/GitHubActions
    aws-region: us-east-1
```
**When to use**: Authenticate to AWS without storing access keys. Requires OIDC provider configured in AWS IAM.

## 10. Concurrency Control
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
**When to use**: Prevent multiple workflow runs on the same branch. Cancel in-progress runs when a new push occurs.

## 11. Manual Trigger with Inputs
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        type: choice
        options: [staging, production]
```
**When to use**: Allow manual triggering of workflows with user-provided parameters.

## 12. Job Matrix Output to Next Job
```yaml
- name: Set matrix output
  run: echo "version=${{ matrix.node }}" >> $GITHUB_OUTPUT
  id: version
# Use with needs.<job_id>.outputs.<output_name>
```
**When to use**: Pass matrix-specific values from one job to dependent jobs.

## 13. Service Containers for Integration Tests
```yaml
jobs:
  test:
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: --health-cmd pg_isready --health-interval 10s
```
**When to use**: Spin up databases or other services for integration testing within a job.

## 14. Cache pip Dependencies
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: ${{ runner.os }}-pip-
```
**When to use**: Speed up Python dependency installation in workflows.

## 15. Workflow Dispatch with Environment URL
```yaml
- name: Set deployment URL
  run: |
    echo "Deployed to https://${{ env.DEPLOY_URL }}"
    echo "deployment_url=https://${{ env.DEPLOY_URL }}" >> $GITHUB_ENV
```
**When to use**: Set environment URLs that appear in GitHub deployments UI after deployment.
