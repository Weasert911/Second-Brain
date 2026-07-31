# Blender-Expert Checklists

## Pre-Flight Checklist

- [ ] Blender version confirmed (4.0+ recommended)
- [ ] Scene units set to real-world scale (metric or imperial)
- [ ] Reference images collected and imported
- [ ] Auto-save enabled with 5-minute interval
- [ ] Render engine selected (EEVEE for preview, Cycles for final)
- [ ] Output resolution and frame rate configured
- [ ] Viewport performance settings adjusted (shading, subdivision levels)
- [ ] Linked libraries and assets are accessible
- [ ] Saved backup of current project
- [ ] Add-ons required are enabled in Preferences

## Implementation Checklist

- [ ] Base geometry created with proper topology flow
- [ ] Modifier stack order is logical and correct
- [ ] UV unwrapping completed with adequate texel density
- [ ] Materials assigned with correct shader node setup
- [ ] Textures imported with correct color space settings
- [ ] Lighting rig produces desired mood and clarity
- [ ] Camera composition follows visual guidelines
- [ ] Rigging constraints and drivers are properly set
- [ ] Weight painting produces smooth deformations
- [ ] Animation keyframes have clean interpolation

## Testing Checklist

- [ ] Render test at low samples confirms composition
- [ ] UV checker texture test reveals stretching
- [ ] Material preview renders correctly in viewport
- [ ] Armature deformations tested at extreme poses
- [ ] Animation plays at correct speed without popping
- [ ] Particle systems respect emission constraints
- [ ] Geometry nodes produce expected output
- [ ] Compositor output matches intended look
- [ ] Export file opens correctly in target application
- [ ] Memory usage stays within available limits

## Release Checklist

- [ ] Scene file cleaned: unused data blocks removed
- [ ] Textures packed into .blend or externally referenced
- [ ] All object names follow naming convention
- [ ] Collections organized for easy navigation
- [ ] Render output at final quality settings complete
- [ ] Exported formats verified in target software
- [ ] Backup .blend saved to project archive
- [ ] Documentation notes prepared for team
- [ ] Version number incremented if iterative project
- [ ] License and usage terms noted for distribution

## Maintenance Checklist

- [ ] Blender version updates checked quarterly
- [ ] Add-on compatibility verified after updates
- [ ] Texture maps archived with source files
- [ ] Project folder backed up to external drive
- [ ] Outdated asset references updated
- [ ] Render farm or batch processing scripts validated
- [ ] Custom node groups saved as presets
- [ ] Keyboard shortcuts and keyconfig exported
