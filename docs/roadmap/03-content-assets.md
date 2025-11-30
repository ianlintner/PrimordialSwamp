# Content & Asset Requirements

## 🎯 Objective

Define and track all content and asset requirements needed to bring PrimordialSwamp to showcase quality.

---

## 📋 Asset Checklist

### Sprite Sheets & Animations

#### Player Dinosaurs (7 total)

| Dinosaur | Size | Animations | Status |
|----------|------|------------|--------|
| Deinonychus | 64x64 | idle, attack, hurt, defend, special, death, victory | ⏳ Needed |
| Ankylosaurus | 96x64 | idle, attack, hurt, defend, special, death, victory | ⏳ Needed |
| Pteranodon | 64x64 | idle, attack, hurt, defend, special, death, victory, fly | ⏳ Needed |
| Tyrannosaurus | 128x96 | idle, attack, hurt, defend, special, death, victory | ⏳ Needed |
| Pachycephalosaurus | 64x64 | idle, attack, hurt, defend, special, death, victory | ⏳ Needed |
| Therizinosaurus | 96x64 | idle, attack, hurt, defend, special, death, victory | ⏳ Needed |
| Parasaurolophus | 96x64 | idle, attack, hurt, defend, special, death, victory | ⏳ Needed |

#### Animation Specifications
- **Frame Count**: 6-8 frames per animation
- **Frame Rate**: 12 FPS
- **Style**: 16-bit inspired pixel art
- **Color Palette**: Earth tones with species-specific accents

### Enemy Sprites (15+ types)

#### Basic Enemies (5)
| Enemy | Size | Animations | Status |
|-------|------|------------|--------|
| Compsognathus Pack | 32x32 (x3-5) | idle, attack, hurt, death | ⏳ Needed |
| Dilophosaurus | 64x64 | idle, attack, hurt, death | ⏳ Needed |
| Coelophysis | 48x48 | idle, attack, hurt, death | ⏳ Needed |
| Dimetrodon | 64x48 | idle, attack, hurt, death | ⏳ Needed |
| Oviraptor | 48x48 | idle, attack, hurt, death | ⏳ Needed |

#### Advanced Enemies (5)
| Enemy | Size | Animations | Status |
|-------|------|------------|--------|
| Allosaurus | 96x64 | idle, attack, hurt, death, roar | ⏳ Needed |
| Sarcosuchus | 128x48 | idle, attack, hurt, death, submerge | ⏳ Needed |
| Velociraptor | 48x48 | idle, attack, hurt, death, leap | ⏳ Needed |
| Kentrosaurus | 64x64 | idle, attack, hurt, death | ⏳ Needed |
| Carnotaurus | 80x64 | idle, attack, hurt, death, charge | ⏳ Needed |

#### Elite Enemies (3)
| Enemy | Size | Animations | Status |
|-------|------|------------|--------|
| Spinosaurus | 128x96 | idle, attack, hurt, death, swim | ⏳ Needed |
| Therizinosaurus (enemy) | 96x64 | idle, attack, hurt, death | ⏳ Needed |
| Utahraptor | 64x64 | idle, attack, hurt, death, leap | ⏳ Needed |

#### Boss Enemies (3)
| Boss | Size | Animations | Status |
|------|------|------------|--------|
| Mosasaurus | 192x96 | idle, attack, hurt, death, dive, breach | ⏳ Needed |
| Giganotosaurus | 160x96 | idle, attack, hurt, death, roar, charge | ⏳ Needed |
| Tyrannosaurus Rex (Boss) | 160x96 | idle, attack, hurt, death, roar, crush | ⏳ Needed |

### Environment Backgrounds (4 Biomes)

| Biome | Layers | Elements | Status |
|-------|--------|----------|--------|
| Coastal Wetlands | 3 parallax | Water, ferns, trees, fog | ⏳ Needed |
| Fern Prairies | 3 parallax | Open plains, ferns, distant trees | ⏳ Needed |
| Volcanic Highlands | 3 parallax | Mountains, lava, smoke, ash | ⏳ Needed |
| Tar Pits | 3 parallax | Tar pools, bones, dead trees | ⏳ Needed |

