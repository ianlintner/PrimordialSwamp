/**
 * EvolutionSystem - Player-driven mutation paths with visual feedback
 * 
 * This system manages organism evolution, allowing players to select
 * mutation paths that alter gameplay mechanics and visual appearance.
 * 
 * @module systems/EvolutionSystem
 */

import { DinosaurInstance, DinosaurRole, DietType } from '../types/Dinosaur.types';

/**
 * Evolution branch categories for mutation paths
 */
export enum EvolutionBranch {
  PHYSICAL = 'physical',
  SENSORY = 'sensory',
  BEHAVIORAL = 'behavioral',
  OFFENSIVE = 'offensive',
  DEFENSIVE = 'defensive',
  PHYSIOLOGICAL = 'physiological'
}

/**
 * Mutation tier levels affecting cost and power
 */
export enum MutationTier {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

/**
 * Prerequisites for unlocking a mutation
 */
export interface MutationPrerequisites {
  /** Required physical traits (e.g., hasFeathers, hasClaws) */
  physicalTraits?: string[];
  /** Required dinosaur roles */
  role?: DinosaurRole[];
  /** Required diet type */
  diet?: DietType[];
  /** Required locomotion type */
  locomotion?: string[];
  /** Required social behavior */
  socialBehavior?: string[];
  /** Required minimum stats */
  minStats?: Partial<Record<string, number>>;
  /** Required other mutations */
  requiredMutations?: string[];
  /** Required minimum evolution points spent */
  minEvolutionPointsSpent?: number;
  /** Required biome discoveries */
  biomesDiscovered?: string[];
}

/**
 * Effect applied by a mutation
 */
export interface MutationEffect {
  /** Stat to modify */
  stat?: string;
  /** Flat value change */
  value?: number;
  /** Percentage modifier */
  type: 'flat' | 'percent' | 'boolean';
  /** Special effect identifier */
  special?: string;
  /** Conditional application */
  condition?: string;
}

/**
 * Scientific basis for a mutation
 */
export interface ScientificBasis {
  description: string;
  evidence: string;
  citations: string[];
}

/**
 * Complete mutation definition
 */
export interface Mutation {
  id: string;
  name: string;
  category: EvolutionBranch;
  subcategory: string;
  tier: MutationTier;
  description: string;
  effects: MutationEffect[];
  prerequisites: MutationPrerequisites;
  incompatible: string[];
  evolutionPoints: number;
  scientificBasis: ScientificBasis;
  gameplayNote: string;
  visualChanges?: string[];
  soundEffects?: string[];
}

/**
 * Result of attempting to apply a mutation
 */
export interface MutationResult {
  success: boolean;
  mutation?: Mutation;
  errorCode?: MutationErrorCode;
  errorMessage?: string;
  newStats?: Partial<Record<string, number>>;
  unlockedAbilities?: string[];
  synergyTriggered?: string[];
}

/**
 * Error codes for mutation failures
 */
export enum MutationErrorCode {
  INSUFFICIENT_POINTS = 'insufficient_points',
  PREREQUISITES_NOT_MET = 'prerequisites_not_met',
  INCOMPATIBLE_MUTATION = 'incompatible_mutation',
  ALREADY_ACQUIRED = 'already_acquired',
  INVALID_MUTATION = 'invalid_mutation'
}

/**
 * Evolution branch selection event
 */
export interface BranchSelectionEvent {
  availableBranches: EvolutionBranch[];
  mutations: Map<EvolutionBranch, Mutation[]>;
  currentEvolutionPoints: number;
  dinosaurInstance: DinosaurInstance;
}

/**
 * Visual feedback for evolution events
 */
export interface EvolutionVisualFeedback {
  mutationId: string;
  animationType: 'glow' | 'morph' | 'pulse' | 'particle_burst';
  duration: number;
  colors: string[];
  soundEffect: string;
  screenEffect?: 'shake' | 'flash' | 'zoom';
}

/**
 * EvolutionSystem class
 * 
 * Manages the evolution/mutation system for dinosaurs.
 * Provides player-driven mutation path selection with clear visual feedback.
 */
export class EvolutionSystem {
  private mutations: Map<string, Mutation> = new Map();
  private evolutionHistory: Map<string, string[]> = new Map(); // instanceId -> mutationIds
  private synergies: Map<string, string[]> = new Map(); // synergy combos

  constructor() {
    this.loadMutationsFromData();
    this.loadSynergies();
  }

  /**
   * Load mutations from JSON data file
   */
  private loadMutationsFromData(): void {
    // In production, this would load from mutations.json
    // Placeholder for mutation loading logic
  }

