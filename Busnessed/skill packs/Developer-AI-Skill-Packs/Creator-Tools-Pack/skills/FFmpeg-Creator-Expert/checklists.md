# FFmpeg-Creator-Expert Checklists

## Pre-Flight Checklist

- [ ] FFmpeg installed and accessible from command line
- [ ] ffprobe confirms source media properties
- [ ] Codec support verified (ffmpeg -encoders)
- [ ] Hardware acceleration drivers installed (if using)
- [ ] Output path has sufficient disk space (2x+ expected output)
- [ ] Source file is not corrupted or truncated
- [ ] Batch scripts tested on single file first
- [ ] All input files paths contain no special characters or spaces causing issues
- [ ] Required fonts available for drawtext filters
- [ ] Target platform requirements documented

## Implementation Checklist

- [ ] Source analyzed with ffprobe for codec, resolution, duration
- [ ] Codec selection appropriate for target use
- [ ] Rate control mode selected (CRF/CBR/VBR/CQP)
- [ ] Video filters ordered from input to output correctly
- [ ] Audio codec and bitrate configured
- [ ] Subtitle handling determined (burn/passthrough/extract)
- [ ] Metadata mapping verified
- [ ] Container format matches target requirements
- [ ] Keyframe interval set appropriately
- [ ] Pixel format compatible with target player

## Testing Checklist

- [ ] 30-second test clip encoded before full file
- [ ] Output plays in target media player
- [ ] Video quality visually acceptable
- [ ] Audio synced and clear
- [ ] Subtitles display correctly (position, timing)
- [ ] File size within expected range
- [ ] No artifacts, blockiness, or banding in output
- [ ] Metadata preserved or correctly set
- [ ] Hardware acceleration utilized (check log)
- [ ] Streaming segments play without interruption

## Release Checklist

- [ ] Final encoding complete with all intended parameters
- [ ] Output files named according to convention
- [ ] Batch scripts finalized and tested end-to-end
- [ ] Source files archived or documented
- [ ] Encoding logs saved for reference
- [ ] Output verified on target playback device or platform
- [ ] File integrity confirmed (checksum for archival)
- [ ] Backup of original files maintained
- [ ] Pipeline documented for repeatability
- [ ] Cleanup of intermediate files completed

## Maintenance Checklist

- [ ] FFmpeg version checked quarterly for security updates
- [ ] Hardware encoder drivers updated after GPU driver updates
- [ ] Preset parameters reviewed against new codec improvements
- [ ] Batch scripts validated after FFmpeg version changes
- [ ] Deprecated filters identified and replaced
- [ ] Storage cleanup of old encoding projects
- [ ] Platform bitrate guidelines reviewed periodically
- [ ] New codec options evaluated for quality/speed improvements
