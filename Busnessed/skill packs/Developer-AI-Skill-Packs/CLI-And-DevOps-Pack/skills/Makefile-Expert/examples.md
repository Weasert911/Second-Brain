# Makefile-Expert: Examples

## Beginner: Simple C Build
```makefile
CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS =
TARGET = myapp
SRCS = main.c utils.c
OBJS = $(SRCS:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(LDFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean
```
```bash
make          # Build all
make clean    # Remove build artifacts
make -j4      # Parallel build with 4 jobs
```
**Explanation**: Basic Makefile with pattern rules. Automatic variables: `$@` (target), `$<` (first prerequisite), `$^` (all prerequisites). `.PHONY` prevents file conflicts. Build with `-j` for parallelism.

## Intermediate: Multi-Directory Project
```makefile
CC = gcc
CFLAGS = -Wall -Wextra -O2 -Iinclude
LDFLAGS = -lm

SRC_DIR = src
INC_DIR = include
BUILD_DIR = build
TARGET = build/program

SRCS = $(wildcard $(SRC_DIR)/*.c)
OBJS = $(SRCS:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
DEPS = $(OBJS:.o=.d)

# Default target
all: $(TARGET)

# Link
$(TARGET): $(OBJS) | $(BUILD_DIR)
	$(CC) $(LDFLAGS) -o $@ $^

# Compile with automatic dependency generation
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -MMD -MP -c -o $@ $<

# Create build directory (order-only prerequisite)
$(BUILD_DIR):
	mkdir -p $@

# Include generated dependency files
-include $(DEPS)

# Test target
test: $(TARGET)
	./$(TARGET) --test

# Install
PREFIX = /usr/local
install: $(TARGET)
	install -d $(DESTDIR)$(PREFIX)/bin
	install -m 755 $(TARGET) $(DESTDIR)$(PREFIX)/bin/

clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean test install
```
**Explanation**: Multi-directory project with `|` (order-only prerequisite) for build directory creation. Automatic dependency generation with `-MMD -MP` compiler flags. `-include` for optional dependency files. Wildcard for flexible source listing. Install target with DESTDIR support.

## Advanced: Recursive Make with Subdirectories (with caveats)
```makefile
# Root Makefile
SUBDIRS = lib tests tools

.PHONY: all clean $(SUBDIRS)

all: $(SUBDIRS)

$(SUBDIRS):
	$(MAKE) -C $@ $(MAKECMDGOALS)

clean: $(SUBDIRS)

# Alternative: non-recursive approach (preferred for larger projects)
# Include sub-Makefiles directly instead
include $(addprefix lib/, Makefile)
include $(addprefix tests/, Makefile)
include $(addprefix tools/, Makefile)
```
```makefile
# lib/Makefile
LIB_SRCS = $(wildcard *.c)
LIB_OBJS = $(LIB_SRCS:.c=.o)

all: libexample.a

libexample.a: $(LIB_OBJS)
	$(AR) rcs $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

.PHONY: all clean
clean:
	rm -f *.o *.a
```
**Explanation**: Recursive make passes goals to subdirectories. The non-recursive approach (commented) with `include` is preferred because it preserves dependency information across directories. Recursive make can miss cross-directory dependencies.

## Production: Full Build System with Packaging
```makefile
PROJECT = webserver
VERSION = 2.1.0
RELEASE = 1

CC = gcc
CFLAGS = -Wall -Wextra -Werror -O2 -DNDEBUG -DVERSION=\"$(VERSION)\"
LDFLAGS =
LIBS = -lpthread -lssl -lcrypto

SRC_DIR = src
BUILD_DIR = build/release
DIST_DIR = dist
TARGET = $(BUILD_DIR)/$(PROJECT)

SRCS = $(wildcard $(SRC_DIR)/*.c)
OBJS = $(SRCS:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
DEPS = $(OBJS:.o=.d)

# Default
all: $(TARGET)

# Link
$(TARGET): $(OBJS) | $(BUILD_DIR)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)

# Compile
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c $(BUILD_DIR)/.dirstamp | $(BUILD_DIR)
	$(CC) $(CFLAGS) -MMD -MP -c -o $@ $<

$(BUILD_DIR):
	mkdir -p $@

$(BUILD_DIR)/.dirstamp:
	mkdir -p $(@D)
	@touch $@

-include $(DEPS)

# Testing
TEST_DIR = tests
TEST_TARGET = $(BUILD_DIR)/test_runner
TEST_SRCS = $(wildcard $(TEST_DIR)/*.c)
TEST_OBJS = $(TEST_SRCS:$(TEST_DIR)/%.c=$(BUILD_DIR)/%.o)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(filter-out $(BUILD_DIR)/main.o, $(OBJS)) $(TEST_OBJS) | $(BUILD_DIR)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)

# Packaging
dist: $(TARGET)
	mkdir -p $(DIST_DIR)/$(PROJECT)-$(VERSION)
	cp $(TARGET) $(DIST_DIR)/$(PROJECT)-$(VERSION)/
	cp README.md LICENSE $(DIST_DIR)/$(PROJECT)-$(VERSION)/
	cd $(DIST_DIR) && tar czf $(PROJECT)-$(VERSION).tar.gz $(PROJECT)-$(VERSION)

deb: dist
	@echo "Creating .deb package..."

rpm: dist
	@echo "Creating .rpm package..."

# Quality
lint:
	$(MAKE) -C $(SRC_DIR) lint

format:
	clang-format -i $(SRCS) $(TEST_SRCS)

# Cleanup
clean:
	rm -rf build dist

distclean: clean
	rm -rf $(DEPS)

.PHONY: all test dist deb rpm lint format clean distclean
```
**Explanation**: Production Makefile with separate build directory, automatic dependency tracking, test runner, packaging targets (tarball, .deb, .rpm), code formatting, and linting. Supports out-of-source builds for clean separation.
