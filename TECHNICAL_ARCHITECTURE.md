# Primordial Swamp - Technical Architecture

## Technology Stack

### Core Technologies
- **Game Engine**: Phaser 3.60+ (WebGL renderer)
- **Language**: TypeScript 5.0+
- **Build Tool**: Vite 5.0
- **Package Manager**: npm/pnpm
- **State Management**: Custom ECS pattern
- **Data Format**: JSON5 for configuration

### Development Tools
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Testing**: Vitest + Playwright (E2E)
- **Version Control**: Git
- **Asset Pipeline**: TexturePacker, Aseprite exports

### Deployment
- **Hosting**: Static site hosting (Netlify/Vercel/GitHub Pages)
- **Analytics**: Privacy-friendly (Plausible)
- **Error Tracking**: Sentry (optional)

---

## Project Structure

```
primordial-swamp/
├── public/
│   ├── assets/
│   │   ├── sprites/
│   │   │   ├── dinosaurs/
│   │   │   │   ├── deinonychus.png
│   │   │   │   ├── ankylosaurus.png
│   │   │   │   └── pteranodon.png
│   │   │   ├── enemies/
│   │   │   ├── environment/
│   │   │   └── ui/
│   │   ├── audio/
│   │   │   ├── music/
│   │   │   ├── sfx/
│   │   │   └── ambient/
│   │   └── fonts/
│   └── index.html
├── src/
│   ├── main.ts                 # Entry point
│   ├── game.ts                 # Phaser game config
│   │
│   ├── scenes/
│   │   ├── BootScene.ts        # Asset loading
│   │   ├── MenuScene.ts        # Main menu
│   │   ├── CharacterSelectScene.ts
│   │   ├── MapScene.ts         # Node selection map
│   │   ├── CombatScene.ts      # Turn-based combat
│   │   ├── EncounterScene.ts   # Non-combat events
│   │   ├── RewardsScene.ts     # Post-encounter rewards
│   │   ├── CodexScene.ts       # Educational database
│   │   ├── GameOverScene.ts    # Death/Victory screens
│   │   └── SettingsScene.ts
│   │
│   ├── entities/
│   │   ├── Entity.ts           # Base entity class
│   │   ├── Dinosaur.ts         # Player dinosaur
│   │   ├── Enemy.ts            # Enemy creatures
│   │   └── EntityFactory.ts    # Creation patterns
│   │
│   ├── components/
│   │   ├── Component.ts        # Base component
│   │   ├── StatsComponent.ts   # HP, ATK, DEF, etc.
│   │   ├── AbilitiesComponent.ts
│   │   ├── TraitsComponent.ts
│   │   ├── StatusEffectsComponent.ts
│   │   ├── SpriteComponent.ts
│   │   └── AIComponent.ts
│   │
│   ├── systems/
│   │   ├── CombatSystem.ts     # Combat resolution
│   │   ├── TurnSystem.ts       # Initiative & turn order
│   │   ├── DamageSystem.ts     # Damage calculations
│   │   ├── StatusEffectSystem.ts
│   │   ├── ProgressionSystem.ts # Level up & traits
│   │   ├── EncounterManager.ts # Procedural encounters
│   │   ├── MapGenerator.ts     # Node graph generation
│   │   └── SaveSystem.ts       # Persistence
│   │
│   ├── managers/
│   │   ├── GameStateManager.ts # Global state
│   │   ├── ResourceManager.ts  # Asset caching
│   │   ├── AudioManager.ts     # Sound control
│   │   └── MetaProgressionManager.ts
│   │
│   ├── ui/
│   │   ├── components/
│   │   │   ├── HealthBar.ts
│   │   │   ├── StaminaBar.ts
│   │   │   ├── StatsPanel.ts
│   │   │   ├── ActionButton.ts
│   │   │   ├── MapNode.ts
│   │   │   ├── TraitCard.ts
│   │   │   └── CodexEntry.ts
│   │   └── layouts/
│   │       ├── CombatUI.ts
│   │       ├── MapUI.ts
│   │       └── MenuUI.ts
│   │
│   ├── data/
│   │   ├── dinosaurs.json      # Player dino specs
│   │   ├── enemies.json        # Enemy database
│   │   ├── abilities.json      # All abilities
│   │   ├── traits.json         # Passive buffs
│   │   ├── encounters.json     # Event templates
│   │   ├── biomes.json         # Environment data
│   │   ├── educational.json    # Facts & codex
│   │   └── config.json         # Game constants
│   │
│   ├── types/
│   │   ├── Dinosaur.types.ts
│   │   ├── Combat.types.ts
│   │   ├── Encounter.types.ts
│   │   ├── Stats.types.ts
│   │   └── GameState.types.ts
│   │
│   └── utils/
│       ├── Random.ts           # Seeded PRNG
│       ├── Math.ts             # Game math helpers
│       ├── Combat.ts           # Combat calculations
│       ├── Persistence.ts      # LocalStorage wrapper
│       ├── Loader.ts           # Asset loading
│       └── Constants.ts        # Magic numbers
│
├── tests/
│   ├── unit/
│   │   ├── combat.test.ts
│   │   ├── damage.test.ts
│   │   └── progression.test.ts
│   └── e2e/
│       └── gameplay.spec.ts
│
├── docs/
│   ├── GAME_DESIGN.md
│   ├── TECHNICAL_ARCHITECTURE.md (this file)
│   ├── API.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

---

## Core Systems Architecture

### 1. Entity Component System (ECS)

```typescript
// Lightweight ECS implementation

