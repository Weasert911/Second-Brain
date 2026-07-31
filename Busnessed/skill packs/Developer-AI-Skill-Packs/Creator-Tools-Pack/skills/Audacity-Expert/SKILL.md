---
name: Audacity-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about Audacity for audio recording, editing, noise reduction, multi-track mixing, effects, or podcast production.
purpose: Provide expert-level guidance on Audacity for audio recording, editing, restoration, mixing, effects processing, and podcast production.
---

## Capabilities

- Set up audio recording with input device selection, monitoring, and level adjustment
- Edit waveforms with cut, copy, paste, trim, silence, and duplicate operations
- Apply precise selection techniques: click, drag, spectrogram-based selection
- Process audio with effects: equalization, compression, reverb, delay, chorus, phaser, wahwah
- Perform noise reduction using noise profile sampling and spectral editing
- Mix multiple tracks with volume and pan adjustments
- Edit volume and pan envelopes for dynamic changes over time
- Create and manage label tracks for chapter markers and regions
- Export audio in MP3, WAV, FLAC, OGG, and other formats
- Convert sample rate and bit depth between formats
- Automate repetitive tasks with batch processing chains
- Restore old recordings with click removal, EQ, and noise reduction
- Isolate vocals from mixed tracks using vocal reduction/isolation
- Produce complete podcast episodes with intro, outro, and ads

## Limitations

- Cannot process video files; audio-only editor
- MIDI editing and virtual instrument support is limited
- Real-time effects processing is not as robust as DAW alternatives
- Plugin format support is limited to VST 2 (VST 3 not supported)
- Multi-track count may impact performance on large projects
- No built-in pitch correction like professional DAWs

## Required Tools

- Audacity 3.4+ installed
- Audio interface for quality recording
- Headphones or monitors for accurate monitoring
- VST plugins for advanced effects (optional)
- FFmpeg import/export library for additional format support

## Execution Workflow

1. Determine audio project type: recording, editing, restoration, mixing, or podcast
2. Set up project sample rate (44100 Hz for music, 48000 Hz for video)
3. Configure input device and recording levels (peak at -6dB)
4. Record or import audio tracks
5. Apply noise reduction: sample noise profile, apply reduction
6. Edit waveforms: trim silence, remove mistakes, arrange clips
7. Apply effects: EQ, compression, normalization per track
8. Create label tracks for chapters or regions
9. Mix tracks: balance volumes, apply pan, add effects sends
10. Export in required format with appropriate bitrate/settings
11. Save project file (.aup3) for future edits
12. Archive raw recordings separately

## Decision Tree

- Project type → {Recording, Editing, Restoration, Mixing, Podcast, Batch processing}
- Source quality → {Clean recording, Noisy recording, Old recording, Low bitrate, Streaming rip}
- Output format → {WAV (master), MP3 (distribution), FLAC (archive), OGG (streaming)}
- Sample rate → {44100 Hz (music), 48000 Hz (video), 96000 Hz (high-res)}
- Bit depth → {16-bit (CD quality), 24-bit (production), 32-bit float (processing)}
- Effect chain → {EQ → Compress → Limit, Noise reduce → EQ → Normalize, Chain preset}
- Stereo handling → {Mono mix, Stereo preserve, Split to mono, Pan individual}
- Restoration needed → {Click removal, Noise reduction, EQ cleanup, Spectral editing}

## Review Checklist

- [ ] Recording levels peaked at -6dB to -3dB (no clipping)
- [ ] Sample rate appropriate for project (44100/48000 Hz)
- [ ] Bit depth appropriate (16-bit for delivery, 24/32 for production)
- [ ] Noise profile sampled from clean section
- [ ] Noise reduction applied without artifacts (no "underwater" sound)
- [ ] EQ balances frequency spectrum (no muddiness or harshness)
- [ ] Compression evens out dynamics without pumping
- [ ] Volume envelopes smooth and natural
- [ ] Label tracks accurately placed for chapters
- [ ] Export format and settings match delivery requirements

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Audio clipping | Input level too high | Reduce input gain, re-record if necessary |
| Background noise | Room noise or electrical hum | Use noise reduction, EQ to cut low frequencies |
| "Underwater" sound after noise reduction | Too much reduction | Reduce noise reduction dB, increase sensitivity |
| Audio pops and clicks | Digital errors or bad cable | Use click removal effect, replace cable |
| MP3 export fails | LAME encoder not installed | Install LAME MP3 encoder from Audacity website |
| Latency during recording | Buffer size too large | Reduce audio buffer in preferences |
| Tracks out of sync | Different sample rates | Convert all tracks to same sample rate |
| Volume too quiet overall | Low input or master volume | Normalize to -1dB, check master volume |
| Hiss in quiet sections | Noise floor too high | Apply noise gate or gentle noise reduction |
| Plugin not found | Wrong plugin format | Only VST 2 plugins work; use 32-bit version if needed |
| Envelope not affecting play | Envelope disabled | Check envelope visibility and enable in track menu |
| Export sounds distorted | Bit depth too low for processing | Use 32-bit float for editing, convert on export |

## Best Practices

- Always record at 24-bit, 48000 Hz minimum for production quality
- Save noise profile separately for consistent noise reduction across recordings
- Apply EQ before compression for cleaner results
- Use high-pass filter on dialogue (80-100 Hz) to remove rumble
- Normalize to -1dB after all processing for consistent loudness
- Save project file before applying destructive edits
- Use labels to mark sections for easy navigation
- Export master as WAV/FLAC, distribution copy as MP3
- Keep raw recordings archived separately from edited versions
- Use spectrogram view for precision editing of problematic frequencies

## Anti-Patterns

- Applying noise reduction to entire track without sampling properly
- Using compression before EQ (EQ reveals issues compression hides)
- Normalizing before noise reduction (amplifies noise)
- Exporting MP3 directly from recording without processing
- Editing destructively without keeping undo history or backups
- Using too much compression causing audible pumping
- Ignoring DC offset that causes clicks at waveform starts
- Mixing different sample rates in same project
- Applying reverb to voice tracks for podcast (sounds unnatural)
- Failing to leave headroom (-6dB to -3dB) before mastering

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
