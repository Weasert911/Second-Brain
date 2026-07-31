# CMake-Expert: Checklists

## Pre-Flight Checklist
- [ ] CMake version 3.15+ installed
- [ ] cmake_minimum_required set appropriately
- [ ] project() includes all needed languages
- [ ] C/C++ compiler installed and in PATH
- [ ] Generator chosen (Ninja, Make, Visual Studio, Xcode)
- [ ] Build directory separated from source (out-of-source)
- [ ] Dependencies available (system or FetchContent)
- [ ] CMakePresets.json planned for team consistency

## Implementation Checklist
- [ ] Target names use namespaced convention (MyLib::MyLib)
- [ ] target_* commands used instead of global commands
- [ ] Generator expressions handle platform/config differences
- [ ] Visibility set correctly (PRIVATE, PUBLIC, INTERFACE)
- [ ] C++ standard set with target_compile_features
- [ ] Include directories use appropriate visibility
- [ ] find_package includes REQUIRED or QUIET appropriately
- [ ] FetchContent dependencies isolated from main project
- [ ] Install rules defined with GNUInstallDirs
- [ ] Export targets configured for downstream use
- [ ] Tests added with add_test
- [ ] CPack configured for distribution

## Testing Checklist
- [ ] cmake --build completes without errors
- [ ] ctest passes all tests
- [ ] Install rules work: cmake --install . --prefix /tmp/test
- [ ] Export/import works: find_package finds installed targets
- [ ] Generator expressions evaluated correctly for all configs
- [ ] FetchContent downloads and builds dependencies
- [ ] Cross-compilation works with toolchain file
- [ ] Presets produce correct configuration
- [ ] Debug and Release builds produce expected flags
- [ ] Clean rebuild works (rm -rf build && cmake -S . -B build)

## Release Checklist
- [ ] Version bumped in project() command
- [ ] CHANGELOG documented
- [ ] CPack packages created and tested
- [ ] Install paths verified on target platform
- [ ] Soname/versioning set for shared libraries
- [ ] Export headers verified for downstream
- [ ] Documentation targets build without warnings
- [ ] CI configuration updated for new release
- [ ] ABI compatibility checked if applicable
- [ ] Release tagged in version control

## Maintenance Checklist
- [ ] CMake version updated and tested
- [ ] Find modules reviewed for upstream changes
- [ ] Deprecated CMake commands replaced
- [ ] Target properties aligned with best practices
- [ ] FetchContent dependency versions updated
- [ ] Presets updated for new toolchains
- [ ] CTest coverage monitored for decrease
- [ ] Build times profiled and optimized
