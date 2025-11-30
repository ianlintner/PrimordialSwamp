/**
 * Scientific Data Types for Primordial Swamp
 *
 * This module provides type definitions for the scientific accuracy features
 * of the game, including mutations, citations, organism stats, and ecosystem
 * data. These types ensure type-safety when working with scientifically-grounded
 * game mechanics.
 *
 * SCIENTIFIC BASIS: All types in this module correspond to real paleontological
 * concepts and research. The structure reflects how scientists categorize and
 * study prehistoric life.
 *
 * @see docs/roadmap/02-scientific-accuracy.md for design rationale
 */

// ============================================================================
// CITATION SYSTEM
// ============================================================================

/**
 * Represents an academic citation for scientific facts used in the game.
 *
 * DESIGN RATIONALE: Scientific accuracy requires traceable sources.
 * This structure allows players and developers to verify claims.
 */
export interface Citation {
  /** Unique identifier for the citation (e.g., "xu2014feather_evolution") */
  id: string;

  /** Type of academic source */
  type: 'journal_article' | 'book' | 'book_chapter' | 'thesis' | 'conference';

  /** Author(s) in academic format */
  author: string;

  /** Publication year */
  year: number;

  /** Title of the work */
  title: string;

  /** Journal name (for articles) */
  journal?: string;

  /** Volume number */
  volume?: string;

  /** Page range */
  pages?: string;

  /** Digital Object Identifier for reliable linking */
  doi?: string;

  /** URL for online access */
  url?: string;

  /** Brief summary of the source's content */
  abstract?: string;

  /** Publisher (for books) */
  publisher?: string;

  /** ISBN (for books) */
  isbn?: string;

  /** Editor(s) (for book chapters) */
  editor?: string;

  /** Book title (for chapters) */
  book?: string;

  /** Research topics covered */
  topics: string[];

  /** ISO date of last verification */
  lastVerified: string;
}

// ============================================================================
// MUTATION SYSTEM
// ============================================================================

/**
 * Categories of mutations based on biological systems they affect.
 *
 * SCIENTIFIC BASIS: These categories mirror how biologists classify
 * phenotypic traits in organisms.
 */
export type MutationCategory =
  | 'physical' // Structural body changes
  | 'sensory' // Sense organ modifications
  | 'offensive' // Attack capability enhancements
  | 'defensive' // Protection mechanisms
  | 'communication' // Social/vocalization adaptations
  | 'physiological' // Internal body function changes
  | 'behavioral'; // Instinct and behavior modifications

/**
 * Subcategories providing finer classification of mutations.
 */
export type MutationSubcategory =
  // Physical subcategories
  | 'integumentary' // Skin, feathers, scales
  | 'skeletal' // Bones and cartilage
  | 'muscular' // Muscle structure
  | 'morphological' // Overall body shape
  | 'growth' // Size and development

  // Sensory subcategories
  | 'vision' // Eye adaptations
  | 'chemoreception' // Smell and taste
  | 'mechanoreception' // Touch, pressure, vibration
  | 'hearing' // Auditory system

  // Offensive subcategories
  | 'biochemical' // Venom, toxins

  // Communication subcategories
  | 'vocalization' // Sound production

  // Physiological subcategories
  | 'metabolism' // Energy processing
  | 'thermoregulation' // Body temperature control

  // Behavioral subcategories
  | 'cognition' // Intelligence and learning
  | 'activity'; // Activity patterns

/**
 * Mutation effect on a specific stat or capability.
 *
 * DESIGN PATTERN: Effects can be flat bonuses, percentages, or boolean flags
 * to support different kinds of adaptations.
 */
export interface MutationEffect {
  /** The stat being modified (optional if using 'special') */
  stat?: string;

  /** Special effect identifier for non-stat modifications */
  special?: string;

  /** The modification value */
  value: number | boolean;

  /** How the value is applied */
  type: 'flat' | 'percent' | 'boolean';

  /** Optional condition for the effect to apply */
  condition?: string;

  /** Duration in turns for temporary effects */
  duration?: number;

  /** Damage value for damage-over-time effects */
  damage?: number;
}

/**
 * Prerequisites required to acquire a mutation.
 *
 * SCIENTIFIC BASIS: Evolution builds on existing traits. A creature
 * cannot develop feathers without the underlying genetic potential.
 */
export interface MutationPrerequisites {
  /** Required physical trait flags */
  physicalTraits?: string[];

  /** Required locomotion types */
  locomotion?: string[];

  /** Required dietary preference */
  diet?: string[];

  /** Required social behavior type */
  socialBehavior?: string[];

  /** Required size category */
  sizeCategory?: string[];

  /** Required role/class */
  role?: string[];

  /** Minimum stat requirements */
  minStats?: Record<string, number>;

  /** Other mutations that must be acquired first */
  requiredMutations?: string[];
}

/**
 * Scientific documentation for a mutation.
 *
 * EDUCATIONAL VALUE: These fields explain the real-world basis for
 * each game mechanic, teaching players about evolution and paleontology.
 */
