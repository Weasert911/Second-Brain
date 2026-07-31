# Makefile-Expert: Templates

## 1. Generic C/C++ Project Template
```
Name: generic-cpp
Description: Standard C/C++ project Makefile
Template:
CC = {{CC}}
CXX = {{CXX}}
CFLAGS = {{CFLAGS}}
CXXFLAGS = {{CXXFLAGS}}
LDFLAGS = {{LDFLAGS}}
LDLIBS = {{LDLIBS}}

SRC_DIR = src
BUILD_DIR = build
TARGET = $(BUILD_DIR)/{{TARGET_NAME}}

SRCS = $(wildcard $(SRC_DIR)/*.cpp)
OBJS = $(SRCS:$(SRC_DIR)/%.cpp=$(BUILD_DIR)/%.o)
DEPS = $(OBJS:.o=.d)

all: $(TARGET)

$(TARGET): $(OBJS) | $(BUILD_DIR)
	$(CXX) $(LDFLAGS) -o $@ $^ $(LDLIBS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -MMD -MP -c -o $@ $<

$(BUILD_DIR):
	mkdir -p $@

-include $(DEPS)

clean:
	$(RM) -r $(BUILD_DIR)

.PHONY: all clean
Usage Notes: Override variables: make CC=clang CXX=clang++ CFLAGS="-O2 -march=native". Build: make -j$(nproc).
```

## 2. Multi-Target Project Template
```
Name: multi-target
Description: Makefile with multiple build targets
Template:
PROJECT = {{PROJECT_NAME}}
VERSION = {{VERSION}}

CC = gcc
CFLAGS = -Wall -Wextra -O2 -DVERSION=\"$(VERSION)\"
LDFLAGS =
BUILD_DIR = build

LIBS = $(BUILD_DIR)/lib{{LIB1}}.a $(BUILD_DIR)/lib{{LIB2}}.a
TARGETS = $(BUILD_DIR)/{{APP1}} $(BUILD_DIR)/{{APP2}}

all: $(TARGETS)

$(BUILD_DIR)/lib%.a: $(BUILD_DIR)/%.o
	$(AR) rcs $@ $^

$(BUILD_DIR)/{{APP1}}: $(BUILD_DIR)/{{APP1}}.o $(LIBS) | $(BUILD_DIR)
	$(CC) $(LDFLAGS) -o $@ $^ $(LDLIBS)

$(BUILD_DIR)/{{APP2}}: $(BUILD_DIR)/{{APP2}}.o $(LIBS) | $(BUILD_DIR)
	$(CC) $(LDFLAGS) -o $@ $^ $(LDLIBS)

$(BUILD_DIR)/%.o: %.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -MMD -MP -c -o $@ $<

$(BUILD_DIR):
	mkdir -p $@

test: $(TARGETS)
	./$(BUILD_DIR)/{{APP1}} --test
	./$(BUILD_DIR)/{{APP2}} --test

install: $(TARGETS)
	install -d $(DESTDIR)$(PREFIX)/bin
	install -m 755 $(TARGETS) $(DESTDIR)$(PREFIX)/bin/

clean:
	$(RM) -r $(BUILD_DIR)

.PHONY: all test install clean
Usage Notes: Multiple executables sharing library code. PREFIX default is /usr/local. DESTDIR for staged installs.
```

## 3. Documentation Template
```
Name: docs-target
Description: Makefile target for generating documentation
Template:
DOCS_DIR = docs
DOXYGEN = doxygen
DOXYFILE = Doxyfile
PANDOC = pandoc
MDSRC = $(wildcard docs/*.md)

docs-html: $(DOXYFILE)
	$(DOXYGEN) $(DOXYFILE)
	@echo "Documentation generated in $(DOCS_DIR)/html/"

docs-pdf: $(MDSRC)
	$(PANDOC) $(MDSRC) -o $(DOCS_DIR)/{{MANUAL_NAME}}.pdf \
		--pdf-engine=xelatex \
		--toc \
		-V title="{{PROJECT_TITLE}}" \
		-V author="{{AUTHOR}}"

docs-clean:
	$(RM) -r $(DOCS_DIR)/html $(DOCS_DIR)/latex

.PHONY: docs-html docs-pdf docs-clean
Usage Notes: Doxygen for API docs, Pandoc for manuals. Install doxygen and pandoc separately. Use latex for PDF generation.
```

## 4. Static Analysis Template
```
Name: static-analysis
Description: Code quality and static analysis targets
Template:
ANALYSIS_DIR = analysis
SRCS = $(wildcard src/*.c src/*.h)

$(ANALYSIS_DIR):
	mkdir -p $@

cppcheck: $(SRCS) | $(ANALYSIS_DIR)
	cppcheck --enable=all --suppress=missingIncludeSystem \
		--xml --xml-version=2 $(SRCS) 2> $(ANALYSIS_DIR)/cppcheck.xml

clang-tidy: $(SRCS) | $(ANALYSIS_DIR)
	clang-tidy $(SRCS) -- $(CFLAGS) > $(ANALYSIS_DIR)/tidy.log 2>&1 || true

format-check:
	clang-format --dry-run --Werror $(SRCS)

format:
	clang-format -i $(SRCS)

lint: cppcheck clang-tidy
	@echo "Lint completed. Check $(ANALYSIS_DIR) for reports."

.PHONY: cppcheck clang-tidy format-check format lint
Usage Notes: Requires cppcheck, clang-tidy, clang-format installed. cppcheck finds bugs, clang-tidy enforces style. format applies formatting to source.
```

