---
name: DaVinci-Resolve-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about DaVinci Resolve video editing, color grading, Fairlight audio, Fusion compositing, delivery, or post-production workflows.
purpose: Provide expert-level guidance on DaVinci Resolve for professional video editing, color correction, audio post-production, visual effects, and media delivery.
---

## Capabilities

- Configure project settings including timeline resolution, frame rate, and color management
- Execute cut page and edit page workflows with precision timeline editing
- Apply trim operations: ripple, roll, slip, slide, and dynamic trim
- Create and customize transitions and video effects
- Perform primary color correction using wheels, log wheels, and curves
- Manage color science with ACES, DaVinci YRGB, and Color Space Transform
- Create and apply PowerGrades, LUTs, and looks for consistent grading
- Mix and master audio in Fairlight with EQ, compression, noise gate, and reverb
- Build Fusion composites with nodes: merge, mask, transform, text+, and particles
- Configure delivery presets for YouTube, Vimeo, broadcast, and cinema
- Set up proxy workflows and optimized media for smooth editing
- Manage collaborative workflows with timeline locking and bins

## Limitations

- Cannot access or modify DaVinci Resolve project files directly
- Fusion particle and 3D compositing covered at intermediate depth only
- Advanced audio mastering for music production is outside scope
- Color management recommendations depend on delivery format and display calibration
- Cannot provide real-time monitoring or scopes; guidance is conceptual

## Required Tools

- DaVinci Resolve 18.5+ (Studio recommended for advanced features)
- Calibrated reference monitor for color grading
- External storage for media and proxies
- Audio interface for Fairlight recording and monitoring

## Execution Workflow

1. Determine project delivery requirements (resolution, frame rate, codec, color space)
2. Create project with appropriate settings including color management policy
3. Import media and organize into bins with metadata and smart bins
4. Perform initial assembly on timeline using cut page or edit page
5. Fine-cut editing with trim tools, transitions, and multi-cam sync
6. Apply primary color correction to balance shots across timeline
7. Perform secondary grading using qualifiers, windows, and tracking
8. Build Fusion effects and titles as required
9. Mix audio in Fairlight: dialogue, music, sound effects, and room tone
10. Apply mastering effects: compressor, limiter, loudness normalization
11. Set up delivery preset and export final render
12. Verify output meets delivery specifications

## Decision Tree

- Project type → {Short film, YouTube video, Broadcast commercial, Feature film, Corporate}
- Color management → {DaVinci YRGB, ACEScct, ACEScc, Custom}
- Editing approach → {Cut page speed, Edit page precision, Multi-cam}
- Grade complexity → {Primary only, Primary + secondary, HDR grade, Film emulation}
- Audio scope → {Basic leveling, Full mix with EQ/compression, 5.1 surround}
- Fusion need → {Titles only, Basic composites, Particle effects, 3D compositing}
- Delivery platform → {YouTube/Vimeo, Broadcast TV, Cinema DCP, Streaming}
- Performance issue → {Playback stutter, Slow render, Out of memory, Crash on export}

## Review Checklist

- [ ] Project settings match delivery requirements exactly
- [ ] Timeline resolution and frame rate are correct
- [ ] Bins are organized with consistent naming
- [ ] Edit has no jump cuts or unsightly transitions
- [ ] Color is balanced across all shots in a scene
- [ ] Skin tones fall within acceptable ranges on vectorscope
- [ ] Audio levels peak at -6dB to -3dB with -14 LUFS integrated loudness
- [ ] Fairlight mix is clean with proper EQ on dialogue
- [ ] Fusion composites render without artifacts
- [ ] Titles are legible and timed correctly
- [ ] Export settings match target platform specifications
- [ ] Rendered file passes QC review (no glitches, sync issues)

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Timeline stutters | High-resolution media without proxies | Generate optimized media or proxy files |
| Color grade shifts between shots | Mixed color space sources | Apply Color Space Transform to normalize |
| Audio out of sync | Variable frame rate media | Convert to constant frame rate before import |
| Fusion render slow | Complex node tree | Cache nodes or pre-render to image sequence |
| Export fails with error | Disk space or codec licensing | Free disk space or change codec |
| Skin tones look green | Unbalanced midtones | Adjust offset/wheel toward magenta |
| LUT looks too strong | Applied twice or wrong color space | Check LUT application and input color space |
| Noise in shadows | High ISO footage or underexposure | Apply temporal noise reduction in color page |
| Fairlight audio crackles | Buffer size too low | Increase buffer size in audio preferences |
| Multi-cam sync drifts | Non-timecode sources | Use waveform sync for audio-based alignment |

## Best Practices

- Set up color management before starting any grade work
- Organize media into bins before editing to save time
- Use PowerGrades for recurring looks across projects
- Apply noise reduction as first node in color grade chain
- Keep Fusion node trees organized with labels and colors
- Use labeled edit indices for complex timeline navigation
- Monitor audio on calibrated speakers or quality headphones
- Enable auto-backup with 15-minute intervals
- Use render cache for frequently played timeline sections
- Always verify export with a test render before final delivery

## Anti-Patterns

- Color grading without calibrated monitor leads to inconsistent results
- Applying effects directly on timeline clips instead of using adjustment layers
- Neglecting to normalize audio levels across clips
- Using too many nodes in a single serial chain without parallel mixing
- Exporting at different resolution than project timeline setting
- Ignoring color space tagging on import
- Overusing noise reduction causing plasticky skin texture
- Working without backups or project archives
- Using compressed proxy media for final color grading decisions
- Mixing Fairlight and clip-based audio effects without bus routing

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
