import { DinosaurType } from '../types/Dinosaur.types';
import { MetaProgressState } from '../types/GameState.types';
import { 
  UnlockType, 
  UnlockCondition, 
  UnlockableItem, 
  UnlockProgress,
  UnlockCategory 
} from '../types/Meta.types';
import dinosaursData from '../data/dinosaurs.json';
import traitsData from '../data/traits.json';

/**
 * Trait data interface for JSON parsing
 */
interface TraitData {
  id: string;
  unlockCondition?: UnlockCondition;
}

/**
 * Dinosaur data interface for JSON parsing
 */
interface DinosaurData {
  id: string;
  unlockCondition?: UnlockCondition;
}

/**
 * UnlockTracker - manages checking and applying unlock conditions
 */
export class UnlockTracker {
  private unlockRegistry: Map<string, UnlockableItem>;
  private pendingUnlocks: string[];

  constructor() {
    this.unlockRegistry = new Map();
    this.pendingUnlocks = [];
    this.loadUnlockDefinitions();
  }

  /**
   * Load unlock definitions from data files
   */
  private loadUnlockDefinitions(): void {
    // Load dinosaur unlocks
    (dinosaursData as DinosaurData[]).forEach(dino => {
      if (dino.unlockCondition) {
        this.unlockRegistry.set(dino.id, {
          id: dino.id,
          category: 'dinosaur',
          condition: dino.unlockCondition,
        });
      }
    });

    // Load trait unlocks
    (traitsData as TraitData[]).forEach(trait => {
      if (trait.unlockCondition) {
        this.unlockRegistry.set(trait.id, {
          id: trait.id,
          category: 'trait',
          condition: trait.unlockCondition,
        });
      }
    });
  }

  /**
   * Register a custom unlock condition
   */
  registerUnlock(item: UnlockableItem): void {
    this.unlockRegistry.set(item.id, item);
  }

  /**
   * Check if a specific unlock condition is met
   */
  checkCondition(condition: UnlockCondition, metaProgress: MetaProgressState): boolean {
    const stats = metaProgress.statistics;
    
    switch (condition.type) {
      case UnlockType.ALWAYS:
      case 'always':
        return true;

      case UnlockType.DEPTH:
      case 'depth':
        return stats.deepestDepth >= (condition.value as number);

      case UnlockType.WINS:
      case 'wins':
        return stats.totalCombats >= (condition.value as number);

      case UnlockType.DISCOVERIES:
      case 'discoveries':
        return metaProgress.codexEntries.length >= (condition.value as number);

      case UnlockType.ACHIEVEMENT:
      case 'achievement':
        return metaProgress.achievements.some(
          a => a.id === condition.value && a.unlocked
        );

      case UnlockType.FOSSIL_COUNT:
      case 'fossil_count':
        return metaProgress.fossilFragments >= (condition.value as number);

      case UnlockType.RUN_COUNT:
      case 'run_count':
        return metaProgress.totalRuns >= (condition.value as number);

      case UnlockType.BOSS_DEFEAT:
      case 'boss_defeat': {
        // Check if bossesDefeated exists in extended stats
        const bossesDefeated = (stats as { bossesDefeated?: Record<string, number> }).bossesDefeated;
        if (bossesDefeated && typeof condition.value === 'string') {
          return (bossesDefeated[condition.value] || 0) > 0;
        }
        return false;
      }

      default:
        return false;
    }
  }

  /**
   * Check all unlock conditions and return newly unlocked items
   */
  checkAllUnlocks(metaProgress: MetaProgressState): UnlockableItem[] {
    const newUnlocks: UnlockableItem[] = [];
    this.pendingUnlocks = [];

    this.unlockRegistry.forEach((item, id) => {
      // Skip if already unlocked
      if (this.isUnlocked(id, item.category, metaProgress)) return;

      // Check condition
      if (this.checkCondition(item.condition, metaProgress)) {
        newUnlocks.push(item);
        this.pendingUnlocks.push(id);
      }
    });

    return newUnlocks;
  }

