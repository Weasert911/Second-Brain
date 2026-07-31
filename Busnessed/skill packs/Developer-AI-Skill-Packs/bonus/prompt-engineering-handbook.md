# Prompt Engineering Handbook

Techniques for getting better code generation, debugging, and architecture results from AI coding assistants.

## Core Principles

1. **Be specific** — "Write a React hook" is vague. "Write a `useWebSocket` hook that auto-reconnects with exponential backoff" is precise.
2. **Provide context** — Share relevant type definitions, existing patterns, and constraints.
3. **Set constraints** — "No external dependencies", "Must support Node 18+", "Use functional style".
4. **Iterate** — First response is rarely perfect. Refine with follow-up prompts.

## Prompt Patterns for Code

### The Specification Pattern
```
Task: [one-sentence description]
Constraints: [tech stack, versions, dependencies]
Input: [what data goes in]
Output: [what comes out, format]
Edge cases: [null, empty, error states]
Examples: [input → expected output]
```

### The Review Pattern
```
Review this code for:
1. Security vulnerabilities
2. Performance issues
3. Edge case handling
4. Adherence to [convention/style guide]
```

### The Debug Pattern
```
Bug: [what happens vs what should happen]
Code: [relevant code]
Attempts: [what I've tried]
Environment: [OS, versions, dependencies]
```

## Code-Specific Techniques

### For Refactoring
```
Refactor [function/file] to:
- Reduce cyclomatic complexity
- Improve testability
- Follow [pattern] architecture
- Keep the same public API
```

### For Test Generation
```
Generate tests for [component/function].
Cover:
- Happy path
- Error states
- Edge cases
- [Framework] best practices
Use [mocking strategy].
```

### For Documentation
```
Generate documentation for [module].
Include:
- Purpose and responsibilities
- API reference
- Usage examples
- Common pitfalls
```

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| "Fix this" | "Fix the null reference in line 42" |
| "Make it better" | "Optimize this query to use an index" |
| "Write code" | "Write a function that validates email format" |
| Multiple requests in one prompt | One clear request per prompt |

## Context Window Management

- Put the most critical context **last** (recency bias in most models)
- Summarize long files before asking for changes
- Use the skill files in this collection as structured context
- Prune irrelevant conversation history
