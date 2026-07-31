---
name: Video-Compression-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about video compression, codec selection, bitrate settings, CRF tuning, encoding optimization, or platform-specific video quality guidelines.
purpose: Provide expert-level guidance on video compression including codec selection, rate control, quality tuning, hardware encoding, and platform-specific optimization.
---

## Capabilities

- Compare codecs: H.264, H.265/HEVC, VP9, AV1, ProRes, DNxHD for appropriate use
- Configure rate control modes: CBR, VBR, CRF, CQP for different scenarios
- Tune CRF values per codec for optimal quality-to-size ratio
- Select encoding presets and tuning for specific content types
- Determine resolution and bitrate guidelines per platform (YouTube, Twitch, TikTok, Instagram, Vimeo)
- Utilize encoding hardware: CPU (x264/x265) vs GPU (NVENC, QSV, AMF, VideoToolbox)
- Implement 2-pass encoding for consistent quality at target bitrate
- Choose between 10-bit and 8-bit encoding for color fidelity
- Configure chroma subsampling (4:4:4, 4:2:2, 4:2:0) for different use cases
- Set up HDR encoding with PQ, HLG, and HDR10+ metadata
- Create batch encoding scripts for automated processing
- Estimate file sizes before encoding
- Evaluate quality metrics: SSIM, PSNR, VMAF for objective comparison
- Optimize perceptual quality for human viewing

## Limitations

- Cannot guarantee specific bitrate/quality results without access to source media
- Hardware encoder quality varies by GPU generation and driver
- AV1 encoding is significantly slower than other codecs (software)
- Perceptual quality is subjective; metrics are approximations
- Platform-specific guidelines may change without notice

## Required Tools

- FFmpeg 6.0+ with required encoders
- MediaInfo or ffprobe for stream analysis
- GPU drivers for hardware encoding (NVIDIA, AMD, Intel, Apple Silicon)
- Quality metric tools: SSIM, PSNR, VMAF calculation (optional)
- Python or bash for batch encoding scripts

## Execution Workflow

1. Analyze source media: codec, resolution, bitrate, bit depth, chroma subsampling
2. Determine delivery platform and its requirements/limitations
3. Select target codec based on compatibility and efficiency needs
4. Choose rate control: CRF for quality target, CBR/VBR for bitrate target
5. Set resolution, frame rate, and pixel format for output
6. Configure encoder: preset, tuning, profile, level
7. Set audio codec and bitrate
8. Apply any preprocessing filters (denoise, deinterlace, resize)
9. Encode test segment (30-60 seconds) for quality check
10. Evaluate quality metrics and file size
11. Adjust parameters if needed and re-encode
12. Full encode with verified settings

## Decision Tree

- Delivery platform → {YouTube, Twitch, TikTok/Reels, Vimeo, Broadcast, Cinematic, Archival}
- Source quality → {High bitrate master, Camera raw, Compressed web, Screen recording}
- Codec choice → {H.264 (max compat), H.265 (efficient), VP9 (open), AV1 (future), ProRes (editing)}
- Hardware access → {NVIDIA NVENC, Intel QSV, AMD AMF, Apple VideoToolbox, CPU only}
- Rate control → {CRF (quality-first), CBR (streaming), VBR (efficient), CQP (consistent quant)}
- Color depth → {8-bit (compat), 10-bit (HDR/quality), 12-bit (professional)}
- Chroma subsampling → {4:2:0 (delivery), 4:2:2 (intermediate), 4:4:4 (master)}
- Performance priority → {Speed (live), Quality (archival), Balanced (on-demand)}

## Review Checklist

- [ ] Source analyzed with MediaInfo/ffprobe before encoding
- [ ] Codec selection appropriate for target platform
- [ ] Rate control mode matches delivery use case
- [ ] CRF value tuned for content type (lower for grainy/detailed)
- [ ] Resolution matches target platform guidelines
- [ ] Preset balances encoding speed and compression efficiency
- [ ] Audio codec and bitrate appropriate for content
- [ ] Pixel format and chroma subsampling correct (yuv420p for delivery)
- [ ] Hardware acceleration utilized if available
- [ ] Test segment verified before full encode
- [ ] Quality metrics acceptable (VMAF >90, SSIM >0.95)
- [ ] File size within expected range for delivery

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Blocky output at low bitrate | Insufficient bitrate for resolution | Reduce resolution or increase bitrate |
| Banding in gradients | 8-bit color depth limitation | Use 10-bit encoding or add dithering/noise |
| Slow encoding speed | Software encoder with veryslow preset | Use faster preset or switch to hardware encoder |
| Hardware encoder not found | Missing driver or wrong FFmpeg build | Install GPU drivers and appropriate FFmpeg build |
| AV1 encoding extremely slow | Software AV1 (libaom) is very slow | Use SVT-AV1 for faster AV1 encoding |
| VMAF score low | Content complexity vs bitrate mismatch | Increase bitrate or use more efficient codec |
| HDR colors washed out on SDR | Missing tone mapping | Tone map HDR to SDR for SDR delivery |
| Audio out of sync after encode | Frame rate or sample rate mismatch | Use -async 1 or -vsync vfr to correct |
| 2-pass encode doesn't improve quality | CBR/VBR not appropriate for content | Use CRF for consistent quality |
| ProRes file too large | ProRes is lossy but high bitrate | Accept large size for editing benefits |
| 10-bit file plays incorrectly | Player doesn't support 10-bit (h.265) | Use 8-bit for maximum compatibility |
| Chroma subsampling artifacts | 4:2:0 on text/graphics content | Use 4:4:4 for screen recordings |

## Best Practices

- Always use CRF for one-pass quality-driven encoding (18-23 for H.264)
- Use 2-pass VBR for streaming with strict bitrate limits
- Enable hardware encoding for speed; software for maximum quality
- 10-bit encoding reduces banding even for SDR content
- Match resolution to content type — don't upscale unnecessarily
- Use yuv420p pixel format for maximum delivery compatibility
- Test with 30-second sample before full encode
- Keep source master at highest quality; compress for delivery
- Use -movflags +faststart for web-optimized MP4
- Document encoding settings for reproducibility

## Anti-Patterns

- Encoding lossy from lossy source (generation loss)
- Using CRF 0 (lossless) for distribution — files are enormous
- Upscaling low-resolution content (adds no quality, wastes bitrate)
- Using 4:4:4 chroma for delivery (incompatible with many players)
- Applying unnecessary denoising to high-quality sources
- Using placebo preset (minimal gain, massive time increase)
- Encoding 8-bit for HDR content (must be 10-bit)
- Ignoring audio bitrate — allocate proportionally
- Re-encoding already compressed web videos
- Assuming all hardware encoders produce equal quality

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
