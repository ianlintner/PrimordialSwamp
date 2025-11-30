import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateManager } from '@/managers/GameStateManager';
import { DinosaurType } from '@/types/Dinosaur.types';
import { BiomeType } from '@/types/Encounter.types';

// Helper to reset singleton between tests
function resetGameStateManager() {
  // Reset the singleton instance
  (GameStateManager as any).instance = undefined;
}

describe('GameStateManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetGameStateManager();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = GameStateManager.getInstance();
      const instance2 = GameStateManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Run Management', () => {
    it('should start a new run with correct initial state', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed-123');

      const run = manager.getCurrentRun();
      expect(run).not.toBeNull();
      expect(run?.dinosaur).toBe(DinosaurType.DEINONYCHUS);
      expect(run?.seed).toBe('test-seed-123');
      expect(run?.health).toBe(100);
      expect(run?.stamina).toBe(100);
      expect(run?.fossilsCollected).toBe(0);
      expect(run?.combatsWon).toBe(0);
      expect(run?.biome).toBe(BiomeType.COASTAL_WETLANDS);
      expect(run?.depth).toBe(0);
    });

    it('should increment totalRuns when starting a new run', () => {
      const manager = GameStateManager.getInstance();
      const initialRuns = manager.getMetaProgress().totalRuns;

      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      expect(manager.getMetaProgress().totalRuns).toBe(initialRuns + 1);
    });

    it('should end run with victory and update meta progress', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');
      manager.addFossils(50);

      const initialVictories = manager.getMetaProgress().victories;
      const initialFossils = manager.getMetaProgress().fossilFragments;

      manager.endRun(true);

      expect(manager.getMetaProgress().victories).toBe(initialVictories + 1);
      expect(manager.getMetaProgress().fossilFragments).toBe(initialFossils + 50);
      expect(manager.getCurrentRun()).toBeNull();
    });

    it('should end run with defeat and update death count', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      const initialDeaths = manager.getMetaProgress().totalDeaths;

      manager.endRun(false);

      expect(manager.getMetaProgress().totalDeaths).toBe(initialDeaths + 1);
      expect(manager.getCurrentRun()).toBeNull();
    });

    it('should clear current run using clearCurrentRun', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      expect(manager.getCurrentRun()).not.toBeNull();

      manager.clearCurrentRun();

      expect(manager.getCurrentRun()).toBeNull();
    });
  });

  describe('Player Stats', () => {
    it('should update health correctly', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.updateHealth(75);

      expect(manager.getCurrentRun()?.health).toBe(75);
    });

    it('should update stamina correctly', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.updateStamina(50);

      expect(manager.getCurrentRun()?.stamina).toBe(50);
    });

    it('should update both health and stamina with updatePlayerStats', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.updatePlayerStats(80, 60);

      expect(manager.getCurrentRun()?.health).toBe(80);
      expect(manager.getCurrentRun()?.stamina).toBe(60);
    });

    it('should not update stats when no run is active', () => {
      const manager = GameStateManager.getInstance();

      // Should not throw
      manager.updateHealth(50);
      manager.updateStamina(50);
      manager.updatePlayerStats(50, 50);

      expect(manager.getCurrentRun()).toBeNull();
    });
  });

  describe('Resources', () => {
    it('should add fossils correctly', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.addFossils(25);
      expect(manager.getCurrentRun()?.fossilsCollected).toBe(25);

      manager.addFossils(15);
      expect(manager.getCurrentRun()?.fossilsCollected).toBe(40);
    });

    it('should update resources (add fossils) correctly', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.updateResources(30);
      expect(manager.getCurrentRun()?.fossilsCollected).toBe(30);

      manager.updateResources(20);
      expect(manager.getCurrentRun()?.fossilsCollected).toBe(50);
    });

    it('should not update resources when no run is active', () => {
      const manager = GameStateManager.getInstance();

      // Should not throw
      manager.updateResources(50);
      manager.addFossils(50);

      expect(manager.getCurrentRun()).toBeNull();
    });
  });

  describe('Traits', () => {
    it('should add traits correctly', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.addTrait('swift_strike');

      expect(manager.getCurrentRun()?.traits).toContain('swift_strike');
    });

    it('should not add duplicate traits', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.addTrait('swift_strike');
      manager.addTrait('swift_strike');

      expect(manager.getCurrentRun()?.traits.filter(t => t === 'swift_strike').length).toBe(1);
    });
  });

  describe('Map Management', () => {
    it('should set and get map nodes', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      const mockNodes = [
        [{ id: '0-0', type: 'start' }],
        [{ id: '1-0', type: 'combat' }, { id: '1-1', type: 'treasure' }]
      ];

      manager.setMapNodes(mockNodes);

      expect(manager.getMapNodes()).toEqual(mockNodes);
    });

    it('should return empty array when no run is active', () => {
      const manager = GameStateManager.getInstance();

      expect(manager.getMapNodes()).toEqual([]);
    });

    it('should visit nodes and track them', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.visitNode('1-0');

      expect(manager.getCurrentRun()?.nodesVisited).toContain('1-0');
      expect(manager.getCurrentRun()?.currentNodeId).toBe('1-0');
    });

    it('should not add duplicate visited nodes', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      manager.visitNode('1-0');
      manager.visitNode('1-0');

      expect(manager.getCurrentRun()?.nodesVisited.filter(n => n === '1-0').length).toBe(1);
    });
  });

  describe('Meta Progress', () => {
    it('should unlock dinosaurs', () => {
      const manager = GameStateManager.getInstance();

      manager.unlockDinosaur(DinosaurType.TYRANNOSAURUS);

      expect(manager.getMetaProgress().unlockedDinosaurs).toContain(DinosaurType.TYRANNOSAURUS);
    });

    it('should not duplicate unlocked dinosaurs', () => {
      const manager = GameStateManager.getInstance();

      manager.unlockDinosaur(DinosaurType.DEINONYCHUS);
      manager.unlockDinosaur(DinosaurType.DEINONYCHUS);

      const count = manager.getMetaProgress().unlockedDinosaurs.filter(
        d => d === DinosaurType.DEINONYCHUS
      ).length;
      expect(count).toBe(1);
    });

    it('should unlock codex entries', () => {
      const manager = GameStateManager.getInstance();

      manager.unlockCodexEntry('dino_001');

      expect(manager.getMetaProgress().codexEntries).toContain('dino_001');
    });
  });

  describe('Settings', () => {
    it('should return default settings', () => {
      const manager = GameStateManager.getInstance();
      const settings = manager.getSettings();

      expect(settings.masterVolume).toBe(1);
      expect(settings.musicVolume).toBe(0.5);
      expect(settings.sfxVolume).toBe(0.8);
      expect(settings.accessibility.highContrast).toBe(false);
      expect(settings.accessibility.reducedMotion).toBe(false);
    });

    it('should update master volume', () => {
      const manager = GameStateManager.getInstance();

      manager.updateMasterVolume(0.7);

      expect(manager.getSettings().masterVolume).toBe(0.7);
    });

    it('should update music volume', () => {
      const manager = GameStateManager.getInstance();

      manager.updateMusicVolume(0.3);

      expect(manager.getSettings().musicVolume).toBe(0.3);
    });

    it('should update SFX volume', () => {
      const manager = GameStateManager.getInstance();

      manager.updateSfxVolume(0.6);

      expect(manager.getSettings().sfxVolume).toBe(0.6);
    });

    it('should toggle accessibility options', () => {
      const manager = GameStateManager.getInstance();

      manager.toggleAccessibility('highContrast', true);
      expect(manager.getSettings().accessibility.highContrast).toBe(true);

      manager.toggleAccessibility('reducedMotion', true);
      expect(manager.getSettings().accessibility.reducedMotion).toBe(true);

      manager.toggleAccessibility('highContrast', false);
      expect(manager.getSettings().accessibility.highContrast).toBe(false);
    });

    it('should update settings partially', () => {
      const manager = GameStateManager.getInstance();

      manager.updateSettings({
        musicVolume: 0.2,
        sfxVolume: 0.9
      });

      const settings = manager.getSettings();
      expect(settings.musicVolume).toBe(0.2);
      expect(settings.sfxVolume).toBe(0.9);
      expect(settings.masterVolume).toBe(1); // Unchanged
    });
  });

  describe('Save/Load', () => {
    it('should call localStorage.setItem when saving', () => {
      const manager = GameStateManager.getInstance();
      manager.startNewRun(DinosaurType.DEINONYCHUS, 'test-seed');

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should load saved state from localStorage', () => {
      const savedState = {
        currentRun: null,
        metaProgress: {
          fossilFragments: 100,
          unlockedDinosaurs: [DinosaurType.DEINONYCHUS, DinosaurType.TYRANNOSAURUS],
          unlockedTraits: [],
          codexEntries: [],
          achievements: [],
          totalRuns: 5,
          victories: 2,
          totalDeaths: 3,
          statistics: {
            totalPlayTime: 0,
            totalEncounters: 0,
            totalCombats: 0,
            deepestDepth: 0,
            mostFossilsInRun: 50,
            fastestVictory: 0,
            longestRun: 0,
            encountersByType: {},
            deathsByEnemy: {}
          }
        },
        settings: {
          volume: 1,
          musicVolume: 0.5,
          sfxVolume: 0.8,
          masterVolume: 1,
          accessibility: {
            highContrast: true,
            colorBlindMode: 'none',
            textSize: 1,
            screenReader: false,
            reducedMotion: false,
            autoAdvanceText: false
          },
          graphics: {
            particleEffects: true,
            screenShake: true,
            flashEffects: true,
            pixelPerfect: true
          },
          controls: {
            keyBindings: {},
            gamepadEnabled: true,
            touchControls: false
          }
        }
      };

      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedState));
      resetGameStateManager();

      const manager = GameStateManager.getInstance();
      const metaProgress = manager.getMetaProgress();

      expect(metaProgress.fossilFragments).toBe(100);
      expect(metaProgress.totalRuns).toBe(5);
      expect(metaProgress.victories).toBe(2);
      expect(manager.getSettings().accessibility.highContrast).toBe(true);
    });
  });
});
