# FFmpeg-Expert: Checklists

## Pre-Flight Checklist
- [ ] FFmpeg installed with required codecs (ffmpeg -encoders)
- [ ] Source media analyzed with ffprobe (codec, resolution, bitrate, duration)
- [ ] Output target defined (codec, container, resolution, bitrate)
- [ ] Sufficient disk space for output (source_size × 2 minimum)
- [ ] Hardware acceleration available if needed (nvidia-smi/queries)
- [ ] Test segment selected for trial encode (-t 60)
- [ ] Batch script error handling planned
- [ ] Output directory exists and writable

## Implementation Checklist
- [ ] Codec choice appropriate for target use case
- [ ] CRF/bitrate balanced for quality vs size
- [ ] Filter graph produces correct output
- [ ] Audio streams handled correctly (codec, channels, bitrate)
- [ ] -movflags +faststart for web-optimized MP4
- [ ] Metadata preserved or correctly set (-metadata)
- [ ] Stream mapping correct (-map flags)
- [ ] Hardware acceleration parameters correct
- [ ] Frame rate and aspect ratio preserved if needed
- [ ] Interlaced content deinterlaced if needed

## Testing Checklist
- [ ] Output plays correctly in target player
- [ ] Audio/video synchronization verified
- [ ] Output file size within expected range
- [ ] Visual quality acceptable (subjective check)
- [ ] Hardware-accelerated encode matches software quality
- [ ] Streaming output validates with test player
- [ ] Thumbnails generated correctly
- [ ] Batch script handles errors gracefully
- [ ] No artifacts or corruption in output
- [ ] Processed files playable after transfer

## Release Checklist
- [ ] Encoded files archived with source files
- [ ] Encoding parameters documented (metadata or sidecar)
- [ ] Quality verification report generated
- [ ] Files named consistently with convention
- [ ] Checksums verified for integrity (md5sum)
- [ ] Distribution format matches requirements
- [ ] Access permissions set correctly
- [ ] Source files backed up before deletion
- [ ] Encoding log saved for audit
- [ ] Delivery checklist signed off

## Maintenance Checklist
- [ ] FFmpeg version updated regularly
- [ ] Codec library versions checked for updates
- [ ] Hardware acceleration drivers updated
- [ ] Encoding profiles reviewed for efficiency
- [ ] Storage cleanup for temporary/intermediate files
- [ ] Batch script logic reviewed for edge cases
- [ ] Documentation updated for new codecs/features
- [ ] Test patterns maintained for quality regression checks
