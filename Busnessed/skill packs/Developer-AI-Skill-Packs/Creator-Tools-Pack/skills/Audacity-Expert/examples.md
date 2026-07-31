# Audacity-Expert Examples

## Beginner Example: Clean Up Voice Recording

**Goal:** Remove background noise and normalize a voice recording.

**Steps:**
1. Import WAV file (File > Import > Audio)
2. Select 2-3 seconds of pure background noise (no voice)
3. Effect > Noise Reduction > Get Noise Profile
4. Select entire track
5. Effect > Noise Reduction > OK (default settings)
6. Effect > Low Pass Filter: 12000 Hz (remove high hiss)
7. Effect > Normalize: -1 dB peak
8. File > Export > Export as MP3 at 192 kbps

**Key Techniques:** Noise profile sampling, noise reduction, basic EQ, normalization, MP3 export.

---

## Intermediate Example: Podcast Episode Production

**Goal:** Produce a complete podcast episode with intro, interview, and outro.

**Steps:**
1. Create new project at 44100 Hz, 32-bit float
2. Import intro music, interview recording, and outro track
3. Select silence at interview start, use Silence Finder to remove gaps
4. Apply effects to voice track: High-pass filter 80Hz, EQ (presence boost at 3kHz), Compressor (ratio 3:1, threshold -18dB), Limiter (-3dB)
5. Apply fade in to intro music (Effect > Fade In)
6. Add label track: mark chapter points with timestamps
7. Adjust track volumes: voice -6dB peaks, music -20dB (background)
8. Use Auto Duck on music track triggered by voice track
9. Export master: WAV 44100 Hz 24-bit
10. Export distribution: MP3 192 kbps with metadata (title, artist, episode)

**Key Techniques:** Multi-track mixing, compressor chain, auto-duck, label tracks for chapters, format-specific exports.

---

## Advanced Example: Audio Restoration from Vinyl/Low-Quality Source

**Goal:** Restore audio from a damaged vinyl recording or low-bitrate source.

**Steps:**
1. Import source audio, examine spectrogram for problem frequencies
2. Effect > Click Removal: threshold 200, max spike 20ms
3. Effect > Noise Reduction: sample noise from groove sections, reduce by 24dB
4. Effect > Equalization: bass rolloff below 80Hz, reduce resonance at specific frequencies
5. Effect > De-esser: threshold -20dB (if sibilance present)
6. Effect > Compressor: gentle 2:1 ratio, -24dB threshold
7. Effect > Normalize: -1dB peak
8. Manual spectral editing: select clicks in spectrogram view, silence or repair
9. Effect > Loudness Normalization: -14 LUFS for streaming
10. Export as FLAC for archival, MP3 for distribution

**Key Techniques:** Spectral editing for precise noise removal, click removal, resonance EQ, loudness normalization, archival format selection.

---

## Production Example: Multi-Track Music Recording and Mix

**Goal:** Record and mix a simple acoustic song with vocal.

**Steps:**
1. Set project: 48000 Hz, 32-bit float
2. Record scratch track: guide vocal with metronome
3. Record guitar track 1 (rhythm): multiple takes, comp best parts
4. Record guitar track 2 (lead): single clean take
5. Record final vocal: multiple takes, comp best phrases
6. Apply EQ to each track: guitar (cut below 100Hz, boost 2-4kHz), vocal (cut 200-300Hz muddiness, presence at 5kHz)
7. Add compressor to vocal: ratio 3:1, attack 10ms, release 100ms
8. Add reverb send track: 15% wet mix for depth
9. Pan: guitar 1 left (-40), guitar 2 right (-40), vocal center
10. Balance levels: vocal -6dB, guitar -12dB each
11. Master bus: gentle compression (ratio 1.5:1), limiter at -1dB
12. Export WAV 48kHz 24-bit master, convert to MP3 320kbps

**Key Techniques:** Multi-track recording, comping takes, track EQ, compression chain, reverb sends, stereo panning, master bus processing.
