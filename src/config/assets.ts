/**
 * Asset configuration for Primordial Swamp
 * Defines all game assets with their paths, dimensions, and animation data
 */

export interface SpriteAsset {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  animations?: AnimationConfig[];
}

export interface AnimationConfig {
  key: string;
  frames: { start: number; end: number };
  frameRate: number;
  repeat: number; // -1 for infinite loop
}

export interface AudioAsset {
  key: string;
  path: string;
  type: 'music' | 'sfx' | 'ambience';
  loop?: boolean;
  volume?: number;
}

export interface ImageAsset {
  key: string;
  path: string;
}

// Player dinosaur sprites
export const PLAYER_SPRITES: SpriteAsset[] = [
  {
    key: 'deinonychus',
    path: 'assets/sprites/dinosaurs/deinonychus_spritesheet.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: [
      { key: 'deinonychus_idle', frames: { start: 0, end: 5 }, frameRate: 8, repeat: -1 },
      { key: 'deinonychus_attack', frames: { start: 6, end: 11 }, frameRate: 12, repeat: 0 },
      { key: 'deinonychus_hurt', frames: { start: 12, end: 15 }, frameRate: 10, repeat: 0 },
      { key: 'deinonychus_death', frames: { start: 16, end: 21 }, frameRate: 8, repeat: 0 },
    ],
  },
  {
    key: 'ankylosaurus',
    path: 'assets/sprites/dinosaurs/ankylosaurus_spritesheet.png',
    frameWidth: 96,
    frameHeight: 64,
    animations: [
      { key: 'ankylosaurus_idle', frames: { start: 0, end: 5 }, frameRate: 6, repeat: -1 },
      { key: 'ankylosaurus_attack', frames: { start: 6, end: 11 }, frameRate: 10, repeat: 0 },
      { key: 'ankylosaurus_hurt', frames: { start: 12, end: 15 }, frameRate: 10, repeat: 0 },
      { key: 'ankylosaurus_death', frames: { start: 16, end: 21 }, frameRate: 8, repeat: 0 },
    ],
  },
  {
    key: 'pteranodon',
    path: 'assets/sprites/dinosaurs/pteranodon_spritesheet.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: [
      { key: 'pteranodon_idle', frames: { start: 0, end: 5 }, frameRate: 10, repeat: -1 },
      { key: 'pteranodon_attack', frames: { start: 6, end: 11 }, frameRate: 14, repeat: 0 },
      { key: 'pteranodon_hurt', frames: { start: 12, end: 15 }, frameRate: 10, repeat: 0 },
      { key: 'pteranodon_death', frames: { start: 16, end: 21 }, frameRate: 8, repeat: 0 },
    ],
  },
];

// Enemy sprites
export const ENEMY_SPRITES: SpriteAsset[] = [
  {
    key: 'compy_pack',
    path: 'assets/sprites/enemies/compy_pack_spritesheet.png',
    frameWidth: 32,
    frameHeight: 32,
    animations: [
      { key: 'compy_pack_idle', frames: { start: 0, end: 5 }, frameRate: 10, repeat: -1 },
      { key: 'compy_pack_attack', frames: { start: 6, end: 11 }, frameRate: 14, repeat: 0 },
      { key: 'compy_pack_hurt', frames: { start: 12, end: 15 }, frameRate: 10, repeat: 0 },
      { key: 'compy_pack_death', frames: { start: 16, end: 21 }, frameRate: 8, repeat: 0 },
    ],
  },
  {
    key: 'dilophosaurus',
    path: 'assets/sprites/enemies/dilophosaurus_spritesheet.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: [
      { key: 'dilophosaurus_idle', frames: { start: 0, end: 5 }, frameRate: 8, repeat: -1 },
      { key: 'dilophosaurus_attack', frames: { start: 6, end: 11 }, frameRate: 12, repeat: 0 },
      { key: 'dilophosaurus_hurt', frames: { start: 12, end: 15 }, frameRate: 10, repeat: 0 },
      { key: 'dilophosaurus_death', frames: { start: 16, end: 21 }, frameRate: 8, repeat: 0 },
    ],
  },
  {
    key: 'allosaurus',
    path: 'assets/sprites/enemies/allosaurus_spritesheet.png',
    frameWidth: 96,
    frameHeight: 64,
    animations: [
      { key: 'allosaurus_idle', frames: { start: 0, end: 5 }, frameRate: 6, repeat: -1 },
      { key: 'allosaurus_attack', frames: { start: 6, end: 11 }, frameRate: 10, repeat: 0 },
      { key: 'allosaurus_hurt', frames: { start: 12, end: 15 }, frameRate: 10, repeat: 0 },
      { key: 'allosaurus_death', frames: { start: 16, end: 21 }, frameRate: 8, repeat: 0 },
    ],
  },
];

