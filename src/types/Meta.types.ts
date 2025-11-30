import { DinosaurType } from './Dinosaur.types';

/**
 * Unlock condition types
 */
export enum UnlockType {
  ALWAYS = 'always',
  DEPTH = 'depth',
  WINS = 'wins',
  DISCOVERIES = 'discoveries',
  ACHIEVEMENT = 'achievement',
  FOSSIL_COUNT = 'fossil_count',
  BOSS_DEFEAT = 'boss_defeat',
  RUN_COUNT = 'run_count',
}

/**
 * Unlock condition definition
 */
export interface UnlockCondition {
  type: UnlockType | string;
  value?: number | string;
  description?: string;
}

/**
 * Unlockable item categories
 */
export type UnlockCategory = 'dinosaur' | 'trait' | 'encounter' | 'ability';

/**
 * Unlockable item definition
 */
export interface UnlockableItem {
  id: string;
  category: UnlockCategory;
  condition: UnlockCondition;
  name?: string;
}

/**
 * Achievement categories
 */
export type AchievementCategory = 'combat' | 'progression' | 'discovery' | 'special';

/**
 * Achievement reward types
 */
export interface AchievementReward {
  type: 'fossils' | 'trait' | 'dinosaur' | 'cosmetic';
  value: string | number;
}

/**
 * Achievement definition
 */
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  target?: number;
  reward?: AchievementReward;
}

/**
 * Daily challenge data
 */
export interface DailyChallenge {
  seed: string;
  date: string;
  modifiers: ChallengeModifier[];
  completed: boolean;
  score?: number;
  dinosaurUsed?: DinosaurType;
  completionTime?: number;
}

/**
 * Challenge modifiers
 */
export interface ChallengeModifier {
  id: string;
  name: string;
  description: string;
  effect: ChallengeModifierEffect;
}

/**
 * Challenge modifier effects
 */
export interface ChallengeModifierEffect {
  type: 'stat_modifier' | 'enemy_modifier' | 'resource_modifier' | 'special';
  stat?: string;
  value?: number;
  multiplier?: number;
}

/**
 * Run history entry
 */
export interface RunHistoryEntry {
  id: string;
  seed: string;
  dinosaur: DinosaurType;
  startTime: number;
  endTime: number;
  victory: boolean;
  depth: number;
  fossilsCollected: number;
  combatsWon: number;
  deathCause?: string;
  traitsAcquired: string[];
  bossesDefeated: string[];
}

/**
 * Extended meta progress with new fields
 */
export interface ExtendedMetaProgress {
  // Existing fields from MetaProgressState
  fossilFragments: number;
  unlockedDinosaurs: DinosaurType[];
  unlockedTraits: string[];
  codexEntries: string[];
  achievements: Achievement[];
  totalRuns: number;
  victories: number;
  totalDeaths: number;
  
  // New fields for roguelite features
  researchPoints: number;
  eggsCollected: string[];
  unlockedEncounters: string[];
  runHistory: RunHistoryEntry[];
  dailyChallenges: {
    completed: string[]; // Date strings
    bestScores: Record<string, number>;
  };
  bossesDefeated: Record<string, number>;
}

/**
 * Achievement instance (runtime state)
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

/**
 * Unlock progress tracking
 */
export interface UnlockProgress {
  current: number;
  target: number;
  percentage: number;
}

/**
 * Synergy definition for trait combinations
 */
export interface SynergyDefinition {
  id: string;
  name: string;
  description: string;
  requiredTraits: string[];
  minTraitsRequired: number;
  bonus: SynergyBonus;
}

/**
 * Synergy bonus effect
 */
export interface SynergyBonus {
  type: 'stat' | 'ability' | 'special';
  stat?: string;
  value?: number;
  multiplier?: number;
  abilityUnlock?: string;
}

/**
 * Build archetype definition
 */
export interface BuildArchetype {
  id: string;
  name: string;
  description: string;
  recommendedDinosaur: DinosaurType;
  coreTraits: string[];
  supportTraits: string[];
  playstyle: string;
  synergies: string[];
}
