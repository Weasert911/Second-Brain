# CMake-Expert: Examples

## Beginner: Simple C++ Project
```cmake
cmake_minimum_required(VERSION 3.16)
project(MyApp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(myapp main.cpp calculator.cpp calculator.h)

target_include_directories(myapp PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
```
```bash
cmake -S . -B build
cmake --build build
./build/myapp
```
**Explanation**: Minimal CMake project. Sets C++17 standard. Single executable from source files. Include directory for header access. Build out-of-source in `build/` directory.

## Intermediate: Library with Tests and Install
```cmake
cmake_minimum_required(VERSION 3.20)
project(MathLib VERSION 2.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

option(BUILD_TESTS "Build unit tests" ON)
option(BUILD_SHARED_LIBS "Build shared library" OFF)

add_library(mathlib
    src/add.cpp
    src/subtract.cpp
    src/multiply.cpp
    src/divide.cpp
)

target_include_directories(mathlib
    PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:include>
)

target_compile_features(mathlib PUBLIC cxx_std_20)

if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

include(GNUInstallDirs)
install(TARGETS mathlib
    EXPORT MathLibTargets
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
    INCLUDES DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
)
install(DIRECTORY include/ DESTINATION ${CMAKE_INSTALL_INCLUDEDIR})
install(EXPORT MathLibTargets DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MathLib)
```
```cmake
# tests/CMakeLists.txt
find_package(doctest CONFIG QUIET)
if(NOT doctest_FOUND)
    include(FetchContent)
    FetchContent_Declare(doctest GIT_REPOSITORY https://github.com/doctest/doctest.git GIT_TAG v2.4.11)
    FetchContent_MakeAvailable(doctest)
endif()

add_executable(test_mathlib test_add.cpp test_subtract.cpp)
target_link_libraries(test_mathlib PRIVATE mathlib doctest::doctest)
add_test(NAME MathLibTests COMMAND test_mathlib)
```
**Explanation**: Library target with PUBLIC/INTERFACE visibility. Generator expressions for build vs install include paths. FetchContent for test framework. CTest integration. Install rules for packaging. Option for shared/static library.

## Advanced: Package with Dependencies
```cmake
cmake_minimum_required(VERSION 3.22)
project(WebService VERSION 1.0.0 LANGUAGES CXX)

find_package(Boost REQUIRED COMPONENTS beast json)
find_package(OpenSSL REQUIRED)
find_package(fmt CONFIG REQUIRED)

add_executable(webservice
    src/main.cpp
    src/server.cpp
    src/handler.cpp
    src/config.cpp
)

target_link_libraries(webservice PRIVATE
    Boost::beast
    Boost::json
    OpenSSL::SSL
    OpenSSL::Crypto
    fmt::fmt
)

target_compile_features(webservice PUBLIC cxx_std_20)

# Code generation with custom command
add_custom_command(
    OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/version.h
    COMMAND ${CMAKE_COMMAND} -E echo "#define VERSION \"${PROJECT_VERSION}\""
    COMMAND ${CMAKE_COMMAND} -E echo "#define BUILD_TIME \"$(date)\""
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        ${CMAKE_CURRENT_BINARY_DIR}/version.h
        ${CMAKE_CURRENT_BINARY_DIR}/version.h
    DEPENDS ${CMAKE_SOURCE_DIR}/CMakeLists.txt
    COMMENT "Generating version header"
)
add_custom_target(generate_version DEPENDS ${CMAKE_CURRENT_BINARY_DIR}/version.h)
add_dependencies(webservice generate_version)

# Static analysis with clang-tidy
if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    set(CMAKE_CXX_CLANG_TIDY "clang-tidy;--checks=*,-cppcoreguidelines-avoid-magic-numbers")
endif()
```
**Explanation**: Complex project with find_package dependencies, code generation via custom command, and static analysis integration. Uses Boost Beast for HTTP server, fmt for formatting. Generated version header includes build info.

## Production: Cross-Compilation with Presets
```cmake
# CMakePresets.json
{
  "version": 6,
  "configurePresets": [
    {
      "name": "default",
      "displayName": "Native Debug",
      "generator": "Ninja",
      "binaryDir": "${sourceDir}/build/${presetName}",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug",
        "CMAKE_CXX_COMPILER": "g++"
      }
    },
    {
      "name": "release",
      "displayName": "Native Release",
      "inherits": "default",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    },
    {
      "name": "arm-cross",
      "displayName": "ARM Cross-Compile",
      "generator": "Ninja",
      "binaryDir": "${sourceDir}/build/${presetName}",
      "toolchainFile": "${sourceDir}/cmake/arm-toolchain.cmake",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "CMAKE_CXX_FLAGS": "-mcpu=cortex-a72"
      }
    }
  ],
  "buildPresets": [
    { "name": "default", "configurePreset": "default" },
    { "name": "release", "configurePreset": "release" },
    { "name": "arm-cross", "configurePreset": "arm-cross" }
  ],
  "testPresets": [
    { "name": "default", "configurePreset": "default" }
  ]
}
```
```cmake
# cmake/arm-toolchain.cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)
set(CMAKE_C_COMPILER aarch64-linux-gnu-gcc)
set(CMAKE_CXX_COMPILER aarch64-linux-gnu-g++)
set(CMAKE_FIND_ROOT_PATH /usr/aarch64-linux-gnu)
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```
```bash
# Build using presets
cmake --preset release
cmake --build --preset release
ctest --preset default

# Cross-compile for ARM
cmake --preset arm-cross
cmake --build --preset arm-cross
```
**Explanation**: CMakePresets.json standardizes build configurations. ARM cross-compilation uses a toolchain file. Presets cover debug, release, and cross-compilation. `--preset` flags simplify CLI usage across the team.
