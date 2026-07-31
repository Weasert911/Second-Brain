# CMake-Expert: References

## Official Documentation Summaries
- **CMake Documentation** – Complete command and variable reference
- **CMake Commands** – All scripting, project, and CTest commands
- **CMake Modules** – Built-in find modules and utility modules
- **CMake Presets** – CMakePresets.json specification
- **CPack Documentation** – Packaging and installer generation

## Glossary (15+ Terms)
- **Target** – Buildable entity (executable, library, custom target)
- **Generator** – Native build system generator (Ninja, Make, Visual Studio, Xcode)
- **Generator expression** – `$<...>` syntax for per-config/platform logic
- **Preset** – Predefined configuration in CMakePresets.json
- **Toolchain** – File defining cross-compilation tools and settings
- **Cache variable** – Persistent user-configurable variable (set with -D)
- **Find module** – `.cmake` file locating external dependencies
- **Export** – Making targets available to downstream CMake projects
- **Install** – Rules for copying files to install prefix
- **FetchContent** – Download and add dependencies at configure time
- **ExternalProject** – Download and build dependencies at build time
- **CTest** – Test driver that runs and reports test results
- **CPack** – Packaging tool generating installers
- **Interface library** – Header-only or pure requirement library
- **Alias target** – Namespaced target reference

## Architecture Notes
- CMake is a meta-build system: it generates files for native build tools
- Configuration time vs build time vs install time are distinct phases
- Target properties follow visibility rules: PRIVATE (self), PUBLIC (self + consumers), INTERFACE (consumers only)
- Generator expressions are evaluated at build system generation time, not at CMake configuration time

## Key Commands / APIs
- `cmake -S src -B build -G "Ninja"` – Configure
- `cmake --build build --target install -j 8` – Build and install
- `cmake --preset <name>` – Use preset for configuration
- `ctest --test-dir build -j 4 --output-on-failure` – Run tests
- `cpack --config CPackConfig.cmake` – Create package

## Conventions
- `CMAKE_CXX_STANDARD`: 11, 14, 17, 20, 23
- Target visibility: PRIVATE, PUBLIC, INTERFACE
- Variable naming: `UPPER_CASE` for cache variables, `lower_case` for local
- Target naming: `PascalCase` for exported targets
- Preset names: `debug`, `release`, `ci`, `coverage`

## Structure Recommendations
```
project/
├── CMakeLists.txt           # Root
├── CMakePresets.json        # Build presets
├── cmake/                   # Custom modules and toolchains
│   ├── FindMyLibrary.cmake
│   └── toolchain-arm.cmake
├── src/                     # Source code
│   ├── CMakeLists.txt
│   └── main.cpp
├── lib/                     # Library code
│   ├── CMakeLists.txt
│   └── ...
├── tests/                   # Test code
│   ├── CMakeLists.txt
│   └── test_main.cpp
└── external/                # External dependencies
    └── CMakeLists.txt
```

## Keyboard Shortcuts
- `Tab` – Auto-complete CMake variable names and targets
- `Ctrl+Space` – Show available options in cmake-gui