class Entity {
  id: string;
  components: Map<string, Component>;
  
  addComponent(component: Component): void
  getComponent<T extends Component>(type: ComponentType): T
  removeComponent(type: ComponentType): void
  hasComponent(type: ComponentType): boolean
}

class Component {
  entity: Entity;
  enabled: boolean;
}

// Example Usage:
const deinonychus = new Entity();
deinonychus.addComponent(new StatsComponent({
  health: 60,
  attack: 8,
  defense: 3,
  speed: 9
}));
deinonychus.addComponent(new AbilitiesComponent([
  'sickle_claw',
  'pack_coordination'
]));
```

### 2. Game State Management

```typescript
interface GameState {
  // Run-specific state
  currentRun: {
    dinosaur: DinosaurType;
    currentNode: number;
    nodesVisited: Node[];
    health: number;
    stamina: number;
    traits: Trait[];
    inventory: Item[];
    biome: BiomeType;
    depth: number;
  };
  
  // Meta-progression
  metaProgress: {
    fossilFragments: number;
    unlockedDinosaurs: DinosaurType[];
    unlockedTraits: string[];
    codexEntries: CodexEntry[];
    achievements: Achievement[];
    totalRuns: number;
    victories: number;
  };
  
  // Settings
  settings: {
    volume: number;
    musicVolume: number;
    sfxVolume: number;
    accessibility: AccessibilityOptions;
  };
}

class GameStateManager {
  private state: GameState;
  
  // Singleton pattern
  static getInstance(): GameStateManager
  
  // Run management
  startNewRun(dinosaur: DinosaurType): void
  endRun(victory: boolean): void
  saveRun(): void
  loadRun(): boolean
  
  // Meta-progression
  addFossilFragments(amount: number): void
  unlockDinosaur(type: DinosaurType): void
  addCodexEntry(entry: CodexEntry): void
  
  // State queries
  canAfford(cost: number): boolean
  isUnlocked(dinosaur: DinosaurType): boolean
}
```

### 3. Combat System

```typescript
class CombatSystem {
  private turnQueue: Entity[];
  private currentTurn: number;
  
  // Combat flow
  initializeCombat(player: Entity, enemies: Entity[]): void {
    // 1. Build initiative queue
    this.turnQueue = this.buildInitiativeQueue([player, ...enemies]);
    
    // 2. Apply pre-combat effects
    this.applyPreCombatEffects();
    
    // 3. Start first turn
    this.startTurn();
  }
  
  buildInitiativeQueue(combatants: Entity[]): Entity[] {
    return combatants.sort((a, b) => {
      const speedA = a.getComponent(StatsComponent).speed;
      const speedB = b.getComponent(StatsComponent).speed;
      return speedB - speedA; // Higher speed goes first
    });
  }
  