  /**
   * Load synergy combinations
   */
  private loadSynergies(): void {
    // Define mutation synergies
    this.synergies.set('apex_predator', ['binocular_enhancement', 'solitary_hunter', 'gigantism']);
    this.synergies.set('pack_hunter', ['pack_mentality', 'enhanced_olfaction', 'sickle_claw_enlargement']);
    this.synergies.set('armored_fortress', ['osteoderm_armor', 'bone_density_increase', 'tail_club_development']);
    this.synergies.set('night_stalker', ['nocturnal_adaptation', 'enhanced_olfaction', 'venom_glands']);
    this.synergies.set('aquatic_specialist', ['electroreception', 'thermoregulation_sail', 'bone_density_increase']);
  }

  /**
   * Get available mutations for a dinosaur based on current state
   * 
   * @param dinosaur - The dinosaur instance to check mutations for
   * @returns Map of branches to available mutations
   */
  public getAvailableMutations(dinosaur: DinosaurInstance): Map<EvolutionBranch, Mutation[]> {
    const available = new Map<EvolutionBranch, Mutation[]>();

    for (const branch of Object.values(EvolutionBranch)) {
      const branchMutations: Mutation[] = [];

      this.mutations.forEach((mutation) => {
        if (mutation.category === branch && this.canAcquireMutation(dinosaur, mutation)) {
          branchMutations.push(mutation);
        }
      });

      if (branchMutations.length > 0) {
        available.set(branch, branchMutations);
      }
    }

    return available;
  }

  /**
   * Check if a dinosaur can acquire a specific mutation
   * 
   * @param dinosaur - The dinosaur instance
   * @param mutation - The mutation to check
   * @returns True if the mutation can be acquired
   */
  public canAcquireMutation(dinosaur: DinosaurInstance, mutation: Mutation): boolean {
    // Check if already acquired
    const history = this.evolutionHistory.get(dinosaur.instanceId) || [];
    if (history.includes(mutation.id)) {
      return false;
    }

    // Check evolution points
    if (dinosaur.evolutionPoints < mutation.evolutionPoints) {
      return false;
    }

    // Check incompatibilities
    for (const incompatibleId of mutation.incompatible) {
      if (history.includes(incompatibleId)) {
        return false;
      }
    }

    // Check prerequisites
    return this.checkPrerequisites(dinosaur, mutation.prerequisites, history);
  }

