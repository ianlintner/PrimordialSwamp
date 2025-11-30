import { describe, it, expect } from 'vitest';
import dinosaursData from '@/data/dinosaurs.json';
import enemiesData from '@/data/enemies.json';
import traitsData from '@/data/traits.json';
import abilitiesData from '@/data/abilities.json';

describe('Game Data Validation', () => {
  describe('Dinosaurs Data', () => {
    it('should have at least 1 dinosaur', () => {
      expect(dinosaursData.length).toBeGreaterThan(0);
    });

    it('should have required fields for each dinosaur', () => {
      dinosaursData.forEach((dino: any) => {
        expect(dino.id).toBeDefined();
        expect(dino.name).toBeDefined();
        expect(dino.species).toBeDefined();
        expect(dino.baseStats).toBeDefined();
        expect(dino.baseStats.health).toBeGreaterThan(0);
        expect(dino.baseStats.attack).toBeGreaterThan(0);
        expect(dino.baseStats.defense).toBeGreaterThanOrEqual(0);
        expect(dino.baseStats.speed).toBeGreaterThan(0);
        expect(dino.baseStats.stamina).toBeGreaterThan(0);
      });
    });

    it('should have unique dinosaur IDs', () => {
      const ids = dinosaursData.map((d: any) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid period information', () => {
      dinosaursData.forEach((dino: any) => {
        expect(dino.period).toBeDefined();
        expect(dino.period.era).toBeDefined();
        expect(dino.period.period).toBeDefined();
        expect(Array.isArray(dino.period.mya)).toBe(true);
        expect(dino.period.mya.length).toBe(2);
      });
    });

    it('should have scientific facts', () => {
      dinosaursData.forEach((dino: any) => {
        expect(dino.scientificFacts).toBeDefined();
        expect(Array.isArray(dino.scientificFacts)).toBe(true);
        expect(dino.scientificFacts.length).toBeGreaterThan(0);
      });
    });

    it('should include the starter dinosaur (Deinonychus)', () => {
      const starter = dinosaursData.find((d: any) => d.id === 'deinonychus');
      expect(starter).toBeDefined();
      expect(starter.unlockCondition?.type).toBe('always');
    });
  });

  describe('Enemies Data', () => {
    it('should have at least 1 enemy', () => {
      expect(enemiesData.length).toBeGreaterThan(0);
    });

    it('should have required fields for each enemy', () => {
      enemiesData.forEach((enemy: any) => {
        expect(enemy.id).toBeDefined();
        expect(enemy.name).toBeDefined();
        expect(enemy.stats).toBeDefined();
        expect(enemy.stats.hp).toBeGreaterThan(0);
        expect(enemy.stats.attack).toBeGreaterThan(0);
        expect(enemy.tier).toBeDefined();
      });
    });

    it('should have unique enemy IDs', () => {
      const ids = enemiesData.map((e: any) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid tier classifications', () => {
      const validTiers = ['basic', 'advanced', 'elite', 'boss'];
      enemiesData.forEach((enemy: any) => {
        expect(validTiers).toContain(enemy.tier);
      });
    });

    it('should have at least one boss enemy', () => {
      const bosses = enemiesData.filter((e: any) => e.tier === 'boss');
      expect(bosses.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Traits Data', () => {
    it('should have at least 1 trait', () => {
      expect(traitsData.length).toBeGreaterThan(0);
    });

    it('should have required fields for each trait', () => {
      traitsData.forEach((trait: any) => {
        expect(trait.id).toBeDefined();
        expect(trait.name).toBeDefined();
        expect(trait.description).toBeDefined();
        expect(trait.type).toBeDefined();
      });
    });

    it('should have unique trait IDs', () => {
      const ids = traitsData.map((t: any) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Abilities Data', () => {
    it('should have at least 1 ability', () => {
      expect(abilitiesData.length).toBeGreaterThan(0);
    });

    it('should have required fields for each ability', () => {
      abilitiesData.forEach((ability: any) => {
        expect(ability.id).toBeDefined();
        expect(ability.name).toBeDefined();
        expect(ability.description).toBeDefined();
        expect(ability.staminaCost).toBeDefined();
        expect(ability.staminaCost).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have unique ability IDs', () => {
      const ids = abilitiesData.map((a: any) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Data Cross-References', () => {
    it('dinosaur abilities should exist in abilities data', () => {
      const abilityIds = new Set(abilitiesData.map((a: any) => a.id));
      
      dinosaursData.forEach((dino: any) => {
        if (dino.abilities) {
          dino.abilities.forEach((abilityId: string) => {
            expect(abilityIds.has(abilityId)).toBe(true);
          });
        }
      });
    });
  });
});