  executeAction(actor: Entity, action: Action, target: Entity): void {
    // 1. Check stamina cost
    const stats = actor.getComponent(StatsComponent);
    if (stats.stamina < action.staminaCost) {
      return; // Cannot afford
    }
    
    // 2. Consume stamina
    stats.stamina -= action.staminaCost;
    
    // 3. Calculate damage/effects
    const result = this.calculateActionResult(actor, action, target);
    
    // 4. Apply effects
    this.applyActionResult(target, result);
    
    // 5. Trigger reactions (counters, etc.)
    this.processReactions(actor, target, result);
    
    // 6. Check for victory/defeat
    if (this.checkCombatEnd()) {
      this.endCombat();
    } else {
      this.nextTurn();
    }
  }
  
  calculateActionResult(
    attacker: Entity, 
    action: Action, 
    defender: Entity
  ): ActionResult {
    const attackerStats = attacker.getComponent(StatsComponent);
    const defenderStats = defender.getComponent(StatsComponent);
    
    // Base damage
    let damage = attackerStats.attack * action.damageMultiplier;
    
    // Apply traits/abilities
    damage = this.applyDamageModifiers(attacker, damage, action);
    
    // Check for critical hit
    if (this.rollCritical(attacker)) {
      damage *= 2;
    }
    
    // Check for evasion
    if (this.rollEvasion(defender)) {
      damage = 0;
    }
    
    // Apply defense
    damage = Math.max(0, damage - defenderStats.defense);
    
    return {
      damage,
      statusEffects: action.statusEffects,
      critical: damage > attackerStats.attack * 1.5
    };
  }
  
  // AI decision making
  selectAIAction(enemy: Entity, player: Entity): Action {
    const ai = enemy.getComponent(AIComponent);
    const stats = enemy.getComponent(StatsComponent);
    
    // Behavior tree
    if (stats.health < stats.maxHealth * 0.3) {
      return ai.lowHealthBehavior(player);
    }
    
    if (stats.stamina > 50) {
      return ai.selectBestAbility(player);
    }
    
    return ai.basicAttack();
  }
}
```

### 4. Encounter Generation

```typescript
class EncounterManager {
  private rng: SeededRandom;
  
  generateMap(seed: string, depth: number): MapNode[] {
    this.rng = new SeededRandom(seed);
    
    const nodes: MapNode[] = [];
    const nodeCount = 15 + depth * 2; // Scales with difficulty
    
    // Generate node tree
    for (let i = 0; i < nodeCount; i++) {
      const node = this.generateNode(i, depth);
      nodes.push(node);
    }
    
    // Connect nodes (branching paths)
    this.connectNodes(nodes);
    
    return nodes;
  }
  
  generateNode(position: number, depth: number): MapNode {
    // Determine node type
    const roll = this.rng.random();
    let type: NodeType;
    
    if (position % 5 === 0 && position > 0) {
      type = NodeType.ELITE; // Mini-boss every 5 nodes
    } else if (roll < 0.5) {
      type = NodeType.COMBAT;
    } else if (roll < 0.75) {
      type = NodeType.RESOURCE;
    } else if (roll < 0.9) {
      type = NodeType.EVENT;
    } else {
      type = NodeType.SPECIAL;
    }
    
    return {
      id: `node_${position}`,
      type,
      position,
      depth,
      encounter: this.generateEncounter(type, depth)
    };
  }
  
  generateEncounter(type: NodeType, depth: number): Encounter {
    const templates = this.getEncounterTemplates(type);
    const template = this.rng.choice(templates);
    
    // Scale difficulty
    return this.scaleEncounter(template, depth);
  }
  
  scaleEncounter(template: Encounter, depth: number): Encounter {
    const multiplier = 1 + (depth * 0.15); // 15% increase per depth
    
    if (template.enemy) {
      template.enemy.stats.health *= multiplier;
      template.enemy.stats.attack *= multiplier;
      template.enemy.stats.defense *= multiplier;
    }
    
    return template;
  }
}
```

### 5. Progression System

```typescript
class ProgressionSystem {
  // Level up after combat
  awardExperience(player: Entity, enemiesDefeated: Entity[]): void {
    const stats = player.getComponent(StatsComponent);
    
    // Calculate XP
    let xp = 0;
    enemiesDefeated.forEach(enemy => {
      const enemyStats = enemy.getComponent(StatsComponent);
      xp += enemyStats.level * 10;
    });
    
    stats.experience += xp;
    
    // Check for level up
    while (stats.experience >= this.getXPForLevel(stats.level + 1)) {
      this.levelUp(player);
    }
  }
  
