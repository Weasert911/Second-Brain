# Thumbnail-Workflow-Expert Templates

## Template 1: Thumbnail Design Canvas

**Description:** Technical specifications for thumbnail creation.

```
Name: Thumbnail_{{video_topic}}

Canvas Size: 1280 x 720 pixels
Resolution: 72 DPI (screen resolution)
Color Profile: sRGB (for web/browser display)
Format: PNG (preferred) or JPEG Q95 (smaller file)

Design Grid:
- Safe zone: 1140 x 580 (centered, accounts for YouTube UI overlay)
- Title safe: Top 180px (text may overlap with video title)
- Subject zone: Center 800px (main visual focus)

Export Checklist:
- [ ] 1280x720 pixels
- [ ] sRGB color profile
- [ ] PNG format (no compression artifacts)
- [ ] Max 2MB file size (YouTube limit)
- [ ] Test at 50px width (mobile thumbnail size)
```

**Usage Notes:** YouTube recommends 1280x720 minimum. 2MB file size limit. Keep important content within 1140x580 safe zone.

---

## Template 2: Color Palette for Thumbnails

**Description:** Color scheme templates for different content moods.

```
Name: Palette_{{mood}}_{{channel_name}}

High Performance Palettes (tested for CTR):

1. Bold Contrast:
   - Background: {{bg_color}} (Deep blue #1a1a2e)
   - Accent: {{accent_color}} (Vibrant orange #ff6b35)
   - Text: {{text_color}} (White #ffffff)
   - Face lighting: Warm golden

2. Clean Minimal:
   - Background: {{bg_color}} (White #ffffff or light gray)
   - Accent: {{accent_color}} (Brand color)
   - Text: {{text_color}} (Dark #1a1a2e)
   - Face: High contrast, natural light

3. Gaming/Vibrant:
   - Background: {{bg_color}} (Purple #6c5ce7)
   - Accent: {{accent_color}} (Yellow #fdcb6e)
   - Text: {{text_color}} (White with black stroke)
   - Face: Dramatic lighting

4. Educational/Trust:
   - Background: {{bg_color}} (Blue #0984e3)
   - Accent: {{accent_color}} (Green #00b894)
   - Text: {{text_color}} (White)
   - Face: Warm, approachable

Color Rules:
- Max 3 dominant colors
- 60-30-10 rule: 60% background, 30% subject, 10% accent
- Complementary pairs: Blue/Orange, Purple/Yellow, Green/Magenta
- Avoid: Low saturation, muddy browns, gray
```

**Usage Notes:** Test palettes with actual content. Colors look different on mobile screens. Boost saturation 10-15% to compensate for YouTube compression.

---

## Template 3: Face Close-Up Composition

**Description:** Guidelines for face-focused thumbnails.

```
Name: Face_{{expression}}_{{video_topic}}

Expression Selection (by content type):
- Tutorial: Surprised ("Wow!"), Curious ("Hmm...")
- Review: Impressed ("Nice"), Disappointed ("Meh")
- Gaming: Excited ("Let's go!"), Focused ("Intense")
- Educational: Friendly smile, Thoughtful
- Reaction: Shocked, Laughing, Crying

Face Composition:
- Face fills 40-60% of frame width
- Eyes in upper-third of frame
- Expression clearly visible at 50px width
- Consistent lighting across all thumbnails

Editing Steps:
1. Select face frame with best expression
2. Remove/stylize background
3. Increase contrast (+15 to +25)
4. Boost clarity/dehaze for texture
5. Add warmth to skin tones (slight orange shift)
6. Brighten eyes and teeth (dodge tool or local brightness)
7. Optional: Add rim light effect for separation from background

Text Position: Below face or beside face (never overlapping)
```

**Usage Notes:** Candid emotions outperform posed smiles. Surprise and curiosity highest CTR. Test expressions with audience for best results.

---

## Template 4: Text Overlay Specifications

**Description:** Typography guidelines for thumbnail text.

```
Name: Text_{{text_content}}_{{video_topic}}

Text Rules:
- Max 5 words (3 words ideal)
- Bold sans-serif font (Montserrat, Bebas Neue, Impact, Roboto Condensed)
- Minimum 48pt (72pt+ recommended for main text)
- White text with black stroke (4-8px)
- OR: Brand color with white stroke

Text Positions (by priority):
1. Top-left (Z-pattern starting point) — BEST
2. Center-bottom (below face)
3. Top-right (less effective)
4. Bottom-left (risk of YouTube time overlay)

Do NOT position text:
- Over subject's face
- At very bottom (overlaps with video length/time)
- In corners (may be cropped on some devices)

Text Styling:
- Font: {{font_family}} (Bold weight)
- Size: {{font_size}}pt
- Color: {{text_color}} (white recommended)
- Stroke: {{stroke_width}}px, color {{stroke_color}} (black)
- Shadow: {{shadow}} (drop shadow optional, 2px distance)
- Effect: {{text_effect}} (none / outline / gradient / glow)

Text Templates:
- "HOW TO [verb] [noun]"
- "[NUMBER] [NOUN] YOU NEED"
- "I TRIED [NOUN]"
- "[ADJECTIVE] [NOUN] TUTORIAL"
```

