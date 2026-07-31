# CMake-Expert: Snippets

## 1. Modern CMake Target Setup
```cmake
add_library(mylib STATIC src/impl.cpp)
target_include_directories(mylib PUBLIC include)
target_compile_features(mylib PUBLIC cxx_std_20)
```
**When to use**: Modern CMake best practice using target-based commands.

## 2. Find Package with Custom Path
```cmake
find_package(OpenCV REQUIRED PATHS /opt/opencv NO_DEFAULT_PATH)
target_link_libraries(myapp PRIVATE ${OpenCV_LIBS})
```
**When to use**: Locate packages installed in non-standard directories.

## 3. Generator Expression for Platform
```cmake
target_compile_options(mylib PRIVATE
  $<$<CXX_COMPILER_ID:MSVC>:/W4>
  $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic>
)
```
**When to use**: Set different compiler flags based on the compiler being used.

## 4. FetchContent Dependency
```cmake
include(FetchContent)
FetchContent_Declare(fmt GIT_REPOSITORY https://github.com/fmtlib/fmt.git GIT_TAG 10.2.1)
FetchContent_MakeAvailable(fmt)
target_link_libraries(myapp PRIVATE fmt::fmt)
```
**When to use**: Download and build dependencies at configure time.

## 5. Install and Export Rules
```cmake
include(GNUInstallDirs)
install(TARGETS mylib EXPORT MyLibTargets LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})
install(EXPORT MyLibTargets DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib)
```
**When to use**: Make libraries installable and discoverable by find_package.

## 6. Custom Command for Code Generation
```cmake
add_custom_command(OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/version.h
  COMMAND ${CMAKE_COMMAND} -E echo "#define VERSION \"${PROJECT_VERSION}\"" > ${OUTPUT})
```
**When to use**: Generate source files as part of the build process.

## 7. CTest Integration
```cmake
enable_testing()
add_test(NAME UnitTests COMMAND test_runner)
set_tests_properties(UnitTests PROPERTIES TIMEOUT 30)
```
**When to use**: Register tests with CTest for automated test execution.

## 8. Interface Library for Header-Only
```cmake
add_library(myheader INTERFACE)
target_include_directories(myheader INTERFACE include)
target_compile_features(myheader INTERFACE cxx_std_20)
```
**When to use**: Package header-only libraries with proper dependency propagation.

## 9. Check for Compiler Feature
```cmake
include(CheckCXXSourceCompiles)
check_cxx_source_compiles("int main() { return 0; }" COMPILER_WORKS)
```
**When to use**: Test compiler capabilities at configure time for feature detection.

## 10. CPack Configuration
```cmake
set(CPACK_GENERATOR "DEB;RPM;TGZ")
set(CPACK_DEBIAN_PACKAGE_MAINTAINER "dev@company.com")
include(CPack)
```
**When to use**: Configure packaging after install rules are defined.

## 11. Option for Build Configuration
```cmake
option(BUILD_TESTS "Build unit tests" ON)
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)
if(BUILD_TESTS)
  enable_testing()
  add_subdirectory(tests)
endif()
```
**When to use**: Provide user-configurable build options with cmake -D.

## 12. Cross-Compilation Setup
```cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)
set(CMAKE_C_COMPILER aarch64-linux-gnu-gcc)
set(CMAKE_CXX_COMPILER aarch64-linux-gnu-g++)
```
**When to use**: Cross-compile for different target architectures via toolchain file.

## 13. Object Library for Large Builds
```cmake
add_library(myobjects OBJECT src/a.cpp src/b.cpp)
target_compile_definitions(myobjects PRIVATE BUILD_DLL)
add_executable(myapp $<TARGET_OBJECTS:myobjects>)
add_library(mylib SHARED $<TARGET_OBJECTS:myobjects>)
```
**When to use**: Share compiled objects between multiple targets without duplicate builds.

## 14. Alias Target for Namespacing
```cmake
add_library(MyLib::MyLib ALIAS mylib)
target_link_libraries(myapp PRIVATE MyLib::MyLib)
```
**When to use**: Create namespaced target names for consistent consumption.

## 15. Presets for Standard Builds
```json
{
  "version": 6,
  "configurePresets": [{
    "name": "release",
    "generator": "Ninja",
    "binaryDir": "${sourceDir}/build/release",
    "cacheVariables": { "CMAKE_BUILD_TYPE": "Release" }
  }]
}
```
**When to use**: Standardize build configurations across the team using CMakePresets.json.
