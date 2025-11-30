import { describe, it, expect, beforeEach } from 'vitest';
import { 
  MapGenerator, 
  validateMapConnectivity, 
  findAllPaths 
} from '@/systems/MapGenerator';
import { BiomeType, NodeType } from '@/types/Encounter.types';

describe('MapGenerator', () => {
  describe('generateMap()', () => {
    it('should generate a map with start and boss nodes', () => {
      const generator = new MapGenerator('test-seed');
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      expect(map.length).toBeGreaterThan(2);
      
      // First column should have a REST node (starting point)
      expect(map[0][0].type).toBe(NodeType.REST);
      
      // Last column should have a BOSS node
      const lastColumn = map[map.length - 1];
      expect(lastColumn.some(node => node.type === NodeType.BOSS)).toBe(true);
    });

    it('should generate reproducible maps with same seed', () => {
      const gen1 = new MapGenerator('same-seed');
      const gen2 = new MapGenerator('same-seed');

      const map1 = gen1.generateMap(BiomeType.COASTAL_WETLANDS, 0);
      const map2 = gen2.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      // Should have same structure
      expect(map1.length).toBe(map2.length);
      
      for (let col = 0; col < map1.length; col++) {
        expect(map1[col].length).toBe(map2[col].length);
        for (let row = 0; row < map1[col].length; row++) {
          expect(map1[col][row].type).toBe(map2[col][row].type);
        }
      }
    });

    it('should generate different maps with different seeds', () => {
      const gen1 = new MapGenerator('seed-one');
      const gen2 = new MapGenerator('seed-two');

      const map1 = gen1.generateMap(BiomeType.COASTAL_WETLANDS, 0);
      const map2 = gen2.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      // At least some difference should exist
      let hasDifference = false;
      const minLen = Math.min(map1.length, map2.length);
      
      for (let col = 1; col < minLen - 1; col++) {
        if (map1[col].length !== map2[col].length) {
          hasDifference = true;
          break;
        }
        for (let row = 0; row < Math.min(map1[col].length, map2[col].length); row++) {
          if (map1[col][row].type !== map2[col][row].type) {
            hasDifference = true;
            break;
          }
        }
        if (hasDifference) break;
      }
      
      expect(hasDifference).toBe(true);
    });

    it('should set correct biome on all nodes', () => {
      const generator = new MapGenerator('test-seed');
      const map = generator.generateMap(BiomeType.VOLCANIC_HIGHLANDS, 0);

      map.forEach(column => {
        column.forEach(node => {
          expect(node.biome).toBe(BiomeType.VOLCANIC_HIGHLANDS);
        });
      });
    });

    it('should set correct depth on all nodes', () => {
      const generator = new MapGenerator('test-seed');
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      map.forEach((column, colIndex) => {
        column.forEach(node => {
          expect(node.depth).toBe(colIndex);
        });
      });
    });

    it('should only have first column available initially', () => {
      const generator = new MapGenerator('test-seed');
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      // First column should be available
      expect(map[0][0].available).toBe(true);

      // Other columns should not be available
      for (let col = 1; col < map.length; col++) {
        map[col].forEach(node => {
          expect(node.available).toBe(false);
        });
      }
    });

    it('should create connections between columns', () => {
      const generator = new MapGenerator('test-seed');
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      // All nodes except last column should have connections
      for (let col = 0; col < map.length - 1; col++) {
        map[col].forEach(node => {
          expect(node.connections.length).toBeGreaterThan(0);
        });
      }
    });

    it('should increase map size with depth', () => {
      const generator = new MapGenerator('test-seed');
      const map0 = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
      
      generator.reset();
      const map5 = generator.generateMap(BiomeType.COASTAL_WETLANDS, 5);

      expect(map5.length).toBeGreaterThanOrEqual(map0.length);
    });
  });

  describe('Node type distribution', () => {
    it('should include variety of node types', () => {
      const generator = new MapGenerator('variety-seed');
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      const nodeTypes = new Set<NodeType>();
      map.forEach(column => {
        column.forEach(node => {
          nodeTypes.add(node.type);
        });
      });

      // Should have at least REST, BOSS, and some others
      expect(nodeTypes.has(NodeType.REST)).toBe(true);
      expect(nodeTypes.has(NodeType.BOSS)).toBe(true);
      expect(nodeTypes.size).toBeGreaterThan(2);
    });
  });

  describe('reset()', () => {
    it('should reset RNG to initial state', () => {
      const generator = new MapGenerator('test-seed');
      
      const map1 = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
      generator.reset();
      const map2 = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);

      expect(map1.length).toBe(map2.length);
      for (let col = 0; col < map1.length; col++) {
        expect(map1[col].length).toBe(map2[col].length);
      }
    });
  });

  describe('Configuration', () => {
    it('should respect custom column count', () => {
      const generator = new MapGenerator('test-seed', {
        columnCount: 15,
      });
      
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
      expect(map.length).toBe(15);
    });

    it('should respect min/max nodes per column', () => {
      const generator = new MapGenerator('test-seed', {
        minNodesPerColumn: 3,
        maxNodesPerColumn: 3,
      });
      
      const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
      
      // Middle columns (not first or last) should have exactly 3 nodes
      for (let col = 1; col < map.length - 1; col++) {
        expect(map[col].length).toBe(3);
      }
    });

    it('should allow updating configuration', () => {
      const generator = new MapGenerator('test-seed');
      generator.setConfig({ columnCount: 20 });
      
      const config = generator.getConfig();
      expect(config.columnCount).toBe(20);
    });
  });

  describe('getRng()', () => {
    it('should return the seeded random instance', () => {
      const generator = new MapGenerator('test-seed');
      const rng = generator.getRng();
      
      expect(rng).toBeDefined();
      expect(typeof rng.next).toBe('function');
    });
  });
});

describe('validateMapConnectivity()', () => {
  it('should return true for valid connected map', () => {
    const generator = new MapGenerator('test-seed');
    const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
    
    expect(validateMapConnectivity(map)).toBe(true);
  });

  it('should return false for empty map', () => {
    expect(validateMapConnectivity([])).toBe(false);
  });

  it('should return false for map with empty first column', () => {
    expect(validateMapConnectivity([[]])).toBe(false);
  });
});

describe('findAllPaths()', () => {
  it('should find paths through the map', () => {
    const generator = new MapGenerator('test-seed');
    const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
    
    const paths = findAllPaths(map);
    
    expect(paths.length).toBeGreaterThan(0);
    
    // All paths should start with first node and end with last
    paths.forEach(path => {
      expect(path[0]).toBe(map[0][0].id);
      expect(map[map.length - 1].some(n => n.id === path[path.length - 1])).toBe(true);
    });
  });

  it('should return empty array for empty map', () => {
    expect(findAllPaths([])).toEqual([]);
  });

  it('should find multiple paths when they exist', () => {
    const generator = new MapGenerator('multi-path-seed', {
      minNodesPerColumn: 3,
      maxNodesPerColumn: 4,
    });
    const map = generator.generateMap(BiomeType.COASTAL_WETLANDS, 0);
    
    const paths = findAllPaths(map);
    
    // With multiple nodes per column, there should be multiple paths
    expect(paths.length).toBeGreaterThan(1);
  });
});