// Boss sprites
export const BOSS_SPRITES: SpriteAsset[] = [
  {
    key: 'tyrannosaurus_boss',
    path: 'assets/sprites/bosses/tyrannosaurus_boss_spritesheet.png',
    frameWidth: 160,
    frameHeight: 96,
    animations: [
      { key: 'tyrannosaurus_boss_idle', frames: { start: 0, end: 5 }, frameRate: 6, repeat: -1 },
      { key: 'tyrannosaurus_boss_attack', frames: { start: 6, end: 11 }, frameRate: 10, repeat: 0 },
      { key: 'tyrannosaurus_boss_roar', frames: { start: 12, end: 17 }, frameRate: 8, repeat: 0 },
      { key: 'tyrannosaurus_boss_hurt', frames: { start: 18, end: 21 }, frameRate: 10, repeat: 0 },
      { key: 'tyrannosaurus_boss_death', frames: { start: 22, end: 27 }, frameRate: 8, repeat: 0 },
    ],
  },
];

// Visual effects sprites
export const EFFECT_SPRITES: SpriteAsset[] = [
  {
    key: 'fx_attack_impact',
    path: 'assets/sprites/effects/attack_impact.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: [
      { key: 'attack_impact', frames: { start: 0, end: 5 }, frameRate: 15, repeat: 0 },
    ],
  },
  {
    key: 'fx_critical_hit',
    path: 'assets/sprites/effects/critical_hit.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: [
      { key: 'critical_hit', frames: { start: 0, end: 7 }, frameRate: 18, repeat: 0 },
    ],
  },
  {
    key: 'fx_heal',
    path: 'assets/sprites/effects/heal.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: [
      { key: 'heal', frames: { start: 0, end: 5 }, frameRate: 12, repeat: 0 },
    ],
  },
];

// Background images
export const BACKGROUND_IMAGES: ImageAsset[] = [
  { key: 'bg_coastal_wetlands_sky', path: 'assets/backgrounds/coastal-wetlands/bg_sky.png' },
  { key: 'bg_coastal_wetlands_mid', path: 'assets/backgrounds/coastal-wetlands/bg_midground.png' },
  { key: 'bg_coastal_wetlands_fg', path: 'assets/backgrounds/coastal-wetlands/bg_foreground.png' },
  { key: 'bg_fern_prairies_sky', path: 'assets/backgrounds/fern-prairies/bg_sky.png' },
  { key: 'bg_fern_prairies_mid', path: 'assets/backgrounds/fern-prairies/bg_midground.png' },
  { key: 'bg_fern_prairies_fg', path: 'assets/backgrounds/fern-prairies/bg_foreground.png' },
  { key: 'bg_volcanic_highlands_sky', path: 'assets/backgrounds/volcanic-highlands/bg_sky.png' },
  { key: 'bg_volcanic_highlands_mid', path: 'assets/backgrounds/volcanic-highlands/bg_midground.png' },
  { key: 'bg_volcanic_highlands_fg', path: 'assets/backgrounds/volcanic-highlands/bg_foreground.png' },
  { key: 'bg_tar_pits_sky', path: 'assets/backgrounds/tar-pits/bg_sky.png' },
  { key: 'bg_tar_pits_mid', path: 'assets/backgrounds/tar-pits/bg_midground.png' },
  { key: 'bg_tar_pits_fg', path: 'assets/backgrounds/tar-pits/bg_foreground.png' },
];

// UI images
export const UI_IMAGES: ImageAsset[] = [
  { key: 'ui_healthbar_frame', path: 'assets/ui/health-bars/healthbar_frame.png' },
  { key: 'ui_healthbar_fill', path: 'assets/ui/health-bars/healthbar_fill.png' },
  { key: 'ui_staminabar_frame', path: 'assets/ui/health-bars/staminabar_frame.png' },
  { key: 'ui_staminabar_fill', path: 'assets/ui/health-bars/staminabar_fill.png' },
  { key: 'ui_btn_attack', path: 'assets/ui/buttons/btn_attack.png' },
  { key: 'ui_btn_defend', path: 'assets/ui/buttons/btn_defend.png' },
  { key: 'ui_btn_ability', path: 'assets/ui/buttons/btn_ability.png' },
  { key: 'ui_btn_flee', path: 'assets/ui/buttons/btn_flee.png' },
  { key: 'ui_panel_info', path: 'assets/ui/panels/panel_info.png' },
  { key: 'ui_panel_combat_log', path: 'assets/ui/panels/panel_combat_log.png' },
];

// Status effect icons
export const STATUS_ICONS: ImageAsset[] = [
  { key: 'status_bleeding', path: 'assets/ui/icons/status/bleeding.png' },
  { key: 'status_stunned', path: 'assets/ui/icons/status/stunned.png' },
  { key: 'status_poisoned', path: 'assets/ui/icons/status/poisoned.png' },
  { key: 'status_exhausted', path: 'assets/ui/icons/status/exhausted.png' },
  { key: 'status_fortified', path: 'assets/ui/icons/status/fortified.png' },
  { key: 'status_enraged', path: 'assets/ui/icons/status/enraged.png' },
];

