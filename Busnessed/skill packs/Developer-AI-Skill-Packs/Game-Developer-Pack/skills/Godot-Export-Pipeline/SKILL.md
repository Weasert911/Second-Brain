---
name: "Godot Export Pipeline"
version: "1.0.0"
domain: "Game Development"
activation_description: "Godot export pipeline, CI/CD, and platform distribution"
purpose: "Make AI proficient in configuring export presets, managing asset pipelines, setting up CI/CD, code signing, and distributing games across platforms"
---

## Capabilities
- Configure export presets for all platforms (Windows, Linux, macOS, Android, iOS, Web)
- Manage platform-specific settings and optimizations
- Handle asset pipeline with .import file configuration
- Implement version stamping in builds
- Set up CI/CD with GitHub Actions for automated builds
- Configure automated build scripts
- Manage code signing certificates
- Prepare builds for app store submission
- Handle distribution delivery strategies

## Limitations
- Does not cover store-specific submission processes (Steam, App Store)
- Does not cover console SDK exports (PlayStation, Xbox, Switch)
- Does not cover Godot 3.x export differences

## Required Tools
- Godot 4.2+ with export templates
- CI/CD platform (GitHub Actions, GitLab CI, Jenkins)
- Code signing certificates
- Platform SDKs (Android SDK, Xcode, Emscripten)

## Export Platforms
- Windows: .exe, .pck or embedded
- Linux: .x86_64, AppImage
- macOS: .app bundle, .dmg
- Android: .apk, .aab (App Bundle)
- iOS: .ipa
- Web: HTML5 + WebAssembly

## Execution Workflow
1. Configure project settings for target platforms
2. Create export presets per platform
3. Set up icon and splash screen per platform
4. Configure code signing
5. Implement version numbering scheme
6. Set up CI/CD pipeline
7. Configure asset optimization for each platform
8. Test export builds
9. Automate build creation and deployment

## References
- See references.md for export configuration reference
- See examples.md for CI/CD pipeline examples
- See templates.md for export preset templates
- See checklists.md for pre-export checklist
- See snippets.md for export automation scripts
