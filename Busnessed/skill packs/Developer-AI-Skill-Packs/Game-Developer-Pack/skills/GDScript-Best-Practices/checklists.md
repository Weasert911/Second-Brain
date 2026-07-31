# GDScript Best Practices - Checklists

## Code Review Checklist

### Typing
- [ ] All variables have explicit type annotations (`: int`, `: String`, etc.)
- [ ] All function parameters have type annotations
- [ ] All function return types are annotated (`-> void`, `-> int`)
- [ ] `Variant` used only when truly necessary
- [ ] `Array[Type]` used instead of untyped `Array`
- [ ] `Dictionary[KeyType, ValueType]` used for typed dicts

### Naming
- [ ] Variables: `snake_case`
- [ ] Constants: `ALL_CAPS`
- [ ] Functions: `snake_case`
- [ ] Nodes: `PascalCase`
- [ ] Signals: `snake_case`
- [ ] Files: `snake_case.gd`
- [ ] Private members prefixed with `_`

### Signals
- [ ] Signals connected via code, not editor
- [ ] Typed signals with parameter annotations
- [ ] Signal connections use Callable, not strings
- [ ] Disconnected in `_exit_tree()` if needed

### Node References
- [ ] `@onready var` used instead of `get_node()` in `_ready()`
- [ ] Node references cached, not fetched every frame
- [ ] `is_instance_valid()` checks before using freed nodes

### Performance
- [ ] No `load()` calls in `_process()` or hot paths
- [ ] No allocations in `_process()` / `_physics_process()`
- [ ] Groups queried once, not every frame
- [ ] Strings not concatenated in hot paths

### Best Practices
- [ ] `match` used over long `if/elif` chains
- [ ] Enums used for states instead of strings
- [ ] Constants for magic numbers
- [ ] `assert()` for invariant validation
- [ ] `Dictionary.get(key, default)` for safe access
- [ ] Resources used for data-driven design

## Project Setup Checklist
- [ ] Consistent folder structure
- [ ] One class per file
- [ ] Autoloads registered in project settings
- [ ] Custom classes registered (class_name)

## Testing Checklist
- [ ] Unit tests for core mechanics
- [ ] Edge case tests (zero, negative, overflow)
- [ ] Signal emission tested
- [ ] Error handling tested

## Maintenance Checklist
- [ ] No unused imports
- [ ] No orphaned signal connections
- [ ] Deprecated APIs replaced
- [ ] Warnings and errors cleared
