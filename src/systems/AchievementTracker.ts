import { Achievement, AchievementDefinition, AchievementReward } from '../types/Meta.types';
import { GameState } from '../types/GameState.types';

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Combat Achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first combat encounter',
    category: 'combat',
    target: 1,
  },
  {
    id: 'extinction_event',
    name: 'Extinction Event',
    description: 'Defeat 100 enemies total',
    category: 'combat',
    target: 100,
    reward: { type: 'fossils', value: 50 },
  },
  {
    id: 'perfect_victory',
    name: 'Perfect Victory',
    description: 'Win combat without taking damage',
    category: 'combat',
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Win at less than 10% HP',
    category: 'combat',
  },
  {
    id: 'speed_run',
    name: 'Speed Run',
    description: 'Complete encounter in under 5 turns',
    category: 'combat',
  },
  {
    id: 'overkill',
    name: 'Overkill',
    description: 'Deal 100+ damage in a single hit',
    category: 'combat',
  },
  {
    id: 'survivor_combat',
    name: 'Last Stand',
    description: 'Win 5 consecutive combats without healing',
    category: 'combat',
    target: 5,
  },

  // Progression Achievements
  {
    id: 'first_run',
    name: 'First Steps',
    description: 'Complete your first run (win or lose)',
    category: 'progression',
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete a run victoriously',
    category: 'progression',
    reward: { type: 'trait', value: 'extinction_survivor' },
  },
  {
    id: 'depth_explorer',
    name: 'Depth Explorer',
    description: 'Reach depth 5 in any biome',
    category: 'progression',
    target: 5,
  },
  {
    id: 'biome_conqueror',
    name: 'Biome Conqueror',
    description: 'Complete all biomes',
    category: 'progression',
    target: 4,
  },
  {
    id: 'master_of_evolution',
    name: 'Master of Evolution',
    description: 'Unlock all dinosaurs',
    category: 'progression',
    reward: { type: 'cosmetic', value: 'golden_skin' },
  },
  {
    id: 'trait_hunter',
    name: 'Trait Hunter',
    description: 'Acquire 30 different traits across runs',
    category: 'progression',
    target: 30,
  },
  {
    id: 'fossil_collector',
    name: 'Fossil Collector',
    description: 'Collect 500 fossil fragments total',
    category: 'progression',
    target: 500,
    reward: { type: 'fossils', value: 100 },
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Complete 50 runs',
    category: 'progression',
    target: 50,
  },

  // Discovery Achievements
  {
    id: 'paleontologist',
    name: 'Paleontologist',
    description: 'Discover all codex entries',
    category: 'discovery',
    reward: { type: 'fossils', value: 100 },
  },
  {
    id: 'fact_finder',
    name: 'Fact Finder',
    description: 'Discover 50 scientific facts',
    category: 'discovery',
    target: 50,
  },
  {
    id: 'curious_mind',
    name: 'Curious Mind',
    description: 'Discover 10 scientific facts in one run',
    category: 'discovery',
    target: 10,
  },
  {
    id: 'egg_collector',
    name: 'Egg Collector',
    description: 'Find all egg types',
    category: 'discovery',
    reward: { type: 'cosmetic', value: 'nest_background' },
  },

  // Special Achievements
  {
    id: 'darwin_award',
    name: 'Darwin Award',
    description: 'Die to the same species 3 times',
    category: 'special',
  },
  {
    id: 'against_all_odds',
    name: 'Against All Odds',
    description: 'Defeat a boss with starter dinosaur',
    category: 'special',
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Complete a run in under 15 minutes',
    category: 'special',
    reward: { type: 'dinosaur', value: 'velociraptor' },
  },
  {
    id: 'pacifist_route',
    name: 'Pacifist Route',
    description: 'Avoid 5 combat encounters in one run',
    category: 'special',
    target: 5,
  },
  {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: 'Win a run without taking any defensive traits',
    category: 'special',
  },
  {
    id: 'daily_champion',
    name: 'Daily Champion',
    description: 'Complete 7 daily challenges',
    category: 'special',
    target: 7,
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat all boss types',
    category: 'special',
    target: 4,
    reward: { type: 'trait', value: 'apex_predator' },
  },
];

