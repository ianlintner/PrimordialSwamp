export enum TraitType {
  PASSIVE_STAT = 'passive_stat',
  COMBAT_START = 'combat_start',
  ON_ATTACK = 'on_attack',
  ON_DEFEND = 'on_defend',
  ON_HIT = 'on_hit',
  ON_KILL = 'on_kill',
  TURN_START = 'turn_start',
  TURN_END = 'turn_end'
}

export enum TraitRarity {
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary'
}

export interface TraitEffect {
  stat?: 'hp' | 'maxHp' | 'attack' | 'defense' | 'speed' | 'stamina' | 'maxStamina';
  value?: number;
  multiplier?: number;
  statusEffect?: string; // StatusEffectType
  chance?: number;
  condition?: string;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  type: TraitType;
  rarity: TraitRarity;
  effects: TraitEffect[];
  icon?: string; // Emoji or asset key
  synergies?: string[]; // IDs of other traits that synergize
}
