# How to Add New Skills

## Skill Template

```
new-skill-folder/
├── SKILL.md
├── references.md
├── examples.md
├── templates.md
├── checklists.md
├── snippets.md
└── assets/
```

## SKILL.md Required Sections

Every SKILL.md must have these frontmatter metadata fields:

```yaml
name: "Skill Name"
version: "1.0.0"
domain: "Domain Category"
activation_description: "One-line trigger for AI activation"
purpose: "What this skill enables"
```

Plus these sections:
- **Capabilities** — Bullet list of specific tasks
- **Limitations** — What the skill should NOT do
- **Required Tools** — Software/tools presumed available
- **Execution Workflow** — Step-by-step process
- **Decision Tree** — Branching logic for common scenarios
- **Review Checklist** — Quality gates
- **Troubleshooting** — Common problems and solutions
- **Best Practices** — Professional standards
- **Anti-Patterns** — What to avoid

## File Conventions

- Use Handlebars `{{variable}}` for template placeholders
- One concept per code example in examples.md
- Checklists are ordered lists — most critical items first
- Snippets should be independently useful
- Assets directory is for template binary/text files

## Adding to a Pack

1. Create the skill folder under the pack's `skills/` directory
2. Create all 6 required markdown files
3. Add any template files to `assets/`
4. Update the pack's README.md to include the new skill
5. Update the root CHANGELOG.md
