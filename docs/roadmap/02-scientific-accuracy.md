# Scientific Accuracy Expansion

## 🎯 Objective

Enhance educational content and biological accuracy to deliver a scientifically rigorous experience that teaches real paleontology through gameplay.

---

## 📋 Feature Checklist

### Expanded Dinosaur Roster

#### Current Roster (4 dinosaurs)
- ✅ Deinonychus (Early Cretaceous, 115-108 MYA)
- ✅ Ankylosaurus (Late Cretaceous, 68-66 MYA)
- ✅ Pteranodon (Late Cretaceous, 86-84.5 MYA)
- ✅ Tyrannosaurus Rex (Late Cretaceous, 68-66 MYA)

#### Planned Additions (3+ more)
- [ ] **Pachycephalosaurus**
  - Period: Late Cretaceous (70-66 MYA)
  - Behavior: Dome-headed display/combat
  - Scientific Notes: Skull dome function debated (display vs. combat)
- [ ] **Therizinosaurus**
  - Period: Late Cretaceous (70 MYA)
  - Behavior: Defensive giant with 1m claws
  - Scientific Notes: Herbivore despite theropod ancestry
- [ ] **Parasaurolophus**
  - Period: Late Cretaceous (76.5-73 MYA)
  - Behavior: Social, sound-producing crest
  - Scientific Notes: Hollow crest resonated like a trombone

#### Data Requirements Per Dinosaur
- [ ] Accurate size measurements (length, height, weight)
- [ ] Precise time period (era, period, million years ago range)
- [ ] Diet classification with prey/food sources
- [ ] Social behavior (solitary, pack, herd)
- [ ] Locomotion style
- [ ] 3+ verified scientific facts with citations
- [ ] Known fossil sites
- [ ] Discovery history

### Environmental Accuracy

#### Time Period Enforcement
- [ ] Implement era-appropriate encounters
  - Triassic: 251.9–201.4 MYA
  - Jurassic: 201.4–145 MYA
  - Cretaceous: 145–66 MYA
- [ ] Prevent anachronistic pairings (no T. Rex vs. Stegosaurus)
- [ ] Display time period in encounters

#### Ecosystem Modeling
- [ ] **Coastal Wetlands Biome**
  - Flora: Ferns, cycads, early angiosperms
  - Fauna: Small theropods, ornithopods, pterosaurs
  - Climate: Tropical, high humidity
- [ ] **Fern Prairies Biome**
  - Flora: Fern prairies, conifers
  - Fauna: Large herbivores, predators
  - Climate: Warm, seasonal
- [ ] **Volcanic Highlands Biome**
  - Flora: Hardy vegetation, moss
  - Fauna: Specialized species
  - Climate: Unstable, warm
- [ ] **Tar Pits Biome**
  - Flora: Sparse, death zone
  - Fauna: Scavengers, trapped animals
  - Climate: Hot, dangerous

#### Climate & Atmosphere Facts
- [ ] CO2 levels (Cretaceous: 4-6x modern)
- [ ] Oxygen levels
- [ ] Temperature ranges
- [ ] Sea levels

### Educational Codex

#### Structure (50+ entries minimum)
```
Codex/
├── Dinosaurs/
│   ├── Theropods/
│   ├── Sauropods/
│   ├── Ornithischians/
│   └── Non-Dinosaurs/
├── Time Periods/
│   ├── Triassic/
│   ├── Jurassic/
│   └── Cretaceous/
├── Paleontology/
│   ├── Fossil Formation/
│   ├── Discovery Methods/
│   └── Famous Paleontologists/
├── Ecosystems/
│   ├── Food Chains/
│   ├── Climate/
│   └── Geography/
└── Extinction/
    ├── K-Pg Boundary/
    ├── Mass Extinctions/
    └── Survivors/
```

#### Entry Requirements
- [ ] Title and scientific name
- [ ] Brief description (50-100 words)
- [ ] Extended content (200-400 words)
- [ ] 2+ academic citations
- [ ] Related entries links
- [ ] Discovery date and location
- [ ] Image/illustration reference

### Behavior Patterns

#### Predator Behaviors
- [ ] **Ambush hunting** - Patient waiting, explosive attack
- [ ] **Pack tactics** - Coordinated group hunting
- [ ] **Pursuit predation** - Stamina-based chasing
- [ ] **Scavenging** - Opportunistic feeding

