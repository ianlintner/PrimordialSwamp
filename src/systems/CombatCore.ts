/**
 * CombatCore - Enhanced combat mechanics with hit detection and AI
 * 
 * This module provides the core combat calculation functions including
 * improved hit detection, damage calculations, and enemy AI behavior trees.
 * 
 * @module systems/CombatCore
 */

import {
  DamageType,
  StatusEffectType,
  BodyPart,
  WeatherType,
  TerrainType,
  DerivedCombatStats
} from '../types/Combat.types';

/**
 * Hit detection result
 */
export interface HitDetectionResult {
  hit: boolean;
  critical: boolean;
  evaded: boolean;
  blocked: boolean;
  bodyPartHit?: BodyPart;
  accuracyRoll: number;
  effectiveAccuracy: number;
  modifiers: HitModifier[];
}

/**
 * Modifier that affects hit chance
 */
export interface HitModifier {
  source: string;
  value: number;
  type: 'flat' | 'percent';
}

/**
 * Damage calculation result
 */
export interface DamageCalculationResult {
  baseDamage: number;
  finalDamage: number;
  damageType: DamageType;
  criticalMultiplier: number;
  resistanceReduction: number;
  defenseReduction: number;
  environmentalModifier: number;
  traitModifiers: number;
  overkill: number;
  breakdown: DamageBreakdown;
}

/**
 * Detailed damage breakdown for UI display
 */
export interface DamageBreakdown {
  base: number;
  attackStat: number;
  abilityMultiplier: number;
  critical: number;
  defense: number;
  resistance: number;
  environmental: number;
  traits: number;
  final: number;
}

/**
 * Combatant stats for calculations
 */
export interface CombatantStats {
  attack: number;
  defense: number;
  speed: number;
  health: number;
  maxHealth: number;
  derivedStats: DerivedCombatStats;
  resistances: Partial<Record<DamageType, number>>;
  vulnerabilities: Partial<Record<DamageType, number>>;
  activeStatusEffects: StatusEffectType[];
  traits: string[];
  bodyPartWeaknesses?: Partial<Record<BodyPart, number>>;
}

/**
 * Combat environment state
 */
export interface CombatEnvironment {
  weather: WeatherType;
  terrain: TerrainType;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  visibility: number; // 0-100
}

/**
 * Enemy AI behavior node
 */
export interface AIBehaviorNode {
  type: 'condition' | 'action' | 'sequence' | 'selector' | 'random';
  condition?: (context: AIContext) => boolean;
  action?: string;
  children?: AIBehaviorNode[];
  weight?: number; // For random selection
}

/**
 * Context for AI decision making
 */
export interface AIContext {
  selfHealth: number;
  selfMaxHealth: number;
  selfStamina: number;
  selfStatusEffects: StatusEffectType[];
  targetHealth: number;
  targetMaxHealth: number;
  targetStatusEffects: StatusEffectType[];
  turnNumber: number;
  environment: CombatEnvironment;
  availableAbilities: string[];
  abilityCooldowns: Map<string, number>;
  combatHistory: AIHistoryEntry[];
}

/**
 * History entry for AI learning
 */
export interface AIHistoryEntry {
  turn: number;
  playerAction: string;
  result: 'hit' | 'miss' | 'critical';
  damage: number;
}

/**
 * AI decision result
 */
export interface AIDecision {
  action: string;
  targetBodyPart?: BodyPart;
  reasoning: string;
  confidence: number; // 0-1
}

/**
 * Accuracy modifiers by source
 */
