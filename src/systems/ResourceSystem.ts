/**
 * ResourceSystem - Energy, nutrients, and rarity management
 * 
 * Manages the collection and consumption of resources during gameplay.
 * Handles three primary resource types: Fossils (meta), Energy (per-run),
 * and Nutrients (per-run), with a rarity system for rewards.
 * 
 * @module systems/ResourceSystem
 */

/**
 * Types of resources in the game
 */
export enum ResourceType {
  /** Meta-currency that persists across runs */
  FOSSILS = 'fossils',
  /** Per-run resource for stamina and abilities */
  ENERGY = 'energy',
  /** Per-run resource for healing and buffs */
  NUTRIENTS = 'nutrients',
  /** Evolution points for mutations */
  EVOLUTION_POINTS = 'evolution_points',
  /** Experience points for leveling */
  EXPERIENCE = 'experience'
}

/**
 * Rarity tiers affecting resource value
 */
export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

/**
 * Rarity tier configuration
 */
export interface RarityConfig {
  /** Chance of this rarity (0-1) */
  chance: number;
  /** Value multiplier for this rarity */
  multiplier: number;
  /** Display color for UI */
  color: string;
  /** Display icon */
  icon: string;
}

/**
 * Resource pickup/drop definition
 */
export interface ResourceDrop {
  type: ResourceType;
  baseAmount: number;
  rarity: Rarity;
  finalAmount: number;
  source: string;
  timestamp: number;
}

/**
 * Biome modifiers for resource generation
 */
export interface BiomeResourceModifier {
  biomeId: string;
  fossilChanceBonus: number;
  rareChanceBonus: number;
  energyDropBonus: number;
  nutrientDropBonus: number;
  specialResources?: string[];
}

/**
 * Resource inventory state
 */
export interface ResourceInventory {
  fossils: number;
  energy: number;
  maxEnergy: number;
  nutrients: number;
  maxNutrients: number;
  evolutionPoints: number;
  experience: number;
  experienceToNextLevel: number;
  currentLevel: number;
}

/**
 * Resource transaction record
 */
export interface ResourceTransaction {
  type: 'earn' | 'spend' | 'convert';
  resourceType: ResourceType;
  amount: number;
  reason: string;
  timestamp: number;
  balanceAfter: number;
}

/**
 * Resource collection event data
 */
export interface ResourceCollectionEvent {
  drops: ResourceDrop[];
  totalValue: number;
  rarestDrop: Rarity;
  bonusApplied?: string;
}

/**
 * Default rarity configurations
 */
export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  [Rarity.COMMON]: {
    chance: 0.60,
    multiplier: 1.0,
    color: '#888888',
    icon: '⚪'
  },
  [Rarity.UNCOMMON]: {
    chance: 0.25,
    multiplier: 1.5,
    color: '#2ecc71',
    icon: '🟢'
  },
  [Rarity.RARE]: {
    chance: 0.12,
    multiplier: 2.0,
    color: '#3498db',
    icon: '🔵'
  },
  [Rarity.EPIC]: {
    chance: 0.025,
    multiplier: 3.0,
    color: '#9b59b6',
    icon: '🟣'
  },
  [Rarity.LEGENDARY]: {
    chance: 0.005,
    multiplier: 5.0,
    color: '#f39c12',
    icon: '🟡'
  }
};

/**
 * Default biome resource modifiers
 */
export const BIOME_MODIFIERS: Record<string, BiomeResourceModifier> = {
  coastal_wetlands: {
    biomeId: 'coastal_wetlands',
    fossilChanceBonus: 0.10,
    rareChanceBonus: 0.0,
    energyDropBonus: 0.0,
    nutrientDropBonus: 0.15,
    specialResources: ['amber_deposit']
  },
  fern_prairies: {
    biomeId: 'fern_prairies',
    fossilChanceBonus: 0.0,
    rareChanceBonus: 0.0,
    energyDropBonus: 0.10,
    nutrientDropBonus: 0.20
  },
  volcanic_highlands: {
    biomeId: 'volcanic_highlands',
    fossilChanceBonus: 0.15,
    rareChanceBonus: 0.20,
    energyDropBonus: -0.10,
    nutrientDropBonus: -0.15,
    specialResources: ['volcanic_mineral']
  },
  tar_pits: {
    biomeId: 'tar_pits',
    fossilChanceBonus: 0.50,
    rareChanceBonus: 0.10,
    energyDropBonus: -0.20,
    nutrientDropBonus: -0.25,
    specialResources: ['preserved_specimen']
  }
};

