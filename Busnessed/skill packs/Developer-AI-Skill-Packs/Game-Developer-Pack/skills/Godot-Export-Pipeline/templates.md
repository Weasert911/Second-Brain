# Godot Export Pipeline - Templates

## Export Preset Template

```godot
# export_presets.cfg template
[preset.0]
name="Windows Desktop"
platform="Windows"
runnable=true
dedicated_server=false
custom_features=""
binary_format="executable"
binary_format/embed_pck=true
application/icon="res://icon.ico"

[preset.1]
name="Linux/X11"
platform="Linux/X11"
runnable=true
binary_format="executable"

[preset.2]
name="macOS"
platform="macOS"
runnable=true
binary_format="app_bundle"
application/icon="res://icon.icns"
application/bundle_identifier="com.company.product"

[preset.3]
name="Android"
platform="Android"
runnable=true
binary_format="aab"
package/unique_name="com.company.product"
package/name="Product Name"
version/code=1
version/name="1.0"

[preset.4]
name="iOS"
platform="iOS"
runnable=true
binary_format="ipa"
application/bundle_identifier="com.company.product"

[preset.5]
name="Web (HTML5)"
platform="Web"
runnable=true
binary_format="web"

[preset.6]
name="Dedicated Server"
platform="Linux/X11"
runnable=true
dedicated_server=true
custom_features="server"
binary_format="executable"
```

## CI/CD Pipeline Template (GitHub Actions)

```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    strategy:
      matrix:
        platform: [windows, linux, web]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Godot
        uses: chickensoft-games/setup-godot@v1
        with:
          version: 4.2

      - name: Export ${{ matrix.platform }}
        run: |
          mkdir -p build/${{ matrix.platform }}
          godot --headless --export-release "${{ matrix.platform }}" build/${{ matrix.platform }}/game

      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.platform }}-build
          path: build/${{ matrix.platform }}/
```

## Build Script Template (Bash)

```bash
#!/bin/bash
# build.sh - Automated build script
set -e

GODOT_PATH=${GODOT_PATH:-godot}
VERSION=$(git describe --tags --always)
PLATFORMS=("Windows Desktop" "Linux/X11" "Web (HTML5)")
BUILD_DIR="build"

echo "Building version $VERSION"

for platform in "${PLATFORMS[@]}"; do
    echo "Exporting $platform..."
    $GODOT_PATH --headless --export-release "$platform" "$BUILD_DIR/$platform/"
done

echo "Build complete!"
```

## Build Script Template (PowerShell)

```powershell
# build.ps1
param(
    [string]$GodotPath = "godot.exe",
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"
$platforms = @{
    "Windows Desktop" = "build/windows/Game.exe"
    "Linux/X11" = "build/linux/Game.x86_64"
    "macOS" = "build/macos/Game.app"
    "Web (HTML5)" = "build/web/index.html"
}

Write-Host "Building version $Version"

foreach ($preset in $platforms.Keys) {
    $output = $platforms[$preset]
    $dir = Split-Path $output -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

    Write-Host "Exporting $preset -> $output"
    & $GodotPath --headless --export-release "$preset" $output
    if ($LASTEXITCODE -ne 0) { throw "Export failed for $preset" }
}

Write-Host "All platforms built successfully!"
```
