---
name: Makefile-Expert
version: 1.0.0
domain: Build Automation
activation_description: Activate when creating or optimizing Makefiles for build automation
purpose: Master GNU Make for efficient build automation, dependency management, and cross-platform builds
---

# Makefile-Expert

## Capabilities
- Define rules with proper targets, prerequisites, and recipes
- Use variables (implicit, explicit, automatic, flavored) for DRY configuration
- Create pattern rules and static pattern rules for generic recipes
- Leverage functions (wildcard, patsubst, foreach, call, shell) for dynamic logic
- Use conditional directives for platform-specific configuration
- Include other Makefiles for modular build structures
- Define phony targets for non-file operations (clean, install, test)
- Use order-only prerequisites for dependency ordering without rebuild
- Implement automatic dependency generation for C/C++ header tracking
- Use VPATH and vpath for multi-directory source management
- Configure parallel execution with job server (-j flag)
- Create portable Makefiles compatible with GNU and BSD make

## Limitations
- Cannot handle complex logic easily (prefer shell scripting within recipes)
- Cannot rebuild only changed parts of a file (whole file rebuild)
- Cannot handle spaces in filenames reliably across all make versions
- Cannot detect changes in compilation flags without manual dependency tracking
- Cannot parallelize within a single recipe line
- Cannot separate compilation from linking automatically without explicit rules

## Required Tools
- GNU Make 4.x (for advanced features)
- C/C++ compiler (if building C/C++ projects)
- shell utilities (echo, rm, mkdir, etc.)

## Execution Workflow

1. Identify project structure and build requirements
2. Define project variables (CC, CFLAGS, LDFLAGS, TARGET)
3. List source files with wildcard or explicit listing
4. Define pattern rules for compiling source to object files
5. Define linking rule for executable or library target
6. Configure automatic dependency generation for header tracking
7. Add phony targets: all, clean, install, test, distclean
8. Implement order-only prerequisites for output directories
9. Add conditional blocks for platform-specific settings
10. Use VPATH/vpath for multi-directory source management
11. Test build with make, verify incremental rebuild
12. Test parallel build with make -j$(nproc)

## Decision Tree

```
What kind of project?
├── C/C++ → Use CC, CFLAGS, automatic dependency generation
├── Multi-language → Define suffix rules or pattern rules for each
├── Documentation → Use pandoc, doxygen, or similar tools
├── Data pipeline → Use shell commands with .PHONY targets
└── Mixed → Multiple pattern rules and target-specific variables

Need portability?
├── Linux only → Use GNU Make features freely
├── Cross-platform → Avoid GNU extensions; test with BSD make
└── Windows → Use gmake on MSYS2/Cygwin or NMake

How complex is the build?
├── Simple (<10 files) → Flat Makefile with explicit rules
├── Medium (10-50 files) → Pattern rules with automatic deps
├── Large (50-500 files) → Recursive make or include-based modular
└── Very large (>500 files) → Consider CMake or other build systems

Need parallel builds?
├── Yes → Use -j flag; ensure rules handle parallel execution
└── No  → Single-threaded, use .NOTPARALLEL if needed
```

## Review Checklist
- [ ] Variable names use UPPER_CASE or lower_case consistently
- [ ] Implicit rules used where appropriate to reduce boilerplate
- [ ] Pattern rules cover all source file types
- [ ] Automatic dependency generation (.d files) implemented
- [ ] .PHONY declared for all non-file targets
- [ ] Order-only prerequisites used for directory creation
- [ ] VPATH or vpath configured for multi-directory sources
- [ ] Conditional blocks handle platform differences
- [ ] Clean target removes all generated files
- [ ] Install target includes proper file placement
- [ ] Parallel-safe (no race conditions in recipes)
- [ ] Default target (first) builds the main project

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Target always rebuilt | Prerequisite newer than target | Check timestamps; verify .d file dependencies |
| Make ignores changes | Not re-reading Makefile | Use `include` with dependency on Makefile itself |
| Recipe fails with error 127 | Command not found | Check PATH; ensure tool is installed |
| Variables not expanding | Missing $ or wrong parentheses | Use `$(VAR)` for variable expansion |
| Pattern rule not matching | Wrong stem or suffix | Verify `%` placement in target and prerequisite |
| include fails | Included file missing | Use `-include` to ignore missing files |
| Parallel build fails | Race condition | Add order-only prerequisites; use .WAIT (GNU Make 4.4+) |
| Out-of-source build fails | Wrong VPATH configuration | Ensure VPATH covers all source directories |

## Best Practices
- Make the first target the default build target (usually `all`)
- Use automatic variables ($@, $<, $^, $*) in pattern rules
- Use `:=` for simply expanded variables (evaluated once)
- Use conditional assignment `?=` for user-overridable defaults
- Use `$(MAKE)` instead of `make` in recipes (respects flags)
- Generate dependency files with `-MMD -MP` compiler flags
- Use `include $(DEPS)` with `-include` for optional dependency files
- Declare all non-file targets as .PHONY to avoid conflicts
- Use `$(wildcard ...)` for flexible source file listing
- Separate compilation flags from link flags (CFLAGS vs LDFLAGS)
- Use `$(RM)` for portable remove command
- Document all public targets with comments

## Anti-Patterns
- Using recursive make for subdirectories (causes build issues)
- Hard-coding compiler paths instead of using CC/CXX variables
- Not declaring phony targets (file named clean breaks build)
- Using `$(shell ...)` excessively (slows down Makefile parsing)
- Writing non-portable shell commands (Linux-specific flags)
- Putting all rules in one huge Makefile without includes
- Not cleaning up generated files in clean target
- Using make for tasks better suited to shell scripts
- Mixing tabs and spaces (tabs required for recipes)
- Ignoring exit codes in recipes (use `|| true` sparingly)

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