/**
 * Base resource values by source
 */
export const BASE_RESOURCE_VALUES = {
  // Combat rewards
  combat_victory: {
    fossils: { min: 5, max: 15 },
    evolutionPoints: { min: 10, max: 30 }
  },
  combat_elite: {
    fossils: { min: 15, max: 30 },
    evolutionPoints: { min: 25, max: 50 }
  },
  combat_boss: {
    fossils: { min: 30, max: 60 },
    evolutionPoints: { min: 50, max: 100 }
  },
  // Exploration rewards
  resource_node: {
    nutrients: { min: 1, max: 3 },
    energy: { min: 5, max: 15 }
  },
  discovery_event: {
    fossils: { min: 3, max: 10 },
    evolutionPoints: { min: 5, max: 15 }
  },
  // Rest rewards
  rest_node: {
    energy: { min: 10, max: 20 }
  }
};

/**
 * ResourceSystem class
 * 
 * Manages all resource collection, consumption, and economy.
 */
export class ResourceSystem {
  private inventory: ResourceInventory;
  private transactions: ResourceTransaction[] = [];
  private currentBiome: string = 'coastal_wetlands';
  private bonusMultipliers: Map<ResourceType, number> = new Map();

  constructor() {
    this.inventory = this.createDefaultInventory();
  }

  /**
   * Create default starting inventory
   */
  private createDefaultInventory(): ResourceInventory {
    return {
      fossils: 0,
      energy: 50,
      maxEnergy: 100,
      nutrients: 3,
      maxNutrients: 10,
      evolutionPoints: 0,
      experience: 0,
      experienceToNextLevel: 100,
      currentLevel: 1
    };
  }

  /**
   * Initialize inventory for a new run
   */
  public initializeRun(startingBonuses?: Partial<ResourceInventory>): void {
    this.inventory = this.createDefaultInventory();
    this.transactions = [];

    // Apply any meta-progression bonuses
    if (startingBonuses) {
      Object.assign(this.inventory, startingBonuses);
    }
  }

  /**
   * Set current biome for modifier calculations
   */
  public setCurrentBiome(biomeId: string): void {
    this.currentBiome = biomeId;
  }

  /**
   * Roll for rarity of a resource drop
   */
  public rollRarity(biomeBonus: number = 0): Rarity {
    const roll = Math.random();
    let adjustedRoll = roll - biomeBonus;

    // Check from rarest to common
    if (adjustedRoll <= RARITY_CONFIG[Rarity.LEGENDARY].chance) {
      return Rarity.LEGENDARY;
    }
    if (adjustedRoll <= RARITY_CONFIG[Rarity.LEGENDARY].chance + RARITY_CONFIG[Rarity.EPIC].chance) {
      return Rarity.EPIC;
    }
    if (adjustedRoll <= RARITY_CONFIG[Rarity.LEGENDARY].chance + RARITY_CONFIG[Rarity.EPIC].chance + RARITY_CONFIG[Rarity.RARE].chance) {
      return Rarity.RARE;
    }
    if (adjustedRoll <= 1 - RARITY_CONFIG[Rarity.COMMON].chance) {
      return Rarity.UNCOMMON;
    }
    return Rarity.COMMON;
  }

