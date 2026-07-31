# Godot Export Pipeline - Snippets

## Version Check

```gdscript
var version := ProjectSettings.get_setting("application/config/version")
print("Game version: ", version)
OS.set_audio_use_io(version)
```

## Export Detection

```gdscript
if OS.has_feature("windows"):
    print("Running on Windows")
if OS.has_feature("mobile"):
    print("Running on mobile device")
if OS.has_feature("editor"):
    print("Running in editor")
```

## Platform Constants

```gdscript
const IS_WINDOWS := OS.get_name() == "Windows"
const IS_MACOS := OS.get_name() == "macOS"
const IS_LINUX := OS.get_name() == "Linux" or OS.get_name() == "FreeBSD"
const IS_ANDROID := OS.get_name() == "Android"
const IS_IOS := OS.get_name() == "iOS"
const IS_WEB := OS.get_name() == "Web"
const IS_MOBILE := IS_ANDROID or IS_IOS
```

## CLI Args

```gdscript
var args := OS.get_cmdline_args()
for i in range(args.size()):
    if args[i] == "--server":
        start_server()
```

## Build Time Stamp

```gdscript
var build_time := Time.get_datetime_string_from_system()
ProjectSettings.set_setting("application/config/build_time", build_time)
```

## Export Template Check

```gdscript
func has_export_templates() -> bool:
    var path := OS.get_executable_path().get_base_dir()
    var templates := path + "/export_templates"
    return DirAccess.dir_exists_absolute(templates)
```
