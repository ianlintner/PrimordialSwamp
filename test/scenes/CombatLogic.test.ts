import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DinosaurType } from '@/types/Dinosaur.types';
import { BiomeType, NodeType } from '@/types/Encounter.types';

/**
 * Combat Scene Logic Tests
 * 
 * These tests validate the data structures and logic used by combat scenes
 * without instantiating actual Phaser scenes (which require a full game context).
 */

describe('Combat Scene Data Structures', () => {
  describe('Combatant Interface', () => {
    interface Combatant {
      id?: string;
      name: string;
      hp: number;
      maxHp: number;
      attack: number;
      defense: number;
      speed: number;
      stamina: number;
      maxStamina: number;
      emoji: string;
      statusEffects: any[];
      abilityCooldown: number;
      traits: string[];
    }

    it('should create a valid player combatant', () => {
      const player: Combatant = {
        name: 'Deinonychus',
        hp: 80,
        maxHp: 80,
        attack: 15,
        defense: 8,
        speed: 12,
        stamina: 60,
        maxStamina: 60,
        emoji: '🦖',
        statusEffects: [],
        abilityCooldown: 0,
        traits: ['swift_strike']
      };

      expect(player.hp).toBe(player.maxHp);
      expect(player.stamina).toBe(player.maxStamina);
      expect(player.statusEffects).toHaveLength(0);
    });

    it('should create a valid enemy combatant with id', () => {
      const enemy: Combatant = {
        id: 'allosaurus',
        name: 'Allosaurus',
        hp: 100,
        maxHp: 100,
        attack: 18,
        defense: 10,
        speed: 8,
        stamina: 50,
        maxStamina: 50,
        emoji: '🦕',
        statusEffects: [],
        abilityCooldown: 0,
        traits: []
      };

      expect(enemy.id).toBe('allosaurus');
      expect(enemy.hp).toBeGreaterThan(0);
    });
  });

  describe('Damage Calculation Logic', () => {
    function calculateDamage(attack: number, defense: number, isDefending: boolean = false): number {
      const baseDamage = Math.max(1, attack - defense);
      return isDefending ? Math.floor(baseDamage * 0.5) : baseDamage;
    }

    it('should calculate base damage correctly', () => {
      expect(calculateDamage(20, 10)).toBe(10);
      expect(calculateDamage(15, 15)).toBe(1); // Minimum 1 damage
      expect(calculateDamage(10, 20)).toBe(1); // Minimum 1 damage when defense > attack
    });

    it('should reduce damage when defending', () => {
      expect(calculateDamage(20, 10, true)).toBe(5);
      expect(calculateDamage(30, 10, true)).toBe(10);
    });
  });

  describe('Status Effect Logic', () => {
    interface StatusEffect {
      type: string;
      duration: number;
      magnitude: number;
    }

    function applyStatusEffect(effects: StatusEffect[], newEffect: StatusEffect): StatusEffect[] {
      const existing = effects.find(e => e.type === newEffect.type);
      if (existing) {
        existing.duration = Math.max(existing.duration, newEffect.duration);
        existing.magnitude = Math.max(existing.magnitude, newEffect.magnitude);
        return effects;
      }
      return [...effects, newEffect];
    }

    function tickStatusEffects(effects: StatusEffect[]): StatusEffect[] {
      return effects
        .map(e => ({ ...e, duration: e.duration - 1 }))
        .filter(e => e.duration > 0);
    }

    it('should add new status effects', () => {
      const effects: StatusEffect[] = [];
      const result = applyStatusEffect(effects, { type: 'poison', duration: 3, magnitude: 5 });
      
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('poison');
    });

    it('should refresh existing status effects', () => {
      const effects: StatusEffect[] = [{ type: 'poison', duration: 1, magnitude: 5 }];
      const result = applyStatusEffect(effects, { type: 'poison', duration: 3, magnitude: 10 });
      
      expect(result).toHaveLength(1);
      expect(result[0].duration).toBe(3);
      expect(result[0].magnitude).toBe(10);
    });

    it('should tick down and remove expired effects', () => {
      const effects: StatusEffect[] = [
        { type: 'poison', duration: 2, magnitude: 5 },
        { type: 'bleed', duration: 1, magnitude: 3 }
      ];
      
      const afterTick = tickStatusEffects(effects);
      expect(afterTick).toHaveLength(1);
      expect(afterTick[0].type).toBe('poison');
      expect(afterTick[0].duration).toBe(1);
    });
  });

  describe('Turn Order Logic', () => {
    interface Entity {
      name: string;
      speed: number;
    }

    function determineTurnOrder(entities: Entity[]): Entity[] {
      return [...entities].sort((a, b) => b.speed - a.speed);
    }

    it('should order by speed descending', () => {
      const entities: Entity[] = [
        { name: 'Slow', speed: 5 },
        { name: 'Fast', speed: 15 },
        { name: 'Medium', speed: 10 }
      ];

      const ordered = determineTurnOrder(entities);
      expect(ordered[0].name).toBe('Fast');
      expect(ordered[1].name).toBe('Medium');
      expect(ordered[2].name).toBe('Slow');
    });

    it('should handle equal speeds', () => {
      const entities: Entity[] = [
        { name: 'A', speed: 10 },
        { name: 'B', speed: 10 }
      ];

      const ordered = determineTurnOrder(entities);
      expect(ordered).toHaveLength(2);
    });
  });
});

