# Aseprite-Expert Checklists

## Pre-Flight Checklist

- [ ] Canvas resolution matches asset requirements
- [ ] Color mode selected (RGBA vs Indexed)
- [ ] Color palette created or imported
- [ ] Reference images collected
- [ ] Animation frames and timing planned
- [ ] Export format and settings determined
- [ ] Layers created with logical structure
- [ ] Grid and snap settings configured
- [ ] Pixel-perfect mode enabled for line art
- [ ] Auto-save settings configured

## Implementation Checklist

- [ ] Base shapes blocked in with main colors
- [ ] Line art layer clean and pixel-perfect
- [ ] Shading layer with consistent light source
- [ ] Highlights and specular details added
- [ ] Dithering applied for smooth transitions
- [ ] Anti-aliasing applied where appropriate
- [ ] Animation keyframes created using onion skin
- [ ] In-between frames fill motion gaps
- [ ] Frame tags assigned to all animation states
- [ ] Frame durations set for proper timing

## Testing Checklist

- [ ] Export preview matches source quality
- [ ] Animation plays smoothly without jitter
- [ ] Sprite sheet has consistent spacing
- [ ] JSON metadata matches frame positions
- [ ] Tile set tiles correctly in engine
- [ ] Palette swaps produce correct colors
- [ ] Colors don't bleed between frames in sheet
- [ ] Export file size manageable
- [ ] Character pivot point is consistent
- [ ] All animation states accessible in engine

## Release Checklist

- [ ] All sprite sheets exported with metadata
- [ ] Palette files saved separately
- [ ] Aseprite source files backed up
- [ ] Animation preview GIFs generated
- [ ] Tile index maps documented
- [ ] Naming convention followed consistently
- [ ] Exported files tested in target engine
- [ ] Asset list documented for development team
- [ ] All variants and palette swaps included
- [ ] Final export uses production settings

## Maintenance Checklist

- [ ] Aseprite version checked for updates
- [ ] Scripts tested after version updates
- [ ] Palette library organized and deduplicated
- [ ] Backup source files archived
- [ ] Export scripts updated for pipeline changes
- [ ] Tileset compatibility verified with engine updates
- [ ] Old asset versions archived with project notes
- [ ] Custom brushes and patterns saved for reuse
