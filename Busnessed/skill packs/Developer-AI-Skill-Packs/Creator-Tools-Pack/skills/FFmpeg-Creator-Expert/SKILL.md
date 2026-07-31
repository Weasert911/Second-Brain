---
name: FFmpeg-Creator-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about FFmpeg commands for video transcoding, audio processing, video filters, compression, streaming, or batch media processing.
purpose: Provide expert-level guidance on FFmpeg for video and audio processing including transcoding, filtering, streaming, and batch automation.
---

## Capabilities

- Transcode video between formats with codec selection, CRF, and preset tuning
- Apply video filters: scale, crop, rotate, pad, overlay, concat, drawtext, and more
- Process audio: adjust volume, pan, mix, detect silence, and sync tracks
- Handle subtitles: burn-in, extract, convert between SRT/ASS/SSA formats
- Create GIF animations from video segments
- Extract frames for thumbnails at specified intervals
- Compress video for social media platforms with platform-specific settings
- Write batch processing scripts for automated workflows
- Accelerate encoding with NVENC, QSV, VideoToolbox, and VAAPI
- Generate HLS and DASH streaming manifests
- Manipulate metadata and chapter markers
- Stabilize shaky footage with vid.stabilizer filter
- Convert color spaces between Rec.709, Rec.2020, and other standards

## Limitations

- Cannot execute remote FFmpeg commands; provides command strings for local use
- Hardware acceleration support varies by GPU model and driver version
- Cannot debug specific file corruption issues without access to the media file
- Container format compatibility must be verified against target player
- Audio mastering at professional music-production depth is outside scope

## Required Tools

- FFmpeg 6.0+ installed and accessible from command line
- ffprobe for media analysis
- Hardware GPU drivers for accelerated encoding (NVIDIA, AMD, Intel, Apple)
- Python or bash for batch scripting (optional)

## Execution Workflow

1. Analyze source media with ffprobe to determine codec, resolution, bitrate, and duration
2. Identify target format requirements: container, codec, resolution, bitrate
3. Select appropriate video codec based on target platform and hardware
4. Choose rate control mode: CRF for quality, CBR/VBR for streaming
5. Apply video filters in correct order (scale before crop, filter before encode)
6. Configure audio stream: codec, bitrate, channels, sample rate
7. Handle subtitle stream: burn-in, passthrough, or extract
8. Set container format and add metadata if needed
9. Execute encoding command and monitor progress
10. Verify output with ffprobe and visual inspection
11. Adjust parameters if quality or file size unacceptable
12. Integrate into batch script if processing multiple files

## Decision Tree

- Input format → {MP4, MOV, AVI, MKV, WebM, GIF, Image sequence}
- Target codec → {H.264 (compatible), H.265 (efficient), VP9 (open), AV1 (future), ProRes (editing)}
- Rate control → {CRF (quality), CBR (streaming), VBR (efficient), CQP (consistent)}
- Hardware encode → {NVENC, QSV, AMF, VideoToolbox, VAAPI, None (software)}
- Video filter → {Scale, Crop, Overlay, Concat, Drawtext, Subtitles, Stabilize, ColorSpace}
- Audio processing → {Volume, Pan, Mix, Silence detect, Sync, Extract}
- Output use → {Web upload, Archival, Editing, Streaming, Thumbnail, GIF}
- Batch type → {Single file, All files in folder, Pattern match, List file}

## Review Checklist

- [ ] Source media analyzed with ffprobe
- [ ] Codec selection matches target platform requirements
- [ ] CRF or bitrate setting produces acceptable quality
- [ ] Video filter chain produces expected visual result
- [ ] Audio is correctly synced and no clipping occurs
- [ ] Subtitles display correctly (burn-in or external)
- [ ] Output container compatible with target player
- [ ] File size within acceptable range for use case
- [ ] Metadata and chapter markers preserved or set correctly
- [ ] Hardware acceleration utilized if available
- [ ] Batch script handles error conditions gracefully
- [ ] Final output verified by playback and inspection

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| "Unknown encoder" error | FFmpeg compiled without codec | Use different codec or recompile FFmpeg |
| A/V sync drift | Variable frame rate input | Use -vsync vfr or convert CFR first |
| Hardware encoder not found | Missing driver or wrong FFmpeg build | Install GPU drivers and appropriate FFmpeg build |
| Encoded video blocky | Bitrate too low for resolution | Increase CRF value (lower number) or raise bitrate |
| Audio out of sync | Incorrect -itsoffset or filter delay | Use -af apad or -async 1 to synchronize |
| Overlay not positioned correctly | Incorrect coordinate math | Verify overlay=x:y relative to input resolution |
| Concat fails with non-identical streams | Stream parameters must match | Re-encode to matching codec/parameters before concat |
| GIF too large | Too many colors or high resolution | Reduce palette colors to 128 or reduce frame rate |
| Subtitles not showing | Burn-in requires video re-encode | Use -vf subtitles=file.srt with libx264 |
| HLS segments out of order | Incorrect segment start number | Set -start_number and -segment_start_number |
| Slow encodes | Software encoding without optimization | Use -preset ultrafast or switch to hardware encoder |
| Metadata lost after conversion | Container doesn't support metadata | Use MKV or MOV container, or remux separately |

## Best Practices

- Always run ffprobe analysis before encoding to understand source properties
- Use CRF 18-23 for H.264 archival quality (lower = better)
- Apply -movflags +faststart for web-optimized MP4 files
- Use -map 0 to include all streams from input
- Specify -c copy for stream copying when no transcoding needed
- Order video filters from computationally inexpensive to expensive
- Use -ss before -i for faster seeking in long files
- Test with 30-second segment before processing full file
- Use -progress - for real-time encoding status in scripts
- Keep ffmpeg updated to latest stable version for new codecs

## Anti-Patterns

- Re-encoding lossless files when stream copy (-c copy) would suffice
- Using CRF 0 (lossless) for distribution — file sizes are enormous
- Applying -filter_complex unnecessarily when simple filters work
- Ignoring audio track mapping leading to silent output
- Forgetting -pix_fmt yuv420p for maximum compatibility
- Using -vf and -af when -filter_complex is required for multi-input operations
- Not testing command on short sample before full batch processing
- Overwriting source files accidentally — always output to different path
- Using extremely high -preset values (placebo) for minimal gain with huge time cost
- Assuming all players support 10-bit color or high profile levels

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
