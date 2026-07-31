# Godot Export Pipeline - Examples

## Export Presets Configuration

```godot
# export_presets.cfg
[preset.0]

name="Windows Desktop"
platform="Windows"
runnable=true
dedicated_server=false
custom_features=""
binary_format="executable"

[preset.0.options]

binary_format/embed_pck=true
custom_template/debug=""
custom_template/release=""
texture_format/bptc_etc=true
texture_format/etc2_etc=true
texture_format/no_bptc_fallback=false
application/icon="res://icon.ico"
application/console_wrapper=""
application/modify_resolution=true
application/file_version="1.0.0"
application/product_version="1.0.0"
application/company_name="StudioName"
application/product_name="GameName"
application/file_description="Game Description"
application/copyright="Copyright 2024"

[preset.1]

name="Linux/X11"
platform="Linux/X11"
runnable=true
runnable=false
dedicated_server=false
custom_features=""
binary_format="executable"

[preset.2]

name="macOS"
platform="macOS"
runnable=true
runnable=false
binary_format="app_bundle"

[preset.2].options

application/icon="res://icon.icns"
application/bundle_identifier="com.studio.gamename"
application/copyright="Copyright 2024"
application/signature="Developer ID Application: Your Name"

[preset.3]

name="Android"
platform="Android"
runnable=true
runnable=false
binary_format="aab"

[preset.3].options

package/unique_name="com.studio.gamename"
package/name="Game Name"
package/signing/debug="res://debug.keystore"
package/signing/release="res://release.keystore"
version/code=1
version/name="1.0"
screen/immersive_mode=true
screen/support_small=true
screen/support_normal=true
screen/support_large=true
screen/support_xlarge=false
architectures/armeabiv7=true
architectures/arm64v8=true
architectures/x86=false

[preset.4]

name="Web (HTML5)"
platform="Web"
runnable=true
runnable=false
binary_format="web"

[preset.4].options

vram_texture_compression/for_desktop=true
vram_texture_compression/for_mobile=true
html/export_icon=true
html/custom_html_shell="res://custom_shell.html"
progressive_web_app/enable=false

[preset.5]

name="Dedicated Server"
platform="Linux/X11"
runnable=true
dedicated_server=true
custom_features="server"
binary_format="executable"
```

## GitHub Actions CI/CD

```yaml
# .github/workflows/release.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-windows:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download Godot
        run: |
          wget -q https://github.com/godotengine/godot/releases/download/4.2-stable/Godot_v4.2-stable_linux.x86_64.zip
          unzip -q Godot_v4.2-stable_linux.x86_64.zip
          mv Godot_v4.2-stable_linux.x86_64 godot

      - name: Download Export Templates
        run: |
          wget -q https://github.com/godotengine/godot/releases/download/4.2-stable/Godot_v4.2-stable_export_templates.tpz
          mkdir -p ~/.godot/export_templates/4.2.stable
          unzip -q Godot_v4.2-stable_export_templates.tpz -d ~/.godot/export_templates/4.2.stable

      - name: Export Windows
        run: |
          mkdir -p build/windows
          ./godot --headless --export-release "Windows Desktop" build/windows/Game.exe

      - name: Upload Windows Artifact
        uses: actions/upload-artifact@v4
        with:
          name: windows-build
          path: build/windows/

  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download Godot
        run: |
          wget -q https://downloads.godotengine.org/releases/4.2/Godot_v4.2-stable_linux.x86_64.zip
          unzip -q Godot_v4.2-stable_linux.x86_64.zip
          mv Godot_v4.2-stable_linux.x86_64 godot

      - name: Export Web
        run: |
          mkdir -p build/web
          ./godot --headless --export-release "Web (HTML5)" build/web/index.html

      - name: Upload Web Artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: build/web/

  release:
    needs: [build-windows, build-web]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            windows-build/Game.exe
            web-build/index.html
          generate_release_notes: true
```

## Version Automation Script

```gdscript
# version.gd - run with: godot --script version.gd --headless
extends SceneTree

func _init() -> void:
    var version := "1.0.0"
    var args := OS.get_cmdline_args()

    for i in range(args.size()):
        if args[i] == "--version" and i + 1 < args.size():
            version = args[i + 1]

    var project_path := "res://project.godot"
    var config := ConfigFile.new()
    config.load(project_path)
    config.set_value("application", "config/version", version)
    config.save(project_path)

    var time := Time.get_datetime_string_from_system()
    print("Version updated to %s at %s" % [version, time])
    quit()
```

## Batch Export Script (PowerShell)

```powershell
# export_all.ps1
param(
    [string]$GodotPath = "C:\godot\Godot_v4.2-stable_win64.exe",
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"

# Update version first
Write-Host "Updating version to $Version"
& $GodotPath --headless --script version.gd -- --version $Version
if ($LASTEXITCODE -ne 0) { throw "Version update failed" }

# Define export presets
$presets = @{
    "Windows Desktop" = "build/windows/Game.exe"
    "Linux/X11" = "build/linux/Game.x86_64"
    "macOS" = "build/macos/Game.dmg"
    "Android" = "build/android/Game.aab"
    "Web (HTML5)" = "build/web/index.html"
}

# Export for each platform
foreach ($preset in $presets.Keys) {
    $output = $presets[$preset]
    $outputDir = Split-Path $output -Parent

    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force
    }

    Write-Host "Building $preset -> $output"
    & $GodotPath --headless --export-release "$preset" $output

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build $preset"
        exit 1
    }
    Write-Host "  Done!"
}

Write-Host "All builds completed successfully!"
```

## Code Signing Script

```powershell
# sign_builds.ps1
param(
    [string]$CertificatePath,
    [string]$CertificatePassword
)

# Windows code signing
Write-Host "Signing Windows executable..."
signtool sign /fd SHA256 /a /f $CertificatePath /p $CertificatePassword `
    /tr http://timestamp.digicert.com /td SHA256 `
    build/windows/Game.exe

signtool verify /pa build/windows/Game.exe

# macOS code signing
Write-Host "Signing macOS bundle..."
codesign --force --sign "Developer ID Application: Studio Name" `
    --deep --timestamp build/macos/Game.app

# Notarize
xcrun notarytool submit build/macos/Game.dmg `
    --apple-id "email@example.com" `
    --team-id "TEAMID" `
    --password @keychain:AC_PASSWORD

Write-Host "Signing complete!"
```
