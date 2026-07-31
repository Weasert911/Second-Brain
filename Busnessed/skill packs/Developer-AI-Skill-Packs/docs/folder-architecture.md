# Folder Architecture

```
Developer-AI-Skill-Packs/           # Master Bundle
├── LICENSE                         # MIT License
├── README.md                       # Main entry point
├── CHANGELOG.md                    # Version history
│
├── bonus/                          # Exclusive Master Bundle bonuses
│   ├── ai-agent-architecture-guide.md
│   ├── prompt-engineering-handbook.md
│   ├── ai-coding-best-practices.md
│   ├── context-engineering-guide.md
│   └── mcp-integration-examples.md
│
├── docs/                           # Documentation
│   ├── how-skills-work.md
│   ├── installation-guide.md
│   ├── customization-guide.md
│   ├── adding-new-skills.md
│   ├── selling-skill-packs.md
│   ├── versioning-strategy.md
│   └── folder-architecture.md
│
├── Game-Developer-Pack/            # Pack 1 — $19
│   ├── README.md
│   ├── LICENSE
│   ├── CHANGELOG.md
│   └── skills/
│       ├── Godot-4-Expert/
│       │   ├── SKILL.md
│       │   ├── references.md
│       │   ├── examples.md
│       │   ├── templates.md
│       │   ├── checklists.md
│       │   ├── snippets.md
│       │   └── assets/
│       ├── GDScript-Best-Practices/
│       └── ... (12 skills total)
│
├── Web-Developer-Pack/             # Pack 2 — $19
├── Rust-Developer-Pack/            # Pack 3 — $19
├── CLI-And-DevOps-Pack/            # Pack 4 — $19
└── Creator-Tools-Pack/             # Pack 5 — $19
```

## File Purposes

| File | Purpose |
|------|---------|
| **SKILL.md** | Main activation file — metadata, workflow, decision tree |
| **references.md** | Technical reference — docs, APIs, conventions |
| **examples.md** | Code examples — beginner to production |
| **templates.md** | Reusable templates with `{{variable}}` placeholders |
| **checklists.md** | Quality gates — pre-flight, testing, release |
| **snippets.md** | Copy-paste ready code snippets |
| **assets/** | Template files (.gd, .tsx, .rs, .sh, .blend, .kra, etc.) |

## Pack Independence

Each pack is fully self-contained. Skills reference their own files only. No cross-pack dependencies. This allows customers to purchase and use packs individually.

## Master Bundle Exclusives

The `bonus/` folder is only included in the Master Bundle. It contains 5 additional guides that enhance the utility of all skill packs.
