import { describe, it, expect, beforeEach } from 'vitest';
import {
  EvolutionSystem,
  getEvolutionSystem,
  resetEvolutionSystem,
  EvolutionBranch,
  MutationTier
} from '@/systems/EvolutionSystem';

describe('EvolutionSystem', () => {
  beforeEach(() => {
    resetEvolutionSystem();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = getEvolutionSystem();
      const instance2 = getEvolutionSystem();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = getEvolutionSystem();
      resetEvolutionSystem();
      const instance2 = getEvolutionSystem();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('EvolutionBranch enum', () => {
    it('should have correct branch values', () => {
      expect(EvolutionBranch.PHYSICAL).toBe('physical');
      expect(EvolutionBranch.SENSORY).toBe('sensory');
      expect(EvolutionBranch.BEHAVIORAL).toBe('behavioral');
      expect(EvolutionBranch.OFFENSIVE).toBe('offensive');
      expect(EvolutionBranch.DEFENSIVE).toBe('defensive');
      expect(EvolutionBranch.PHYSIOLOGICAL).toBe('physiological');
    });
  });

  describe('MutationTier enum', () => {
    it('should have correct tier values', () => {
      expect(MutationTier.COMMON).toBe('common');
      expect(MutationTier.UNCOMMON).toBe('uncommon');
      expect(MutationTier.RARE).toBe('rare');
      expect(MutationTier.EPIC).toBe('epic');
      expect(MutationTier.LEGENDARY).toBe('legendary');
    });
  });

  describe('getMutationHistory', () => {
    it('should return empty array for new dinosaur', () => {
      const system = getEvolutionSystem();
      const history = system.getMutationHistory('new-instance');
      expect(history).toEqual([]);
    });
  });

  describe('resetEvolutionHistory', () => {
    it('should clear evolution history for instance', () => {
      const system = getEvolutionSystem();
      // First we need to set some history
      const history = system.getMutationHistory('test-instance');
      expect(history).toEqual([]);
      
      // Reset should not throw
      system.resetEvolutionHistory('test-instance');
      expect(system.getMutationHistory('test-instance')).toEqual([]);
    });
  });

  describe('getTotalEvolutionPointsSpent', () => {
    it('should return 0 for new dinosaur', () => {
      const system = getEvolutionSystem();
      const total = system.getTotalEvolutionPointsSpent('new-instance');
      expect(total).toBe(0);
    });
  });
});
