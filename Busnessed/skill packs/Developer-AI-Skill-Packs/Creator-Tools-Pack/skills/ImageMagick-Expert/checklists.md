# ImageMagick-Expert Checklists

## Pre-Flight Checklist

- [ ] ImageMagick installed (magick --version)
- [ ] Required delegates installed (libpng, libjpeg, libwebp, libtiff, etc.)
- [ ] Ghostscript installed for PDF operations (if needed)
- [ ] Fonts available for text annotations
- [ ] Input images verified with identify
- [ ] Sufficient disk space for output (3x+ expected)
- [ ] Memory limits configured for large images
- [ ] Test operation on single image first
- [ ] Backup of originals if using mogrify
- [ ] Target format requirements documented

## Implementation Checklist

- [ ] Correct geometry specification used (^, !, >, < modifiers)
- [ ] Color space handling appropriate for source and output
- [ ] Quality setting balanced between size and appearance
- [ ] Filter parameters tested for desired effect strength
- [ ] Composite blend mode produces correct result
- [ ] Text annotations positioned and sized correctly
- [ ] GIF frame timing and looping configured
- [ ] Batch operation uses -path to preserve originals
- [ ] Metadata handled according to requirements
- [ ] Output format matches target use case

## Testing Checklist

- [ ] Output image visually inspected at 100%
- [ ] Colors match source within expected tolerance
- [ ] Dimensions exactly as specified
- [ ] No unintended artifacts (halos, banding, color shift)
- [ ] Transparency handled correctly (if applicable)
- [ ] Text rendered with correct font and position
- [ ] GIF animation plays at correct speed
- [ ] Batch processed files all present and correct
- [ ] File sizes within expected range
- [ ] Metadata verified with identify

## Release Checklist

- [ ] Final images delivered in required formats
- [ ] All sizes and variants generated
- [ ] Image naming follows project convention
- [ ] Batch scripts documented and archived
- [ ] Processing logs saved for audit
- [ ] Source files backed up
- [ ] Watermark/overlay consistency verified across batch
- [ ] Color profiles embedded for print output
- [ ] Quality control sampled from batch
- [ ] Delivery checklist complete and signed off

## Maintenance Checklist

- [ ] ImageMagick updated annually or for security patches
- [ ] Delegate library versions checked for compatibility
- [ ] Batch scripts validated after version updates
- [ ] Preset templates reviewed for efficiency improvements
- [ ] Disk storage cleaned of intermediate files
- [ ] New format support evaluated (AVIF, JPEG XL)
- [ ] Color profile library updated
- [ ] Font cache refreshed after OS updates
