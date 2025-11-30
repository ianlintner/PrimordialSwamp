import { describe, it, expect, beforeEach } from 'vitest';
import { 
  DifficultyScaler, 
  resetDifficultyScaler 
} from '@/systems/DifficultyScaler';
import { CurrentRunState, BiomeType } from '@/types/Encounter.types';
import { DinosaurType } from '@/types/Dinosaur.types';

// Helper to create test run state
function createTestRunState(overrides: Partial<CurrentRunState> = {}): CurrentRunState {
  return {
    seed: 'test-seed',
    dinosaur: DinosaurType.DEINONYCHUS,
    currentNodeId: '0-0',
    nodesVisited: [],
    mapNodes: [],
    health: 100,
    stamina: 100,
    traits: [],
    inventory: [],
    biome: BiomeType.COASTAL_WETLANDS,
    depth: 0,
    fossilsCollected: 0,
    combatsWon: 0,
    startTime: Date.now(),
    ...overrides,
  };
}

describe('DifficultyScaler', () => {
  let scaler: DifficultyScaler;

  beforeEach(() => {
    resetDifficultyScaler();
    scaler = new DifficultyScaler();
  });

  describe('calculateScaling()', () => {
    it('should return base scaling at depth 0', () => {
      const runState = createTestRunState({
        depth: 0,
        health: 100,
        combatsWon: 0,
        nodesVisited: ['0-0'],
        fossilsCollected: 0,
      });

      const scaling = scaler.calculateScaling(runState);
      
      expect(scaling.enemyHealthMult).toBeCloseTo(1.0, 1);
      expect(scaling.enemyAttackMult).toBeCloseTo(1.0, 1);
      expect(scaling.rewardMult).toBeCloseTo(1.0, 1);
    });

    it('should increase scaling with depth', () => {
      const lowDepth = scaler.calculateScaling(createTestRunState({ 
        depth: 1,
        health: 100,
        combatsWon: 1,
        nodesVisited: ['0-0', '1-0'],
      }));
      
      const highDepth = scaler.calculateScaling(createTestRunState({ 
        depth: 5,
        health: 100,
        combatsWon: 5,
        nodesVisited: ['0-0', '1-0', '2-0', '3-0', '4-0', '5-0'],
      }));

      expect(highDepth.enemyHealthMult).toBeGreaterThan(lowDepth.enemyHealthMult);
      expect(highDepth.enemyAttackMult).toBeGreaterThan(lowDepth.enemyAttackMult);
      expect(highDepth.rewardMult).toBeGreaterThan(lowDepth.rewardMult);
    });

    it('should scale elite chance with depth', () => {
      const scaling0 = scaler.calculateScaling(createTestRunState({ depth: 0 }));
      const scaling5 = scaler.calculateScaling(createTestRunState({ depth: 5 }));
      
      expect(scaling5.eliteChance).toBeGreaterThan(scaling0.eliteChance);
    });

    it('should cap elite chance at maximum', () => {
      const scaling = scaler.calculateScaling(createTestRunState({ depth: 20 }));
      expect(scaling.eliteChance).toBeLessThanOrEqual(0.3);
    });
  });

  describe('scaleEnemyStats()', () => {
    it('should apply scaling to enemy stats', () => {
      const baseStats = {
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        stamina: 50,
        maxStamina: 50,
        level: 1,
        experience: 0,
      };

      const scaling = {
        enemyHealthMult: 1.5,
        enemyAttackMult: 1.3,
        enemyDefenseMult: 1.2,
        enemySpeedMult: 1.1,
        enemyCountMod: 0,
        rewardMult: 1.0,
        eliteChance: 0.1,
        xpMult: 1.0,
      };

      const scaled = scaler.scaleEnemyStats(baseStats, scaling);

      expect(scaled.health).toBe(150);
      expect(scaled.maxHealth).toBe(150);
      expect(scaled.attack).toBe(13);
      expect(scaled.defense).toBe(6);
      expect(scaled.speed).toBe(5); // floor(5 * 1.1) = 5
    });
  });

  describe('scaleReward()', () => {
    it('should apply reward multiplier', () => {
      const scaling = {
        enemyHealthMult: 1.0,
        enemyAttackMult: 1.0,
        enemyDefenseMult: 1.0,
        enemySpeedMult: 1.0,
        enemyCountMod: 0,
        rewardMult: 1.5,
        eliteChance: 0.1,
        xpMult: 1.0,
      };

      const scaledReward = scaler.scaleReward(10, scaling);
      expect(scaledReward).toBe(15);
    });
  });

  describe('scaleXP()', () => {
    it('should apply XP multiplier', () => {
      const scaling = {
        enemyHealthMult: 1.0,
        enemyAttackMult: 1.0,
        enemyDefenseMult: 1.0,
        enemySpeedMult: 1.0,
        enemyCountMod: 0,
        rewardMult: 1.0,
        eliteChance: 0.1,
        xpMult: 1.25,
      };

      const scaledXP = scaler.scaleXP(100, scaling);
      expect(scaledXP).toBe(125);
    });
  });

  describe('calculateEnemyCount()', () => {
    it('should add enemies based on modifier', () => {
      const scaling = {
        enemyHealthMult: 1.0,
        enemyAttackMult: 1.0,
        enemyDefenseMult: 1.0,
        enemySpeedMult: 1.0,
        enemyCountMod: 2,
        rewardMult: 1.0,
        eliteChance: 0.1,
        xpMult: 1.0,
      };

      const count = scaler.calculateEnemyCount(3, scaling);
      expect(count).toBe(5);
    });

    it('should not go below 1 enemy', () => {
      const scaling = {
        enemyHealthMult: 1.0,
        enemyAttackMult: 1.0,
        enemyDefenseMult: 1.0,
        enemySpeedMult: 1.0,
        enemyCountMod: -10,
        rewardMult: 1.0,
        eliteChance: 0.1,
        xpMult: 1.0,
      };

      const count = scaler.calculateEnemyCount(3, scaling);
      expect(count).toBe(1);
    });
  });

  describe('shouldSpawnElite()', () => {
    it('should use provided RNG function', () => {
      const scaling = {
        enemyHealthMult: 1.0,
        enemyAttackMult: 1.0,
        enemyDefenseMult: 1.0,
        enemySpeedMult: 1.0,
        enemyCountMod: 0,
        rewardMult: 1.0,
        eliteChance: 0.5,
        xpMult: 1.0,
      };

      // RNG that always returns 0 (should spawn elite)
      expect(scaler.shouldSpawnElite(scaling, () => 0)).toBe(true);
      
      // RNG that always returns 1 (should not spawn elite)
      expect(scaler.shouldSpawnElite(scaling, () => 1)).toBe(false);
    });
  });

  describe('getDifficultyDescription()', () => {
    it('should return appropriate descriptions', () => {
      expect(scaler.getDifficultyDescription(1.0)).toBe('Normal');
      expect(scaler.getDifficultyDescription(1.2)).toBe('Challenging');
      expect(scaler.getDifficultyDescription(1.5)).toBe('Hard');
      expect(scaler.getDifficultyDescription(1.8)).toBe('Very Hard');
      expect(scaler.getDifficultyDescription(2.3)).toBe('Extreme');
      expect(scaler.getDifficultyDescription(3.0)).toBe('Nightmare');
    });
  });

  describe('getDifficultyColor()', () => {
    it('should return different colors for different difficulties', () => {
      const normalColor = scaler.getDifficultyColor(1.0);
      const hardColor = scaler.getDifficultyColor(1.5);
      const extremeColor = scaler.getDifficultyColor(2.3);

      expect(normalColor).not.toBe(hardColor);
      expect(hardColor).not.toBe(extremeColor);
    });
  });

  describe('getCurrentCoefficient()', () => {
    it('should return coefficient based on run state', () => {
      const runState = createTestRunState({
        depth: 3,
        health: 100,
        combatsWon: 3,
        nodesVisited: ['0-0', '1-0', '2-0', '3-0'],
      });

      const coefficient = scaler.getCurrentCoefficient(runState);
      expect(coefficient).toBeGreaterThan(1.0);
    });
  });

  describe('Configuration', () => {
    it('should allow custom configuration', () => {
      const customScaler = new DifficultyScaler({
        depthMultiplier: 0.2, // Double the default
      });

      const runState = createTestRunState({
        depth: 5,
        health: 100,
        combatsWon: 5,
        nodesVisited: Array(6).fill('').map((_, i) => `${i}-0`),
      });

      const scaling = customScaler.calculateScaling(runState);
      const defaultScaling = scaler.calculateScaling(runState);

      expect(scaling.enemyHealthMult).toBeGreaterThan(defaultScaling.enemyHealthMult);
    });

    it('should update configuration', () => {
      const initialConfig = scaler.getConfig();
      
      scaler.setConfig({ maxScaling: 5.0 });
      
      const updatedConfig = scaler.getConfig();
      expect(updatedConfig.maxScaling).toBe(5.0);
      expect(updatedConfig.depthMultiplier).toBe(initialConfig.depthMultiplier);
    });
  });
});
