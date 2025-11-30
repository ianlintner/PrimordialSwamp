import { describe, it, expect, beforeEach } from 'vitest';
import { 
  SeededRandom, 
  generateDailySeed, 
  generateRunSeed, 
  isDailySeed, 
  getDateFromDailySeed 
} from '@/utils/SeededRandom';

describe('SeededRandom', () => {
  describe('Constructor', () => {
    it('should accept numeric seed', () => {
      const rng = new SeededRandom(12345);
      expect(rng.getInitialSeed()).toBe(12345);
    });

    it('should accept string seed and hash it', () => {
      const rng = new SeededRandom('test-seed');
      expect(typeof rng.getInitialSeed()).toBe('number');
      expect(rng.getInitialSeed()).toBeGreaterThan(0);
    });

    it('should produce same initial seed for same string', () => {
      const rng1 = new SeededRandom('same-seed');
      const rng2 = new SeededRandom('same-seed');
      expect(rng1.getInitialSeed()).toBe(rng2.getInitialSeed());
    });

    it('should produce different seeds for different strings', () => {
      const rng1 = new SeededRandom('seed-one');
      const rng2 = new SeededRandom('seed-two');
      expect(rng1.getInitialSeed()).not.toBe(rng2.getInitialSeed());
    });
  });

  describe('next()', () => {
    it('should return values between 0 and 1', () => {
      const rng = new SeededRandom(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should produce reproducible sequences', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);
      
      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });

    it('should produce different sequences for different seeds', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(43);
      
      // At least one of 10 values should differ
      let different = false;
      for (let i = 0; i < 10; i++) {
        if (rng1.next() !== rng2.next()) {
          different = true;
          break;
        }
      }
      expect(different).toBe(true);
    });
  });

  describe('nextInt()', () => {
    let rng: SeededRandom;

    beforeEach(() => {
      rng = new SeededRandom(12345);
    });

    it('should return integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(1, 10);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(10);
      }
    });

    it('should include both min and max values', () => {
      const results = new Set<number>();
      for (let i = 0; i < 1000; i++) {
        results.add(rng.nextInt(1, 3));
      }
      expect(results.has(1)).toBe(true);
      expect(results.has(2)).toBe(true);
      expect(results.has(3)).toBe(true);
    });
  });

  describe('nextFloat()', () => {
    let rng: SeededRandom;

    beforeEach(() => {
      rng = new SeededRandom(12345);
    });

    it('should return floats within range', () => {
      for (let i = 0; i < 100; i++) {
        const value = rng.nextFloat(5.0, 10.0);
        expect(value).toBeGreaterThanOrEqual(5.0);
        expect(value).toBeLessThan(10.0);
      }
    });
  });

  describe('pick()', () => {
    let rng: SeededRandom;

    beforeEach(() => {
      rng = new SeededRandom(12345);
    });

    it('should pick element from array', () => {
      const arr = ['a', 'b', 'c', 'd'];
      const picked = rng.pick(arr);
      expect(arr).toContain(picked);
    });

    it('should be reproducible', () => {
      const arr = ['a', 'b', 'c', 'd'];
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);
      
      for (let i = 0; i < 10; i++) {
        expect(rng1.pick(arr)).toBe(rng2.pick(arr));
      }
    });

    it('should throw for empty array', () => {
      expect(() => rng.pick([])).toThrow();
    });
  });

  describe('shuffle()', () => {
    let rng: SeededRandom;

    beforeEach(() => {
      rng = new SeededRandom(12345);
    });

    it('should shuffle array in place', () => {
      const original = [1, 2, 3, 4, 5];
      const arr = [...original];
      rng.shuffle(arr);
      
      // Should contain same elements
      expect(arr.sort()).toEqual(original.sort());
    });

    it('should be reproducible', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);
      
      const arr1 = [1, 2, 3, 4, 5];
      const arr2 = [1, 2, 3, 4, 5];
      
      rng1.shuffle(arr1);
      rng2.shuffle(arr2);
      
      expect(arr1).toEqual(arr2);
    });
  });

  describe('weightedPick()', () => {
    let rng: SeededRandom;

    beforeEach(() => {
      rng = new SeededRandom(12345);
    });

    it('should pick items according to weights', () => {
      const items = ['rare', 'common'];
      const weights = [1, 99]; // common should be picked most often
      
      const counts = { rare: 0, common: 0 };
      for (let i = 0; i < 1000; i++) {
        counts[rng.weightedPick(items, weights) as keyof typeof counts]++;
      }
      
      // Common should be picked much more often
      expect(counts.common).toBeGreaterThan(counts.rare * 5);
    });

    it('should throw for mismatched arrays', () => {
      expect(() => rng.weightedPick(['a', 'b'], [1])).toThrow();
    });

    it('should throw for empty arrays', () => {
      expect(() => rng.weightedPick([], [])).toThrow();
    });
  });

  describe('chance()', () => {
    let rng: SeededRandom;

    beforeEach(() => {
      rng = new SeededRandom(12345);
    });

    it('should return boolean', () => {
      expect(typeof rng.chance(0.5)).toBe('boolean');
    });

    it('should always return true for probability 1', () => {
      for (let i = 0; i < 100; i++) {
        expect(rng.chance(1)).toBe(true);
      }
    });

    it('should always return false for probability 0', () => {
      for (let i = 0; i < 100; i++) {
        expect(rng.chance(0)).toBe(false);
      }
    });
  });

  describe('reset()', () => {
    it('should restore initial state', () => {
      const rng = new SeededRandom(42);
      const firstSequence: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        firstSequence.push(rng.next());
      }
      
      rng.reset();
      
      for (let i = 0; i < 5; i++) {
        expect(rng.next()).toBe(firstSequence[i]);
      }
    });
  });

  describe('getSeed() and setSeed()', () => {
    it('should save and restore state', () => {
      const rng = new SeededRandom(42);
      
      // Advance the RNG
      for (let i = 0; i < 10; i++) {
        rng.next();
      }
      
      // Save state
      const savedSeed = rng.getSeed();
      const nextValues: number[] = [];
      for (let i = 0; i < 5; i++) {
        nextValues.push(rng.next());
      }
      
      // Restore state
      rng.setSeed(savedSeed);
      
      // Should produce same sequence
      for (let i = 0; i < 5; i++) {
        expect(rng.next()).toBe(nextValues[i]);
      }
    });
  });
});