#### Background Specifications
- **Resolution**: 1920x1080 base, scalable
- **Layers**: Sky, midground, foreground
- **Animated Elements**: Water ripples, smoke, particles
- **Time Variants**: Dawn, day, dusk, night (optional)

### UI Assets

#### Combat UI
- [ ] Health bar frame and fill
- [ ] Stamina bar frame and fill
- [ ] Turn indicator
- [ ] Action buttons (Attack, Defend, Ability, Flee)
- [ ] Status effect icons (16x16 each)
- [ ] Damage numbers popup
- [ ] Combat log background

#### Map UI
- [ ] Node icons (Combat, Resource, Event, Special, Elite, Boss)
- [ ] Path connectors
- [ ] Current position marker
- [ ] Fog of war overlay
- [ ] Biome transition borders

#### Menu UI
- [ ] Main menu background
- [ ] Button frames (normal, hover, pressed)
- [ ] Panel frames
- [ ] Character selection cards
- [ ] Codex book frame
- [ ] Settings sliders and toggles

#### Icons (32x32 each)
- [ ] Trait icons (55+)
- [ ] Ability icons (20+)
- [ ] Status effect icons (16+)
- [ ] Resource icons (fossils, eggs, items)
- [ ] Achievement icons (20+)

---

## 🔊 Audio Assets

### Music Tracks

| Track | Duration | Loop | Status |
|-------|----------|------|--------|
| Main Menu Theme | 2-3 min | Yes | ⏳ Needed |
| Coastal Wetlands Ambient | 3-4 min | Yes | ⏳ Needed |
| Fern Prairies Ambient | 3-4 min | Yes | ⏳ Needed |
| Volcanic Highlands Ambient | 3-4 min | Yes | ⏳ Needed |
| Tar Pits Ambient | 3-4 min | Yes | ⏳ Needed |
| Combat Theme (Normal) | 2-3 min | Yes | ⏳ Needed |
| Combat Theme (Elite) | 2-3 min | Yes | ⏳ Needed |
| Combat Theme (Boss) | 3-4 min | Yes | ⏳ Needed |
| Victory Fanfare | 10-15 sec | No | ⏳ Needed |
| Defeat Theme | 15-20 sec | No | ⏳ Needed |
| Codex Theme | 2-3 min | Yes | ⏳ Needed |

#### Music Style Guidelines
- Orchestral with prehistoric feel
- No anachronistic instruments
- Adaptive intensity for combat
- Ambient atmospheric for exploration

### Sound Effects

#### Combat SFX
- [ ] Basic attack (per species type)
- [ ] Special ability sounds
- [ ] Block/defend
- [ ] Damage taken
- [ ] Critical hit
- [ ] Miss/evade
- [ ] Status effect applied
- [ ] Status effect tick
- [ ] Death sound (per species)
- [ ] Victory chime

#### UI SFX
- [ ] Button click
- [ ] Button hover
- [ ] Panel open/close
- [ ] Tab switch
- [ ] Item collect
- [ ] Currency earn
- [ ] Achievement unlock
- [ ] Save confirmation
- [ ] Error/invalid action

#### Ambient SFX
- [ ] Water flowing
- [ ] Wind through ferns
- [ ] Volcanic rumbling
- [ ] Tar bubbling
- [ ] Distant dinosaur calls
- [ ] Insect buzzing
- [ ] Rain/storm (optional)

### Dinosaur Vocalizations (Optional but Impactful)
- [ ] Deinonychus chirp/screech
- [ ] Ankylosaurus grunt
- [ ] Pteranodon call
- [ ] T. Rex roar
- [ ] Various enemy vocalizations

---

## 📝 Content Requirements

### Encounter Content

