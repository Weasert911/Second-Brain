# GitHub-Actions-Expert: Examples

## Beginner: Simple CI Workflow
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
```
**Explanation**: This workflow runs tests on every push and PR to main. It checks out code, sets up Node.js 18, installs dependencies with `npm ci`, and runs tests. `npm ci` is preferred over `npm install` for CI because it uses the lockfile exactly.

## Intermediate: Matrix Build with Caching
```yaml
name: Matrix Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
      max-parallel: 4

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: Cache npm dependencies
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ matrix.node }}-${{ hashFiles('package-lock.json') }}
          restore-keys: ${{ runner.os }}-node-${{ matrix.node }}-

      - run: npm ci
      - run: npm test
      - run: npm run lint
```
**Explanation**: Matrix build tests on 3 OS × 3 Node versions = 9 combinations. Caching speeds up dependency installation across runs. `max-parallel: 4` prevents overwhelming GitHub's infrastructure.

## Advanced: Multi-Job Workflow with Artifacts and Deployment
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment target'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
        id: tests
      - run: npm run test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.docker-tag.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - name: Set Docker tag
        id: docker-tag
        run: echo "tag=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT
      - name: Build Docker image
        run: docker build -t myapp:${{ steps.docker-tag.outputs.tag }} .
      - uses: actions/upload-artifact@v4
        with:
          name: docker-image
          path: /tmp/docker-image.tar

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment || 'staging' }}
    steps:
      - run: echo "Deploying build ${{ needs.build.outputs.image-tag }}"
```
**Explanation**: This workflow runs lint → test → build → deploy sequentially. Each job depends on the previous. Artifacts pass coverage reports and Docker images between jobs. The deployment uses environment protection rules. `workflow_dispatch` allows manual deployment to staging or production.

## Production: Reusable Workflow for Org-Wide CI
```yaml
# .github/workflows/reusable-ci.yml
name: Reusable CI
on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '18'
      run-lint:
        required: false
        type: boolean
        default: true
    secrets:
      NPM_TOKEN:
        required: true

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          registry-url: 'https://npm.pkg.github.com'
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - if: ${{ inputs.run-lint }}
        run: npm run lint
      - run: npm test
```
```yaml
# In consuming repository's workflow
name: CI
on: [push, pull_request]

jobs:
  ci:
    uses: org/repo/.github/workflows/reusable-ci.yml@main
    with:
      node-version: '20'
      run-lint: true
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
**Explanation**: Reusable workflows prevent duplication across an organization. The parent workflow calls the reusable one with `uses:` referencing the workflow file path. Inputs and secrets are passed explicitly. Changes to the reusable workflow automatically apply to all consumers.
