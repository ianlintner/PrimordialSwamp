import { describe, it, expect } from 'vitest';
import {
  PLAYER_SPRITES,
  ENEMY_SPRITES,
  BOSS_SPRITES,
  EFFECT_SPRITES,
  BACKGROUND_IMAGES,
  UI_IMAGES,
  STATUS_ICONS,
  RESOURCE_ICONS,
  NODE_ICONS,
  MUSIC_TRACKS,
  SOUND_EFFECTS,
  AMBIENT_SOUNDS,
  getAllSprites,
  getAllImages,
  getAllAudio,
} from '../../src/config/assets';

describe('Asset Configuration', () => {
  describe('Player Sprites', () => {
    it('should define core player dinosaurs', () => {
      expect(PLAYER_SPRITES.length).toBeGreaterThanOrEqual(3);
      
      const dinoKeys = PLAYER_SPRITES.map(s => s.key);
      expect(dinoKeys).toContain('deinonychus');
      expect(dinoKeys).toContain('ankylosaurus');
      expect(dinoKeys).toContain('pteranodon');
    });

    it('should have valid sprite dimensions', () => {
      for (const sprite of PLAYER_SPRITES) {
        expect(sprite.frameWidth).toBeGreaterThan(0);
        expect(sprite.frameHeight).toBeGreaterThan(0);
        expect(sprite.path).toMatch(/\.png$/);
      }
    });

    it('should define animations for each sprite', () => {
      for (const sprite of PLAYER_SPRITES) {
        expect(sprite.animations).toBeDefined();
        expect(sprite.animations!.length).toBeGreaterThan(0);
        
        const animKeys = sprite.animations!.map(a => a.key);
        expect(animKeys.some(k => k.includes('idle'))).toBe(true);
        expect(animKeys.some(k => k.includes('attack'))).toBe(true);
      }
    });
  });

  describe('Enemy Sprites', () => {
    it('should define enemy sprites', () => {
      expect(ENEMY_SPRITES.length).toBeGreaterThan(0);
    });

    it('should have valid animation frame ranges', () => {
      for (const sprite of ENEMY_SPRITES) {
        if (sprite.animations) {
          for (const anim of sprite.animations) {
            expect(anim.frames.start).toBeLessThanOrEqual(anim.frames.end);
            expect(anim.frameRate).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  describe('Boss Sprites', () => {
    it('should define boss sprites', () => {
      expect(BOSS_SPRITES.length).toBeGreaterThan(0);
    });

    it('should have larger dimensions than regular enemies', () => {
      const bossSprite = BOSS_SPRITES[0];
      const regularEnemy = ENEMY_SPRITES[0];
      
      const bossArea = bossSprite.frameWidth * bossSprite.frameHeight;
      const enemyArea = regularEnemy.frameWidth * regularEnemy.frameHeight;
      
      expect(bossArea).toBeGreaterThan(enemyArea);
    });
  });

  describe('Effect Sprites', () => {
    it('should define visual effect sprites', () => {
      expect(EFFECT_SPRITES.length).toBeGreaterThan(0);
      
      const effectKeys = EFFECT_SPRITES.map(s => s.key);
      expect(effectKeys.some(k => k.includes('attack'))).toBe(true);
    });
  });

  describe('Background Images', () => {
    it('should define backgrounds for biomes', () => {
      expect(BACKGROUND_IMAGES.length).toBeGreaterThan(0);
    });

    it('should have parallax layers for each biome', () => {
      const biomes = ['coastal_wetlands', 'fern_prairies', 'volcanic_highlands', 'tar_pits'];
      
      for (const biome of biomes) {
        const biomeBackgrounds = BACKGROUND_IMAGES.filter(bg => bg.key.includes(biome));
        expect(biomeBackgrounds.length).toBeGreaterThan(0);
      }
    });
  });

  describe('UI Images', () => {
    it('should define UI element images', () => {
      expect(UI_IMAGES.length).toBeGreaterThan(0);
      
      const uiKeys = UI_IMAGES.map(img => img.key);
      expect(uiKeys.some(k => k.includes('healthbar'))).toBe(true);
    });
  });

  describe('Status Icons', () => {
    it('should define status effect icons', () => {
      expect(STATUS_ICONS.length).toBeGreaterThan(0);
      
      const statusKeys = STATUS_ICONS.map(icon => icon.key);
      expect(statusKeys).toContain('status_bleeding');
      expect(statusKeys).toContain('status_stunned');
    });
  });

  describe('Resource Icons', () => {
    it('should define resource icons', () => {
      expect(RESOURCE_ICONS.length).toBeGreaterThan(0);
      
      const resourceKeys = RESOURCE_ICONS.map(icon => icon.key);
      expect(resourceKeys).toContain('resource_fossil');
      expect(resourceKeys).toContain('resource_health');
    });
  });

  describe('Node Icons', () => {
    it('should define map node icons', () => {
      expect(NODE_ICONS.length).toBeGreaterThan(0);
      
      const nodeKeys = NODE_ICONS.map(icon => icon.key);
      expect(nodeKeys).toContain('node_combat');
      expect(nodeKeys).toContain('node_boss');
    });
  });

  describe('Music Tracks', () => {
    it('should define music tracks', () => {
      expect(MUSIC_TRACKS.length).toBeGreaterThan(0);
      
      const musicKeys = MUSIC_TRACKS.map(track => track.key);
      expect(musicKeys).toContain('music_main_menu');
      expect(musicKeys).toContain('music_combat_normal');
    });

    it('should have proper audio configuration', () => {
      for (const track of MUSIC_TRACKS) {
        expect(track.type).toBe('music');
        expect(track.path).toMatch(/\.ogg$/);
        if (track.volume !== undefined) {
          expect(track.volume).toBeGreaterThanOrEqual(0);
          expect(track.volume).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  describe('Sound Effects', () => {
    it('should define sound effects', () => {
      expect(SOUND_EFFECTS.length).toBeGreaterThan(0);
      
      const sfxKeys = SOUND_EFFECTS.map(sfx => sfx.key);
      expect(sfxKeys.some(k => k.includes('attack'))).toBe(true);
      expect(sfxKeys.some(k => k.includes('ui'))).toBe(true);
    });

    it('should have proper SFX configuration', () => {
      for (const sfx of SOUND_EFFECTS) {
        expect(sfx.type).toBe('sfx');
        expect(sfx.path).toMatch(/\.ogg$/);
      }
    });
  });

  describe('Ambient Sounds', () => {
    it('should define ambient sounds', () => {
      expect(AMBIENT_SOUNDS.length).toBeGreaterThan(0);
    });

    it('should be loopable', () => {
      for (const ambient of AMBIENT_SOUNDS) {
        expect(ambient.type).toBe('ambience');
        expect(ambient.loop).toBe(true);
      }
    });
  });

  describe('Helper Functions', () => {
    it('getAllSprites should return all sprite assets', () => {
      const allSprites = getAllSprites();
      const totalExpected = PLAYER_SPRITES.length + ENEMY_SPRITES.length + 
                           BOSS_SPRITES.length + EFFECT_SPRITES.length;
      expect(allSprites.length).toBe(totalExpected);
    });

    it('getAllImages should return all image assets', () => {
      const allImages = getAllImages();
      const totalExpected = BACKGROUND_IMAGES.length + UI_IMAGES.length + 
                           STATUS_ICONS.length + RESOURCE_ICONS.length + NODE_ICONS.length;
      expect(allImages.length).toBe(totalExpected);
    });

    it('getAllAudio should return all audio assets', () => {
      const allAudio = getAllAudio();
      const totalExpected = MUSIC_TRACKS.length + SOUND_EFFECTS.length + AMBIENT_SOUNDS.length;
      expect(allAudio.length).toBe(totalExpected);
    });
  });
});