#### Combat Encounters (20+)
| Type | Count | Status |
|------|-------|--------|
| Basic (1 enemy) | 8 | ⏳ |
| Pack (3-5 small enemies) | 4 | ⏳ |
| Duo (2 enemies) | 4 | ⏳ |
| Elite (1 strong enemy) | 4 | ⏳ |
| Boss (1 boss) | 3 | ⏳ |

#### Resource Encounters (8+)
- [ ] Feeding Ground (HP restore)
- [ ] Water Source (stamina restore)
- [ ] Nesting Site (eggs/buffs)
- [ ] Amber Deposit (research points)
- [ ] Fossil Site (codex unlock)
- [ ] Carcass (scavenge choice)
- [ ] Fruit Grove (minor heal)
- [ ] Mud Bath (buff/debuff cleanse)

#### Event Encounters (10+)
- [ ] Volcanic Eruption
- [ ] Flash Flood
- [ ] Meteor Shower
- [ ] Stampede
- [ ] Predator Ambush
- [ ] Friendly NPC
- [ ] Mysterious Shrine
- [ ] Ancient Ruins
- [ ] Territorial Dispute
- [ ] Migration Event

#### Special Encounters (5+)
- [ ] Merchant (Ancient Crocodile NPC)
- [ ] Trait Shrine
- [ ] Challenge Arena
- [ ] Mystery Egg
- [ ] Time Rift (optional lore)

### Text Content

#### Dinosaur Descriptions
- [ ] 7 player dinosaur full descriptions (200-300 words each)
- [ ] 15+ enemy descriptions (100-150 words each)
- [ ] 3 boss backstories (300-400 words each)

#### Codex Entries
- [ ] 50+ educational entries (200-400 words each)
- [ ] 20+ quick facts (50-100 words each)
- [ ] 10+ "Did You Know?" tidbits

#### UI Text
- [ ] Tutorial text (all steps)
- [ ] Ability descriptions (20+)
- [ ] Trait descriptions (55+)
- [ ] Status effect descriptions (16+)
- [ ] Achievement descriptions (20+)
- [ ] Settings labels and tooltips

---

## 📊 Asset Production Pipeline

### Recommended Tools
- **Sprites**: Aseprite, Piskel, or similar
- **Backgrounds**: Photoshop, GIMP, or Procreate
- **Music**: FL Studio, Ableton, or similar
- **SFX**: Audacity, sfxr, or similar
- **Icons**: Illustrator or vector tools

### Export Specifications

#### Sprites
- Format: PNG with transparency
- Organization: Sprite sheets with JSON atlas
- Naming: `{entity}_{animation}_{frame}.png`

#### Audio
- Format: OGG (music), MP3/WAV (SFX)
- Sample Rate: 44.1kHz
- Bit Depth: 16-bit

#### Fonts
- Format: TTF/OTF + bitmap font for pixel style
- Include: Regular, Bold weights

---

## ✅ Acceptance Criteria

- [ ] All 7 player dinosaurs have complete animation sets
- [ ] All 15+ enemies have at least idle, attack, hurt, death animations
- [ ] 4 biome backgrounds with parallax layers
- [ ] Complete UI asset set
- [ ] 10+ music tracks
- [ ] 30+ sound effects
- [ ] All text content written and proofread

---

## 📊 Priority Matrix

| Asset Category | Impact | Effort | Priority |
|----------------|--------|--------|----------|
| Player Sprites | High | High | P1 |
| Basic Enemy Sprites | High | Medium | P1 |
| Combat UI | High | Medium | P1 |
| Combat SFX | Medium | Low | P1 |
| Backgrounds | Medium | High | P2 |
| Music | Medium | High | P2 |
| Boss Sprites | Medium | High | P2 |
| Full Icon Set | Medium | Medium | P2 |
| Ambient SFX | Low | Medium | P3 |
| Dinosaur Vocalizations | Low | Medium | P3 |

---

*This sub-issue tracks all content and asset needs. Use as a checklist for production and outsourcing.*
