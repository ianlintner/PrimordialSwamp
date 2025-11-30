import { describe, it, expect } from 'vitest';
import { DinosaurType, DinosaurRole } from '@/types/Dinosaur.types';
import { NodeType, BiomeType } from '@/types/Encounter.types';

describe('Type Enums', () => {
  describe('DinosaurType', () => {
    it('should have all expected dinosaur types', () => {
      expect(DinosaurType.DEINONYCHUS).toBe('deinonychus');
      expect(DinosaurType.ANKYLOSAURUS).toBe('ankylosaurus');
      expect(DinosaurType.PTERANODON).toBe('pteranodon');
      expect(DinosaurType.TYRANNOSAURUS).toBe('tyrannosaurus');
      expect(DinosaurType.PACHYCEPHALOSAURUS).toBe('pachycephalosaurus');
      expect(DinosaurType.COMPSOGNATHUS).toBe('compsognathus');
    });

    it('should have 6 dinosaur types', () => {
      const count = Object.keys(DinosaurType).length;
      expect(count).toBe(6);
    });
  });

  describe('DinosaurRole', () => {
    it('should have all expected roles', () => {
      expect(DinosaurRole.HUNTER).toBe('hunter');
      expect(DinosaurRole.TANK).toBe('tank');
      expect(DinosaurRole.SCOUT).toBe('scout');
      expect(DinosaurRole.POWERHOUSE).toBe('powerhouse');
      expect(DinosaurRole.SPECIALIST).toBe('specialist');
      expect(DinosaurRole.SWARM).toBe('swarm');
    });
  });

  describe('NodeType', () => {
    it('should have all expected node types', () => {
      expect(NodeType.COMBAT).toBe('combat');
      expect(NodeType.RESOURCE).toBe('resource');
      expect(NodeType.EVENT).toBe('event');
      expect(NodeType.SPECIAL).toBe('special');
      expect(NodeType.ELITE).toBe('elite');
      expect(NodeType.BOSS).toBe('boss');
      expect(NodeType.REST).toBe('rest');
    });

    it('should have 7 node types', () => {
      const count = Object.keys(NodeType).length;
      expect(count).toBe(7);
    });
  });

  describe('BiomeType', () => {
    it('should have all expected biomes', () => {
      expect(BiomeType.COASTAL_WETLANDS).toBe('coastal_wetlands');
      expect(BiomeType.FERN_PRAIRIES).toBe('fern_prairies');
      expect(BiomeType.VOLCANIC_HIGHLANDS).toBe('volcanic_highlands');
      expect(BiomeType.TAR_PITS).toBe('tar_pits');
    });

    it('should have 4 biome types', () => {
      const count = Object.keys(BiomeType).length;
      expect(count).toBe(4);
    });
  });
});
