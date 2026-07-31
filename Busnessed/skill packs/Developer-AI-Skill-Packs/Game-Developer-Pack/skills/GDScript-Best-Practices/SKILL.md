---
name: "GDScript Best Practices"
version: "1.0.0"
domain: "Game Development"
activation_description: "GDScript static typing and idiomatic patterns"
purpose: "Make AI proficient in GDScript static typing, code organization, signal patterns, memory management, and GDScript testing"
---

## Capabilities
- Write type-safe GDScript with full static type annotations
- Organize code using idiomatic folder and file structures
- Implement clean signal patterns for decoupled communication
- Manage memory with proper node lifecycle and reference counting
- Handle errors with robust try/catch and validation patterns
- Write unit tests using Gut or built-in testing framework
- Document code with standardized comment conventions
- Apply composition over inheritance patterns
- Use enums and constants effectively

## Limitations
- Does not cover Godot engine architecture (see Godot 4 Expert)
- Does not cover shader programming
- Does not cover C# bindings
- Does not cover GDScript 1.0 (Godot 3.x) syntax

## Required Tools
- Godot 4.2+ with GDScript
- Gut addon (for unit testing, optional)
- Text editor with GDScript linting

## Execution Workflow
1. Establish type system - add static types to all variables, parameters, returns
2. Structure scripts - one class per file, PascalCase for classes
3. Organize project - consistent folder hierarchy matching scene structure
4. Implement signals - prefer code connections, typed signals
5. Manage memory - queue_free(), reference counting, weak references
6. Handle errors - validate inputs, use assert for invariants
7. Write tests - unit test non-Godot logic, integration test scenes
8. Document - use ## for sections, inline comments for complex logic

## Best Practices
- Always use `: Type` annotation for variables, parameters, and return types
- Use `Variant` only when absolutely necessary
- Prefer `@onready var` over `get_node()` calls
- Use `const` for immutable values, `enum` for state sets
- Use `Node.is_inside_tree()` before modifying scene-dependent state
- Prefer `Dictionary.get(key, default)` over direct access
- Use `match` statement over chained `if/elif`
- Use `for` loops with typed iteration variables
- Prefer `Callable` references over string method names

## Anti-Patterns
- Using `var` without type annotation
- String-based method calls with `call()`
- Dynamic type manipulation with `pool_*` variable types
- Using `get_node()` repeatedly instead of caching with @onready
- Global mutable state in autoloads without signals
- Deep inheritance hierarchies (prefer composition)
- Using `yield()` instead of `await/async`

## References
- See references.md for full GDScript type system and syntax reference
- See examples.md for real-world script examples
- See templates.md for reusable script templates
- See checklists.md for code review checklist
- See snippets.md for common code patterns
