# Makefile-Expert: Checklists

## Pre-Flight Checklist
- [ ] GNU Make 4.x installed (make --version)
- [ ] Compiler and tools in PATH
- [ ] Variable names consistent (CC, CFLAGS, LDFLAGS)
- [ ] Source files listed or wildcarded correctly
- [ ] Build directory structure planned
- [ ] Default target builds the main project
- [ ] Dependency handling strategy chosen (MMD/MP or manual)
- [ ] Target platforms identified for portability

## Implementation Checklist
- [ ] First target is the default (usually all:)
- [ ] Phony targets declared with .PHONY
- [ ] Automatic variables used ($@, $<, $^)
- [ ] Pattern rules reduce duplicate recipes
- [ ] Order-only prerequisites for directory creation
- [ ] Automatic dependency generation with -MMD -MP
- [ ] VPATH or vpath for multi-directory sources
- [ ] Conditional directives for platform differences
- [ ] Functions used for dynamic content (wildcard, patsubst)
- [ ] -include for optional dependency files
- [ ] Clean target removes all generated files
- [ ] Install target supports DESTDIR and PREFIX

## Testing Checklist
- [ ] make all builds without errors
- [ ] make clean removes all artifacts
- [ ] Incremental build rebuilds only changed files
- [ ] make -j$(nproc) parallel build succeeds
- [ ] make test runs all tests
- [ ] make install places files correctly
- [ ] make distclean removes everything including deps
- [ ] VPATH builds work with separate source and build dirs
- [ ] Dependency tracking catches header changes
- [ ] Cross-platform conditionals work on all targets

## Release Checklist
- [ ] Version variable defined and used
- [ ] CHANGELOG updated
- [ ] Distribution archive target tested (make dist)
- [ ] Source tarball includes all necessary files
- [ ] Install target verified on clean system
- [ ] PREFIX and DESTDIR overrides work
- [ ] Uninstall target implemented (if feasible)
- [ ] Release tagged in version control
- [ ] Build tested on all target platforms
- [ ] Makefile reviewed for GNU vs BSD compatibility

## Maintenance Checklist
- [ ] Variable overrides work as expected
- [ ] No obsolete or unused targets
- [ ] Compiler flag warnings reviewed
- [ ] Parallel build stability verified
- [ ] Dependency tracking accuracy confirmed
- [ ] Build time optimized (fast vs full rebuild)
- [ ] Documentation targets produce correct output
- [ ] Makefile style consistent (tabs, spacing)
