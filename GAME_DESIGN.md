# Primordial Swamp - Game Design Document

## Concept
A scientifically accurate dinosaur roguelite inspired by Odell Lake, featuring 2D side-scrolling progression through prehistoric environments with survival decisions, combat encounters, and educational content.

## Core Pillars
1. **Scientific Accuracy**: Accurate dinosaur behaviors, ecosystems, and time periods
2. **Meaningful Choices**: Each encounter offers strategic decisions with consequences
3. **Roguelite Progression**: Permadeath with meta-progression and unlocks
4. **Educational Value**: Learn about prehistoric life through gameplay
5. **Modern Mechanics**: Contemporary roguelite features (meta-currencies, unlocks, synergies)

---

## MVP Features

### 1. Playable Dinosaurs (7 Total)

#### **Deinonychus** (Agile Hunter)
- **Period**: Early Cretaceous (115-108 MYA)
- **Size**: Medium (3.4m length, 73kg)
- **Role**: hunter, ambusher
- **Diet**: Carnivore
- **Social**: Pack Hunter
- **Stats**:
  - Health: 65
  - Attack: 12
  - Defense: 4
  - Speed: 9
  - Stamina: 70
- **Abilities**:
  - **Sickle Slash**: Devastating claw attack with bleeding (15 stamina, 1.4x damage)
  - **Pack Coordination**: Bonus damage when fighting with allies
  - **Pounce**: Leap attack that stuns (25 stamina)
- **Scientific Facts**: 
  - Had 12cm curved toe claws for gripping and slashing prey
  - Likely had feathers for display, insulation, and brooding
  - Name means "terrible claw"

#### **Ankylosaurus** (Armored Tank)
- **Period**: Late Cretaceous (68-66 MYA)
- **Size**: Large (6.25m length, 4,800kg)
- **Role**: tank
- **Diet**: Herbivore
- **Social**: Solitary
- **Stats**:
  - Health: 130
  - Attack: 6
  - Defense: 12
  - Speed: 3
  - Stamina: 80
- **Abilities**:
  - **Tail Club Strike**: Devastating counter (20 stamina, 1.8x damage, stun)
  - **Armored Crouch**: +50% defense, immune to criticals (15 stamina)
  - **Shell Shock**: Damage reflect (30 stamina)
- **Scientific Facts**:
  - Tail club could swing with force exceeding 14,000 Newtons
  - Osteoderms were fused to skin, not bones
  - Brain was tiny relative to body size

#### **Pteranodon** (Scout/Support)
- **Period**: Late Cretaceous (86-84.5 MYA)
- **Size**: Large wingspan (7m wingspan, 25kg)
- **Role**: scout, support
- **Diet**: Piscivore
- **Social**: Colonial
- **Stats**:
  - Health: 45
  - Attack: 7
  - Defense: 2
  - Speed: 11
  - Stamina: 60
- **Abilities**:
  - **Dive Bomb**: Aerial strike with first-turn bonus (18 stamina, 1.5x damage)
  - **Aerial Scout**: Reveal upcoming encounters (10 stamina)
  - **Wind Gust**: Reduce enemy accuracy (22 stamina)
- **Scientific Facts**:
  - Not a dinosaur - a pterosaur (flying reptile)
  - Toothless beak for catching fish
  - Cranial crest used for display and aerodynamic stability

#### **Tyrannosaurus Rex** (Ultimate Predator)
- **Period**: Late Cretaceous (68-66 MYA)
- **Unlock**: Reach Swamp Depth 5
- **Size**: Massive (12m length, 8,400kg)
- **Role**: powerhouse
- **Diet**: Carnivore (hypercarnivore)
- **Social**: Solitary
- **Stats**:
  - Health: 150
  - Attack: 18
  - Defense: 8
  - Speed: 5
  - Stamina: 90
- **Abilities**:
  - **Crushing Bite**: Most powerful bite in history (30 stamina, 2.0x damage)
  - **Apex Roar**: Terrify all enemies (25 stamina)
  - **Pursuit Predator**: Speed boost when enemy is wounded (passive)
