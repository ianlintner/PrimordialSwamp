import Phaser from 'phaser';
import { PLAYER_SPRITES, ENEMY_SPRITES, BOSS_SPRITES, EFFECT_SPRITES, SpriteAsset } from '../config/assets';

// Effect sprite keys - referenced from EFFECT_SPRITES config
const EFFECT_KEYS = {
  CRITICAL_HIT: 'fx_critical_hit',
  ATTACK_IMPACT: 'fx_attack_impact',
} as const;

// Animation keys - derived from effect sprites
const EFFECT_ANIM_KEYS = {
  CRITICAL_HIT: 'critical_hit',
  ATTACK_IMPACT: 'attack_impact',
} as const;

// Visual effect constants
const PARTICLE_COUNT = 8;

/**
 * SpriteManager - Manages sprite display and animations for combat
 * Handles animated dinosaur sprites and visual effects
 */
export class SpriteManager {
  private scene: Phaser.Scene;
  private activeSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Create a dinosaur sprite at the specified position
   */
  createDinosaurSprite(
    key: string,
    x: number,
    y: number,
    flipX: boolean = false,
    scale: number = 2
  ): Phaser.GameObjects.Sprite | null {
    // Find the sprite configuration
    const spriteConfig = this.findSpriteConfig(key);
    if (!spriteConfig) {
      console.warn(`Sprite config not found for: ${key}`);
      return null;
    }

    // Check if texture exists
    if (!this.scene.textures.exists(spriteConfig.key)) {
      console.warn(`Texture not found for: ${spriteConfig.key}`);
      return null;
    }

    // Create sprite
    const sprite = this.scene.add.sprite(x, y, spriteConfig.key);
    sprite.setScale(scale);
    sprite.setFlipX(flipX);

    // Play idle animation if available
    const idleAnimKey = `${key}_idle`;
    if (this.scene.anims.exists(idleAnimKey)) {
      sprite.play(idleAnimKey);
    }

    // Store reference
    this.activeSprites.set(key, sprite);

    return sprite;
  }

  /**
   * Find sprite configuration by key
   */
  private findSpriteConfig(key: string): SpriteAsset | undefined {
    // Check player sprites
    let config = PLAYER_SPRITES.find(s => s.key === key);
    if (config) return config;

    // Check enemy sprites
    config = ENEMY_SPRITES.find(s => s.key === key);
    if (config) return config;

    // Check boss sprites
    config = BOSS_SPRITES.find(s => s.key === key);
    if (config) return config;

    return undefined;
  }

  /**
   * Play animation on a sprite
   */
  playAnimation(
    spriteKey: string,
    animationType: 'idle' | 'attack' | 'hurt' | 'death' | 'roar',
    onComplete?: () => void
  ): void {
    const sprite = this.activeSprites.get(spriteKey);
    if (!sprite) {
      console.warn(`Sprite not found: ${spriteKey}`);
      onComplete?.();
      return;
    }

    const animKey = `${spriteKey}_${animationType}`;
    
    if (!this.scene.anims.exists(animKey)) {
      console.warn(`Animation not found: ${animKey}`);
      onComplete?.();
      return;
    }

    sprite.play(animKey);

    if (onComplete) {
      sprite.once('animationcomplete', () => {
        // Return to idle after non-looping animations
        if (animationType !== 'idle' && animationType !== 'death') {
          const idleAnimKey = `${spriteKey}_idle`;
          if (this.scene.anims.exists(idleAnimKey)) {
            sprite.play(idleAnimKey);
          }
        }
        onComplete();
      });
    }
  }

  /**
   * Play attack animation with screen shake and impact effect
   */
  playAttackSequence(
    attackerKey: string,
    targetKey: string,
    isCritical: boolean = false,
    onComplete?: () => void
  ): void {
    const attacker = this.activeSprites.get(attackerKey);
    const target = this.activeSprites.get(targetKey);

    if (!attacker) {
      onComplete?.();
      return;
    }

    // Store original position
    const originalX = attacker.x;
    const originalY = attacker.y;

    // Lunge toward target
    const lungeDirection = attacker.flipX ? -1 : 1;
    const lungeDistance = 50;

    // Create attack sequence
    this.scene.tweens.add({
      targets: attacker,
      x: originalX + (lungeDistance * lungeDirection),
      duration: 150,
      ease: 'Power2',
      yoyo: true,
      onStart: () => {
        this.playAnimation(attackerKey, 'attack');
      },
      onYoyo: () => {
        // Play hurt animation on target
        if (target) {
          this.playAnimation(targetKey, 'hurt');
          this.playImpactEffect(target.x, target.y, isCritical);
        }
        // Screen shake
        this.scene.cameras.main.shake(isCritical ? 300 : 150, isCritical ? 0.02 : 0.01);
      },
      onComplete: () => {
        onComplete?.();
      }
    });
  }

