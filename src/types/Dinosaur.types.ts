export enum DinosaurType {
  DEINONYCHUS = 'deinonychus',
  ANKYLOSAURUS = 'ankylosaurus',
  PTERANODON = 'pteranodon',
  TYRANNOSAURUS = 'tyrannosaurus',
  PACHYCEPHALOSAURUS = 'pachycephalosaurus',
  COMPSOGNATHUS = 'compsognathus',
  SPINOSAURUS = 'spinosaurus',
  CARNOTAURUS = 'carnotaurus',
  PARASAUROLOPHUS = 'parasaurolophus',
  THERIZINOSAURUS = 'therizinosaurus',
  UTAHRAPTOR = 'utahraptor',
  TROODON = 'troodon',
  DILOPHOSAURUS = 'dilophosaurus',
  BARYONYX = 'baryonyx',
  IGUANODON = 'iguanodon',
  OVIRAPTOR = 'oviraptor'
}

export enum DinosaurRole {
  HUNTER = 'hunter',
  TANK = 'tank',
  SCOUT = 'scout',
  POWERHOUSE = 'powerhouse',
  SPECIALIST = 'specialist',
  SWARM = 'swarm',
  SUPPORT = 'support',
  AMBUSHER = 'ambusher',
  BRUISER = 'bruiser',
  CONTROLLER = 'controller',
  AQUATIC_HUNTER = 'aquatic_hunter',
  PACK_LEADER = 'pack_leader'
}

export enum DietType {
  CARNIVORE = 'carnivore',
  HERBIVORE = 'herbivore',
  OMNIVORE = 'omnivore',
  PISCIVORE = 'piscivore',
  INSECTIVORE = 'insectivore',
  SCAVENGER = 'scavenger'
}

export enum SocialBehavior {
  SOLITARY = 'solitary',
  PACK_HUNTER = 'pack_hunter',
  HERD_MEMBER = 'herd_member',
  PAIR_BONDED = 'pair_bonded',
  COLONIAL = 'colonial',
  TERRITORIAL = 'territorial'
}

export enum ActivityPattern {
  DIURNAL = 'diurnal',
  NOCTURNAL = 'nocturnal',
  CREPUSCULAR = 'crepuscular',
  CATHEMERAL = 'cathemeral'
}

export enum LocomotionType {
  BIPEDAL = 'bipedal',
  QUADRUPEDAL = 'quadrupedal',
  FACULTATIVE_BIPED = 'facultative_biped',
  FLYING = 'flying',
  SWIMMING = 'swimming',
  SEMI_AQUATIC = 'semi_aquatic'
}

// Taxonomic classification for scientific accuracy
export interface TaxonomicInfo {
  clade: string;
  family: string;
  genus: string;
  species: string;
  commonName: string;
}

// Physical characteristics
export interface PhysicalTraits {
  hasFeathers: boolean;
  hasArmor: boolean;
  hasHorns: boolean;
  hasClaws: boolean;
  hasTailWeapon: boolean;
  hasCrest: boolean;
  hasSail: boolean;
  teethType: 'serrated' | 'peg-shaped' | 'none' | 'beak' | 'mixed';
  skinType: 'scales' | 'feathers' | 'proto-feathers' | 'leathery' | 'armored';
}

// Environmental preferences
export interface EnvironmentalPreferences {
  preferredTerrain: string[];
  preferredClimate: 'tropical' | 'temperate' | 'arid' | 'coastal' | 'varied';
  aquaticCapability: 'none' | 'wading' | 'swimming' | 'diving';
  altitudeRange: 'lowland' | 'highland' | 'varied';
}

// Behavioral traits for AI and combat
export interface BehavioralTraits {
  aggression: number; // 1-10
  intelligence: number; // 1-10
  courage: number; // 1-10
  sociability: number; // 1-10
  patience: number; // 1-10
  curiosity: number; // 1-10
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
  taxonomy?: TaxonomicInfo;
  period: {
    era: string;
    period: string;
    mya: [number, number];
  };
  size: {
    length: number;
    height: number;
    weight: number;
    sizeCategory: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'colossal';
  };
  role: DinosaurRole;
  diet: DietType;
  socialBehavior: SocialBehavior;
  activityPattern: ActivityPattern;
  locomotion: LocomotionType;
  physicalTraits: PhysicalTraits;
  environmentalPreferences: EnvironmentalPreferences;
  behavioralTraits: BehavioralTraits;
  baseStats: Omit<Stats, 'maxHealth' | 'maxStamina' | 'level' | 'experience'>;
  growthRates: GrowthRates;
  abilities: string[];
  passives: string[];
  synergyAbilities?: string[]; // Abilities that unlock with specific trait combinations
  weaknesses?: string[]; // Body parts or damage types this dinosaur is weak to
  resistances?: string[]; // Damage types this dinosaur resists
  unlockCondition?: {
    type: 'depth' | 'wins' | 'discoveries' | 'always' | 'achievement' | 'fossil_count';
    value?: number;
    description?: string;
  };
  scientificFacts: string[];
  description: string;
  funFact?: string;
  discoveryHistory?: {
    discoveredBy: string;
    year: number;
    location: string;
  };
  relatedSpecies?: string[];
}

// Combat-ready dinosaur instance
export interface DinosaurInstance extends Omit<DinosaurData, 'baseStats'> {
  instanceId: string;
  stats: Stats;
  currentHealth: number;
  currentStamina: number;
  activeBuffs: string[];
  activeDebuffs: string[];
  cooldowns: Map<string, number>;
  acquiredTraits: string[];
  evolutionPoints: number;
  combatExperience: number;
}
