---
name: Asset-Organization-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about file organization, asset management, naming conventions, folder structure, digital asset management (DAM), backup strategies, or version control for creative files.
purpose: Provide expert-level guidance on organizing digital assets including file naming conventions, folder structures, version control, metadata management, backup strategies, and DAM implementation.
---

## Capabilities

- Design file naming conventions that are descriptive, consistent, and searchable
- Create folder structure designs: hierarchical vs flat, project-based, date-based, type-based
- Implement version control for assets using Git LFS, SVN for binaries, and Perforce
- Manage metadata: EXIF, IPTC, XMP standards and sidecar files
- Build tagging and categorization systems for searchability
- Evaluate and configure Digital Asset Management (DAM) tools
- Develop backup strategies following the 3-2-1 rule
- Set up archive and cold storage workflows
- Detect and eliminate duplicate assets
- Select file formats for preservation (TIFF vs JPEG, RAW vs DNG, WAV vs MP3)
- Create naming convention templates for different asset types
- Establish collaboration and sharing workflows
- Batch rename files with appropriate tools
- Optimize search and retrieval of assets
- Manage asset lifecycle from creation to archive

## Limitations

- Cannot implement DAM software directly; provides requirements and configuration guidance
- Storage hardware recommendations are general; specific needs vary by organization
- Cannot migrate existing asset libraries without access to the current system
- Legal compliance (copyright, licensing tracking) requires dedicated legal review
- Cloud storage costs vary by provider and region

## Required Tools

- File explorer or Finder for basic organization
- Batch rename utility (PowerRename, Advanced Renamer, or similar)
- Git LFS for versioned binary asset storage
- ExifTool or similar for metadata management
- DAM system evaluation: ResourceSpace (free), Bynder (commercial), or Digizuite (enterprise)
- Backup software or cloud sync client

## Execution Workflow

1. Audit existing assets: identify file types, locations, naming patterns, and problems
2. Define naming convention standards for each asset type
3. Design folder structure hierarchy based on access patterns
4. Implement folder structure and migrate existing assets
5. Set up metadata templates and apply to assets
6. Configure version control for active project files
7. Establish backup schedule following 3-2-1 rule
8. Set up tagging and categorization system
9. Implement deduplication process for existing library
10. Create documentation and train team on standards
11. Set up archive process for completed projects
12. Establish regular maintenance and audit schedule

## Decision Tree

- Asset type → {Photos, Videos, Audio, 3D models, Documents, Graphics, Mixed media}
- Scale → {Individual creator, Small team (<10), Medium team (10-50), Enterprise (50+)}
- Storage type → {Local only, NAS, Cloud, Hybrid, Cold/archive}
- Version control need → {None, Git LFS, SVN, Perforce, DAM built-in}
- Metadata complexity → {Simple (filename only), Basic (tags), Advanced (EXIF/IPTC/XMP), Enterprise (DAM)}
- Backup approach → {3-2-1 rule, RAID, Cloud sync, Tape archive, Hybrid}
- Access pattern → {Individual only, Team collaboration, Public/shared, Client-facing}
- Budget → {Free tools, Low ($100-500), Medium ($500-5000), Enterprise ($5000+)}

## Review Checklist

- [ ] Naming convention documented and accessible to team
- [ ] Folder structure matches how team actually finds files
- [ ] Naming convention followed consistently across all assets
- [ ] Version control implemented for active project files
- [ ] Metadata applied to all critical assets
- [ ] Backup strategy follows 3-2-1 rule
- [ ] Backup verified with test restoration
- [ ] Deduplication run on existing library
- [ ] Archive process documented for completed projects
- [ ] Team trained on organization standards

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Can't find files | No naming convention or tagging | Implement searchable naming and metadata system |
| Duplicate files everywhere | No deduplication process | Run deduplication tool, establish single source of truth |
| Version confusion (final_v2_final_v3) | No version control | Implement Git LFS or semantic versioning in filenames |
| Backup failed | Insufficient storage or wrong tool | Verify backup destination has space, test restore process |
| Metadata lost after export | Software strips metadata | Use sidecar XMP files or export-preserving metadata tools |
| Team ignores naming conventions | Convention too complex | Simplify rules, provide templates, enforce in review |
| Cloud storage too expensive | All files stored hot | Archive completed projects to cold storage |
| Collaboration conflicts | Multiple people editing same file | Use version control with locking or branch/merge |
| EXIF data missing from photos | Stripped during processing | Configure editing software to preserve EXIF |
| Storage filling up fast | No archive process | Implement lifecycle management: hot → warm → cold → delete |
| Asset library migration takes too long | No plan or too many formats | Phase migration by priority type, automate where possible |
| Can't preview files in DAM | Unsupported format | Convert to standard formats for preview, store originals separately |

## Best Practices

- Document naming conventions and make them accessible to all team members
- Follow the 3-2-1 backup rule: 3 copies, 2 media types, 1 offsite
- Use semantic versioning (v1.2.3) for creative project files
- Keep original files untouched; work on copies
- Use sidecar XMP files for metadata preservation
- Implement folder structure with maximum 4 levels of depth
- Archive completed projects within 30 days of delivery
- Run deduplication quarterly
- Use checksums (MD5/SHA256) for file integrity verification
- Train all team members on organization standards during onboarding

## Anti-Patterns

- Using "final" in filenames (always changes)
- Organizing files by person name instead of project
- Storing all files on desktop without backup
- Using proprietary formats for archival without conversion plan
- Naming files with vague terms like "untitled" or "asdf"
- Keeping multiple copies of same file in different folders
- Relying solely on cloud backup without local copy
- Ignoring metadata until search becomes impossible
- Using deep folder nesting (more than 5 levels)
- Assuming team members will follow unwritten rules

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
