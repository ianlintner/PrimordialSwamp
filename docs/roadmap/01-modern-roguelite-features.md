# Modern Roguelite Feature Set Alignment

## 🎯 Objective

Implement features expected in contemporary roguelites (Hades, Risk of Rain 2, Dead Cells, Slay the Spire) to meet player expectations and provide a compelling gameplay loop.

---

## 📋 Feature Checklist

### Meta-Progression System

#### Currency & Unlocks
- [ ] **Fossil Fragments** - Primary meta-currency
  - Earned from combat victories, discoveries, run completion
  - Persists between runs
  - Spent on permanent unlocks
- [ ] **Research Points** - Secondary currency
  - Earned from educational discoveries
  - Unlocks codex entries and scientific bonuses
- [ ] **Egg Collection** - Collectible system
  - Find eggs during runs
  - Complete dinosaur encyclopedia

#### Permanent Unlocks
- [ ] **New Dinosaurs** (4 unlockable beyond 3 starters)
  - T. Rex: Reach Swamp Depth 5
  - Pachycephalosaurus: Win 10 encounters via defensive strategy
  - Therizinosaurus: Defeat 50 enemies total
  - Parasaurolophus: Complete 10 runs
- [ ] **Starting Bonuses**
  - +5 starting HP per 10 runs completed
  - +1 starting trait slot after first victory
  - Bonus starting items after achievements
- [ ] **New Traits** - Unlock additional trait pool options
- [ ] **New Encounters** - Unlock encounter variety

### Build Diversity & Synergies

#### Build Archetypes
- [ ] **Pack Hunter** (Deinonychus-focused)
  - Traits: Pack Tactics, Alpha Status, Ambush Predator
  - Synergy: Bonus damage with multiple allies
- [ ] **Armored Juggernaut** (Ankylosaurus-focused)
  - Traits: Thick Hide, Club Tail, Regeneration
  - Synergy: Counter-attack chains
- [ ] **Glass Cannon** (High risk/reward)
  - Traits: Sharp Claws, Hollow Bones, Predator's Instinct
  - Synergy: Critical hit stacking
- [ ] **Survivor** (Defensive/sustain)
  - Traits: Extinction Survivor, Scavenger, Regeneration
  - Synergy: Self-healing loops
- [ ] **Controller** (Debuff-focused)
  - Traits: Venomous, Intimidating Display, Ancient Wisdom
  - Synergy: Status effect combos

#### Synergy Implementation
- [ ] Create trait tagging system (offensive, defensive, support, special)
- [ ] Implement synergy bonuses when traits from same category combine
- [ ] Add visual indicator for active synergies
- [ ] Balance synergy power levels

### Daily Challenges

- [ ] **Daily Seed System**
  - Fixed seed generated daily
  - Same encounters for all players
  - Tracked completion status
- [ ] **Challenge Modifiers**
  - Increased enemy speed
  - Resource scarcity
  - One-hit mode
  - Trait restrictions
- [ ] **Leaderboard Integration**
  - Local leaderboard (localStorage)
  - Optional: Cloud leaderboard
  - Display: Time, score, dinosaur used

### Achievement System

#### Combat Achievements
- [ ] "First Blood" - Win first combat encounter
- [ ] "Extinction Event" - Defeat 100 enemies total
- [ ] "Perfect Victory" - Win combat without taking damage
- [ ] "Comeback Kid" - Win at less than 10% HP
- [ ] "Speed Run" - Complete encounter in under 5 turns

#### Progression Achievements
- [ ] "Survivor" - Complete first run
- [ ] "Paleontologist" - Discover all codex entries
- [ ] "Collector" - Find all egg types
- [ ] "Master of Evolution" - Unlock all dinosaurs
- [ ] "Trait Hunter" - Acquire 30 different traits across runs

#### Special Achievements
- [ ] "Darwin Award" - Die to same species 3 times
- [ ] "Against All Odds" - Defeat boss with starter dinosaur
- [ ] "Speedster" - Complete run in under 15 minutes
- [ ] "Pacifist Route" - Avoid 5 combat encounters in one run

### Quality of Life Features

- [ ] **Quick Restart** - Restart run from death screen
- [ ] **Run History** - View past run summaries
- [ ] **Stats Tracking** - Total kills, deaths, runs, time played
- [ ] **Skip Tutorial** - Option after first completion
- [ ] **Pause Menu Improvements** - Settings, trait view, codex access
- [ ] **Auto-Save Indicators** - Visual confirmation of saves
- [ ] **Undo/Confirm** - Confirmation for important choices

---

## 🏗️ Implementation Details

### Data Structures

```typescript
interface MetaProgress {
  fossilFragments: number;
  researchPoints: number;
  unlockedDinosaurs: DinosaurId[];
  unlockedTraits: TraitId[];
  unlockedEncounters: EncounterId[];
  eggsCollected: EggId[];
  achievements: Achievement[];
  statistics: GameStatistics;
  dailyChallenges: {
    completed: string[]; // Date strings
    bestScores: Record<string, number>;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}

interface GameStatistics {
  totalRuns: number;
  victories: number;
  totalDeaths: number;
  enemiesDefeated: number;
  bossesDefeated: number;
  totalPlayTime: number;
  favoritedinosaur: DinosaurId;
  longestRun: number;
  fastestVictory: number;
}
```

### File Changes Required

| File | Changes |
|------|---------|
| `src/managers/MetaProgressionManager.ts` | Create new file |
| `src/types/Meta.types.ts` | Add meta-progression types |
| `src/data/achievements.json` | Achievement definitions |
| `src/data/unlocks.json` | Unlock requirements |
| `src/scenes/AchievementsScene.ts` | Achievement display |
| `src/scenes/StatsScene.ts` | Statistics display |
| `src/scenes/DailyChallengeScene.ts` | Daily challenge UI |

---

## ✅ Acceptance Criteria

- [ ] Meta-currency persists between runs and browser sessions
- [ ] At least 4 distinct build archetypes are viable
- [ ] Daily challenge generates same content for same day
- [ ] 20+ achievements with progress tracking
- [ ] Run history shows last 10 runs minimum
- [ ] All QoL features functional and tested

---

## 🎮 Player Experience Goals

1. **First Run**: Player understands basic loop, earns first currency
2. **10 Runs**: Player has unlocked at least 1 new dinosaur, sees progression
3. **25 Runs**: Multiple build paths discovered, meaningful choices
4. **50 Runs**: Deep engagement with synergies, achievement hunting
5. **100+ Runs**: Mastery, daily challenges, completionist goals

---

## 📊 Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Fossil Fragments | High | Medium | P1 |
| Dinosaur Unlocks | High | Medium | P1 |
| Trait Synergies | High | High | P1 |
| Achievements | Medium | Medium | P2 |
| Daily Challenges | Medium | High | P2 |
| Leaderboards | Low | High | P3 |
| Cloud Sync | Low | High | P4 |

---

*This sub-issue focuses on bringing PrimordialSwamp up to modern roguelite standards. Complete these features before focusing on content expansion.*