const ACCURACY_MODIFIERS = {
  // Base accuracy
  base: 90,

  // Weather effects
  weather: {
    [WeatherType.CLEAR]: 0,
    [WeatherType.RAIN]: -10,
    [WeatherType.STORM]: -20,
    [WeatherType.FOG]: -30,
    [WeatherType.VOLCANIC_ASH]: -15,
    [WeatherType.HEAT_WAVE]: -5,
    [WeatherType.COLD_SNAP]: -10,
    [WeatherType.METEOR_SHOWER]: -25
  },

  // Status effect penalties
  statusEffects: {
    [StatusEffectType.BLINDED]: -50,
    [StatusEffectType.CONFUSED]: -20,
    [StatusEffectType.EXHAUSTED]: -15,
    [StatusEffectType.FROZEN]: -100, // Cannot act
    [StatusEffectType.STUNNED]: -100 // Cannot act
  },

  // Body part targeting penalties
  bodyPart: {
    [BodyPart.HEAD]: -20,
    [BodyPart.NECK]: -15,
    [BodyPart.BODY]: 0,
    [BodyPart.LEGS]: -10,
    [BodyPart.TAIL]: -10,
    [BodyPart.WINGS]: -15,
    [BodyPart.UNDERBELLY]: -25
  },

  // Terrain modifiers
  terrain: {
    [TerrainType.OPEN_GROUND]: 0,
    [TerrainType.DENSE_VEGETATION]: -15,
    [TerrainType.SHALLOW_WATER]: -5,
    [TerrainType.DEEP_WATER]: -20,
    [TerrainType.MUD]: -10,
    [TerrainType.TAR_PIT]: -25,
    [TerrainType.ROCKY]: -5,
    [TerrainType.VOLCANIC]: -10,
    [TerrainType.NESTING_GROUND]: 0,
    [TerrainType.CLIFF]: -15
  },

  // Time of day
  timeOfDay: {
    dawn: 0,
    day: 0,
    dusk: -5,
    night: -20
  }
};

/**
 * Body part damage multipliers
 */
const BODY_PART_DAMAGE = {
  [BodyPart.HEAD]: 1.5,
  [BodyPart.NECK]: 1.3,
  [BodyPart.BODY]: 1.0,
  [BodyPart.LEGS]: 0.75,
  [BodyPart.TAIL]: 0.8,
  [BodyPart.WINGS]: 0.9,
  [BodyPart.UNDERBELLY]: 2.0
};

/**
 * Calculate hit detection for an attack
 * 
 * @param attacker - Attacker stats
 * @param defender - Defender stats
 * @param environment - Combat environment
 * @param targetBodyPart - Optional targeted body part
 * @returns Hit detection result
 */
export function calculateHitDetection(
  attacker: CombatantStats,
  defender: CombatantStats,
  environment: CombatEnvironment,
  targetBodyPart?: BodyPart
): HitDetectionResult {
  const modifiers: HitModifier[] = [];
  let effectiveAccuracy = ACCURACY_MODIFIERS.base;

  // Add attacker accuracy bonus
  if (attacker.derivedStats.accuracy) {
    modifiers.push({
      source: 'Attacker Accuracy',
      value: attacker.derivedStats.accuracy - 90,
      type: 'flat'
    });
    effectiveAccuracy += attacker.derivedStats.accuracy - 90;
  }

  // Weather modifier
  const weatherMod = ACCURACY_MODIFIERS.weather[environment.weather];
  if (weatherMod !== 0) {
    modifiers.push({
      source: `Weather (${environment.weather})`,
      value: weatherMod,
      type: 'flat'
    });
    effectiveAccuracy += weatherMod;
  }

  // Terrain modifier
  const terrainMod = ACCURACY_MODIFIERS.terrain[environment.terrain];
  if (terrainMod !== 0) {
    modifiers.push({
      source: `Terrain (${environment.terrain})`,
      value: terrainMod,
      type: 'flat'
    });
    effectiveAccuracy += terrainMod;
  }

  // Time of day modifier
  const timeMod = ACCURACY_MODIFIERS.timeOfDay[environment.timeOfDay];
  if (timeMod !== 0) {
    modifiers.push({
      source: `Time of Day (${environment.timeOfDay})`,
      value: timeMod,
      type: 'flat'
    });
    effectiveAccuracy += timeMod;
  }

  // Body part targeting penalty
  if (targetBodyPart) {
    const bodyPartMod = ACCURACY_MODIFIERS.bodyPart[targetBodyPart];
    if (bodyPartMod !== 0) {
      modifiers.push({
        source: `Target (${targetBodyPart})`,
        value: bodyPartMod,
        type: 'flat'
      });
      effectiveAccuracy += bodyPartMod;
    }
  }

  // Status effect penalties on attacker
  // Define the status effects that affect accuracy
  const accuracyAffectingEffects = [
    StatusEffectType.BLINDED,
    StatusEffectType.CONFUSED,
    StatusEffectType.EXHAUSTED,
    StatusEffectType.FROZEN,
    StatusEffectType.STUNNED
  ];

  for (const effect of attacker.activeStatusEffects) {
    if (accuracyAffectingEffects.includes(effect)) {
      const effectMod = ACCURACY_MODIFIERS.statusEffects[effect as keyof typeof ACCURACY_MODIFIERS.statusEffects];
      if (effectMod !== undefined) {
        modifiers.push({
          source: `Status (${effect})`,
          value: effectMod,
          type: 'flat'
        });
        effectiveAccuracy += effectMod;
      }
    }
  }

  // Defender evasion
  if (defender.derivedStats.evasion > 0) {
    modifiers.push({
      source: 'Defender Evasion',
      value: -defender.derivedStats.evasion,
      type: 'flat'
    });
    effectiveAccuracy -= defender.derivedStats.evasion;
  }

  // Clamp accuracy
  effectiveAccuracy = Math.max(5, Math.min(100, effectiveAccuracy));

  // Roll for hit
  const accuracyRoll = Math.random() * 100;
  const hit = accuracyRoll <= effectiveAccuracy;

  // Check for evasion (separate from miss)
  let evaded = false;
  if (!hit && defender.derivedStats.evasion > 0) {
    evaded = Math.random() * 100 <= defender.derivedStats.evasion;
  }

  // Check for block
  let blocked = false;
  if (hit && defender.derivedStats.blockChance > 0) {
    blocked = Math.random() * 100 <= defender.derivedStats.blockChance;
  }

  // Check for critical (only if hit and not blocked)
  let critical = false;
  if (hit && !blocked) {
    const critChance = attacker.derivedStats.criticalChance || 5;
    critical = Math.random() * 100 <= critChance;
  }

  return {
    hit: hit && !blocked,
    critical,
    evaded,
    blocked,
    bodyPartHit: hit ? (targetBodyPart || BodyPart.BODY) : undefined,
    accuracyRoll,
    effectiveAccuracy,
    modifiers
  };
}

