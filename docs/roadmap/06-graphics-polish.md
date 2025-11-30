# Graphics/Presentation Polish

## 🎯 Objective

Elevate visual presentation to showcase quality with polished animations, effects, transitions, and visual feedback that enhances gameplay and creates a professional impression.

---

## 📋 Feature Checklist

### Animation Quality

#### Character Animations
- [ ] **Idle Animations**
  - Breathing motion (subtle)
  - Occasional fidget movements
  - Species-specific behaviors (tail swish, head bob)
  - 4-6 frames, looping
- [ ] **Attack Animations**
  - Wind-up anticipation
  - Strike impact frame
  - Follow-through recovery
  - 6-8 frames per attack type
- [ ] **Hurt Animations**
  - Impact reaction
  - Stagger effect
  - Recovery stance
  - 4-6 frames
- [ ] **Death Animations**
  - Dramatic fall
  - Fade out or collapse
  - 6-10 frames
- [ ] **Special Ability Animations**
  - Unique per ability
  - Charge-up for powerful moves
  - Visual effect integration
  - 8-12 frames

#### Animation Timing
```
Standard timing (at 60 FPS):
- Idle: 12 FPS (5 frames/second feel)
- Attack wind-up: 6 frames (100ms)
- Attack impact: 2 frames (33ms) 
- Attack recovery: 4 frames (67ms)
- Hurt: 6 frames (100ms)
- Death: 15 frames (250ms)
```

### Particle Effects

#### Combat Particles
- [ ] **Hit Effects**
  - Blood/damage splatter (colored by damage type)
  - Impact sparks for armor hits
  - Critical hit explosion
  - Status effect application burst
- [ ] **Ability Effects**
  - Claw slash trails
  - Bite impact
  - Stomp ground shake
  - Roar sound waves
- [ ] **Status Effect Visuals**
  - Poison bubbles
  - Burning flames
  - Frozen ice crystals
  - Bleeding droplets
  - Electric sparks

#### Environmental Particles
- [ ] **Ambient Effects**
  - Floating dust motes
  - Falling leaves/debris
  - Water droplets/spray
  - Volcanic ash
  - Fog wisps
- [ ] **Weather Effects**
  - Rain drops
  - Storm lightning
  - Heat shimmer
  - Snow particles

#### Particle System Specifications
```typescript
interface ParticleConfig {
  texture: string;
  count: { min: number; max: number };
  lifespan: { min: number; max: number };
  speed: { min: number; max: number };
  angle: { min: number; max: number };
  scale: { start: number; end: number };
  alpha: { start: number; end: number };
  gravity: { x: number; y: number };
  blendMode: Phaser.BlendModes;
}
```

### Screen Transitions

#### Scene Transitions
- [ ] **Fade Transitions**
  - Fade to black between major scenes
  - Duration: 300-500ms
  - Easing: ease-in-out
- [ ] **Slide Transitions**
  - Panel slides for UI
  - Menu transitions
- [ ] **Thematic Transitions**
  - Biome-specific wipe effects
  - Combat entry zoom
  - Victory celebration burst

#### In-Scene Transitions
- [ ] **Combat Start**
  - Enemy zoom-in introduction
  - Player ready pose
  - "FIGHT!" text flash
- [ ] **Turn Transitions**
  - Subtle pulse between turns
  - Active combatant highlight
- [ ] **Combat End**
  - Victory pose hold
  - Defeat slow-motion
  - Reward reveal sequence

### Visual Feedback

#### Combat Feedback
- [ ] **Damage Numbers**
  - Pop-up with animation
  - Color-coded by type (red = damage, green = heal)
  - Critical hit size increase
  - Miss/dodge text
- [ ] **Screen Effects**
  - Screen shake on heavy hits
  - Flash on critical damage
  - Vignette on low HP
  - Slow-motion on kill
- [ ] **UI Feedback**
  - Button press animations
  - Selection glow
  - Disabled state visual
  - Loading spinners

#### Reward Feedback
- [ ] **Currency Gain**
  - Fossil fragment collect animation
  - Counter increment with sound
- [ ] **Level Up**
  - Golden glow effect
  - Stats increase animation
  - Trait selection fanfare
- [ ] **Achievement Unlock**
  - Toast notification
  - Badge animation
  - Celebratory particles

### UI Animations

#### Menu Animations
- [ ] **Main Menu**
  - Title fade/slide in
  - Button stagger entrance
  - Background parallax movement
- [ ] **Character Select**
  - Card flip animations
  - Selection highlight pulse
  - Stats reveal cascade
- [ ] **Codex**
  - Page turn effect
  - Entry slide in
  - Category expand/collapse

#### Combat UI Animations
- [ ] **Health/Stamina Bars**
  - Smooth value transitions
  - Shake on damage
  - Flash on critical
- [ ] **Action Buttons**
  - Hover scale
  - Click shrink
  - Disabled fade
- [ ] **Combat Log**
  - Entry slide in
  - Scroll animation
  - Highlight new entries

#### Map Animations
- [ ] **Node Interactions**
  - Hover glow
  - Selection pulse
  - Completion checkmark
- [ ] **Path Drawing**
  - Progressive line reveal
  - Player icon movement
- [ ] **Fog Reveal**
  - Gradual clear on approach

---

## 🏗️ Implementation Details

### Animation System

