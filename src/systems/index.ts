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
