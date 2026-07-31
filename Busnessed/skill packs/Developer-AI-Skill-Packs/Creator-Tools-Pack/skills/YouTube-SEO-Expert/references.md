# YouTube-SEO-Expert References

## Official Documentation

- [YouTube Creator Academy](https://creatoracademy.youtube.com/) — Official YouTube training for creators
- [YouTube Analytics Guide](https://support.google.com/youtube/answer/9002587) — Official analytics documentation
- [YouTube Search Engine Optimization](https://support.google.com/youtube/answer/57404) — YouTube's official SEO guidance
- [YouTube Algorithm Explained](https://blog.youtube/inside-youtube/) — YouTube's official blog on how recommendations work
- [Google Trends](https://trends.google.com/) — Search trend analysis for keyword research
- [vidIQ Blog](https://vidiq.com/blog/) — Advanced YouTube SEO strategies and case studies

## Glossary / Terminology

| Term | Definition |
|---|---|
| **CTR** | Click-Through Rate — percentage of impressions that result in clicks |
| **Retention** | Average percentage of video watched by viewers |
| **Watch Time** | Total minutes viewers have watched your content |
| **Session Time** | Total time viewers spend on YouTube after watching your video |
| **Impressions** | Number of times your video thumbnail is shown |
| **CPM** | Cost Per Mille — revenue per 1000 ad impressions |
| **RPM** | Revenue Per Mille — revenue per 1000 views |
| **Hook** | The first 15-30 seconds designed to retain viewers |
| **CTA** | Call to Action — prompt for likes, subscribes, or comments |
| **Pattern Interrupt** | Change in pacing/visuals to regain viewer attention |
| **Long-tail Keyword** | Specific, lower-competition search phrase (3+ words) |
| **Evergreen Content** | Content that remains relevant and searchable long-term |
| **Trending** | Content riding current viral trends or news |
| **Session Time** | Key metric for algorithm recommendations |
| **AVD** | Average View Duration — average minutes watched per view |

## Conventions / Naming Standards

- Titles: `Primary Keyword | Emotional Hook (Video Type)` (e.g., `Blender Tutorial | Create 3D Characters in 10 Minutes (Beginner)`)
- Thumbnails: `video_keyword_variant.png` (e.g., `blender_character_tutorial_v2.png`)
- Playlists: `Topic_Series` (e.g., `Blender_Beginner_Series_Complete`)
- End Screen: `end_card_template_style.png`
- Channel Sections: Organized by topic, most popular, uploads

## Architecture / Workflow Notes

YouTube's recommendation algorithm optimizes for viewer satisfaction and session time. Key metrics in order of importance: Watch Time → Session Time → Retention → CTR. The algorithm learns from individual viewer behavior.

**Discovery pipeline:** Search → Browse features → Suggested videos → Notifications → External

**Retention curve stages:** Hook (0-15s) → Build (15-30%) → Sustain (30-70%) → CTA (70-90%) → Outro (90-100%)

## Key Tools / Commands

- YouTube Studio > Analytics > Reach: CTR and impressions data
- YouTube Studio > Analytics > Engagement: Retention and watch time
- YouTube Studio > Advanced: Tags section
- YouTube Studio > Cards: Add cards at specific timestamps
- YouTube Studio > End Screen: Configure element overlay
- Google Trends: Compare keyword popularity
- vidIQ/TubeBuddy: Keyword score and optimization suggestions

## Recommended Channel Structure

```
channel/
├── videos/
│   ├── published/
│   │   ├── yyyy_mm_dd_video_title/
│   │   │   ├── video.mp4
│   │   │   ├── thumbnail.png
│   │   │   └── description.txt
│   │   └── ...
│   └── drafts/
├── thumbnails/
│   ├── templates/
│   │   ├── template_tutorial.psd
│   │   ├── template_review.psd
│   │   └── template_vlog.psd
│   └── finals/
├── playlists/
│   └── playlist_structure.txt
├── analytics/
│   ├── monthly_reports/
│   └── keyword_research/
└── assets/
    ├── end_screen.png
    ├── channel_logo.png
    └── banner.png
```
