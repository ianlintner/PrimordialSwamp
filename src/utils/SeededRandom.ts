/**
 * Seeded Random Number Generator using Mulberry32 algorithm
 * Provides deterministic randomness for reproducible runs
 */
export class SeededRandom {
  private seed: number;
  private initialSeed: number;

  constructor(seed: string | number) {
    // Convert string seeds to numeric hash
    this.initialSeed = typeof seed === 'string' 
      ? this.hashString(seed) 
      : seed;
    this.seed = this.initialSeed;
  }

  /**
   * Hash a string to a 32-bit integer (djb2 algorithm)
   */
  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash >>> 0; // Convert to unsigned 32-bit
    }
    return hash;
  }

  /**
   * Mulberry32 PRNG - fast, good statistical properties
   * Returns a float between 0 and 1
   */
  next(): number {
    this.seed += 0x6D2B79F5;
    let t = this.seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Get random integer in range [min, max] inclusive
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Get random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: readonly T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    return array[Math.floor(this.next() * array.length)];
  }

  /**
   * Shuffle array in place using Fisher-Yates
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Weighted random selection
   */
  weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new Error('Items and weights must have same non-zero length');
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = this.next() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  /**
   * Returns true with given probability (0-1)
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Reset to initial seed state
   */
  reset(): void {
    this.seed = this.initialSeed;
  }

  /**
   * Get current seed for save/restore
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Get initial seed
   */
  getInitialSeed(): number {
    return this.initialSeed;
  }

  /**
   * Restore seed state (for loading saves)
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }
}

/**
 * Generate daily challenge seed based on date
 */
export function generateDailySeed(): string {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return `DAILY-${dateString}`;
}

/**
 * Generate random run seed
 */
export function generateRunSeed(): string {
  return `RUN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Parse a seed string to determine if it's a daily challenge
 */
export function isDailySeed(seed: string): boolean {
  return seed.startsWith('DAILY-');
}

/**
 * Extract date from daily seed
 */
export function getDateFromDailySeed(seed: string): Date | null {
  if (!isDailySeed(seed)) return null;
  const dateStr = seed.replace('DAILY-', '');
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}