**Usage Notes:** Test text at 50px width. If unreadable, make larger or remove. Curved text is hard to read at small size — avoid. Use title case, not ALL CAPS.

---

## Template 5: Series Thumbnail Template

**Description:** Consistent template for multi-video series.

```
Name: Series_{{series_name}}_Ep{{episode_number}}

Fixed Elements (same across all episodes):
- Background: {{series_bg}} (gradient or solid brand color)
- Frame/Border: {{border_style}} (2-4px accent color inside edge)
- Series badge: {{badge_style}} ("TUTORIAL", "REVIEW", etc.) in top-left
- Logo: {{logo_position}} (bottom-right, 30-50px, 50% opacity)
- Font: {{series_font}} (consistent across all episodes)

Variable Elements (change per episode):
- Subject: {{episode_subject}} (face cutout or product shot)
- Episode number: {{ep_number}} (circle badge in top-right, 60px)
- Title text: {{episode_title}} (3-5 words, variable position)
- Accent color: {{episode_accent}} (rotates through brand palette)

Template File: series_template.psd
  - Smart Objects for subject (easy swap)
  - Text layers for title and episode number
  - Color adjustment layers for accent variation
```

**Usage Notes:** Smart Objects make batch production efficient. Accent color rotation keeps series fresh while maintaining consistency. Number episodes clearly for audience navigation.

---

## Template 6: A/B Testing Configuration

**Description:** YouTube Test & Compare thumbnail testing setup.

```
Name: Test_{{video_topic}}_{{date}}

Test Duration: 14 days or until winner reaches 95% significance

Variants (test ONE variable at a time):

Test 1: Expression
- Variant A: Surprised face
- Variant B: Curious face
- Variant C: Happy face
- Hypothesis: Surprise drives highest CTR

Test 2: Background Color
- Variant A: Bold blue background
- Variant B: Orange background
- Variant C: Split complementary

Test 3: Text Presence
- Variant A: Text "EASY TUTORIAL"
- Variant B: Text "LEARN IN 10 MIN"
- Variant C: No text (image only)

Implementation:
1. Upload all variants to YouTube Studio
2. Select "Test & Compare"
3. Set test to run 2 weeks
4. Check results: Winning variant shown to 50% of audience
5. Apply winning variant permanently
6. Analyze: What made the winner perform better?
```

**Usage Notes:** Test only one variable at a time for clear results. Minimum 5,000 impressions per variant. Stop test early if a variant significantly underperforms (below 75% of leader).

---

## Template 7: Mobile-Friendly Thumbnail Check

**Description:** Verification checklist for mobile thumbnail display.

```
Name: MobileCheck_{{thumbnail_name}}

Test at these sizes:
1. YouTube search results (phone): ~50px wide
2. YouTube suggested videos (phone): ~80px wide
3. YouTube channel page (phone): ~120px wide
4. Home feed (phone): ~160px wide

Checklist:
- [ ] Face expression visible at 50px
- [ ] Text readable at 50px
- [ ] Key visual element identifiable
- [ ] No important detail in outer 10% of frame
- [ ] Text not overlapping face
- [ ] Brand colors recognizable
- [ ] Contrast sufficient (check in grayscale)
- [ ] Subject fills at least 30% of frame
- [ ] No thin lines or small details (lost at small size)
- [ ] Title/brand in safe zone (away from corners)

Test method:
1. Export thumbnail at 50px width
2. View on phone at arm's length
3. Can you read the text? Identify the subject?
4. If no — increase size, contrast, and simplify
```

**Usage Notes:** Over 70% of YouTube views are on mobile. If it doesn't work at 50px, it doesn't work. Simplify until it passes the mobile test.

---

## Template 8: Photoshop/GIMP Action Template

**Description:** Automated thumbnail processing actions.

```
Name: ThumbnailAction_{{tool}}

Photoshop Action Steps:
1. Image > Image Size: 1280x720
2. Layer > New Adjustment Layer > Brightness/Contrast:
   - Brightness: +10
   - Contrast: +20
3. Layer > New Adjustment Layer > Hue/Saturation:
   - Saturation: +15
4. Filter > Sharpen > Smart Sharpen:
   - Amount: 50%
   - Radius: 1.0px
5. Export > Export As: PNG

GIMP Batch Processing:
1. Filters > Enhance > Sharpen (Unsharp Mask)
   - Amount: 0.50
   - Radius: 1.0
   - Threshold: 0
2. Colors > Brightness-Contrast
   - Brightness: +10
   - Contrast: +20
3. Colors > Hue-Saturation
   - Saturation: +15
4. File > Export As: PNG

Save as:
- Photoshop: Thumbnail_Enhance.atn
- GIMP: thumbnail_enhance.py (Python script)
```
**Usage Notes:** Apply action as base enhancement before adding text/branding. Adjust values based on source image quality. Less aggressive for already-vibrant images.
