# Video-Compression-Expert References

## Official Documentation

- [FFmpeg Encoding Guide (x264)](https://trac.ffmpeg.org/wiki/Encode/H.264) — Comprehensive H.264 encoding guide
- [FFmpeg Encoding Guide (x265)](https://trac.ffmpeg.org/wiki/Encode/H.265) — HEVC/H.265 encoding guide
- [FFmpeg Hardware Acceleration](https://trac.ffmpeg.org/wiki/Hardware/QuickSync) — Hardware encoding support matrix
- [Netflix VMAF Documentation](https://github.com/Netflix/vmaf) — Video Multi-Method Assessment Fusion quality metric
- [Apple HEVC/H.265 Guide](https://developer.apple.com/documentation/avfoundation/hevc_encoding) — Apple's HEVC encoding recommendations
- [Google VP9 Encoding Guide](https://developers.google.com/media/vp9) — Official VP9 encoding parameters

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Codec** | Algorithm for compressing and decompressing digital video |
| **CRF** | Constant Rate Factor — quality-based rate control (lower = better quality) |
| **CBR** | Constant Bitrate — maintains fixed data rate (used for streaming) |
| **VBR** | Variable Bitrate — allocates bits based on scene complexity |
| **CQP** | Constant Quantization Parameter — fixed quality per macroblock |
| **GOP** | Group of Pictures — distance between keyframes |
| **Keyframe** | Full frame that can be decoded independently |
| **Bitrate** | Amount of data per second of video (Kbps or Mbps) |
| **Chroma Subsampling** | Compression of color information relative to luminance |
| **Bit Depth** | Number of bits per color channel (8, 10, 12) |
| **HDR** | High Dynamic Range — extended luminance and color range |
| **PQ** | Perceptual Quantizer (ST.2084) — HDR transfer function |
| **HLG** | Hybrid Log-Gamma — HDR standard for broadcast |
| **VMAF** | Video Multi-Method Assessment Fusion — perceptual quality metric |
| **SSIM** | Structural Similarity Index — quality measurement metric |

## Conventions / Naming Standards

- Encoded files: `source_codec_settings.ext` (e.g., `video_h264_crf18.mp4`)
- Encoding presets: `preset_platform_codec` (e.g., `preset_youtube_h264`)
- Batch scripts: `encode_script.py` or `batch_encode.sh`
- Quality metric files: `source_comparison_vmaf.csv`
- HDR metadata files: `hdr10_metadata.json`

## Architecture / Workflow Notes

Video encoding is a balance of quality, file size, and encoding speed. The "sweet spot" depends on delivery requirements. Modern codecs (H.265, VP9, AV1) offer ~30-50% better compression over H.264 at same quality.

**Bitrate ladder for adaptive streaming:** 144p (0.1-0.2 Mbps) → 240p (0.3-0.5) → 360p (0.5-1) → 480p (1-2) → 720p (2-5) → 1080p (5-10) → 1440p (10-20) → 4K (20-45)

## Platform Bitrate Guidelines

| Platform | Resolution | Codec | Max Bitrate | Audio |
|---|---|---|---|---|
| YouTube | 4K/1080p/720p | H.264/H.265/VP9/AV1 | 50 Mbps (4K) | AAC 384kbps |
| Twitch | 1080p/720p | H.264 | 6 Mbps (max) | AAC 160kbps |
| TikTok | 1080p | H.264 | 5 Mbps | AAC 128kbps |
| Instagram | 1080p | H.264 | 4 Mbps | AAC 128kbps |
| Vimeo | 4K/1080p | H.264/H.265 | 60 Mbps (4K) | AAC 320kbps |

## Key Tools / Commands

- `ffprobe input` — Media file analysis
- `ffmpeg -encoders | grep -i nvenc` — Check NVENC support
- `ffmpeg -hide_banner -version` — FFmpeg version and codecs
- `vmaf` — VMAF calculation tool
- `mediainfo input` — Detailed media information
- `ffmpeg -filters | grep -i scale` — Available scalers
- `ffmpeg -pix_fmts` — List pixel formats

## Recommended Project Structure

```
encoding-projects/
├── source/
│   ├── camera_original/
│   ├── screen_recording/
│   └── downloaded/
├── output/
│   ├── youtube/
│   │   ├── 4k/
│   │   ├── 1080p/
│   │   └── 720p/
│   ├── twitch/
│   ├── social/
│   ├── archival/
│   └── proxy/
├── scripts/
│   ├── batch_encode.py
│   ├── bitrate_calc.sh
│   └── quality_check.sh
├── presets/
│   ├── youtube_h264.ffpreset
│   ├── twitch_nvenc.txt
│   └── archive_h265.txt
├── metrics/
│   ├── vmaf_results/
│   ├── ssim_results/
│   └── comparison_shots/
└── logs/
```
