---
name: GitHub-PR-Expert
version: 1.0.0
domain: Code Collaboration
activation_description: Activate when creating, reviewing, or managing GitHub pull requests
purpose: Master GitHub pull request workflows including creation, review, automation, and administration
---

# GitHub-PR-Expert

## Capabilities
- Create and manage pull requests through full lifecycle (draft to merged)
- Configure and use PR templates for consistent descriptions
- Set up CODEOWNERS for automatic review assignments
- Implement branch protection rules with required status checks
- Configure merge queues for automated merge ordering
- Use auto-merge with required checks passing
- Choose appropriate merge strategy (squash, merge commit, rebase merge)
- Navigate PR review process with comments, suggestions, and change requests
- Link PRs to issues using keywords (closes, fixes, resolves)
- Manage milestones, labels, and project boards for PRs
- Use GitHub CLI (`gh`) for PR operations from terminal
- Integrate CI with PR checks and status reporting

## Limitations
- Cannot bypass repository-level branch protection rules
- Cannot resolve code review conversations without reviewer dismissal
- Cannot customize GitHub UI beyond available configuration options
- Cannot override organization-level policies enforced by GitHub
- Cannot enforce signed commits if not configured at repo/org level
- Cannot modify PR title/description after merge without editing merge commit

## Required Tools
- GitHub account with repository access
- GitHub CLI (`gh`)
- Git 2.x+
- Web browser for GitHub UI

## Execution Workflow

1. Verify branch protection rules and required status checks
2. Create feature branch from correct base branch
3. Make commits following conventional commits format
4. Push branch and open PR using template or `gh pr create`
5. Fill PR description linking to issues, describing changes, and testing notes
6. Add reviewers via CODEOWNERS auto-assignment or manual selection
7. Apply appropriate labels (bug, enhancement, documentation)
8. Set milestone if project uses milestones
9. Respond to review feedback with commits or comments
10. Ensure all required status checks pass (CI, lint, test)
11. Select merge strategy and merge when approved (or use auto-merge)
12. Delete feature branch after merge (automatic or manual)
13. Close linked issues if they should be resolved
14. Update project boards if using GitHub Projects

## Decision Tree

```
Is this a work in progress?
├── Yes → Open as Draft PR (prevent accidental merge)
├── No  → Open as ready PR
│   └── Need feedback early?
│       └── Yes → Draft PR with [WIP] prefix

What merge strategy?
├── Squash merge → Clean single commit for simple features
├── Merge commit → Preserve full history for complex features
└── Rebase merge → Linear history without merge commits

Do checks pass?
├── Yes → Proceed to merge
├── No  → Investigate failures
│   ├── Test failure → Fix code
│   └── Lint failure → Fix formatting

Need multiple reviewers?
├── Yes → Use CODEOWNERS file for auto-assignment
├── No  → Manual reviewer selection

PR needs changes requested?
├── Address feedback with new commits
├── Request re-review when done
└── Dismiss stale reviews if appropriate (maintainer only)

Auto-merge enabled?
├── Yes → PR merges automatically when all conditions met
└── No  → Manual merge after approval
```

## Review Checklist
- [ ] PR title follows conventional commits format
- [ ] Description includes motivation, approach, testing notes
- [ ] Related issues linked (Closes #123)
- [ ] All status checks passing
- [ ] At least one approval from required reviewer
- [ ] No merge conflicts with base branch
- [ ] Changes covered by tests
- [ ] No unnecessary files changed (whitespace, formatting)
- [ ] Documentation updated if API/behavior changed
- [ ] Changelog entry added if user-facing change
- [ ] Branch up to date with base branch
- [ ] Commit history is clean and logical

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Checks not running | Workflow not triggered | Close/reopen PR or push new commit |
| Merge blocked by protection | Required checks failing or missing | Fix checks or request bypass from admin |
| Review requested but no response | Reviewers busy | Use `gh pr ready --undo` to convert to draft or request new reviewer |
| Merge conflict | Base branch diverged | Rebase or merge base into feature branch |
| Auto-merge not appearing | No branch protection or merge queue | Enable branch protection with required checks |
| PR shows "This branch is out-of-date" | Behind base branch | Update branch from GitHub UI or rebase locally |
| Draft PR merged accidentally | Protection bypass | Disable merge for draft PRs via branch protection |
| Commit not linked to PR | Commit pushed outside PR | Reference PR number in commit message |

## Best Practices
- Keep PRs small and focused (under 400 lines preferred)
- Write descriptive PR titles that explain the change at a glance
- Use PR templates to ensure consistent information
- Request reviews from people familiar with the code area
- Respond to review comments promptly and professionally
- Rebase feature branch before PR to maintain clean history
- Enable auto-merge for trivial changes after checks pass
- Use draft PRs for early feedback before finalizing
- Link every PR to at least one issue
- Delete branch after merge to keep repository clean
- Use squash merge for most feature branches
- Set up merge queue for busy repositories

## Anti-Patterns
- Opening large PRs with hundreds of file changes
- Merging without required approvals
- Ignoring review feedback and merging regardless
- Leaving PRs open for weeks without updates
- Including unrelated changes in the same PR
- Writing vague PR descriptions ("fix stuff", "updates")
- Merging with failing required checks
- Using force push on shared PR branch after reviews started
- Closing PRs without merging or explaining why
- Assigning too many reviewers (analysis paralysis)
- Merging PRs without updating the base branch first

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
