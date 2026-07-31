# Git-Workflow-Expert: Templates

## 1. Commit Message Template (Conventional Commits)
```
Name: conventional-commit
Description: Standard commit message format following conventional commits specification
Template:
{{type}}({{scope}}): {{description}}

{{body}}

{{footer}}
Usage Notes: Types: feat, fix, docs, style, refactor, perf, test, chore, ci. Scope is optional. Footer for BREAKING CHANGE or issue references.
```

## 2. Git Hook: pre-commit Lint Check
```
Name: pre-commit-lint
Description: Run linting before allowing commits
Template:
#!/bin/sh
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|tsx)$')
if [ -n "$STAGED_FILES" ]; then
    npx eslint $STAGED_FILES
    if [ $? -ne 0 ]; then
        echo "ESLint failed on staged files. Fix errors before committing."
        exit 1
    fi
fi
Usage Notes: Save as .git/hooks/pre-commit and make executable (chmod +x). Use --no-verify to bypass.
```

## 3. Branch Naming Convention Policy
```
Name: branch-naming
Description: Git branch naming convention enforcement script
Template:
#!/bin/bash
BRANCH_NAME="$1"
PATTERN="^(feature|bugfix|hotfix|release|chore)\/[A-Z]+-[0-9]+-[a-z0-9-]+$"
if [[ ! $BRANCH_NAME =~ $PATTERN ]]; then
    echo "Branch name '$BRANCH_NAME' does not match convention."
    echo "Expected: type/ISSUE-123-description"
    exit 1
fi
Usage Notes: Use as pre-push hook or in CI to validate branch names before push.
```

## 4. Git Config for Team Consistency
```
Name: git-team-config
Description: Git configuration for consistent team settings
Template:
[core]
    autocrlf = input
    safecrlf = warn
    editor = {{EDITOR}}
[user]
    name = {{USER_NAME}}
    email = {{USER_EMAIL}}
[commit]
    gpgsign = true
[pull]
    rebase = true
[rebase]
    autoSquash = true
[init]
    defaultBranch = main
Usage Notes: Share via .gitconfig template. Each developer adjusts EDITOR, USER_NAME, USER_EMAIL. Enable GPG signing with `git config --global user.signingkey <KEY>`.
```

## 5. .gitignore Template
```
Name: gitignore-template
Description: Comprehensive .gitignore for Node.js/TypeScript projects
Template:
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
.nyc_output/
*.tsbuildinfo
.vscode/
.idea/
*.swp
*.swo
Usage Notes: Add language-specific entries as needed. Commit before adding generated files.
```

## 6. Release Tagging Workflow
```
Name: release-tagging
Description: Script to create signed, annotated release tags
Template:
#!/bin/bash
VERSION="{{VERSION}}"
MESSAGE="Release v$VERSION: {{RELEASE_NAME}}"
git tag -s "v$VERSION" -m "$MESSAGE"
git push origin "v$VERSION"
echo "Created and pushed signed tag v$VERSION"
Usage Notes: Run from main branch after merge. Use semantic versioning (vMAJOR.MINOR.PATCH). Requires GPG key configured.
```

## 7. Submodule Management Script
```
Name: submodule-manager
Description: Initialize and update all submodules to pinned commits
Template:
#!/bin/bash
ACTION="{{ACTION}}"
if [ "$ACTION" = "init" ]; then
    git submodule update --init --recursive
elif [ "$ACTION" = "update" ]; then
    git submodule foreach git pull origin {{BRANCH}}
    git add .
    git commit -m "chore: update submodules"
elif [ "$ACTION" = "status" ]; then
    git submodule status --recursive
fi
Usage Notes: Use init on fresh clone. Use update to pull latest. Always pin submodules to specific commits, not branches.
```

## 8. Stash Workflow Helper
```
Name: stash-helper
Description: Save, list, and restore stashes with descriptions
Template:
#!/bin/bash
case "{{COMMAND}}" in
    save)
        git stash push -m "{{DESCRIPTION}}"
        ;;
    list)
        git stash list
        ;;
    show)
        git stash show -p stash@{$1}
        ;;
    pop)
        git stash pop stash@{$1}
        ;;
    drop)
        git stash drop stash@{$1}
        ;;
    branch)
        git stash branch {{BRANCH_NAME}} stash@{$1}
        ;;
esac
Usage Notes: Always add descriptive messages to stashes. Use stash branch to recover stash changes on a new branch.