- **Scientific Facts**:
  - Bite force of 12,800 pounds - strongest of any terrestrial animal
  - Forward-facing eyes gave binocular vision for depth perception
  - Could eat 500 pounds of meat in one bite

#### **Pachycephalosaurus** (Dome-Headed Bruiser)
- **Period**: Late Cretaceous (70-66 MYA)
- **Unlock**: Win 10 encounters via defensive strategy
- **Size**: Medium (4.5m length, 450kg)
- **Role**: specialist, bruiser
- **Diet**: Omnivore
- **Social**: Herd
- **Stats**:
  - Health: 85
  - Attack: 10
  - Defense: 7
  - Speed: 6
  - Stamina: 75
- **Abilities**:
  - **Skull Bash**: Devastating headbutt with stun chance (20 stamina, 1.6x damage)
  - **Thick Skull**: Immune to stun, bonus defense (passive)
  - **Charging Ram**: Multi-hit charge attack (35 stamina)
- **Scientific Facts**:
  - Skull dome was up to 25cm (10 inches) thick
  - Dome may have been used for flank-butting rather than head-on collisions
  - One of the last non-avian dinosaurs to exist

#### **Therizinosaurus** (Claw Defense Specialist)
- **Period**: Late Cretaceous (70 MYA)
- **Size**: Large (10m length, 5,000kg)
- **Role**: tank, controller
- **Diet**: Herbivore
- **Social**: Solitary
- **Stats**:
  - Health: 110
  - Attack: 11
  - Defense: 6
  - Speed: 4
  - Stamina: 85
- **Abilities**:
  - **Scything Claws**: Wide slash with bleeding (22 stamina, 1.5x damage)
  - **Defensive Stance**: Counter with claw swipe (18 stamina)
  - **Intimidating Display**: Reduce enemy attack (15 stamina)
- **Scientific Facts**:
  - Possessed the longest claws of any known animal - up to 1 meter long
  - Despite fearsome claws, was an herbivore that ate plants
  - Related to carnivorous theropods but evolved plant-eating habits

#### **Parasaurolophus** (Communication Support)
- **Period**: Late Cretaceous (76.5-73 MYA)
- **Size**: Large (9.5m length, 2,500kg)
- **Role**: support
- **Diet**: Herbivore
- **Social**: Large herds
- **Stats**:
  - Health: 95
  - Attack: 6
  - Defense: 5
  - Speed: 7
  - Stamina: 100
- **Abilities**:
  - **Resonating Call**: Buff allies with morale boost (20 stamina)
  - **Warning Cry**: Reduce enemy damage for 2 turns (15 stamina)
  - **Herd Coordination**: All allies gain speed boost (25 stamina)
- **Scientific Facts**:
  - Hollow cranial crest could produce sounds traveling for kilometers
  - Crest functioned like a resonating chamber for communication
  - Traveled in large herds for protection

---

## Core Stats System

### Primary Stats
- **Health (HP)**: Damage capacity before death
- **Attack (ATK)**: Base damage output
- **Defense (DEF)**: Damage reduction
- **Speed (SPD)**: Turn order, evasion chance
- **Stamina (STA)**: Special ability usage

### Derived Stats
- **Critical Chance**: Base 5% + species modifiers
- **Evasion**: (Speed - 5) * 2%
- **Stamina Regen**: 10 per turn
- **Accuracy**: Base 90% + modifiers

### Status Effects (Expanded System)
- **Bleeding**: 5 damage/turn, reduced by 1 each turn
- **Stunned**: Skip next turn
- **Poisoned**: 3 damage/turn, reduces healing by 50%
- **Exhausted**: -50% speed, -3 attack, cannot use special abilities
- **Fortified**: +5 defense for 2 turns
- **Enraged**: +30% damage, -20% defense
- **Hidden**: Cannot be targeted, +50% damage on first attack
- **Burned**: 4 damage/turn, -2 defense
- **Frozen**: Skip turn, take 50% more damage from physical
- **Shocked**: 25% chance to fail actions
- **Terrified**: 40% chance to flee, -4 attack
- **Confused**: 30% chance to hit self or allies
- **Weakened**: -25% all stats
- **Empowered**: +25% all stats
- **Regenerating**: Heal 5 HP per turn
- **Berserk**: Double damage, cannot defend, attacks random targets
- **Camouflaged**: Enemies have -50% accuracy against you

