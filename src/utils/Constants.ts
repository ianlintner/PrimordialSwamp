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
  
  // UI Colors - Consistent design system palette
  COLORS: {
    // Primary colors
    PRIMARY: 0x4a9d5f,
    PRIMARY_LIGHT: 0x6ab87a,
    PRIMARY_DARK: 0x3d7a4d,
    SECONDARY: 0x3d7a4d,
    
    // Semantic colors
    DANGER: 0xd94a3d,
    DANGER_LIGHT: 0xe86b5f,
    WARNING: 0xe8a735,
    WARNING_LIGHT: 0xf0be5a,
    INFO: 0x4a8bd9,
    INFO_LIGHT: 0x6ba3e8,
    SUCCESS: 0x51cf66,
    
    // Combat-specific colors
    HEALTH: 0x4a9d5f,
    STAMINA: 0x4a8bd9,
    DAMAGE: 0xd94a3d,
    HEAL: 0x51cf66,
    BUFF: 0xffd43b,
    DEBUFF: 0x845ef7,
    
    // Node type colors
    NODE_COMBAT: 0x4a9d5f,
    NODE_RESOURCE: 0x5f9d4a,
    NODE_EVENT: 0x9d7a4a,
    NODE_ELITE: 0x9d4a4a,
    NODE_REST: 0x4a7a9d,
    NODE_BOSS: 0x9d4a9d,
    
    // Text colors
    TEXT: 0xf0f0f0,
    TEXT_SECONDARY: 0xcccccc,
    TEXT_MUTED: 0x888888,
    TEXT_DISABLED: 0x666666,
    TEXT_DARK: 0x2a2a2a,
    
    // Background colors
    BACKGROUND: 0x1a1a1a,
    BACKGROUND_PANEL: 0x2a2a2a,
    BACKGROUND_ELEVATED: 0x3a3a3a,
    
    // Border colors
    BORDER: 0x4a4a4a,
    BORDER_FOCUS: 0xffffff
  },

  // High contrast mode colors (WCAG AAA compliant)
  COLORS_HIGH_CONTRAST: {
    PRIMARY: 0x00ff00,
    DANGER: 0xff0000,
    TEXT: 0xffffff,
    BACKGROUND: 0x000000,
    BACKGROUND_PANEL: 0x1a1a1a
  }
} as const;

// Typography constants for consistent text styling
export const TYPOGRAPHY = {
  FONT_FAMILY: 'Courier New, monospace',
  
  // Font sizes
  SIZE_XS: '12px',
  SIZE_SM: '14px',
  SIZE_BASE: '16px',
  SIZE_MD: '18px',
  SIZE_LG: '20px',
  SIZE_XL: '24px',
  SIZE_2XL: '28px',
  SIZE_3XL: '32px',
  SIZE_4XL: '36px',
  SIZE_5XL: '48px',
  SIZE_HERO: '72px',
  
  // Line spacing
  LINE_SPACING_TIGHT: 4,
  LINE_SPACING_NORMAL: 8,
  LINE_SPACING_RELAXED: 12
} as const;

// Spacing constants for consistent layouts
export const SPACING = {
  UNIT: 8,
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
  
  // Common padding values
  BUTTON_PADDING_X: 20,
  BUTTON_PADDING_Y: 10,
  BUTTON_PADDING_X_LARGE: 30,
  BUTTON_PADDING_Y_LARGE: 15,
  PANEL_PADDING: 20,
  SAFE_AREA: 40
} as const;

// Animation timing constants
export const ANIMATION = {
  DURATION_INSTANT: 0,
  DURATION_FAST: 100,
  DURATION_NORMAL: 200,
  DURATION_SLOW: 500,
  DURATION_VERY_SLOW: 1000,
  
  // Phaser easing functions
  EASE_LINEAR: 'Linear',
  EASE_IN: 'Power1',
  EASE_OUT: 'Power2',
  EASE_IN_OUT: 'Sine.easeInOut',
  EASE_BOUNCE: 'Bounce'
} as const;

// UI component sizing
export const UI_SIZES = {
  // Buttons
  BUTTON_MIN_WIDTH: 120,
  BUTTON_MIN_HEIGHT: 44, // Touch target minimum
  
  // Health/stamina bars
  HEALTH_BAR_WIDTH: 200,
  HEALTH_BAR_HEIGHT: 20,
  STAMINA_BAR_HEIGHT: 15,
  
  // Cards
  CARD_WIDTH: 320,
  CARD_HEIGHT: 450,
  
  // Map nodes
  NODE_RADIUS: 25,
  NODE_SPACING_X: 180,
  NODE_SPACING_Y: 100,
  
  // Panels
  STATS_PANEL_WIDTH: 180,
  COMBAT_LOG_WIDTH: 380,
  COMBAT_LOG_HEIGHT: 180,
  
  // Touch targets (WCAG)
  TOUCH_TARGET_MIN: 44
} as const;

// Icon constants for consistent emoji usage
export const ICONS = {
  // Map nodes
  COMBAT: '⚔',
  RESOURCE: '🌿',
  EVENT: '❓',
  ELITE: '💀',
  REST: '🔥',
  BOSS: '👑',
  
  // Combat actions
  ATTACK: '⚔',
  DEFEND: '🛡',
  ABILITY: '✨',
  FLEE: '🏃',
  
  // Resources
  FOSSIL: '🦴',
  
  // Status
  HEALTH: '❤',
  STAMINA: '⚡',
  VICTORY: '🏆',
  DEFEAT: '💀',
  
  // UI
  SETTINGS: '⚙',
  BACK: '←',
  FORWARD: '→',
  PLAY: '▶',
  WARNING: '⚠',
  INFO: 'ℹ',
  BOOK: '📚'
} as const;

// Tooltip configuration
export const TOOLTIP_CONFIG = {
  DELAY_MS: 500,
  FADE_IN_MS: 150,
  FADE_OUT_MS: 100,
  MAX_WIDTH: 300,
  PADDING: 12,
  OFFSET_Y: -60
} as const;

// Keyboard shortcuts for accessibility
export const KEY_BINDINGS = {
  COMBAT: {
    ATTACK: ['1', 'A'],
    DEFEND: ['2', 'D'],
    ABILITY: ['3', 'S'],
    FLEE: ['4', 'F']
  },
  NAVIGATION: {
    UP: ['ArrowUp', 'W'],
    DOWN: ['ArrowDown', 'S'],
    LEFT: ['ArrowLeft', 'A'],
    RIGHT: ['ArrowRight', 'D'],
    CONFIRM: ['Enter', 'Space'],
    CANCEL: ['Escape', 'Backspace']
  },
  SYSTEM: {
    PAUSE: ['P', 'Escape'],
    SETTINGS: ['O'],
    CODEX: ['C']
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
