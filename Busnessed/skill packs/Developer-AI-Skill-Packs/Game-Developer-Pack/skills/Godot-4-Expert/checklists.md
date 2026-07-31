# Godot 4 Expert - Checklists

## Pre-Flight Checklist

### Environment
- [ ] Godot 4.2+ installed (verify with --version)
- [ ] Project opened successfully without errors
- [ ] Export templates installed for all target platforms
- [ ] Git repository initialized (git init)
- [ ] .gitignore configured for Godot (godot/, .import/, export/)
- [ ] Android SDK + JDK configured (for Android export)
- [ ] iOS certificates and provisioning profiles (for iOS export)
- [ ] WebAssembly toolchain (for HTML5 export)

### Project Settings
- [ ] Project name set (Project > Project Settings > General > Application)
- [ ] Version number set (major.minor.patch format)
- [ ] Default texture filter set (nearest for pixel art, linear otherwise)
- [ ] Window size and stretch mode configured
- [ ] Physics FPS set (default 60, consider 120 for competitive)
- [ ] Physics layer names configured (Project > Layer Names)
- [ ] Input Map actions defined
- [ ] Audio bus layout configured
- [ ] Default gravity set
- [ ] Rendering method selected (Forward+ for desktop, Mobile for mobile/web)
- [ ] Target FPS limit set (vsync or max fps)

### Assets
- [ ] All textures imported with correct settings
- [ ] Audio files imported (prefer .ogg for music, .wav for SFX)
- [ ] Fonts imported and configured
- [ ] 3D models imported with correct scale and rotation
- [ ] .import files committed to version control
- [ ] Asset licenses documented

## Implementation Checklist

### Scene Architecture
- [ ] Each logical entity has its own scene (.tscn)
- [ ] Scene root node matches purpose (Node2D, CharacterBody2D, etc.)
- [ ] Nodes follow PascalCase naming convention
- [ ] Scene tree depth is 6 levels or fewer
- [ ] No orphaned node references
- [ ] All exported variables have @export annotations
- [ ] All signals connected via code (not editor connections)
- [ ] Autoload singletons are minimal and purposeful
- [ ] Custom resources used for data-driven design
- [ ] PackedScene used for instantiation (not scene file path strings)

### Physics
- [ ] Collision layers and masks configured for all physics bodies
- [ ] CharacterBody uses move_and_slide() for movement
- [ ] RigidBody uses proper mass, friction, and bounce
- [ ] Area2D/3D connected to body_entered / body_exited
- [ ] Collision shapes are simple (circle, rectangle, capsule)
- [ ] No overlapping collision shapes
- [ ] One-way collision configured where needed
- [ ] Raycasts and ShapeCast have proper collision mask
- [ ] Physics queries use physics layers correctly

### Input
- [ ] Input Map actions defined for all game actions
- [ ] Input.get_axis() used for directional input
- [ ] Input.get_vector() used for analog input
- [ ] Touch input supported (touch events or virtual joystick)
- [ ] Gamepad support tested with common controllers
- [ ] Input remapping UI implemented
- [ ] Keyboard navigation for UI menus
- [ ] Input buffering for precise timing actions

### Animation
- [ ] AnimationPlayer nodes properly named
- [ ] AnimationTree configured with state machine
- [ ] Blend times set for smooth transitions
- [ ] Animations loop correctly where needed
- [ ] Animation length matches intended timing
- [ ] Callback tracks used for event-triggered animations
- [ ] One-shot animations clean up properly

### Audio
- [ ] Audio buses configured (Master, Music, SFX, Voice)
- [ ] Audio effects added (reverb, compressor for ambience)
- [ ] Audio files in correct format (Ogg Vorbis for music, WAV for SFX)
- [ ] Volume saved in settings
- [ ] Audio attenuation configured for 2D/3D positional audio
- [ ] Music crossfade implemented for scene transitions
- [ ] SFX pool / queue for multiple simultaneous sounds