#### Herbivore Behaviors
- [ ] **Herd formation** - Safety in numbers
- [ ] **Defensive circles** - Protecting young
- [ ] **Migration patterns** - Seasonal movement
- [ ] **Vigilance behaviors** - Constant threat assessment

#### Social Behaviors
- [ ] **Nesting** - Parental care evidence
- [ ] **Communication** - Vocalizations, displays
- [ ] **Hierarchy** - Pack/herd dynamics
- [ ] **Territory** - Marking, defense

### Citation System

- [ ] Implement citation format: Author (Year) - Journal/Publication
- [ ] Link to accessible sources when possible
- [ ] Date stamp for "last verified" accuracy
- [ ] Flag disputed/outdated information

---

## 🏗️ Implementation Details

### Data Structures

```typescript
interface ScientificData {
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  timePeriod: {
    era: 'Triassic' | 'Jurassic' | 'Cretaceous';
    period: string;
    epoch?: string;
    myaStart: number;
    myaEnd: number;
  };
  physiology: {
    length: number; // meters
    height: number;
    weight: number; // kg
    diet: 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Piscivore';
    locomotion: 'Biped' | 'Quadruped' | 'Flying' | 'Swimming';
  };
  behavior: {
    social: 'Solitary' | 'Pair' | 'Pack' | 'Herd' | 'Colony';
    activity: 'Diurnal' | 'Nocturnal' | 'Crepuscular';
    territorial: boolean;
    migrating: boolean;
  };
  facts: ScientificFact[];
  citations: Citation[];
}

interface ScientificFact {
  id: string;
  text: string;
  category: 'anatomy' | 'behavior' | 'ecology' | 'discovery';
  citations: string[]; // Citation IDs
  lastVerified: string; // ISO date
}

interface Citation {
  id: string;
  author: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  url?: string;
}

interface CodexEntry {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  summary: string;
  content: string;
  scientificData?: ScientificData;
  relatedEntries: string[];
  unlockCondition: UnlockCondition;
  discovered: boolean;
  discoveredDate?: string;
}
```

### File Changes Required

| File | Changes |
|------|---------|
| `src/data/dinosaurs.json` | Expand scientific data |
| `src/data/codex.json` | Create comprehensive codex |
| `src/data/citations.json` | Academic sources |
| `src/data/biomes.json` | Ecosystem data |
| `src/types/Scientific.types.ts` | Scientific type definitions |
| `src/scenes/CodexScene.ts` | Enhanced codex display |
| `src/systems/EraValidation.ts` | Time period checks |

---

## ✅ Acceptance Criteria

- [ ] All dinosaur data matches current paleontological consensus (2020+)
- [ ] No anachronistic creature pairings in encounters
- [ ] 50+ codex entries with proper citations
- [ ] Each fact has at least one verifiable citation
- [ ] Time period information displayed in all relevant contexts
- [ ] Codex search and filter functionality

---

## 📚 Reference Sources

### Academic Databases
- Journal of Vertebrate Paleontology
- PLOS ONE Paleontology
- Nature Communications
- Science (paleontology articles)

### Trusted Popular Sources
- Natural History Museum (London)
- Smithsonian National Museum of Natural History
- American Museum of Natural History
- University paleontology departments

### Books for Reference
- "The Princeton Field Guide to Dinosaurs" (Paul, 2016)
- "Dinosaurs: The Most Complete, Up-to-Date Encyclopedia" (Holtz, 2007)
- "The Dinosauria" (Weishampel et al., 2004)

---

## 🎓 Educational Integration

### Seamless Learning Moments
- Combat abilities tied to real anatomy
- Environmental facts during exploration
- Discovery codex entries through gameplay
- Optional quiz encounters for bonus rewards

### Fact Delivery Methods
1. **Passive** - Facts in descriptions and codex
2. **Active** - Quiz encounters reward knowledge
3. **Contextual** - Tips during relevant gameplay
4. **Collectible** - Fossil discoveries unlock facts

---

## 📊 Priority Matrix

| Feature | Educational Value | Effort | Priority |
|---------|------------------|--------|----------|
| Dinosaur Data Accuracy | High | Medium | P1 |
| Time Period Enforcement | High | Low | P1 |
| Basic Codex (20 entries) | High | Medium | P1 |
| Full Codex (50+ entries) | Medium | High | P2 |
| Citation System | Medium | Medium | P2 |
| Ecosystem Details | Medium | High | P3 |
| Quiz Encounters | Low | Medium | P3 |

---

*This sub-issue ensures PrimordialSwamp delivers accurate, engaging educational content that distinguishes it from other roguelites.*