### Damage Types
- **Physical**: Standard melee damage
- **Crushing**: High impact damage, effective vs armor
- **Slashing**: Cutting damage, causes bleeding
- **Piercing**: Armor-penetrating damage
- **Poison**: Damage over time, bypasses some defenses
- **Sonic**: Sound-based attacks, can disorient
- **Blunt**: Concussive damage, can stun

### Environmental Modifiers
- **Weather Effects**:
  - Clear: No modifiers
  - Rainy: -10% accuracy, fire resistance
  - Stormy: -20% accuracy, +20% sonic damage
  - Foggy: -30% visibility, stealth bonus
  - Scorching: Fire vulnerability, stamina drain
  - Frigid: Cold damage, reduced speed
  
- **Terrain Effects**:
  - Plains: Open combat, no cover
  - Forest: Stealth bonus, fire vulnerability
  - Swamp: Movement penalty, poison resistance
  - Volcanic: Fire damage, heat exhaustion
  - Coastal: Aquatic advantage, tidal hazards
  - Desert: Stamina drain, heat effects
  - Tundra: Cold damage, reduced speed
  - Cave: Darkness penalties, sonic amplification

- **Time of Day**:
  - Dawn: Balanced combat
  - Day: Normal visibility
  - Dusk: Stealth bonus
  - Night: Darkness penalties, nocturnal bonuses
- **Speed (SPD)**: Turn order, evasion chance
- **Stamina (STA)**: Special ability usage

### Derived Stats
- **Critical Chance**: Base 5% + species modifiers
- **Evasion**: (Speed - 5) * 2%
- **Stamina Regen**: 10 per turn
- **Accuracy**: Base 90% + modifiers

### Conditions
- **Bleeding**: 3 damage/turn for 3 turns
- **Stunned**: Skip next turn
- **Poisoned**: 5 damage/turn, reduces max stamina
- **Exhausted**: -50% speed, -2 attack
- **Fortified**: +5 defense for 2 turns

---

## Game Mechanics

### 1. Run Structure (Darkest Dungeon-inspired)
```
[Start Camp] → [Node] → [Node] → [Node] → [Boss] → [Next Biome]
```

- **Run Length**: 15-20 nodes per biome
- **Biomes**: 
  1. Coastal Wetlands (Tutorial)
  2. Fern Prairies (Mid-game)
  3. Volcanic Highlands (Late-game)
  4. Tar Pits (End-game)
- **Permadeath**: Death ends run, keep meta-currency
- **Map Choice**: Player sees next 2-3 node options, chooses path

### 2. Node Types (Encounter System)

#### Combat Encounters (50%)
- **Predator**: Aggressive dinosaurs (Allosaurus, Spinosaurus, Carnotaurus)
- **Territory**: Defending herbivores (Triceratops, Stegosaurus, Therizinosaurus)
- **Ambush**: Hidden threats (Dromaeosaurids, Dilophosaurus)
- **Pack**: Swarm encounters (Compsognathus packs, Coelophysis groups)

#### Resource Encounters (25%)
- **Feeding Ground**: Restore 30 HP, random food type teaches fact
- **Water Source**: Restore 50 stamina, learn about climate
- **Nesting Site**: Find eggs (currency) or adopt buff

#### Event Encounters (15%)
- **Environmental**: Volcanic eruption, meteor shower, flash flood
- **Discovery**: Amber deposits, fossil sites, nesting grounds
- **Wildlife**: Pterosaur flock, insect swarm, mammal pack

#### Special Encounters (10%)
- **Merchant**: Trade eggs for upgrades (ancient crocodile NPC)
- **Shrine**: Sacrifice HP for permanent buffs
- **Mystery**: Random high-risk/high-reward scenarios

### 3. Random Encounter Events

#### Environmental Events
- **Volcanic Eruption**: Dodge falling debris, find shelter, or flee
  - Scientific Note: Volcanic activity was common during the Mesozoic Era
