import { GameState, MetaProgressState, SettingsState, GameStatistics } from '../types/GameState.types';
import { CurrentRunState, BiomeType } from '../types/Encounter.types';
import { DinosaurType } from '../types/Dinosaur.types';

const STORAGE_KEY = 'primordial_swamp_save_v1';

const DEFAULT_META_PROGRESS: MetaProgressState = {
  fossilFragments: 0,
  unlockedDinosaurs: [DinosaurType.DEINONYCHUS], // Starter dino
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
    deathsByEnemy: {}
  }
};

const DEFAULT_SETTINGS: SettingsState = {
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
};

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;

  private constructor() {
    this.state = this.loadState();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private loadState(): GameState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load save data', e);
    }

    return {
      currentRun: null,
      metaProgress: { ...DEFAULT_META_PROGRESS },
      settings: { ...DEFAULT_SETTINGS }
    };
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save game data', e);
    }
  }

  // --- Run Management ---

  public startNewRun(dinosaur: DinosaurType, seed: string): void {
    this.state.currentRun = {
      seed,
      dinosaur,
      currentNodeId: '0-0',
      nodesVisited: [],
      mapNodes: [], // Will be populated by MapScene
      health: 100, // Should be loaded from dino stats
      stamina: 100, // Should be loaded from dino stats
      traits: [], // Starter traits?
      inventory: [],
      biome: BiomeType.COASTAL_WETLANDS,
      depth: 0,
      fossilsCollected: 0,
      combatsWon: 0,
      startTime: Date.now()
    };
    
    this.state.metaProgress.totalRuns++;
    this.saveState();
  }

  public endRun(victory: boolean): void {
    if (!this.state.currentRun) return;

    // Update meta progress
    this.state.metaProgress.fossilFragments += this.state.currentRun.fossilsCollected;
    
    if (victory) {
      this.state.metaProgress.victories++;
      if (this.state.currentRun.fossilsCollected > this.state.metaProgress.statistics.mostFossilsInRun) {
        this.state.metaProgress.statistics.mostFossilsInRun = this.state.currentRun.fossilsCollected;
      }
    } else {
      this.state.metaProgress.totalDeaths++;
    }

    // Clear current run
    this.state.currentRun = null;
    this.saveState();
  }

  public getCurrentRun(): CurrentRunState | null {
    return this.state.currentRun;
  }

  // --- Player Stats ---

  public updateHealth(amount: number): void {
    if (this.state.currentRun) {
      this.state.currentRun.health = amount;
      this.saveState();
    }
  }

  public updateStamina(amount: number): void {
    if (this.state.currentRun) {
      this.state.currentRun.stamina = amount;
      this.saveState();
    }
  }

  public updatePlayerStats(hp: number, stamina: number): void {
    if (this.state.currentRun) {
      this.state.currentRun.health = hp;
      this.state.currentRun.stamina = stamina;
      this.saveState();
    }
  }

  public updateResources(amount: number): void {
    if (this.state.currentRun) {
      this.state.currentRun.fossilsCollected += amount;
      this.saveState();
    }
  }

  public clearCurrentRun(): void {
    this.endRun(false);
  }

  public addFossils(amount: number): void {
    if (this.state.currentRun) {
      this.state.currentRun.fossilsCollected += amount;
      this.saveState();
    }
  }

  public addTrait(traitId: string): void {
    if (this.state.currentRun) {
      if (!this.state.currentRun.traits.includes(traitId)) {
        this.state.currentRun.traits.push(traitId);
        this.saveState();
      }
    }
  }

  // --- Meta Progress ---

  public unlockDinosaur(dinosaur: DinosaurType): void {
    if (!this.state.metaProgress.unlockedDinosaurs.includes(dinosaur)) {
      this.state.metaProgress.unlockedDinosaurs.push(dinosaur);
      this.saveState();
    }
  }

  public unlockCodexEntry(entryId: string): void {
    if (!this.state.metaProgress.codexEntries.includes(entryId)) {
      this.state.metaProgress.codexEntries.push(entryId);
      this.saveState();
    }
  }

  public getMetaProgress(): MetaProgressState {
    return this.state.metaProgress;
  }

  // --- Map Management ---

  public setMapNodes(nodes: any[][]): void {
    if (this.state.currentRun) {
      this.state.currentRun.mapNodes = nodes;
      this.saveState();
    }
  }

  public getMapNodes(): any[][] {
    return this.state.currentRun?.mapNodes || [];
  }

  public visitNode(nodeId: string): void {
    if (this.state.currentRun) {
      if (!this.state.currentRun.nodesVisited.includes(nodeId)) {
        this.state.currentRun.nodesVisited.push(nodeId);
        this.state.currentRun.currentNodeId = nodeId;
        this.saveState();
      }
    }
  }

  // --- Settings ---

  public getSettings(): SettingsState {
    return this.state.settings;
  }

  public updateSettings(settings: Partial<SettingsState>): void {
    this.state.settings = { ...this.state.settings, ...settings };
    this.saveState();
  }

  public updateMasterVolume(volume: number): void {
    this.state.settings.masterVolume = volume;
    this.saveState();
  }

  public updateMusicVolume(volume: number): void {
    this.state.settings.musicVolume = volume;
    this.saveState();
  }

  public updateSfxVolume(volume: number): void {
    this.state.settings.sfxVolume = volume;
    this.saveState();
  }

  public toggleAccessibility(key: 'highContrast' | 'screenReader' | 'reducedMotion' | 'autoAdvanceText', value: boolean): void {
    this.state.settings.accessibility[key] = value;
    this.saveState();
  }
}
