# AI Coding Best Practices

Code review workflows, security patterns, and testing strategies when working with AI coding assistants.

## Code Review Workflow

### Pre-Review Checklist
- [ ] Code compiles / passes type check
- [ ] Tests pass (existing + new)
- [ ] Linter passes
- [ ] No debug artifacts (console.log, TODO, commented code)

### AI Review Prompts
```
Review this PR for:
1. Logic errors
2. Missing edge cases
3. Security vulnerabilities (XSS, injection, auth bypass)
4. Performance bottlenecks
5. Deviation from project patterns
```

### Human-in-the-Loop
- AI flags potential issues → human makes final call
- AI suggests refactors → human approves scope
- AI generates tests → human verifies correctness

## Security Patterns

### Input Validation
```typescript
// AI-generated code should always validate inputs
function processUserInput(input: string): string {
  if (!isValidFormat(input)) throw new ValidationError();
  return sanitize(input);
}
```

### Authentication Checks
```typescript
// Every protected endpoint should verify auth
async function handler(req: Request, res: Response) {
  const user = await authenticate(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  // proceed
}
```

### Secrets Management
- Never hardcode API keys, tokens, or passwords
- Use environment variables or secret managers
- AI should flag hardcoded secrets in review

## Testing Strategies

### Test Pyramid for AI-Generated Code
```
  ╱╲
 ╱ E2E ╲        Few — critical user flows
╱────────╲
╱ Integration ╲  Some — API boundaries, database
╱──────────────╲
╱   Unit Tests   ╲ Many — individual functions, components
──────────────────
```

### AI Test Generation Prompt
```
Generate tests for [function] using [framework].
Cover:
- Normal operation
- Boundary values
- Error inputs
- State transitions
Each test should be independent and descriptive.
```

## Code Quality Gates

| Gate | Tool | AI Role |
|------|------|---------|
| Type Check | TypeScript, mypy, rustc | Generate type-correct code |
| Lint | ESLint, ruff, clippy | Follow project lint rules |
| Format | Prettier, rustfmt, black | Match project format |
| Test | Jest, pytest, cargo test | Generate passing tests |
| Coverage | c8, coverage.py, tarpaulin | Target untested paths |

## Avoiding Common AI Mistakes

1. **Hallucinated APIs** — Verify all function names and imports exist
2. **Wrong versions** — Check if code targets the project's framework version
3. **Incomplete implementations** — Stub functions left as `TODO()`
4. **Over-engineering** — Simple solutions beat clever ones
5. **Context drift** — Long sessions may produce inconsistent code

## Project Convention Enforcement

When starting AI work on a project, provide:
- `.editorconfig` or equivalent
- Existing file examples
- Lint/format config
- Architecture decision records (ADRs)