  levelUp(player: Entity): void {
    const stats = player.getComponent(StatsComponent);
    stats.level++;
    
    // Stat increases (species-specific)
    const growthRates = this.getGrowthRates(player.getComponent(DinosaurComponent).species);
    
    stats.maxHealth += growthRates.health;
    stats.attack += growthRates.attack;
    stats.defense += growthRates.defense;
    stats.speed += growthRates.speed;
    stats.maxStamina += growthRates.stamina;
    
    // Full heal on level up
    stats.health = stats.maxHealth;
    stats.stamina = stats.maxStamina;
    
    // Offer trait choices every 2 levels
    if (stats.level % 2 === 0) {
      this.offerTraitChoice(player);
    }
  }
  
  offerTraitChoice(player: Entity): void {
    const availableTraits = this.getAvailableTraits(player);
    const choices = this.selectRandomTraits(availableTraits, 3);
    
    // Pause game, show trait selection UI
    GameStateManager.getInstance().pauseForTraitSelection(choices);
  }
  
  applyTrait(player: Entity, trait: Trait): void {
    const traits = player.getComponent(TraitsComponent);
    traits.addTrait(trait);
    
    // Apply immediate effects
    trait.onAcquire(player);
  }
}
```

### 6. Save System

```typescript
class SaveSystem {
  private readonly CURRENT_RUN_KEY = 'primordial_swamp_current_run';
  private readonly META_PROGRESS_KEY = 'primordial_swamp_meta';
  private readonly SETTINGS_KEY = 'primordial_swamp_settings';
  
  // Auto-save after each encounter
  saveCurrentRun(state: GameState): void {
    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      data: this.serializeRunState(state.currentRun)
    };
    
    localStorage.setItem(
      this.CURRENT_RUN_KEY,
      JSON.stringify(saveData)
    );
  }
  
  loadCurrentRun(): CurrentRunState | null {
    const saved = localStorage.getItem(this.CURRENT_RUN_KEY);
    if (!saved) return null;
    
    try {
      const saveData = JSON.parse(saved);
      
      // Version check
      if (saveData.version !== '1.0.0') {
        console.warn('Incompatible save version');
        return null;
      }
      
      return this.deserializeRunState(saveData.data);
    } catch (e) {
      console.error('Failed to load save:', e);
      return null;
    }
  }
  
  clearCurrentRun(): void {
    localStorage.removeItem(this.CURRENT_RUN_KEY);
  }
  
  // Persist meta-progression
  saveMetaProgress(meta: MetaProgressState): void {
    localStorage.setItem(
      this.META_PROGRESS_KEY,
      JSON.stringify(meta)
    );
  }
  
  loadMetaProgress(): MetaProgressState {
    const saved = localStorage.getItem(this.META_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : this.getDefaultMetaProgress();
  }
  
  // Export/import for sharing
  exportSave(): string {
    const fullState = GameStateManager.getInstance().getState();
    return btoa(JSON.stringify(fullState));
  }
  
  importSave(data: string): boolean {
    try {
      const state = JSON.parse(atob(data));
      GameStateManager.getInstance().loadState(state);
      return true;
    } catch (e) {
      return false;
    }
  }
}
```

---

## Data Structures

### Dinosaur Data Schema

```typescript
interface DinosaurData {
  id: string;
  name: string;
  species: string;
  period: {
    era: string;
    period: string;
    mya: [number, number]; // [start, end] million years ago
  };
  size: {
    length: number; // meters
    height: number;
    weight: number; // kg
  };
  role: DinosaurRole;
  baseStats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    stamina: number;
  };
  growthRates: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    stamina: number;
  };
  abilities: string[]; // Ability IDs
  passives: string[]; // Passive trait IDs
  unlockCondition?: UnlockCondition;
  scientificFacts: string[];
  sprite: {
    idle: string;
    attack: string;
    hurt: string;
    death: string;
  };
}
```

### Combat Data Schema

```typescript
interface AbilityData {
  id: string;
  name: string;
  description: string;
  staminaCost: number;
  cooldown: number;
  damageMultiplier: number;
  effects: {
    type: EffectType;
    value: number;
    duration: number;
    chance: number;
  }[];
  animation: string;
  scientificNote?: string; // Educational tie-in
}

interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff';
  duration: number;
  tickDamage?: number;
  statModifiers?: {
    [stat: string]: number;
  };
  icon: string;
}
```

### Encounter Data Schema

```typescript
interface EncounterData {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  choices: {
    text: string;
    requirements?: Requirement[];
    outcomes: Outcome[];
    scientificContext?: string;
  }[];
  enemies?: EnemySpawn[];
  rewards?: Reward[];
  educationalContent?: CodexEntry;
}
```

---

## Performance Optimization

### Asset Loading Strategy

```typescript
class AssetLoader {
  // Load critical assets first
  async preloadEssentials(): Promise<void> {
    await Promise.all([
      this.loadSprite('ui/buttons'),
      this.loadSprite('dinosaurs/player_selected'),
      this.loadAudio('music/main_theme')
    ]);
  }
  
  // Lazy load non-critical assets
  async loadBiomeAssets(biome: BiomeType): Promise<void> {
    const assets = BIOME_ASSETS[biome];
    await Promise.all(assets.map(a => this.loadAsset(a)));
  }
  
  // Use sprite sheets for animations
  loadSpriteSheet(key: string): void {
    this.scene.load.atlas(
      key,
      `${key}.png`,
      `${key}.json` // TexturePacker format
    );
  }
}
```

### Memory Management

```typescript
class ResourceManager {
  private textureCache: Map<string, Phaser.Textures.Texture>;
  private maxCacheSize = 50 * 1024 * 1024; // 50MB
  
  // Clean up unused assets
  cleanup(): void {
    const currentBiome = GameStateManager.getInstance().getCurrentBiome();
    
    // Remove assets not needed for current biome
    this.textureCache.forEach((texture, key) => {
      if (!key.includes(currentBiome)) {
        texture.destroy();
        this.textureCache.delete(key);
      }
    });
  }
  
  // Monitor memory usage
  checkMemoryUsage(): void {
    const usage = this.calculateCacheSize();
    if (usage > this.maxCacheSize) {
      this.cleanup();
    }
  }
}
```

### Rendering Optimization

```typescript
// Use object pooling for frequently created/destroyed objects
class ProjectilePool {
  private pool: Phaser.GameObjects.Sprite[] = [];
  
  get(): Phaser.GameObjects.Sprite {
    return this.pool.pop() || this.create();
  }
  
  release(obj: Phaser.GameObjects.Sprite): void {
    obj.setVisible(false);
    obj.setActive(false);
    this.pool.push(obj);
  }
  
  private create(): Phaser.GameObjects.Sprite {
    return new Phaser.GameObjects.Sprite(/* ... */);
  }
}