export interface ScientificBasis {
  /** Plain language explanation of the adaptation */
  description: string;

  /** Fossil or modern evidence supporting this adaptation */
  evidence: string;

  /** Citation IDs for academic sources */
  citations: string[];
}

/**
 * A mutation represents an evolutionary adaptation that can be acquired during gameplay.
 *
 * GAME DESIGN: Mutations provide the primary character progression system,
 * allowing players to customize their dinosaur's capabilities based on
 * scientifically plausible evolutionary paths.
 *
 * SCIENTIFIC BASIS: Each mutation corresponds to real evolutionary adaptations
 * observed in dinosaurs or their relatives, documented with academic citations.
 *
 * @example
 * ```typescript
 * const hollowBones: Mutation = {
 *   id: "hollow_bones_adaptation",
 *   name: "Pneumatic Skeleton",
 *   category: "physical",
 *   subcategory: "skeletal",
 *   tier: "common",
 *   description: "Develop air-filled hollow bones for reduced weight.",
 *   effects: [
 *     { stat: "speed", value: 3, type: "flat" },
 *     { stat: "maxHealth", value: -5, type: "flat" }
 *   ],
 *   // ... other fields
 * };
 * ```
 */
export interface Mutation {
  /** Unique identifier for the mutation */
  id: string;

  /** Display name */
  name: string;

  /** Biological system category */
  category: MutationCategory;

  /** Specific adaptation type */
  subcategory: MutationSubcategory;

  /** Rarity/power tier */
  tier: 'common' | 'uncommon' | 'rare' | 'legendary';

  /** Player-facing description of the mutation */
  description: string;

  /** Statistical effects of the mutation */
  effects: MutationEffect[];

  /** Requirements to acquire this mutation */
  prerequisites: MutationPrerequisites;

  /** Mutation IDs that cannot coexist with this one */
  incompatible: string[];

  /** Cost to acquire during evolution phase */
  evolutionPoints: number;

  /** Real-world scientific documentation */
  scientificBasis: ScientificBasis;

  /** Optional gameplay tip */
  gameplayNote?: string;
}

// ============================================================================
// ECOSYSTEM / BIOME SYSTEM
// ============================================================================

/**
 * Climate conditions for a biome.
 *
 * SCIENTIFIC BASIS: Climate data is based on paleoclimate reconstructions
 * from isotope analysis, plant fossils, and climate modeling.
 */
export interface BiomeClimate {
  /** Climate classification */
  type: 'tropical' | 'temperate' | 'arid' | 'coastal' | 'varied';

  /** Temperature range */
  temperature: {
    min: number;
    max: number;
    unit: 'celsius';
  };

  /** Humidity range */
  humidity: {
    min: number;
    max: number;
    unit: 'percent';
  };

  /** Precipitation level */
  precipitation: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
}

/**
 * Atmospheric conditions for a biome.
 *
 * SCIENTIFIC BASIS: Mesozoic atmospheric composition differed significantly
 * from today, affecting organism physiology and size.
 */
export interface BiomeAtmosphere {
  /** CO2 level in ppm */
  co2_level: number;

  /** Oxygen percentage */
  o2_level: number;

  /** Explanatory notes for players */
  notes: string;
}

/**
 * Plant species present in a biome.
 *
 * SCIENTIFIC BASIS: Flora composition is based on paleobotanical evidence
 * from fossil plant assemblages.
 */
export interface BiomeFlora {
  /** Common name */
  name: string;

  /** Plant group classification */
  type: 'pteridophyte' | 'gymnosperm' | 'angiosperm' | 'bennettitalean' | 'bryophyte' | 'algae';

  /** Relative abundance */
  abundance: 'dominant' | 'common' | 'scattered' | 'rare' | 'sparse' | 'abundant';

  /** Educational note about the plant */
  note: string;
}

/**
 * Environmental hazard in a biome.
 */
export interface BiomeHazard {
  /** Hazard type identifier */
  type: string;

  /** Probability of encountering this hazard per node */
  probability: number;

  /** Description of the hazard */
  description: string;
}

/**
 * Resource availability in a biome.
 */
export interface BiomeResources {
  /** Food availability level */
  food_abundance: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';

  /** Water availability level */
  water_abundance: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high' | 'not_applicable';

  /** Shelter availability level */
  shelter_availability: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
}

/**
 * Stat modifiers applied to specific creature types in this biome.
 *
 * GAME DESIGN: Environmental context affects creature performance,
 * encouraging players to consider their dinosaur's natural habitat.
 */
export type BiomePlayerModifiers = Record<string, Record<string, number | boolean>>;

/**
 * A biome represents a distinct prehistoric environment with unique flora, fauna, and hazards.
 *
 * SCIENTIFIC BASIS: Each biome is based on paleoenvironmental reconstructions
 * from fossil evidence, sedimentology, and paleoclimate modeling.
 *
 * GAME DESIGN: Biomes provide environmental context that affects gameplay,
 * encouraging different strategies and dinosaur choices.
 */
export interface Biome {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Player-facing description */
  description: string;

