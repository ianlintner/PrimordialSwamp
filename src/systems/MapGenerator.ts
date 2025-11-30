import { MapNode, NodeType, BiomeType } from '../types/Encounter.types';
import { SeededRandom } from '../utils/SeededRandom';

/**
 * Map generation configuration
 */
export interface MapConfig {
  columnCount: number;
  minNodesPerColumn: number;
  maxNodesPerColumn: number;
  combatWeight: number;
  resourceWeight: number;
  eventWeight: number;
  specialWeight: number;
  eliteInterval: number;
  restInterval: number;
}

/**
 * Default configuration for map generation
 */
const DEFAULT_CONFIG: MapConfig = {
  columnCount: 12,
  minNodesPerColumn: 2,
  maxNodesPerColumn: 4,
  combatWeight: 45,
  resourceWeight: 25,
  eventWeight: 20,
  specialWeight: 10,
  eliteInterval: 5,
  restInterval: 4,
};

/**
 * MapGenerator - creates procedural maps with seeded randomness
 */
export class MapGenerator {
  private rng: SeededRandom;
  private config: MapConfig;

  constructor(seed: string, config: Partial<MapConfig> = {}) {
    this.rng = new SeededRandom(seed);
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate a complete map for a biome
   */
  generateMap(biome: BiomeType, depth: number): MapNode[][] {
    const map: MapNode[][] = [];
    
    // Adjust config based on depth
    const adjustedConfig = this.adjustConfigForDepth(depth);

    // Generate starting node
    map.push([this.createNode('0-0', NodeType.REST, 0, biome, { x: 0, y: 0.5 })]);

    // Generate main map columns
    for (let col = 1; col < adjustedConfig.columnCount - 1; col++) {
      const column: MapNode[] = [];
      const nodeCount = this.rng.nextInt(
        adjustedConfig.minNodesPerColumn,
        adjustedConfig.maxNodesPerColumn
      );

      for (let row = 0; row < nodeCount; row++) {
        const nodeType = this.pickNodeType(col, adjustedConfig);
        const position = {
          x: col / (adjustedConfig.columnCount - 1),
          y: nodeCount === 1 ? 0.5 : row / (nodeCount - 1),
        };
        const node = this.createNode(`${col}-${row}`, nodeType, col, biome, position);
        column.push(node);
      }
      map.push(column);
    }

    // Generate boss node
    const bossCol = adjustedConfig.columnCount - 1;
    map.push([this.createNode(
      `${bossCol}-0`,
      NodeType.BOSS,
      bossCol,
      biome,
      { x: 1, y: 0.5 }
    )]);

    // Connect nodes
    this.connectNodes(map);

    return map;
  }

  /**
   * Adjust configuration based on run depth
   */
  private adjustConfigForDepth(depth: number): MapConfig {
    return {
      ...this.config,
      columnCount: this.config.columnCount + Math.floor(depth / 2),
      maxNodesPerColumn: Math.min(5, this.config.maxNodesPerColumn + Math.floor(depth / 3)),
      combatWeight: Math.max(30, this.config.combatWeight - depth * 2),
      eventWeight: this.config.eventWeight + depth,
      specialWeight: this.config.specialWeight + Math.floor(depth / 2),
    };
  }

  /**
   * Pick a node type based on position and weights
   */
  private pickNodeType(column: number, config: MapConfig): NodeType {
    // Force elite every N columns after column 3
    if (column > 3 && column % config.eliteInterval === 0) {
      return NodeType.ELITE;
    }

    // Rest nodes at regular intervals
    if (column > 0 && column % config.restInterval === 0) {
      if (this.rng.chance(0.4)) {
        return NodeType.REST;
      }
    }

    // Weighted selection for normal nodes
    const types: NodeType[] = [
      NodeType.COMBAT,
      NodeType.RESOURCE,
      NodeType.EVENT,
      NodeType.SPECIAL,
    ];
    const weights: number[] = [
      config.combatWeight,
      config.resourceWeight,
      config.eventWeight,
      config.specialWeight,
    ];

    return this.rng.weightedPick(types, weights);
  }

  /**
   * Create a map node
   */
  private createNode(
    id: string,
    type: NodeType,
    depth: number,
    biome: BiomeType,
    position: { x: number; y: number }
  ): MapNode {
    return {
      id,
      type,
      position,
      depth,
      biome,
      connections: [],
      visited: false,
      available: depth === 0, // Only first column available initially
    };
  }

  /**
   * Connect nodes between columns
   * Ensures all nodes are reachable and there are no dead ends
   */
  private connectNodes(map: MapNode[][]): void {
    for (let col = 0; col < map.length - 1; col++) {
      const currentColumn = map[col];
      const nextColumn = map[col + 1];

      // Each node in current column must connect to at least one node in next column
      currentColumn.forEach((node, nodeIndex) => {
        // Calculate which nodes in next column this node can connect to
        const validTargets = this.getValidConnectionTargets(
          nodeIndex,
          currentColumn.length,
          nextColumn.length
        );

        // Connect to 1-3 nodes (more connections for nodes in the middle)
        const numConnections = this.rng.nextInt(1, Math.min(3, validTargets.length));
        const shuffledTargets = this.rng.shuffle([...validTargets]);
        
        for (let i = 0; i < numConnections; i++) {
          const targetIndex = shuffledTargets[i];
          const targetNode = nextColumn[targetIndex];
          if (!node.connections.includes(targetNode.id)) {
            node.connections.push(targetNode.id);
          }
        }
      });

      // Ensure all nodes in next column are reachable
      nextColumn.forEach((targetNode, targetIndex) => {
        const hasIncoming = currentColumn.some(node => 
          node.connections.includes(targetNode.id)
        );

        if (!hasIncoming) {
          // Find a valid source node to connect from
          const validSources = currentColumn.filter((_, sourceIndex) => {
            const validTargets = this.getValidConnectionTargets(
              sourceIndex,
              currentColumn.length,
              nextColumn.length
            );
            return validTargets.includes(targetIndex);
          });

          if (validSources.length > 0) {
            const sourceNode = this.rng.pick(validSources);
            sourceNode.connections.push(targetNode.id);
          } else {
            // Fallback: connect from closest node
            const closestSource = currentColumn[
              Math.min(targetIndex, currentColumn.length - 1)
            ];
            closestSource.connections.push(targetNode.id);
          }
        }
      });
    }
  }

  /**
   * Get valid connection targets based on position
   * Prevents crossing paths by limiting connections to nearby nodes
   */
  private getValidConnectionTargets(
    sourceIndex: number,
    sourceColumnSize: number,
    targetColumnSize: number
  ): number[] {
    // Map source position to target range
    const sourceRatio = sourceColumnSize === 1 ? 0.5 : sourceIndex / (sourceColumnSize - 1);
    const targetCenter = Math.round(sourceRatio * (targetColumnSize - 1));

    // Allow connections to nodes within 1 position of the mapped center
    const targets: number[] = [];
    for (let i = Math.max(0, targetCenter - 1); i <= Math.min(targetColumnSize - 1, targetCenter + 1); i++) {
      targets.push(i);
    }

    return targets;
  }

  /**
   * Get the seeded random instance for additional randomization
   */
  getRng(): SeededRandom {
    return this.rng;
  }

  /**
   * Reset the RNG to initial state
   */
  reset(): void {
    this.rng.reset();
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<MapConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): MapConfig {
    return { ...this.config };
  }
}

/**
 * Validate map connectivity
 * Returns true if all nodes are reachable from start
 */
export function validateMapConnectivity(map: MapNode[][]): boolean {
  if (map.length === 0 || map[0].length === 0) return false;

  const reachable = new Set<string>();
  const queue: string[] = [map[0][0].id];

  // Create a lookup map for quick access
  const nodeMap = new Map<string, MapNode>();
  map.forEach(column => {
    column.forEach(node => {
      nodeMap.set(node.id, node);
    });
  });

  // BFS to find all reachable nodes
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (reachable.has(currentId)) continue;

    reachable.add(currentId);
    const node = nodeMap.get(currentId);
    if (node) {
      node.connections.forEach(connId => {
        if (!reachable.has(connId)) {
          queue.push(connId);
        }
      });
    }
  }

  // Check if all nodes are reachable
  const totalNodes = map.reduce((sum, col) => sum + col.length, 0);
  return reachable.size === totalNodes;
}

/**
 * Find all possible paths through the map
 */
export function findAllPaths(map: MapNode[][]): string[][] {
  if (map.length === 0 || map[0].length === 0) return [];

  const paths: string[][] = [];
  const nodeMap = new Map<string, MapNode>();
  map.forEach(column => {
    column.forEach(node => {
      nodeMap.set(node.id, node);
    });
  });

  const lastColumn = map[map.length - 1];
  const endNodeIds = new Set(lastColumn.map(n => n.id));

  function dfs(nodeId: string, currentPath: string[]): void {
    currentPath.push(nodeId);

    if (endNodeIds.has(nodeId)) {
      paths.push([...currentPath]);
    } else {
      const node = nodeMap.get(nodeId);
      if (node) {
        node.connections.forEach(connId => {
          dfs(connId, currentPath);
        });
      }
    }

    currentPath.pop();
  }

  dfs(map[0][0].id, []);
  return paths;
}
