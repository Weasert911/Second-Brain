# Audacity-Expert Checklists

## Pre-Flight Checklist

- [ ] Audio interface connected and drivers installed
- [ ] Input device selected in Audacity preferences
- [ ] Sample rate set (44100 Hz music / 48000 Hz video)
- [ ] Recording level tested (peaks at -6dB, no clipping)
- [ ] Room quiet and background noise minimized
- [ ] Headphones connected (speakers muted to prevent feedback)
- [ ] Room tone recorded (30 seconds for noise profile)
- [ ] Project file saved before recording
- [ ] Disk space sufficient for recording duration
- [ ] Backup recording device ready (if critical)

## Implementation Checklist

- [ ] Tracks named descriptively (host, guest, music, sfx)
- [ ] Noise profile sampled from clean noise section
- [ ] Noise reduction applied with appropriate settings
- [ ] EQ applied to balance frequency response
- [ ] Compressor sets consistent dynamics
- [ ] Volume envelopes adjust levels over time
- [ ] Silence removed from between phrases (if needed)
- [ ] Fades applied to clip starts and ends
- [ ] Label tracks created for chapters/regions
- [ ] Effects chain applied in correct order

## Testing Checklist

- [ ] Playback at normal speed sounds natural
- [ ] No clipping throughout entire track
- [ ] Noise reduction artifacts absent ("underwater" effect)
- [ ] EQ does not introduce harshness or muddiness
- [ ] Compression not pumping or breathing audibly
- [ ] Volume levels consistent across entire project
- [ ] Transitions between clips are smooth
- [ ] Labels appear at correct timestamps
- [ ] Export file plays in target media player
- [ ] File size within expected range

## Release Checklist

- [ ] Master WAV exported at full quality
- [ ] Distribution format exported (MP3, FLAC)
- [ ] ID3 tags added (title, artist, album, episode, year)
- [ ] Loudness normalized to platform standard (-14 LUFS web, -23 LUFS broadcast)
- [ ] Project file (.aup3) saved and backed up
- [ ] Raw recordings archived separately
- [ ] Chapter labels exported as text file
- [ ] Podcast RSS feed updated (if applicable)
- [ ] Upload to hosting platform completed
- [ ] Quality check on final uploaded file

## Maintenance Checklist

- [ ] Audacity updated to latest stable version
- [ ] LAME encoder updated
- [ ] FFmpeg import/export library updated
- [ ] VST plugins checked for compatibility
- [ ] Chain presets reviewed and optimized
- [ ] Recording levels recalibrated periodically
- [ ] Old projects archived to cold storage
- [ ] Keyboard shortcuts exported and backed up