  /** Terrain type for mechanics */
  terrain: 'plains' | 'forest' | 'swamp' | 'coastal' | 'volcanic' | 'hazard';

  /** Climate conditions */
  climate: BiomeClimate;

  /** Atmospheric conditions */
  atmosphere: BiomeAtmosphere;

  /** Plant species present */
  flora: BiomeFlora[];

  /** Creature species by encounter frequency */
  fauna: {
    primary: string[];
    secondary: string[];
    rare: string[];
  };

  /** Environmental hazards */
  hazards: BiomeHazard[];

  /** Resource availability */
  resources: BiomeResources;

  /** Stat modifiers by creature type */
  playerModifiers: BiomePlayerModifiers;

  /** Educational facts about this environment */
  scientificFacts: string[];

  /** Time period this biome represents */
  period: {
    era: string;
    period: string;
    approximate_mya: number;
  };
}

// ============================================================================
// ORGANISM STATS SYSTEM
// ============================================================================

/**
 * Base statistics for an organism, derived from scientific data.
 *
 * SCIENTIFIC BASIS: Stats are extrapolated from body mass, locomotion type,
 * brain-to-body ratio, and other paleontological indicators.
 */
export interface OrganismBaseStats {
  /** Hit points - derived from body mass and resilience */
  health: number;

  /** Attack power - derived from bite force, claw size, etc. */
  attack: number;

  /** Defense - derived from armor, size, agility */
  defense: number;

  /** Speed - derived from limb proportions and estimated locomotor ability */
  speed: number;

  /** Stamina - derived from estimated metabolic capacity */
  stamina: number;
}

/**
 * Growth rates per level for organism stats.
 *
 * SCIENTIFIC BASIS: Growth rates reflect ontogenetic patterns observed
 * in bone histology studies of dinosaur growth.
 */
export interface OrganismGrowthRates {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  stamina: number;
}

/**
 * Comprehensive organism data entry for the stats database.
 *
 * This interface defines the complete data structure for an organism entry,
 * combining biological data with game statistics.
 */
export interface OrganismStatsEntry {
  /** Unique identifier */
  id: string;

  /** Species name */
  name: string;

  /** Binomial nomenclature (e.g., "Tyrannosaurus rex") */
  scientificName: string;

  /** Taxonomic classification */
  taxonomy: {
    clade: string;
    family: string;
    genus: string;
    species: string;
  };

  /** Time period data */
  timePeriod: {
    era: 'Paleozoic' | 'Mesozoic' | 'Cenozoic';
    period: string;
    epoch?: string;
    myaStart: number;
    myaEnd: number;
  };

  /** Physical measurements */
  morphology: {
    lengthMeters: number;
    heightMeters: number;
    massKg: number;
    sizeCategory: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'colossal';
  };

  /** Dietary classification */
  diet: 'carnivore' | 'herbivore' | 'omnivore' | 'piscivore' | 'insectivore';

  /** Movement type */
  locomotion: 'bipedal' | 'quadrupedal' | 'flying' | 'swimming' | 'semi_aquatic';

  /** Social structure */
  socialBehavior: 'solitary' | 'pair' | 'pack' | 'herd' | 'colony';

  /** Game statistics */
  baseStats: OrganismBaseStats;

  /** Per-level stat increases */
  growthRates: OrganismGrowthRates;

  /** Discovery information */
  discoveryHistory: {
    discoverer: string;
    year: number;
    location: string;
    formationName?: string;
  };

  /** Educational content */
  scientificFacts: string[];

  /** Academic sources */
  citations: string[];
}

// ============================================================================
// ECOSYSTEM DYNAMICS
// ============================================================================

/**
 * Defines how a player action affects the ecosystem.
 *
 * GAME DESIGN: Player choices have consequences that ripple through
 * the game world, reflecting ecological interconnectedness.
 */
export interface EcosystemResponse {
  /** The triggering action type */
  triggerAction: 'kill' | 'scare' | 'feed' | 'nest' | 'migrate' | 'hunt';

  /** Target species affected */
  targetSpecies: string;

  /** The resulting ecosystem change */
  effect: {
    /** What aspect changes */
    type: 'population' | 'behavior' | 'distribution' | 'resource';

    /** Direction of change */
    direction: 'increase' | 'decrease' | 'shift';

    /** Magnitude of change (0-1 scale) */
    magnitude: number;

    /** How long the effect lasts (in game turns) */
    duration: number;
  };

  /** Cascading effects on other species */
  cascadeEffects?: EcosystemResponse[];

  /** Scientific explanation for players */
  scientificNote: string;
}

/**
 * Food web relationship between species.
 *
 * SCIENTIFIC BASIS: Based on interpreted predator-prey relationships
 * from fossil evidence including tooth marks, coprolites, and gut contents.
 */
export interface FoodWebRelationship {
  /** The predator/consumer species */
  predator: string;

  /** The prey/consumed species */
  prey: string;

  /** Strength of this dietary relationship (0-1) */
  preferenceWeight: number;

  /** Evidence for this relationship */
  evidence: string;

  /** Relevant citations */
  citations: string[];
}
