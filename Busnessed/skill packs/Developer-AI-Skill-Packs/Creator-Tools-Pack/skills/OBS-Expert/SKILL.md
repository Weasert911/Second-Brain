---
name: OBS-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about OBS Studio, live streaming configuration, recording settings, scene setup, audio filters, or broadcasting workflows.
purpose: Provide expert-level guidance on OBS Studio for live streaming, recording, scene composition, audio optimization, and performance tuning.
---

## Capabilities

- Configure scene collections with multiple sources including game capture, window capture, and browser sources
- Set up audio sources with filters: noise gate, noise suppression, compressor, gain, and EQ
- Optimize streaming settings for Twitch, YouTube, and Facebook Live
- Configure recording settings for local capture at maximum quality
- Create and customize transitions including stinger, cut, fade, and swipe
- Assign and manage hotkeys for scene switching, mute toggles, and source visibility
- Deploy browser source interactions for alerts, overlays, and chat integration
- Set up multi-track audio recording for separate post-production audio tracks
- Configure replay buffer for instant highlight capture during gameplay
- Set up virtual camera for video conferencing applications
- Integrate plugins including NDI, StreamFX, Move Transition, and Source Record
- Tune performance settings for optimal encoding quality at minimal CPU/GPU usage
- Stream to multiple platforms simultaneously with restream integration
- Design and manage overlay systems with alerts, donation tickers, and event feeds

## Limitations

- Cannot modify OBS application settings directly; provides step-by-step instructions
- Plugin installation guidance is general; specific plugins may have unique requirements
- Advanced VMix or hardware switcher integration outside scope
- Cannot troubleshoot network-specific streaming issues (ISP throttling, routing)
- Browser source HTML/CSS/JS development covered at intermediate depth only

## Required Tools

- OBS Studio 30.0+ installed
- Graphics drivers up to date (NVIDIA, AMD, or Intel)
- Microphone and audio interface for voice capture
- Streaming platform account (Twitch, YouTube, Facebook) for live broadcast
- Optional: NDI plugin, StreamFX, Move Transition for advanced features

## Execution Workflow

1. Determine streaming or recording goals: platform, quality target, content type
2. Configure base settings: resolution, FPS, audio sample rate, color format
3. Set up scene collection and create initial scenes (starting soon, live, BRB, ending)
4. Add sources to each scene: display capture, game capture, camera, browser overlay
5. Configure audio sources: mic, desktop audio, game audio, music
6. Apply audio filters: noise gate, noise suppression, compressor on mic
7. Configure streaming encoder settings: NVENC/AMD/QSV, bitrate, preset
8. Set up recording encoder with separate settings for local archive
9. Assign hotkeys for scene switching, mute toggles, and source visibility
10. Test stream or recording with local preview and log analysis
11. Go live or start recording with monitoring dashboard active
12. Post-session: review logs, adjust settings, archive recordings

## Decision Tree

- Output type → {Live stream, Local recording, Virtual camera, Replay buffer}
- Streaming platform → {Twitch, YouTube, Facebook, Custom RTMP, Multi-platform}
- Primary content → {Gaming, Webcam/talk, Desktop/screen, Mixed production}
- Encoder hardware → {NVIDIA NVENC, AMD AMF, Intel QSV, x264 software}
- Streaming resolution → {1080p60, 720p60, 1440p60, 4K recording only}
- Audio setup → {Single mic, Multi-mic, Audio interface, NDI audio}
- Overlay complexity → {None, Browser source alerts, Full stream deck integration}
- Performance issue → {High encoding lag, Rendering lag, Dropped frames, Audio sync}

## Review Checklist

- [ ] Base canvas resolution matches source content
- [ ] Output resolution and FPS match platform capability
- [ ] Encoder selected matches available hardware
- [ ] Bitrate within platform limit and upload capacity
- [ ] Audio sample rate 48kHz across all sources
- [ ] Mic filters applied: noise gate + noise suppression + compressor
- [ ] Hotkeys assigned for all critical functions
- [ ] Scene transitions configured with appropriate duration
- [ ] Recording settings produce expected file format and quality
- [ ] Test recording plays back without glitches
- [ ] Stream key entered and connection tested
- [ ] Overlays and alerts verified in preview

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Dropped frames | Insufficient upload bandwidth | Reduce bitrate or resolution |
| Encoding overload | CPU/GPU cannot keep up | Switch encoder preset to faster or lower resolution |
| Audio out of sync | Sample rate mismatch | Set all audio sources to 48kHz |
| Game capture black screen | Anti-cheat or admin rights | Run OBS as administrator or use display capture |
| High rendering lag | Scene too complex | Reduce source count, use gpu scaling |
| Mic too quiet | Low gain or far distance | Increase gain filter, move mic closer |
| Browser source not loading | URL accessibility or cache | Refresh browser source, check URL validity |
| Virtual camera not working | Driver issue | Reinstall OBS Virtual Camera plugin |
| Stinger transition stutters | Video format incompatible | Use PNG sequence or lower resolution stinger |
| Multi-track audio not separated | Wrong track assignment | Verify audio advanced settings track mapping |
| Stream lags but recording fine | Encoder dual-output conflict | Use separate encoders or record from stream output |
| Hotkeys not working | Background app conflict | Change hotkey bindings to unique combos |

## Best Practices

- Use NVENC encoder for best quality-to-performance ratio on NVIDIA GPUs
- Set audio sample rate to 48 kHz for all sources to prevent sync drift
- Apply noise gate before noise suppression in filter chain
- Keep scene count under 10 for smooth transitions
- Use browser source for dynamically updating content (alerts, chat, events)
- Enable auto-configuration wizard for initial baseline settings
- Use replay buffer for capturing unexpected moments without recording entire stream
- Test stream with OBS log analyzer to identify performance issues
- Maintain separate scene collections for different content types
- Regularly update OBS and plugins to latest stable versions

## Anti-Patterns

- Running OBS as administrator unnecessarily (only needed for game capture)
- Using x264 software encoding when hardware encoder is available
- Overloading a single scene with dozens of sources
- Neglecting to test audio levels before going live
- Using browser sources with excessive JavaScript that causes lag
- Streaming at resolution/FPS combination that exceeds upload bandwidth
- Ignoring OBS log warnings about encoding or rendering lag
- Applying noise suppression too aggressively causing robotic audio
- Not backing up scene collections before major changes
- Using display capture when game capture is available for gaming content

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