  /**
   * Apply pending unlocks to meta progress
   * Returns the modified meta progress
   */
  applyPendingUnlocks(metaProgress: MetaProgressState): MetaProgressState {
    const updated = { ...metaProgress };

    this.pendingUnlocks.forEach(id => {
      const item = this.unlockRegistry.get(id);
      if (!item) return;

      switch (item.category) {
        case 'dinosaur':
          if (!updated.unlockedDinosaurs.includes(id as DinosaurType)) {
            updated.unlockedDinosaurs = [...updated.unlockedDinosaurs, id as DinosaurType];
          }
          break;

        case 'trait':
          if (!updated.unlockedTraits.includes(id)) {
            updated.unlockedTraits = [...updated.unlockedTraits, id];
          }
          break;

        case 'encounter':
          // Would add to unlockedEncounters if that field exists
          break;

        case 'ability':
          // Would add to unlockedAbilities if that field exists
          break;
      }
    });

    this.pendingUnlocks = [];
    return updated;
  }

  /**
   * Check if an item is unlocked
   */
  isUnlocked(id: string, category: UnlockCategory, metaProgress: MetaProgressState): boolean {
    const item = this.unlockRegistry.get(id);
    
    // Unknown items or items without unlock conditions are considered unlocked
    if (!item) {
      // Check if it's a dinosaur that might be unlocked by default
      if (category === 'dinosaur') {
        return metaProgress.unlockedDinosaurs.includes(id as DinosaurType);
      }
      return true;
    }

    // Check 'always' condition
    if (item.condition.type === UnlockType.ALWAYS || item.condition.type === 'always') {
      return true;
    }

    switch (category) {
      case 'dinosaur':
        return metaProgress.unlockedDinosaurs.includes(id as DinosaurType);
      case 'trait':
        return metaProgress.unlockedTraits.includes(id);
      default:
        return false;
    }
  }

  /**
   * Get progress towards an unlock
   */
  getUnlockProgress(id: string, metaProgress: MetaProgressState): UnlockProgress {
    const item = this.unlockRegistry.get(id);
    if (!item) return { current: 0, target: 0, percentage: 100 };

    const condition = item.condition;
    let current = 0;
    const target = (typeof condition.value === 'number' ? condition.value : 0);

    switch (condition.type) {
      case UnlockType.DEPTH:
      case 'depth':
        current = metaProgress.statistics.deepestDepth;
        break;
      case UnlockType.WINS:
      case 'wins':
        current = metaProgress.statistics.totalCombats;
        break;
      case UnlockType.DISCOVERIES:
      case 'discoveries':
        current = metaProgress.codexEntries.length;
        break;
      case UnlockType.FOSSIL_COUNT:
      case 'fossil_count':
        current = metaProgress.fossilFragments;
        break;
      case UnlockType.RUN_COUNT:
      case 'run_count':
        current = metaProgress.totalRuns;
        break;
      case UnlockType.ALWAYS:
      case 'always':
        return { current: 1, target: 1, percentage: 100 };
    }

    return {
      current,
      target,
      percentage: target > 0 ? Math.min(100, (current / target) * 100) : 100,
    };
  }

  /**
   * Get all registered unlockables
   */
  getAllUnlockables(): UnlockableItem[] {
    return Array.from(this.unlockRegistry.values());
  }

  /**
   * Get unlockables by category
   */
  getUnlockablesByCategory(category: UnlockCategory): UnlockableItem[] {
    return Array.from(this.unlockRegistry.values())
      .filter(item => item.category === category);
  }

  /**
   * Get locked items for display
   */
  getLockedItems(metaProgress: MetaProgressState): UnlockableItem[] {
    return Array.from(this.unlockRegistry.values())
      .filter(item => !this.isUnlocked(item.id, item.category, metaProgress));
  }

  /**
   * Get next unlockable item (closest to being unlocked)
   */
  getNextUnlockable(metaProgress: MetaProgressState): { item: UnlockableItem; progress: UnlockProgress } | null {
    let closest: { item: UnlockableItem; progress: UnlockProgress } | null = null;
    let highestPercentage = -1;

    this.getLockedItems(metaProgress).forEach(item => {
      const progress = this.getUnlockProgress(item.id, metaProgress);
      if (progress.percentage > highestPercentage && progress.percentage < 100) {
        highestPercentage = progress.percentage;
        closest = { item, progress };
      }
    });

    return closest;
  }
}

// Singleton instance
let unlockTrackerInstance: UnlockTracker | null = null;

/**
 * Get the singleton UnlockTracker instance
 */
export function getUnlockTracker(): UnlockTracker {
  if (!unlockTrackerInstance) {
    unlockTrackerInstance = new UnlockTracker();
  }
  return unlockTrackerInstance;
}

/**
 * Reset the singleton (for testing)
 */
export function resetUnlockTracker(): void {
  unlockTrackerInstance = null;
}