- **Meteor Shower**: Risk-reward opportunity for rare minerals
  - Scientific Note: Small meteor impacts occurred throughout Earth's history
- **Flash Flood**: Swimming skill test, rescue opportunities
  - Scientific Note: Seasonal flooding was common in prehistoric river valleys

#### Discovery Events
- **Amber Deposit**: Ancient insects preserved in tree resin
  - Choices: Extract carefully for bonus, rush for partial reward, ignore
  - Scientific Note: Amber preserves organisms for millions of years
- **Fossil Site**: Uncover ancient bones for research
  - Choices: Excavate (takes time), quick dig (risky), mark for later
  - Scientific Note: Fossilization requires specific conditions
- **Nesting Ground**: Observe dinosaur parenting behavior
  - Choices: Help defend, steal eggs, study peacefully
  - Scientific Note: Many dinosaurs showed extensive parental care

### 4. Combat System (Turn-Based)

```
Turn Order: Determined by Speed stat
↓
Environmental Effects Applied
↓
Player Action Phase
├─ Attack (Basic/Special)
├─ Defend (+5 DEF this turn)
├─ Use Item
├─ Target Specific Body Zone
└─ Attempt Flee (Speed check)
↓
Enemy Action Phase
↓
Status Effect Resolution
↓
Environmental Hazard Resolution
↓
Check Victory/Defeat
```

#### Action Types
- **Basic Attack**: 100% ATK damage, 10 stamina
- **Special Ability**: Species-specific, 15-40 stamina
- **Heavy Attack**: 150% ATK, -5 DEF, 25 stamina
- **Defend**: +5 DEF, prepare counter
- **Item**: Consume foraged resources

#### Body Target Zones
- **Head**: High damage, hard to hit, can cause stun
- **Body**: Standard damage, normal accuracy
- **Limbs**: Reduce enemy attacks/movement
- **Tail**: For creatures with tail weapons
- **Wings**: Disable flight abilities
- **Weak Spot**: Massive damage if identified

#### Combat Modernizations
- **Weak Points**: Target specific body parts for bonuses
- **Combo System**: Chaining abilities builds "Evolution" meter
- **Environmental Hazards**: Use terrain (cliffs, water, vegetation)
- **Adaptive AI**: Enemies learn from repeated strategies
- **Weather Impact**: Rain, storms, heat affect combat
- **Pack Tactics**: Allied dinosaurs provide flanking bonuses

### 5. Progression Systems

#### Per-Run Progression
- **Level Up**: Gain stats from surviving encounters
- **Trait Acquisition**: Random permanent buffs during run
- **Equipment**: Bone armor, sharpened claws (temporary)
- **Mutation Points**: Spend at shrines for run-specific upgrades

#### Meta-Progression
- **Fossil Fragments** (Currency): Unlock new dinosaurs
- **Research Points**: Unlock permanent stat boosts
- **Egg Collection**: Complete dinosaur encyclopedia
- **Achievement Unlocks**: New encounter types, abilities

#### Trait System (55+ Traits Available)

**Physical Traits**:
- **Thick Hide**: +5 defense
- **Sharp Claws**: +5 attack
- **Hollow Bones**: +3 speed, -10 HP
- **Dense Bones**: +3 defense, -1 speed
- **Feathered Coat**: Cold immunity, +1 evasion
- **Armored Body**: 15% physical damage reduction
- **Serrated Teeth**: 20% bleeding on attack
- **Club Tail**: Counter attacks stun
- **Dome Skull**: Stun immunity, +30% headbutt damage
- **Sickle Claw**: Crits cause bleeding

**Behavioral Traits**:
- **Pack Tactics**: +15% damage with allies
- **Apex Predator**: +20% damage vs elite/boss
- **Predator's Instinct**: +30% crit vs low health targets
- **Ambush Predator**: +10 attack first turn
- **Nocturnal Hunter**: +25% damage at night
- **Scavenger**: Heal 20 HP on kill
- **Territorial**: +20% damage in home biome
- **Herd Instinct**: +2 defense with allies
- **Alpha Status**: Allies get +10% damage, +1 defense