## 5. Version Management Template
```
Name: version-mgmt
Description: Automatic version from git describe
Template:
VERSION ?= $(shell git describe --tags --dirty --always 2>/dev/null || echo "unknown")
COMMIT_HASH ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_DATE ?= $(shell date -u +%Y-%m-%dT%H:%M:%SZ)

CFLAGS += -DVERSION=\"$(VERSION)\" -DCOMMIT_HASH=\"$(COMMIT_HASH)\" -DBUILD_DATE=\"$(BUILD_DATE)\"

# Version generation
version.h: FORCE
	@echo '#define VERSION "$(VERSION)"' > $@
	@echo '#define COMMIT_HASH "$(COMMIT_HASH)"' >> $@
	@echo '#define BUILD_DATE "$(BUILD_DATE)"' >> $@

FORCE:

$(BUILD_DIR)/version.o: version.h

.PHONY: FORCE
Usage Notes: FORCE target ensures version.h rebuilds every time. Generated version header contains git info. Access version in code via VERSION macro.
```

## 6. Docker Build Integration
```
Name: docker-build
Description: Makefile with Docker build targets
Template:
REGISTRY ?= {{REGISTRY}}
IMAGE_NAME ?= {{IMAGE_NAME}}
VERSION ?= $(shell git describe --tags --always 2>/dev/null || echo "latest")

docker-build:
	docker build -t $(REGISTRY)/$(IMAGE_NAME):$(VERSION) .
	docker tag $(REGISTRY)/$(IMAGE_NAME):$(VERSION) $(REGISTRY)/$(IMAGE_NAME):latest

docker-push: docker-build
	docker push $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker push $(REGISTRY)/$(IMAGE_NAME):latest

docker-run:
	docker run -d -p {{PORT}}:{{PORT}} \
		--name $(IMAGE_NAME) \
		$(REGISTRY)/$(IMAGE_NAME):$(VERSION)

docker-stop:
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

docker-clean:
	docker rmi $(REGISTRY)/$(IMAGE_NAME):$(VERSION) $(REGISTRY)/$(IMAGE_NAME):latest || true

.PHONY: docker-build docker-push docker-run docker-stop docker-clean
Usage Notes: Override REGISTRY from command line. Tag with version and latest. Clean up images with docker-clean. Integrate with CI pipeline.
```

## 7. Release Workflow Template
```
Name: release-targets
Description: Release, packaging, and distribution targets
Template:
VERSION ?= $(shell git describe --tags --abbrev=0 2>/dev/null || echo "0.1.0")
DIST_DIR = dist/{{PROJECT}}-$(VERSION)
ARCHIVE = dist/{{PROJECT}}-$(VERSION).tar.gz

release: test $(ARCHIVE)
	@echo "Release $(VERSION) ready: $(ARCHIVE)"

$(ARCHIVE): $(TARGET)
	$(RM) -r $(DIST_DIR)
	mkdir -p $(DIST_DIR)/bin $(DIST_DIR)/share
	cp $(TARGET) $(DIST_DIR)/bin/
	cp README.md LICENSE $(DIST_DIR)/
	cp -r data/ $(DIST_DIR)/share/
	cd dist && tar czf $(notdir $(ARCHIVE)) $(notdir $(DIST_DIR))
	$(RM) -r $(DIST_DIR)

tag:
	git tag -a v$(VERSION) -m "Release v$(VERSION)"
	git push origin v$(VERSION)

.PHONY: release tag
Usage Notes: Run after passing tests. Creates distribution archive with binary and resources. Git tag triggers CI release pipeline.
```

## 8. Debug/Release Profile Template
```
Name: build-profiles
Description: Separate debug and release build configurations
Template:
BUILD_TYPE ?= release

ifeq ($(BUILD_TYPE),debug)
    BUILD_DIR = build/debug
    CFLAGS = -Wall -Wextra -Werror -g -O0 -DDEBUG
    LDFLAGS =
else
    BUILD_DIR = build/release
    CFLAGS = -Wall -Wextra -Werror -O2 -DNDEBUG
    LDFLAGS = -s  # Strip symbols
endif

SRCS = $(wildcard src/*.c)
OBJS = $(SRCS:src/%.c=$(BUILD_DIR)/%.o)
TARGET = $(BUILD_DIR)/{{TARGET}}

all: $(TARGET)

$(TARGET): $(OBJS) | $(BUILD_DIR)
	$(CC) $(LDFLAGS) -o $@ $^ $(LDLIBS)

$(BUILD_DIR)/%.o: src/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -MMD -MP -c -o $@ $<

$(BUILD_DIR):
	mkdir -p $@

clean:
	$(RM) -r build

.PHONY: all clean
Usage Notes: Build with: make BUILD_TYPE=debug or make BUILD_TYPE=release. Debug includes symbols and optimizes for debugging. Release strips symbols and optimizes for speed.
