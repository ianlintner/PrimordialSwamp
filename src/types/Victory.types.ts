import { DinosaurType } from './Dinosaur.types';

/** Run summary handed to VictoryScene before the run state is cleared. */
export interface VictorySummary {
  dinosaur: DinosaurType;
  depth: number;
  combatsWon: number;
  fossilsCollected: number;
  runDurationMs: number;
}
