import { DinosaurType } from './Dinosaur.types';

export enum NodeType {
  COMBAT = 'combat',
  RESOURCE = 'resource',
  EVENT = 'event',
  SPECIAL = 'special',
  ELITE = 'elite',
  BOSS = 'boss',
  REST = 'rest'
}

export enum BiomeType {
  COASTAL_WETLANDS = 'coastal_wetlands',
  FERN_PRAIRIES = 'fern_prairies',
  VOLCANIC_HIGHLANDS = 'volcanic_highlands',
  TAR_PITS = 'tar_pits'
}

export interface MapNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  depth: number;
  biome: BiomeType;
  connections: string[]; // Node IDs
  visited: boolean;
  available: boolean;
  encounter?: Encounter;
}

export interface Encounter {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  choices?: EncounterChoice[];
  enemies?: EnemySpawn[];
  rewards?: Reward[];
  educationalContent?: CodexEntry;
}

export interface EncounterChoice {
  id: string;
  text: string;
  requirements?: Requirement[];
  outcomes: Outcome[];
  scientificContext?: string;
}

export interface Requirement {
  type: 'stat' | 'trait' | 'item' | 'dinosaur';
  target: string;
  value: number | string;
  comparison?: 'greater' | 'less' | 'equal';
}

export interface Outcome {
  type: 'combat' | 'reward' | 'damage' | 'heal' | 'trait' | 'codex';
  value?: any;
  chance?: number;
  description: string;
}

export interface EnemySpawn {
  enemyId: string;
  level: number;
  count: number;
}

export interface Reward {
  type: 'fossils' | 'health' | 'stamina' | 'trait' | 'item' | 'codex';
  value: number | string;
  description: string;
}

export interface CodexEntry {
  id: string;
  category: 'dinosaur' | 'period' | 'ecosystem' | 'discovery';
  title: string;
  content: string;
  scientificName?: string;
  imageUrl?: string;
  discovered: boolean;
  sources?: string[];
}

export interface CurrentRunState {
  seed: string;
  dinosaur: DinosaurType;
  currentNodeId: string;
  nodesVisited: string[];
  mapNodes: MapNode[][]; // Store the generated map
  health: number;
  stamina: number;
  traits: string[];
  inventory: string[];
  biome: BiomeType;
  depth: number;
  fossilsCollected: number;
  combatsWon: number;
  startTime: number;
}
