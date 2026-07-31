# Makefile-Expert: Snippets

## 1. Pattern Rule for Compilation
```makefile
%.o: %.c
	$(CC) $(CFLAGS) -MMD -MP -c -o $@ $<
```
**When to use**: Generic compilation rule for C source files with automatic dependency generation.

## 2. Automatic Variables
```makefile
program: $(OBJS)
	$(CC) $(LDFLAGS) -o $@ $^ $(LDLIBS)
```
**When to use**: $@ (target), $^ (all prerequisites), $< (first prerequisite) in recipes.

## 3. Wildcard Source Files
```makefile
SRCS = $(wildcard src/*.c src/*.cpp)
OBJS = $(SRCS:.c=.o)
OBJS := $(OBJS:.cpp=.o)
```
**When to use**: Automatically find all source files instead of listing them manually.

## 4. Conditional Platform Handling
```makefile
ifeq ($(OS),Windows_NT)
    RM = del /Q
    EXT = .exe
else
    RM = rm -f
    EXT =
endif
```
**When to use**: Handle platform-specific commands and file extensions.

## 5. Phony Targets
```makefile
.PHONY: all clean test install lint
```
**When to use**: Declare targets that don't represent files to prevent conflicts.

## 6. Order-Only Prerequisites
```makefile
$(OBJS): | $(BUILD_DIR)

$(BUILD_DIR):
	mkdir -p $@
```
**When to use**: Ensure directory exists before compiling, without triggering rebuild on directory timestamp change.

## 7. Automatic Dependency Inclusion
```makefile
DEPS = $(OBJS:.o=.d)
-include $(DEPS)
```
**When to use**: Include generated dependency files for header change tracking.

## 8. Function for File Transformation
```makefile
OBJS = $(patsubst src/%.c, build/%.o, $(SRCS))
```
**When to use**: Transform source paths into build directory paths.

## 9. VPATH for Multi-Directory Sources
```makefile
VPATH = src:lib:include
```
**When to use**: Search multiple directories for source files without specifying full paths.

## 10. Recursive Variable Assignment
```makefile
CFLAGS ?= -Wall -Wextra -O2
```
**When to use**: Set default values that can be overridden from command line.

## 11. Shell Function
```makefile
VERSION := $(shell git describe --tags --always 2>/dev/null || echo "unknown")
```
**When to use**: Capture command output into make variables.

## 12. foreach for Generation
```makefile
MODULES = core utils net
TEST_TARGETS = $(foreach mod, $(MODULES), test-$(mod))

.PHONY: $(TEST_TARGETS)
$(TEST_TARGETS): test-%:
	./tests/test_$*
```
**When to use**: Generate multiple targets from a list of names.

## 13. Static Pattern Rule
```makefile
$(filter %.o, $(OBJS)): %.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<
```
**When to use**: Apply a pattern rule to a specific set of target files.

## 14. archive/library creation
```makefile
libexample.a: $(LIB_OBJS)
	$(AR) rcs $@ $^
```
**When to use**: Create static library archives from compiled objects.

## 15. Debug Build with Variable Override
```makefile
debug: CFLAGS += -g -O0 -DDEBUG
debug: all
```
**When to use**: Target-specific variable overrides for debug builds.
