# CMake-Expert: Templates

## 1. Executable Project Template
```
Name: executable-project
Description: CMake project for a simple executable
Template:
cmake_minimum_required(VERSION {{CMAKE_VERSION}})
project({{PROJECT_NAME}} VERSION {{VERSION}} LANGUAGES {{LANGUAGES}})

set(CMAKE_CXX_STANDARD {{CPP_STD}})
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable({{TARGET_NAME}}
    src/main.cpp
    src/{{MODULE1}}.cpp
    src/{{MODULE2}}.cpp
)

target_include_directories({{TARGET_NAME}} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_compile_options({{TARGET_NAME}} PRIVATE
    $<$<CXX_COMPILER_ID:MSVC>:/W4>
    $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic>
)
Usage Notes: CMAKE_VERSION=3.20, CPP_STD=20, LANGUAGES=CXX. Add source files explicitly (avoid file(GLOB)).
```

## 2. Library with Install Template
```
Name: library-install
Description: Library target with install and export rules
Template:
cmake_minimum_required(VERSION {{CMAKE_VERSION}})
project({{LIB_NAME}} VERSION {{VERSION}} LANGUAGES CXX)

add_library({{LIB_NAME}}
    src/{{MODULE1}}.cpp
    src/{{MODULE2}}.cpp
)

target_include_directories({{LIB_NAME}}
    PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:include>
)

target_compile_features({{LIB_NAME}} PUBLIC cxx_std_{{CPP_STD}})

include(GNUInstallDirs)
install(TARGETS {{LIB_NAME}}
    EXPORT {{LIB_NAME}}Targets
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
    INCLUDES DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
)
install(DIRECTORY include/ DESTINATION ${CMAKE_INSTALL_INCLUDEDIR})
install(EXPORT {{LIB_NAME}}Targets
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/{{LIB_NAME}}
)

export(TARGETS {{LIB_NAME}}
    FILE {{LIB_NAME}}Targets.cmake
    NAMESPACE {{LIB_NAME}}::
)
Usage Notes: Use GNUInstallDirs for cross-platform paths. Build interface vs install interface for headers. Export for find_package support.
```

## 3. FetchContent Dependency Template
```
Name: fetchcontent-dep
Description: Download external dependency with FetchContent
Template:
include(FetchContent)
FetchContent_Declare(
    {{DEP_NAME}}
    GIT_REPOSITORY {{GIT_URL}}
    GIT_TAG {{GIT_TAG}}
    GIT_SHALLOW TRUE
    GIT_PROGRESS TRUE
)

# Optional: override find_package behavior
set({{DEP_NAME_UPPER}}_BUILD_TESTS OFF CACHE BOOL "" FORCE)

FetchContent_MakeAvailable({{DEP_NAME}})

target_link_libraries({{TARGET}} PRIVATE {{DEP_NAME}}::{{DEP_NAME}})
target_include_directories({{TARGET}} PRIVATE ${${DEP_NAME}_SOURCE_DIR}/include)
Usage Notes: Use GIT_SHALLOW for faster cloning. Set cache variables BEFORE FetchContent_MakeAvailable. Prefer FetchContent over ExternalProject for simple dependencies.
```

## 4. CTest + Testing Template
```
Name: ctest-config
Description: Configure tests with CTest
Template:
enable_testing()

find_package({{TEST_FRAMEWORK}} REQUIRED)

# Unit tests
add_executable(test_{{MODULE}}
    tests/test_{{MODULE1}}.cpp
    tests/test_{{MODULE2}}.cpp
)
target_link_libraries(test_{{MODULE}} PRIVATE
    {{LIB_NAME}}
    {{TEST_FRAMEWORK}}::{{TEST_FRAMEWORK}}
)
add_test(NAME {{MODULE}}Tests COMMAND test_{{MODULE}})

# Test properties
set_tests_properties({{MODULE}}Tests PROPERTIES
    TIMEOUT {{TIMEOUT_SECONDS}}
    ENVIRONMENT "TEST_VAR={{VALUE}}"
)

# CTest configuration (CTestConfig.cmake or here)
set(CTEST_PROJECT_NAME "{{PROJECT}}")
set(CTEST_NIGHTLY_START_TIME "01:00:00 UTC")
set(CTEST_DROP_METHOD "https")
set(CTEST_DROP_SITE "cdash.{{COMPANY}}.com")
set(CTEST_DROP_LOCATION "/submit.php?project={{PROJECT}}")
Usage Notes: Use add_test for each test binary. Set TIMEOUT to prevent hanging tests. Use ENVIRONMENT for test-specific vars. CTest config for CDash dashboard.
```

