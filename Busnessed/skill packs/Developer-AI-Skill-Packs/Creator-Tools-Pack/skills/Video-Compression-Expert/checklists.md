# Video-Compression-Expert Checklists

## Pre-Flight Checklist

- [ ] Source media analyzed with ffprobe/MediaInfo
- [ ] Codec selected based on target platform and hardware
- [ ] Rate control mode chosen (CRF/CBR/VBR/CQP)
- [ ] Target resolution matches platform guidelines
- [ ] Hardware acceleration available and configured
- [ ] Test segment (30s) planned for quality validation
- [ ] Sufficient disk space for output (2x+ estimated size)
- [ ] All encoder dependencies installed (drivers, FFmpeg)
- [ ] Pixel format and chroma subsampling determined
- [ ] Bit depth selected (8-bit for delivery, 10-bit for quality)

## Implementation Checklist

- [ ] CRF value appropriate for content type (lower for grainy)
- [ ] Preset balances encoding speed and quality
- [ ] Tune parameter matches content (film/animation/grain)
- [ ] Resolution scaled with appropriate filter (lanczos)
- [ ] Pixel format yuv420p for delivery compatibility
- [ ] Audio codec and bitrate appropriate for content
- [ ] Faststart flag enabled for web MP4
- [ ] HDR metadata correctly embedded (if applicable)
- [ ] Keyframe interval appropriate (2-10 seconds)
- [ ] 2-pass encoding configured (if using VBR/CBR)

## Testing Checklist

- [ ] 30-second test segment encoded for quality check
- [ ] Output visually inspected at 100% zoom
- [ ] No visible artifacts (blocking, banding, ringing)
- [ ] Audio synced and clear
- [ ] HDR/SDR output displays correctly on target display
- [ ] VMAF score >90 or within acceptable range
- [ ] File size within expected range
- [ ] Output plays in target media player
- [ ] Chroma subsampling correct (no color fringing)
- [ ] Encoding logs reviewed for warnings/errors

## Release Checklist

- [ ] Full encode completed successfully
- [ ] Output file verified by playback and checksum
- [ ] Filename follows naming convention
- [ ] Encoding settings documented (for reproducibility)
- [ ] Source files backed up
- [ ] Quality metrics recorded for reference
- [ ] All platform variants generated (if multi-platform)
- [ ] HDR metadata verified with compatible player
- [ ] Delivery package organized with all formats
- [ ] Encoding script/presets saved for future use

## Maintenance Checklist

- [ ] FFmpeg updated to latest stable version
- [ ] GPU drivers updated (hardware encoder quality improves)
- [ ] Preset templates reviewed for new codec improvements
- [ ] Platform bitrate guidelines checked monthly
- [ ] Quality metric model files updated (VMAF)
- [ ] Batch scripts validated after FFmpeg update
- [ ] Storage cleaned of intermediate encode files
- [ ] New codec support evaluated (AV2, VVC, EVC)
