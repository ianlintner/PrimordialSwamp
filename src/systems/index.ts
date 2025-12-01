/**
 * Systems module exports
 * 
 * Core roguelite systems for PrimordialSwamp
 */

// UnlockTracker - manages unlock conditions and progress
export { 
  UnlockTracker, 
  getUnlockTracker, 
  resetUnlockTracker 
} from './UnlockTracker';

// AchievementTracker - monitors and awards achievements
export { 
  AchievementTracker, 
  getAchievementTracker, 
  resetAchievementTracker,
  ACHIEVEMENTS 
} from './AchievementTracker';

// DifficultyScaler - dynamic difficulty adjustment
export { 
  DifficultyScaler, 
  getDifficultyScaler, 
  resetDifficultyScaler 
} from './DifficultyScaler';
export type { ScalingFactors, DifficultyConfig } from './DifficultyScaler';

// MapGenerator - procedural map generation
export { 
  MapGenerator, 
  validateMapConnectivity, 
  findAllPaths 
} from './MapGenerator';
export type { MapConfig } from './MapGenerator';

// EvolutionSystem - player-driven mutation paths
export {
  EvolutionSystem,
  getEvolutionSystem,
  resetEvolutionSystem,
  EvolutionBranch,
  MutationTier,
  MutationErrorCode
} from './EvolutionSystem';
export type {
  Mutation,
  MutationPrerequisites,
  MutationEffect,
  MutationResult,
  BranchSelectionEvent,
  EvolutionVisualFeedback
} from './EvolutionSystem';

// ResourceSystem - energy, nutrients, and rarity management
export {
  ResourceSystem,
  getResourceSystem,
  resetResourceSystem,
  ResourceType,
  Rarity,
  RARITY_CONFIG,
  BIOME_MODIFIERS,
  BASE_RESOURCE_VALUES
} from './ResourceSystem';
export type {
  RarityConfig,
  ResourceDrop,
  BiomeResourceModifier,
  ResourceInventory,
  ResourceTransaction,
  ResourceCollectionEvent
} from './ResourceSystem';

// CombatCore - enhanced combat mechanics with hit detection and AI
export {
  calculateHitDetection,
  calculateDamage,
  createEnemyAI,
  executeAI,
  calculateFleeChance,
  applyStatusEffect,
  processStatusEffects
} from './CombatCore';
export type {
  HitDetectionResult,
  HitModifier,
  DamageCalculationResult,
  DamageBreakdown,
  CombatantStats,
  CombatEnvironment,
  AIBehaviorNode,
  AIContext,
  AIDecision,
  AIHistoryEntry
} from './CombatCore';
