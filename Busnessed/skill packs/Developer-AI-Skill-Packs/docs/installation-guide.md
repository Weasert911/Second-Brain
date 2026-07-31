# Installation Guide

## Option 1: Manual Installation

1. Clone or download this repository
2. Copy the desired pack folder (e.g., `Game-Developer-Pack`) to your project
3. Configure your AI agent to load the skill

## Option 2: Per-Project Installation

Copy only the skills you need into your project's skill directory:

```
your-project/
  .opencode/
    skills/
      Godot-4-Expert/
        SKILL.md
        references.md
        ...
  .cursorrules    # for Cursor
  .claude/        # for Claude Code
```

## Option 3: Global Installation

Place skills in your global agent configuration:

- **Claude Code**: `~/.claude/skills/`
- **OpenCode**: `~/.config/opencode/skills/`
- **Cursor**: `~/.cursor/user/rules/`

## Verification

After installation, ask your AI agent:
> "What skills are you currently using?"

A properly loaded skill will reference its activation description and purpose.
