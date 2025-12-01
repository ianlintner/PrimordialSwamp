import { describe, it, expect, beforeEach } from 'vitest';
import {
  ResourceSystem,
  getResourceSystem,
  resetResourceSystem,
  ResourceType,
  Rarity,
  RARITY_CONFIG,
  BIOME_MODIFIERS
} from '@/systems/ResourceSystem';

describe('ResourceSystem', () => {
  beforeEach(() => {
    resetResourceSystem();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = getResourceSystem();
      const instance2 = getResourceSystem();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = getResourceSystem();
      resetResourceSystem();
      const instance2 = getResourceSystem();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('ResourceType enum', () => {
    it('should have correct resource type values', () => {
      expect(ResourceType.FOSSILS).toBe('fossils');
      expect(ResourceType.ENERGY).toBe('energy');
      expect(ResourceType.NUTRIENTS).toBe('nutrients');
      expect(ResourceType.EVOLUTION_POINTS).toBe('evolution_points');
      expect(ResourceType.EXPERIENCE).toBe('experience');
    });
  });

  describe('Rarity enum', () => {
    it('should have correct rarity values', () => {
      expect(Rarity.COMMON).toBe('common');
      expect(Rarity.UNCOMMON).toBe('uncommon');
      expect(Rarity.RARE).toBe('rare');
      expect(Rarity.EPIC).toBe('epic');
      expect(Rarity.LEGENDARY).toBe('legendary');
    });
  });

  describe('RARITY_CONFIG', () => {
    it('should have configuration for all rarities', () => {
      expect(RARITY_CONFIG[Rarity.COMMON]).toBeDefined();
      expect(RARITY_CONFIG[Rarity.UNCOMMON]).toBeDefined();
      expect(RARITY_CONFIG[Rarity.RARE]).toBeDefined();
      expect(RARITY_CONFIG[Rarity.EPIC]).toBeDefined();
      expect(RARITY_CONFIG[Rarity.LEGENDARY]).toBeDefined();
    });

    it('should have increasing multipliers for higher rarities', () => {
      expect(RARITY_CONFIG[Rarity.COMMON].multiplier).toBe(1.0);
      expect(RARITY_CONFIG[Rarity.UNCOMMON].multiplier).toBeGreaterThan(RARITY_CONFIG[Rarity.COMMON].multiplier);
      expect(RARITY_CONFIG[Rarity.RARE].multiplier).toBeGreaterThan(RARITY_CONFIG[Rarity.UNCOMMON].multiplier);
      expect(RARITY_CONFIG[Rarity.EPIC].multiplier).toBeGreaterThan(RARITY_CONFIG[Rarity.RARE].multiplier);
      expect(RARITY_CONFIG[Rarity.LEGENDARY].multiplier).toBeGreaterThan(RARITY_CONFIG[Rarity.EPIC].multiplier);
    });

    it('should have chances that sum close to 1', () => {
      const totalChance = Object.values(RARITY_CONFIG).reduce((sum, config) => sum + config.chance, 0);
      expect(totalChance).toBeCloseTo(1.0, 2);
    });
  });

  describe('BIOME_MODIFIERS', () => {
    it('should have modifiers for main biomes', () => {
      expect(BIOME_MODIFIERS['coastal_wetlands']).toBeDefined();
      expect(BIOME_MODIFIERS['fern_prairies']).toBeDefined();
      expect(BIOME_MODIFIERS['volcanic_highlands']).toBeDefined();
      expect(BIOME_MODIFIERS['tar_pits']).toBeDefined();
    });

    it('should have tar_pits with highest fossil bonus', () => {
      expect(BIOME_MODIFIERS['tar_pits'].fossilChanceBonus)
        .toBeGreaterThan(BIOME_MODIFIERS['coastal_wetlands'].fossilChanceBonus);
    });
  });

  describe('Inventory management', () => {
    it('should initialize with default values', () => {
      const system = getResourceSystem();
      const inventory = system.getInventory();
      
      expect(inventory.fossils).toBe(0);
      expect(inventory.energy).toBe(50);
      expect(inventory.maxEnergy).toBe(100);
      expect(inventory.nutrients).toBe(3);
      expect(inventory.maxNutrients).toBe(10);
      expect(inventory.evolutionPoints).toBe(0);
      expect(inventory.currentLevel).toBe(1);
    });

    it('should add resources correctly', () => {
      const system = getResourceSystem();
      
      system.addResource(ResourceType.FOSSILS, 10, 'test');
      expect(system.getResource(ResourceType.FOSSILS)).toBe(10);
      
      system.addResource(ResourceType.ENERGY, 20, 'test');
      expect(system.getResource(ResourceType.ENERGY)).toBe(70); // 50 + 20
    });

    it('should not exceed max energy', () => {
      const system = getResourceSystem();
      
      system.addResource(ResourceType.ENERGY, 100, 'test');
      expect(system.getResource(ResourceType.ENERGY)).toBe(100); // Capped at max
    });

    it('should spend resources correctly', () => {
      const system = getResourceSystem();
      
      system.addResource(ResourceType.FOSSILS, 50, 'test');
      const success = system.spendResource(ResourceType.FOSSILS, 20, 'test');
      
      expect(success).toBe(true);
      expect(system.getResource(ResourceType.FOSSILS)).toBe(30);
    });

    it('should fail to spend when insufficient', () => {
      const system = getResourceSystem();
      
      const success = system.spendResource(ResourceType.FOSSILS, 100, 'test');
      expect(success).toBe(false);
      expect(system.getResource(ResourceType.FOSSILS)).toBe(0);
    });

    it('should check resource availability correctly', () => {
      const system = getResourceSystem();
      
      system.addResource(ResourceType.FOSSILS, 50, 'test');
      
      expect(system.hasResource(ResourceType.FOSSILS, 30)).toBe(true);
      expect(system.hasResource(ResourceType.FOSSILS, 50)).toBe(true);
      expect(system.hasResource(ResourceType.FOSSILS, 51)).toBe(false);
    });
  });

  describe('Resource collection', () => {
    it('should generate resource drops', () => {
      const system = getResourceSystem();
      
      const event = system.generateResourceDrops('combat_victory');
      
      expect(event.drops.length).toBeGreaterThan(0);
      expect(event.totalValue).toBeGreaterThanOrEqual(0);
    });

    it('should collect resources from event', () => {
      const system = getResourceSystem();
      
      const event = system.generateResourceDrops('combat_victory');
      const fossilsBefore = system.getResource(ResourceType.FOSSILS);
      
      system.collectResources(event);
      
      const fossilsAfter = system.getResource(ResourceType.FOSSILS);
      expect(fossilsAfter).toBeGreaterThanOrEqual(fossilsBefore);
    });
  });

  describe('Run summary', () => {
    it('should track earned resources in summary', () => {
      const system = getResourceSystem();
      
      system.addResource(ResourceType.FOSSILS, 25, 'combat');
      system.addResource(ResourceType.FOSSILS, 15, 'discovery');
      
      const summary = system.getRunSummary();
      
      expect(summary[ResourceType.FOSSILS]).toBe(40);
    });
  });

  describe('Retained fossils on death', () => {
    it('should calculate 50% retention', () => {
      const system = getResourceSystem();
      
      system.addResource(ResourceType.FOSSILS, 100, 'test');
      
      const retained = system.calculateRetainedFossils();
      expect(retained).toBe(50);
    });
  });

  describe('Nutrient conversion', () => {
    it('should convert nutrients to healing', () => {
      const system = getResourceSystem();
      
      // Default nutrients is 3
      const healAmount = system.convertNutrientsToHealing(1);
      
      expect(healAmount).toBeGreaterThan(0);
      expect(healAmount).toBeLessThanOrEqual(15);
      expect(system.getResource(ResourceType.NUTRIENTS)).toBe(2);
    });

    it('should return 0 when no nutrients available', () => {
      const system = getResourceSystem();
      
      // Spend all nutrients
      system.spendResource(ResourceType.NUTRIENTS, 3, 'test');
      
      const healAmount = system.convertNutrientsToHealing(1);
      expect(healAmount).toBe(0);
    });
  });

  describe('Energy conversion', () => {
    it('should convert energy to stamina', () => {
      const system = getResourceSystem();
      
      const staminaAmount = system.convertEnergyToStamina(10);
      
      expect(staminaAmount).toBe(10); // 1:1 conversion
      expect(system.getResource(ResourceType.ENERGY)).toBe(40); // 50 - 10
    });
  });

  describe('Bonus multipliers', () => {
    it('should apply and clear bonus multipliers', () => {
      const system = getResourceSystem();
      
      system.setBonusMultiplier(ResourceType.FOSSILS, 2.0);
      system.clearBonusMultipliers();
      
      // No error thrown
      expect(true).toBe(true);
    });
  });
});
