# Asset-Organization-Expert References

## Official Documentation

- [ExifTool Documentation](https://exiftool.org/) — Complete metadata reading/writing reference
- [Git LFS Documentation](https://git-lfs.com/) — Large file storage for Git repositories
- [Perforce Helix Core](https://www.perforce.com/products/helix-core) — Version control for large binary assets
- [IPTC Photo Metadata Standard](https://iptc.org/standards/photo-metadata/) — International Press Telecommunications Council metadata standards
- [XMP Specification](https://www.adobe.com/products/xmp.html) — Adobe's Extensible Metadata Platform
- [3-2-1 Backup Rule](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/) — Industry-standard backup strategy guide

## Glossary / Terminology

| Term | Definition |
|---|---|
| **DAM** | Digital Asset Management — system for organizing, storing, and retrieving digital assets |
| **EXIF** | Exchangeable Image File Format — metadata embedded in photos by cameras |
| **IPTC** | International Press Telecommunications Council — metadata for news/photography |
| **XMP** | Extensible Metadata Platform — XML-based metadata standard |
| **Sidecar File** | Separate file (usually .xmp) containing metadata for an asset |
| **3-2-1 Rule** | Backup strategy: 3 copies, 2 media types, 1 offsite |
| **Git LFS** | Git Large File Storage — Git extension for handling large binary files |
| **SVN** | Apache Subversion — centralized version control system |
| **Perforce** | Helix Core — version control optimized for large binary assets |
| **Checksum** | Hash value used to verify file integrity (MD5, SHA256) |
| **Cold Storage** | Low-cost storage for infrequently accessed data (tape, glacier) |
| **Hot Storage** | High-performance storage for actively used data (SSD, NAS) |
| **Semantic Versioning** | Version numbering: major.minor.patch (v2.1.0) |
| **Deduplication** | Process of identifying and removing duplicate files |
| **Lifecycle Management** | Process of managing assets from creation through archive/deletion |

## Conventions / Naming Standards

- Assets: `YYYY-MM-DD_Project_Description_Version.ext`
- Photos: `YYYYMMDD_Subject_Number.ext` (e.g., `20260115_ProductShot_001.dng`)
- Videos: `YYYY-MM-DD_Project_Scene_Take.ext` (e.g., `2026-01-15_Interview_A_Take2.mp4`)
- Audio: `YYYY-MM-DD_Project_Type.ext` (e.g., `2026-01-15_Podcast_VO.wav`)
- Documents: `Project_DocumentType_Version.ext` (e.g., `BlenderRig_Animation_v2.psd`)
- 3D Models: `AssetName_Type_Version.ext` (e.g., `Character_Hero_HighPoly_v03.fbx`)
- Exports: `Project_Platform_Version.ext` (e.g., `Tutorial_YouTube_v1.mp4`)

## Architecture / Workflow Notes

A well-organized asset system has three layers: Storage (physical files) → Index (metadata/tags for search) → Access (permissions and sharing). Each layer should be designed independently but integrate with others.

**File lifecycle:** Creation → Active work (hot storage) → Review → Delivery → Archive (cold storage) → Deletion

**Metadata types by asset:**
- Photos: EXIF (camera data), IPTC (captions, credits), XMP (keywords, ratings)
- Videos: QuickTime metadata, XMP, sidecar XML
- Audio: BWF (Broadcast Wave Format), ID3 tags
- Documents: Document properties, XMP

## Key Tools / Commands

- `exiftool -all= image.jpg` — Strip all metadata
- `exiftool -TagsFromFile source.xmp -all:all target.jpg` — Apply XMP to file
- `git lfs track "*.psd"` — Track PSD files with Git LFS
- `git lfs ls-files` — List tracked files
- `certutil -hashfile filename MD5` — Generate checksum (Windows)
- `Get-FileHash filename -Algorithm SHA256` — SHA256 hash (PowerShell)
- `Advanced Renamer`, `PowerRename`, `Name Mangler` — Batch rename tools

## Recommended Project Structure

```
project_root/
├── _archive/           (completed projects, read-only)
├── _backup/            (automated backups, not for manual access)
├── _templates/         (project templates, naming guides)
├── project_active/
│   ├── 01_planning/    (briefs, scripts, storyboards)
│   │   ├── briefs/
│   │   ├── scripts/
│   │   └── references/
│   ├── 02_source/      (raw camera files, purchased assets)
│   │   ├── video/
│   │   ├── audio/
│   │   ├── photos/
│   │   └── graphics/
│   ├── 03_work/        (in-progress edited files)
│   │   ├── projects/
│   │   ├── exports/
│   │   └── reviews/
│   ├── 04_deliverables/ (final client-ready assets)
│   │   ├── final/
│   │   ├── web/
│   │   └── print/
│   └── 05_docs/        (project documentation)
│       ├── notes/
│       └── invoices/
└── _sandbox/           (experimental, non-project files)
```
