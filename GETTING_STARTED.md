# Getting Started with Primordial Swamp

## Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd /Users/ianlintner/Projects/PrimordialSwamp
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:5173`

### 4. Play the Prototype!
- Click "START NEW RUN"
- Select a dinosaur (try Deinonychus first!)
- Click "TEST COMBAT"
- Try different actions in combat

---

## What You Can Do Right Now

✅ **Main Menu** - Animated title screen with navigation  
✅ **Character Selection** - Choose from 3 unique dinosaurs  
✅ **Combat System** - Functional turn-based combat with 4 actions  
✅ **View Stats** - See health, stamina, attack, defense, speed  
✅ **Read Facts** - Scientific information in dinosaur profiles  

---

## Project Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Building
npm run build        # Create production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint TypeScript files
npm run format       # Format code with Prettier

# Testing (when implemented)
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run end-to-end tests
```

---

## Project Structure Overview

```
src/
├── scenes/          # Phaser game scenes
│   ├── BootScene.ts          # Loading & initialization
│   ├── MenuScene.ts          # Main menu
│   ├── CharacterSelectScene.ts  # Dinosaur selection
│   ├── MapScene.ts           # Map navigation (stub)
│   └── CombatScene.ts        # Turn-based combat
│
├── types/           # TypeScript type definitions
│   ├── Dinosaur.types.ts     # Dinosaur interfaces
│   ├── Combat.types.ts       # Combat system types
│   ├── Encounter.types.ts    # Encounter & map types
│   └── GameState.types.ts    # State management types
│
├── data/            # Game content (JSON)
│   ├── dinosaurs.json        # All dinosaur data
│   └── abilities.json        # Ability definitions
│
├── utils/           # Utility functions
│   └── Constants.ts          # Game configuration
│
└── main.ts          # Entry point
```

---

## Understanding the Codebase

### 1. Game Flow
```typescript
// main.ts
// Initializes Phaser game with scene list

// Scenes execute in order:
BootScene → MenuScene → CharacterSelectScene → MapScene → CombatScene
```

### 2. Adding a New Dinosaur
Edit `src/data/dinosaurs.json`:
```json
{
  "id": "new_dino",
  "name": "New Dinosaur",
  "species": "Scientific name",
  "baseStats": {
    "health": 80,
    "attack": 7,
    "defense": 5,
    "speed": 6,
    "stamina": 60
  },
  // ... more fields
}
```

### 3. Adding a New Ability
Edit `src/data/abilities.json`:
```json
{
  "id": "new_ability",
  "name": "Ability Name",
  "description": "What it does",
  "staminaCost": 30,
  "cooldown": 2,
  "damageMultiplier": 1.5,
  "effects": [...]
}
```

### 4. Modifying Combat
Look in `src/scenes/CombatScene.ts`:
- `playerAttack()` - Basic attack logic
- `playerDefend()` - Defense action
- `playerAbility()` - Special abilities
- `enemyTurn()` - AI behavior

---

## Development Tips

### Hot Reload
Vite provides instant hot reload. Just save any `.ts` file and the browser updates automatically!

### Console Debugging
Open browser DevTools (F12) to see:
- Game initialization logs
- Combat events
- Scene transitions
- Any errors

### Adding New Scenes
1. Create file in `src/scenes/YourScene.ts`
2. Extend `Phaser.Scene`
3. Add to scene list in `src/main.ts`
4. Use `this.scene.start('YourScene')` to navigate

---

## Next Development Tasks

### Immediate (Week 1-2)
- [ ] Implement proper damage calculation system
- [ ] Add status effects (bleeding, stunned, etc.)
- [ ] Create ability cooldown system
- [ ] Add stamina regeneration per turn

### Short-term (Week 3-4)
- [ ] Build procedural map generation
- [ ] Implement encounter system
- [ ] Create rewards screen
- [ ] Add trait selection UI

### Medium-term (Month 2)
- [ ] Save/load system
- [ ] Meta-progression (fossil currency)
- [ ] Achievement system
- [ ] Sound effects & music

---

## Common Issues & Solutions

### Issue: `npm install` fails
**Solution**: Ensure Node.js 18+ is installed
```bash
node --version  # Should be v18.0.0 or higher
```

