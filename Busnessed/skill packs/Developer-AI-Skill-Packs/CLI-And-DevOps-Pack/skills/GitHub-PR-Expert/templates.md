# GitHub-PR-Expert: Templates

## 1. Pull Request Template (Default)
```
Name: default-pr-template
Description: Standard PR template with motivation, changes, and testing sections
Template:
## Motivation
{{MOTIVATION}}

## Changes
{{CHANGES}}

## Testing
{{TESTING_NOTES}}

## Related Issues
Closes #{{ISSUE_NUMBER}}

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All existing tests pass
Usage Notes: Save as .github/PULL_REQUEST_TEMPLATE.md. GitHub auto-fills into new PR descriptions.
```

## 2. Bug Fix PR Template
```
Name: bugfix-pr-template
Description: Template specifically for bug fix pull requests
Template:
## Bug Description
{{BUG_DESCRIPTION}}

## Root Cause
{{ROOT_CAUSE}}

## Fix
{{FIX_DESCRIPTION}}

## Reproduction Steps
1. {{STEP_1}}
2. {{STEP_2}}

## Regression Risk
{{LOW / MEDIUM / HIGH}}

## Testing
{{TESTING_NOTES}}

Fixes #{{ISSUE_NUMBER}}
Usage Notes: Use for all bug fix PRs. Include reproduction steps to confirm the fix.
```

## 3. Release PR Template
```
Name: release-pr-template
Description: Template for release branch PRs
Template:
## Release v{{VERSION}}

### New Features
{{FEATURES}}

### Bug Fixes
{{BUG_FIXES}}

### Breaking Changes
{{BREAKING_CHANGES}}

### Changelog
See CHANGELOG.md for full details.

## Checklist
- [ ] Version bumped in package.json/manifest
- [ ] CHANGELOG.md updated
- [ ] Release notes reviewed
- [ ] All tests pass on release branch
Usage Notes: Used for release branches in GitFlow workflow. Tag after merge.
```

## 4. CODEOWNERS Configuration
```
Name: codeowners-config
Description: Auto-assign reviewers based on file paths
Template:
# Global owners
* @{{ORG}}/{{DEFAULT_TEAM}}

# Backend ownership
/api/ @{{ORG}}/backend-team
/src/controllers/ @{{ORG}}/backend-team

# Frontend ownership
/src/components/ @{{ORG}}/frontend-team
/src/styles/ @{{ORG}}/frontend-team

# DevOps ownership
/.github/ @{{ORG}}/devops-team
/Dockerfile @{{ORG}}/devops-team
/docker-compose.yml @{{ORG}}/devops-team

# Documentation
/docs/ @{{ORG}}/docs-team
*.md @{{ORG}}/docs-team
Usage Notes: Save as .github/CODEOWNERS. Teams are auto-suggested. Use @username for individuals.
```

## 5. Branch Protection Rules Configuration
```
Name: branch-protection-config
Description: Settings for branch protection via GitHub API or settings.yml
Template:
branches:
  - name: {{BRANCH_NAME}}
    protection:
      required_status_checks:
        strict: true
        contexts:
          - {{CHECK_NAME_1}}
          - {{CHECK_NAME_2}}
      enforce_admins: true
      required_pull_request_reviews:
        required_approving_review_count: {{COUNT}}
        dismiss_stale_reviews: true
        require_code_owner_reviews: true
      restrictions: null
Usage Notes: Apply via .github/settings.yml with probot/settings or directly in GitHub UI.
```

## 6. GitHub CLI PR Creation Script
```
Name: gh-pr-creator
Description: Script to create PRs with consistent formatting
Template:
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
TITLE="{{TITLE_PREFIX}}${BRANCH##*/}"
BODY=$(cat <<EOF
## Description
{{DESCRIPTION}}

## Related Issues
Closes #{{ISSUE_NUMBER}}

## Checklist
- [ ] Tests pass
- [ ] Code reviewed
EOF
)
gh pr create --title "$TITLE" --body "$BODY" --label "{{LABEL}}" ${{DRY_RUN:+--dry-run}}
Usage Notes: Replace DRY_RUN with --dry-run for testing. Customize TITLE_PREFIX for repo conventions.
```

## 7. PR Review Reminder Script
```
Name: pr-review-reminder
Description: Script to remind reviewers about pending PRs
Template:
#!/bin/bash
echo "Pending PRs requiring your review:"
gh pr list --state open --search "review-requested:{{GITHUB_USERNAME}}" \
  --json title,url,author,createdAt \
  --template '{{range .}}# {{.title}} by {{.author.login}} ({{.createdAt}})
{{.url}}

{{end}}'
if [ $? -eq 0 ]; then
    echo "Review status checked at $(date)"
fi
Usage Notes: Run as cron job or manually. Replace GITHUB_USERNAME with actual username.
```

## 8. Auto-Merge Configuration Helper
```
Name: auto-merge-config
Description: Enable auto-merge on approved PRs with passing checks
Template:
#!/bin/bash
PR_NUMBER="$1"
STRATEGY="${2:-squash}"  # squash, rebase, merge

if [ -z "$PR_NUMBER" ]; then
    echo "Usage: $0 <PR_NUMBER> [strategy]"
    exit 1
fi

gh pr merge "$PR_NUMBER" --auto --"$STRATEGY"
echo "Auto-merge enabled for PR #$PR_NUMBER with $STRATEGY strategy"
Usage Notes: Run after PR is approved and all checks pass. The --auto flag defers merge until conditions are met.
