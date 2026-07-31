# Steam Release Checklist - Checklists

## Pre-Launch Checklist

### Steamworks Setup
- [ ] App created in Steamworks partner site
- [ ] App ID assigned
- [ ] Developer account active
- [ ] Bank and tax info submitted
- [ ] Steam Direct fee paid (refundable)

### Build Configuration
- [ ] Depots created and configured
- [ ] Build branches set up (default, beta, dev)
- [ ] Store presence set to Coming Soon
- [ ] Release date configured

### Steamworks SDK Integration
- [ ] GodotSteam or GDNative integration working
- [ ] Steam init successful on startup
- [ ] Overlay working (Shift+Tab)
- [ ] Achievements defined in Steamworks
- [ ] Leaderboards defined in Steamworks

### Achievements
- [ ] All achievement API names match Steamworks
- [ ] Achievement unlockable and storable
- [ ] Achievement progress tracked (if incremental)
- [ ] Hidden achievements working correctly
- [ ] Stats reset for testing

### Cloud Saves
- [ ] Save path in Steam Cloud directory
- [ ] Save/load works with Steam Cloud enabled
- [ ] File quota within limits
- [ ] Sync across devices tested
- [ ] Conflict resolution handled

### Store Page Content
- [ ] Short description compelling (max 300 chars)
- [ ] Long description complete
- [ ] Screenshots uploaded (min 5, 1920x1080)
- [ ] Trailer uploaded (if applicable)
- [ ] Capsule art all required sizes
- [ ] Library assets configured
- [ ] System requirements accurate
- [ ] Tags and categories set
- [ ] Pricing configured per region
- [ ] Release date set

### Testing
- [ ] Build runs on clean Windows install
- [ ] Build runs on macOS (if applicable)
- [ ] Build runs on Linux/Steam Deck (if applicable)
- [ ] Steam overlay functional
- [ ] Achievements unlock correctly
- [ ] Leaderboard scores submit correctly
- [ ] Cloud saves sync correctly
- [ ] Controller support working
- [ ] Game tested with Steam DRM

## Launch Day Checklist
- [ ] Final build uploaded to default branch
- [ ] Store page set to public
- [ ] Community hub opened
- [ ] Launch announcement posted
- [ ] Server capacity verified (if multiplayer)
- [ ] Crash monitoring active
- [ ] Support channel ready
- [ ] Known issues documented

## Post-Launch Checklist
- [ ] Monitor reviews and ratings
- [ ] Respond to community feedback
- [ ] Patch critical bugs first
- [ ] Track achievement statistics
- [ ] Monitor sales data per region
- [ ] Plan content updates
- [ ] Consider sales and bundles
