# How to Customize Skills

## Editing SKILL.md

Modify the `activation_description`, `workflow`, `decision_tree`, or `examples` sections to match your team's practices.

## Adding Your Standards

Append your team's coding standards to `references.md`:

```markdown
## Team Conventions
- Use PascalCase for component files
- Prefix all database tables with `app_`
- Use UTC timestamps everywhere
```

## Adding Your Templates

Add your project templates to `templates.md`. Use Handlebars `{{variable}}` for placeholders.

## Adjusting Checklists

Edit `checklists.md` to match your QA process. Remove irrelevant items. Add team-specific checks.

## Version Tracking

Update the `version` field in SKILL.md metadata when you customize. This helps track which version of a skill is deployed.

## Using Variables

Templates use Handlebars-style `{{variable}}` placeholders. Replace these with your project values before use.
