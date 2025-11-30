# UI/UX Upgrades

## 🎯 Objective

Improve user interface and user experience to meet modern roguelite standards, ensure accessibility, and create a polished, intuitive experience.

---

## 📋 Feature Checklist

### Combat UI Polish

#### Health & Status Display
- [ ] **Enhanced Health Bar**
  - Segmented display for better readability
  - Damage preview on hover
  - Healing visualization (green flash)
  - Critical HP warning (red pulse)
  - Shield/armor overlay indicator
- [ ] **Stamina Bar Improvements**
  - Cost preview before action
  - Regeneration visualization
  - Exhaustion warning
- [ ] **Status Effect Display**
  - Clear icon grid above health
  - Duration counters on effects
  - Tooltip on hover/tap
  - Stack count for stackable effects
  - Visual pulse for expiring effects

#### Action Interface
- [ ] **Smart Action Buttons**
  - Disabled state for unaffordable actions
  - Stamina cost displayed on button
  - Cooldown overlay for abilities
  - Keyboard shortcut hints
  - Quick info tooltip on hover
- [ ] **Target Selection**
  - Clear highlight on targetable enemies
  - Damage preview on target
  - Multi-target visualization for AoE
  - Cancel option always visible

#### Combat Log
- [ ] **Enhanced Log Display**
  - Color-coded entries (damage, heal, status)
  - Collapsible detailed entries
  - Turn separators
  - Scrollable history
  - Damage numbers with icons
- [ ] **Combat Summary**
  - Post-combat statistics
  - XP gained display
  - Loot received
  - Educational fact popup

### Map Navigation Improvements

#### Map Display
- [ ] **Node Visualization**
  - Clear icon per encounter type
  - Completed/current/upcoming states
  - Locked nodes (unreachable paths)
  - Boss node special treatment
  - Elite node warning glow
- [ ] **Path Display**
  - Clear connection lines
  - Traversed path highlight
  - Multiple choice indicators
  - Dead end warnings (optional)
- [ ] **Information Panel**
  - Encounter preview on selection
  - Risk/reward indication
  - Biome progress bar
  - Player status summary

#### Navigation Controls
- [ ] **Input Methods**
  - Click to select node
  - Click again to confirm
  - Keyboard navigation (arrow keys + enter)
  - Touch-friendly large tap targets
- [ ] **Confirmation Dialogs**
  - "Are you sure?" for boss nodes
  - Point of no return warnings
  - Exit confirmation

### Inventory & Stats Displays

#### Character Stats Panel
- [ ] **Stats Overview**
  - All stats with icons
  - Bonus breakdowns on hover
  - Comparison with base values
  - Growth trend indicators
- [ ] **Equipment/Trait View**
  - Grid of active traits
  - Slot visualization
  - Synergy indicators
  - Empty slot prompts

#### Inventory System
- [ ] **Item Grid**
  - Clear item icons
  - Stack counts
  - Rarity indicators
  - Quick use option
- [ ] **Item Details**
  - Name and description
  - Effect preview
  - Use restrictions

### Tutorial System

#### First-Time User Experience
- [ ] **Welcome Sequence**
  - Game concept introduction
  - Dinosaur selection tutorial
  - Basic controls overview
- [ ] **Combat Tutorial**
  - Guided first battle
  - Action explanations
  - Status effect introduction
  - Victory/defeat handling
- [ ] **Map Tutorial**
  - Node selection guide
  - Encounter type explanations
  - Path choice importance

#### Progressive Disclosure
- [ ] **Contextual Tips**
  - First-time feature highlights
  - Subtle hint system
  - Dismissable tip panels
  - "Don't show again" option
- [ ] **Help System**
  - In-game manual
  - Searchable help topics
  - Video tutorials (optional)

### Accessibility Features

#### Visual Accessibility
- [ ] **Color Blind Modes**
  - Deuteranopia (red-green)
  - Protanopia (red weakness)
  - Tritanopia (blue-yellow)
  - Patterns/shapes for color-coded info
- [ ] **UI Scaling**
  - 100%, 125%, 150%, 200% options
  - Responsive layouts
  - Readable fonts at all sizes
- [ ] **High Contrast Mode**
  - Enhanced borders
  - Stronger text contrast
  - Reduced visual noise

#### Audio Accessibility
- [ ] **Volume Controls**
  - Master volume
  - Music volume
  - SFX volume
  - Ambient volume
  - Mute toggles
- [ ] **Visual Audio Cues**
  - Screen flash for important sounds
  - Subtitle/caption system
  - Visual combat feedback

#### Motor Accessibility
- [ ] **Keyboard Navigation**
  - Full keyboard control
  - Tab order optimization
  - Focus indicators
  - Shortcut customization
- [ ] **Input Flexibility**
  - Adjustable hold/tap times
  - Auto-repeat prevention
  - Large click/touch targets
  - No time-critical inputs

