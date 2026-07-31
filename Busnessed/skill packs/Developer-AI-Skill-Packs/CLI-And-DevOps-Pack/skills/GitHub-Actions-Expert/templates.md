# GitHub-Actions-Expert: Templates

## 1. Standard CI Workflow
```
Name: standard-ci
Description: Standard CI workflow with lint, test, build stages
Template:
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: {{NODE_VERSION}}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
Usage Notes: Replace NODE_VERSION. Add caching for other package managers (pip, maven, gradle).
```

## 2. Docker Build and Push
```
Name: docker-build-push
Description: Build and push Docker image to container registry
Template:
name: Docker
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: {{REGISTRY}}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: {{IMAGE_NAME}}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
Usage Notes: Replace REGISTRY (ghcr.io) and IMAGE_NAME. Requires GITHUB_TOKEN with packages: write permission.
```

## 3. Multi-OS Matrix Test
```
Name: matrix-test
Description: Cross-platform testing with matrix strategy
Template:
name: Matrix Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [{{OS_LIST}}]
        version: [{{VERSION_LIST}}]
    steps:
      - uses: actions/checkout@v4
      - name: Setup language
        uses: actions/setup-{{LANG}}@v4
        with:
          {{LANG}}-version: ${{ matrix.version }}
      - run: {{INSTALL_COMMAND}}
      - run: {{TEST_COMMAND}}
Usage Notes: Set OS_LIST (e.g., ubuntu-latest, windows-latest, macos-latest), VERSION_LIST, language type, and commands.
```

## 4. Deploy with OIDC to Cloud
```
Name: oidc-deploy
Description: Deploy to cloud using OIDC authentication
Template:
name: Deploy
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: {{AWS_REGION}}
      - run: {{DEPLOY_COMMAND}}
Usage Notes: Configure OIDC identity provider in AWS/GCP/Azure first. Set AWS_ROLE_ARN as repository secret. id-token: write permission is required for OIDC token generation.
```

## 5. Scheduled Workflow (CRON)
```
Name: scheduled-workflow
Description: Workflow that runs on a schedule
Template:
name: Scheduled Task
on:
  schedule:
    - cron: '{{CRON_EXPRESSION}}'

jobs:
  scheduled:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: {{SCRIPT_COMMAND}}
Usage Notes: Use crontab.guru to generate CRON expressions. Scheduled workflows run on the default branch only. They are disabled after 60 days of inactivity in the repository.
```

## 6. Reusable Workflow Template
```
Name: reusable-workflow
Description: Reusable workflow for org-wide CI/CD
Template:
name: Reusable {{WORKFLOW_NAME}}
on:
  workflow_call:
    inputs:
      {{INPUT_NAME}}:
        required: {{TRUE/FALSE}}
        type: {{string/boolean/number}}
        default: {{DEFAULT_VALUE}}
    secrets:
      {{SECRET_NAME}}:
        required: {{TRUE/FALSE}}

jobs:
  {{JOB_NAME}}:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Reusable workflow logic here"
Usage Notes: Reusable workflows are called with `uses: org/repo/.github/workflows/file.yml@branch`. Inputs and secrets are passed explicitly. Maximum nesting is 4 levels.
```

## 7. Composite Action
```
Name: composite-action
Description: Custom composite action for reuse across workflows
Template:
name: '{{ACTION_NAME}}'
description: '{{ACTION_DESCRIPTION}}'
inputs:
  {{INPUT_NAME}}:
    description: '{{INPUT_DESCRIPTION}}'
    required: true
runs:
  using: 'composite'
  steps:
    - run: {{COMMAND}}
      shell: bash
      working-directory: ${{ inputs.working-directory }}
Usage Notes: Create in .github/actions/ACTION_NAME/action.yml. Composite actions can use run steps and other actions but cannot use conditionals or continue-on-error at the composite level.
```

## 8. Concurrency-Controlled Deployment
```
Name: concurrency-deploy
Description: Deployment workflow with concurrency control to prevent overlapping
Template:
name: Deploy
on:
  push:
    branches: [{{DEPLOY_BRANCH}}]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: {{TRUE/FALSE}}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: {{DEPLOY_COMMAND}}
Usage Notes: Set cancel-in-progress to true to cancel previous runs, false to queue them. Group by workflow + ref to isolate per-branch concurrency.
