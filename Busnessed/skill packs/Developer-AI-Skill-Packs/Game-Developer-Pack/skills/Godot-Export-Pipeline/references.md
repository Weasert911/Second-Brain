# Godot Export Pipeline - References

## Export Presets

### Preset Configuration
```gdscript
# Export presets saved in: res://export_presets.cfg
# Manage via: Project > Export

# Preset types:
# Windows Desktop
# Linux/X11 Desktop
# macOS Desktop
# Android
# iOS
# Web (HTML5)
# Linux Server (Dedicated)
```

### Common Export Settings
```gdscript
# Binary Format
# - Embed PCK: Binary contains embedded PCK
# - Export as ZIP: Separate executable + PCK
# - Export as App: macOS .app bundle

# Texture Format
# - bptc_etc: Desktop + mobile (largest)
# - etc2: Android (OpenGL ES 3.0)
# - etc: Android (OpenGL ES 2.0)
# - pvrtc: iOS (older devices)
# - bptc: Desktop only (best quality)

# VRAM Compression
# - Enable for all platforms to reduce package size
```

## Platform-Specific Settings

### Windows
```gdscript
# Export settings
binary_format = "executable"
application/icon = "res://icon.ico"
application/console_wrapper = "res://console_wrapper.exe"  # Optional
application/modify_resolution = true
application/file_version = "1.0.0"
application/product_version = "1.0.0"
application/company_name = "YourCompany"
application/product_name = "GameName"
application/file_description = "Game Description"
application/copyright = "Copyright 2024"
```

### macOS
```gdscript
# Export settings
binary_format = "app_bundle"
application/icon = "res://icon.icns"
application/bundle_identifier = "com.company.gamename"
application/copyright = "Copyright 2024"
application/signature = "Developer ID Application: Your Name"
application/category = "public.app-category.games"
application/use_entitlements = true
# Sandbox entitlements
application/entitlements = "res://entitlements.plist"
```

### Linux
```gdscript
# Export settings
binary_format = "executable"
application/icon = "res://icon.png"  # For .desktop file
# For AppImage: use linuxdeployqt or appimagetool
```

### Android
```gdscript
# Export settings
binary_format = "apk"  # or "aab" for Google Play
architecture = "arm64"  # or "arm32", "x86"
package/unique_name = "com.company.gamename"
package/name = "Game Name"
package/signing/enable = true
package/signing/debug = store/debug.keystore
package/signing/release = store/release.keystore
permissions/access_network_state = true
permissions/internet = true
screen/immersive_mode = true
screen/support_small = true
screen/support_normal = true
screen/support_large = true
screen/support_xlarge = false
```

### iOS
```gdscript
# Export settings
binary_format = "ipa"
application/bundle_identifier = "com.company.gamename"
application/signature = "Apple Distribution: Your Name"
application/app_store_team_id = "TEAMID"
application/copyright = "Copyright 2024"
application/icon = "res://icon_ios.png"
provisioning_profile = "res://embedded.mobileprovision"
```

### Web (HTML5)
```gdscript
# Export settings
binary_format = "web"
vram_texture_compression/for_desktop = true
vram_texture_compression/for_mobile = true
html/export_icon = true
html/custom_html_shell = "res://custom_shell.html"
html/head_include = ""
service_providers/enable = false
```

## Asset Pipeline

### .import Files
```gdscript
# Each imported asset has .import file
# Commit these to version control!

# Texture import settings
[remap]
importer="texture"
type="CompressedTexture2D"
path=".godot/imported/texture.png-12345.ctex"

[params]
compress/mode=0  # Lossless
compress/high_quality=true
detect_3d/compress_to=0
process/fix_alpha_border=true
process/premult_alpha=false
process/flip_y=false
]

# Audio import
[params]
force/max_rate=false
force/max_rate_hz=44100
edit/trim=false
edit/normalize=true
compress/mode=0  # Disabled (keep as Ogg)
```

## Version Stamping

```gdscript
# In project.godot
config/version = "1.0.0"

# Access in code
var version := ProjectSettings.get_setting("application/config/version")

# Auto-increment in CI
# Use semantic versioning: MAJOR.MINOR.PATCH
# PRE-RELEASE: 1.0.0-alpha.1
# BUILD META: 1.0.0+build.123
```

## CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/build.yml
name: Build Game
on: [push, pull_request]
jobs:
  build:
    strategy:
      matrix:
        platform: [windows, linux, web]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download Godot
        run: |
          wget https://downloads.godotengine.org/releases/4.2/godot-4.2-stable.zip
          unzip godot-4.2-stable.zip
      - name: Export ${{ matrix.platform }}
        run: |
          ./godot --headless --export-release ${{ matrix.platform }}
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: game-${{ matrix.platform }}
          path: build/
```

### Build Script
```powershell
# build.ps1
$GODOT_PATH = "C:\godot\Godot.exe"
$PRESETS = @("windows", "linux", "web")

foreach ($preset in $PRESETS) {
    Write-Host "Building for $preset"
    & $GODOT_PATH --headless --export-release $preset "./build/$preset"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build for $preset"
        exit 1
    }
}
```

## Code Signing

### Windows
```bash
# Sign executable with Authenticode certificate
signtool sign /fd SHA256 /a /f certificate.pfx /p password game.exe
# Timestamp
signtool timestamp /tr http://timestamp.digicert.com /td SHA256 game.exe
```

### macOS
```bash
# Sign .app bundle
codesign --force --sign "Developer ID Application: Name" --deep Game.app
# Notarize
xcrun notarytool submit Game.dmg --apple-id email --password password --team-id TEAMID
# Staple
xcrun stapler staple Game.dmg
```

### Android
```bash
# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.keystore game.apk alias_name
# Align
zipalign -v 4 game.apk game-aligned.apk
```

## Store Requirements

### App Store (iOS)
- Bundle ID: com.company.gamename
- Icon: 1024x1024 PNG
- Screenshots: 6.7", 6.5", 5.5" displays
- App Preview: 30-second video
- Description: <4000 characters
- Keywords: <100 characters
- Age Rating: based on content

### Google Play
- Package name: com.company.gamename
- Icon: 512x512 PNG (32-bit)
- Feature Graphic: 1024x500 PNG
- Screenshots: min 2, max 8
- Description: <4000 characters
- Content Rating: questionnaire
- Privacy Policy: URL required

## Distribution

### Delivery Strategies
- Direct download: itch.io, Itch, Steam
- App stores: Google Play, App Store
- Web: HTML5 on itch.io, Newgrounds, Kongregate
- Subscription: Xbox Game Pass, Apple Arcade

### Update Delivery
- Embedded PCK: Replace whole binary
- Separate PCK: Download new PCK file
- Patch system: Binary diff patches (courgette, bsdiff)
- Steam: Automatic patching via SteamPipe
