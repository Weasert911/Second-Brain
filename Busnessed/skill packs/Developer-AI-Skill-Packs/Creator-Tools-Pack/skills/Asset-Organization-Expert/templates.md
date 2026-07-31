# Asset-Organization-Expert Templates

## Template 1: File Naming Convention Standard

**Description:** Standard naming convention documentation template.

```
Name: NamingConvention_{{department}}_{{version}}

Date: {{effective_date}}
Applies to: {{scope}}

Pattern: {{date}}_{{project}}_{{descriptor}}_{{version}}.{{ext}}

Fields:
1. Date: {{date_format}} (YYYYMMDD or YYYY-MM-DD) — first field for sortability
2. Project: {{project_code}} or {{project_name}} — consistent abbreviation
3. Descriptor: {{content_description}} — 2-5 words describing content
4. Version: {{version_format}} (v01, v02 or v1.0, v2.1)
5. Extension: {{file_extension}} (native format)

Examples:
- Photo: 20260115_Product_Launch_Event_001.jpg
- Video: 2026-01-15_Interview_GuestName_Take2.mp4
- PSD: ProjectX_CharacterDesign_v02.psd
- 3D Model: Character_Hero_HighPoly_v03.fbx

Prohibited: "final", "_v2_final", spaces, special characters (&, %, #)
Recommended: dashes between date parts, underscores between other fields
```

**Usage Notes:** Document and share with entire team. Enforce in code review or file check. Update when gaps are found. Keep pattern consistent across all asset types.

---

## Template 2: Folder Structure Blueprint

**Description:** Standard folder hierarchy for creative projects.

```
Name: FolderStructure_{{project_type}}

Project Root: {{root_path}}/{{project_name}}/

├── 00_Admin/
│   ├── Briefs/
│   ├── Contracts/
│   ├── Invoices/
│   └── Schedule/
├── 01_Source/
│   ├── Video/
│   │   ├── CamA/
│   │   ├── CamB/
│   │   └── Broll/
│   ├── Audio/
│   │   ├── Dialogue/
│   │   ├── Music/
│   │   ├── SFX/
│   │   └── VO/
│   ├── Photos/
│   ├── Graphics/
│   │   ├── Logos/
│   │   ├── Templates/
│   │   └── Illustrations/
│   └── 3D/
│       ├── Models/
│       ├── Textures/
│       └── Renders/
├── 02_Work/
│   ├── Edits/
│   ├── Approvals/
│   └── Versions/
├── 03_Deliverables/
│   ├── Final/
│   ├── Web/
│   ├── Print/
│   └── Social/
└── 04_Docs/
    ├── Notes/
    └── References/

Rules:
- No more than 4 levels deep
- Number prefixes for sort order
- Consistent across all projects
- README.md at root with project description
```

**Usage Notes:** Create as template and copy for each new project. Customize subfolders per project type. Archive entire folder when project completes.

---

## Template 3: Metadata Schema

**Description:** Standard metadata fields to apply to assets.

```
Name: MetadataSchema_{{department}}

Required Fields (apply to ALL assets):
- Title: {{title}} (human-readable name)
- Creator: {{creator_name}} (who created/edited)
- Date Created: {{creation_date}} (ISO 8601)
- Project: {{project_name}} (which project asset belongs to)
- Description: {{description}} (brief content summary)

Asset-Specific Fields:

Photos/Images:
- Copyright: {{copyright_holder}}
- Usage Rights: {{usage_license}} (Commercial/Editorial/Restricted)
- Keywords: {{keywords}} (comma-separated, controlled vocabulary)
- Location: {{location}} (GPS or place name if relevant)

Video:
- Duration: {{duration}}
- Frame Rate: {{fps}}
- Resolution: {{resolution}}
- Scene/Take: {{scene_take}} (production metadata)

Audio:
- Duration: {{duration}}
- Sample Rate: {{sample_rate}}
- Bit Depth: {{bit_depth}}
- Genre: {{genre}}

3D Models:
- Polygon Count: {{poly_count}}
- Format: {{file_format}}
- Textured: {{textured}} (Yes/No)
- Rigged: {{rigged}} (Yes/No)

Implementation: Use XMP sidecar files for preservation
```

**Usage Notes:** Keep required fields minimal to encourage adoption. Use controlled vocabulary dropdowns in DAM. Audit metadata completeness quarterly.

---

## Template 4: Backup Strategy Plan

**Description:** 3-2-1 backup strategy documentation.

```
Name: BackupPlan_{{organization}}_{{date}}

3-2-1 Rule:
- 3 Copies: Primary (working), Local backup, Offsite backup
- 2 Media: Local HDD/SSD + Cloud/NAS
- 1 Offsite: Cloud storage or remote location

Backup Schedule:
- Active Projects: {{active_frequency}} (daily or continuous sync)
- Completed Projects: {{archive_frequency}} (weekly or monthly)
- System/Config: {{system_frequency}} (daily)
- Full System Image: {{full_frequency}} (weekly)

Backup Locations:
1. Primary: {{primary_location}} (working drive, NAS, local)
2. Local Backup: {{local_backup}} (external HDD, secondary NAS)
3. Offsite: {{offsite_backup}} (cloud: Backblaze/Dropbox/Glacier)

Retention:
- Daily backups: {{daily_retention}} (keep 7-30 days)
- Weekly backups: {{weekly_retention}} (keep 4-12 weeks)
- Monthly backups: {{monthly_retention}} (keep 6-12 months)
- Annual archives: {{annual_retention}} (keep indefinitely)

Test Restoration: {{test_schedule}} (quarterly full restore test)
Alert Contacts: {{alert_contacts}} (notify on backup failure)
```

