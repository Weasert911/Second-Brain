# Godot UI Designer - Checklists

## UI Implementation Checklist

### Layout
- [ ] Containers used for responsive layout
- [ ] Anchors set correctly for positioning
- [ ] Size flags configured for expansion
- [ ] Min size set for buttons and controls
- [ ] Tested on multiple resolutions
- [ ] Tested on 16:9, 16:10, 4:3 aspect ratios

### Theme
- [ ] Theme resource created and applied
- [ ] StyleBoxes configured for all control states
- [ ] Font sizes consistent
- [ ] Color palette consistent
- [ ] Hover/pressed/disabled states styled
- [ ] Focus indicators visible

### Accessibility
- [ ] Focus navigation works with keyboard
- [ ] Focus navigation works with gamepad
- [ ] Tab order logical
- [ ] Tooltip text for important controls
- [ ] High contrast mode considered

### Text
- [ ] Labels use translation keys
- [ ] Font supports character set for all locales
- [ ] Text wrapping enabled for long translations
- [ ] BBCode used for rich text formatting

### Animation
- [ ] Transitions between screens smooth
- [ ] Button hover/press feedback
- [ ] Loading screens have progress indication
- [ ] Notifications animate in/out

### Touch Support
- [ ] Controls large enough for touch (min 44px)
- [ ] Touch areas have proper padding
- [ ] Swipe/scroll gestures work
- [ ] Virtual keyboard handled for text input

### Performance
- [ ] UI updates batched (not every frame)
- [ ] Texture memory for UI elements optimized
- [ ] RichTextLabel not updated every frame
- [ ] Theme resource cached (not reloaded)

### Localization
- [ ] All visible strings use tr()
- [ ] Translations loaded for all supported languages
- [ ] UI re-layouts correctly with different text lengths
- [ ] Right-to-left languages supported (if applicable)

### Input
- [ ] UI blocks game input when open
- [ ] Pause menu pauses game
- [ ] Back button works on all screens
- [ ] Mouse/controller switching handled
