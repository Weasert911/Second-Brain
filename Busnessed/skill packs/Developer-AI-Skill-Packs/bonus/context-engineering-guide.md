# Context Engineering Guide

Managing AI context windows effectively for consistent, high-quality code generation.

## Why Context Engineering Matters

AI coding assistants have limited context windows. Every token you waste on irrelevant information is a token not available for understanding your code, architecture, and requirements.

## Context Budget Allocation

```
Total Context Window (e.g., 128K tokens)
├── System Instructions / Skills  20%
├── Current Task Description      10%
├── Relevant Code Context         40%
├── Reference Material            20%
└── Conversation History          10%
```

### Rules of Thumb
- **System/skill context** — Load only skills relevant to the current task
- **Code context** — Include the file you're editing + its direct dependencies
- **Reference material** — API docs, schema definitions, type definitions
- **History** — Summarize or prune after 10+ exchanges

## Chunking Strategies

### For Large Files
```
Instead of pasting 2000 lines of a file, use:
1. File summary (what this file does)
2. Key type/function signatures
3. The specific section being modified
```

### For Large Codebases
```
Instead of "understand my whole project", provide:
1. Project architecture diagram (text)
2. Relevant module paths
3. Data flow for the feature in question
4. Existing patterns to follow
```

## Reference Material Organization

### Good Structure
```
Context:
- Type definitions (types.ts)
- API contract (openapi.yaml)
- Database schema (schema.prisma)
- 3 example implementations from the codebase
```

### Bad Structure
```
Context:
- Entire node_modules docs
- 10,000 lines of unrelated code
- 50 conversation turns of debugging a different issue
```

## Skill Selection Strategy

From your Professional AI Skills collection:

| Task | Skills to Load |
|------|----------------|
| Build a React component | React-Expert, Tailwind-CSS-Expert |
| Debug a Rust panic | Rust-Expert, Rust-Testing-Expert |
| Set up CI/CD | GitHub-Actions-Expert, Docker-Expert |
| Create pixel art | Aseprite-Expert, Asset-Organization-Expert |
| Optimize a query | PostgreSQL-Expert, Prisma-Expert |

Load 1-2 skills max per task. Loading all 12 from a pack wastes context.

## Session Management

### When to Start Fresh
- Switching to a completely different task
- Context is >70% full
- The AI starts contradicting earlier responses
- You've been in the same session for 2+ hours

### When to Continue
- Working on the same feature
- Building on previous decisions
- Debugging a chain of related issues

## Context Templates

### New Task Template
```
Project: [name]
Stack: [tech stack]
Task: [what I need to do]
Relevant files: [paths]
Constraints: [versions, style, patterns]
Skill: [loaded skill name]
```

### Bug Fix Template
```
Bug: [symptom]
Expected: [correct behavior]
Actual: [current behavior]
Relevant code: [file:line]
What I've tried: [list]
Skill: [loaded debug skill]
```
