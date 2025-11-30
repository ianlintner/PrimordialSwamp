export enum ActionType {
  BASIC_ATTACK = 'basic_attack',
  SPECIAL_ABILITY = 'special_ability',
  HEAVY_ATTACK = 'heavy_attack',
  DEFEND = 'defend',
  USE_ITEM = 'use_item',
  FLEE = 'flee'
}

export enum EffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  STATUS = 'status'
}

export enum StatusEffectType {
  BLEEDING = 'bleeding',
  STUNNED = 'stunned',
  POISONED = 'poisoned',
  EXHAUSTED = 'exhausted',
  FORTIFIED = 'fortified',
  ENRAGED = 'enraged',
  HIDDEN = 'hidden'
}

export interface Action {
  id: string;
  name: string;
  type: ActionType;
  staminaCost: number;
  cooldown: number;
  currentCooldown: number;
  damageMultiplier: number;
  effects: ActionEffect[];
  animation?: string;
  description: string;
}

export interface ActionEffect {
  type: EffectType;
  value: number;
  duration: number;
  chance: number;
  statusEffect?: StatusEffectType;
}

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  name: string;
  duration: number;
  remainingDuration: number;
  tickDamage?: number;
  statModifiers?: Partial<Record<string, number>>;
}

export interface ActionResult {
  damage: number;
  healing: number;
  statusEffects: StatusEffect[];
  critical: boolean;
  missed: boolean;
  blocked: boolean;
}

export interface CombatState {
  turn: number;
  turnQueue: string[]; // Entity IDs
  currentActorIndex: number;
  playerHealth: number;
  enemyHealth: number;
  combatLog: CombatLogEntry[];
  isFinished: boolean;
  victor?: 'player' | 'enemy';
}

export interface CombatLogEntry {
  turn: number;
  actor: string;
  action: string;
  target: string;
  result: ActionResult;
  timestamp: number;
}