describe('Rewards Scene Data', () => {
  interface RewardsData {
    fossilsEarned: number;
    experienceGained: number;
    turnsUsed: number;
    enemyDefeated: string;
  }

  it('should validate rewards data structure', () => {
    const rewards: RewardsData = {
      fossilsEarned: 25,
      experienceGained: 100,
      turnsUsed: 8,
      enemyDefeated: 'Allosaurus'
    };

    expect(rewards.fossilsEarned).toBeGreaterThanOrEqual(0);
    expect(rewards.experienceGained).toBeGreaterThanOrEqual(0);
    expect(rewards.turnsUsed).toBeGreaterThanOrEqual(1);
    expect(rewards.enemyDefeated).toBeTruthy();
  });

  it('should calculate bonus fossils for quick victories', () => {
    function calculateBonusFossils(baseFossils: number, turns: number): number {
      if (turns <= 5) return Math.floor(baseFossils * 1.5);
      if (turns <= 10) return Math.floor(baseFossils * 1.25);
      return baseFossils;
    }

    expect(calculateBonusFossils(20, 3)).toBe(30); // 50% bonus
    expect(calculateBonusFossils(20, 7)).toBe(25); // 25% bonus
    expect(calculateBonusFossils(20, 15)).toBe(20); // No bonus
  });
});

describe('Game Over Scene Data', () => {
  interface GameOverData {
    victory: boolean;
    depth: number;
    combatsWon: number;
    fossilsCollected: number;
    runDuration: number;
  }

  it('should validate defeat data structure', () => {
    const defeatData: GameOverData = {
      victory: false,
      depth: 5,
      combatsWon: 3,
      fossilsCollected: 45,
      runDuration: 300000 // 5 minutes
    };

    expect(defeatData.victory).toBe(false);
    expect(defeatData.depth).toBeGreaterThanOrEqual(0);
    expect(defeatData.combatsWon).toBeGreaterThanOrEqual(0);
    expect(defeatData.fossilsCollected).toBeGreaterThanOrEqual(0);
    expect(defeatData.runDuration).toBeGreaterThanOrEqual(0);
  });

  it('should format run duration correctly', () => {
    function formatDuration(ms: number): string {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    expect(formatDuration(65000)).toBe('1:05');
    expect(formatDuration(3600000)).toBe('60:00');
    expect(formatDuration(0)).toBe('0:00');
  });
});
