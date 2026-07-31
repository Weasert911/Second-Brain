# Makefile-Expert: References

## Official Documentation Summaries
- **GNU Make Manual** – Complete reference for all make features
- **GNU Make Functions** – All function calls (wildcard, patsubst, foreach, call, shell)
- **GNU Make Automatic Variables** – $@, $<, $^, $+, $*, $?, $%
- **GNU Make Conditionals** – ifeq, ifneq, ifdef, ifndef directives
- **Portable Makefile Patterns** – Cross-platform make considerations

## Glossary (15+ Terms)
- **Rule** – Target, prerequisites, and recipe for building a file
- **Target** – File to be built (or phony name)
- **Prerequisite** – File that must exist before target is built
- **Recipe** – Shell commands to build the target
- **Pattern rule** – Generic rule using `%` wildcard
- **Static pattern rule** – Rule applied to specific list of targets
- **Automatic variable** – Variable set by make for each rule ($@, $<, $^)
- **Variable flavor** – Recursive (`=`) vs simply expanded (`:=`) vs conditional (`?=`)
- **Phony target** – Target not representing a file (.PHONY)
- **Order-only prerequisite** – Prerequisite that must exist but doesn't trigger rebuild
- **VPATH** – Directory search path for prerequisites
- **MAKEFLAGS** – Recursive make variable containing parent flags
- **MAKECMDGOALS** – List of goals specified on command line
- **Job server** – Parallel execution coordination using token pipes
- **.DELETE_ON_ERROR** – Delete target if recipe fails

## Architecture Notes
- Make uses timestamps to determine if targets need rebuilding
- If prerequisite is newer than target, the recipe runs
- Recursive make (building subdirectories with $(MAKE)) is controversial: may lose dependency information
- Make reads the Makefile, constructs a DAG of dependencies, then executes rules in order

## Key Commands / APIs
- `make all/clean/install/test` – Standard targets
- `make -j$(nproc)` – Parallel build
- `make -n target` – Dry run (print commands without executing)
- `make -d target` – Debug mode (verbose dependency tracing)
- `make -p` – Print make database (variables, rules, implicit rules)
- `$(wildcard pattern)` – Find files matching pattern
- `$(patsubst pattern,replacement,text)` – String substitution
- `$(foreach var,list,text)` – Iterate over list
- `$(call name,arg1,arg2)` – Call user-defined function

## Conventions
- Targets: `all`, `clean`, `install`, `test`, `distclean`, `uninstall`
- Variables: `CC`, `CFLAGS`, `CXX`, `CXXFLAGS`, `LDFLAGS`, `LDLIBS`
- Suffix rules (old style): `.c.o:` pattern rules (new style): `%.o: %.c`
- Phony targets declared before their recipes

## Structure Recommendations
```
project/
├── Makefile               # Root Makefile
├── Makefile.inc           # Shared configuration
├── src/Makefile           # Subdirectory Makefile
├── lib/Makefile           # Library Makefile
├── tests/Makefile         # Test Makefile
└── config.mk              # User configuration (optional, included with -include)
```

## Keyboard Shortcuts
- `Tab` – Important: recipes must be indented with a literal TAB character
- `Ctrl+C` – Interrupt build
- `Ctrl+Z` – Suspend build process