// Resource icons
export const RESOURCE_ICONS: ImageAsset[] = [
  { key: 'resource_fossil', path: 'assets/ui/icons/resources/fossil.png' },
  { key: 'resource_health', path: 'assets/ui/icons/resources/health.png' },
  { key: 'resource_stamina', path: 'assets/ui/icons/resources/stamina.png' },
  { key: 'resource_egg', path: 'assets/ui/icons/resources/egg.png' },
];

// Map node icons
export const NODE_ICONS: ImageAsset[] = [
  { key: 'node_combat', path: 'assets/ui/icons/nodes/combat.png' },
  { key: 'node_resource', path: 'assets/ui/icons/nodes/resource.png' },
  { key: 'node_event', path: 'assets/ui/icons/nodes/event.png' },
  { key: 'node_elite', path: 'assets/ui/icons/nodes/elite.png' },
  { key: 'node_rest', path: 'assets/ui/icons/nodes/rest.png' },
  { key: 'node_boss', path: 'assets/ui/icons/nodes/boss.png' },
];

// Audio assets
export const MUSIC_TRACKS: AudioAsset[] = [
  { key: 'music_main_menu', path: 'assets/audio/music/main_menu.ogg', type: 'music', loop: true, volume: 0.5 },
  { key: 'music_coastal_wetlands', path: 'assets/audio/music/coastal_wetlands.ogg', type: 'music', loop: true, volume: 0.4 },
  { key: 'music_combat_normal', path: 'assets/audio/music/combat_normal.ogg', type: 'music', loop: true, volume: 0.5 },
  { key: 'music_combat_boss', path: 'assets/audio/music/combat_boss.ogg', type: 'music', loop: true, volume: 0.6 },
  { key: 'music_victory', path: 'assets/audio/music/victory.ogg', type: 'music', loop: false, volume: 0.6 },
  { key: 'music_defeat', path: 'assets/audio/music/defeat.ogg', type: 'music', loop: false, volume: 0.5 },
];

export const SOUND_EFFECTS: AudioAsset[] = [
  { key: 'sfx_attack_slash', path: 'assets/audio/sfx/combat/attack_slash.ogg', type: 'sfx', volume: 0.7 },
  { key: 'sfx_attack_bite', path: 'assets/audio/sfx/combat/attack_bite.ogg', type: 'sfx', volume: 0.7 },
  { key: 'sfx_defend', path: 'assets/audio/sfx/combat/defend.ogg', type: 'sfx', volume: 0.6 },
  { key: 'sfx_damage_taken', path: 'assets/audio/sfx/combat/damage_taken.ogg', type: 'sfx', volume: 0.7 },
  { key: 'sfx_critical_hit', path: 'assets/audio/sfx/combat/critical_hit.ogg', type: 'sfx', volume: 0.8 },
  { key: 'sfx_miss', path: 'assets/audio/sfx/combat/miss.ogg', type: 'sfx', volume: 0.5 },
  { key: 'sfx_death', path: 'assets/audio/sfx/combat/death.ogg', type: 'sfx', volume: 0.6 },
  { key: 'sfx_heal', path: 'assets/audio/sfx/combat/heal.ogg', type: 'sfx', volume: 0.6 },
  { key: 'sfx_ui_click', path: 'assets/audio/sfx/ui/click.ogg', type: 'sfx', volume: 0.4 },
  { key: 'sfx_ui_hover', path: 'assets/audio/sfx/ui/hover.ogg', type: 'sfx', volume: 0.3 },
  { key: 'sfx_item_collect', path: 'assets/audio/sfx/ui/item_collect.ogg', type: 'sfx', volume: 0.5 },
  { key: 'sfx_achievement', path: 'assets/audio/sfx/ui/achievement.ogg', type: 'sfx', volume: 0.6 },
];

export const AMBIENT_SOUNDS: AudioAsset[] = [
  { key: 'amb_water_flowing', path: 'assets/audio/ambience/water_flowing.ogg', type: 'ambience', loop: true, volume: 0.3 },
  { key: 'amb_wind_ferns', path: 'assets/audio/ambience/wind_ferns.ogg', type: 'ambience', loop: true, volume: 0.25 },
  { key: 'amb_volcanic', path: 'assets/audio/ambience/volcanic.ogg', type: 'ambience', loop: true, volume: 0.35 },
];

// Get all assets for loading
export function getAllSprites(): SpriteAsset[] {
  return [...PLAYER_SPRITES, ...ENEMY_SPRITES, ...BOSS_SPRITES, ...EFFECT_SPRITES];
}

export function getAllImages(): ImageAsset[] {
  return [...BACKGROUND_IMAGES, ...UI_IMAGES, ...STATUS_ICONS, ...RESOURCE_ICONS, ...NODE_ICONS];
}

export function getAllAudio(): AudioAsset[] {
  return [...MUSIC_TRACKS, ...SOUND_EFFECTS, ...AMBIENT_SOUNDS];
}