```typescript
class AnimationManager {
  private animations: Map<string, Phaser.Animations.Animation>;
  private particleEmitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter>;
  
  // Register sprite animations
  public registerEntityAnimations(entityType: string, config: AnimationConfig): void {
    const anims = this.scene.anims;
    
    // Idle animation
    anims.create({
      key: `${entityType}_idle`,
      frames: anims.generateFrameNumbers(entityType, {
        start: config.idle.startFrame,
        end: config.idle.endFrame
      }),
      frameRate: config.idle.frameRate,
      repeat: -1
    });
    
    // Attack animation
    anims.create({
      key: `${entityType}_attack`,
      frames: anims.generateFrameNumbers(entityType, {
        start: config.attack.startFrame,
        end: config.attack.endFrame
      }),
      frameRate: config.attack.frameRate,
      repeat: 0
    });
    
    // ... other animations
  }
  
  // Play animation with callback
  public async playAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animKey: string
  ): Promise<void> {
    return new Promise((resolve) => {
      sprite.play(animKey);
      sprite.once('animationcomplete', resolve);
    });
  }
  
  // Combat effect
  public playDamageEffect(target: CombatEntity, damage: number): void {
    // Screen shake
    this.scene.cameras.main.shake(100, 0.01);
    
    // Flash sprite
    this.scene.tweens.add({
      targets: target.sprite,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
      repeat: 2
    });
    
    // Damage number popup
    this.showDamageNumber(target.x, target.y, damage);
    
    // Hit particles
    this.emitHitParticles(target.x, target.y);
  }
  
  private showDamageNumber(x: number, y: number, damage: number): void {
    const text = this.scene.add.text(x, y, `-${damage}`, {
      fontSize: '24px',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 4
    });
    
    this.scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }
}
```

### Transition System

```typescript
class TransitionManager {
  public async fadeTransition(
    scene: Phaser.Scene,
    targetScene: string,
    duration: number = 500
  ): Promise<void> {
    // Fade out
    scene.cameras.main.fadeOut(duration / 2);
    
    await this.wait(duration / 2);
    
    // Start new scene
    scene.scene.start(targetScene);
    
    // Fade in (handled by new scene)
  }
  
  public async combatIntro(
    scene: CombatScene,
    player: CombatEntity,
    enemies: CombatEntity[]
  ): Promise<void> {
    // Dim background
    const overlay = scene.add.rectangle(
      640, 360, 1280, 720, 0x000000, 0.5
    );
    
    // Zoom to enemies
    for (const enemy of enemies) {
      await this.zoomToEntity(scene, enemy);
      await this.wait(300);
    }
    
    // Show "FIGHT!" text
    const fightText = scene.add.text(640, 360, 'FIGHT!', {
      fontSize: '72px',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    scene.tweens.add({
      targets: fightText,
      scale: { from: 0, to: 1.2 },
      duration: 300,
      yoyo: true,
      onComplete: () => {
        fightText.destroy();
        overlay.destroy();
      }
    });
  }
}
```

### File Changes Required

| File | Changes |
|------|---------|
| `src/managers/AnimationManager.ts` | New file |
| `src/managers/ParticleManager.ts` | New file |
| `src/managers/TransitionManager.ts` | New file |
| `src/managers/EffectsManager.ts` | New file |
| `src/ui/components/DamageNumber.ts` | New file |
| `src/scenes/*` | Add animation calls |
| `src/data/animations.json` | Animation configs |
| `src/data/particles.json` | Particle configs |

---

## 🎨 Visual Style Guide

### Animation Principles
1. **Anticipation**: Wind-up before major actions
2. **Impact**: Hold frame on contact
3. **Follow-through**: Natural recovery movement
4. **Squash & Stretch**: Subtle for pixel art
5. **Timing**: Fast actions, slow reactions

### Color Effects
```css
/* Damage Type Colors */
--physical: #ffffff;
--fire: #ff6b35;
--poison: #7bed9f;
--ice: #70a1ff;
--electric: #ffd32a;
--crushing: #a55eea;
--slashing: #ff4757;

/* UI Effect Colors */
--positive: #2ed573;
--negative: #ff4757;
--neutral: #ffa502;
--buff: #3742fa;
--debuff: #8b0000;
```

### Particle Guidelines
- Max 50 particles per effect
- Lifetime: 0.5-2 seconds
- Blend modes: ADD for glows, NORMAL for physical
- Scale down over lifetime for most effects

---

## ✅ Acceptance Criteria

- [ ] All character animations smooth at 60 FPS
- [ ] Hit effects visible and impactful
- [ ] Damage numbers readable and animated
- [ ] Scene transitions smooth and thematic
- [ ] UI animations responsive (< 100ms feedback)
- [ ] Particle effects optimized (no frame drops)
- [ ] Screen effects enhance without distracting

---

## 🧪 Testing Requirements

### Performance Testing
- [ ] Maintain 60 FPS with all effects active
- [ ] No memory leaks from particles
- [ ] Animation pooling works correctly
- [ ] Effects degrade gracefully on low-end devices

### Visual Testing
- [ ] All animations play correctly
- [ ] Transitions feel smooth
- [ ] Effects are visible on all backgrounds
- [ ] Color blind modes compatible

---

## 📊 Priority Matrix

| Feature | Visual Impact | Effort | Priority |
|---------|--------------|--------|----------|
| Character Animations | High | High | P1 |
| Damage Numbers | High | Low | P1 |
| Hit Particles | High | Medium | P1 |
| Screen Shake | Medium | Low | P1 |
| Scene Transitions | Medium | Medium | P2 |
| Status Effect Visuals | Medium | Medium | P2 |
| UI Animations | Medium | Medium | P2 |
| Weather Particles | Low | High | P3 |
| Advanced Transitions | Low | Medium | P3 |

---

*This sub-issue ensures PrimordialSwamp looks and feels polished, with responsive visual feedback that enhances the player experience.*