**Special Traits**:
- **Living Fossil**: +10% all stats
- **Extinction Survivor**: Cheat death once per run
- **Bone-Breaking Bite**: Crits reduce max HP
- **Regeneration**: Heal 5 HP per turn
- **Venomous**: 20% poison on attack
- **Ancient Wisdom**: Gain stacking buffs after combat

#### Dinosaur Roles
- **Hunter**: High damage, pack synergies
- **Tank**: High defense, damage mitigation
- **Support**: Buffs, healing, team coordination
- **Ambusher**: First-strike bonuses, stealth
- **Powerhouse**: Massive single-target damage
- **Controller**: Status effects, debuffs
- **Scout**: Reveal encounters, mobility
- **Specialist**: Unique mechanics (headbutt, sonic)
- **Bruiser**: Balanced offense and defense
- **Aquatic Hunter**: Water terrain bonuses

---

## Educational Integration

### Knowledge System
Every action teaches paleontology:

1. **Combat Lessons**
   - "Deinonychus likely used pack tactics, similar to modern wolves"
   - "Ankylosaurus club tail could swing at 70mph"

2. **Environmental Facts**
   - "Cretaceous CO2 levels were 6x higher than today"
   - "This fern species existed 150 million years ago"

3. **Discovery Codex**
   - Unlock entries for each dinosaur encountered
   - Period, diet, size comparison, recent discoveries
   - Citation system with real paleontology sources

4. **Quiz Encounters** (Optional)
   - Answer correctly for bonus rewards
   - "Which period was hotter: Triassic or Cretaceous?"

### Accuracy Measures
- **Time Period Accuracy**: No mixing incompatible eras without story reason
- **Size/Behavior**: Based on latest paleontology research (2020+)
- **Ecosystem Dynamics**: Accurate predator/prey relationships
- **Extinction Events**: Teach about K-Pg boundary, climate change

---

## Modern Roguelite Features

### 1. Synergies & Builds
- **Pack Hunter Build**: Deinonychus + pack traits + speed buffs
- **Tank Build**: Ankylosaurus + counter traits + regen
- **Glass Cannon**: High attack, low defense, crit-focused

### 2. Daily Challenges
- Fixed seed runs with leaderboards
- Special modifiers (increased enemy speed, resource scarcity)

### 3. Achievements & Unlocks
- "Extinction Event": Defeat 100 enemies
- "Paleontologist": Discover all codex entries
- "Darwin Award": Die to same species 3 times

### 4. Meta-Narrative
- Each run is a "genetic simulation"
- Experiment with evolutionary paths
- Unlock story logs explaining prehistoric mysteries

### 5. Difficulty Modifiers
- **Permian Mode**: Harder enemies, better rewards
- **Jurassic Cruise**: Easier for learning
- **Custom Mutations**: Player-defined challenge modifiers

---

## Technical Architecture

### Technology Stack
- **Framework**: Phaser 3 (WebGL/Canvas)
- **Language**: TypeScript
- **Build**: Vite
- **State Management**: Custom ECS (Entity Component System)
- **Data**: JSON for dinosaur/encounter data
- **Assets**: Pixel art style (16-bit inspired)

### Project Structure
```
src/
├── scenes/
│   ├── BootScene.ts
│   ├── MenuScene.ts
│   ├── MapScene.ts (Darkest Dungeon map)
│   ├── CombatScene.ts
│   ├── EncounterScene.ts
│   └── CodexScene.ts
├── entities/
│   ├── Dinosaur.ts
│   ├── Enemy.ts
│   └── Player.ts
├── systems/
│   ├── CombatSystem.ts
│   ├── ProgressionSystem.ts
│   ├── EncounterManager.ts
│   └── SaveSystem.ts
├── components/
│   ├── Stats.ts
│   ├── Abilities.ts
│   ├── StatusEffects.ts
│   └── Traits.ts
├── data/
│   ├── dinosaurs.json
│   ├── encounters.json
│   ├── traits.json
│   └── educational.json
├── ui/
│   ├── HealthBar.ts
│   ├── StatsPanel.ts
│   ├── MapNode.ts
│   └── CodexEntry.ts
└── utils/
    ├── Random.ts (Seeded RNG)
    ├── Combat.ts
    └── Persistence.ts
```