/**
 * AchievementTracker - monitors and awards achievements
 */
export class AchievementTracker {
  private achievements: Map<string, Achievement>;
  private definitions: Map<string, AchievementDefinition>;
  private listeners: ((achievement: Achievement, reward?: AchievementReward) => void)[];

  constructor(savedAchievements: Achievement[] = []) {
    this.achievements = new Map();
    this.definitions = new Map();
    this.listeners = [];
    
    // Store definitions for reward lookup
    ACHIEVEMENTS.forEach(def => {
      this.definitions.set(def.id, def);
    });

    // Initialize from definitions
    ACHIEVEMENTS.forEach(def => {
      const saved = savedAchievements.find(a => a.id === def.id);
      this.achievements.set(def.id, {
        id: def.id,
        name: def.name,
        description: def.description,
        unlocked: saved?.unlocked || false,
        unlockedAt: saved?.unlockedAt,
        progress: saved?.progress || 0,
        maxProgress: def.target,
      });
    });
  }

  /**
   * Update achievement progress
   */
  updateProgress(id: string, progress: number): boolean {
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.unlocked) return false;

    achievement.progress = progress;

    if (achievement.maxProgress && progress >= achievement.maxProgress) {
      return this.unlock(id);
    }
    return false;
  }

  /**
   * Increment achievement progress
   */
  incrementProgress(id: string, amount: number = 1): boolean {
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.unlocked) return false;

    return this.updateProgress(id, (achievement.progress || 0) + amount);
  }

  /**
   * Unlock an achievement
   */
  unlock(id: string): boolean {
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.unlocked) return false;

    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();

    // Get reward if any
    const definition = this.definitions.get(id);
    const reward = definition?.reward;

    // Notify listeners
    this.listeners.forEach(listener => listener(achievement, reward));

    return true;
  }

  /**
   * Check achievements based on game state
   */
  checkAchievements(state: GameState): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const stats = state.metaProgress.statistics;
    const meta = state.metaProgress;

    // Combat achievements
    if (this.updateProgress('extinction_event', stats.totalCombats)) {
      const achievement = this.achievements.get('extinction_event');
      if (achievement) newlyUnlocked.push(achievement);
    }

    // Discovery achievements
    if (this.updateProgress('fact_finder', meta.codexEntries.length)) {
      const achievement = this.achievements.get('fact_finder');
      if (achievement) newlyUnlocked.push(achievement);
    }

    // Progression achievements
    if (this.updateProgress('depth_explorer', stats.deepestDepth)) {
      const achievement = this.achievements.get('depth_explorer');
      if (achievement) newlyUnlocked.push(achievement);
    }

    if (this.updateProgress('fossil_collector', meta.fossilFragments)) {
      const achievement = this.achievements.get('fossil_collector');
      if (achievement) newlyUnlocked.push(achievement);
    }

    if (this.updateProgress('trait_hunter', meta.unlockedTraits.length)) {
      const achievement = this.achievements.get('trait_hunter');
      if (achievement) newlyUnlocked.push(achievement);
    }

    if (this.updateProgress('veteran', meta.totalRuns)) {
      const achievement = this.achievements.get('veteran');
      if (achievement) newlyUnlocked.push(achievement);
    }

    // First run completion
    if (meta.totalRuns >= 1 && this.unlock('first_run')) {
      const achievement = this.achievements.get('first_run');
      if (achievement) newlyUnlocked.push(achievement);
    }

    // Victory achievements
    if (meta.victories > 0 && this.unlock('survivor')) {
      const achievement = this.achievements.get('survivor');
      if (achievement) newlyUnlocked.push(achievement);
    }

    // Master of evolution - check all dinosaurs unlocked
    if (meta.unlockedDinosaurs.length >= 12 && this.unlock('master_of_evolution')) {
      const achievement = this.achievements.get('master_of_evolution');
      if (achievement) newlyUnlocked.push(achievement);
    }

    return newlyUnlocked;
  }

  /**
   * Check combat-specific achievements
   */
  checkCombatAchievements(
    damageDealt: number,
    damageTaken: number,
    turnsElapsed: number,
    playerHealthPercent: number,
    won: boolean
  ): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    if (won) {
      // First blood
      if (this.unlock('first_blood')) {
        const achievement = this.achievements.get('first_blood');
        if (achievement) newlyUnlocked.push(achievement);
      }

      // Perfect victory
      if (damageTaken === 0 && this.unlock('perfect_victory')) {
        const achievement = this.achievements.get('perfect_victory');
        if (achievement) newlyUnlocked.push(achievement);
      }

      // Comeback kid
      if (playerHealthPercent < 10 && this.unlock('comeback_kid')) {
        const achievement = this.achievements.get('comeback_kid');
        if (achievement) newlyUnlocked.push(achievement);
      }

      // Speed run
      if (turnsElapsed <= 5 && this.unlock('speed_run')) {
        const achievement = this.achievements.get('speed_run');
        if (achievement) newlyUnlocked.push(achievement);
      }
    }

    // Overkill (can happen win or lose)
    if (damageDealt >= 100 && this.unlock('overkill')) {
      const achievement = this.achievements.get('overkill');
      if (achievement) newlyUnlocked.push(achievement);
    }

    return newlyUnlocked;
  }

  /**
   * Check run completion achievements
   */
  checkRunAchievements(
    victory: boolean,
    runTimeMs: number,
    isStarterDinosaur: boolean,
    defeatedBoss: boolean,
    combatsAvoided: number
  ): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    if (victory) {
      // Speedster (under 15 minutes)
      if (runTimeMs < 15 * 60 * 1000 && this.unlock('speedster')) {
        const achievement = this.achievements.get('speedster');
        if (achievement) newlyUnlocked.push(achievement);
      }

      // Against all odds
      if (isStarterDinosaur && defeatedBoss && this.unlock('against_all_odds')) {
        const achievement = this.achievements.get('against_all_odds');
        if (achievement) newlyUnlocked.push(achievement);
      }
    }

    // Pacifist route
    if (this.updateProgress('pacifist_route', combatsAvoided)) {
      const achievement = this.achievements.get('pacifist_route');
      if (achievement) newlyUnlocked.push(achievement);
    }

    return newlyUnlocked;
  }

  /**
   * Record death by enemy type for Darwin Award
   */
  recordDeath(enemyType: string, deathsByEnemy: Record<string, number>): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    const deaths = (deathsByEnemy[enemyType] || 0) + 1;
    if (deaths >= 3 && this.unlock('darwin_award')) {
      const achievement = this.achievements.get('darwin_award');
      if (achievement) newlyUnlocked.push(achievement);
    }

    return newlyUnlocked;
  }

  /**
   * Subscribe to achievement unlocks
   */
  onUnlock(callback: (achievement: Achievement, reward?: AchievementReward) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index >= 0) this.listeners.splice(index, 1);
    };
  }

  /**
   * Get all achievements for display
   */
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Get achievements by category
   */
  getAchievementsByCategory(category: string): Achievement[] {
    return ACHIEVEMENTS
      .filter(def => def.category === category)
      .map(def => this.achievements.get(def.id))
      .filter((a): a is Achievement => a !== undefined);
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => a.unlocked);
  }

  /**
   * Get locked achievements
   */
  getLockedAchievements(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => !a.unlocked);
  }

  /**
   * Get achievement by id
   */
  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }

  /**
   * Get achievement definition (for rewards)
   */
  getDefinition(id: string): AchievementDefinition | undefined {
    return this.definitions.get(id);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const total = this.achievements.size;
    const unlocked = this.getUnlockedAchievements().length;
    return total > 0 ? (unlocked / total) * 100 : 0;
  }

  /**
   * Serialize achievements for saving
   */
  toJSON(): Achievement[] {
    return Array.from(this.achievements.values());
  }
}

// Singleton instance
let achievementTrackerInstance: AchievementTracker | null = null;

/**
 * Get or create the singleton AchievementTracker instance
 */
export function getAchievementTracker(savedAchievements?: Achievement[]): AchievementTracker {
  if (!achievementTrackerInstance) {
    achievementTrackerInstance = new AchievementTracker(savedAchievements || []);
  }
  return achievementTrackerInstance;
}

/**
 * Reset the singleton (for testing or new game)
 */
export function resetAchievementTracker(): void {
  achievementTrackerInstance = null;
}