  /**
   * Play death animation
   */
  playDeathSequence(spriteKey: string, onComplete?: () => void): void {
    const sprite = this.activeSprites.get(spriteKey);
    if (!sprite) {
      onComplete?.();
      return;
    }

    this.playAnimation(spriteKey, 'death', () => {
      // Fade out after death animation
      this.scene.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          sprite.destroy();
          this.activeSprites.delete(spriteKey);
          onComplete?.();
        }
      });
    });
  }

  /**
   * Play an impact effect at position
   */
  playImpactEffect(x: number, y: number, isCritical: boolean = false): void {
    const effectKey = isCritical ? EFFECT_KEYS.CRITICAL_HIT : EFFECT_KEYS.ATTACK_IMPACT;
    const animKey = isCritical ? EFFECT_ANIM_KEYS.CRITICAL_HIT : EFFECT_ANIM_KEYS.ATTACK_IMPACT;

    if (!this.scene.textures.exists(effectKey)) {
      // Fallback: create particles if effect texture missing
      this.createParticleEffect(x, y, isCritical ? 0xffd43b : 0xffffff);
      return;
    }

    const effect = this.scene.add.sprite(x, y, effectKey);
    effect.setScale(isCritical ? 1.5 : 1);
    effect.setDepth(100);

    if (this.scene.anims.exists(animKey)) {
      effect.play(animKey);
      effect.once('animationcomplete', () => {
        effect.destroy();
      });
    } else {
      // Fallback animation
      this.scene.tweens.add({
        targets: effect,
        alpha: 0,
        scale: 2,
        duration: 300,
        onComplete: () => effect.destroy()
      });
    }
  }

  /**
   * Play heal effect
   */
  playHealEffect(spriteKey: string): void {
    const sprite = this.activeSprites.get(spriteKey);
    if (!sprite) return;

    const x = sprite.x;
    const y = sprite.y;

    // Create healing particles
    this.createParticleEffect(x, y, 0x51cf66, true);

    // Flash green
    this.scene.tweens.add({
      targets: sprite,
      tint: 0x51cf66,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        sprite.clearTint();
      }
    });
  }

  /**
   * Create particle effect at position
   */
  private createParticleEffect(
    x: number,
    y: number,
    color: number,
    floatUp: boolean = false
  ): void {
    // Create multiple particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = this.scene.add.circle(
        x + Phaser.Math.Between(-20, 20),
        y + Phaser.Math.Between(-20, 20),
        Phaser.Math.Between(3, 8),
        color
      );
      particle.setDepth(100);

      const endY = floatUp ? y - 50 : y + Phaser.Math.Between(-30, 30);
      const endX = x + Phaser.Math.Between(-40, 40);

      this.scene.tweens.add({
        targets: particle,
        x: endX,
        y: endY,
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(300, 600),
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Flash a sprite with a color (for status effects, damage, etc.)
   */
  flashSprite(spriteKey: string, color: number, duration: number = 200): void {
    const sprite = this.activeSprites.get(spriteKey);
    if (!sprite) return;

    this.scene.tweens.add({
      targets: sprite,
      tint: color,
      duration: duration / 2,
      yoyo: true,
      onComplete: () => {
        sprite.clearTint();
      }
    });
  }

  /**
   * Apply a bounce effect to sprite
   */
  bounceSprite(spriteKey: string, intensity: number = 1): void {
    const sprite = this.activeSprites.get(spriteKey);
    if (!sprite) return;

    const originalY = sprite.y;

    this.scene.tweens.add({
      targets: sprite,
      y: originalY - (20 * intensity),
      duration: 150,
      ease: 'Quad.easeOut',
      yoyo: true
    });
  }

  /**
   * Get a sprite by key
   */
  getSprite(key: string): Phaser.GameObjects.Sprite | undefined {
    return this.activeSprites.get(key);
  }

  /**
   * Remove a sprite
   */
  removeSprite(key: string): void {
    const sprite = this.activeSprites.get(key);
    if (sprite) {
      sprite.destroy();
      this.activeSprites.delete(key);
    }
  }

  /**
   * Clear all sprites
   */
  clearAll(): void {
    for (const sprite of this.activeSprites.values()) {
      sprite.destroy();
    }
    this.activeSprites.clear();
  }
}
