import { CurrentRunState, NodeType } from '../types/Encounter.types';
import { VictorySummary } from '../types/Victory.types';

/** Minimal node shape needed to decide whether a run has no remaining moves. */
export interface RunNodeState {
  id: string;
  type: NodeType | string;
  visited: boolean;
  available: boolean;
}

/**
 * A run is complete once the boss node has been visited and no node is both
 * unvisited and available. This is the sole routing predicate shared by the
 * boss-victory handler and the map soft-lock guard.
 */
export function isRunComplete(nodes: RunNodeState[][]): boolean {
  const allNodes = nodes.flat();
  if (allNodes.length === 0) return false;

  const bossVisited = allNodes.some(
    (node) => node.type === NodeType.BOSS && node.visited
  );
  if (!bossVisited) return false;

  const hasPlayableNode = allNodes.some(
    (node) => !node.visited && node.available
  );
  return !hasPlayableNode;
}

/** Convert a map node id such as "4-0" into its 1-based depth (5). */
export function depthFromNodeId(nodeId: string | undefined): number {
  if (!nodeId) return 1;
  const column = Number(nodeId.split('-')[0]);
  return Number.isFinite(column) ? column + 1 : 1;
}

/** Build the VictoryScene run summary before the run is cleared. */
export function buildVictorySummary(run: CurrentRunState): VictorySummary {
  return {
    dinosaur: run.dinosaur,
    depth: depthFromNodeId(run.currentNodeId),
    combatsWon: run.combatsWon,
    fossilsCollected: run.fossilsCollected,
    runDurationMs: Math.max(0, Date.now() - run.startTime),
  };
}