### Core Systems Design

#### 1. Entity Component System
```typescript
Entity (Dinosaur)
├── StatsComponent (HP, ATK, DEF, SPD, STA)
├── AbilitiesComponent (Special moves)
├── TraitsComponent (Passive buffs)
├── StatusEffectsComponent (Conditions)
└── SpriteComponent (Visual)
```

#### 2. Save System
- LocalStorage for meta-progression
- Session storage for current run
- Autosave after each encounter

#### 3. Random Encounter Generation
```typescript
Seed → Procedural Map → Weighted Node Types → Difficulty Scaling
```

#### 4. Combat Resolution
```typescript
InitiativQueue (sorted by Speed)
→ ActionProcessing
→ DamageCalculation (ATK - DEF)
→ StatusEffects
→ VictoryCheck
```

---

## Art & Audio Direction

### Visual Style
- **Pixel Art**: 16-bit inspired, modern color palette
- **Animation**: 6-8 frames per action
- **UI**: Clean, informative, prehistoric-themed borders
- **Color Coding**: 
  - Green: Herbivores
  - Red: Carnivores
  - Blue: Water creatures
  - Purple: Special encounters

### Audio
- **Ambient**: Period-appropriate soundscapes (no birds!)
- **Combat**: Meaty impacts, realistic roars
- **UI**: Subtle clicking, page turns for codex
- **Music**: Atmospheric, adaptive combat intensity

### Accessibility
- Color-blind modes
- Text-to-speech for educational content
- Adjustable UI scaling
- Keyboard-only play option

---

## MVP Scope (2-3 Months)

### Phase 1: Core Systems (3-4 weeks)
- [ ] Phaser 3 setup + TypeScript
- [ ] Basic combat system
- [ ] 3 playable dinosaurs
- [ ] Stats & combat resolution
- [ ] Turn-based combat UI

### Phase 2: Roguelite Loop (3-4 weeks)
- [ ] Map navigation system
- [ ] 5 encounter types
- [ ] Permadeath & run structure
- [ ] Basic trait system (10 traits)
- [ ] Meta-currency (fossils)

### Phase 3: Content & Polish (3-4 weeks)
- [ ] 15 enemy types
- [ ] Educational codex (50 entries)
- [ ] 3 biomes
- [ ] Save/load system
- [ ] Boss encounters

### Phase 4: Modernization (2-3 weeks)
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Synergy mechanics
- [ ] Balance tuning
- [ ] Tutorial integration

---

## Success Metrics

### Gameplay
- Average run time: 20-30 minutes
- First boss clear rate: 30-40%
- Full game clear rate: 10-15%
- Return player rate: 50%+

### Educational
- Codex completion rate: 60%+
- Facts learned per run: 15-20
- Optional quiz participation: 40%+

### Technical
- Load time: <3 seconds
- 60 FPS on mid-range devices
- Mobile-friendly (touch controls)
- Save file size: <500KB

---

## Future Expansion Ideas

### Post-MVP Features
- **Multiplayer**: Cooperative expeditions
- **More Biomes**: Underwater, aerial-focused levels
- **Time Travel**: Visit different geological periods
- **Base Building**: Camp upgrades between runs
- **Breeding System**: Combine dinosaur traits
- **Modding Support**: Community content

### Educational Expansions
- **Paleontologist Mode**: Real dig site simulations
- **Timeline Explorer**: Interactive geological timeline
- **Expert Commentary**: Interviews with real paleontologists
- **Museum Integration**: Links to natural history museums

---

## Conclusion

Primordial Swamp combines the educational charm of Odell Lake with modern roguelite mechanics, scientific accuracy, and engaging combat. The MVP focuses on tight core gameplay loop, three distinct playable characters, meaningful choices, and seamlessly integrated educational content.

**Core Innovation**: Every death teaches something about prehistoric life, making failure a learning opportunity both mechanically (roguelite meta-progression) and educationally (paleontology facts).
