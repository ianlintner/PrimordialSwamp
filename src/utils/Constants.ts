export const GAME_CONFIG = {
  WIDTH: 1280,
  HEIGHT: 720,
  TILE_SIZE: 16,
  
  // Combat constants
  BASE_CRIT_CHANCE: 0.05,
  BASE_ACCURACY: 0.9,
  STAMINA_REGEN: 10,
  
  // Progression
  NODES_PER_BIOME: 15,
  XP_BASE: 100,
  XP_MULTIPLIER: 1.5,
  
  // Difficulty scaling
  DEPTH_SCALING: 0.15,
  
  // UI Colors
  COLORS: {
    PRIMARY: 0x4a9d5f,
    SECONDARY: 0x3d7a4d,
    DANGER: 0xd94a3d,
    WARNING: 0xe8a735,
    INFO: 0x4a8bd9,
    TEXT: 0xf0f0f0,
    TEXT_DARK: 0x2a2a2a,
    BACKGROUND: 0x1a1a1a
  }
} as const;

export const SCENE_KEYS = {
  BOOT: 'BootScene',
  MENU: 'MenuScene',
  CHARACTER_SELECT: 'CharacterSelectScene',
  MAP: 'MapScene',
  COMBAT: 'CombatScene',
  ENCOUNTER: 'EncounterScene',
  REWARDS: 'RewardsScene',
  CODEX: 'CodexScene',
  GAME_OVER: 'GameOverScene',
  SETTINGS: 'SettingsScene'
} as const;
