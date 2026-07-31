# OBS-Expert References

## Official Documentation

- [OBS Studio Manual](https://obsproject.com/wiki/OBS-Studio-Overview) — Complete user guide for all OBS features
- [OBS Studio API Documentation](https://github.com/obsproject/obs-studio/wiki/OBS-Studio-API) — Plugin and script development guide
- [OBS Forums](https://obsproject.com/forum/) — Community support and troubleshooting
- [OBS Log Analyzer](https://obsproject.com/tools/analyzer) — Analyze OBS logs for performance issues
- [OBS Plugin Repository](https://obsproject.com/forum/resources/) — Official plugin and script resources
- [OBS GitHub Repository](https://github.com/obsproject/obs-studio) — Source code and development resources

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Scene** | Collection of sources configured for a specific view or purpose |
| **Source** | Individual element within a scene (game capture, camera, image, text) |
| **Transition** | Visual effect when switching between scenes |
| **Stinger** | Video file transition played when scene changes |
| **Encoder** | Software or hardware component that compresses video for streaming |
| **NVENC** | NVIDIA hardware encoder for video compression |
| **Bitrate** | Amount of data used per second of video (Kbps or Mbps) |
| **CRF** | Constant Rate Factor — quality-based encoding control |
| **VBR** | Variable Bit Rate — adjusts bitrate based on scene complexity |
| **CBR** | Constant Bit Rate — maintains fixed bitrate throughout stream |
| **Noise Gate** | Filter that mutes audio below a set threshold |
| **Noise Suppression** | Filter that removes background noise from audio |
| **Compressor** | Audio filter reducing dynamic range |
| **Replay Buffer** | Temporary memory buffer capturing recent gameplay for instant replay |
| **NDI** | Network Device Interface for video over IP transmission |

## Conventions / Naming Standards

- Scenes: `Section_Description` (e.g., `Stream_Starting`, `Game_Overwatch`, `BRB`)
- Sources: `Type_Description` (e.g., `Game_Capture_Overwatch`, `Cam_Logitech`, `Alert_Donations`)
- Audio Sources: `Type_Description` (e.g., `Mic_ShureSM7B`, `Desktop_Audio`, `Music_Spotify`)
- Scene Collections: `Platform_ContentType` (e.g., `Twitch_Gaming`, `YouTube_Tutorial`)
- Profiles: `Encoder_Hardware_Settings` (e.g., `NVENC_Twitch_1080p60`)
- Browser Sources: `Service_Widget` (e.g., `Streamlabs_Alerts`, `Twitch_Chat`)

## Architecture / Workflow Notes

OBS captures video and audio sources, processes them through filters, composites scenes, and encodes output. The pipeline order: Source capture → Filter chain → Scene composition → Transition → Encoder → Output (stream/file).

**Stream Pipeline:** Capture → GPU render → Encoder → Network → Platform ingest
**Recording Pipeline:** Capture → GPU render → Encoder → File container → Storage

## Key Tools / Commands

- `Ctrl+N` — New scene collection
- `Ctrl+S` — New scene
- `Ctrl+Shift+S` — Start/stop recording
- `Ctrl+Shift+B` — Start/stop streaming
- `Ctrl+Shift+R` — Replay buffer save
- `Ctrl+Shift+C` — Create new source
- `Ctrl+E` — Edit current source properties
- `Ctrl+F` — Fit source to screen
- `Ctrl+D` — Transform controls
- `Alt+Drag` — Crop source edges
- `Ctrl+Shift+M` — Studio mode toggle
- `F1-F8` — Default scene switch hotkeys

## Recommended Project Structure

```
obs-projects/
├── scenes/
│   ├── Twitch_Gaming/
│   │   ├── overlays/
│   │   ├── alerts/
│   │   └── stinger.mp4
│   ├── YouTube_Tutorial/
│   │   ├── overlays/
│   │   ├── intros/
│   │   └── transitions/
│   └── Podcast_Audio/
├── recordings/
│   ├── raw/
│   ├── highlights/
│   └── replay_buffer/
├── media/
│   ├── images/
│   │   ├── logos/
│   │   ├── backgrounds/
│   │   └── screenshots/
│   ├── video/
│   │   ├── intros/
│   │   └── stingers/
│   └── audio/
│       ├── sfx/
│       └── music/
├── logs/
└── backups/
    └── scene_collections/
```
