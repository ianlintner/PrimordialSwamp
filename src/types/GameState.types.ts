import { DinosaurType } from './Dinosaur.types';
import { CurrentRunState } from './Encounter.types';

export interface GameState {
  currentRun: CurrentRunState | null;
  metaProgress: MetaProgressState;
  settings: SettingsState;
}

export interface MetaProgressState {
  fossilFragments: number;
  unlockedDinosaurs: DinosaurType[];
  unlockedTraits: string[];
  codexEntries: string[];
  achievements: Achievement[];
  totalRuns: number;
  victories: number;
  totalDeaths: number;
  favoritesDinosaur?: DinosaurType;
  statistics: GameStatistics;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface GameStatistics {
  totalPlayTime: number;
  totalEncounters: number;
  totalCombats: number;
  deepestDepth: number;
  mostFossilsInRun: number;
  fastestVictory: number;
  longestRun: number;
  encountersByType: Record<string, number>;
  deathsByEnemy: Record<string, number>;
}

export interface SettingsState {
  volume: number;
  musicVolume: number;
  sfxVolume: number;
  masterVolume: number;
  accessibility: AccessibilityOptions;
  graphics: GraphicsOptions;
  controls: ControlsOptions;
}

export interface AccessibilityOptions {
  highContrast: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  textSize: number;
  screenReader: boolean;
  reducedMotion: boolean;
  autoAdvanceText: boolean;
}

export interface GraphicsOptions {
  particleEffects: boolean;
  screenShake: boolean;
  flashEffects: boolean;
  pixelPerfect: boolean;
}

export interface ControlsOptions {
  keyBindings: Record<string, string>;
  gamepadEnabled: boolean;
  touchControls: boolean;
}