## 5. CMakePresets Template
```
Name: presets-config
Description: CMakePresets.json for standard build configurations
Template:
{
  "version": {{PRESET_VERSION}},
  "configurePresets": [
    {
      "name": "{{PRESET_NAME}}",
      "displayName": "{{DISPLAY_NAME}}",
      "description": "{{DESCRIPTION}}",
      "generator": "{{GENERATOR}}",
      "binaryDir": "${sourceDir}/build/${presetName}",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "{{BUILD_TYPE}}",
        "CMAKE_CXX_COMPILER": "{{COMPILER}}",
        "{{OPTION}}": "{{VALUE}}"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "{{PRESET_NAME}}",
      "configurePreset": "{{PRESET_NAME}}"
    }
  ],
  "testPresets": [
    {
      "name": "{{PRESET_NAME}}",
      "configurePreset": "{{PRESET_NAME}}",
      "output": {"outputOnFailure": true},
      "execution": {"noTestsAction": "error", "stopOnFailure": false}
    }
  ]
}
Usage Notes: PRESET_VERSION=6 for CMake 3.25+. Generators: Ninja, "Unix Makefiles", "Visual Studio 17 2022", Xcode. Configure: --preset name. Build: --build --preset name.
```

## 6. Custom Command Template
```
Name: custom-command
Description: Add custom build step for code generation
Template:
set({{OUTPUT_FILE}} "${CMAKE_CURRENT_BINARY_DIR}/{{GENERATED_FILE}}")

add_custom_command(
    OUTPUT ${OUTPUT_FILE}
    COMMAND {{GENERATOR_COMMAND}}
        --input ${CMAKE_CURRENT_SOURCE_DIR}/{{INPUT_FILE}}
        --output ${OUTPUT_FILE}
        --option={{OPTION_VALUE}
    MAIN_DEPENDENCY {{INPUT_FILE}}
    DEPENDS {{ADDITIONAL_DEPS}}
    COMMENT "Generating {{GENERATED_FILE}}..."
    VERBATIM
)

add_custom_target({{GEN_TARGET}} DEPENDS ${OUTPUT_FILE})

add_library({{LIB_NAME}} ${OUTPUT_FILE} {{OTHER_SOURCES}})
add_dependencies({{LIB_NAME}} {{GEN_TARGET}})
Usage Notes: MAIN_DEPENDENCY triggers rebuild when changed. Use VERBATIM for proper escaping. VERBATIM is default in CMake 3.20+.
```

## 7. Toolchain File Template
```
Name: toolchain-file
Description: CMake toolchain file for cross-compilation
Template:
# Target system
set(CMAKE_SYSTEM_NAME {{SYSTEM_NAME}})
set(CMAKE_SYSTEM_PROCESSOR {{ARCH}})
set(CMAKE_SYSTEM_VERSION {{VERSION}})

# Cross compilers
set(CMAKE_C_COMPILER {{CROSS_PREFIX}}-gcc)
set(CMAKE_CXX_COMPILER {{CROSS_PREFIX}}-g++)

# Find root path for libraries/includes
set(CMAKE_FIND_ROOT_PATH {{SYSROOT_PATH}})

# Search strategy
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)

# Compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -mcpu={{CPU}} -mfloat-abi={{FLOAT_ABI}}")

# Linker flags
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -static-libgcc -static-libstdc++")
Usage Notes: SYSTEM_NAME: Linux/Android/iOS/Windows. ARCH: aarch64/arm/x86_64. Use with: `cmake -DCMAKE_TOOLCHAIN_FILE=toolchain.cmake`.
```

## 8. CPack Packaging Template
```
Name: cpack-config
Description: CPack configuration for creating installers
Template:
include(CPack)

set(CPACK_PACKAGE_NAME "{{PACKAGE_NAME}}")
set(CPACK_PACKAGE_VERSION "${PROJECT_VERSION}")
set(CPACK_PACKAGE_VENDOR "{{VENDOR}}")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "{{DESCRIPTION}}")
set(CPACK_PACKAGE_HOMEPAGE_URL "{{URL}}")
set(CPACK_PACKAGE_ICON "{{ICON_PATH}}")
set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_SOURCE_DIR}/LICENSE")
set(CPACK_RESOURCE_FILE_README "${CMAKE_SOURCE_DIR}/README.md")

# Platform-specific generators
if(WIN32)
    set(CPACK_GENERATOR "NSIS;ZIP")
    set(CPACK_NSIS_DISPLAY_NAME "{{DISPLAY_NAME}}")
    set(CPACK_NSIS_INSTALL_ROOT "$PROGRAMFILES")
elseif(APPLE)
    set(CPACK_GENERATOR "DragNDrop;TGZ")
    set(CPACK_DMG_VOLUME_NAME "{{DISPLAY_NAME}}")
else()
    set(CPACK_GENERATOR "DEB;RPM;TGZ")
    set(CPACK_DEBIAN_PACKAGE_MAINTAINER "{{MAINTAINER}}")
    set(CPACK_RPM_PACKAGE_RELEASE "1")
endif()

cpack_add_component({{COMPONENT_NAME}}
    DISPLAY_NAME "{{DISPLAY_NAME}}"
    DESCRIPTION "{{DESCRIPTION}}"
    REQUIRED
)
Usage Notes: Run CPack after install rules are configured. Generators: NSIS (Windows), DragNDrop (macOS), DEB/RPM (Linux). Create component-specific packages.