describe('Seed Generation Functions', () => {
  describe('generateDailySeed()', () => {
    it('should return string starting with DAILY-', () => {
      const seed = generateDailySeed();
      expect(seed.startsWith('DAILY-')).toBe(true);
    });

    it('should include date in YYYY-MM-DD format', () => {
      const seed = generateDailySeed();
      const datePattern = /DAILY-\d{4}-\d{2}-\d{2}/;
      expect(datePattern.test(seed)).toBe(true);
    });
  });

  describe('generateRunSeed()', () => {
    it('should return string starting with RUN-', () => {
      const seed = generateRunSeed();
      expect(seed.startsWith('RUN-')).toBe(true);
    });

    it('should generate unique seeds', () => {
      const seeds = new Set<string>();
      for (let i = 0; i < 100; i++) {
        seeds.add(generateRunSeed());
      }
      // All should be unique (or at least most - timing could cause duplicates)
      expect(seeds.size).toBeGreaterThan(90);
    });
  });

  describe('isDailySeed()', () => {
    it('should return true for daily seeds', () => {
      expect(isDailySeed('DAILY-2024-01-15')).toBe(true);
      expect(isDailySeed(generateDailySeed())).toBe(true);
    });

    it('should return false for run seeds', () => {
      expect(isDailySeed('RUN-12345-abc')).toBe(false);
      expect(isDailySeed('random-seed')).toBe(false);
    });
  });

  describe('getDateFromDailySeed()', () => {
    it('should extract date from daily seed', () => {
      const date = getDateFromDailySeed('DAILY-2024-01-15');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(0); // January is 0
      expect(date?.getDate()).toBe(15);
    });

    it('should return null for non-daily seeds', () => {
      expect(getDateFromDailySeed('RUN-12345')).toBeNull();
    });

    it('should return null for invalid dates', () => {
      expect(getDateFromDailySeed('DAILY-invalid')).toBeNull();
    });
  });
});
