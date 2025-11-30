export enum ActionType {
  BASIC_ATTACK = 'basic_attack',
  SPECIAL_ABILITY = 'special_ability',
  HEAVY_ATTACK = 'heavy_attack',
  DEFEND = 'defend',
  USE_ITEM = 'use_item',
  FLEE = 'flee',
  CHARGE = 'charge',
  COUNTER = 'counter',
  ROAR = 'roar',
  AMBUSH = 'ambush',
  GRAPPLE = 'grapple',
  TAIL_ATTACK = 'tail_attack',
  CLAW_ATTACK = 'claw_attack',
  BITE = 'bite',
  HEADBUTT = 'headbutt',
  WING_ATTACK = 'wing_attack'
}

export enum EffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  STATUS = 'status',
  DRAIN = 'drain',
  SHIELD = 'shield',
  REFLECT = 'reflect',
  CLEANSE = 'cleanse',
  SUMMON = 'summon',
  TERRAIN = 'terrain',
  WEATHER = 'weather'
}

export enum StatusEffectType {
  // Damage Over Time
  BLEEDING = 'bleeding',
  POISONED = 'poisoned',
  BURNING = 'burning',
  INFECTED = 'infected',
  
  // Control Effects
  STUNNED = 'stunned',
  FROZEN = 'frozen',
  ROOTED = 'rooted',
  BLINDED = 'blinded',
  CONFUSED = 'confused',
  FEARED = 'feared',
  
  // Debuffs
  EXHAUSTED = 'exhausted',
  WEAKENED = 'weakened',
  EXPOSED = 'exposed',
  SLOWED = 'slowed',
  VULNERABLE = 'vulnerable',
  CORRODED = 'corroded',
  
  // Buffs
  FORTIFIED = 'fortified',
  ENRAGED = 'enraged',
  HIDDEN = 'hidden',
  REGENERATING = 'regenerating',
  HASTENED = 'hastened',
  EMPOWERED = 'empowered',
  SHIELDED = 'shielded',
  CAMOUFLAGED = 'camouflaged',
  FOCUSED = 'focused',
  INSPIRED = 'inspired',
  
  // Environmental
  WET = 'wet',
  OVERHEATED = 'overheated',
  CHILLED = 'chilled',
  MUDDY = 'muddy',
  AIRBORNE = 'airborne'
}

// New environmental and weather system
export enum WeatherType {
  CLEAR = 'clear',
  RAIN = 'rain',
  STORM = 'storm',
  FOG = 'fog',
  VOLCANIC_ASH = 'volcanic_ash',
  HEAT_WAVE = 'heat_wave',
  COLD_SNAP = 'cold_snap',
  METEOR_SHOWER = 'meteor_shower'
}

export enum TerrainType {
  SHALLOW_WATER = 'shallow_water',
  DEEP_WATER = 'deep_water',
  MUD = 'mud',
  TAR_PIT = 'tar_pit',
  DENSE_VEGETATION = 'dense_vegetation',
  OPEN_GROUND = 'open_ground',
  ROCKY = 'rocky',
  VOLCANIC = 'volcanic',
  NESTING_GROUND = 'nesting_ground',
  CLIFF = 'cliff'
}

export enum DamageType {
  PHYSICAL = 'physical',
  PIERCING = 'piercing',
  CRUSHING = 'crushing',
  SLASHING = 'slashing',
  VENOM = 'venom',
  FIRE = 'fire',
  COLD = 'cold',
  ACID = 'acid',
  SONIC = 'sonic'
}

export enum TargetType {
  SELF = 'self',
  SINGLE_ENEMY = 'single_enemy',
  ALL_ENEMIES = 'all_enemies',
  ALLY = 'ally',
  ALL_ALLIES = 'all_allies',
  RANDOM = 'random',
  WEAKEST = 'weakest',
  STRONGEST = 'strongest'
}

// Body part targeting for weakness system
export enum BodyPart {
  HEAD = 'head',
  NECK = 'neck',
  BODY = 'body',
  LEGS = 'legs',
  TAIL = 'tail',
  WINGS = 'wings',
  UNDERBELLY = 'underbelly'
}

export interface EnvironmentalModifiers {
  weather: WeatherType;
  terrain: TerrainType;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  effects: EnvironmentalEffect[];
}

export interface EnvironmentalEffect {
  name: string;
  description: string;
  statModifiers: Partial<Record<string, number>>;
  statusEffects?: StatusEffectType[];
  affectedRoles?: string[];
  scientificNote: string;
}

export interface Action {
  id: string;
  name: string;
  type: ActionType;
  staminaCost: number;
  cooldown: number;
  currentCooldown: number;
  damageMultiplier: number;
  damageType?: DamageType;
  targetType?: TargetType;
  targetBodyPart?: BodyPart;
  effects: ActionEffect[];
  animation?: string;
  description: string;
  range?: 'melee' | 'short' | 'medium' | 'long';
  priority?: number; // For determining action order
  canCounter?: boolean;
  interruptible?: boolean;
  scientificBasis?: string;
}

export interface ActionEffect {
  type: EffectType;
  value: number;
  duration: number;
  chance: number;
  statusEffect?: StatusEffectType;
  damageType?: DamageType;
  scaling?: {
    stat: string;
    multiplier: number;
  };
  condition?: EffectCondition;
}

export interface EffectCondition {
  type: 'health_above' | 'health_below' | 'has_status' | 'missing_status' | 'terrain' | 'weather' | 'turn_count' | 'enemy_type';
  value: number | string;
  comparison?: 'greater' | 'less' | 'equal';
}

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  name: string;
  duration: number;
  remainingDuration: number;
  tickDamage?: number;
  tickHealing?: number;
  statModifiers?: Partial<Record<string, number>>;
  stackable?: boolean;
  stacks?: number;
  maxStacks?: number;
  source?: string;
  immunities?: StatusEffectType[];
  scientificDescription?: string;
}

// Buff system
export interface Buff {
  id: string;
  name: string;
  description: string;
  type: 'offensive' | 'defensive' | 'utility' | 'environmental';
  duration: number;
  remainingDuration: number;
  statModifiers: Partial<Record<string, number>>;
  percentModifiers?: Partial<Record<string, number>>;
  effects?: ActionEffect[];
  stackable: boolean;
  stacks?: number;
  maxStacks?: number;
  source: string;
  icon?: string;
  scientificNote?: string;
}

// Derived combat stats
export interface DerivedCombatStats {
  criticalChance: number;
  criticalDamage: number;
  evasion: number;
  accuracy: number;
  armorPenetration: number;
  damageReduction: number;
  staminaRegen: number;
  healthRegen: number;
  lifeSteal: number;
  thorns: number;
  blockChance: number;
  counterChance: number;
}

export interface ActionResult {
  damage: number;
  healing: number;
  statusEffects: StatusEffect[];
  buffsApplied: Buff[];
  buffsRemoved: Buff[];
  critical: boolean;
  missed: boolean;
  blocked: boolean;
  countered: boolean;
  evaded: boolean;
  bodyPartHit?: BodyPart;
  damageType?: DamageType;
  overkill?: number;
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
  environment: EnvironmentalModifiers;
  activeBuffs: Map<string, Buff[]>;
  comboCounter: number;
  evolutionMeter: number;
}

export interface CombatLogEntry {
  turn: number;
  actor: string;
  action: string;
  target: string;
  result: ActionResult;
  timestamp: number;
  environment?: EnvironmentalModifiers;
}
