# Godot Export Pipeline - Checklists

## Pre-Export Checklist

### Project Settings
- [ ] Project name set correctly
- [ ] Version number updated (config/version)
- [ ] Default texture filter appropriate
- [ ] Stretch mode configured
- [ ] Physics FPS set
- [ ] Audio bus layout finalized

### Export Presets
- [ ] Presets created for all target platforms
- [ ] Export paths configured
- [ ] Icons set per platform
- [ ] Bundle identifiers set (macOS, iOS, Android)
- [ ] Version codes match across platforms
- [ ] Architecture selection correct (arm64, x86_64)
- [ ] Texture format settings appropriate

### Assets
- [ ] All assets imported with correct settings
- [ ] Unused assets removed
- [ ] Texture compression enabled
- [ ] Audio compressed (Ogg Vorbis)
- [ ] .import files committed

### Code
- [ ] Debug prints removed or behind flag
- [ ] Console logging minimal
- [ ] API keys removed (use environment variables)
- [ ] Encryption key set (if using script encryption)
- [ ] Crash handler configured

## Platform-Specific Checklist

### Windows
- [ ] Code signing certificate obtained
- [ ] signtool configured
- [ ] Icon in .ico format
- [ ] File version metadata set

### macOS
- [ ] Code signing certificate (Apple Developer)
- [ ] Bundle identifier unique
- [ ] Notarization configured
- [ ] Universal binary (arm64 + x86_64)

### Linux
- [ ] AppImage or Flatpak configured
- [ ] .desktop file created

### Android
- [ ] Keystore generated and secured
- [ ] Package name unique
- [ ] Target API level set
- [ ] Permissions minimal
- [ ] App Bundle (.aab) for Play Store

### iOS
- [ ] Provisioning profile installed
- [ ] App icon all required sizes
- [ ] Launch screen configured
- [ ] Privacy descriptions added

### Web
- [ ] Custom HTML shell (if needed)
- [ ] WebGL 2.0 required checked
- [ ] Progressive Web App (if applicable)
- [ ] Compression enabled for hosting

## CI/CD Checklist
- [ ] Godot headless binary available in CI
- [ ] Export templates cached or downloaded
- [ ] Build script created
- [ ] Artifacts uploaded
- [ ] Version stamped automatically
- [ ] Release notes generated
