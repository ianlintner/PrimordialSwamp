# Primordial Swamp - Asset Directory

This directory contains all game assets for Primordial Swamp.

## Directory Structure

```
assets/
├── sprites/           # Character and object sprites
│   ├── dinosaurs/     # Playable dinosaur sprites
│   ├── enemies/       # Enemy dinosaur sprites
│   ├── bosses/        # Boss encounter sprites
│   └── effects/       # Visual effects (particles, impacts, status)
├── backgrounds/       # Parallax background layers per biome
│   ├── coastal-wetlands/
│   ├── fern-prairies/
│   ├── volcanic-highlands/
│   ├── tar-pits/
│   ├── ancient-forest/
│   └── inland-sea/
├── ui/                # User interface elements
│   ├── icons/         # Status, trait, ability icons
│   ├── panels/        # Panel backgrounds and frames
│   ├── buttons/       # Button states (normal, hover, pressed)
│   └── health-bars/   # Health and stamina bar components
└── audio/             # Sound assets
    ├── music/         # Background music tracks
    ├── sfx/           # Sound effects
    └── ambience/      # Environmental ambient sounds
```

## File Formats

### Graphics
- **Sprites**: PNG with transparency (sprite sheets with JSON atlas preferred)
- **Backgrounds**: PNG (1920x1080 base resolution, scalable)
- **Icons**: PNG (32x32 or 16x16) or SVG for scalable UI
- **UI Elements**: PNG with 9-slice support where applicable

### Audio
- **Music**: OGG format (44.1kHz, 16-bit, looped)
- **SFX**: WAV or OGG (44.1kHz, 16-bit)
- **Ambience**: OGG format (seamless loop)

## See Also
- [Asset Manifest](../docs/ASSET_MANIFEST.md) - Complete asset checklist with priorities
- [Credits](CREDITS.md) - Attribution for all external assets
