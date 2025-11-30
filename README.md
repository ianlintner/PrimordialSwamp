# Primordial Swamp 🦕

A scientifically accurate dinosaur roguelite browser game inspired by Odell Lake, featuring modern roguelite mechanics, turn-based combat, and educational content about prehistoric life.

## 🎮 Game Features

- **3 Playable Dinosaurs**: Deinonychus (Hunter), Ankylosaurus (Tank), Pteranodon (Scout)
- **Turn-Based Combat**: Strategic encounters with prehistoric creatures
- **Roguelite Progression**: Permadeath with meta-progression unlocks
- **Educational Content**: Learn real paleontology through gameplay
- **Procedural Generation**: Unique runs with branching paths
- **Scientific Accuracy**: Based on current paleontological research

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **Game Engine**: Phaser 3.80+
- **Language**: TypeScript 5.3+
- **Build Tool**: Vite 5.0
- **Testing**: Vitest

## 📖 Documentation

- [Game Design Document](GAME_DESIGN.md)
- [Technical Architecture](TECHNICAL_ARCHITECTURE.md)

## 🎯 MVP Features

### Implemented
- ✅ Project structure
- ✅ Phaser 3 integration
- ✅ TypeScript configuration

### In Progress
- 🔨 Core game systems
- 🔨 Combat mechanics
- 🔨 Dinosaur entities

### Planned
- ⏳ Encounter system
- ⏳ Map navigation
- ⏳ Meta-progression
- ⏳ Educational codex

## 🦖 Playable Dinosaurs

### Deinonychus
**Role**: Agile Hunter  
**Abilities**: Sickle Claw, Pack Coordination  
**Playstyle**: High damage, critical hits

### Ankylosaurus
**Role**: Armored Tank  
**Abilities**: Tail Club Counter, Armored Hide  
**Playstyle**: Defense, sustain, counter-attacks

### Pteranodon
**Role**: Scout/Support  
**Abilities**: Aerial Scout, Dive Attack, Escape Flight  
**Playstyle**: Hit-and-run, reconnaissance

## 🎲 Game Mechanics

- **Turn-Based Combat**: Strategic action selection
- **Stats System**: HP, Attack, Defense, Speed, Stamina
- **Trait System**: Unlock passive abilities during runs
- **Encounter Types**: Combat, Resources, Events, Special
- **Biome Progression**: Multiple prehistoric environments
- **Permadeath**: Each run is unique

## 📚 Educational Content

Learn about:
- Dinosaur anatomy and behavior
- Geological time periods
- Prehistoric ecosystems
- Paleontological discoveries
- Extinction events

## 🔬 Scientific Accuracy Framework

Primordial Swamp is built on a foundation of real paleontological research. Every game mechanic has scientific backing.

### Data Architecture

Our scientific data is organized in structured JSON formats:

| Data File | Purpose | Key Fields |
|-----------|---------|------------|
| `dinosaurs.json` | Organism stats and taxonomy | Species, period, morphology, behavior |
| `mutations.json` | Evolutionary adaptations | Effects, prerequisites, citations |
| `citations.json` | Academic references | DOI, author, journal, year |
| `biomes.json` | Ecosystem definitions | Climate, flora, fauna, hazards |
| `traits.json` | Acquired abilities | Stat modifiers, scientific basis |

### Scientific Foundations

**Physiology & Stats**: Character statistics are derived from paleontological evidence:
- **Health/Defense**: Based on body mass, armor (osteoderms), and estimated resilience
- **Attack**: Derived from bite force studies, claw measurements, and predatory adaptations
- **Speed**: Calculated from limb proportions and biomechanical analyses
- **Stamina**: Inferred from bone histology indicating metabolic rates

**Evolutionary Mutations**: The mutation system reflects real evolutionary pathways:
- Mutations require biological prerequisites (e.g., feather development requires theropod ancestry)
- Incompatibilities prevent biologically impossible combinations
- Each mutation cites peer-reviewed research

**Ecosystem Dynamics**: Biomes are based on paleoenvironmental reconstructions:
- Flora assemblages from paleobotanical fossil sites
- Climate data from isotope analysis and climate modeling
- Fauna distributions from fossil locality data

### Example: Science-to-Code Translation

```typescript
/**
 * Tail Club Strike ability for Ankylosaurus
 *
 * SCIENTIFIC BASIS:
 * - Force calculation from Arbour 2009 biomechanical study
 * - Tail club could generate ~14,000+ Newtons of impact force
 * - Sufficient to fracture tyrannosaur leg bones
 *
 * GAME TRANSLATION:
 * - High damage multiplier (1.4x) reflects devastating power
 * - Counter-attack mechanic reflects defensive weapon use
 * - Stun chance represents concussive impact
 *
 * @see Arbour, V.M. (2009). "Estimating impact forces of tail club
 *      strikes by ankylosaurid dinosaurs" PLOS ONE 4:e6738
 */
interface TailClubAbility {
  damageMultiplier: 1.4;      // Powerful but not instant-kill
  counterChance: 0.4;         // Defensive weapon, triggers on attack
  stunChance: 0.3;            // Concussive force
  staminaCost: 40;            // Heavy weapon requires effort
}
```

### Reference Sources

Our scientific content draws from:
- **Primary Literature**: Nature, Science, PLOS ONE, Journal of Vertebrate Paleontology
- **Institutional Sources**: American Museum of Natural History, Smithsonian, Natural History Museum London
- **Key References**: Paul (2016) "Princeton Field Guide to Dinosaurs", Holtz (2007) "Dinosaurs Encyclopedia"

All citations are stored in `src/data/citations.json` with DOIs for verification.

### Contributing Scientific Content

When adding new scientific content:
1. Cite at least one peer-reviewed source
2. Use conservative interpretations for disputed topics
3. Flag speculative content clearly
4. Update `citations.json` with new references

See [Scientific Accuracy Roadmap](docs/roadmap/02-scientific-accuracy.md) for detailed guidelines.

## 🎨 Art Style

16-bit inspired pixel art with modern color palette and smooth animations.

## 🔊 Audio

- Ambient soundscapes (period-accurate)
- Combat sound effects
- Adaptive music system

## 🤝 Contributing

This is an MVP project. Contributions welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

- Inspired by Odell Lake (1986)
- Influenced by Darkest Dungeon's map system
- Built with Phaser 3 community resources

---

**Status**: 🚧 In Development (MVP Phase 1)
