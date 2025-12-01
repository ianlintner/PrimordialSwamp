import { describe, it, expect } from 'vitest';
import {
  calculateHitDetection,
  calculateDamage,
  createEnemyAI,
  executeAI,
  calculateFleeChance,
  applyStatusEffect,
  processStatusEffects
} from '@/systems/CombatCore';
import {
  DamageType,
  StatusEffectType,
  BodyPart,
  WeatherType,
  TerrainType
} from '@/types/Combat.types';

describe('CombatCore', () => {
  // Helper to create basic combatant stats
  function createCombatantStats(overrides = {}) {
    return {
      attack: 10,
      defense: 5,
      speed: 7,
      health: 100,
      maxHealth: 100,
      derivedStats: {
        criticalChance: 5,
        criticalDamage: 200,
        evasion: 0,
        accuracy: 90,
        armorPenetration: 0,
        damageReduction: 0,
        staminaRegen: 10,
        healthRegen: 0,
        lifeSteal: 0,
        thorns: 0,
        blockChance: 0,
        counterChance: 0
      },
      resistances: {},
      vulnerabilities: {},
      activeStatusEffects: [],
      traits: [],
      ...overrides
    };
  }

  // Helper to create combat environment
  function createEnvironment(overrides = {}) {
    return {
      weather: WeatherType.CLEAR,
      terrain: TerrainType.OPEN_GROUND,
      timeOfDay: 'day' as const,
      visibility: 100,
      ...overrides
    };
  }

  describe('calculateHitDetection', () => {
    it('should return hit detection result with correct structure', () => {
      const attacker = createCombatantStats();
      const defender = createCombatantStats();
      const environment = createEnvironment();

      const result = calculateHitDetection(attacker, defender, environment);

      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('critical');
      expect(result).toHaveProperty('evaded');
      expect(result).toHaveProperty('blocked');
      expect(result).toHaveProperty('accuracyRoll');
      expect(result).toHaveProperty('effectiveAccuracy');
      expect(result).toHaveProperty('modifiers');
    });

    it('should apply weather accuracy penalties', () => {
      const attacker = createCombatantStats();
      const defender = createCombatantStats();
      const clearEnv = createEnvironment();
      const stormEnv = createEnvironment({ weather: WeatherType.STORM });

      const clearResult = calculateHitDetection(attacker, defender, clearEnv);
      const stormResult = calculateHitDetection(attacker, defender, stormEnv);

      expect(stormResult.effectiveAccuracy).toBeLessThan(clearResult.effectiveAccuracy);
    });

    it('should apply body part targeting penalties', () => {
      const attacker = createCombatantStats();
      const defender = createCombatantStats();
      const environment = createEnvironment();

      const bodyResult = calculateHitDetection(attacker, defender, environment, BodyPart.BODY);
      const headResult = calculateHitDetection(attacker, defender, environment, BodyPart.HEAD);

      expect(headResult.effectiveAccuracy).toBeLessThan(bodyResult.effectiveAccuracy);
    });

    it('should respect defender evasion', () => {
      const attacker = createCombatantStats();
      const defender = createCombatantStats({
        derivedStats: { ...createCombatantStats().derivedStats, evasion: 20 }
      });
      const environment = createEnvironment();

      const result = calculateHitDetection(attacker, defender, environment);

      expect(result.modifiers).toContainEqual(
        expect.objectContaining({ source: 'Defender Evasion' })
      );
    });
  });

  describe('calculateDamage', () => {
    it('should calculate base damage correctly', () => {
      const attacker = createCombatantStats({ attack: 20 });
      const defender = createCombatantStats({ defense: 5 });
      const environment = createEnvironment();
      const hitResult = {
        hit: true,
        critical: false,
        evaded: false,
        blocked: false,
        bodyPartHit: BodyPart.BODY,
        accuracyRoll: 50,
        effectiveAccuracy: 90,
        modifiers: []
      };

      const result = calculateDamage(
        attacker,
        defender,
        1.0,
        DamageType.PHYSICAL,
        hitResult,
        environment
      );

      expect(result.baseDamage).toBe(20); // attack * multiplier
      expect(result.finalDamage).toBeGreaterThan(0);
      expect(result.damageType).toBe(DamageType.PHYSICAL);
    });

    it('should apply critical damage multiplier', () => {
      const attacker = createCombatantStats({ attack: 20 });
      const defender = createCombatantStats({ defense: 5 });
      const environment = createEnvironment();

      const normalHit = {
        hit: true,
        critical: false,
        evaded: false,
        blocked: false,
        bodyPartHit: BodyPart.BODY,
        accuracyRoll: 50,
        effectiveAccuracy: 90,
        modifiers: []
      };

      const criticalHit = { ...normalHit, critical: true };

      const normalResult = calculateDamage(
        attacker,
        defender,
        1.0,
        DamageType.PHYSICAL,
        normalHit,
        environment
      );

      const criticalResult = calculateDamage(
        attacker,
        defender,
        1.0,
        DamageType.PHYSICAL,
        criticalHit,
        environment
      );

      expect(criticalResult.finalDamage).toBeGreaterThan(normalResult.finalDamage);
      expect(criticalResult.criticalMultiplier).toBe(2.0); // 200%
    });

    it('should apply body part damage multipliers', () => {
      const attacker = createCombatantStats({ attack: 20 });
      const defender = createCombatantStats({ defense: 5 });
      const environment = createEnvironment();

      const bodyHit = {
        hit: true,
        critical: false,
        evaded: false,
        blocked: false,
        bodyPartHit: BodyPart.BODY,
        accuracyRoll: 50,
        effectiveAccuracy: 90,
        modifiers: []
      };

      const underbellyHit = { ...bodyHit, bodyPartHit: BodyPart.UNDERBELLY };

      const bodyResult = calculateDamage(
        attacker,
        defender,
        1.0,
        DamageType.PHYSICAL,
        bodyHit,
        environment
      );

      const underbellyResult = calculateDamage(
        attacker,
        defender,
        1.0,
        DamageType.PHYSICAL,
        underbellyHit,
        environment
      );

      expect(underbellyResult.finalDamage).toBeGreaterThan(bodyResult.finalDamage);
    });

    it('should apply damage type resistances', () => {
      const attacker = createCombatantStats({ attack: 20 });
      const noResist = createCombatantStats({ defense: 5 });
      const withResist = createCombatantStats({
        defense: 5,
        resistances: { [DamageType.FIRE]: 0.5 }
      });
      const environment = createEnvironment();
      const hitResult = {
        hit: true,
        critical: false,
        evaded: false,
        blocked: false,
        bodyPartHit: BodyPart.BODY,
        accuracyRoll: 50,
        effectiveAccuracy: 90,
        modifiers: []
      };

      const noResistResult = calculateDamage(
        attacker,
        noResist,
        1.0,
        DamageType.FIRE,
        hitResult,
        environment
      );

      const withResistResult = calculateDamage(
        attacker,
        withResist,
        1.0,
        DamageType.FIRE,
        hitResult,
        environment
      );

      expect(withResistResult.finalDamage).toBeLessThan(noResistResult.finalDamage);
    });
  });

  describe('Enemy AI', () => {
    it('should create basic AI behavior tree', () => {
      const ai = createEnemyAI('basic');
      expect(ai).toBeDefined();
      expect(ai.type).toBe('selector');
    });

    it('should create elite AI with more behaviors', () => {
      const ai = createEnemyAI('elite');
      expect(ai).toBeDefined();
      expect(ai.type).toBe('selector');
    });

    it('should create boss AI with phase transitions', () => {
      const ai = createEnemyAI('boss');
      expect(ai).toBeDefined();
      expect(ai.type).toBe('selector');
    });

    it('should execute AI and return a decision', () => {
      const ai = createEnemyAI('basic');
      const context = {
        selfHealth: 50,
        selfMaxHealth: 100,
        selfStamina: 50,
        selfStatusEffects: [],
        targetHealth: 80,
        targetMaxHealth: 100,
        targetStatusEffects: [],
        turnNumber: 1,
        environment: createEnvironment(),
        availableAbilities: ['attack', 'defend'],
        abilityCooldowns: new Map(),
        combatHistory: []
      };

      const decision = executeAI(ai, context);

      expect(decision).toHaveProperty('action');
      expect(decision).toHaveProperty('reasoning');
      expect(decision).toHaveProperty('confidence');
    });

    it('should make defensive decisions at low health', () => {
      const ai = createEnemyAI('basic');
      const context = {
        selfHealth: 10,
        selfMaxHealth: 100,
        selfStamina: 50,
        selfStatusEffects: [],
        targetHealth: 80,
        targetMaxHealth: 100,
        targetStatusEffects: [],
        turnNumber: 1,
        environment: createEnvironment(),
        availableAbilities: ['attack', 'defend', 'flee'],
        abilityCooldowns: new Map(),
        combatHistory: []
      };

      const decision = executeAI(ai, context);

      // At 10% health, AI should try to flee or defend
      expect(['flee', 'defend']).toContain(decision.action);
    });
  });

  describe('calculateFleeChance', () => {
    it('should give higher chance when faster than pursuer', () => {
      const fastFlee = calculateFleeChance(15, 5, TerrainType.OPEN_GROUND);
      const slowFlee = calculateFleeChance(5, 15, TerrainType.OPEN_GROUND);

      expect(fastFlee).toBeGreaterThan(slowFlee);
    });

    it('should be harder in tar pits', () => {
      const openGround = calculateFleeChance(10, 10, TerrainType.OPEN_GROUND);
      const tarPit = calculateFleeChance(10, 10, TerrainType.TAR_PIT);

      expect(tarPit).toBeLessThan(openGround);
    });

    it('should be easier in dense vegetation', () => {
      const openGround = calculateFleeChance(10, 10, TerrainType.OPEN_GROUND);
      const vegetation = calculateFleeChance(10, 10, TerrainType.DENSE_VEGETATION);

      expect(vegetation).toBeGreaterThan(openGround);
    });

    it('should clamp to 10-90 range', () => {
      const veryFast = calculateFleeChance(100, 1, TerrainType.OPEN_GROUND);
      const verySlow = calculateFleeChance(1, 100, TerrainType.TAR_PIT);

      expect(veryFast).toBeLessThanOrEqual(90);
      expect(verySlow).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Status effect management', () => {
    it('should add new status effect', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();

      applyStatusEffect(effects, StatusEffectType.BLEEDING, 3, false);

      expect(effects.has(StatusEffectType.BLEEDING)).toBe(true);
      expect(effects.get(StatusEffectType.BLEEDING)?.duration).toBe(3);
      expect(effects.get(StatusEffectType.BLEEDING)?.stacks).toBe(1);
    });

    it('should stack stackable effects', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();

      applyStatusEffect(effects, StatusEffectType.BLEEDING, 3, true);
      applyStatusEffect(effects, StatusEffectType.BLEEDING, 3, true);
      applyStatusEffect(effects, StatusEffectType.BLEEDING, 3, true);

      expect(effects.get(StatusEffectType.BLEEDING)?.stacks).toBe(3);
    });

    it('should respect max stacks', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();

      for (let i = 0; i < 10; i++) {
        applyStatusEffect(effects, StatusEffectType.BLEEDING, 3, true, 3);
      }

      expect(effects.get(StatusEffectType.BLEEDING)?.stacks).toBe(3);
    });

    it('should refresh duration on reapplication', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();

      applyStatusEffect(effects, StatusEffectType.POISONED, 2, false);
      applyStatusEffect(effects, StatusEffectType.POISONED, 5, false);

      expect(effects.get(StatusEffectType.POISONED)?.duration).toBe(5);
    });
  });

  describe('processStatusEffects', () => {
    it('should deal damage from bleeding', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();
      effects.set(StatusEffectType.BLEEDING, { stacks: 2, duration: 3 });

      const result = processStatusEffects(effects);

      expect(result.damage).toBe(10); // 5 * 2 stacks
      expect(result.messages).toContainEqual(expect.stringContaining('Bleeding'));
    });

    it('should skip turn when stunned', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();
      effects.set(StatusEffectType.STUNNED, { stacks: 1, duration: 1 });

      const result = processStatusEffects(effects);

      expect(result.skipped).toBe(true);
    });

    it('should heal from regenerating', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();
      effects.set(StatusEffectType.REGENERATING, { stacks: 2, duration: 3 });

      const result = processStatusEffects(effects);

      expect(result.healing).toBe(10); // 5 * 2 stacks
    });

    it('should remove expired effects', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();
      effects.set(StatusEffectType.BLEEDING, { stacks: 1, duration: 1 });

      processStatusEffects(effects);

      expect(effects.has(StatusEffectType.BLEEDING)).toBe(false);
    });

    it('should decrement duration', () => {
      const effects = new Map<StatusEffectType, { stacks: number; duration: number }>();
      effects.set(StatusEffectType.POISONED, { stacks: 1, duration: 3 });

      processStatusEffects(effects);

      expect(effects.get(StatusEffectType.POISONED)?.duration).toBe(2);
    });
  });
});
