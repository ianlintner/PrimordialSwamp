# Primordial Swamp - Asset Manifest

Complete specification of all assets needed for the showable release.

## ✨ Implementation Status

The asset loading system has been implemented with **automatic placeholder generation**. When actual assets are not available, the game generates styled placeholder graphics at runtime, allowing development to proceed without blocking on art.

### Key Files
- `src/config/assets.ts` - Asset configuration and definitions
- `src/utils/AssetLoader.ts` - Asset loading with placeholder generation
- `src/managers/AudioManager.ts` - Audio playback management

### Features
- ✅ Sprite loading with fallback placeholder generation
- ✅ Background image loading with biome-specific gradients
- ✅ UI element placeholder generation
- ✅ Animation system setup
- ✅ Audio manager with volume controls

---

## 📋 Table of Contents

1. [Creature Sprites](#creature-sprites)
2. [Biome Backgrounds](#biome-backgrounds)
3. [UI Assets](#ui-assets)
4. [Audio Assets](#audio-assets)
5. [Priority Matrix](#priority-matrix)
6. [Naming Conventions](#naming-conventions)
7. [Production Pipeline](#production-pipeline)

---

## Creature Sprites

### Player Dinosaurs (7 Total)

All player dinosaurs require the following animation states:
- `idle` (6 frames recommended, looped)
- `attack` (6 frames recommended)
- `hurt` (4 frames)
- `death` (6 frames)
- `special` (6-8 frames, optional)
- `victory` (6 frames, looped, optional)

> **Note**: Frame counts are recommendations. See `EXAMPLE_spritesheet.json` for a reference implementation with 6 frames per animation.

| ID | Dinosaur | Size | Priority | Status | Filename Pattern |
|----|----------|------|----------|--------|------------------|
| 1 | Deinonychus | 64×64 | P1 | ⏳ Needed | `deinonychus_{state}_{frame}.png` |
| 2 | Ankylosaurus | 96×64 | P1 | ⏳ Needed | `ankylosaurus_{state}_{frame}.png` |
| 3 | Pteranodon | 64×64 | P1 | ⏳ Needed | `pteranodon_{state}_{frame}.png` |
| 4 | Tyrannosaurus | 128×96 | P2 | ⏳ Needed | `tyrannosaurus_{state}_{frame}.png` |
| 5 | Pachycephalosaurus | 64×64 | P2 | ⏳ Needed | `pachycephalosaurus_{state}_{frame}.png` |
| 6 | Therizinosaurus | 96×64 | P2 | ⏳ Needed | `therizinosaurus_{state}_{frame}.png` |
| 7 | Parasaurolophus | 96×64 | P2 | ⏳ Needed | `parasaurolophus_{state}_{frame}.png` |

**Location**: `assets/sprites/dinosaurs/`

**Additional Player Dinosaurs (Unlockable)**:

| ID | Dinosaur | Size | Priority | Status | Filename Pattern |
|----|----------|------|----------|--------|------------------|
| 8 | Spinosaurus | 128×96 | P3 | ⏳ Needed | `spinosaurus_{state}_{frame}.png` |
| 9 | Utahraptor | 64×64 | P3 | ⏳ Needed | `utahraptor_{state}_{frame}.png` |
| 10 | Carnotaurus | 80×64 | P3 | ⏳ Needed | `carnotaurus_{state}_{frame}.png` |
| 11 | Troodon | 48×48 | P3 | ⏳ Needed | `troodon_{state}_{frame}.png` |
| 12 | Baryonyx | 96×64 | P3 | ⏳ Needed | `baryonyx_{state}_{frame}.png` |
| 13 | Compsognathus | 32×32 | P3 | ⏳ Needed | `compsognathus_{state}_{frame}.png` |

### Enemy Dinosaurs

Enemy sprites require: `idle`, `attack`, `hurt`, `death`

#### Basic Enemies (5)

| Enemy | Size | Priority | Status | Filename Pattern |
|-------|------|----------|--------|------------------|
| Compsognathus Pack | 32×32 (×3-5) | P1 | ⏳ Needed | `compy_pack_{state}_{frame}.png` |
| Dilophosaurus | 64×64 | P1 | ⏳ Needed | `dilophosaurus_{state}_{frame}.png` |
| Coelophysis | 48×48 | P1 | ⏳ Needed | `coelophysis_{state}_{frame}.png` |
| Dimetrodon | 64×48 | P1 | ⏳ Needed | `dimetrodon_{state}_{frame}.png` |
| Oviraptor | 48×48 | P2 | ⏳ Needed | `oviraptor_{state}_{frame}.png` |

**Location**: `assets/sprites/enemies/`

#### Advanced Enemies (5)

| Enemy | Size | Priority | Status | Filename Pattern |
|-------|------|----------|--------|------------------|
| Allosaurus | 96×64 | P2 | ⏳ Needed | `allosaurus_{state}_{frame}.png` |
| Sarcosuchus | 128×48 | P2 | ⏳ Needed | `sarcosuchus_{state}_{frame}.png` |
| Velociraptor | 48×48 | P2 | ⏳ Needed | `velociraptor_{state}_{frame}.png` |
| Kentrosaurus | 64×64 | P2 | ⏳ Needed | `kentrosaurus_{state}_{frame}.png` |
| Carnotaurus (Enemy) | 80×64 | P2 | ⏳ Needed | `carnotaurus_enemy_{state}_{frame}.png` |

#### Elite Enemies (3)

| Enemy | Size | Priority | Status | Filename Pattern |
|-------|------|----------|--------|------------------|
| Spinosaurus | 128×96 | P2 | ⏳ Needed | `spinosaurus_enemy_{state}_{frame}.png` |
| Therizinosaurus (Enemy) | 96×64 | P2 | ⏳ Needed | `therizinosaurus_enemy_{state}_{frame}.png` |
| Utahraptor | 64×64 | P2 | ⏳ Needed | `utahraptor_enemy_{state}_{frame}.png` |

### Boss Sprites

Boss sprites require additional states: `idle`, `attack`, `hurt`, `death`, `roar`, `special1`, `special2`

| Boss | Size | Priority | Status | Filename Pattern |
|------|------|----------|--------|------------------|
| Mosasaurus | 192×96 | P2 | ⏳ Needed | `mosasaurus_boss_{state}_{frame}.png` |
| Giganotosaurus | 160×96 | P2 | ⏳ Needed | `giganotosaurus_boss_{state}_{frame}.png` |
| Tyrannosaurus Rex (Boss) | 160×96 | P2 | ⏳ Needed | `tyrannosaurus_boss_{state}_{frame}.png` |

**Location**: `assets/sprites/bosses/`

### Visual Effects

| Effect | Size | Frames | Priority | Status | Filename |
|--------|------|--------|----------|--------|----------|
| Attack Impact | 64×64 | 6 | P1 | ⏳ Needed | `fx_attack_impact.png` |
| Critical Hit | 64×64 | 8 | P1 | ⏳ Needed | `fx_critical_hit.png` |
| Heal | 64×64 | 6 | P2 | ⏳ Needed | `fx_heal.png` |
| Bleed | 32×32 | 4 | P2 | ⏳ Needed | `fx_bleed.png` |
| Stun | 32×32 | 4 | P2 | ⏳ Needed | `fx_stun.png` |
| Poison | 32×32 | 4 | P2 | ⏳ Needed | `fx_poison.png` |
| Level Up | 128×128 | 8 | P2 | ⏳ Needed | `fx_level_up.png` |
| Death Particles | 32×32 | 6 | P2 | ⏳ Needed | `fx_death_particles.png` |

**Location**: `assets/sprites/effects/`

---

## Biome Backgrounds

Each biome requires 3 parallax layers (sky, midground, foreground) at 1920×1080 base resolution.

| Biome | Layers | Time Variants | Priority | Status |
|-------|--------|---------------|----------|--------|
| Coastal Wetlands | 3 | Day | P1 | ⏳ Needed |
| Fern Prairies | 3 | Day | P1 | ⏳ Needed |
| Volcanic Highlands | 3 | Day | P2 | ⏳ Needed |
| Tar Pits | 3 | Day | P2 | ⏳ Needed |
| Ancient Forest | 3 | Day | P3 | ⏳ Needed |
| Inland Sea | 3 | Day | P3 | ⏳ Needed |

### File Structure per Biome

```
backgrounds/{biome-name}/
├── bg_sky.png           # Furthest layer (slow parallax)
├── bg_midground.png     # Middle layer (medium parallax)
├── bg_foreground.png    # Closest layer (fast parallax)
└── bg_overlay.png       # Optional atmospheric overlay (fog, rain, etc.)
```

**Location**: `assets/backgrounds/`

### Animated Background Elements (Nice-to-have)

| Element | Biome | Size | Frames | Priority | Status |
|---------|-------|------|--------|----------|--------|
| Water Ripples | Coastal Wetlands | 128×64 | 8 | P3 | ⏳ Nice-to-have |
| Lava Flow | Volcanic Highlands | 256×128 | 12 | P3 | ⏳ Nice-to-have |
| Tar Bubbles | Tar Pits | 64×64 | 6 | P3 | ⏳ Nice-to-have |
| Fog Drift | Ancient Forest | 512×256 | 16 | P3 | ⏳ Nice-to-have |

---

## UI Assets

### Combat UI

| Element | Size | States | Priority | Status | Filename |
|---------|------|--------|----------|--------|----------|
| Health Bar Frame | 200×24 | - | P1 | ⏳ Needed | `ui_healthbar_frame.png` |
| Health Bar Fill | 196×20 | - | P1 | ⏳ Needed | `ui_healthbar_fill.png` |
| Stamina Bar Frame | 150×16 | - | P1 | ⏳ Needed | `ui_staminabar_frame.png` |
| Stamina Bar Fill | 146×12 | - | P1 | ⏳ Needed | `ui_staminabar_fill.png` |
| Turn Indicator | 48×48 | active, inactive | P1 | ⏳ Needed | `ui_turn_indicator.png` |
| Combat Log BG | 300×200 | - | P1 | ⏳ Needed | `ui_combat_log_bg.png` |
| Damage Number Pop | 32×16 | normal, crit | P2 | ⏳ Needed | `ui_damage_popup.png` |

**Location**: `assets/ui/health-bars/`

### Action Buttons

| Button | Size | States | Priority | Status | Filename |
|--------|------|--------|----------|--------|----------|
| Attack Button | 64×64 | normal, hover, pressed, disabled | P1 | ⏳ Needed | `btn_attack_{state}.png` |
| Defend Button | 64×64 | normal, hover, pressed, disabled | P1 | ⏳ Needed | `btn_defend_{state}.png` |
| Ability Button | 64×64 | normal, hover, pressed, disabled | P1 | ⏳ Needed | `btn_ability_{state}.png` |
| Flee Button | 64×64 | normal, hover, pressed, disabled | P1 | ⏳ Needed | `btn_flee_{state}.png` |
| Generic Button | 120×40 | normal, hover, pressed | P1 | ⏳ Needed | `btn_generic_{state}.png` |

**Location**: `assets/ui/buttons/`

### Map UI

| Element | Size | Priority | Status | Filename |
|---------|------|----------|--------|----------|
| Node - Combat | 48×48 | P1 | ⏳ Needed | `node_combat.png` |
| Node - Resource | 48×48 | P1 | ⏳ Needed | `node_resource.png` |
| Node - Event | 48×48 | P1 | ⏳ Needed | `node_event.png` |
| Node - Elite | 48×48 | P1 | ⏳ Needed | `node_elite.png` |
| Node - Rest | 48×48 | P1 | ⏳ Needed | `node_rest.png` |
| Node - Boss | 48×48 | P1 | ⏳ Needed | `node_boss.png` |
| Node - Locked | 48×48 | P1 | ⏳ Needed | `node_locked.png` |
| Path Connector | 16×4 | P1 | ⏳ Needed | `path_connector.png` |
| Current Position Marker | 32×32 | P1 | ⏳ Needed | `marker_current.png` |

**Location**: `assets/ui/icons/`

### Icons

#### Status Effect Icons (16×16)

| Icon | Priority | Status | Filename |
|------|----------|--------|----------|
| Bleeding | P1 | ⏳ Needed | `status_bleeding.png` |
| Stunned | P1 | ⏳ Needed | `status_stunned.png` |
| Poisoned | P1 | ⏳ Needed | `status_poisoned.png` |
| Exhausted | P1 | ⏳ Needed | `status_exhausted.png` |
| Fortified | P1 | ⏳ Needed | `status_fortified.png` |
| Enraged | P2 | ⏳ Needed | `status_enraged.png` |
| Hidden | P2 | ⏳ Needed | `status_hidden.png` |
| Burned | P2 | ⏳ Needed | `status_burned.png` |
| Frozen | P2 | ⏳ Needed | `status_frozen.png` |
| Shocked | P2 | ⏳ Needed | `status_shocked.png` |
| Terrified | P2 | ⏳ Needed | `status_terrified.png` |
| Confused | P2 | ⏳ Needed | `status_confused.png` |
| Weakened | P2 | ⏳ Needed | `status_weakened.png` |
| Empowered | P2 | ⏳ Needed | `status_empowered.png` |
| Regenerating | P2 | ⏳ Needed | `status_regenerating.png` |
| Berserk | P2 | ⏳ Needed | `status_berserk.png` |
| Camouflaged | P2 | ⏳ Needed | `status_camouflaged.png` |

**Location**: `assets/ui/icons/status/`

#### Resource Icons (32×32)

| Icon | Priority | Status | Filename |
|------|----------|--------|----------|
| Fossil Fragment | P1 | ⏳ Needed | `resource_fossil.png` |
| Health Pickup | P1 | ⏳ Needed | `resource_health.png` |
| Stamina Pickup | P1 | ⏳ Needed | `resource_stamina.png` |
| Egg | P2 | ⏳ Needed | `resource_egg.png` |
| Amber | P2 | ⏳ Needed | `resource_amber.png` |
| Research Points | P2 | ⏳ Needed | `resource_research.png` |

**Location**: `assets/ui/icons/resources/`

#### Trait Icons (32×32) - Sample Set

| Icon | Category | Priority | Status | Filename |
|------|----------|----------|--------|----------|
| Thick Hide | Physical | P2 | ⏳ Needed | `trait_thick_hide.png` |
| Sharp Claws | Physical | P2 | ⏳ Needed | `trait_sharp_claws.png` |
| Pack Tactics | Behavioral | P2 | ⏳ Needed | `trait_pack_tactics.png` |
| Apex Predator | Behavioral | P2 | ⏳ Needed | `trait_apex_predator.png` |
| Living Fossil | Special | P3 | ⏳ Needed | `trait_living_fossil.png` |
| Extinction Survivor | Special | P3 | ⏳ Needed | `trait_extinction_survivor.png` |

**Location**: `assets/ui/icons/traits/`

#### Ability Icons (32×32) - Sample Set

| Icon | Dinosaur | Priority | Status | Filename |
|------|----------|----------|--------|----------|
| Sickle Claw | Deinonychus | P1 | ⏳ Needed | `ability_sickle_claw.png` |
| Tail Club | Ankylosaurus | P1 | ⏳ Needed | `ability_tail_club.png` |
| Dive Attack | Pteranodon | P1 | ⏳ Needed | `ability_dive_attack.png` |
| Crushing Bite | T. Rex | P2 | ⏳ Needed | `ability_crushing_bite.png` |
| Skull Bash | Pachycephalosaurus | P2 | ⏳ Needed | `ability_skull_bash.png` |
| Scythe Slash | Therizinosaurus | P2 | ⏳ Needed | `ability_scythe_slash.png` |
| Resonating Call | Parasaurolophus | P2 | ⏳ Needed | `ability_resonating_call.png` |

**Location**: `assets/ui/icons/abilities/`

### Panel Frames

| Panel | Size | Priority | Status | Filename |
|-------|------|----------|--------|----------|
| Main Menu BG | 1920×1080 | P1 | ⏳ Needed | `panel_main_menu_bg.png` |
| Character Card | 200×280 | P1 | ⏳ Needed | `panel_character_card.png` |
| Info Panel | 400×300 | P1 | ⏳ Needed | `panel_info.png` |
| Tooltip BG | 250×150 | P1 | ⏳ Needed | `panel_tooltip.png` |
| Codex Entry | 600×400 | P2 | ⏳ Needed | `panel_codex_entry.png` |
| Settings Panel | 500×400 | P2 | ⏳ Needed | `panel_settings.png` |
| Victory Banner | 400×200 | P2 | ⏳ Needed | `panel_victory.png` |
| Defeat Banner | 400×200 | P2 | ⏳ Needed | `panel_defeat.png` |

**Location**: `assets/ui/panels/`

---

## Audio Assets

### Music Tracks

All music should be OGG format, 44.1kHz, 16-bit, seamlessly looped.

| Track | Duration | Loop | Priority | Status | Filename |
|-------|----------|------|----------|--------|----------|
| Main Menu Theme | 2-3 min | Yes | P1 | ⏳ Needed | `music_main_menu.ogg` |
| Coastal Wetlands Ambient | 3-4 min | Yes | P1 | ⏳ Needed | `music_coastal_wetlands.ogg` |
| Fern Prairies Ambient | 3-4 min | Yes | P2 | ⏳ Needed | `music_fern_prairies.ogg` |
| Volcanic Highlands Ambient | 3-4 min | Yes | P2 | ⏳ Needed | `music_volcanic_highlands.ogg` |
| Tar Pits Ambient | 3-4 min | Yes | P2 | ⏳ Needed | `music_tar_pits.ogg` |
| Combat Theme (Normal) | 2-3 min | Yes | P1 | ⏳ Needed | `music_combat_normal.ogg` |
| Combat Theme (Elite) | 2-3 min | Yes | P2 | ⏳ Needed | `music_combat_elite.ogg` |
| Combat Theme (Boss) | 3-4 min | Yes | P2 | ⏳ Needed | `music_combat_boss.ogg` |
| Victory Fanfare | 10-15 sec | No | P1 | ⏳ Needed | `music_victory.ogg` |
| Defeat Theme | 15-20 sec | No | P1 | ⏳ Needed | `music_defeat.ogg` |
| Codex Theme | 2-3 min | Yes | P3 | ⏳ Needed | `music_codex.ogg` |

**Location**: `assets/audio/music/`

**Music Style Guidelines**:
- Orchestral with prehistoric feel
- No anachronistic instruments (avoid modern synths)
- Adaptive intensity for combat transitions
- Atmospheric and ambient for exploration

### Sound Effects

All SFX should be WAV or OGG format, 44.1kHz, 16-bit.

#### Combat SFX

| Sound | Priority | Status | Filename |
|-------|----------|--------|----------|
| Attack - Slash | P1 | ⏳ Needed | `sfx_attack_slash.wav` |
| Attack - Bite | P1 | ⏳ Needed | `sfx_attack_bite.wav` |
| Attack - Crush | P1 | ⏳ Needed | `sfx_attack_crush.wav` |
| Defend | P1 | ⏳ Needed | `sfx_defend.wav` |
| Damage Taken | P1 | ⏳ Needed | `sfx_damage_taken.wav` |
| Critical Hit | P1 | ⏳ Needed | `sfx_critical_hit.wav` |
| Miss/Evade | P1 | ⏳ Needed | `sfx_miss.wav` |
| Death | P1 | ⏳ Needed | `sfx_death.wav` |
| Heal | P2 | ⏳ Needed | `sfx_heal.wav` |
| Status Applied | P2 | ⏳ Needed | `sfx_status_applied.wav` |
| Status Tick | P2 | ⏳ Needed | `sfx_status_tick.wav` |
| Ability Activate | P2 | ⏳ Needed | `sfx_ability_activate.wav` |
| Flee Attempt | P2 | ⏳ Needed | `sfx_flee_attempt.wav` |
| Flee Success | P2 | ⏳ Needed | `sfx_flee_success.wav` |
| Flee Fail | P2 | ⏳ Needed | `sfx_flee_fail.wav` |

**Location**: `assets/audio/sfx/combat/`

#### UI SFX

| Sound | Priority | Status | Filename |
|-------|----------|--------|----------|
| Button Click | P1 | ⏳ Needed | `sfx_ui_click.wav` |
| Button Hover | P1 | ⏳ Needed | `sfx_ui_hover.wav` |
| Panel Open | P1 | ⏳ Needed | `sfx_ui_panel_open.wav` |
| Panel Close | P1 | ⏳ Needed | `sfx_ui_panel_close.wav` |
| Tab Switch | P2 | ⏳ Needed | `sfx_ui_tab.wav` |
| Item Collect | P2 | ⏳ Needed | `sfx_item_collect.wav` |
| Currency Earn | P2 | ⏳ Needed | `sfx_currency_earn.wav` |
| Achievement Unlock | P2 | ⏳ Needed | `sfx_achievement.wav` |
| Save Confirm | P2 | ⏳ Needed | `sfx_save_confirm.wav` |
| Error/Invalid | P2 | ⏳ Needed | `sfx_error.wav` |

**Location**: `assets/audio/sfx/ui/`

### Ambient Sounds

| Sound | Duration | Loop | Priority | Status | Filename |
|-------|----------|------|----------|--------|----------|
| Water Flowing | 30 sec | Yes | P2 | ⏳ Needed | `amb_water_flowing.ogg` |
| Wind Through Ferns | 30 sec | Yes | P2 | ⏳ Needed | `amb_wind_ferns.ogg` |
| Volcanic Rumbling | 30 sec | Yes | P2 | ⏳ Needed | `amb_volcanic.ogg` |
| Tar Bubbling | 30 sec | Yes | P2 | ⏳ Needed | `amb_tar_bubbles.ogg` |
| Forest Insects | 30 sec | Yes | P3 | ⏳ Needed | `amb_forest_insects.ogg` |
| Distant Thunder | 10 sec | No | P3 | ⏳ Needed | `amb_thunder.ogg` |

**Location**: `assets/audio/ambience/`

### Dinosaur Vocalizations (Nice-to-have)

| Dinosaur | Sounds Needed | Priority | Status | Filename Pattern |
|----------|---------------|----------|--------|------------------|
| Deinonychus | Chirp, Screech | P3 | ⏳ Nice-to-have | `vox_deinonychus_{type}.wav` |
| Ankylosaurus | Grunt, Rumble | P3 | ⏳ Nice-to-have | `vox_ankylosaurus_{type}.wav` |
| Pteranodon | Call, Screech | P3 | ⏳ Nice-to-have | `vox_pteranodon_{type}.wav` |
| Tyrannosaurus | Roar, Growl | P3 | ⏳ Nice-to-have | `vox_tyrannosaurus_{type}.wav` |

**Location**: `assets/audio/sfx/vocalizations/`

---

## Priority Matrix

### Priority Levels

| Level | Label | Description |
|-------|-------|-------------|
| P1 | **Must-Have** | Required for minimum viable playable build |
| P2 | **Should-Have** | Required for polished showable release |
| P3 | **Nice-to-Have** | Enhances experience but not critical |

### Summary by Category

| Category | P1 | P2 | P3 | Total |
|----------|----|----|-----|-------|
| Player Sprites | 3 | 4 | 6 | 13 |
| Enemy Sprites | 4 | 9 | 0 | 13 |
| Boss Sprites | 0 | 3 | 0 | 3 |
| Effects | 2 | 6 | 0 | 8 |
| Backgrounds | 2 | 2 | 2+ | 6+ |
| UI Elements | ~30 | ~40 | ~20 | ~90 |
| Music | 5 | 5 | 1 | 11 |
| SFX | 15 | 15 | 6 | 36 |
| **Total** | ~61 | ~84 | ~35 | ~180+ |

### Recommended Production Order

1. **Phase 1 - Core Playables** (P1)
   - 3 starter player dinosaurs (Deinonychus, Ankylosaurus, Pteranodon)
   - 4 basic enemy sprites
   - Combat UI elements
   - Essential SFX and 2 music tracks

2. **Phase 2 - Content Expansion** (P2)
   - Remaining player dinosaurs
   - Advanced and elite enemies
   - Boss sprites
   - All biome backgrounds
   - Complete UI icon sets
   - Full music library

3. **Phase 3 - Polish** (P3)
   - Additional unlockable dinosaurs
   - Animated background elements
   - Dinosaur vocalizations
   - Time-of-day variants

---

## Naming Conventions

### General Rules

- Use lowercase with underscores: `snake_case`
- Be descriptive but concise
- Include state/variant in name when applicable
- Number frames starting from 01

### Pattern by Asset Type

```
Sprites:    {entity}_{animation}_{frame:02d}.png
            deinonychus_attack_01.png

Effects:    fx_{effect_name}.png
            fx_critical_hit.png

Backgrounds: bg_{layer}.png
            bg_midground.png

UI Icons:   {type}_{name}.png
            status_bleeding.png
            trait_thick_hide.png
            ability_sickle_claw.png

Buttons:    btn_{name}_{state}.png
            btn_attack_hover.png

Panels:     panel_{name}.png
            panel_tooltip.png

Music:      music_{name}.ogg
            music_combat_normal.ogg

SFX:        sfx_{category}_{name}.wav
            sfx_attack_slash.wav

Ambience:   amb_{name}.ogg
            amb_water_flowing.ogg
```

---

## Production Pipeline

### Recommended Tools

**Graphics**:
- Aseprite (pixel art, animation)
- Piskel (free alternative)
- GIMP/Photoshop (backgrounds)

**Audio**:
- Audacity (editing, conversion)
- FL Studio/Ableton (music creation)
- sfxr/jfxr (retro SFX generation)

### Export Settings

**PNG Sprites**:
- Color Depth: 32-bit RGBA
- Transparency: Yes
- Compression: Maximum

**OGG Audio**:
- Quality: 8 (high quality)
- Sample Rate: 44100 Hz
- Channels: Stereo (music) / Mono (SFX)

**WAV Audio**:
- Bit Depth: 16-bit
- Sample Rate: 44100 Hz
- Channels: Mono (for SFX)

### Sprite Sheet Specifications

When creating sprite sheets, include a JSON atlas file:

```json
{
  "frames": {
    "deinonychus_idle_01": {
      "frame": {"x": 0, "y": 0, "w": 64, "h": 64},
      "sourceSize": {"w": 64, "h": 64},
      "spriteSourceSize": {"x": 0, "y": 0, "w": 64, "h": 64}
    }
  },
  "meta": {
    "image": "deinonychus_spritesheet.png",
    "size": {"w": 512, "h": 512},
    "scale": 1,
    "frameTags": [
      {"name": "idle", "from": 0, "to": 7, "direction": "forward"},
      {"name": "attack", "from": 8, "to": 15, "direction": "forward"}
    ]
  }
}
```

---

## Acceptance Criteria

### Minimum Viable (P1 Complete)
- [ ] 3 playable dinosaurs with all animation states
- [ ] 4 basic enemy sprites
- [ ] 2 biome backgrounds with parallax
- [ ] Core combat UI complete
- [ ] 5 music tracks
- [ ] 15 essential sound effects

### Showable Release (P1 + P2 Complete)
- [ ] All 7+ playable dinosaurs complete
- [ ] All 15+ enemy sprites complete
- [ ] All 3 boss sprites complete
- [ ] All 6 biome backgrounds complete
- [ ] Full UI asset library
- [ ] Complete music and SFX library

### Polished Release (All Complete)
- [ ] All unlockable dinosaurs
- [ ] Animated background elements
- [ ] Time-of-day variants
- [ ] Dinosaur vocalizations
- [ ] Additional polish effects

---

*This manifest is the authoritative source for asset requirements. See [CREDITS.md](../assets/CREDITS.md) for attribution tracking.*

*Last updated: Auto-generated by Primordial Swamp development*
