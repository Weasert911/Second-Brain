# Asset-Organization-Expert Snippets

## Snippet 1: Batch Rename with PowerShell

**Description:** Rename all files in folder with date prefix and sequence number.

```powershell
$counter = 1
Get-ChildItem -Path "C:\photos" -Filter *.jpg | Sort-Object LastWriteTime | ForEach-Object {
    $newName = "20260115_Event_{0:D4}.jpg" -f $counter
    Rename-Item -Path $_.FullName -NewName $newName
    $counter++
}
```

**When to use:** Initial batch rename of unsorted photo collection to standardized naming convention.

---

## Snippet 2: Generate File Integrity Checksums

**Description:** Create SHA256 checksums for all files in a directory.

```powershell
Get-ChildItem -Path "C:\archive" -Recurse -File | ForEach-Object {
    $hash = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
    "$hash  $($_.Name)" | Out-File -FilePath "C:\archive\checksums.sha256" -Append
}
```

**When to use:** Before archiving projects to verify future file integrity. Run quarterly on archived assets.

---

## Snippet 3: Remove EXIF Metadata

**Description:** Strip all EXIF/metadata from images for privacy.

```bash
exiftool -all= -overwrite_original *.jpg
```

**When to use:** Before publishing images online to remove GPS location, camera serial, and personal metadata.

---

## Snippet 4: Copy Metadata from XMP Sidecar

**Description:** Apply metadata from XMP sidecar file to image.

```bash
exiftool -TagsFromFile source.xmp -all:all target.jpg
```

**When to use:** When metadata has been preserved in sidecar files but needs to be written back to images after editing.

---

## Snippet 5: Git LFS Tracking Configuration

**Description:** Configure Git LFS for creative file types.

```bash
REM Initialize Git LFS
git lfs install

REM Track file types
git lfs track "*.psd"
git lfs track "*.blend"
git lfs track "*.prproj"
git lfs track "*.png"
git lfs track "*.mp4"
git lfs track "*.wav"
git lfs track "*.exr"

REM Commit .gitattributes
git add .gitattributes
git commit -m "Configure Git LFS for creative files"
```

**When to use:** Setting up Git LFS for version-controlled creative projects where binary files are too large for standard Git.

---

## Snippet 6: Find and Remove Duplicate Files

**Description:** Find duplicate files by checksum and generate report.

```powershell
Get-ChildItem -Path "C:\media" -Recurse -File | Get-FileHash -Algorithm MD5 | Group-Object Hash | Where-Object { $_.Count -gt 1 } | ForEach-Object {
    $_.Group | Select-Object -Skip 1 | ForEach-Object {
        $_.Path | Out-File -FilePath "C:\duplicates.txt" -Append
    }
}
```

**When to use:** Quarterly deduplication of asset library to reclaim storage space.

---

## Snippet 7: Create Folder Structure from Template

**Description:** Create project folder structure from predefined template.

```powershell
$projectName = "MyProject"
$root = "C:\projects\$projectName"

$folders = @(
    "$root\00_Admin",
    "$root\01_Source\Video",
    "$root\01_Source\Audio",
    "$root\01_Source\Photos",
    "$root\01_Source\Graphics",
    "$root\02_Work",
    "$root\03_Deliverables\Final",
    "$root\03_Deliverables\Web",
    "$root\04_Docs"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
}

New-Item -ItemType File -Path "$root\README.md" -Value "# $projectName`n`nProject started: $(Get-Date -Format 'yyyy-MM-dd')"
```

**When to use:** Starting new projects to ensure consistent folder structure across the organization.

---

## Snippet 8: Archive Project with Checksums

**Description:** Package completed project with checksum manifest.

```powershell
$source = "C:\projects\MyProject"
$archive = "C:\archive\MyProject_$(Get-Date -Format 'yyyyMMdd')"
$archiveFile = "$archive.zip"

# Create archive
Compress-Archive -Path $source -DestinationPath $archiveFile

# Generate checksum
$hash = (Get-FileHash $archiveFile -Algorithm SHA256).Hash
"$hash  $(Split-Path $archiveFile -Leaf)" | Out-File -Path "$archive.sha256"
```

