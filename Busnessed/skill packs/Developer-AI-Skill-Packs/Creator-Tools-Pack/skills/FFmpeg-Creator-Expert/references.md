# FFmpeg-Creator-Expert References

## Official Documentation

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html) — Official manuals, filters, and codec documentation
- [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html) — Complete video/audio filter reference
- [FFmpeg Wiki](https://trac.ffmpeg.org/wiki) — Community wiki with encoding guides and tips
- [FFmpeg Codecs Documentation](https://ffmpeg.org/ffmpeg-codecs.html) — Codec-specific options and parameters
- [FFmpeg Protocols Documentation](https://ffmpeg.org/ffmpeg-protocols.html) — Streaming protocol configuration
- [FFmpeg Platform-Specific Builds](https://www.gyan.dev/ffmpeg/builds/) — Windows builds with hardware acceleration

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Codec** | Algorithm for compressing and decompressing digital media |
| **Container** | File format that holds video, audio, and metadata streams |
| **CRF** | Constant Rate Factor — quality-based rate control (lower = better) |
| **CBR** | Constant Bitrate — maintains fixed data rate throughout |
| **VBR** | Variable Bitrate — allocates more bits to complex scenes |
| **CQP** | Constant Quantization Parameter — fixed quality per frame |
| **Keyframe** | Complete frame used as reference for delta frames |
| **GOP** | Group of Pictures — distance between keyframes |
| **PTS** | Presentation Time Stamp — when to display a frame |
| **DTS** | Decoding Time Stamp — when to decode a frame |
| **SAR/DAR** | Sample Aspect Ratio / Display Aspect Ratio |
| **NVENC** | NVIDIA hardware video encoder |
| **QSV** | Intel Quick Sync Video hardware encoder |
| **VAAPI** | Video Acceleration API for Linux hardware encoding |
| **HLS** | HTTP Live Streaming — adaptive bitrate streaming protocol |
| **DASH** | Dynamic Adaptive Streaming over HTTP |

## Conventions / Naming Standards

- Output files: `inputname_converted.ext` (e.g., `video_h264.mp4`)
- Batch scripts: `encode_script.sh` or `encode_batch.ps1`
- Preset files: `preset_name.ffpreset`
- Filter chains: ordered from input to output, one per line in scripts
- Quality suffixes: `_crf18`, `_hq`, `_web`, `_proxy`, `_thumbnail`
- Date-suffixed: `project_YYYY-MM-DD.ext` for archival

## Architecture / Workflow Notes

FFmpeg processes media through a pipeline architecture: Input → Demuxer → Decoder → Filters → Encoder → Muxer → Output. Each stream can be independently routed, filtered, and encoded. Filter graphs are directed acyclic graphs (DAGs) connecting filter nodes.

**Common pipeline:** `ffmpeg -i input.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 23 -c:a aac output.mp4`

## Key Tools / Commands

- `ffmpeg -i input` — Analyze media file properties
- `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input` — Get duration
- `ffplay input` — Quick media playback and testing
- `ffmpeg -encoders` — List available encoders
- `ffmpeg -filters` — List available filters
- `ffmpeg -hwaccels` — List hardware acceleration methods

## Recommended Project Structure

```
media-projects/
├── input/
│   ├── video/
│   ├── audio/
│   ├── subtitles/
│   └── images/
├── output/
│   ├── web/
│   ├── archival/
│   ├── proxy/
│   ├── thumbnails/
│   ├── gifs/
│   └── audio/
├── scripts/
│   ├── batch/
│   ├── preset/
│   └── config/
└── logs/
```
