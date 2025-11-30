import { CurrentRunState } from '../types/Encounter.types';
import { Stats } from '../types/Dinosaur.types';

/**
 * Scaling factors applied to enemies and rewards
 */
export interface ScalingFactors {
  enemyHealthMult: number;
  enemyAttackMult: number;
  enemyDefenseMult: number;
  enemySpeedMult: number;
  enemyCountMod: number;
  rewardMult: number;
  eliteChance: number;
  xpMult: number;
}

/**
 * Difficulty configuration
 */
export interface DifficultyConfig {
  baseCoefficient: number;
  depthMultiplier: number;
  performanceWeight: number;
  maxScaling: number;
}

/**
 * Default difficulty configuration
 */
const DEFAULT_CONFIG: DifficultyConfig = {
  baseCoefficient: 1.0,
  depthMultiplier: 0.1,
  performanceWeight: 0.15,
  maxScaling: 3.0,
};

/**
 * DifficultyScaler - manages dynamic difficulty adjustment
 */
export class DifficultyScaler {
  private config: DifficultyConfig;

  constructor(config: Partial<DifficultyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate scaling factors for current run state
   */
  calculateScaling(runState: CurrentRunState): ScalingFactors {
    const depth = runState.depth;
    const performance = this.calculatePerformance(runState);
    const coefficient = this.calculateCoefficient(depth, performance);

    return {
      enemyHealthMult: 1.0 + (coefficient - 1.0) * 0.5,
      enemyAttackMult: 1.0 + (coefficient - 1.0) * 0.3,
      enemyDefenseMult: 1.0 + (coefficient - 1.0) * 0.2,
      enemySpeedMult: 1.0 + (coefficient - 1.0) * 0.1,
      enemyCountMod: Math.floor((coefficient - 1.0) / 0.5),
      rewardMult: 1.0 + (coefficient - 1.0) * 0.4,
      eliteChance: Math.min(0.3, 0.05 + depth * 0.03),
      xpMult: 1.0 + (coefficient - 1.0) * 0.3,
    };
  }

  /**
   * Calculate player performance score (0-1)
   * Higher score = player doing well = harder difficulty
   */
  private calculatePerformance(runState: CurrentRunState): number {
    // Assuming max health is around 100-150 depending on dinosaur
    const maxHealth = 100;
    const healthPercent = Math.min(1, runState.health / maxHealth);
    
    // Combat efficiency: wins vs nodes visited
    const nodesVisited = Math.max(1, runState.nodesVisited.length);
    const combatEfficiency = Math.min(1, runState.combatsWon / nodesVisited);
    
    // Resource efficiency: fossils per depth
    const expectedFossilsPerDepth = 10;
    const expectedFossils = (runState.depth + 1) * expectedFossilsPerDepth;
    const resourceEfficiency = Math.min(1, runState.fossilsCollected / Math.max(1, expectedFossils));

    // Weighted average
    return (
      healthPercent * 0.4 + 
      combatEfficiency * 0.4 + 
      resourceEfficiency * 0.2
    );
  }

  /**
   * Calculate difficulty coefficient
   */
  private calculateCoefficient(depth: number, performance: number): number {
    // Base scaling from depth
    const depthFactor = this.config.baseCoefficient + depth * this.config.depthMultiplier;
    
    // Performance adjustment (-0.5 to +0.5 centered on average performance)
    const performanceFactor = 1.0 + (performance - 0.5) * this.config.performanceWeight;
    
    // Combined scaling, capped at max
    const combined = depthFactor * performanceFactor;
    return Math.min(this.config.maxScaling, Math.max(1.0, combined));
  }

  /**
   * Apply scaling to enemy stats
   */
  scaleEnemyStats(baseStats: Stats, scaling: ScalingFactors): Stats {
    return {
      ...baseStats,
      health: Math.floor(baseStats.health * scaling.enemyHealthMult),
      maxHealth: Math.floor(baseStats.maxHealth * scaling.enemyHealthMult),
      attack: Math.floor(baseStats.attack * scaling.enemyAttackMult),
      defense: Math.floor(baseStats.defense * scaling.enemyDefenseMult),
      speed: Math.floor(baseStats.speed * scaling.enemySpeedMult),
    };
  }

  /**
   * Calculate scaled reward amount
   */
  scaleReward(baseReward: number, scaling: ScalingFactors): number {
    return Math.floor(baseReward * scaling.rewardMult);
  }

  /**
   * Calculate scaled XP
   */
  scaleXP(baseXP: number, scaling: ScalingFactors): number {
    return Math.floor(baseXP * scaling.xpMult);
  }

  /**
   * Determine number of enemies in an encounter
   */
  calculateEnemyCount(baseCount: number, scaling: ScalingFactors): number {
    return Math.max(1, baseCount + scaling.enemyCountMod);
  }

  /**
   * Check if encounter should be elite
   */
  shouldSpawnElite(scaling: ScalingFactors, rng?: () => number): boolean {
    const random = rng ? rng() : Math.random();
    return random < scaling.eliteChance;
  }

  /**
   * Get difficulty description for UI
   */
  getDifficultyDescription(coefficient: number): string {
    if (coefficient < 1.1) return 'Normal';
    if (coefficient < 1.3) return 'Challenging';
    if (coefficient < 1.6) return 'Hard';
    if (coefficient < 2.0) return 'Very Hard';
    if (coefficient < 2.5) return 'Extreme';
    return 'Nightmare';
  }

  /**
   * Get difficulty color for UI
   */
  getDifficultyColor(coefficient: number): number {
    if (coefficient < 1.1) return 0x4a9d5f; // Green
    if (coefficient < 1.3) return 0xe8a735; // Yellow
    if (coefficient < 1.6) return 0xe88035; // Orange
    if (coefficient < 2.0) return 0xd94a3d; // Red
    if (coefficient < 2.5) return 0x9d4ad9; // Purple
    return 0x4a4a4a; // Dark (Nightmare)
  }

  /**
   * Calculate current difficulty coefficient for display
   */
  getCurrentCoefficient(runState: CurrentRunState): number {
    const performance = this.calculatePerformance(runState);
    return this.calculateCoefficient(runState.depth, performance);
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<DifficultyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): DifficultyConfig {
    return { ...this.config };
  }
}

// Singleton instance
let difficultyScalerInstance: DifficultyScaler | null = null;

/**
 * Get the singleton DifficultyScaler instance
 */
export function getDifficultyScaler(): DifficultyScaler {
  if (!difficultyScalerInstance) {
    difficultyScalerInstance = new DifficultyScaler();
  }
  return difficultyScalerInstance;
}

/**
 * Reset the singleton (for testing)
 */
export function resetDifficultyScaler(): void {
  difficultyScalerInstance = null;
}
