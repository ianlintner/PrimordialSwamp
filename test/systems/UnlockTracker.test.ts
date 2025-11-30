import { describe, it, expect, beforeEach } from 'vitest';
import { UnlockTracker, resetUnlockTracker } from '@/systems/UnlockTracker';
import { DinosaurType } from '@/types/Dinosaur.types';
import { MetaProgressState } from '@/types/GameState.types';

// Helper to create test meta progress
function createTestMetaProgress(overrides: Partial<MetaProgressState> = {}): MetaProgressState {
  return {
    fossilFragments: 0,
    unlockedDinosaurs: [DinosaurType.DEINONYCHUS],
    unlockedTraits: [],
    codexEntries: [],
    achievements: [],
    totalRuns: 0,
    victories: 0,
    totalDeaths: 0,
    statistics: {
      totalPlayTime: 0,
      totalEncounters: 0,
      totalCombats: 0,
      deepestDepth: 0,
      mostFossilsInRun: 0,
      fastestVictory: 0,
      longestRun: 0,
      encountersByType: {},
      deathsByEnemy: {},
    },
    ...overrides,
  };
}

describe('UnlockTracker', () => {
  let tracker: UnlockTracker;

  beforeEach(() => {
    resetUnlockTracker();
    tracker = new UnlockTracker();
  });

  describe('Constructor', () => {
    it('should load unlock definitions from data files', () => {
      const unlockables = tracker.getAllUnlockables();
      expect(unlockables.length).toBeGreaterThan(0);
    });

    it('should have dinosaur unlocks registered', () => {
      const dinosaurUnlocks = tracker.getUnlockablesByCategory('dinosaur');
      expect(dinosaurUnlocks.length).toBeGreaterThan(0);
    });
  });

  describe('checkCondition()', () => {
    it('should return true for "always" condition', () => {
      const metaProgress = createTestMetaProgress();
      const result = tracker.checkCondition({ type: 'always' }, metaProgress);
      expect(result).toBe(true);
    });

    it('should check depth condition correctly', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 5,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      expect(tracker.checkCondition({ type: 'depth', value: 5 }, metaProgress)).toBe(true);
      expect(tracker.checkCondition({ type: 'depth', value: 6 }, metaProgress)).toBe(false);
    });

    it('should check wins condition correctly', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 10,
          deepestDepth: 0,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      expect(tracker.checkCondition({ type: 'wins', value: 10 }, metaProgress)).toBe(true);
      expect(tracker.checkCondition({ type: 'wins', value: 15 }, metaProgress)).toBe(false);
    });

    it('should check discoveries condition correctly', () => {
      const metaProgress = createTestMetaProgress({
        codexEntries: ['entry1', 'entry2', 'entry3'],
      });

      expect(tracker.checkCondition({ type: 'discoveries', value: 3 }, metaProgress)).toBe(true);
      expect(tracker.checkCondition({ type: 'discoveries', value: 5 }, metaProgress)).toBe(false);
    });

    it('should check fossil_count condition correctly', () => {
      const metaProgress = createTestMetaProgress({
        fossilFragments: 100,
      });

      expect(tracker.checkCondition({ type: 'fossil_count', value: 100 }, metaProgress)).toBe(true);
      expect(tracker.checkCondition({ type: 'fossil_count', value: 150 }, metaProgress)).toBe(false);
    });

    it('should check run_count condition correctly', () => {
      const metaProgress = createTestMetaProgress({
        totalRuns: 25,
      });

      expect(tracker.checkCondition({ type: 'run_count', value: 25 }, metaProgress)).toBe(true);
      expect(tracker.checkCondition({ type: 'run_count', value: 50 }, metaProgress)).toBe(false);
    });
  });

  describe('isUnlocked()', () => {
    it('should return true for starter dinosaurs', () => {
      const metaProgress = createTestMetaProgress();
      expect(tracker.isUnlocked('deinonychus', 'dinosaur', metaProgress)).toBe(true);
    });

    it('should return false for locked dinosaurs', () => {
      const metaProgress = createTestMetaProgress();
      // Tyrannosaurus requires depth 5
      expect(tracker.isUnlocked('tyrannosaurus', 'dinosaur', metaProgress)).toBe(false);
    });

    it('should return true after unlocking', () => {
      const metaProgress = createTestMetaProgress({
        unlockedDinosaurs: [DinosaurType.DEINONYCHUS, DinosaurType.TYRANNOSAURUS],
      });
      expect(tracker.isUnlocked('tyrannosaurus', 'dinosaur', metaProgress)).toBe(true);
    });
  });

  describe('getUnlockProgress()', () => {
    it('should return correct progress for depth-based unlock', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 3,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      const progress = tracker.getUnlockProgress('tyrannosaurus', metaProgress);
      expect(progress.current).toBe(3);
      expect(progress.target).toBe(5);
      expect(progress.percentage).toBe(60);
    });

    it('should cap percentage at 100', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 10,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      const progress = tracker.getUnlockProgress('tyrannosaurus', metaProgress);
      expect(progress.percentage).toBe(100);
    });
  });

  describe('checkAllUnlocks()', () => {
    it('should return newly unlocked items when conditions are met', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 5, // Unlocks T-Rex
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      const newUnlocks = tracker.checkAllUnlocks(metaProgress);
      const tRexUnlock = newUnlocks.find(u => u.id === 'tyrannosaurus');
      expect(tRexUnlock).toBeDefined();
    });

    it('should not return already unlocked items', () => {
      const metaProgress = createTestMetaProgress({
        unlockedDinosaurs: [DinosaurType.DEINONYCHUS, DinosaurType.TYRANNOSAURUS],
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 5,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      const newUnlocks = tracker.checkAllUnlocks(metaProgress);
      const tRexUnlock = newUnlocks.find(u => u.id === 'tyrannosaurus');
      expect(tRexUnlock).toBeUndefined();
    });
  });

  describe('applyPendingUnlocks()', () => {
    it('should add newly unlocked dinosaurs to meta progress', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 5,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      tracker.checkAllUnlocks(metaProgress);
      const updated = tracker.applyPendingUnlocks(metaProgress);

      expect(updated.unlockedDinosaurs).toContain('tyrannosaurus');
    });

    it('should not duplicate unlocks', () => {
      const metaProgress = createTestMetaProgress({
        unlockedDinosaurs: [DinosaurType.DEINONYCHUS],
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 5,
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      tracker.checkAllUnlocks(metaProgress);
      const updated = tracker.applyPendingUnlocks(metaProgress);
      
      // Apply again with the updated state
      tracker.checkAllUnlocks(updated);
      const doubleUpdated = tracker.applyPendingUnlocks(updated);

      const tRexCount = doubleUpdated.unlockedDinosaurs.filter(d => d === 'tyrannosaurus').length;
      expect(tRexCount).toBeLessThanOrEqual(1);
    });
  });

  describe('getLockedItems()', () => {
    it('should return items that are not yet unlocked', () => {
      const metaProgress = createTestMetaProgress();
      const locked = tracker.getLockedItems(metaProgress);
      
      expect(locked.length).toBeGreaterThan(0);
      // Should include T-Rex since depth is 0
      expect(locked.some(item => item.id === 'tyrannosaurus')).toBe(true);
    });
  });

  describe('getNextUnlockable()', () => {
    it('should return the closest unlock to completion', () => {
      const metaProgress = createTestMetaProgress({
        statistics: {
          totalPlayTime: 0,
          totalEncounters: 0,
          totalCombats: 0,
          deepestDepth: 4, // 80% to T-Rex
          mostFossilsInRun: 0,
          fastestVictory: 0,
          longestRun: 0,
          encountersByType: {},
          deathsByEnemy: {},
        },
      });

      const next = tracker.getNextUnlockable(metaProgress);
      expect(next).not.toBeNull();
      expect(next?.progress.percentage).toBeGreaterThan(0);
    });
  });
});
