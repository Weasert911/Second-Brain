# ImageMagick-Expert Examples

## Beginner Example: Basic Image Conversion and Resize

**Goal:** Convert a large RAW photo to a web-optimized JPEG.

```bash
magick input.tif -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 -strip output.jpg
```

**Explanation:** Reads TIFF input, resizes to fill 1920x1080 (^ flag ensures minimum coverage), crops to exact dimensions with center gravity, applies 85% JPEG quality, strips metadata for smaller file size.

**Key Techniques:** Format conversion, resize with crop, gravity, quality setting, metadata stripping.

---

## Intermediate Example: Batch Watermark and Thumbnail

**Goal:** Process all photos in a folder with watermark and thumbnail generation.

```bash
REM Create thumbnails
magick mogrify -path output/thumbnails -resize 400x400^ -gravity center -extent 400x400 -quality 80 *.jpg

REM Create watermarked web images
for %%f in (*.jpg) do (
  magick "%%f" -resize 1920x1080 -quality 90 ^
    \( watermark.png -resize 200x -background none -gravity southeast -geometry +20+20 -composite \) ^
    -flatten "output/web\%%f"
)
```

**Explanation:** First command batch-resizes all JPGs to 400x400 thumbnails. Second loop overlays a watermark PNG on each image resized to 1920x1080, positioned southeast with 20px padding.

**Key Techniques:** Batch processing with mogrify, composite with watermark, batch loop, output organization.

---

## Advanced Example: Automated Product Photo Pipeline

**Goal:** Process product photos with background removal, color correction, and multiple output sizes.

```bash
REM Step 1: Remove background (assumes green screen)
magick input.jpg -fuzz 15% -transparent "rgb(0,255,0)" -trim step1.png

REM Step 2: Create drop shadow
magick step1.png \( +clone -background black -shadow 80x5+10+10 \) +swap -background white -layers merge +repage step2.png

REM Step 3: Apply color correction and sharpening
magick step2.png -colorspace sRGB -level 10%,90%,1.2 -sharpen 0x0.8 -modulate 110,100,100 step3.png

REM Step 4: Create all output variants
magick step3.png -resize 1920x1080 -quality 90 output/full.jpg
magick step3.png -resize 800x800 -quality 85 output/square.jpg
magick step3.png -resize 400x400 -quality 80 output/thumb.jpg
magick step3.png -resize 150x150 -quality 75 output/icon.jpg

REM Step 5: Create WebP versions
magick output/full.jpg output/full.webp
magick output/square.jpg output/square.webp

REM Cleanup intermediate files
del step1.png step2.png step3.png
```

**Explanation:** Complete product photo pipeline: background removal from green screen, drop shadow creation, color level adjustment and sharpening, multi-resolution output generation including WebP for modern browsers.

**Key Techniques:** Chroma key transparency, drop shadow composite, color leveling, multi-format output, pipeline automation.

---

## Production Example: E-Commerce Image Processing System

**Goal:** Production batch processing for 10,000+ e-commerce images with quality control.

```powershell
# ecommerce_pipeline.ps1
param([string]$inputDir, [string]$outputDir)

$sizes = @{
    "full" = @("1920", "1080", "90")
    "zoom" = @("1200", "1200", "90")
    "grid" = @("500", "500", "85")
    "cart" = @("200", "200", "80")
    "thumb" = @("100", "100", "75")
}

Get-ChildItem $inputDir -Filter *.tif | ForEach-Object {
    $base = $_.BaseName
    Write-Progress -Activity "Processing $base" -Status "Converting"
    
    # Read once, process with sub-image processing
    magick $_.FullName -auto-gamma -auto-level -colorspace sRGB -strip temp_$base.png
    
    foreach ($size in $sizes.Keys) {
        $w = $sizes[$size][0]
        $h = $sizes[$size][1]
        $q = $sizes[$size][2]
        $outDir = "$outputDir\$size"
        New-Item -ItemType Directory -Force -Path $outDir
        
        magick temp_$base.png -resize "${w}x${h}^" -gravity center -extent "${w}x${h}" -quality $q -profile sRGB.icc "$outDir\$base.jpg"
        magick "$outDir\$base.jpg" "$outDir\$base.webp"
    }
    
    Remove-Item temp_$base.png
    
    # Generate QC sheet
    magick montage "$outputDir\full\$base.jpg" "$outputDir\grid\$base.jpg" "$outputDir\thumb\$base.jpg" -tile 3x1 -geometry +2+2 "$outputDir\qc\${base}_qc.jpg"
}
```

**Explanation:** Enterprise-grade pipeline processing TIFF source images through auto-leveling, generating 5 size variants in both JPEG and WebP, with quality control montage sheets. Uses sub-image processing to avoid repeated decoding.

**Key Techniques:** High-volume automation, sub-image cache, multi-format generation, quality control, ICC profile embedding, montage QC sheets.
