---
name: FFmpeg-Expert
version: 1.0.0
domain: Multimedia Processing
activation_description: Activate when processing, transcoding, or analyzing media files with FFmpeg
purpose: Master FFmpeg for video/audio transcoding, streaming, filter graphs, and batch media processing
---

# FFmpeg-Expert

## Capabilities
- Construct FFmpeg command lines with input, output, and filter graph options
- Select and configure codecs (libx264, libx265, VP9, AV1, ProRes, DNxHD)
- Choose container formats (MP4, MKV, MOV, WebM, AVI)
- Build filter graphs for scaling, cropping, trimming, concatenating, and overlays
- Process audio streams (volume, pan, mixing, silence detection)
- Handle subtitles (burn-in, extract, convert between formats)
- Leverage hardware acceleration (NVIDIA NVENC, Intel QSV, Apple VideoToolbox)
- Stream media via RTMP, HLS, and DASH protocols
- Create batch processing scripts for large media libraries
- Optimize quality vs file size tradeoffs for different distribution channels
- Manipulate metadata (title, artist, album art, chapters)
- Generate thumbnails and preview images from video

## Limitations
- Cannot encode certain proprietary codecs without proper licensing
- Cannot process encrypted media without appropriate keys
- Cannot guarantee frame-accurate cutting with all codecs (re-encode needed for accuracy)
- Cannot use hardware acceleration on all platforms or codecs
- Cannot process extremely high-resolution video without sufficient system memory
- Cannot fix severely corrupted media files that violate container specifications

## Required Tools
- FFmpeg (latest stable release)
- FFprobe (included with FFmpeg) for media analysis
- MediaInfo (optional, for additional analysis)
- Hardware acceleration drivers (NVIDIA, Intel, AMD as applicable)

## Execution Workflow

1. Analyze source media with ffprobe to determine codecs, resolution, bitrate
2. Define target requirements (codec, resolution, bitrate, container)
3. Select appropriate video codec (h.264 for compatibility, h.265/HEVC for efficiency, VP9/AV1 for web)
4. Select audio codec (AAC for compatibility, Opus for web)
5. Build filter graph for any transformations (scale, crop, trim, deinterlace)
6. Set encoding parameters (CRF/preset for x264/x265, bitrate for others)
7. Choose container format compatible with target use case
8. Configure hardware acceleration if applicable and needed
9. Run FFmpeg and monitor encoding progress
10. Verify output with ffprobe and visual inspection
11. Extract thumbnails or previews if needed
12. Process batch with shell script or parallel execution

## Decision Tree

```
What is the target use case?
├── Web streaming → H.264/AAC in MP4, or VP9/Opus in WebM
├── Archival → H.265/HEVC or lossless, MKV container
├── Broadcast → ProRes or DNxHD in MOV/MXF
├── Mobile → H.264/AAC lower resolution, bitrate
└── Social media → H.264/AAC, platform-specific max duration

Need hardware acceleration?
├── NVIDIA GPU → h264_nvenc, hevc_nvenc
├── Intel GPU → h264_qsv, hevc_qsv
├── Apple Silicon → h264_videotoolbox, hevc_videotoolbox
└── CPU only → libx264, libx265 (software encoding)

What quality setting?
├── Maximum quality → CRF 18 (x264), CRF 22 (x265), preset slow/veryslow
├── Balanced → CRF 23 (x264), CRF 28 (x265), preset medium
├── Small file → CRF 28 (x264), CRF 35 (x265), preset fast/veryfast
└── Target bitrate → Use -b:v with 2-pass for precise size control

Need editing operations?
├── Trim → -ss and -to/-t flags
├── Multiple clips → Concat demuxer or concat filter
├── Overlay → overlay filter in filter graph
└── Audio mixing → amix filter for multi-track mixing
```

## Review Checklist
- [ ] Source media analyzed with ffprobe before processing
- [ ] Codec choice appropriate for target use case
- [ ] CRF/bitrate settings balance quality and file size
- [ ] Hardware acceleration used if available and beneficial
- [ ] Filter graph produces correct output dimensions and effects
- [ ] Audio streams handled correctly (codec, channels, bitrate)
- [ ] Container format compatible with playback target
- [ ] Metadata preserved or correctly modified
- [ ] Batch script handles errors (corrupt files, wrong codecs)
- [ ] Output verified after encoding
- [ ] Subtitles processed correctly (burned, extracted, or converted)
- [ ] Streaming outputs validated with test playback

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Encoding very slow | Software encoding with high quality preset | Use hardware acceleration or faster preset |
| Audio/video out of sync | Wrong vsync/async settings | Use `-vsync vfr` and `-async 1` |
| H.264 encoder not available | Missing library or build | Ensure libx264 is compiled in: `ffmpeg -encoders | grep 264` |
| Frame-accurate cut fails | Keyframe interval too large | Use `-c copy` only at keyframes; re-encode for accuracy |
| CUDA not detected | Missing NVIDIA drivers | Install proper driver; verify with `nvidia-smi` |
| Output file too large | Bitrate too high or CRF too low | Increase CRF value; lower bitrate setting |
| Hardware encoder produces artifacts | HW encoder quality vs software | Use software encoding for highest quality |
| Stream failed to connect | RTMP/RTSP URL incorrect | Verify URL format: `rtmp://server/app/stream` |

## Best Practices
- Always analyze source with ffprobe before encoding
- Use CRF-based encoding for consistent quality (target bitrate for size)
- Use `-preset slow` or `veryslow` for archival quality (software) or `fast` for speed
- Test with short segment before batch processing: `-t 60`
- Use `-movflags +faststart` for web-optimized MP4 (moov atom at front)
- Keep source files until output is verified
- Use batch scripts with error handling for large collections
- Document encoding parameters in metadata or sidecar files
- Use 2-pass encoding for target bitrate applications (streaming)
- Prefer MKV for archival (supports all codecs, chapters, attachments)
- Add `-y` flag with caution in batch scripts (overwrites without confirmation)
- Use `-stats_period` to control progress output frequency

## Anti-Patterns
- Re-encoding when stream copy would work (`-c copy`)
- Using lossless intermediates unnecessarily (huge file sizes)
- Not analyzing source before encoding (wrong params, wasted time)
- Batch transcoding without testing on sample files first
- Using default settings without understanding their implications
- Ignoring hardware acceleration when processing large batches
- Setting arbitrary bitrates without considering resolution/framerate
- Not preserving aspect ratio when scaling video
- Processing videos without sufficient disk space for output
- Using FFmpeg on copyrighted content without proper rights

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