#### Cognitive Accessibility
- [ ] **Simplified Mode**
  - Reduced UI complexity
  - Essential info only
  - Larger text options
- [ ] **Combat Speed**
  - Adjustable animation speed
  - Pause between turns
  - Extended decision time
- [ ] **Information Retention**
  - Persistent tooltips
  - Recap summaries
  - Session notes

---

## 🏗️ Implementation Details

### UI Component Architecture

```typescript
// Base UI component with accessibility
interface AccessibleUIComponent {
  // Core properties
  id: string;
  label: string;
  description?: string;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
  focusable: boolean;
  
  // Scaling
  scale: number;
  minScale: number;
  maxScale: number;
  
  // Color modes
  colorMode: 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'high-contrast';
  
  // Input
  keyboardShortcut?: string;
  touchTargetSize: number;
}

// Settings structure
interface AccessibilitySettings {
  visual: {
    colorBlindMode: ColorBlindMode;
    highContrast: boolean;
    uiScale: number;
    reduceMotion: boolean;
    screenFlashes: boolean;
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    subtitles: boolean;
    visualAudioCues: boolean;
  };
  motor: {
    holdTime: number;
    doubleTapPrevention: number;
    keyRepeatDelay: number;
  };
  cognitive: {
    simplifiedMode: boolean;
    combatSpeed: number;
    pauseBetweenTurns: boolean;
    extendedTooltips: boolean;
  };
}
```

### File Changes Required

| File | Changes |
|------|---------|
| `src/ui/components/HealthBar.ts` | Enhanced display |
| `src/ui/components/StaminaBar.ts` | Cost preview |
| `src/ui/components/StatusEffects.ts` | New component |
| `src/ui/components/ActionButton.ts` | Disabled states, tooltips |
| `src/ui/components/CombatLog.ts` | Enhanced log |
| `src/ui/components/MapNode.ts` | Improved visuals |
| `src/ui/layouts/CombatUI.ts` | Layout improvements |
| `src/ui/layouts/MapUI.ts` | Layout improvements |
| `src/managers/AccessibilityManager.ts` | New file |
| `src/scenes/TutorialScene.ts` | Tutorial implementation |
| `src/scenes/SettingsScene.ts` | Expanded settings |

---

## 🎨 Design Guidelines

### Color Palette

```css
/* Primary Colors */
--color-primary: #4a7c59;     /* Forest green */
--color-secondary: #8b4513;   /* Earth brown */
--color-accent: #d4a574;      /* Warm sand */

/* Semantic Colors */
--color-health: #e63946;      /* Red */
--color-stamina: #457b9d;     /* Blue */
--color-damage: #ff6b6b;      /* Light red */
--color-heal: #51cf66;        /* Green */
--color-buff: #ffd43b;        /* Yellow */
--color-debuff: #845ef7;      /* Purple */

/* UI Colors */
--color-background: #1a1a1a;
--color-panel: #2d2d2d;
--color-text: #f0f0f0;
--color-text-muted: #a0a0a0;
--color-border: #4a4a4a;
```

### Typography

- **Headers**: Pixel font, 24-32px
- **Body**: Clean pixel font, 16-18px
- **UI Labels**: Small pixel font, 12-14px
- **Numbers**: Monospace for alignment

### Spacing

- **Base unit**: 8px
- **Small gap**: 8px
- **Medium gap**: 16px
- **Large gap**: 24px
- **Section gap**: 32px

---

## ✅ Acceptance Criteria

- [ ] All UI elements have keyboard navigation
- [ ] Color blind modes fully functional
- [ ] UI scales correctly from 100% to 200%
- [ ] Tutorial completes successfully for new users
- [ ] All interactive elements have hover/focus states
- [ ] Touch targets are at least 44x44 pixels
- [ ] No critical information relies solely on color

---

## 🧪 Testing Requirements

### Accessibility Testing
- [ ] Screen reader compatibility (NVDA/VoiceOver)
- [ ] Keyboard-only navigation test
- [ ] Color contrast ratio check (WCAG 2.1 AA)
- [ ] Touch target size verification
- [ ] Focus order logic

### Usability Testing
- [ ] First-time user completion rate
- [ ] Tutorial completion rate
- [ ] Settings discoverability
- [ ] Error recovery paths

---

## 📊 Priority Matrix

| Feature | User Impact | Effort | Priority |
|---------|------------|--------|----------|
| Health/Stamina Display | High | Medium | P1 |
| Action Button States | High | Low | P1 |
| Combat Log Enhancement | Medium | Medium | P1 |
| Tutorial System | High | High | P1 |
| Keyboard Navigation | High | Medium | P2 |
| Color Blind Modes | Medium | Medium | P2 |
| UI Scaling | Medium | Medium | P2 |
| Settings Expansion | Medium | Low | P2 |
| Screen Reader Support | Low | High | P3 |
| Simplified Mode | Low | Medium | P3 |

---

*This sub-issue ensures PrimordialSwamp is accessible to all players and provides a polished, intuitive experience.*
