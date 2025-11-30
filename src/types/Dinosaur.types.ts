export enum DinosaurType {
  DEINONYCHUS = 'deinonychus',
  ANKYLOSAURUS = 'ankylosaurus',
  PTERANODON = 'pteranodon',
  TYRANNOSAURUS = 'tyrannosaurus',
  PACHYCEPHALOSAURUS = 'pachycephalosaurus',
  COMPSOGNATHUS = 'compsognathus'
}

export enum DinosaurRole {
  HUNTER = 'hunter',
  TANK = 'tank',
  SCOUT = 'scout',
  POWERHOUSE = 'powerhouse',
  SPECIALIST = 'specialist',
  SWARM = 'swarm'
}

export interface Stats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  stamina: number;
  maxStamina: number;
  level: number;
  experience: number;
}

export interface GrowthRates {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  stamina: number;
}

export interface DinosaurData {
  id: string;
  name: string;
  species: string;
  period: {
    era: string;
    period: string;
    mya: [number, number];
  };
  size: {
    length: number;
    height: number;
    weight: number;
  };
  role: DinosaurRole;
  baseStats: Omit<Stats, 'maxHealth' | 'maxStamina' | 'level' | 'experience'>;
  growthRates: GrowthRates;
  abilities: string[];
  passives: string[];
  unlockCondition?: {
    type: 'depth' | 'wins' | 'discoveries' | 'always';
    value?: number;
  };
  scientificFacts: string[];
  description: string;
}
