# DaVinci-Resolve-Expert Examples

## Beginner Example: Simple Color Correction

**Goal:** Balance exposure and white balance on a single interview clip.

**Steps:**
1. Import clip to Media page, create timeline in Edit page
2. Switch to Color page — clip loads in viewer
3. Use Lift/Gamma/Gain wheels to adjust exposure
4. Click the eyedropper on a neutral white area for white balance
5. Adjust saturation to 55-65 for natural look
6. Check skin tones on vectorscope — should fall on skin tone line
7. Apply a subtle sharpening (Midtone Detail) at 0.5
8. Render with YouTube preset in Deliver page

**Key Techniques:** Primary color correction, white balance, vectorscope reading, basic sharpening.

---

## Intermediate Example: Multi-Cam Music Video Edit

**Goal:** Edit a music performance with 3 camera angles.

**Steps:**
1. Import all 3 camera clips and audio recording to Media page
2. Select all clips, right-click > Create Multi-Cam Source Using Audio
3. Create timeline from multi-cam source
4. In Edit page, enable multi-cam viewer (Viewer > Multi-Cam)
5. Play timeline, click camera angles to switch in real-time
6. Fine-tune edit, add cross dissolves between angle switches
7. Grade each angle with matching PowerGrade for consistent look
8. Mix audio in Fairlight: dialogue/music balance, compressor on master
9. Export 4K H.264 Master at 50 Mbps

**Key Techniques:** Multi-cam sync and editing, PowerGrade sharing across angles, Fairlight audio mix.

---

## Advanced Example: Film Look with ACES Color Management

**Goal:** Transform log footage to film emulation using ACES pipeline.

**Steps:**
1. Project Settings > Color Management: ACEScct, ACES 1.3, Rec.709 Output
2. Import ARRI Log C footage — input transform set to ARRI LogC to ACES
3. In Color page, build node tree: Input CST → Noise Reduction → Primary → Secondary → Glow → Film Grain → Output CST
4. Use curves to emulate film shoulder/ toe rolloff
5. Add parallel nodes for split-toning: cool shadows, warm highlights
6. Apply PowerGrade to all matching shots
7. Add halation and film grain Fusion effects in Fusion page
8. Fairlight: dialogue cleanup with EQ, gentle compression, limiter at -1dB
9. Deliver: ProRes 4444 master, H.264 web version

**Key Techniques:** ACES color management, film emulation, split-toning, halation effect, professional audio chain.

---

## Production Example: Commercial Post-Production Pipeline

**Goal:** Complete post-production for a 30-second TV commercial.

**Steps:**
1. Import footage from multiple cameras (RED, Sony, drone, b-roll)
2. Create bins: Video/A Cam, Video/B Cam, Video/Broll, Audio/VO, Audio/Music, Audio/SFX, Graphics/Logos
3. Build rough cut on Edit page from script-driven selects
4. Fine-cut with J-cuts and L-cuts for dialogue pacing
5. Fusion page: create animated lower-third title with logo
6. Add text+ for end card with product shot
7. Color grade: corporate brand colors consistent across all shots
8. Skin tones polished, product colors matched to brand guide
9. Fairlight: VO track EQ (presence boost), music ducked under VO via sidechain compression, SFX placed on separate bus with reverb send
10. Master bus: multiband compressor, limiter at -2dB, -23 LUFS for broadcast
11. Export: Broadcast ProRes 422 HQ, H.264 web version, H.265 social cut
12. Archive project with all media, PowerGrades, and Fusion templates

**Key Techniques:** Professional bin organization, J/L-cuts, brand color grading, sidechain compression, multi-format delivery, project archiving.
