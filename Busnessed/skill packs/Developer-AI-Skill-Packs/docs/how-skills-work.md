# How Skills Work

AI skill packs are structured knowledge modules that make AI coding agents domain-experts. Each skill is a folder containing markdown files that encode professional workflows, standards, and methodologies.

## Loading Mechanism

Different AI agents load skills differently:

| Agent | Mechanism |
|-------|-----------|
| **Claude Code** | Reference via `--skill` flag or `.claude/skills/` directory |
| **OpenCode** | Place in `.opencode/skills/` or reference with `@skill` in prompts |
| **Cursor** | Include in `.cursorrules` or project-level rules |
| **Zed AI** | Place in `.zed/skills/` directory |
| **VS Code AI** | Configure in `.vscode/settings.json` or workspace settings |

## Skill Activation

When a skill is loaded, the AI agent reads SKILL.md first. This file contains:
- **Metadata** — Name, version, domain, dependencies
- **Activation description** — One-line trigger for when the AI should activate
- **Purpose** — What the skill enables the AI to do
- **Capabilities** — Specific tasks the AI can perform
- **Workflow** — Step-by-step process for common tasks

The AI then references the additional files as needed:
- `references.md` for technical documentation
- `examples.md` for code patterns
- `templates.md` for reusable structures
- `checklists.md` for quality gates
- `snippets.md` for quick code reuse

## Skill Priority

When multiple skills are loaded, the AI uses all of them. Skills are additive — they don't conflict. If two skills cover the same topic, the more specific skill takes priority.