  /**
   * Generate resource drops from a source
   * 
   * @param source - The source of the resource (combat_victory, resource_node, etc.)
   * @returns Resource collection event with all drops
   */
  public generateResourceDrops(source: string): ResourceCollectionEvent {
    const drops: ResourceDrop[] = [];
    const biomeModifier = BIOME_MODIFIERS[this.currentBiome] || BIOME_MODIFIERS.coastal_wetlands;
    const baseValues = BASE_RESOURCE_VALUES[source as keyof typeof BASE_RESOURCE_VALUES];

    if (!baseValues) {
      return {
        drops: [],
        totalValue: 0,
        rarestDrop: Rarity.COMMON
      };
    }

    let rarestDrop = Rarity.COMMON;

    // Generate drops for each resource type in the base values
    for (const [resourceKey, range] of Object.entries(baseValues)) {
      const resourceType = this.mapKeyToResourceType(resourceKey);
      if (!resourceType) continue;

      // Roll rarity
      const rarity = this.rollRarity(biomeModifier.rareChanceBonus);
      if (this.compareRarity(rarity, rarestDrop) > 0) {
        rarestDrop = rarity;
      }

      // Calculate base amount
      const baseAmount = this.rollRange(range.min, range.max);

      // Apply rarity multiplier
      const rarityMultiplier = RARITY_CONFIG[rarity].multiplier;

      // Apply biome modifier
      let biomeMultiplier = 1.0;
      if (resourceType === ResourceType.FOSSILS) {
        biomeMultiplier = 1 + biomeModifier.fossilChanceBonus;
      } else if (resourceType === ResourceType.ENERGY) {
        biomeMultiplier = 1 + biomeModifier.energyDropBonus;
      } else if (resourceType === ResourceType.NUTRIENTS) {
        biomeMultiplier = 1 + biomeModifier.nutrientDropBonus;
      }

      // Apply any bonus multipliers
      const bonusMultiplier = this.bonusMultipliers.get(resourceType) || 1.0;

      // Calculate final amount
      const finalAmount = Math.max(1, Math.floor(
        baseAmount * rarityMultiplier * biomeMultiplier * bonusMultiplier
      ));

      drops.push({
        type: resourceType,
        baseAmount,
        rarity,
        finalAmount,
        source,
        timestamp: Date.now()
      });
    }

    // Calculate total value (fossils as base unit)
    const totalValue = drops.reduce((sum, drop) => {
      if (drop.type === ResourceType.FOSSILS) {
        return sum + drop.finalAmount;
      }
      // Convert other resources to fossil equivalent
      return sum + Math.floor(drop.finalAmount * 0.5);
    }, 0);

    return {
      drops,
      totalValue,
      rarestDrop,
      bonusApplied: this.currentBiome
    };
  }

  /**
   * Collect resources and add to inventory
   * 
   * @param event - Resource collection event
   */
  public collectResources(event: ResourceCollectionEvent): void {
    for (const drop of event.drops) {
      this.addResource(drop.type, drop.finalAmount, drop.source);
    }
  }

  /**
   * Add a resource to the inventory
   */
  public addResource(type: ResourceType, amount: number, reason: string): void {
    const before = this.getResource(type);

    switch (type) {
      case ResourceType.FOSSILS:
        this.inventory.fossils += amount;
        break;
      case ResourceType.ENERGY:
        this.inventory.energy = Math.min(
          this.inventory.energy + amount,
          this.inventory.maxEnergy
        );
        break;
      case ResourceType.NUTRIENTS:
        this.inventory.nutrients = Math.min(
          this.inventory.nutrients + amount,
          this.inventory.maxNutrients
        );
        break;
      case ResourceType.EVOLUTION_POINTS:
        this.inventory.evolutionPoints += amount;
        break;
      case ResourceType.EXPERIENCE:
        this.addExperience(amount, reason);
        return; // Experience handles its own transaction
    }

    this.recordTransaction('earn', type, amount, reason, this.getResource(type));
  }

  /**
   * Spend a resource from the inventory
   * 
   * @returns True if the resource was successfully spent
   */
  public spendResource(type: ResourceType, amount: number, reason: string): boolean {
    if (!this.hasResource(type, amount)) {
      return false;
    }

    switch (type) {
      case ResourceType.FOSSILS:
        this.inventory.fossils -= amount;
        break;
      case ResourceType.ENERGY:
        this.inventory.energy -= amount;
        break;
      case ResourceType.NUTRIENTS:
        this.inventory.nutrients -= amount;
        break;
      case ResourceType.EVOLUTION_POINTS:
        this.inventory.evolutionPoints -= amount;
        break;
      case ResourceType.EXPERIENCE:
        // Experience typically isn't spent
        return false;
    }

    this.recordTransaction('spend', type, -amount, reason, this.getResource(type));
    return true;
  }

  /**
   * Check if player has enough of a resource
   */
  public hasResource(type: ResourceType, amount: number): boolean {
    return this.getResource(type) >= amount;
  }

  /**
   * Get current amount of a resource
   */
  public getResource(type: ResourceType): number {
    switch (type) {
      case ResourceType.FOSSILS:
        return this.inventory.fossils;
      case ResourceType.ENERGY:
        return this.inventory.energy;
      case ResourceType.NUTRIENTS:
        return this.inventory.nutrients;
      case ResourceType.EVOLUTION_POINTS:
        return this.inventory.evolutionPoints;
      case ResourceType.EXPERIENCE:
        return this.inventory.experience;
      default:
        return 0;
    }
  }

  /**
   * Get the full inventory state
   */
  public getInventory(): Readonly<ResourceInventory> {
    return { ...this.inventory };
  }

