# AI Agent Architecture Guide

How to structure AI coding agents for complex multi-step development workflows.

## Core Architecture Patterns

### Single-Purpose Agent
Best for: Isolated tasks (refactor this function, write tests for this module)

```
User Prompt → Skill Load → Context Assembly → LLM Call → Output
```

### Multi-Step Workflow Agent
Best for: Complex features spanning multiple files

```
User Prompt
  → Plan Phase (skill decomposes task into steps)
  → Execute Phase (each step loads relevant context)
  → Review Phase (cross-file consistency check)
  → Output
```

### Tool-Chaining Agent
Best for: Build, test, deploy pipelines

```
Code Change → Lint → Test → Build → Deploy
  (each tool feeds output to next)
```

## Memory Strategies

| Strategy | Use Case | Implementation |
|----------|----------|----------------|
| Session Context | Single coding session | Keep full conversation history |
| Summary Memory | Long sessions | Summarize every 10 turns |
| File-Based Memory | Cross-session | Write decisions to `.ai-context.md` |
| Vector Memory | Large codebases | Use embeddings for relevant retrieval |

## Tool Schema Design

Every tool exposed to the agent should have:

```yaml
name: descriptive-name
description: What this tool does (when the agent should call it)
parameters:
  - name: param1
    type: string
    description: What this param does
    required: true
```

### Anti-Patterns
- **Too many tools** — Agent gets confused. Group related tools.
- **Vague descriptions** — Agent won't know when to call them.
- **Missing error handling** — Agent can't recover from failures.

## Recommended Architecture for Development

```
Editor Agent (orchestrator)
  ├── File Reader (context gathering)
  ├── Code Analyzer (lint, type-check, AST parse)
  ├── Code Generator (write new code)
  ├── Test Runner (verify changes)
  └── Git Integrator (commit, branch, PR)
```

Each sub-agent loads the relevant skill from your Professional AI Skills collection.