### UI
- [ ] Containers used for responsive layout
- [ ] Theme resource applied consistently
- [ ] Label text uses translation keys
- [ ] Min size set for buttons and controls
- [ ] Focus chain configured for controller navigation
- [ ] UI scales properly on different resolutions
- [ ] RichTextLabel uses BBCode correctly
- [ ] Touch controls show/hide based on platform

### Save System
- [ ] Save directory created on init
- [ ] Serialization via Resource or ConfigFile
- [ ] Checksum for save integrity
- [ ] Backup saves maintained
- [ ] Corrupted save files handled gracefully
- [ ] Multiple save slots supported
- [ ] Save file encryption for sensitive data
- [ ] Cloud save support considered

## Testing Checklist

### Platform Testing
- [ ] Windows build test (clean install, all features)
- [ ] Linux build test (Steam Deck compatibility)
- [ ] macOS build test (Retina display, Metal)
- [ ] Android build test (various screen sizes, touch)
- [ ] iOS build test (notch, safe areas)
- [ ] Web build test (WebGL 2.0, input latency)
- [ ] Console build test (if applicable)

### Edge Cases
- [ ] Empty save slot / first launch
- [ ] Corrupted save file handling
- [ ] Lost focus / minimize + restore
- [ ] Alt+Tab / window resize
- [ ] Screen resolution changes
- [ ] Multiple monitor setup
- [ ] Controller disconnect/reconnect during gameplay
- [ ] Low battery warning (mobile)
- [ ] Incoming call / notification interruption (mobile)
- [ ] No internet connection (for online features)
- [ ] Extremely fast / slow hardware
- [ ] Very short or very long play sessions

### Performance
- [ ] Maintains 60 FPS on target hardware (30 FPS minimum)
- [ ] Physics timestep consistent (no jitter)
- [ ] No memory leaks after extended play
- [ ] Load times under 10 seconds per scene
- [ ] No frame drops during combat or particle effects
- [ ] Draw calls under 200 for mobile, 500+ for desktop
- [ ] Texture memory within budget
- [ ] No orphan nodes after scene transitions

## Release Checklist

### Export Settings
- [ ] Export presets created for all platforms
- [ ] Export path configured
- [ ] Custom icon set for each platform
- [ ] Version number matches project settings
- [ ] Encryption key set (if using script encryption)
- [ ] Debug/Release builds differentiated
- [ ] Embed PCK / export as ZIP configured
- [ ] Code signing certificate acquired
- [ ] .pck file size optimization (remove unused resources)

### Pre-Submission
- [ ] All debug prints removed or behind DEBUG flag
- [ ] Console logging minimal for release
- [ ] Crash handler reporting endpoint configured
- [ ] GDPR consent dialog (for EU users)
- [ ] Privacy policy accessible
- [ ] Terms of service screen
- [ ] IAP products configured (stores)
- [ ] Ad SDK integrated and tested
- [ ] Analytics events implemented
- [ ] Rate/prompt dialog configured

### Store Requirements
- [ ] App icons in all required sizes
- [ ] Screenshots and trailers prepared
- [ ] Store description written (localized)
- [ ] Age rating obtained
- [ ] Content rating questionnaire completed
- [ ] Pricing configured per region
- [ ] Release date scheduled
- [ ] Press kit prepared
- [ ] Beta testing group configured (Steam Playtest / TestFlight)

### Post-Release
- [ ] Crash reporting monitored for 48 hours
- [ ] User reviews monitored
- [ ] Day-one patch prepared
- [ ] Community channels opened (Discord, Reddit, Steam forums)
- [ ] Known issues documented
- [ ] Roadmap for future updates published

## Maintenance Checklist

### Version Compatibility
- [ ] Check for Godot minor version updates
- [ ] Test project on latest stable Godot version
- [ ] Review deprecated API calls
- [ ] Update export templates
- [ ] Verify asset compatibility with new renderer changes

### Regular Review
- [ ] No orphan resources in .import folder
- [ ] Script warnings and errors cleared
- [ ] GDScript analyzer hints addressed
- [ ] Redundant nodes removed
- [ ] Unused assets deleted
- [ ] Shader compilation cache cleared
- [ ] .godot folder size acceptable
- [ ] Commit history clean and descriptive
