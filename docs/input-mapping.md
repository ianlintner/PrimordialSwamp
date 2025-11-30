# Input Mapping & Controls

## Overview

This document defines the input mapping system for Primordial Swamp, supporting keyboard, mouse, and future gamepad controls.

---

## Keyboard Controls

### Combat Actions

| Action | Primary Key | Secondary Key | Description |
|--------|-------------|---------------|-------------|
| Attack | `1` | `A` | Execute basic attack |
| Defend | `2` | `D` | Take defensive stance |
| Ability | `3` | `S` | Use special ability |
| Flee | `4` | `F` | Attempt to escape |

### Navigation

| Action | Primary Keys | Secondary Keys | Description |
|--------|--------------|----------------|-------------|
| Move Up | `Arrow Up` | `W` | Navigate up in menus/map |
| Move Down | `Arrow Down` | `S` | Navigate down in menus/map |
| Move Left | `Arrow Left` | `A` | Navigate left in menus/map |
| Move Right | `Arrow Right` | `D` | Navigate right in menus/map |
| Confirm | `Enter` | `Space` | Select/confirm option |
| Cancel | `Escape` | `Backspace` | Go back/cancel |

### System

| Action | Primary Key | Secondary Key | Description |
|--------|-------------|---------------|-------------|
| Pause | `P` | `Escape` | Pause game |
| Settings | `O` | - | Open settings |
| Codex | `C` | - | Open codex |
| Map | `M` | - | View map (when available) |

---

## Mouse Controls

### General

| Action | Input | Description |
|--------|-------|-------------|
| Select | Left Click | Select button/node/option |
| Hover | Mouse Over | Show tooltip/highlight |
| Back | - | Use on-screen back button |

### Combat

| Action | Input | Description |
|--------|-------|-------------|
| Attack | Click Attack Button | Execute basic attack |
| Defend | Click Defend Button | Take defensive stance |
| Ability | Click Ability Button | Use special ability |
| Flee | Click Flee Button | Attempt to escape |

### Map Navigation

| Action | Input | Description |
|--------|-------|-------------|
| Select Node | Click on Node | Highlight and show tooltip |
| Confirm Node | Click Selected Node | Enter the selected node |
| View Tooltip | Hover over Node | Display node information |

---

## Touch Controls (Future)

### Touch Gestures

| Action | Gesture | Description |
|--------|---------|-------------|
| Select | Tap | Select item |
| Scroll | Swipe | Scroll through lists |
| Back | Swipe Right | Go back to previous screen |

---

## Gamepad Controls (Future)

### Standard Layout (Xbox/PlayStation)

| Action | Xbox | PlayStation | Description |
|--------|------|-------------|-------------|
| Navigate | D-Pad/Left Stick | D-Pad/Left Stick | Menu navigation |
| Confirm | A | Cross (X) | Select/confirm |
| Cancel | B | Circle (O) | Go back/cancel |
| Attack | X | Square | Basic attack |
| Defend | Y | Triangle | Defensive stance |
| Ability | RB | R1 | Special ability |
| Flee | LB | L1 | Attempt escape |
| Pause | Start | Options | Pause menu |

---

## Accessibility Options

### Motor Accessibility

| Setting | Description | Default |
|---------|-------------|---------|
| Hold Time | Time required to hold buttons (ms) | 300 |
| Double-Tap Prevention | Delay between inputs (ms) | 200 |
| Key Repeat Delay | Delay before key repeat (ms) | 500 |

### Remapping

Future versions will support full key remapping through the Settings menu:

1. Navigate to Settings > Controls
2. Select the action to remap
3. Press the new key/button
4. Confirm the change

### One-Handed Mode (Future)

For players who need single-hand control:
- All actions mapped to one side of keyboard
- Automatic action selection with confirmation
- Extended decision timers

---

## Input Priority

When multiple inputs are registered simultaneously:

1. **System inputs** (Pause/Escape) always take priority
2. **Navigation inputs** processed in order received
3. **Action inputs** first registered wins
4. **Conflicting inputs** cancel each other

---

## Focus Management

### Tab Order

Interactive elements follow a logical tab order:

1. Primary action buttons (left to right)
2. Secondary navigation buttons
3. Information panels (if interactive)
4. Back/Cancel button (last)

### Focus Indicators

All focusable elements display:
- 3px white border on focus
- Slight scale increase (1.05x)
- High-contrast mode: 4px border

---

## Configuration File

Input mappings are stored in `src/config/ui-settings.json`:

```json
{
  "keyBindings": {
    "combat": {
      "attack": ["1", "A"],
      "defend": ["2", "D"],
      "ability": ["3", "S"],
      "flee": ["4", "F"]
    },
    "navigation": {
      "up": ["ArrowUp", "W"],
      "down": ["ArrowDown", "S"],
      "left": ["ArrowLeft", "A"],
      "right": ["ArrowRight", "D"],
      "confirm": ["Enter", "Space"],
      "cancel": ["Escape", "Backspace"]
    },
    "system": {
      "pause": ["P", "Escape"],
      "settings": ["O"],
      "codex": ["C"],
      "map": ["M"]
    }
  }
}
```

---

## Implementation Notes

### Adding New Key Bindings

1. Add binding to `KEY_BINDINGS` in `src/utils/Constants.ts`
2. Add to `keyBindings` in `src/config/ui-settings.json`
3. Implement handler in relevant scene
4. Update this documentation

### Testing Key Bindings

```typescript
// In scene create() method:
this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
  const key = event.key.toUpperCase();
  
  if (KEY_BINDINGS.COMBAT.ATTACK.includes(key)) {
    this.handleAttack();
  }
  // ... etc
});
```

---

*This document should be updated when input mappings change.*
