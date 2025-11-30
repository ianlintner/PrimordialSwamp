import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  AchievementTracker, 
  resetAchievementTracker, 
  ACHIEVEMENTS 
} from '@/systems/AchievementTracker';
import { Achievement } from '@/types/Meta.types';
import { GameState, MetaProgressState } from '@/types/GameState.types';
import { DinosaurType } from '@/types/Dinosaur.types';

// Helper to create test game state
function createTestGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    currentRun: null,
    metaProgress: {
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
    },
    settings: {
      volume: 1,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      masterVolume: 1,
      accessibility: {
        highContrast: false,
        colorBlindMode: 'none',
        textSize: 1,
        screenReader: false,
        reducedMotion: false,
        autoAdvanceText: false,
      },
      graphics: {
        particleEffects: true,
        screenShake: true,
        flashEffects: true,
        pixelPerfect: true,
      },
      controls: {
        keyBindings: {},
        gamepadEnabled: true,
        touchControls: false,
      },
    },
    ...overrides,
  };
}

describe('AchievementTracker', () => {
  let tracker: AchievementTracker;

  beforeEach(() => {
    resetAchievementTracker();
    tracker = new AchievementTracker();
  });

  describe('Constructor', () => {
    it('should initialize all achievements from definitions', () => {
      const all = tracker.getAllAchievements();
      expect(all.length).toBe(ACHIEVEMENTS.length);
    });

    it('should initialize achievements as locked', () => {
      const all = tracker.getAllAchievements();
      expect(all.every(a => !a.unlocked)).toBe(true);
    });

    it('should restore saved achievements', () => {
      const savedAchievements: Achievement[] = [
        {
          id: 'first_blood',
          name: 'First Blood',
          description: 'Win your first combat encounter',
          unlocked: true,
          unlockedAt: Date.now(),
        },
      ];

      const restoredTracker = new AchievementTracker(savedAchievements);
      const firstBlood = restoredTracker.getAchievement('first_blood');
      expect(firstBlood?.unlocked).toBe(true);
    });
  });

  describe('unlock()', () => {
    it('should unlock achievement', () => {
      const unlocked = tracker.unlock('first_blood');
      expect(unlocked).toBe(true);

      const achievement = tracker.getAchievement('first_blood');
      expect(achievement?.unlocked).toBe(true);
      expect(achievement?.unlockedAt).toBeDefined();
    });

    it('should not re-unlock already unlocked achievement', () => {
      tracker.unlock('first_blood');
      const secondUnlock = tracker.unlock('first_blood');
      expect(secondUnlock).toBe(false);
    });

    it('should return false for non-existent achievement', () => {
      const result = tracker.unlock('non_existent');
      expect(result).toBe(false);
    });
  });

  describe('updateProgress()', () => {
    it('should update progress', () => {
      tracker.updateProgress('extinction_event', 50);
      const achievement = tracker.getAchievement('extinction_event');
      expect(achievement?.progress).toBe(50);
    });

    it('should auto-unlock when target is reached', () => {
      tracker.updateProgress('extinction_event', 100);
      const achievement = tracker.getAchievement('extinction_event');
      expect(achievement?.unlocked).toBe(true);
    });

    it('should not update progress for unlocked achievement', () => {
      tracker.unlock('extinction_event');
      const result = tracker.updateProgress('extinction_event', 50);
      expect(result).toBe(false);
    });
  });

  describe('incrementProgress()', () => {
    it('should increment progress by default amount', () => {
      tracker.incrementProgress('extinction_event');
      const achievement = tracker.getAchievement('extinction_event');
      expect(achievement?.progress).toBe(1);
    });

    it('should increment progress by specified amount', () => {
      tracker.incrementProgress('extinction_event', 10);
      const achievement = tracker.getAchievement('extinction_event');
      expect(achievement?.progress).toBe(10);
    });

    it('should accumulate progress', () => {
      tracker.incrementProgress('extinction_event', 10);
      tracker.incrementProgress('extinction_event', 15);
      const achievement = tracker.getAchievement('extinction_event');
      expect(achievement?.progress).toBe(25);
    });
  });

  describe('checkAchievements()', () => {
    it('should check and unlock achievements based on game state', () => {
      const gameState = createTestGameState({
        metaProgress: {
          fossilFragments: 500,
          unlockedDinosaurs: [DinosaurType.DEINONYCHUS],
          unlockedTraits: [],
          codexEntries: Array(50).fill('entry'),
          achievements: [],
          totalRuns: 1,
          victories: 1,
          totalDeaths: 0,
          statistics: {
            totalPlayTime: 0,
            totalEncounters: 0,
            totalCombats: 100,
            deepestDepth: 5,
            mostFossilsInRun: 0,
            fastestVictory: 0,
            longestRun: 0,
            encountersByType: {},
            deathsByEnemy: {},
          },
        },
      });

      const newlyUnlocked = tracker.checkAchievements(gameState);
      expect(newlyUnlocked.length).toBeGreaterThan(0);

      // Should have unlocked extinction_event (100 combats)
      expect(newlyUnlocked.some(a => a.id === 'extinction_event')).toBe(true);
    });

    it('should unlock first_run achievement', () => {
      const gameState = createTestGameState({
        metaProgress: {
          ...createTestGameState().metaProgress,
          totalRuns: 1,
        },
      });

      const newlyUnlocked = tracker.checkAchievements(gameState);
      expect(newlyUnlocked.some(a => a.id === 'first_run')).toBe(true);
    });

    it('should unlock survivor achievement on victory', () => {
      const gameState = createTestGameState({
        metaProgress: {
          ...createTestGameState().metaProgress,
          victories: 1,
        },
      });

      const newlyUnlocked = tracker.checkAchievements(gameState);
      expect(newlyUnlocked.some(a => a.id === 'survivor')).toBe(true);
    });
  });

  describe('checkCombatAchievements()', () => {
    it('should unlock first_blood on first win', () => {
      const newlyUnlocked = tracker.checkCombatAchievements(50, 10, 3, 80, true);
      expect(newlyUnlocked.some(a => a.id === 'first_blood')).toBe(true);
    });

    it('should unlock perfect_victory when no damage taken', () => {
      const newlyUnlocked = tracker.checkCombatAchievements(50, 0, 3, 100, true);
      expect(newlyUnlocked.some(a => a.id === 'perfect_victory')).toBe(true);
    });

    it('should unlock comeback_kid at low health', () => {
      const newlyUnlocked = tracker.checkCombatAchievements(50, 90, 10, 5, true);
      expect(newlyUnlocked.some(a => a.id === 'comeback_kid')).toBe(true);
    });

    it('should unlock speed_run for quick combat', () => {
      const newlyUnlocked = tracker.checkCombatAchievements(100, 10, 3, 80, true);
      expect(newlyUnlocked.some(a => a.id === 'speed_run')).toBe(true);
    });

    it('should unlock overkill for high damage', () => {
      const newlyUnlocked = tracker.checkCombatAchievements(150, 10, 5, 80, true);
      expect(newlyUnlocked.some(a => a.id === 'overkill')).toBe(true);
    });

    it('should not unlock combat win achievements on loss', () => {
      const newlyUnlocked = tracker.checkCombatAchievements(50, 0, 3, 100, false);
      expect(newlyUnlocked.some(a => a.id === 'first_blood')).toBe(false);
      expect(newlyUnlocked.some(a => a.id === 'perfect_victory')).toBe(false);
    });
  });

  describe('checkRunAchievements()', () => {
    it('should unlock speedster for fast run', () => {
      const runTimeMs = 10 * 60 * 1000; // 10 minutes
      const newlyUnlocked = tracker.checkRunAchievements(true, runTimeMs, false, true, 0);
      expect(newlyUnlocked.some(a => a.id === 'speedster')).toBe(true);
    });

    it('should unlock against_all_odds with starter dino and boss defeat', () => {
      const newlyUnlocked = tracker.checkRunAchievements(true, 20 * 60 * 1000, true, true, 0);
      expect(newlyUnlocked.some(a => a.id === 'against_all_odds')).toBe(true);
    });

    it('should update pacifist_route progress', () => {
      tracker.checkRunAchievements(false, 20 * 60 * 1000, false, false, 3);
      const achievement = tracker.getAchievement('pacifist_route');
      expect(achievement?.progress).toBe(3);
    });
  });

  describe('recordDeath()', () => {
    it('should unlock darwin_award after 3 deaths to same enemy', () => {
      const deathsByEnemy: Record<string, number> = { 'trex': 2 };
      const newlyUnlocked = tracker.recordDeath('trex', deathsByEnemy);
      expect(newlyUnlocked.some(a => a.id === 'darwin_award')).toBe(true);
    });

    it('should not unlock darwin_award before 3 deaths', () => {
      const deathsByEnemy: Record<string, number> = { 'trex': 1 };
      const newlyUnlocked = tracker.recordDeath('trex', deathsByEnemy);
      expect(newlyUnlocked.some(a => a.id === 'darwin_award')).toBe(false);
    });
  });

  describe('onUnlock()', () => {
    it('should notify listeners on unlock', () => {
      const callback = vi.fn();
      tracker.onUnlock(callback);

      tracker.unlock('first_blood');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'first_blood', unlocked: true }),
        undefined // No reward for first_blood
      );
    });

    it('should include reward in callback when present', () => {
      const callback = vi.fn();
      tracker.onUnlock(callback);

      tracker.unlock('extinction_event');

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'extinction_event' }),
        expect.objectContaining({ type: 'fossils', value: 50 })
      );
    });

    it('should allow unsubscribing', () => {
      const callback = vi.fn();
      const unsubscribe = tracker.onUnlock(callback);

      unsubscribe();
      tracker.unlock('first_blood');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getAchievementsByCategory()', () => {
    it('should return achievements filtered by category', () => {
      const combat = tracker.getAchievementsByCategory('combat');
      const expectedCombat = ACHIEVEMENTS.filter(a => a.category === 'combat').length;
      expect(combat.length).toBe(expectedCombat);
    });
  });

  describe('getCompletionPercentage()', () => {
    it('should return 0 when no achievements unlocked', () => {
      expect(tracker.getCompletionPercentage()).toBe(0);
    });

    it('should return correct percentage', () => {
      // Unlock half the achievements
      const half = Math.floor(ACHIEVEMENTS.length / 2);
      for (let i = 0; i < half; i++) {
        tracker.unlock(ACHIEVEMENTS[i].id);
      }

      const percentage = tracker.getCompletionPercentage();
      expect(percentage).toBeCloseTo(50, 0); // Within 1% of 50
    });
  });

  describe('toJSON()', () => {
    it('should serialize achievements for saving', () => {
      tracker.unlock('first_blood');
      tracker.updateProgress('extinction_event', 50);

      const json = tracker.toJSON();
      
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBe(ACHIEVEMENTS.length);
      
      const firstBlood = json.find(a => a.id === 'first_blood');
      expect(firstBlood?.unlocked).toBe(true);

      const extinction = json.find(a => a.id === 'extinction_event');
      expect(extinction?.progress).toBe(50);
    });
  });
});