  /**
   * Check if prerequisites are met for a mutation
   * 
   * @param dinosaur - The dinosaur instance
   * @param prereqs - Prerequisites to check
   * @param history - Mutation history for the dinosaur
   * @returns True if all prerequisites are met
   */
  private checkPrerequisites(
    dinosaur: DinosaurInstance,
    prereqs: MutationPrerequisites,
    history: string[]
  ): boolean {
    // Check physical traits
    if (prereqs.physicalTraits) {
      for (const trait of prereqs.physicalTraits) {
        if (!this.hasPhysicalTrait(dinosaur, trait)) {
          return false;
        }
      }
    }

    // Check role
    if (prereqs.role && !prereqs.role.includes(dinosaur.role)) {
      return false;
    }

    // Check diet
    if (prereqs.diet && !prereqs.diet.includes(dinosaur.diet)) {
      return false;
    }

    // Check required mutations
    if (prereqs.requiredMutations) {
      for (const reqMutation of prereqs.requiredMutations) {
        if (!history.includes(reqMutation)) {
          return false;
        }
      }
    }

    // Check minimum stats
    if (prereqs.minStats) {
      for (const [stat, minValue] of Object.entries(prereqs.minStats)) {
        const currentValue = this.getStatValue(dinosaur, stat);
        if (minValue !== undefined && currentValue < minValue) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Apply a mutation to a dinosaur
   * 
   * @param dinosaur - The dinosaur instance to mutate
   * @param mutationId - The ID of the mutation to apply
   * @returns Result of the mutation attempt
   */
  public applyMutation(dinosaur: DinosaurInstance, mutationId: string): MutationResult {
    const mutation = this.mutations.get(mutationId);

    if (!mutation) {
      return {
        success: false,
        errorCode: MutationErrorCode.INVALID_MUTATION,
        errorMessage: `Mutation "${mutationId}" not found`
      };
    }

    // Verify can acquire
    if (!this.canAcquireMutation(dinosaur, mutation)) {
      const history = this.evolutionHistory.get(dinosaur.instanceId) || [];

      if (history.includes(mutation.id)) {
        return {
          success: false,
          errorCode: MutationErrorCode.ALREADY_ACQUIRED,
          errorMessage: `Mutation "${mutation.name}" already acquired`
        };
      }

      if (dinosaur.evolutionPoints < mutation.evolutionPoints) {
        return {
          success: false,
          errorCode: MutationErrorCode.INSUFFICIENT_POINTS,
          errorMessage: `Need ${mutation.evolutionPoints} EP, have ${dinosaur.evolutionPoints}`
        };
      }

      for (const incompatibleId of mutation.incompatible) {
        if (history.includes(incompatibleId)) {
          const incompatibleMutation = this.mutations.get(incompatibleId);
          return {
            success: false,
            errorCode: MutationErrorCode.INCOMPATIBLE_MUTATION,
            errorMessage: `Incompatible with "${incompatibleMutation?.name || incompatibleId}"`
          };
        }
      }

      return {
        success: false,
        errorCode: MutationErrorCode.PREREQUISITES_NOT_MET,
        errorMessage: 'Prerequisites not met for this mutation'
      };
    }

    // Apply mutation effects
    const newStats = this.applyMutationEffects(dinosaur, mutation);

    // Deduct evolution points
    dinosaur.evolutionPoints -= mutation.evolutionPoints;

    // Record in history
    const history = this.evolutionHistory.get(dinosaur.instanceId) || [];
    history.push(mutation.id);
    this.evolutionHistory.set(dinosaur.instanceId, history);

    // Check for synergies
    const triggeredSynergies = this.checkSynergies(history);

    return {
      success: true,
      mutation,
      newStats,
      synergyTriggered: triggeredSynergies
    };
  }

  /**
   * Apply mutation effects to a dinosaur's stats
   * 
   * @param dinosaur - The dinosaur instance
   * @param mutation - The mutation to apply
   * @returns Map of stat changes
   */
  private applyMutationEffects(
    dinosaur: DinosaurInstance,
    mutation: Mutation
  ): Partial<Record<string, number>> {
    const changes: Partial<Record<string, number>> = {};

    for (const effect of mutation.effects) {
      if (effect.stat) {
        const currentValue = this.getStatValue(dinosaur, effect.stat);
        let newValue: number;

        if (effect.type === 'flat' && effect.value !== undefined) {
          newValue = currentValue + effect.value;
        } else if (effect.type === 'percent' && effect.value !== undefined) {
          newValue = Math.floor(currentValue * (1 + effect.value / 100));
        } else {
          newValue = currentValue;
        }

        this.setStatValue(dinosaur, effect.stat, newValue);
        changes[effect.stat] = newValue - currentValue;
      }

      // Handle special effects
      if (effect.special) {
        this.applySpecialEffect(dinosaur, effect.special, effect.value);
      }
    }

    return changes;
  }

  /**
   * Apply a special effect from a mutation
   */
  private applySpecialEffect(
    _dinosaur: DinosaurInstance,
    effectType: string,
    _value?: number
  ): void {
    // Handle various special effects
    switch (effectType) {
      case 'evasion_bonus':
        // Add to derived stats
        break;
      case 'accuracy_bonus':
        // Add to derived stats
        break;
      case 'poison_on_attack':
        // Add ability modifier
        break;
      case 'temperature_immunity':
        // Add environmental immunity
        break;
      case 'detect_hidden_enemies':
        // Add detection capability
        break;
      default:
        // Log unknown effect
        console.warn(`Unknown special effect: ${effectType}`);
    }
  }

  /**
   * Check if a dinosaur has a physical trait
   */
  private hasPhysicalTrait(dinosaur: DinosaurInstance, trait: string): boolean {
    const traits = dinosaur.physicalTraits;
    return (traits as unknown as Record<string, boolean>)[trait] === true;
  }

  /**
   * Get a stat value from a dinosaur
   */
  private getStatValue(dinosaur: DinosaurInstance, stat: string): number {
    const stats = dinosaur.stats;
    return (stats as unknown as Record<string, number>)[stat] || 0;
  }

  /**
   * Set a stat value on a dinosaur
   */
  private setStatValue(dinosaur: DinosaurInstance, stat: string, value: number): void {
    const stats = dinosaur.stats as unknown as Record<string, number>;
    stats[stat] = value;
  }

  /**
   * Check for triggered synergies based on acquired mutations
   */
  private checkSynergies(history: string[]): string[] {
    const triggered: string[] = [];

    this.synergies.forEach((requiredMutations, synergyId) => {
      const hasAll = requiredMutations.every(m => history.includes(m));
      if (hasAll) {
        triggered.push(synergyId);
      }
    });

    return triggered;
  }

  /**
   * Generate branch selection options for an evolution event
   * 
   * @param dinosaur - The dinosaur instance
   * @param numBranches - Number of branches to offer (default 3)
   * @returns Branch selection event data
   */
  public generateBranchSelection(
    dinosaur: DinosaurInstance,
    numBranches: number = 3
  ): BranchSelectionEvent {
    const available = this.getAvailableMutations(dinosaur);
    const branches = Array.from(available.keys());

    // Randomly select branches if more available than requested
    const selectedBranches = this.selectRandomBranches(branches, numBranches);

    // Filter to selected branches
    const filteredMutations = new Map<EvolutionBranch, Mutation[]>();
    for (const branch of selectedBranches) {
      const branchMutations = available.get(branch);
      if (branchMutations) {
        // Limit to 2-3 mutations per branch for UI clarity
        filteredMutations.set(branch, branchMutations.slice(0, 3));
      }
    }

    return {
      availableBranches: selectedBranches,
      mutations: filteredMutations,
      currentEvolutionPoints: dinosaur.evolutionPoints,
      dinosaurInstance: dinosaur
    };
  }

  /**
   * Select random branches from available options
   */
  private selectRandomBranches(
    branches: EvolutionBranch[],
    count: number
  ): EvolutionBranch[] {
    if (branches.length <= count) {
      return branches;
    }

    const shuffled = [...branches].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Get visual feedback configuration for a mutation
   * 
   * @param mutation - The mutation being applied
   * @returns Visual feedback configuration
   */
  public getVisualFeedback(mutation: Mutation): EvolutionVisualFeedback {
    // Determine animation type based on mutation category
    let animationType: 'glow' | 'morph' | 'pulse' | 'particle_burst' = 'glow';
    let colors: string[] = ['#4a9d5f', '#ffffff'];
    let soundEffect = 'evolution_default';
    let screenEffect: 'shake' | 'flash' | 'zoom' | undefined = undefined;

    switch (mutation.category) {
      case EvolutionBranch.PHYSICAL:
        animationType = 'morph';
        colors = ['#8b4513', '#daa520'];
        soundEffect = 'evolution_physical';
        screenEffect = 'shake';
        break;
      case EvolutionBranch.SENSORY:
        animationType = 'pulse';
        colors = ['#4169e1', '#00ffff'];
        soundEffect = 'evolution_sensory';
        break;
      case EvolutionBranch.BEHAVIORAL:
        animationType = 'glow';
        colors = ['#9932cc', '#ff69b4'];
        soundEffect = 'evolution_behavioral';
        break;
      case EvolutionBranch.OFFENSIVE:
        animationType = 'particle_burst';
        colors = ['#ff4500', '#ff0000'];
        soundEffect = 'evolution_offensive';
        screenEffect = 'flash';
        break;
      case EvolutionBranch.DEFENSIVE:
        animationType = 'glow';
        colors = ['#2f4f4f', '#708090'];
        soundEffect = 'evolution_defensive';
        break;
      case EvolutionBranch.PHYSIOLOGICAL:
        animationType = 'pulse';
        colors = ['#32cd32', '#90ee90'];
        soundEffect = 'evolution_physiological';
        break;
    }

    // Adjust for tier
    if (mutation.tier === MutationTier.LEGENDARY) {
      screenEffect = 'zoom';
      soundEffect = 'evolution_legendary';
    } else if (mutation.tier === MutationTier.EPIC) {
      screenEffect = 'flash';
    }

    return {
      mutationId: mutation.id,
      animationType,
      duration: mutation.tier === MutationTier.LEGENDARY ? 2000 : 1000,
      colors,
      soundEffect,
      screenEffect
    };
  }

  /**
   * Get the mutation history for a dinosaur
   * 
   * @param instanceId - The dinosaur instance ID
   * @returns Array of acquired mutation IDs
   */
  public getMutationHistory(instanceId: string): string[] {
    return this.evolutionHistory.get(instanceId) || [];
  }

  /**
   * Calculate total evolution points spent by a dinosaur
   */
  public getTotalEvolutionPointsSpent(instanceId: string): number {
    const history = this.evolutionHistory.get(instanceId) || [];
    let total = 0;

    for (const mutationId of history) {
      const mutation = this.mutations.get(mutationId);
      if (mutation) {
        total += mutation.evolutionPoints;
      }
    }

    return total;
  }

  /**
   * Reset evolution history for a dinosaur (for new runs)
   */
  public resetEvolutionHistory(instanceId: string): void {
    this.evolutionHistory.delete(instanceId);
  }
}

// Singleton instance
let evolutionSystemInstance: EvolutionSystem | null = null;

/**
 * Get the singleton EvolutionSystem instance
 */
export function getEvolutionSystem(): EvolutionSystem {
  if (!evolutionSystemInstance) {
    evolutionSystemInstance = new EvolutionSystem();
  }
  return evolutionSystemInstance;
}

/**
 * Reset the EvolutionSystem (for testing)
 */
export function resetEvolutionSystem(): void {
  evolutionSystemInstance = null;
}