/**
 * Calculate damage for an attack
 * 
 * @param attacker - Attacker stats
 * @param defender - Defender stats
 * @param abilityMultiplier - Damage multiplier from ability
 * @param damageType - Type of damage
 * @param hitResult - Result from hit detection
 * @param environment - Combat environment
 * @returns Damage calculation result
 */
export function calculateDamage(
  attacker: CombatantStats,
  defender: CombatantStats,
  abilityMultiplier: number,
  damageType: DamageType,
  hitResult: HitDetectionResult,
  environment: CombatEnvironment
): DamageCalculationResult {
  // Base damage = Attack * Ability Multiplier
  const baseDamage = attacker.attack * abilityMultiplier;

  // Body part multiplier
  let bodyPartMod = 1.0;
  if (hitResult.bodyPartHit) {
    bodyPartMod = BODY_PART_DAMAGE[hitResult.bodyPartHit];

    // Check for weakness
    const weakness = defender.bodyPartWeaknesses?.[hitResult.bodyPartHit];
    if (weakness) {
      bodyPartMod *= (1 + weakness);
    }
  }

  // Critical multiplier
  const criticalMultiplier = hitResult.critical
    ? (attacker.derivedStats.criticalDamage || 200) / 100
    : 1.0;

  // Defense reduction
  const armorPen = attacker.derivedStats.armorPenetration || 0;
  const effectiveDefense = defender.defense * (1 - armorPen / 100);
  const defenseReduction = effectiveDefense;

  // Resistance/Vulnerability
  let resistanceModifier = 1.0;
  const resistance = defender.resistances[damageType];
  const vulnerability = defender.vulnerabilities[damageType];

  if (resistance) {
    resistanceModifier *= (1 - resistance);
  }
  if (vulnerability) {
    resistanceModifier *= (1 + vulnerability);
  }

  // Environmental modifiers
  let environmentalModifier = 1.0;
  // Rain reduces fire damage
  if (environment.weather === WeatherType.RAIN && damageType === DamageType.FIRE) {
    environmentalModifier *= 0.5;
  }
  // Storm increases sonic damage
  if (environment.weather === WeatherType.STORM && damageType === DamageType.SONIC) {
    environmentalModifier *= 1.2;
  }

  // Calculate final damage
  let finalDamage = baseDamage * bodyPartMod * criticalMultiplier;
  finalDamage = Math.max(1, finalDamage - defenseReduction);
  finalDamage *= resistanceModifier;
  finalDamage *= environmentalModifier;
  finalDamage = Math.floor(finalDamage);

  // Calculate overkill
  const overkill = Math.max(0, finalDamage - defender.health);

  return {
    baseDamage,
    finalDamage,
    damageType,
    criticalMultiplier,
    resistanceReduction: 1 - resistanceModifier,
    defenseReduction,
    environmentalModifier,
    traitModifiers: 1.0, // Placeholder for trait system integration
    overkill,
    breakdown: {
      base: baseDamage,
      attackStat: attacker.attack,
      abilityMultiplier,
      critical: criticalMultiplier,
      defense: -defenseReduction,
      resistance: 1 - resistanceModifier,
      environmental: environmentalModifier,
      traits: 1.0,
      final: finalDamage
    }
  };
}

