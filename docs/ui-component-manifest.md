# UI Component & State Manifest

## Overview

This document provides a comprehensive manifest of all UI components and states in Primordial Swamp. It serves as the reference for developers and agents making UI modifications.

---

## Scene Architecture

### Scene Graph

```
BootScene ──► MenuScene ──┬──► CharacterSelectScene ──► MapScene ◄──► CombatScene
                          │                                 │
                          │                                 ▼
                          │                           RewardsScene
                          │                                 │
                          │                                 ▼
                          ├──► CodexScene               GameOverScene
                          └──► SettingsScene
```

---

## Scene Definitions

### 1. BootScene
**Purpose:** Initial loading and asset preloading
**Key:** `BootScene`
**Entry Point:** Yes
**Exit To:** `MenuScene`

| State | Description |
|-------|-------------|
| Loading | Preloading game assets |
| Ready | Assets loaded, transitioning to menu |

---

### 2. MenuScene
**Purpose:** Main menu with navigation to game features
**Key:** `MenuScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `titleText` | Text | Game title "PRIMORDIAL SWAMP" |
| `startButton` | Button | Navigate to CharacterSelectScene |
| `codexButton` | Button | Navigate to CodexScene |
| `settingsButton` | Button | Navigate to SettingsScene |
| `versionText` | Text | Version display |
| `factText` | Text | Random paleontology fact |

#### States
| State | Description |
|-------|-------------|
| Idle | Awaiting user input |
| Hovering | Button hover feedback |

---

### 3. CharacterSelectScene
**Purpose:** Dinosaur selection for new run
**Key:** `CharacterSelectScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `titleText` | Text | "SELECT YOUR DINOSAUR" |
| `dinosaurCards` | Container[] | Selection cards for available dinosaurs |
| `backButton` | Button | Return to MenuScene |
| `startButton` | Button | Begin run with selected dinosaur |

#### States
| State | Description |
|-------|-------------|
| Selection | No dinosaur selected, start disabled |
| Selected | Dinosaur chosen, start enabled |

---

### 4. MapScene
**Purpose:** Expedition map navigation and node selection
**Key:** `MapScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `headerText` | Text | "PRIMORDIAL SWAMP - EXPEDITION" |
| `statsPanel` | Container | Player status panel |
| `statsText` | Text | HP, Stamina, Depth, Fossils |
| `legendPanel` | Container | Map legend |
| `mapNodes` | Container[][] | 5x3 grid of map nodes |
| `connections` | Graphics | Lines between nodes |
| `tooltip` | Container | Node hover information |
| `backButton` | Button | Return to menu |

#### Node Types
| Type | Icon | Color | Description |
|------|------|-------|-------------|
| COMBAT | ⚔ | 0x4a9d5f | Standard combat encounter |
| RESOURCE | 🌿 | 0x5f9d4a | Resource gathering |
| EVENT | ❓ | 0x9d7a4a | Random event |
| ELITE | 💀 | 0x9d4a4a | Elite combat encounter |
| REST | 🔥 | 0x4a7a9d | Rest and heal |
| BOSS | 👑 | 0x9d4a9d | Boss encounter |

#### States
| State | Description |
|-------|-------------|
| Exploring | Selecting next node |
| NodeSelected | Node chosen, processing encounter |

---

### 5. CombatScene
**Purpose:** Turn-based combat interface
**Key:** `CombatScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `headerText` | Text | "⚔ COMBAT ENCOUNTER ⚔" |
| `playerSprite` | Text/Sprite | Player dinosaur visual |
| `enemySprite` | Text/Sprite | Enemy dinosaur visual |
| `playerHealthBar` | Container | Player HP display |
| `enemyHealthBar` | Container | Enemy HP display |
| `playerStaminaBar` | Container | Player stamina display |
| `playerStatusText` | Text | Active status effects |
| `enemyStatusText` | Text | Enemy status effects |
| `actionButtons` | Button[] | ATTACK, DEFEND, ABILITY, FLEE |
| `combatLog` | Container | Battle log display |
| `turnText` | Text | Current turn indicator |

#### Action Buttons
| Button | Icon | Description |
|--------|------|-------------|
| Attack | ⚔ | Basic attack (10 stamina) |
| Defend | 🛡 | Defensive stance (+5 DEF) |
| Ability | ✨ | Special ability (30 stamina) |
| Flee | 🏃 | Attempt escape |

#### States
| State | Description |
|-------|-------------|
| PlayerTurn | Awaiting player action |
| EnemyTurn | Processing enemy action |
| Animating | Playing attack/effect animation |
| Victory | Combat won |
| Defeat | Combat lost |

---

### 6. RewardsScene
**Purpose:** Post-combat reward display
**Key:** `RewardsScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `bannerText` | Text | "🏆 VICTORY! 🏆" |
| `defeatedText` | Text | Enemy defeated message |
| `rewardsPanel` | Container | Rewards summary |
| `continueButton` | Button | Return to MapScene |
| `factText` | Text | Random paleontology fact |

---

### 7. GameOverScene
**Purpose:** Run failure summary
**Key:** `GameOverScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `bannerText` | Text | "💀 EXPEDITION FAILED 💀" |
| `causeText` | Text | Defeat cause message |
| `summaryPanel` | Container | Run statistics |
| `tryAgainButton` | Button | New run |
| `menuButton` | Button | Return to menu |
| `factText` | Text | Extinction fact |

---

