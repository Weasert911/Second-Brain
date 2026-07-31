# OBS-Expert Examples

## Beginner Example: Basic Streaming Setup

**Goal:** Configure OBS for a first-ever Twitch stream at 1080p60.

**Steps:**
1. Run Auto-Configuration Wizard, select "Streaming, prioritize quality"
2. Create scenes: Starting Soon, Live, BRB, Stream Ending
3. Add sources: Game Capture for your game, Video Capture Device for webcam
4. Add browser source for Streamlabs alerts
5. Set up mic: add Noise Suppression (-30dB) and Compressor (ratio 4:1) filters
6. Under Settings > Output: NVENC encoder, 6000 Kbps bitrate, Preset: Quality
7. Audio: 48 kHz sample rate, stereo
8. Assign hotkeys: 1-4 for scene switching, M for mute toggle
9. Click Start Streaming after verifying preview

**Key Techniques:** Auto-configuration, basic scene creation, mic filters, NVENC encoding.

---

## Intermediate Example: Multi-Platform Stream with NDI

**Goal:** Stream to Twitch and YouTube simultaneously using NDI.

**Steps:**
1. Install OBS-NDI plugin
2. Create main scene collection with gaming, camera, overlays
3. Configure Main OBS: Stream to Twitch via Settings > Stream
4. Enable NDI Main Output in Tools > NDI Output Settings
5. Launch second OBS instance (or OBS Portable)
6. In second OBS, add NDI Source pointing to main OBS
7. Configure second OBS to stream to YouTube with separate encoder settings
8. Adjust bitrates: Twitch 6000 Kbps, YouTube 12000 Kbps
9. Use StreamFX filters for color correction on camera source
10. Monitor both streams via OBS stats panel and platform dashboards

**Key Techniques:** NDI multi-platform streaming, dual encoder configuration, StreamFX color correction.

---

## Advanced Example: Professional Production with Stinger Transitions

**Goal:** Set up a professional-looking stream with custom stinger transitions and multi-track audio.

**Steps:**
1. Design stinger video in After Effects: 1080p, 2-second transition with logo animation
2. Convert stinger to PNG sequence for smooth playback
3. Create scene collection: Intro, Camera, Fullscreen Game, Game+Cam, Intermission, End Screen
4. Add stinger transition via Scene Transitions > Stinger
5. Configure multi-track audio: Track 1 (Desktop+Mic mix) for stream, Track 2 (Mic only) for editing, Track 3 (Game audio only), Track 4 (Music)
6. Set up advanced audio properties per source
7. Add Move Transition plugin for animated source movements
8. Create hotkey sequences using Auto Hotkey or Stream Deck integration
9. Test with local recording, analyze OBS log
10. Full production stream with live monitoring and chat integration

**Key Techniques:** Stinger transitions, multi-track recording, Move Transition plugin, Stream Deck automation.

---

## Production Example: Podcast/Show Recording Studio

**Goal:** Record a multi-guest podcast show with separate audio tracks for post-production.

**Steps:**
1. Configure audio setup: 4 microphones via audio interface (GoXLR or similar)
2. Each mic on separate OBS audio source with noise gate, compression, EQ
3. Scene layout: 4-camera grid (main host + 3 guests) via NDI from separate PCs or cameras
4. Add shared browser source for live chat and donation ticker
5. Create scenes: Intro (full screen graphic), Panel (4-up), Main+Guest (2-up), Full Guest, Outro
6. Configure recording: MKV container, NVENC CQP 18 (visually lossless), 5 audio tracks
7. Track mapping: Track 1 = Main mix, Track 2 = Host mic, Track 3 = Guest 1, Track 4 = Guest 2, Track 5 = Guest 3
8. Assign hotkeys for scene switching, individual mic mutes
9. Record 1-hour episode locally, verify audio levels throughout
10. Post-process: import MKV into DaVinci Resolve, edit using individual audio tracks

**Key Techniques:** Multi-mic setup with audio interface, multi-track audio recording, MKV container, post-production workflow.