  /**
   * Add experience and handle level ups
   */
  private addExperience(amount: number, reason: string): void {
    this.inventory.experience += amount;

    // Check for level up
    while (this.inventory.experience >= this.inventory.experienceToNextLevel) {
      this.inventory.experience -= this.inventory.experienceToNextLevel;
      this.inventory.currentLevel++;
      this.inventory.experienceToNextLevel = this.calculateExpForLevel(this.inventory.currentLevel);
      
      // Record level up
      this.recordTransaction(
        'earn',
        ResourceType.EXPERIENCE,
        amount,
        `${reason} (LEVEL UP to ${this.inventory.currentLevel})`,
        this.inventory.experience
      );
    }

    this.recordTransaction('earn', ResourceType.EXPERIENCE, amount, reason, this.inventory.experience);
  }

  /**
   * Calculate experience required for a level
   */
  private calculateExpForLevel(level: number): number {
    // sqrt(level) * 100 formula from GAME_DESIGN.md
    return Math.floor(Math.sqrt(level) * 100);
  }

  /**
   * Convert nutrients to healing
   * 
   * @param nutrientCount - Number of nutrients to use
   * @returns Amount of HP to heal
   */
  public convertNutrientsToHealing(nutrientCount: number): number {
    if (!this.spendResource(ResourceType.NUTRIENTS, nutrientCount, 'healing')) {
      return 0;
    }

    // Each nutrient heals 10-15 HP
    const healAmount = nutrientCount * this.rollRange(10, 15);
    return healAmount;
  }

  /**
   * Convert energy to stamina
   * 
   * @param energyAmount - Amount of energy to convert
   * @returns Amount of stamina to restore
   */
  public convertEnergyToStamina(energyAmount: number): number {
    if (!this.spendResource(ResourceType.ENERGY, energyAmount, 'stamina_restore')) {
      return 0;
    }

    // 1:1 conversion
    return energyAmount;
  }

  /**
   * Set a temporary bonus multiplier for a resource type
   */
  public setBonusMultiplier(type: ResourceType, multiplier: number): void {
    this.bonusMultipliers.set(type, multiplier);
  }

  /**
   * Clear all bonus multipliers
   */
  public clearBonusMultipliers(): void {
    this.bonusMultipliers.clear();
  }

  /**
   * Get transaction history
   */
  public getTransactionHistory(): ReadonlyArray<ResourceTransaction> {
    return [...this.transactions];
  }

  /**
   * Get summary of resources earned in current run
   */
  public getRunSummary(): Record<ResourceType, number> {
    const summary: Record<ResourceType, number> = {
      [ResourceType.FOSSILS]: 0,
      [ResourceType.ENERGY]: 0,
      [ResourceType.NUTRIENTS]: 0,
      [ResourceType.EVOLUTION_POINTS]: 0,
      [ResourceType.EXPERIENCE]: 0
    };

    for (const transaction of this.transactions) {
      if (transaction.type === 'earn') {
        summary[transaction.resourceType] += transaction.amount;
      }
    }

    return summary;
  }

  /**
   * Calculate retained fossils on death (50%)
   */
  public calculateRetainedFossils(): number {
    return Math.floor(this.inventory.fossils * 0.5);
  }

  /**
   * Record a transaction
   */
  private recordTransaction(
    type: 'earn' | 'spend' | 'convert',
    resourceType: ResourceType,
    amount: number,
    reason: string,
    balanceAfter: number
  ): void {
    this.transactions.push({
      type,
      resourceType,
      amount,
      reason,
      timestamp: Date.now(),
      balanceAfter
    });
  }

  /**
   * Map string key to ResourceType
   */
  private mapKeyToResourceType(key: string): ResourceType | null {
    const mapping: Record<string, ResourceType> = {
      fossils: ResourceType.FOSSILS,
      energy: ResourceType.ENERGY,
      nutrients: ResourceType.NUTRIENTS,
      evolutionPoints: ResourceType.EVOLUTION_POINTS,
      experience: ResourceType.EXPERIENCE
    };
    return mapping[key] || null;
  }

  /**
   * Roll a random number in a range
   */
  private rollRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Compare two rarities (-1, 0, 1)
   */
  private compareRarity(a: Rarity, b: Rarity): number {
    const order = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY];
    return order.indexOf(a) - order.indexOf(b);
  }
}

// Singleton instance
let resourceSystemInstance: ResourceSystem | null = null;

/**
 * Get the singleton ResourceSystem instance
 */
export function getResourceSystem(): ResourceSystem {
  if (!resourceSystemInstance) {
    resourceSystemInstance = new ResourceSystem();
  }
  return resourceSystemInstance;
}

/**
 * Reset the ResourceSystem (for testing)
 */
export function resetResourceSystem(): void {
  resourceSystemInstance = null;
}
