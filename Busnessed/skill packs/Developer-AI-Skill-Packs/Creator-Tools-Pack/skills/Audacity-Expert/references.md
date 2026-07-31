# Audacity-Expert References

## Official Documentation

- [Audacity Manual](https://manual.audacityteam.org/) — Complete user manual and feature documentation
- [Audacity Wiki](https://wiki.audacityteam.org/) — Community documentation, tips, and tutorials
- [Audacity Effects Guide](https://manual.audacityteam.org/man/effects_menu.html) — Complete effects reference with parameters
- [Audacity FAQ](https://manual.audacityteam.org/man/faq.html) — Frequently asked questions and troubleshooting
- [Audacity Keyboard Shortcuts](https://manual.audacityteam.org/man/keyboard_shortcut_reference.html) — Complete keyboard shortcut reference
- [Audacity Chains Documentation](https://manual.audacityteam.org/man/chain_commands.html) — Batch processing chains

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Sample Rate** | Number of audio samples per second (Hz) |
| **Bit Depth** | Number of bits per sample (16, 24, 32 float) |
| **Clipping** | Distortion from signal exceeding maximum level (0 dBFS) |
| **Noise Floor** | Background noise level when no signal is present |
| **Headroom** | Space between peak level and 0 dBFS (typically 6 dB) |
| **EQ** | Equalization — adjusting frequency balance |
| **Compression** | Reducing dynamic range between loud and quiet parts |
| **Limiter** | Hard ceiling preventing signal exceeding threshold |
| **Normalization** | Adjusting overall gain to target peak level |
| **Noise Gate** | Muting audio below a set threshold |
| **FFT** | Fast Fourier Transform — used in spectral analysis |
| **DC Offset** | Constant voltage shift causing waveform center offset |
| **Label Track** | Track containing time-stamped text markers |
| **Chain** | Preset sequence of effects for batch processing |
| **Spectral Selection** | Selecting audio in frequency domain via spectrogram |

## Conventions / Naming Standards

- Project files: `project_name.aup3`
- Raw recordings: `date_source_take.wav` (e.g., `20260115_Interview_Take1.wav`)
- Edited files: `project_description_v2.wav` (e.g., `Podcast_Episode42_v2.wav`)
- Exports: `project_format_settings.ext` (e.g., `Podcast_MP3_192k.mp3`)
- Label tracks: `Labels_Description` (e.g., `Labels_Chapters`)
- Chain presets: `Chain_Purpose.txt` (e.g., `Chain_Podcast_Export.txt`)

## Architecture / Workflow Notes

Audacity processes audio in a destructive editing paradigm: effects modify waveform data permanently (unless undone). The project file (.aup3) stores all audio data and edit history. Multi-track mixing is performed in real-time during playback.

**Audio pipeline:** Input → Recording → Track → Effects (chain) → Mix → Normalize → Export

**Processing order recommendation:** Noise reduction → High-pass filter → EQ → Compression → Limiting → Normalization

## Key Tools / Commands

- `Ctrl+I` — Import audio
- `Shift+R` — Start/stop recording
- `Space` — Play/stop
- `Ctrl+X` — Cut
- `Ctrl+C` — Copy
- `Ctrl+V` — Paste
- `Delete` — Delete selected audio
- `Ctrl+L` — Silence audio
- `Ctrl+T` — Trim audio outside selection
- `Ctrl+D` — Duplicate selection
- `Ctrl+M` — Add label at selection
- `Shift+Z` — Zoom to selection
- `Ctrl+1` — Zoom in
- `Ctrl+3` — Zoom to fit
- `Shift+Left/Right` — Snap to nearest zero crossing

## Recommended Project Structure

```
audio-projects/
├── recordings/
│   ├── raw/
│   │   ├── interview_guest1.wav
│   │   ├── interview_guest2.wav
│   │   └── voiceover.wav
│   ├── music/
│   ├── sfx/
│   └── room_tone/
├── projects/
│   ├── podcast_ep42.aup3
│   └── podcast_ep43.aup3
├── exports/
│   ├── master/
│   │   └── podcast_ep42_master.wav
│   ├── mp3/
│   │   └── podcast_ep42.mp3
│   └── segments/
├── chains/
│   ├── podcast_export.txt
│   └── vocal_cleanup.txt
└── labels/
    └── chapter_templates.txt
```
