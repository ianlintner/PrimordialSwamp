import { describe, expect, it } from 'vitest';
import { BiomeType, NodeType } from '../../src/types/Encounter.types';
import { DinosaurType } from '../../src/types/Dinosaur.types';
import {
  buildVictorySummary,
  depthFromNodeId,
  isRunComplete,
  RunNodeState,
} from '../../src/utils/RunCompletion';

const node = (
  id: string,
  type: NodeType,
  visited = false,
  available = false
): RunNodeState => ({ id, type, visited, available });

/** Five columns: rest, combat, event, elite, boss. */
function fiveColumnMap(bossVisited: boolean, extraAvailable = false): RunNodeState[][] {
  return [
    [node('0-0', NodeType.REST, true)],
    [node('1-0', NodeType.COMBAT, true)],
    [node('2-0', NodeType.EVENT, true)],
    [node('3-0', NodeType.ELITE, true)],
    [node('4-0', NodeType.BOSS, bossVisited)],
    ...(extraAvailable ? [[node('5-0', NodeType.RESOURCE, false, true)]] : []),
  ];
}

describe('isRunComplete', () => {
  it('is false for a fresh map whose boss is unvisited', () => {
    const map = fiveColumnMap(false);
    map[0][0].available = true;
    expect(isRunComplete(map)).toBe(false);
  });

  it('is true when the boss is visited and nothing is playable', () => {
    expect(isRunComplete(fiveColumnMap(true))).toBe(true);
  });

  it('is false when the boss is visited but another node is available', () => {
    expect(isRunComplete(fiveColumnMap(true, true))).toBe(false);
  });

  it('is false when the boss was never visited even with no playable node', () => {
    expect(isRunComplete(fiveColumnMap(false))).toBe(false);
  });

  it('is false for an empty map', () => {
    expect(isRunComplete([])).toBe(false);
  });

  it('accepts the real MapScene node shape with extra fields', () => {
    const nodes = [
      [
        {
          id: '0-0',
          type: NodeType.COMBAT,
          visited: true,
          available: false,
          x: 100,
          y: 200,
          connections: [],
          data: {},
          visual: {},
        },
      ],
      [
        {
          id: '1-0',
          type: NodeType.BOSS,
          visited: true,
          available: false,
          x: 280,
          y: 200,
          connections: [],
          data: {},
          visual: {},
        },
      ],
    ];
    expect(isRunComplete(nodes)).toBe(true);
  });
});

describe('depthFromNodeId', () => {
  it('converts zero-based column ids to one-based depths', () => {
    expect(depthFromNodeId('4-0')).toBe(5);
    expect(depthFromNodeId('0-0')).toBe(1);
  });

  it('falls back to depth 1 for a missing or malformed id', () => {
    expect(depthFromNodeId(undefined)).toBe(1);
    expect(depthFromNodeId('boss')).toBe(1);
  });
});

describe('buildVictorySummary', () => {
  it('captures the run fields before the run is cleared', () => {
    const now = Date.now();
    const summary = buildVictorySummary({
      seed: 'seed-1',
      dinosaur: DinosaurType.TYRANNOSAURUS,
      currentNodeId: '4-0',
      nodesVisited: ['0-0', '4-0'],
      mapNodes: [],
      health: 50,
      stamina: 30,
      traits: [],
      inventory: [],
      biome: BiomeType.COASTAL_WETLANDS,
      depth: 0,
      fossilsCollected: 42,
      combatsWon: 5,
      startTime: now - 65_000,
    });

    expect(summary).toMatchObject({
      dinosaur: DinosaurType.TYRANNOSAURUS,
      depth: 5,
      combatsWon: 5,
      fossilsCollected: 42,
    });
    expect(summary.runDurationMs).toBeGreaterThanOrEqual(65_000);
  });
});