/**
 * Create a basic enemy AI behavior tree
 * 
 * @param tier - Enemy tier (basic, elite, boss)
 * @returns Root behavior node
 */
export function createEnemyAI(tier: 'basic' | 'elite' | 'boss'): AIBehaviorNode {
  // Basic AI: Simple conditions
  const basicAI: AIBehaviorNode = {
    type: 'selector',
    children: [
      // Critical health: Try to flee or heal
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => ctx.selfHealth / ctx.selfMaxHealth < 0.15
          },
          {
            type: 'random',
            children: [
              { type: 'action', action: 'flee', weight: 60 },
              { type: 'action', action: 'defend', weight: 40 }
            ]
          }
        ]
      },
      // Low health: Defensive
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => ctx.selfHealth / ctx.selfMaxHealth < 0.30
          },
          {
            type: 'random',
            children: [
              { type: 'action', action: 'defend', weight: 50 },
              { type: 'action', action: 'attack', weight: 30 },
              { type: 'action', action: 'heal', weight: 20 }
            ]
          }
        ]
      },
      // Target is low health: Aggressive
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => ctx.targetHealth / ctx.targetMaxHealth < 0.30
          },
          {
            type: 'action',
            action: 'special_attack'
          }
        ]
      },
      // Default: Attack
      {
        type: 'random',
        children: [
          { type: 'action', action: 'attack', weight: 70 },
          { type: 'action', action: 'defend', weight: 30 }
        ]
      }
    ]
  };

  // Elite AI: More strategic
  const eliteAI: AIBehaviorNode = {
    type: 'selector',
    children: [
      // Adapt to player patterns
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => {
              // If player attacked 3+ times in a row, counter
              const recent = ctx.combatHistory.slice(-3);
              return recent.length === 3 && recent.every(h => h.playerAction === 'attack');
            }
          },
          { type: 'action', action: 'counter' }
        ]
      },
      // Target stunned: Heavy attack
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => ctx.targetStatusEffects.includes(StatusEffectType.STUNNED)
          },
          { type: 'action', action: 'heavy_attack' }
        ]
      },
      // Include basic AI as fallback
      basicAI
    ]
  };

  // Boss AI: Phase-based with enrage
  const bossAI: AIBehaviorNode = {
    type: 'selector',
    children: [
      // Phase 2: Enraged (below 50% health)
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => ctx.selfHealth / ctx.selfMaxHealth < 0.50
          },
          {
            type: 'random',
            children: [
              { type: 'action', action: 'enrage_attack', weight: 40 },
              { type: 'action', action: 'special_attack', weight: 40 },
              { type: 'action', action: 'summon_adds', weight: 20 }
            ]
          }
        ]
      },
      // Phase 3: Desperate (below 25% health)
      {
        type: 'sequence',
        children: [
          {
            type: 'condition',
            condition: (ctx) => ctx.selfHealth / ctx.selfMaxHealth < 0.25
          },
          {
            type: 'random',
            children: [
              { type: 'action', action: 'ultimate_attack', weight: 50 },
              { type: 'action', action: 'heal', weight: 30 },
              { type: 'action', action: 'enrage_attack', weight: 20 }
            ]
          }
        ]
      },
      // Include elite AI as fallback
      eliteAI
    ]
  };

  switch (tier) {
    case 'boss':
      return bossAI;
    case 'elite':
      return eliteAI;
    default:
      return basicAI;
  }
}

/**
 * Execute AI behavior tree and get decision
 * 
 * @param root - Root behavior node
 * @param context - AI context
 * @returns AI decision
 */
export function executeAI(root: AIBehaviorNode, context: AIContext): AIDecision {
  const result = evaluateNode(root, context);

  return {
    action: result.action || 'attack',
    reasoning: result.reasoning || 'Default action',
    confidence: result.confidence || 0.5
  };
}

/**
 * Evaluate a behavior tree node
 */
