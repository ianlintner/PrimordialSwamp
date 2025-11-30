import { describe, it, expect } from 'vitest';
import { GAME_CONFIG, SCENE_KEYS } from '@/utils/Constants';

describe('Constants', () => {
  describe('GAME_CONFIG', () => {
    it('should have correct game dimensions', () => {
      expect(GAME_CONFIG.WIDTH).toBe(1280);
      expect(GAME_CONFIG.HEIGHT).toBe(720);
      expect(GAME_CONFIG.TILE_SIZE).toBe(16);
    });

    it('should have valid combat constants', () => {
      expect(GAME_CONFIG.BASE_CRIT_CHANCE).toBeGreaterThan(0);
      expect(GAME_CONFIG.BASE_CRIT_CHANCE).toBeLessThan(1);
      expect(GAME_CONFIG.BASE_ACCURACY).toBeGreaterThan(0);
      expect(GAME_CONFIG.BASE_ACCURACY).toBeLessThanOrEqual(1);
      expect(GAME_CONFIG.STAMINA_REGEN).toBeGreaterThan(0);
    });

    it('should have valid progression constants', () => {
      expect(GAME_CONFIG.NODES_PER_BIOME).toBeGreaterThan(0);
      expect(GAME_CONFIG.XP_BASE).toBeGreaterThan(0);
      expect(GAME_CONFIG.XP_MULTIPLIER).toBeGreaterThan(1);
    });

    it('should have depth scaling for difficulty', () => {
      expect(GAME_CONFIG.DEPTH_SCALING).toBeGreaterThan(0);
    });

    it('should have valid color values', () => {
      const colors = GAME_CONFIG.COLORS;
      
      // All colors should be valid hex values
      expect(colors.PRIMARY).toBeGreaterThanOrEqual(0);
      expect(colors.SECONDARY).toBeGreaterThanOrEqual(0);
      expect(colors.DANGER).toBeGreaterThanOrEqual(0);
      expect(colors.WARNING).toBeGreaterThanOrEqual(0);
      expect(colors.INFO).toBeGreaterThanOrEqual(0);
      expect(colors.TEXT).toBeGreaterThanOrEqual(0);
      expect(colors.TEXT_DARK).toBeGreaterThanOrEqual(0);
      expect(colors.BACKGROUND).toBeGreaterThanOrEqual(0);
    });
  });

  describe('SCENE_KEYS', () => {
    it('should have all required scene keys', () => {
      expect(SCENE_KEYS.BOOT).toBeDefined();
      expect(SCENE_KEYS.MENU).toBeDefined();
      expect(SCENE_KEYS.CHARACTER_SELECT).toBeDefined();
      expect(SCENE_KEYS.MAP).toBeDefined();
      expect(SCENE_KEYS.COMBAT).toBeDefined();
      expect(SCENE_KEYS.ENCOUNTER).toBeDefined();
      expect(SCENE_KEYS.REWARDS).toBeDefined();
      expect(SCENE_KEYS.CODEX).toBeDefined();
      expect(SCENE_KEYS.GAME_OVER).toBeDefined();
      expect(SCENE_KEYS.SETTINGS).toBeDefined();
    });

    it('should have unique scene key values', () => {
      const values = Object.values(SCENE_KEYS);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should have string values ending with Scene', () => {
      Object.values(SCENE_KEYS).forEach(key => {
        expect(key).toMatch(/Scene$/);
      });
    });
  });
});
