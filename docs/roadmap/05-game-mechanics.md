# Game Mechanics Revamp

## 🎯 Objective

Enhance core gameplay systems to provide deep, strategic combat with meaningful choices, balanced progression, and engaging moment-to-moment gameplay.

---

## 📋 Feature Checklist

### Combat Depth Improvements

#### Damage System Enhancement
- [ ] **Damage Types Implementation**
  - Physical (standard melee)
  - Crushing (high impact, effective vs. armor)
  - Slashing (cutting, causes bleeding)
  - Piercing (armor-penetrating)
  - Poison (DoT, bypasses some defenses)
  - Sonic (sound-based, can disorient)
  - Blunt (concussive, can stun)
- [ ] **Resistance System**
  - Per-type damage resistance
  - Vulnerabilities (150% damage)
  - Immunity (0% damage)
  - Display resistances in UI
- [ ] **Damage Calculation Refinement**
  ```
  finalDamage = (baseDamage * multiplier * critMod) 
                - (defense * defenseMultiplier)
                * (1 - targetResistance)
                * environmentalModifier
  ```

#### Combat Actions Expansion
- [ ] **Basic Actions**
  - Attack (100% ATK, 10 stamina)
  - Heavy Attack (150% ATK, -5 DEF, 25 stamina)
  - Defend (+5 DEF, prepare counter, 0 stamina)
  - Flee (Speed check, may fail)
- [ ] **Advanced Actions**
  - Targeted Strike (choose body zone, accuracy penalty)
  - Power Charge (skip turn, +50% next attack)
  - Tactical Retreat (guaranteed flee, lose item)
  - Analyze Enemy (reveal stats and weaknesses)
- [ ] **Species-Specific Actions**
  - 3 unique abilities per dinosaur
  - Unlockable ultimate abilities
  - Passive abilities (always active)

#### Body Target Zones
- [ ] **Zone Implementation**
  - Head: +50% damage, -20% accuracy, stun chance
  - Body: Standard damage, standard accuracy
  - Limbs: -25% damage, disable attacks/movement
  - Tail: Disable tail-based abilities
  - Wings: Disable flight (Pteranodon, flying enemies)
  - Weak Spot: +100% damage, requires Analyze

### Status Effect System

#### Harmful Status Effects
- [ ] **Bleeding** - 5 damage/turn, reduced by 1 each turn
- [ ] **Stunned** - Skip next turn
- [ ] **Poisoned** - 3 damage/turn, -50% healing
- [ ] **Exhausted** - -50% speed, -3 attack, no special abilities
- [ ] **Burned** - 4 damage/turn, -2 defense
- [ ] **Frozen** - Skip turn, +50% physical damage taken
- [ ] **Shocked** - 25% chance to fail actions
- [ ] **Terrified** - 40% chance to flee, -4 attack
- [ ] **Confused** - 30% chance to hit self/allies
- [ ] **Weakened** - -25% all stats
- [ ] **Berserk** - Double damage, attacks random targets

#### Beneficial Status Effects
- [ ] **Fortified** - +5 defense for duration
- [ ] **Empowered** - +25% all stats
- [ ] **Regenerating** - +5 HP per turn
- [ ] **Hidden** - Untargetable, +50% first attack damage
- [ ] **Camouflaged** - -50% enemy accuracy
- [ ] **Enraged** - +30% damage, -20% defense
- [ ] **Protected** - Absorb next hit
- [ ] **Hastened** - Extra action this turn

#### Status Effect Mechanics
- [ ] Stacking rules (same type refreshes/stacks)
- [ ] Immunity interactions
- [ ] Cleanse mechanics
- [ ] Duration tracking
- [ ] Visual indicators

### Trait Synergies

