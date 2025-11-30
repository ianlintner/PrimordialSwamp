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

### 1. Playable Dinosaurs (3 Starting Options)

#### **Deinonychus** (Agile Hunter)
- **Period**: Early Cretaceous (115-108 MYA)
- **Size**: Medium (3.4m length, 73kg)
- **Role**: Fast, pack tactics, high critical chance
- **Stats**:
  - Health: 60
  - Attack: 8
  - Defense: 3
  - Speed: 9
  - Stamina: 70
- **Abilities**:
  - **Sickle Claw**: 30% chance for double damage
  - **Pack Coordination**: +20% damage when at full health
  - **Feathered Agility**: +2 evasion
- **Scientific Facts**: 
  - Had large curved claws on hind feet
  - Likely had feathers for display and insulation
  - Hunted in coordinated packs

#### **Ankylosaurus** (Armored Tank)
- **Period**: Late Cretaceous (68-66 MYA)
- **Size**: Large (6.25m length, 4,800kg)
- **Role**: High defense, counter-attacks, sustain
- **Stats**:
  - Health: 120
  - Attack: 5
  - Defense: 10
  - Speed: 3
  - Stamina: 90
- **Abilities**:
  - **Tail Club**: Counter 40% of melee damage
  - **Armored Hide**: Reduce all damage by 3
  - **Immovable**: Cannot be flanked or surprised
- **Scientific Facts**:
  - Tail club could break bones with 14,000N force
  - Osteoderms provided near-complete body armor
  - Low center of gravity made it difficult to flip

#### **Pteranodon** (Scout/Support)
- **Period**: Late Cretaceous (86-84.5 MYA)
- **Size**: Medium-Large (7m wingspan, 25kg)
- **Role**: Reconnaissance, encounter avoidance, hit-and-run
- **Stats**:
  - Health: 40
  - Attack: 6
  - Defense: 2
  - Speed: 10
  - Stamina: 50
- **Abilities**:
  - **Aerial Scout**: Reveal next 2 encounters
  - **Dive Attack**: First strike in combat
  - **Escape Flight**: Can flee combat without penalty
- **Scientific Facts**:
  - Not technically a dinosaur (flying reptile)
  - Massive wingspan for soaring over oceans
  - Fed primarily on fish

### 2. Unlockable Dinosaurs (3 Additional)

#### **Tyrannosaurus Rex** (Ultimate Predator)
- **Unlock**: Reach Swamp Depth 5
- **Period**: Late Cretaceous (68-66 MYA)
- High risk/reward, massive damage, low speed

#### **Pachycephalosaurus** (Headbutter)
- **Unlock**: Win 10 encounters via defensive strategy
- **Period**: Late Cretaceous (70-66 MYA)
- Stun specialist, charge attacks

#### **Compsognathus** (Swarm)
- **Unlock**: Discover 20 educational facts
- **Period**: Late Jurassic (150 MYA)
- Controls 3 tiny dinosaurs, overwhelming tactics

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
- **Predator**: Aggressive dinosaurs (Allosaurus, Utahraptor)
- **Territory**: Defending herbivores (Triceratops, Stegosaurus)
- **Ambush**: Hidden threats (Dromaeosaurs in undergrowth)

#### Resource Encounters (25%)
- **Feeding Ground**: Restore 30 HP, random food type teaches fact
- **Water Source**: Restore 50 stamina, learn about climate
- **Nesting Site**: Find eggs (currency) or adopt buff

#### Event Encounters (15%)
- **Environmental**: Meteor shower, volcanic eruption, flood
- **Wildlife**: Pterosaur flock, insect swarm, mammal pack
- **Discovery**: Fossil, amber, archaeological site (educational)

#### Special Encounters (10%)
- **Merchant**: Trade eggs for upgrades (ancient crocodile NPC)
- **Shrine**: Sacrifice HP for permanent buffs
- **Mystery**: Random high-risk/high-reward scenarios

### 3. Combat System (Turn-Based)

```
Turn Order: Determined by Speed stat
↓
Player Action Phase
├─ Attack (Basic/Special)
├─ Defend (+5 DEF this turn)
├─ Use Item
└─ Attempt Flee (Speed check)
↓
Enemy Action Phase
↓
Status Effect Resolution
↓
Check Victory/Defeat
```

#### Action Types
- **Basic Attack**: 100% ATK damage, 10 stamina
- **Special Ability**: Species-specific, 30-50 stamina
- **Heavy Attack**: 150% ATK, -5 DEF, 25 stamina
- **Defend**: +5 DEF, prepare counter
- **Item**: Consume foraged resources

#### Combat Modernizations
- **Weak Points**: Target specific body parts for bonuses
- **Combo System**: Chaining abilities builds "Evolution" meter
- **Environmental Hazards**: Use terrain (cliffs, water, vegetation)
- **Adaptive AI**: Enemies learn from repeated strategies

### 4. Progression Systems

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

#### Trait System (Roguelite Buffs)
Examples:
- **Apex Predator**: +15% damage vs herbivores
- **Scavenger**: Heal 10 HP after combat
- **Territorial**: +3 defense in repeat encounters
- **Nocturnal Hunter**: +20% critical at low health
- **Adaptive Immunity**: First poison doesn't affect you

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
