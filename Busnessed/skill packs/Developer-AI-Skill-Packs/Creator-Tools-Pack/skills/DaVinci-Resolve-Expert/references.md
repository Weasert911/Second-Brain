# DaVinci-Resolve-Expert References

## Official Documentation

- [DaVinci Resolve Manual](https://documents.blackmagicdesign.com/UserManuals/DaVinci_Resolve_Reference_Manual.pdf) — Comprehensive user manual covering all pages and features
- [Blackmagic Design Support](https://www.blackmagicdesign.com/support) — Latest updates, driver downloads, and knowledge base
- [Resolve Color Management Guide](https://www.blackmagicdesign.com/products/davinciresolve/color) — Official color management documentation
- [Fairlight Audio Guide](https://documents.blackmagicdesign.com/UserManuals/Fairlight_Manual.pdf) — Dedicated Fairlight audio post-production manual
- [Fusion Reference Manual](https://documents.blackmagicdesign.com/UserManuals/Fusion_Reference_Manual.pdf) — Complete Fusion page compositing reference
- [Resolve Developer SDK](https://www.blackmagicdesign.com/developer) — For scripting and integration development

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Bin** | Folder structure within Resolve for organizing media |
| **Timeline** | Sequence of clips arranged for playback and editing |
| **Node** | Individual processing step in the Color page or Fusion page |
| **PowerGrade** | Saved grade that can be applied to any clip across projects |
| **LUT** | Look-Up Table for color space transformation or creative look |
| **CST** | Color Space Transform — tool for converting between color spaces |
| **Qualifier** | Color-based selection tool for isolating specific color ranges |
| **Window** | Shape-based mask for isolating regions of the frame |
| **Tracker** | Motion tracking system for applying grades to moving objects |
| **Fairlight** | Built-in digital audio workstation for audio post-production |
| **Bus** | Audio routing path for grouping and processing multiple channels |
| **Optimized Media** | Lower-resolution copies for smooth playback during editing |
| **ACES** | Academy Color Encoding System — standardized color pipeline |
| **HDR** | High Dynamic Range — extended luminance range video |
| **EDL/XML** | Edit Decision List / AAF interchange formats for round-tripping |

## Conventions / Naming Standards

- Clips: `Project_Scene_Take_Version` (e.g., `Movie_Int01_Take3_v2`)
- Bins: `Category_Subcategory` (e.g., `Video_Interviews`, `Audio_Music`)
- Timelines: `Project_Description_Version` (e.g., `Movie_Edit_v05`)
- PowerGrades: `Look_Description_Type` (e.g., `Look_FilmEmulation_Warm`)
- Fusion Templates: `Effect_Description` (e.g., `Title_LowerThird_01`)
- Render Presets: `Platform_Resolution_Codec` (e.g., `YouTube_4K_H264`)

## Architecture / Workflow Notes

DaVinci Resolve uses a page-based workflow: Media → Cut/Edit → Fusion → Color → Fairlight → Deliver. Each page specializes in a distinct phase. Switching pages organizes the workflow linearly but allows jumping between phases as needed.

**Color Pipeline:** Input CST → Noise Reduction → Primary Grade → Secondary Grade → Window Tracking → Output CST

**Audio Pipeline:** Source audio → Clip EQ → Track EQ → Bus Compression → Master Limiter → Loudness Meter

## Key Tools / Commands

- `Ctrl+W` — Color picker for selecting screen elements
- `Shift+Space` — Play/pause at cursor
- `I` / `O` — Set in/out points
- `T` — Trim mode
- `B` — Blade/razor tool
- `P` — Position tool
- `A` — Selection tool
- `D` — Dynamic preview for Fusion
- `Ctrl+Shift+C` — Copy grade to all clips
- `Alt+G` — Group clips for simultaneous grading
- `Shift+1-9` — Switch between pages
- `Up/Down` — Jump to previous/next edit point
- `+ / -` — Zoom timeline in/out

## Recommended Project Structure

```
project/
├── media/
│   ├── video/
│   │   ├── camera_a/
│   │   ├── camera_b/
│   │   └── broll/
│   ├── audio/
│   │   ├── dialogue/
│   │   ├── music/
│   │   ├── sfx/
│   │   └── narration/
│   ├── graphics/
│   │   ├── titles/
│   │   ├── logos/
│   │   └── lower-thirds/
│   └── proxies/
├── projects/
│   ├── project_name.drp
│   └── project_cache/
├── exports/
│   ├── dailies/
│   ├── finals/
│   └── masters/
└── reference/
    ├── script/
    └── style_frames/
```