#### Synergy Categories
- [ ] **Offensive Synergies**
  - 3+ offensive traits: +15% damage
  - Specific combos (e.g., Sharp Claws + Predator's Instinct = guaranteed crit on low HP)
- [ ] **Defensive Synergies**
  - 3+ defensive traits: +10% damage reduction
  - Specific combos (e.g., Thick Hide + Armored Body = counter damage)
- [ ] **Support Synergies**
  - 3+ support traits: +20% buff effectiveness
  - Specific combos
- [ ] **Hybrid Synergies**
  - Mixed category bonuses
  - Unique combinations unlock special effects

#### Trait Tagging System
```typescript
interface Trait {
  id: string;
  name: string;
  tags: TraitTag[];
  synergies: SynergyDefinition[];
  exclusions: string[]; // Incompatible traits
}

enum TraitTag {
  OFFENSIVE,
  DEFENSIVE,
  SUPPORT,
  STEALTH,
  SPEED,
  STAMINA,
  CRITICAL,
  STATUS,
  SPECIAL
}

interface SynergyDefinition {
  requiredTraits: string[];
  effect: Effect;
  description: string;
}
```

### Enemy AI Improvements

#### Behavior Trees
- [ ] **Basic Behaviors**
  - Attack when HP > 50%
  - Defend when HP < 30%
  - Use healing at HP < 25%
  - Flee when HP < 10%
- [ ] **Advanced Behaviors**
  - Target lowest HP enemy
  - Prioritize healers/support
  - Use abilities strategically
  - Adapt to player patterns
- [ ] **Boss Behaviors**
  - Phase transitions
  - Enrage timers
  - Add spawning
  - Special attack patterns

#### AI Difficulty Scaling
- [ ] **Easy Mode**
  - Predictable patterns
  - Longer reaction times
  - Suboptimal choices
- [ ] **Normal Mode**
  - Balanced decisions
  - Some adaptation
- [ ] **Hard Mode**
  - Optimal ability usage
  - Pattern recognition
  - Coordinated attacks

### Environmental Hazards

#### Weather Effects
- [ ] **Clear** - No modifiers
- [ ] **Rainy** - -10% accuracy, fire resistance
- [ ] **Stormy** - -20% accuracy, +20% sonic damage
- [ ] **Foggy** - -30% visibility, stealth bonus
- [ ] **Scorching** - Fire vulnerability, stamina drain
- [ ] **Frigid** - Cold damage per turn, reduced speed

#### Terrain Effects
- [ ] **Plains** - Open combat, no cover
- [ ] **Forest** - Stealth bonus, fire vulnerability
- [ ] **Swamp** - Movement penalty, poison resistance
- [ ] **Volcanic** - Fire damage per turn, heat exhaustion
- [ ] **Coastal** - Aquatic bonuses, tidal hazards
- [ ] **Desert** - Stamina drain, heat effects
- [ ] **Cave** - Darkness penalties, sonic amplification

#### Time of Day
- [ ] **Dawn** - Balanced combat
- [ ] **Day** - Normal visibility, no bonuses
- [ ] **Dusk** - Stealth bonus, reduced visibility
- [ ] **Night** - Darkness penalties, nocturnal bonuses

### Balance Tuning Framework

#### Combat Balance Metrics
- [ ] Average fight duration: 5-10 turns
- [ ] Player victory rate (normal enemies): 85-95%
- [ ] Player victory rate (elite): 60-75%
- [ ] Player victory rate (boss): 40-60%
- [ ] Damage per turn ratio (player:enemy): 1.2:1

#### Progression Balance
- [ ] XP curve: Exponential with softcaps
- [ ] Stat growth: Diminishing returns after level 10
- [ ] Trait acquisition rate: 1 per 3-5 encounters
- [ ] Resource economy: Sustainable with strategic play

---

## 🏗️ Implementation Details

### Combat System Architecture

```typescript
class CombatSystem {
  // Initiative management
  private turnQueue: CombatEntity[];
  private currentTurn: number;
  
  // Environment
  private weather: WeatherType;
  private terrain: TerrainType;
  private timeOfDay: TimeOfDay;
  
  // Combat state
  private combatLog: CombatLogEntry[];
  private roundNumber: number;
  
  // Main combat loop
  public async executeTurn(action: CombatAction): Promise<TurnResult> {
    // 1. Pre-action phase
    await this.applyPreActionEffects();
    
    // 2. Action resolution
    const result = await this.resolveAction(action);
    
    // 3. Damage calculation
    const damage = this.calculateDamage(result);
    
    // 4. Status effect application
    await this.applyStatusEffects(result);
    
    // 5. Post-action phase
    await this.applyPostActionEffects();
    
    // 6. Environmental effects
    await this.applyEnvironmentalEffects();
    
    // 7. Victory/defeat check
    const endState = this.checkCombatEnd();
    
    return { damage, result, endState };
  }
  
  private calculateDamage(result: ActionResult): number {
    const { attacker, defender, action } = result;
    
    // Base damage
    let damage = attacker.stats.attack * action.damageMultiplier;
    
    // Critical hit
    if (this.rollCritical(attacker)) {
      damage *= 2;
      result.critical = true;
    }
    
    // Damage type modifiers
    const resistance = defender.resistances[action.damageType] ?? 0;
    damage *= (1 - resistance);
    
    // Defense reduction
    damage = Math.max(1, damage - defender.stats.defense);
    
    // Environmental modifiers
    damage *= this.getEnvironmentalDamageModifier(action.damageType);
    
    // Trait modifiers
    damage = this.applyTraitDamageModifiers(attacker, defender, damage);
    
    return Math.floor(damage);
  }
}
```

### Status Effect Manager

```typescript
class StatusEffectManager {
  private effects: Map<EntityId, StatusEffect[]>;
  
  public applyEffect(target: EntityId, effect: StatusEffect): void {
    const existing = this.effects.get(target) ?? [];
    
    // Check stacking rules
    const existingOfType = existing.find(e => e.type === effect.type);
    if (existingOfType) {
      if (effect.stackable) {
        existingOfType.stacks = Math.min(
          existingOfType.stacks + 1,
          effect.maxStacks
        );
        existingOfType.duration = Math.max(
          existingOfType.duration,
          effect.duration
        );
      } else {
        existingOfType.duration = effect.duration; // Refresh
      }
    } else {
      existing.push({ ...effect, stacks: 1 });
    }
    
    this.effects.set(target, existing);
    this.emitEffectApplied(target, effect);
  }
  
  public tickEffects(entityId: EntityId): TickResult[] {
    const results: TickResult[] = [];
    const effects = this.effects.get(entityId) ?? [];
    
    for (const effect of effects) {
      // Apply per-turn effects
      if (effect.damagePerTurn) {
        results.push({
          type: 'damage',
          amount: effect.damagePerTurn * effect.stacks,
          source: effect.type
        });
      }
      
      if (effect.healPerTurn) {
        results.push({
          type: 'heal',
          amount: effect.healPerTurn * effect.stacks,
          source: effect.type
        });
      }
      
      // Reduce duration
      effect.duration--;
    }
    
    // Remove expired effects
    this.effects.set(
      entityId,
      effects.filter(e => e.duration > 0)
    );
    
    return results;
  }
}
```

### File Changes Required

| File | Changes |
|------|---------|
| `src/systems/CombatSystem.ts` | Complete rewrite |
| `src/systems/DamageSystem.ts` | New file |
| `src/systems/StatusEffectSystem.ts` | New file |
| `src/systems/AISystem.ts` | New file |
| `src/systems/EnvironmentSystem.ts` | New file |
| `src/types/Combat.types.ts` | Expand types |
| `src/data/statusEffects.json` | Effect definitions |
| `src/data/synergies.json` | Synergy definitions |
| `src/data/aiPatterns.json` | AI behavior definitions |

---

## ✅ Acceptance Criteria

- [ ] All 7 damage types functional with resistance system
- [ ] All 16+ status effects implemented with proper stacking
- [ ] Body targeting system with accuracy/damage tradeoffs
- [ ] 10+ trait synergies discoverable and impactful
- [ ] Enemy AI uses abilities strategically
- [ ] Environmental effects modify combat meaningfully
- [ ] Combat feels tactical with multiple viable approaches

---

## 🧪 Testing Requirements

### Unit Tests
- [ ] Damage calculation accuracy
- [ ] Status effect stacking and duration
- [ ] Trait synergy detection
- [ ] AI decision tree logic
- [ ] Environmental modifier application

### Balance Testing
- [ ] Run simulations for victory rates
- [ ] Measure average fight durations
- [ ] Test all build archetypes
- [ ] Verify no dominant strategies

---

## 📊 Priority Matrix

| Feature | Gameplay Impact | Effort | Priority |
|---------|----------------|--------|----------|
| Damage Types | High | Medium | P1 |
| Status Effects (core) | High | Medium | P1 |
| Basic AI Improvements | High | Medium | P1 |
| Body Targeting | Medium | Medium | P2 |
| Trait Synergies | Medium | High | P2 |
| Environmental Effects | Medium | Medium | P2 |
| Advanced AI | Medium | High | P2 |
| Weather System | Low | Medium | P3 |
| Time of Day | Low | Low | P3 |

---

*This sub-issue ensures combat is deep, strategic, and satisfying with meaningful player choices.*
