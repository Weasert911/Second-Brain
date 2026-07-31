# Thumbnail-Workflow-Expert References

## Official Documentation

- [YouTube Thumbnail Best Practices](https://support.google.com/youtube/answer/72431) — YouTube's official thumbnail guidelines
- [YouTube Test & Compare (A/B Testing)](https://support.google.com/youtube/answer/13784278) — Official thumbnail testing documentation
- [Canva Design School](https://www.canva.com/learn/) — Design tutorials and color theory guides
- [Adobe Color](https://color.adobe.com/) — Color palette generation and exploration
- [Google Fonts](https://fonts.google.com/) — Free font library for design
- [Coolors](https://coolors.co/) — Color scheme generator

## Glossary / Terminology

| Term | Definition |
|---|---|
| **CTR** | Click-Through Rate — percentage of viewers who click on thumbnail |
| **Thumbnail** | Preview image representing a video in search/suggestions |
| **Composition** | Arrangement of visual elements within the frame |
| **Rule of Thirds** | Composition guideline dividing frame into 3x3 grid |
| **Negative Space** | Empty area around main subject |
| **Focal Point** | Primary visual element drawing viewer attention |
| **Color Psychology** | Study of colors' emotional and psychological effects |
| **Complementary Colors** | Colors opposite on color wheel (high contrast) |
| **Kerning** | Spacing between characters in text |
| **Stroke** | Outline around text for readability |
| **Drop Shadow** | Shadow behind text/object for depth |
| **A/B Testing** | Comparing two variants to determine which performs better |
| **Sans-Serif** | Font style without decorative strokes (cleaner for thumbnails) |
| **Mood Board** | Collection of reference images for design direction |

## Conventions / Naming Standards

- Thumbnails: `video_keyword_variant.ext` (e.g., `blender_tutorial_v2.png`)
- Templates: `template_contenttype_style.psd` (e.g., `template_tutorial_closeup.psd`)
- Branding: `channel_logo_white.png` (light bg), `channel_logo_black.png` (dark bg)
- Variant suffixes: `_v1`, `_v2`, `_test_a`, `_test_b`
- Export format: PNG for highest quality, JPEG for smaller files

## Architecture / Workflow Notes

Thumbnail creation follows a pipeline: Content analysis → Frame selection → Composition → Color grading → Text overlay → Branding → Export → Upload → Test → Iterate.

**Design hierarchy:** Subject (visual impact) → Color (emotional response) → Text (information) → Branding (recognition)

**Eye tracking pattern:** Viewers scan thumbnails in Z-pattern (top-left to bottom-right). Place most important element (face/text) in top-left or center.

## Key Tools / Commands

- Photoshop: Curves (Ctrl+M), Levels (Ctrl+L), Hue/Saturation (Ctrl+U), Text tool (T)
- GIMP: Color Balance, Curves, Text tool
- Canva: Templates, Elements, Text, Background remover
- Figma: Auto-layout, Components, Export settings
- Photopea: Free online alternative (photopea.com)
- YouTube Studio: Upload thumbnail, Test & Compare

## Recommended Project Structure

```
thumbnails/
├── templates/
│   ├── tutorial_template.psd
│   ├── review_template.psd
│   ├── vlog_template.psd
│   └── gaming_template.psd
├── exports/
│   ├── video1/
│   │   ├── video1_v1.png
│   │   ├── video1_v2.png
│   │   └── video1_v3.png
│   └── video2/
│       ├── video2_v1.png
│       └── video2_v2.png
├── assets/
│   ├── channel_logo.png
│   ├── brand_overlay.png
│   ├── fonts/
│   └── patterns/
├── references/
│   ├── best_practices/
│   └── competitor_examples/
└── analytics/
    └── ctr_log.csv
```