### Issue: Port 5173 already in use
**Solution**: Kill existing process or use different port
```bash
npm run dev -- --port 3000
```

### Issue: TypeScript errors in editor
**Solution**: Restart TypeScript server in VS Code
- `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Issue: Changes not reflecting
**Solution**: Hard refresh browser
- `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## File Modifications Guide

### Want to change game colors?
Edit `src/utils/Constants.ts`:
```typescript
COLORS: {
  PRIMARY: 0x4a9d5f,    // Main green
  SECONDARY: 0x3d7a4d,  // Dark green
  DANGER: 0xd94a3d,     // Red
  // ...
}
```

### Want to adjust game size?
Edit `src/utils/Constants.ts`:
```typescript
WIDTH: 1280,   // Game width
HEIGHT: 720,   // Game height
```

### Want to modify dinosaur stats?
Edit `src/data/dinosaurs.json` - all stats are there!

### Want to change combat balance?
Edit damage calculations in `src/scenes/CombatScene.ts`:
```typescript
const damage = Phaser.Math.Between(8, 12); // Min/max damage
```

---

## Learning Resources

### Phaser 3
- [Official Docs](https://photonstorm.github.io/phaser3-docs/)
- [Examples](https://phaser.io/examples)
- [Community Discord](https://discord.gg/phaser)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

### Game Design
- [Roguelike Development Guide](https://www.roguebasin.com/)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

---

## Testing Your Changes

### Manual Testing Checklist
- [ ] Main menu loads correctly
- [ ] All 3 dinosaurs selectable
- [ ] Combat actions work
- [ ] Health/stamina update properly
- [ ] Victory/defeat triggers correctly
- [ ] No console errors

### Browser Compatibility
Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⏳ Mobile browsers (responsive design)

---

## Performance Tips

### Keep 60 FPS
- Minimize object creation in game loops
- Use object pools for frequently created objects
- Limit particle effects
- Profile with Chrome DevTools

### Reduce Bundle Size
- Tree-shake unused imports
- Compress images (use WebP)
- Minify in production build

---

## Contributing Workflow

### Making Changes
1. Create feature branch: `git checkout -b feature/new-ability`
2. Make changes and test
3. Commit: `git commit -m "Add new ability system"`
4. Push: `git push origin feature/new-ability`
5. Create pull request (if team project)

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add comments for complex logic
- Run `npm run format` before committing

---

## Getting Help

### Where to Look First
1. **GAME_DESIGN.md** - Understand the vision
2. **TECHNICAL_ARCHITECTURE.md** - System designs
3. **IMPLEMENTATION_SUMMARY.md** - Current status
4. **This file** - Getting started tips

### Still Stuck?
- Check browser console for errors
- Review existing code in similar scenes
- Search Phaser documentation
- Ask in Phaser Discord community

---

## Useful VS Code Extensions

Recommended for this project:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Vue Plugin** - Better TS support
- **Error Lens** - Inline error highlighting
- **GitLens** - Git integration

---

## Fun Facts About the Project

🦖 **Lines of Code**: ~2,500+ (and growing!)  
📄 **Documentation**: 100+ pages of design docs  
🎮 **Game Loops**: Turn-based (no physics engine needed)  
🧪 **Scientific Facts**: 20+ already implemented  
⚡ **Load Time**: < 1 second for prototype  

---

## Your First Modifications

Try these to get comfortable:

### Easy
1. Change a dinosaur's base stats
2. Modify combat damage range
3. Add a new random fact to main menu
4. Change UI colors

### Medium
1. Add a new ability to an existing dinosaur
2. Create a new enemy type
3. Add a status effect (e.g., "Enraged")
4. Implement stamina regeneration

### Advanced
1. Create the map generation system
2. Implement trait selection UI
3. Add save/load functionality
4. Create a new encounter type

---

## Ready to Go!

You now have:
✅ A working prototype  
✅ Complete documentation  
✅ Clear roadmap  
✅ Data-driven architecture  
✅ Type-safe codebase  

**Start developing and bring prehistoric creatures to life!** 🦕

---

**Questions?** Check the docs or experiment - the codebase is designed to be explorable!

🦖 Happy coding! 🦖