function evaluateNode(
  node: AIBehaviorNode,
  context: AIContext
): { action?: string; success: boolean; reasoning?: string; confidence?: number } {
  switch (node.type) {
    case 'condition':
      if (node.condition && node.condition(context)) {
        return { success: true };
      }
      return { success: false };

    case 'action':
      return {
        success: true,
        action: node.action,
        reasoning: `Selected action: ${node.action}`,
        confidence: 0.8
      };

    case 'sequence':
      // All children must succeed
      for (const child of node.children || []) {
        const result = evaluateNode(child, context);
        if (!result.success) {
          return { success: false };
        }
        if (result.action) {
          return result;
        }
      }
      return { success: true };

    case 'selector':
      // First child that succeeds
      for (const child of node.children || []) {
        const result = evaluateNode(child, context);
        if (result.success) {
          return result;
        }
      }
      return { success: false };

    case 'random': {
      // Weighted random selection
      const totalWeight = (node.children || []).reduce((sum, c) => sum + (c.weight || 1), 0);
      let roll = Math.random() * totalWeight;

      for (const child of node.children || []) {
        roll -= child.weight || 1;
        if (roll <= 0) {
          return evaluateNode(child, context);
        }
      }
      return { success: false };
    }

    default:
      return { success: false };
  }
}

/**
 * Calculate flee chance based on speed difference
 */
export function calculateFleeChance(
  fleeingSpeed: number,
  pursuerSpeed: number,
  terrain: TerrainType
): number {
  const baseChance = 50;
  const speedDiff = fleeingSpeed - pursuerSpeed;
  const speedBonus = speedDiff * 5;

  // Terrain modifiers
  let terrainMod = 0;
  if (terrain === TerrainType.DENSE_VEGETATION) {
    terrainMod = 10; // Easier to hide
  } else if (terrain === TerrainType.MUD || terrain === TerrainType.TAR_PIT) {
    terrainMod = -20; // Slower escape
  } else if (terrain === TerrainType.OPEN_GROUND) {
    terrainMod = -10; // Easier to pursue
  }

  return Math.max(10, Math.min(90, baseChance + speedBonus + terrainMod));
}

/**
 * Apply status effect with stacking rules
 */
export function applyStatusEffect(
  currentEffects: Map<StatusEffectType, { stacks: number; duration: number }>,
  effect: StatusEffectType,
  duration: number,
  stackable: boolean = false,
  maxStacks: number = 3
): void {
  const existing = currentEffects.get(effect);

  if (existing) {
    if (stackable && existing.stacks < maxStacks) {
      existing.stacks++;
    }
    existing.duration = Math.max(existing.duration, duration);
  } else {
    currentEffects.set(effect, { stacks: 1, duration });
  }
}

/**
 * Process turn-start status effects (DoT, etc.)
 */
export function processStatusEffects(
  effects: Map<StatusEffectType, { stacks: number; duration: number }>
): { damage: number; healing: number; skipped: boolean; messages: string[] } {
  let damage = 0;
  let healing = 0;
  let skipped = false;
  const messages: string[] = [];
  const toRemove: StatusEffectType[] = [];

  effects.forEach((data, effect) => {
    // Tick damage effects
    switch (effect) {
      case StatusEffectType.BLEEDING: {
        const bleedDamage = 5 * data.stacks;
        damage += bleedDamage;
        messages.push(`Bleeding for ${bleedDamage} damage`);
        break;
      }
      case StatusEffectType.POISONED: {
        const poisonDamage = 3 * data.stacks;
        damage += poisonDamage;
        messages.push(`Poisoned for ${poisonDamage} damage`);
        break;
      }
      case StatusEffectType.BURNING: {
        const burnDamage = 4 * data.stacks;
        damage += burnDamage;
        messages.push(`Burning for ${burnDamage} damage`);
        break;
      }
      case StatusEffectType.STUNNED:
      case StatusEffectType.FROZEN:
        skipped = true;
        messages.push(`${effect}! Cannot act this turn.`);
        break;
      case StatusEffectType.REGENERATING: {
        const healAmount = 5 * data.stacks;
        healing += healAmount;
        messages.push(`Regenerating ${healAmount} HP`);
        break;
      }
    }

    // Decrement duration
    data.duration--;
    if (data.duration <= 0) {
      toRemove.push(effect);
      messages.push(`${effect} wore off`);
    }
  });

  // Remove expired effects
  for (const effect of toRemove) {
    effects.delete(effect);
  }

  return { damage, healing, skipped, messages };
}