**Usage Notes:** Test restoration quarterly — backups are only as good as their restores. Document recovery procedure. Automate as much as possible. Keep backup documentation with backup media.

---

## Template 5: Asset Lifecycle Policy

**Description:** Define asset stages from creation through deletion.

```
Name: Lifecycle_{{organization}}_{{version}}

Stages:
1. Creation — Asset is created or imported
   - Action: Apply naming convention, add minimum metadata
   - Storage: Hot (working SSD/NAS)
   
2. Active Work — Asset is being edited and reviewed
   - Action: Version control tracking, regular saves
   - Storage: Hot (project folder)
   
3. Review — Asset is in approval process
   - Action: Add review notes, status metadata
   - Storage: Hot (review folder)
   
4. Delivery — Asset is finalized and delivered
   - Action: Final export, metadata review, checksum
   - Storage: Hot (deliverables folder)
   
5. Archive — Project completed, asset not actively needed
   - Action: Move to archive, update inventory
   - Storage: Cold (archive drive, glacier)
   - Retention: {{archive_retention}} (e.g., 2 years)
   
6. Deletion — Asset exceeds retention policy
   - Action: Final review, confirm no references, delete
   - Storage: None
   - Approval: {{deletion_approval}} (who must sign off)

Exceptions: {{exceptions}} (e.g., master assets kept indefinitely)
```

**Usage Notes:** Automate stage transitions where possible. Define clear criteria for each stage. Document who has authority to approve stage changes. Review policy annually.

---

## Template 6: DAM Software Evaluation Matrix

**Description:** Criteria for evaluating Digital Asset Management software.

```
Name: DAM_Evaluation_{{organization}}

Requirements:
- Users: {{user_count}} (named users)
- Assets: {{asset_count}} (total assets)
- Storage: {{storage_needed}} TB (initial + annual growth {{growth}}%)
- Budget: {{budget}} (monthly or one-time)

Evaluation Criteria (score 1-5):

1. Metadata Management: ___ /5
   - Custom fields, controlled vocabularies, bulk editing

2. Search & Discovery: ___ /5
   - Full-text search, filters, visual similarity, AI tagging

3. Version Control: ___ /5
   - Version history, check-in/check-out, rollback

4. Integration: ___ /5
   - Adobe CC, Figma, Slack, project management tools

5. Permissions: ___ /5
   - User roles, folder-level access, sharing controls

6. Performance: ___ /5
   - Preview generation speed, thumbnail caching, CDN

7. Scalability: ___ /5
   - Cloud vs on-premise, storage limits, user limits

8. Cost: ___ /5
   - License, storage, user fees, support costs

Top Candidates:
1. {{dam_1}} — Score: {{score_1}}, Cost: {{cost_1}}
2. {{dam_2}} — Score: {{score_2}}, Cost: {{cost_2}}
3. {{dam_3}} — Score: {{score_3}}, Cost: {{cost_3}}

Recommendation: {{recommendation}}
```

**Usage Notes:** Weight criteria based on organization priorities. Request trials for top 2-3 candidates. Test with real team workflow, not demo data.

---

## Template 7: Version Control Strategy

**Description:** Version numbering and branching strategy for creative assets.

```
Name: VersionStrategy_{{team}}

Version Numbering: {{major}}.{{minor}}.{{patch}}

Rules:
- Major (X.0.0): Significant redesign, new concept
- Minor (1.X.0): Changes to existing design, client revisions
- Patch (1.0.X): Small fixes, file format updates, metadata changes

File Naming:
- Working: ProjectName_Asset_v{version}.ext (e.g., LogoDesign_v1.2.psd)
- Approved: ProjectName_Asset_v{version}_APPROVED.ext
- Export: ProjectName_Asset_v{version}_{platform}.ext

Branching (for teams):
- main/production: Approved, deliverable assets
- develop: In-progress work, daily saves
- feature/{name}: Experimental versions, client revision branches

Tools:
- Git LFS for Binary files (.psd, .png, .mp4, .wav)
- Perforce for large-scale game/3D asset teams
- SVN for video production teams

Locking: Enable file locking for non-mergeable formats (.psd, .blend, .prproj)
```

**Usage Notes:** Semantic versioning reduces "final_v2_final" confusion. Lock files that can't be merged. Document branching strategy for team.

---

## Template 8: Archive Procedure

**Description:** Step-by-step archive process for completed projects.

```
Name: Archive_{{project_name}}_{{date}}

Pre-Archive Checklist:
- [ ] All deliverables confirmed accepted by client
- [ ] Final invoices sent and payments reconciled
- [ ] All feedback versions consolidated
- [ ] Unnecessary temp/intermediate files deleted
- [ ] Naming convention verified on all files
- [ ] Metadata updated and verified
- [ ] Copyright and usage rights documented

Archive Package Contents:
1. Deliverables/
   - Final exports in required formats
   - Source project files (PSD, PRPROJ, BLEND, etc.)
   - Rendered image sequences if applicable
2. Source/
   - Camera originals (RAW, LOG footage)
   - Purchased assets with license documentation
   - Reference materials collected during project
3. Docs/
   - Project brief and creative brief
   - Client communication summary
   - Notes on technical specs and settings
4. manifest.txt — File list with checksums

Storage: {{archive_location}}
Retention: {{retention_period}}
Checksum: {{checksum_method}} (generate after packing)

Archive completed: {{archive_date}}
Archived by: {{archived_by}}
```

**Usage Notes:** Automate archive creation with script where possible. Keep archive in cold storage to save costs. Include license documentation for purchased assets. Create searchable index of all archives.