// Limit particle effects
const maxParticles = 50;
const emitter = this.add.particles('particle').createEmitter({
  maxParticles,
  lifespan: 1000,
  speed: { min: 100, max: 200 }
});
```

---

## Testing Strategy

### Unit Tests

```typescript
// Example: Combat damage calculation test
describe('DamageSystem', () => {
  it('should calculate base damage correctly', () => {
    const attacker = createTestDinosaur({ attack: 10 });
    const defender = createTestDinosaur({ defense: 3 });
    
    const damage = DamageSystem.calculateDamage(attacker, defender);
    
    expect(damage).toBe(7); // 10 - 3
  });
  
  it('should apply critical hit multiplier', () => {
    const attacker = createTestDinosaur({ attack: 10 });
    const defender = createTestDinosaur({ defense: 0 });
    
    const damage = DamageSystem.calculateDamage(
      attacker, 
      defender, 
      { critical: true }
    );
    
    expect(damage).toBe(20); // 10 * 2
  });
});
```

### Integration Tests

```typescript
describe('Combat Flow', () => {
  it('should complete a full combat encounter', () => {
    const combat = new CombatSystem();
    const player = createTestDinosaur({ health: 100 });
    const enemy = createTestEnemy({ health: 50 });
    
    combat.initializeCombat(player, [enemy]);
    
    // Simulate combat rounds
    while (!combat.isFinished()) {
      const action = combat.getCurrentActor() === player 
        ? selectPlayerAction() 
        : combat.selectAIAction();
      
      combat.executeAction(action);
    }
    
    expect(combat.getVictor()).toBe(player);
  });
});
```

### E2E Tests (Playwright)

```typescript
test('complete a full run', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Select dinosaur
  await page.click('[data-testid="deinonychus-select"]');
  await page.click('[data-testid="start-run"]');
  
  // Navigate first node
  await page.click('[data-testid="map-node-1"]');
  
  // Complete combat
  await page.click('[data-testid="attack-button"]');
  await page.waitForSelector('[data-testid="victory-screen"]');
  
  // Check rewards
  const fossils = await page.textContent('[data-testid="fossil-count"]');
  expect(parseInt(fossils)).toBeGreaterThan(0);
});
```

---

## Build Configuration

### Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          phaser: ['phaser'],
          vendor: ['lodash', 'uuid']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true // Remove console.logs in production
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'public/assets'),
      '@data': resolve(__dirname, 'src/data')
    }
  }
});
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@assets/*": ["public/assets/*"],
      "@data/*": ["src/data/*"]
    },
    "types": ["vite/client", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Deployment Checklist

- [ ] Minify and bundle assets
- [ ] Remove console.logs
- [ ] Compress textures (use WebP where supported)
- [ ] Enable gzip/brotli compression
- [ ] Set up CDN for assets
- [ ] Add loading screen with progress bar
- [ ] Test on mobile devices
- [ ] Add analytics (privacy-friendly)
- [ ] Set up error tracking
- [ ] Add service worker for offline play (PWA)

---

## Security Considerations

### Client-Side Storage
- Never store sensitive data in localStorage
- Validate all loaded save data
- Handle corrupted saves gracefully

### Input Validation
- Sanitize all user input (name entry, etc.)
- Prevent XSS in codex/text displays

### Asset Integrity
- Use Subresource Integrity (SRI) for external scripts
- Validate asset checksums on load

---

## Accessibility Features

### Visual
- High contrast mode
- Colorblind-friendly palette options
- Adjustable UI scaling (100%, 125%, 150%)
- Screen reader support for text

### Audio
- Independent volume controls (music, SFX, ambient)
- Visual indicators for audio cues
- Closed captions for narration

### Input
- Keyboard-only navigation
- Gamepad support
- Customizable key bindings
- Auto-pause on focus loss

### Cognitive
- Simplified UI mode
- Slower combat speed option
- Tutorial that can be replayed
- Glossary for terms

---

## Monitoring & Analytics

### Metrics to Track
- Average run duration
- Most played dinosaur
- Most common death causes
- Encounter completion rates
- Codex entry discovery rate
- Meta-progression unlock speed

### Performance Metrics
- FPS (target: 60)
- Load times
- Memory usage
- Asset loading failures
- Save/load errors

---

## Future Technical Improvements

### Phase 2
- WebGL shaders for visual effects
- Procedural audio for dinosaur calls
- Advanced particle systems
- Mod support via plugin system

### Phase 3
- Multiplayer infrastructure (WebRTC)
- Server-side leaderboards
- Cloud save sync
- Mobile app (Capacitor/React Native)

### Phase 4
- VR support (WebXR)
- Procedural animation blending
- Advanced AI (ML-based enemy behavior)
- User-generated content platform

---

## Conclusion

This architecture provides a solid foundation for building Primordial Swamp with modern web technologies. The modular design allows for iterative development, easy testing, and future extensibility. The ECS pattern keeps game logic clean and performant, while the data-driven approach makes balancing and content creation straightforward.

The technical stack (Phaser 3 + TypeScript + Vite) offers excellent developer experience with fast iteration times and strong typing, critical for managing a complex game codebase.