**When to use:** After project delivery and final payment to archive all files and verify integrity.

---

## Snippet 9: Find Files by Metadata Tag

**Description:** Search files by EXIF keyword metadata.

```bash
exiftool -r -keywords="wedding" -if "$keywords" C:\photos
```

**When to use:** Searching photo library by keywords when folder navigation isn't enough.

---

## Snippet 10: Apply Copyright Metadata to All Images

**Description:** Batch add copyright and creator metadata to images.

```bash
exiftool -Copyright="© 2026 Creator Name" -Creator="Creator Name" -UsageTerms="All rights reserved" -overwrite_original *.jpg
```

**When to use:** Before delivering or publishing images to ensure copyright information is embedded.

---

## Snippet 11: File Size Report for Storage Planning

**Description:** Generate storage usage report by file type.

```powershell
Get-ChildItem -Path "C:\media" -Recurse -File | Group-Object Extension | Select-Object @{Name="Extension";Expression={$_.Name}}, Count, @{Name="SizeGB";Expression={[math]::Round(($_.Group | Measure-Object Length -Sum).Sum / 1GB, 2)}} | Sort-Object SizeGB -Descending | Format-Table -AutoSize
```

**When to use:** Storage planning and budget forecasting to understand space usage by asset type.

---

## Snippet 12: Schedule Automated Backup

**Description:** Create scheduled backup task (Windows Task Scheduler).

```powershell
$action = New-ScheduledTaskAction -Execute "robocopy" -Argument "C:\projects D:\backup\projects /MIR /R:3 /W:10 /LOG:D:\backup\log.txt"
$trigger = New-ScheduledTaskTrigger -Daily -At "02:00AM"
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "DailyProjectBackup" -Action $action -Trigger $trigger -Principal $principal -Description "Daily backup of active projects to local backup drive"
```

**When to use:** Setting up automated backup routine to ensure regular backups without manual intervention.

---

## Snippet 13: Convert RAW to DNG for Archival

**Description:** Convert proprietary RAW files to open DNG format.

```bash
REM Using Adobe DNG Converter (command line)
"C:\Program Files\Adobe\Adobe DNG Converter.exe" -c -d C:\dng_output C:\raw_input

REM OR with exiftool + raw converter
REM Note: DNG conversion requires Adobe DNG Converter or similar
```

**When to use:** Archiving RAW photos in open format to avoid software dependency for future access.

---

## Snippet 14: Batch File Type Audit

**Description:** Generate inventory of all files by type and location.

```powershell
$report = @()
Get-ChildItem -Path "C:\media" -Recurse -Directory | ForEach-Object {
    $dir = $_.FullName
    Get-ChildItem -Path $dir -File -Recurse | Group-Object Extension | ForEach-Object {
        $report += [PSCustomObject]@{
            Directory = $dir
            Extension = $_.Name
            Count = $_.Count
            SizeGB = [math]::Round(($_.Group | Measure-Object Length -Sum).Sum / 1GB, 4)
        }
    }
}
$report | Export-Csv -Path "C:\asset_inventory.csv" -NoTypeInformation
```

**When to use:** Creating asset inventory before DAM migration or for storage cost analysis.

---

## Snippet 15: Enforce File Naming Convention

**Description:** Scan folder for files not matching naming convention.

```powershell
$pattern = '^\d{8}_.+_\d{4}\.jpg$'
$mismatched = Get-ChildItem -Path "C:\photos" -Filter *.jpg | Where-Object { $_.Name -notmatch $pattern }
if ($mismatched.Count -gt 0) {
    Write-Host "Files not matching convention:"
    $mismatched | ForEach-Object { Write-Host "  $($_.Name)" }
} else {
    Write-Host "All files match naming convention."
}
```

**When to use:** Pre-archive validation or quarterly compliance check to enforce naming standards.
