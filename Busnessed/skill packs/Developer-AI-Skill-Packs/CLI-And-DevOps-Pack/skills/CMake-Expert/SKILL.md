---
name: CMake-Expert
version: 1.0.0
domain: Build Systems
activation_description: Activate when creating or modifying CMake build configurations for C/C++ projects
purpose: Master CMake for cross-platform build system configuration, dependency management, and project organization
---

# CMake-Expert

## Capabilities
- Structure CMakeLists.txt files with proper targets and properties
- Manage dependencies with find_package, FetchContent, and ExternalProject
- Use generator expressions for platform- and configuration-specific logic
- Write toolchain files for cross-compilation
- Configure presets with CMakePresets.json for standard builds
- Define install rules and export targets for package distribution
- Package with CPack for multi-platform installers
- Configure testing with CTest for automated test execution
- Create custom commands and targets for code generation
- Manage compiler flags with target_compile_options and target_compile_definitions
- Configure cross-compilation for embedded and mobile targets
- Set up IDE integration for Visual Studio, Xcode, and CLion

## Limitations
- Cannot automatically fix all dependency version conflicts
- Cannot handle non-CMake dependencies without external wrappers
- Cannot guarantee consistent behavior across all CMake versions
- Cannot compile code itself (delegates to native build tools)
- Cannot manage system-wide package installation (use system package manager)
- Cannot override all upstream target properties without errors

## Required Tools
- CMake 3.15+ (3.20+ recommended for presets)
- C/C++ compiler (GCC, Clang, MSVC)
- Ninja or Make (for build execution)
- CTest (included with CMake)
- CPack (included with CMake)

## Execution Workflow

1. Define project structure (src/, lib/, tests/, external/)
2. Create root CMakeLists.txt with cmake_minimum_required and project()
3. Define build targets (add_library, add_executable) with source files
4. Configure target properties (C++ standard, include directories, compile definitions)
5. Manage dependencies with find_package or FetchContent
6. Set compiler flags with target_compile_options and target_compile_features
7. Create CMakePresets.json for common build configurations
8. Configure install rules and export targets
9. Add tests with add_test and enable_testing
10. Configure CPack for packaging
11. Build with cmake --build and test with ctest
12. Document required CMake version and dependencies in README

## Decision Tree

```
How to manage dependencies?
├── System package → find_package (with CONFIG or MODULE mode)
├── Bundled in repo → FetchContent (download at configure time)
├── External project → ExternalProject_Add (download at build time)
├── Subdirectory → add_subdirectory for in-tree libraries
└── Custom location → set CMAKE_PREFIX_PATH or hints

Build type?
├── Debug → -DCMAKE_BUILD_TYPE=Debug
├── Release → -DCMAKE_BUILD_TYPE=Release (-O3 -DNDEBUG)
├── RelWithDebInfo → Release with debug symbols
├── MinSizeRel → Optimize for size (-Os)
└── Custom → Define custom CMAKE_BUILD_TYPE

Need cross-compilation?
├── Yes → Use toolchain file with -DCMAKE_TOOLCHAIN_FILE
├── Same platform → Use presets for standard builds
└── IDE → Generate native project files (-G Xcode, -G "Visual Studio")

How to expose to consumers?
├── Header-only → INTERFACE library with PUBLIC headers
├── Static library → STATIC library target
├── Shared library → SHARED with export macros
└── Executable with SDK → Executable + export targets
```

## Review Checklist
- [ ] cmake_minimum_required sets minimum supported version
- [ ] project() includes language (C, CXX, etc.)
- [ ] C++ standard set with target_compile_features or CMAKE_CXX_STANDARD
- [ ] Include directories use target_include_directories with proper visibility
- [ ] Dependencies found with appropriate find_package hints
- [ ] Generator expressions used where platform/config varies
- [ ] Install rules defined for all targets
- [ ] Export targets configured for downstream consumption
- [ ] Tests added with add_test and known test commands
- [ ] CMakePresets.json covers common build configurations
- [ ] CPack config produces platform-appropriate packages
- [ ] No hard-coded paths in CMakeLists.txt

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Package not found | find_package can't locate it | Set CMAKE_PREFIX_PATH or use -DCMAKE_MODULE_PATH |
| ABI mismatch | Different compiler versions | Rebuild all dependencies with same compiler |
| Generator expression not evaluated | Wrong context | Generator expressions work in directory properties, not in macros |
| Target already defined | Name collision | Use namespaced target names: `MyLib::MyLib` |
| Install path wrong | Relative vs absolute confusion | Use GNUInstallDirs for standard paths |
| Compiler flag not applied | Wrong target property scope | Use PUBLIC/PRIVATE/INTERFACE appropriately |
| Cross-compilation fails | Toolchain file missing settings | Ensure CMAKE_SYSTEM_NAME and CMAKE_SYSROOT are set |
| FetchContent fails to download | Network or git issues | Check URL; use ExternalProject with URL for reliability |

## Best Practices
- Prefer `target_*` commands over global commands (`target_include_directories` vs `include_directories`)
- Use `FetchContent` over `ExternalProject` for simpler dependency management
- Define `CMAKE_CXX_STANDARD` per-target with `target_compile_features`
- Use `CMakePresets.json` for standardizing build configurations
- Use `GNUInstallDirs` for cross-platform install paths
- Create `CMakeLists.txt` for each subdirectory (modular approach)
- Use `INTERFACE` libraries for header-only targets
- Set `BUILD_SHARED_LIBS` as an option for library type flexibility
- Use `CACHE INTERNAL` for variables that should persist across runs
- Document all user-facing CMake options with `option()` or `cmake_dependent_option()`
- Use `check_*` functions from `CheckCSourceCompiles` for feature testing
- Run `cmake --build . --target help` to list available targets

## Anti-Patterns
- Using `file(GLOB)` for source files (changes not detected by CMake)
- Setting `CMAKE_CXX_FLAGS` directly instead of `target_compile_options`
- Using `link_directories()` instead of target properties
- Hard-coding install paths instead of using GNUInstallDirs
- Mixing build types in the same build directory
- Not using `--target` flag with `cmake --build`
- Assuming Windows vs Unix paths without generator expressions
- Putting all code in a single CMakeLists.txt without subdirectories
- Using `EXCLUDE_FROM_ALL` without understanding its effects
- Disabling warnings globally instead of fixing the code

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
