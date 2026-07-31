# Versioning Strategy

## Semantic Versioning

All packs and skills follow `MAJOR.MINOR.PATCH`:

| Bump | When | Example |
|------|------|---------|
| **MAJOR** | Breaking workflow changes, removed skills | 1.0.0 → 2.0.0 |
| **MINOR** | New skills added, non-breaking improvements | 1.0.0 → 1.1.0 |
| **PATCH** | Fixes, clarifications, updated references | 1.0.0 → 1.0.1 |

## Version Tracking

Each SKILL.md has version metadata:

```yaml
name: "Godot-4-Expert"
version: "1.0.0"
```

The root CHANGELOG.md tracks all pack-level changes.

## Compatibility

Skills are backward compatible within the same MAJOR version. Upgrading a MAJOR version may require workflow changes.

## Update Cadence

- **Minor updates**: Monthly (new patterns, tools, APIs)
- **Patch updates**: As needed (bug fixes, reference updates)
- **Major updates**: Quarterly (workflow redesigns, major tool changes)
