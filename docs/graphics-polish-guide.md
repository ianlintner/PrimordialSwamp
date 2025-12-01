# Graphics & Presentation Polish Guide

This document provides comprehensive guidelines for visual polish tasks, configuration examples, and asset naming conventions for the Primordial Swamp game.

## Table of Contents

1. [Visual Polish Task Checklist](#visual-polish-task-checklist)
2. [Lighting Configuration Examples](#lighting-configuration-examples)
3. [Animation Tuning Parameters](#animation-tuning-parameters)
4. [Particle Effect Refinement](#particle-effect-refinement)
5. [Responsive Resolution & Scaling](#responsive-resolution--scaling)
6. [Asset Naming Conventions](#asset-naming-conventions)
7. [Main Menu & Intro Sequence](#main-menu--intro-sequence)

---

## Visual Polish Task Checklist

### Color Palettes

#### Biome Color Schemes
- [ ] **Coastal Wetlands**
  - Sky gradient: `#87CEEB` → `#5D9ECE`
  - Water: `#4A7CA7` with `#6BB4D1` highlights
  - Vegetation: `#4A9D5F`, `#3D7A4D`
  - Mud/sand: `#C4A77D`, `#8B7355`

- [ ] **Fern Prairies**
  - Sky: `#A8D5BA` → `#87CEAB`
  - Ferns: `#228B22`, `#006400`
  - Plains: `#7CCD7C`, `#9ACD32`
  - Accents: `#FFD700` (flowering plants)

- [ ] **Volcanic Highlands**
  - Sky: `#2C3E50` → `#1A252F` with `#FF6B35` glow
  - Lava: `#FF4500`, `#FF6347` with `#FFD700` highlights
  - Rocks: `#36454F`, `#2F4F4F`
  - Ash particles: `#696969`, `#808080`

- [ ] **Tar Pits**
  - Sky: `#4A4A4A` → `#2D2D2D`
  - Tar: `#1A1A1A` with `#3D3D3D` bubbles
  - Bones: `#F5F5DC`, `#FFFAF0`
  - Toxic fumes: `#9ACD32` with `#32CD32` wisps

- [ ] **Ancient Forest**
  - Sky: `#2E8B57` → `#1A3D2A` (canopy filtered)
  - Tree bark: `#8B4513`, `#654321`
  - Moss: `#4A9D5F`, `#3D7A4D`
  - Undergrowth: `#556B2F`, `#6B8E23`

- [ ] **Inland Sea**
  - Sky: `#00CED1` → `#20B2AA`
  - Deep water: `#00008B`, `#191970`
  - Shallow water: `#4169E1`, `#6495ED`
  - Shore: `#DEB887`, `#D2B48C`

#### Creature Color Schemes
- [ ] **Herbivores**: Primary `#4A9D5F` (green) indicators
- [ ] **Carnivores**: Primary `#D94A3D` (red) indicators
- [ ] **Aquatic/Semi-aquatic**: Primary `#4A8BD9` (blue) indicators
- [ ] **Special/Boss**: Primary `#9D4A9D` (purple) indicators

#### UI Color Consistency
- [ ] Verify all buttons use design system colors
- [ ] Ensure health bars use semantic health color `#4A9D5F`
- [ ] Ensure stamina bars use semantic stamina color `#4A8BD9`
- [ ] Verify damage feedback uses danger color `#D94A3D`
- [ ] Check buff/debuff colors match semantic definitions

---

### Lighting Effects

#### Ambient Lighting per Biome
- [ ] **Coastal Wetlands**: Warm daylight (`#FFF8DC`, intensity: 1.0)
- [ ] **Fern Prairies**: Bright noon sun (`#FFFAFA`, intensity: 1.1)
- [ ] **Volcanic Highlands**: Dim ambient (`#8B0000`, intensity: 0.7) + lava glow
- [ ] **Tar Pits**: Overcast (`#A9A9A9`, intensity: 0.8)
- [ ] **Ancient Forest**: Dappled (`#90EE90`, intensity: 0.6) with light rays
- [ ] **Inland Sea**: Underwater caustics (`#87CEEB`, intensity: 0.9)

#### Combat Lighting
- [ ] Normal encounter: Neutral lighting
- [ ] Elite encounter: Slightly darkened ambient with red rim lighting
- [ ] Boss encounter: Dramatic spotlight effect, darkened edges

---

### Visual Effects

#### Combat Effects
- [ ] Screen shake on heavy hits (configurable intensity)
- [ ] Flash overlay on critical damage taken
- [ ] Vignette effect when HP below 25%
- [ ] Slow-motion effect on killing blow
- [ ] Screen flash on level up

#### Particle Systems
- [ ] Hit impact particles (blood/energy based on attack type)
- [ ] Critical hit explosion effect
- [ ] Status effect persistent particles (poison bubbles, bleed drops)
- [ ] Heal effect rising particles
- [ ] Death fade/dissolve particles

---

### UI Polish

#### Menu Animations
- [ ] Title text gentle floating animation
- [ ] Button entrance stagger animation on scene load
- [ ] Parallax background movement on menu
- [ ] Hover scale effect on buttons (1.05x)
- [ ] Click shrink feedback (0.95x, 50ms)

#### Combat UI Animations
- [ ] Health bar smooth transition on damage/heal
- [ ] Stamina bar regeneration pulse
- [ ] Action button cooldown overlay
- [ ] Damage number popup and float animation
- [ ] Combat log entry slide-in effect

#### Map UI Animations
- [ ] Node hover glow effect
- [ ] Selection pulse animation
- [ ] Path drawing progressive reveal
- [ ] Current position marker pulse
- [ ] Fog reveal on map progression

---

### Scene Transitions

- [ ] Fade to black (300-500ms) between major scenes
- [ ] Combat entry zoom/flash effect
- [ ] Victory celebration burst effect
- [ ] Defeat slow fade with de-saturation
- [ ] Biome transition special wipe effect

---

## Lighting Configuration Examples

### Biome Lighting Config Structure

```typescript
/**
 * Lighting configuration for biomes
 * Use these values in scene setup for consistent visual atmosphere
 */
interface BiomeLightingConfig {
  ambient: {
    color: number;      // Hex color for ambient light
    intensity: number;  // 0.0 to 1.5 multiplier
  };
  directional: {
    color: number;      // Primary directional light color
    intensity: number;  // 0.0 to 2.0 multiplier
    angle: number;      // Degrees, 0 = top, 90 = right
  };
  fog?: {
    color: number;      // Fog color for depth
    near: number;       // Start distance (0.0-1.0 of view)
    far: number;        // End distance (0.0-1.0 of view)
    density: number;    // 0.0 to 1.0
  };
  particles?: {
    type: string;       // Particle effect type
    density: number;    // Particles per frame
    color: number;      // Particle tint
  };
}
```

### Example: Coastal Wetlands Lighting

```json
{
  "biome": "coastal_wetlands",
  "lighting": {
    "ambient": {
      "color": "0xFFF8DC",
      "intensity": 1.0
    },
    "directional": {
      "color": "0xFFFFE0",
      "intensity": 1.2,
      "angle": 45
    },
    "fog": {
      "color": "0xB0E0E6",
      "near": 0.7,
      "far": 1.0,
      "density": 0.15
    },
    "particles": {
      "type": "dust_motes",
      "density": 3,
      "color": "0xFFFFFF"
    }
  },
  "timeOfDay": {
    "dawn": { "ambientIntensity": 0.6, "tint": "0xFFDAB9" },
    "day": { "ambientIntensity": 1.0, "tint": "0xFFFFFF" },
    "dusk": { "ambientIntensity": 0.7, "tint": "0xFF6347" },
    "night": { "ambientIntensity": 0.3, "tint": "0x4169E1" }
  }
}
```

### Example: Volcanic Highlands Lighting

```json
{
  "biome": "volcanic_highlands",
  "lighting": {
    "ambient": {
      "color": "0x8B0000",
      "intensity": 0.5
    },
    "directional": {
      "color": "0xFF4500",
      "intensity": 0.8,
      "angle": 60
    },
    "fog": {
      "color": "0x1A1A1A",
      "near": 0.5,
      "far": 0.9,
      "density": 0.4
    },
    "particles": {
      "type": "volcanic_ash",
      "density": 8,
      "color": "0x696969"
    }
  },
  "lavaGlow": {
    "color": "0xFF6347",
    "pulseSpeed": 2000,
    "pulseIntensity": { "min": 0.6, "max": 1.0 },
    "radius": 150
  }
}
```

### Combat Scene Lighting Overrides

```json
{
  "combatLighting": {
    "normal": {
      "ambient": { "intensity": 1.0 },
      "vignette": { "enabled": false }
    },
    "elite": {
      "ambient": { "intensity": 0.8 },
      "vignette": { 
        "enabled": true,
        "color": "0x8B0000",
        "intensity": 0.3
      },
      "rimLight": {
        "color": "0xFF4500",
        "intensity": 0.5
      }
    },
    "boss": {
      "ambient": { "intensity": 0.6 },
      "vignette": { 
        "enabled": true,
        "color": "0x1A1A1A",
        "intensity": 0.5
      },
      "spotlight": {
        "enabled": true,
        "color": "0xFFFFFF",
        "intensity": 1.5,
        "radius": 200
      }
    }
  }
}
```

---

## Animation Tuning Parameters

### Frame Rate Guidelines

| Animation Type | Recommended FPS | Frame Count | Duration (ms) |
|----------------|-----------------|-------------|---------------|
| Idle (loop)    | 8-12            | 6           | 500-750       |
| Attack         | 12-16           | 6-8         | 375-667       |
| Hurt           | 10-12           | 4-6         | 333-600       |
| Death          | 8-10            | 6-8         | 600-1000      |
| Special        | 10-14           | 8-12        | 571-1200      |

### Animation Timing Constants

```typescript
/**
 * Animation timing configuration
 * All values in milliseconds unless otherwise noted
 */
export const ANIMATION_TIMING = {
  // Combat animations
  attackWindup: 100,        // Anticipation before strike
  attackImpact: 50,         // Hold on impact frame
  attackRecovery: 150,      // Return to idle
  
  hurtReaction: 100,        // Initial stagger
  hurtRecovery: 200,        // Return to stance
  
  deathFall: 400,           // Collapse animation
  deathFade: 500,           // Fade out after death
  
  // UI animations
  buttonHoverScale: 150,    // Hover scale transition
  buttonClickShrink: 50,    // Click feedback
  buttonClickRecover: 100,  // Return from click
  
  healthBarTransition: 300, // Smooth HP change
  staminaBarTransition: 200, // Smooth stamina change
  
  damageNumberFloat: 1000,  // Damage popup lifetime
  damageNumberRise: 50,     // Pixels to rise
  
  // Scene transitions
  fadeIn: 300,
  fadeOut: 300,
  sceneSwitch: 500,
  
  // Combat flow
  turnTransition: 200,      // Between turns
  combatIntro: 800,         // Enemy introduction
  victoryPose: 1500,        // Hold on victory
};
```

### Easing Functions

```typescript
/**
 * Recommended easing functions for different animation types
 * Maps to Phaser easing or CSS timing functions
 */
export const ANIMATION_EASING = {
  // Quick responsive feedback
  buttonPress: 'Power2.easeOut',
  
  // Smooth UI transitions
  panelSlide: 'Sine.easeInOut',
  fadeTransition: 'Linear',
  
  // Combat impact
  attackLunge: 'Power2.easeIn',
  attackRecoil: 'Power2.easeOut',
  hurtStagger: 'Back.easeOut',
  
  // Bounce effects
  popIn: 'Back.easeOut',
  levelUp: 'Elastic.easeOut',
  
  // Natural motion
  floating: 'Sine.easeInOut',
  breathing: 'Sine.easeInOut',
  
  // Dramatic
  deathFall: 'Bounce.easeOut',
  screenShake: 'Sine.easeInOut',
};
```

### Sprite Animation Configuration

```typescript
/**
 * Per-sprite animation configuration
 * Extends base animation config with species-specific timing
 */
interface SpriteAnimConfig {
  key: string;
  animations: {
    idle: { frames: [number, number]; frameRate: number; repeat: number };
    attack: { frames: [number, number]; frameRate: number; repeat: number };
    hurt: { frames: [number, number]; frameRate: number; repeat: number };
    death: { frames: [number, number]; frameRate: number; repeat: number };
    special?: { frames: [number, number]; frameRate: number; repeat: number };
  };
  scale: number;
  anchorY: number;  // 0.5 = center, 1.0 = bottom
}

// Example: Deinonychus (fast, agile)
const deinonychusAnim: SpriteAnimConfig = {
  key: 'deinonychus',
  animations: {
    idle: { frames: [0, 5], frameRate: 10, repeat: -1 },
    attack: { frames: [6, 11], frameRate: 16, repeat: 0 },   // Faster attack
    hurt: { frames: [12, 15], frameRate: 12, repeat: 0 },
    death: { frames: [16, 21], frameRate: 8, repeat: 0 },
    special: { frames: [22, 29], frameRate: 14, repeat: 0 }, // Pounce ability
  },
  scale: 2.0,
  anchorY: 0.9,
};

// Example: Ankylosaurus (slow, heavy)
const ankylosaurusAnim: SpriteAnimConfig = {
  key: 'ankylosaurus',
  animations: {
    idle: { frames: [0, 5], frameRate: 6, repeat: -1 },      // Slower idle
    attack: { frames: [6, 11], frameRate: 10, repeat: 0 },   // Heavy swing
    hurt: { frames: [12, 15], frameRate: 8, repeat: 0 },     // Armored reaction
    death: { frames: [16, 21], frameRate: 6, repeat: 0 },    // Heavy fall
    special: { frames: [22, 29], frameRate: 8, repeat: 0 },  // Tail club
  },
  scale: 2.5,
  anchorY: 0.85,
};
```

---

## Particle Effect Refinement

### Particle System Configuration

```typescript
/**
 * Particle effect configurations
 * For use with Phaser's particle emitter system
 */
interface ParticleConfig {
  key: string;
  texture: string;
  emitterConfig: {
    speed: { min: number; max: number };
    scale: { start: number; end: number };
    alpha: { start: number; end: number };
    lifespan: { min: number; max: number };
    angle: { min: number; max: number };
    frequency: number;  // ms between emissions, -1 for burst
    quantity: number;   // particles per emission
    gravityY?: number;
    blendMode?: string; // 'ADD', 'NORMAL', 'MULTIPLY'
    tint?: number | number[];
  };
}
```

### Combat Effect Particles

```json
{
  "hitImpact": {
    "texture": "pixel",
    "speed": { "min": 50, "max": 150 },
    "scale": { "start": 1.0, "end": 0.2 },
    "alpha": { "start": 1.0, "end": 0.0 },
    "lifespan": { "min": 200, "max": 400 },
    "angle": { "min": 0, "max": 360 },
    "frequency": -1,
    "quantity": 8,
    "tint": "0xFFFFFF"
  },
  "criticalHit": {
    "texture": "pixel",
    "speed": { "min": 100, "max": 250 },
    "scale": { "start": 1.5, "end": 0.3 },
    "alpha": { "start": 1.0, "end": 0.0 },
    "lifespan": { "min": 300, "max": 600 },
    "angle": { "min": 0, "max": 360 },
    "frequency": -1,
    "quantity": 16,
    "blendMode": "ADD",
    "tint": ["0xFFD700", "0xFFA500", "0xFF6347"]
  },
  "bleedDrip": {
    "texture": "pixel",
    "speed": { "min": 20, "max": 50 },
    "scale": { "start": 0.8, "end": 0.4 },
    "alpha": { "start": 1.0, "end": 0.5 },
    "lifespan": { "min": 500, "max": 1000 },
    "angle": { "min": 80, "max": 100 },
    "frequency": 200,
    "quantity": 1,
    "gravityY": 100,
    "tint": "0xD94A3D"
  },
  "poisonBubble": {
    "texture": "circle_small",
    "speed": { "min": 10, "max": 30 },
    "scale": { "start": 0.3, "end": 0.6 },
    "alpha": { "start": 0.8, "end": 0.0 },
    "lifespan": { "min": 800, "max": 1200 },
    "angle": { "min": 250, "max": 290 },
    "frequency": 150,
    "quantity": 1,
    "gravityY": -20,
    "tint": "0x9ACD32"
  },
  "healRise": {
    "texture": "plus_small",
    "speed": { "min": 30, "max": 60 },
    "scale": { "start": 0.5, "end": 0.8 },
    "alpha": { "start": 1.0, "end": 0.0 },
    "lifespan": { "min": 600, "max": 1000 },
    "angle": { "min": 250, "max": 290 },
    "frequency": -1,
    "quantity": 6,
    "blendMode": "ADD",
    "tint": "0x51CF66"
  }
}
```

### Ambient Particles per Biome

```json
{
  "coastal_wetlands": {
    "dustMotes": {
      "speed": { "min": 5, "max": 15 },
      "scale": { "start": 0.3, "end": 0.1 },
      "alpha": { "start": 0.3, "end": 0.1 },
      "lifespan": { "min": 3000, "max": 6000 },
      "frequency": 500,
      "quantity": 1,
      "tint": "0xFFFFFF"
    },
    "waterDroplets": {
      "speed": { "min": 50, "max": 100 },
      "angle": { "min": 85, "max": 95 },
      "gravityY": 150,
      "frequency": 1000,
      "quantity": 2,
      "tint": "0xADD8E6"
    }
  },
  "volcanic_highlands": {
    "volcanicAsh": {
      "speed": { "min": 10, "max": 40 },
      "scale": { "start": 0.5, "end": 0.2 },
      "alpha": { "start": 0.6, "end": 0.2 },
      "lifespan": { "min": 2000, "max": 5000 },
      "frequency": 100,
      "quantity": 2,
      "tint": ["0x696969", "0x808080", "0x2F2F2F"]
    },
    "embers": {
      "speed": { "min": 20, "max": 60 },
      "angle": { "min": 240, "max": 300 },
      "scale": { "start": 0.4, "end": 0.1 },
      "alpha": { "start": 1.0, "end": 0.0 },
      "lifespan": { "min": 1000, "max": 2000 },
      "frequency": 300,
      "quantity": 1,
      "blendMode": "ADD",
      "tint": ["0xFF4500", "0xFF6347", "0xFFD700"]
    }
  }
}
```

---

## Responsive Resolution & Scaling

### Supported Resolutions

| Resolution | Aspect Ratio | Scale Mode | Notes |
|------------|--------------|------------|-------|
| 1920×1080  | 16:9         | Base 1.5x  | Full HD |
| 1280×720   | 16:9         | Base 1.0x  | **Target/Reference** |
| 1024×576   | 16:9         | Scale 0.8x | Smaller displays |
| 854×480    | 16:9         | Scale 0.67x| Mobile landscape |
| 1366×768   | ~16:9        | Fit with letterbox | Common laptop |
| 2560×1440  | 16:9         | Scale 2.0x | 2K/QHD |
| 3840×2160  | 16:9         | Scale 3.0x | 4K/UHD |

### Phaser Scale Configuration

```typescript
/**
 * Recommended Phaser scale configuration for responsive display
 */
const scaleConfig: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.FIT,           // Maintain aspect ratio
  autoCenter: Phaser.Scale.CENTER_BOTH, // Center in parent
  width: 1280,                      // Reference width
  height: 720,                      // Reference height
  min: {
    width: 640,                     // Minimum supported width
    height: 360,                    // Minimum supported height
  },
  max: {
    width: 3840,                    // Maximum supported width
    height: 2160,                   // Maximum supported height
  },
  zoom: 1,                          // Base zoom level
};
```

### UI Scaling Guidelines

```typescript
/**
 * UI scaling multipliers for different screen sizes
 * Applied to font sizes, button sizes, padding
 */
export const UI_SCALE = {
  // Base reference (1280×720)
  base: 1.0,
  
  // Scale factors by screen width
  getScale(screenWidth: number): number {
    if (screenWidth < 800) return 0.75;      // Small screens
    if (screenWidth < 1200) return 0.875;    // Medium screens
    if (screenWidth < 1600) return 1.0;      // Standard
    if (screenWidth < 2400) return 1.25;     // Large screens
    return 1.5;                               // 4K and above
  },
  
  // Minimum touch target size (pixels at current scale)
  minTouchTarget: 44,
  
  // Safe area padding (pixels from edges)
  safeArea: 40,
};

/**
 * Responsive font size calculator
 */
export function getResponsiveFontSize(
  baseSizePx: number,
  screenWidth: number
): string {
  const scale = UI_SCALE.getScale(screenWidth);
  const scaledSize = Math.round(baseSizePx * scale);
  return `${scaledSize}px`;
}
```

### Touch Target Guidelines

- All interactive elements: minimum 44×44 pixels
- Buttons: padding ensures target size even with smaller text
- Map nodes: 50px diameter minimum
- Sliders: full track height interactive
- Spacing between targets: minimum 8px gap

---

## Asset Naming Conventions

### File Naming Rules

1. **Lowercase only**: All filenames use lowercase letters
2. **Snake_case**: Words separated by underscores
3. **Descriptive**: Clear indication of content type
4. **Numbered**: Zero-padded frame numbers (01, 02, etc.)

### Naming Patterns by Asset Type

#### Sprites

```
{category}/{entity}_{animation}_{frame:02d}.png
{category}/{entity}_spritesheet.png

Examples:
sprites/dinosaurs/deinonychus_idle_01.png
sprites/dinosaurs/deinonychus_spritesheet.png
sprites/enemies/allosaurus_attack_03.png
sprites/bosses/tyrannosaurus_boss_roar_01.png
sprites/effects/fx_critical_hit_04.png
```

#### Backgrounds

```
backgrounds/{biome-name}/bg_{layer}.png
backgrounds/{biome-name}/bg_{layer}_{variant}.png

Examples:
backgrounds/coastal-wetlands/bg_sky.png
backgrounds/coastal-wetlands/bg_midground.png
backgrounds/volcanic-highlands/bg_foreground_lava.png
```

#### UI Elements

```
ui/{category}/{type}_{name}_{state}.png
ui/{category}/{type}_{name}.png

Examples:
ui/buttons/btn_attack_normal.png
ui/buttons/btn_attack_hover.png
ui/buttons/btn_attack_disabled.png
ui/health-bars/healthbar_frame.png
ui/health-bars/healthbar_fill.png
ui/icons/status/status_bleeding.png
ui/icons/traits/trait_thick_hide.png
ui/panels/panel_info.png
```

#### Audio

```
audio/{category}/{prefix}_{name}.{ext}
audio/{category}/{prefix}_{subcategory}_{name}.{ext}

Examples:
audio/music/music_main_menu.ogg
audio/music/music_combat_boss.ogg
audio/sfx/combat/sfx_attack_slash.wav
audio/sfx/ui/sfx_ui_click.wav
audio/ambience/amb_water_flowing.ogg
```

### Copilot-Friendly Conventions

When creating assets for use with GitHub Copilot or other AI tools, follow these additional conventions:

1. **Consistent prefixes**: Use prefixes to group related assets
   - `bg_` for backgrounds
   - `btn_` for buttons
   - `fx_` for effects
   - `status_` for status icons
   - `trait_` for trait icons
   - `ability_` for ability icons
   - `node_` for map nodes
   - `sfx_` for sound effects
   - `music_` for music tracks
   - `amb_` for ambience

2. **State suffixes**: Always include state in filename for stateful assets
   - `_normal` - default state
   - `_hover` - mouse over state
   - `_pressed` - click/active state
   - `_disabled` - inactive state
   - `_selected` - chosen/active selection

3. **Animation state keywords**: Use consistent animation state names
   - `idle` - resting animation
   - `attack` - attack animation
   - `hurt` - damage reaction
   - `death` - death animation
   - `special` - special ability
   - `roar` - vocalization (bosses)
   - `victory` - win pose

4. **Size indicators**: When multiple sizes exist, append size
   - `_small`, `_medium`, `_large`
   - `_16`, `_32`, `_64` (pixel dimensions)

5. **Version suffixes**: For iteration tracking
   - `_v1`, `_v2` for major versions
   - Avoid in final production assets

### Asset Key Mapping

```typescript
/**
 * Asset key constants for consistent code references
 * Keys match the loaded texture/sound names in Phaser
 */
export const ASSET_KEYS = {
  // Player dinosaurs
  DEINONYCHUS: 'deinonychus',
  ANKYLOSAURUS: 'ankylosaurus',
  PTERANODON: 'pteranodon',
  
  // Backgrounds
  BG_COASTAL_SKY: 'bg_coastal_wetlands_sky',
  BG_COASTAL_MID: 'bg_coastal_wetlands_mid',
  BG_COASTAL_FG: 'bg_coastal_wetlands_fg',
  
  // UI
  UI_BTN_ATTACK: 'ui_btn_attack',
  UI_HEALTHBAR_FRAME: 'ui_healthbar_frame',
  
  // Effects
  FX_CRITICAL_HIT: 'fx_critical_hit',
  FX_ATTACK_IMPACT: 'fx_attack_impact',
  
  // Audio
  MUSIC_MAIN_MENU: 'music_main_menu',
  SFX_ATTACK_SLASH: 'sfx_attack_slash',
} as const;
```

---

## Main Menu & Intro Sequence

### Menu Polish Checklist

- [ ] **Title Animation**
  - Gentle floating effect (10px amplitude, 2s period)
  - Fade-in on scene load (500ms)
  - Optional: letter-by-letter reveal for first launch

- [ ] **Background**
  - Parallax scrolling prehistoric scene
  - Subtle fog/mist layer
  - Ambient particle effects (dust motes, leaves)

- [ ] **Button Entrance**
  - Staggered slide-in from right (100ms delay between each)
  - Fade opacity from 0 to 1
  - Bounce ease on final position

- [ ] **Fossil Decorations**
  - Subtle rotation/bobbing animation
  - Random spawn positions for variety
  - Glow effect on hover near title

- [ ] **Fact Display**
  - Typewriter text effect for first display
  - Fade transition when changing facts
  - Auto-rotate every 10 seconds

### Intro Sequence (Optional Polish)

```typescript
/**
 * Intro sequence configuration
 * For first-time players or game start
 */
interface IntroSequence {
  enabled: boolean;
  skipEnabled: boolean;
  scenes: IntroScene[];
}

interface IntroScene {
  duration: number;           // ms
  background: string;         // Asset key
  text?: string;              // Narration text
  textPosition: 'top' | 'center' | 'bottom';
  fadeIn: number;             // ms
  fadeOut: number;            // ms
  particles?: string;         // Particle effect key
}

const introConfig: IntroSequence = {
  enabled: true,
  skipEnabled: true,
  scenes: [
    {
      duration: 3000,
      background: 'intro_prehistoric_dawn',
      text: 'Millions of years ago...',
      textPosition: 'bottom',
      fadeIn: 1000,
      fadeOut: 500,
      particles: 'dust_motes',
    },
    {
      duration: 3500,
      background: 'intro_swamp_overview',
      text: 'In a world ruled by giants...',
      textPosition: 'bottom',
      fadeIn: 500,
      fadeOut: 500,
    },
    {
      duration: 3000,
      background: 'intro_dinosaur_silhouettes',
      text: 'Survival was everything.',
      textPosition: 'center',
      fadeIn: 500,
      fadeOut: 1000,
    },
  ],
};
```

---

## Quality Assurance Checklist

### Performance Targets

- [ ] Maintain 60 FPS with all effects active
- [ ] No memory leaks from particle systems
- [ ] Scene transitions under 500ms
- [ ] Asset loading under 2 seconds (initial, target 1.5s for optimal UX)

### Visual Consistency

- [ ] All animations play at correct frame rates
- [ ] Colors match design system palette
- [ ] UI elements align to 8px grid
- [ ] Fonts consistent across all scenes

### Accessibility

- [ ] High contrast mode functions correctly
- [ ] Reduced motion disables animations
- [ ] Color blind modes apply to all UI
- [ ] Minimum 4.5:1 contrast ratio for text

### Platform Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

*This guide is part of the Primordial Swamp development documentation. Update as visual systems evolve.*