### 8. CodexScene
**Purpose:** Paleontological encyclopedia
**Key:** `CodexScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `headerText` | Text | "PALEONTOLOGICAL CODEX" |
| `progressText` | Text | Discovery progress |
| `enemyList` | Container[] | List of discovered entries |
| `detailsPanel` | Container | Selected entry details |
| `backButton` | Button | Return to menu |

#### States
| State | Description |
|-------|-------------|
| Browsing | No entry selected |
| Viewing | Entry selected, showing details |
| Locked | Viewing undiscovered entry |

---

### 9. SettingsScene
**Purpose:** Game configuration and accessibility options
**Key:** `SettingsScene`

#### Components
| Component | Type | Description |
|-----------|------|-------------|
| `headerText` | Text | "⚙ SETTINGS" |
| `audioPanel` | Container | Audio settings |
| `accessibilityPanel` | Container | Accessibility options |
| `backButton` | Button | Return to menu (with save) |

#### Settings Controls
| Control | Type | Key | Range |
|---------|------|-----|-------|
| Master Volume | Slider | `masterVolume` | 0-1 |
| Music Volume | Slider | `musicVolume` | 0-1 |
| SFX Volume | Slider | `sfxVolume` | 0-1 |
| High Contrast | Toggle | `highContrast` | boolean |
| Reduced Motion | Toggle | `reducedMotion` | boolean |

---

## Common UI Patterns

### Button Component
```typescript
// Standard button creation pattern
const button = scene.add.text(x, y, text, {
  fontSize: '24px',
  color: '#4a9d5f',           // PRIMARY color
  fontFamily: 'Courier New, monospace',
  backgroundColor: '#2a2a2a', // TEXT_DARK color
  padding: { x: 20, y: 10 }
}).setOrigin(0.5).setInteractive({ useHandCursor: true });

// Hover states
button.on('pointerover', () => {
  button.setColor('#ffffff');
  button.setBackgroundColor('#4a9d5f');
});

button.on('pointerout', () => {
  button.setColor('#4a9d5f');
  button.setBackgroundColor('#2a2a2a');
});
```

### Health Bar Component
```typescript
// Health bar structure
const barWidth = 200;
const barHeight = 20;

// Background track
const bg = scene.add.rectangle(x, y, barWidth, barHeight, 0x2a2a2a);
bg.setStrokeStyle(2, 0x4a9d5f);

// Fill (dynamic width based on HP percentage)
const fillWidth = (current / max) * barWidth;
const fill = scene.add.rectangle(
  x - barWidth / 2 + fillWidth / 2,
  y,
  fillWidth,
  barHeight - 4,
  0x4a9d5f  // Player: green, Enemy: red (0xd94a3d)
);

// Text overlay
const text = scene.add.text(x, y, `${current}/${max}`, {
  fontSize: '14px',
  color: '#ffffff',
  fontFamily: 'Courier New, monospace'
}).setOrigin(0.5);
```

### Panel Component
```typescript
// Standard panel structure
const panelWidth = 400;
const panelHeight = 300;

// Panel background
const bg = scene.add.rectangle(x, y + panelHeight / 2, panelWidth, panelHeight, 0x2a2a2a)
  .setStrokeStyle(2, 0x4a9d5f);

// Panel title
scene.add.text(x, y + 30, 'PANEL TITLE', {
  fontSize: '24px',
  color: '#4a9d5f',
  fontFamily: 'Courier New, monospace',
  fontStyle: 'bold'
}).setOrigin(0.5);
```

---

## State Management

### GameStateManager Singleton
The `GameStateManager` class provides centralized state management:

| Method | Description |
|--------|-------------|
| `startNewRun(dinosaur, seed)` | Initialize new run |
| `getCurrentRun()` | Get current run state |
| `updatePlayerStats(hp, stamina)` | Update player stats |
| `updateResources(amount)` | Add fossils |
| `visitNode(nodeId)` | Mark node as visited |
| `endRun(victory)` | Complete run |
| `getSettings()` | Get current settings |
| `saveState()` | Persist to localStorage |

### Run State Structure
```typescript
interface CurrentRunState {
  seed: string;
  dinosaur: DinosaurType;
  currentNodeId: string;
  nodesVisited: string[];
  mapNodes: MapNode[][];
  health: number;
  stamina: number;
  traits: string[];
  inventory: string[];
  biome: BiomeType;
  depth: number;
  fossilsCollected: number;
  combatsWon: number;
  startTime: number;
}
```

---

## Accessibility Considerations

### Current Implementation
- High Contrast mode toggle
- Reduced Motion toggle
- Volume controls

### Recommended Additions
- Color blind modes (Deuteranopia, Protanopia, Tritanopia)
- UI scaling (100%, 125%, 150%, 200%)
- Keyboard navigation support
- Screen reader compatibility
- Adjustable text size

---

## Agent Integration Points

### Configuration Files
- `src/utils/Constants.ts` - Game constants and color palette
- `src/config/design-system.json` - Design system tokens (NEW)
- `src/config/ui-settings.json` - Default UI settings (NEW)

### Key Extension Points
1. **New Scene Addition:**
   - Create scene file in `src/scenes/`
   - Add to scene array in `src/main.ts`
   - Add scene key to `SCENE_KEYS` in Constants

2. **New UI Component:**
   - Follow existing patterns in scene files
   - Use color constants from `GAME_CONFIG.COLORS`
   - Implement hover/focus states for interactivity

3. **Settings Modification:**
   - Update `SettingsScene.ts` for UI
   - Update `GameStateManager.ts` for persistence
   - Update types in `GameState.types.ts`

---

*Last updated: Auto-generated by Primordial Swamp development*
