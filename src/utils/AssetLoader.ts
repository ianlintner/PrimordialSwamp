import Phaser from 'phaser';
import {
  SpriteAsset,
  ImageAsset,
  AudioAsset,
  getAllSprites,
  getAllImages,
  getAllAudio,
} from '../config/assets';

/**
 * AssetLoader - Handles loading and registration of all game assets
 * Provides fallback placeholder generation when assets are not available
 */
export class AssetLoader {
  private scene: Phaser.Scene;
  private loadedAssets: Set<string> = new Set();
  private failedAssets: Set<string> = new Set();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Load all game assets with fallback placeholder generation
   */
  async loadAllAssets(): Promise<void> {
    // Set up error handling for missing assets
    this.scene.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn(`Asset not found: ${file.key}, generating placeholder`);
      this.failedAssets.add(file.key);
    });

    // Load sprites
    const sprites = getAllSprites();
    for (const sprite of sprites) {
      this.loadSpritesheet(sprite);
    }

    // Load images
    const images = getAllImages();
    for (const image of images) {
      this.loadImage(image);
    }

    // Load audio
    const audio = getAllAudio();
    for (const audioAsset of audio) {
      this.loadAudio(audioAsset);
    }
  }

  /**
   * Load a spritesheet asset
   */
  private loadSpritesheet(sprite: SpriteAsset): void {
    if (this.loadedAssets.has(sprite.key)) return;

    this.scene.load.spritesheet(sprite.key, sprite.path, {
      frameWidth: sprite.frameWidth,
      frameHeight: sprite.frameHeight,
    });
    this.loadedAssets.add(sprite.key);
  }

  /**
   * Load an image asset
   */
  private loadImage(image: ImageAsset): void {
    if (this.loadedAssets.has(image.key)) return;

    this.scene.load.image(image.key, image.path);
    this.loadedAssets.add(image.key);
  }

  /**
   * Load an audio asset
   */
  private loadAudio(audio: AudioAsset): void {
    if (this.loadedAssets.has(audio.key)) return;

    this.scene.load.audio(audio.key, audio.path);
    this.loadedAssets.add(audio.key);
  }

  /**
   * Generate placeholder textures for failed assets after loading completes
   */
  generatePlaceholders(): void {
    const sprites = getAllSprites();
    const images = getAllImages();

    // Generate placeholder spritesheets
    for (const sprite of sprites) {
      if (this.failedAssets.has(sprite.key) || !this.scene.textures.exists(sprite.key)) {
        this.generatePlaceholderSpritesheet(sprite);
      }
    }

    // Generate placeholder images
    for (const image of images) {
      if (this.failedAssets.has(image.key) || !this.scene.textures.exists(image.key)) {
        this.generatePlaceholderImage(image);
      }
    }
  }

  /**
   * Generate a placeholder spritesheet texture
   */
  private generatePlaceholderSpritesheet(sprite: SpriteAsset): void {
    const { key, frameWidth, frameHeight, animations } = sprite;
    const framesCount = animations ? Math.max(...animations.map(a => a.frames.end + 1)) : 6;
    const cols = 6;
    const rows = Math.ceil(framesCount / cols);
    
    const width = frameWidth * cols;
    const height = frameHeight * rows;

    const graphics = this.scene.add.graphics();
    
    // Get a color based on the sprite type
    const color = this.getPlaceholderColor(key);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const frameIndex = row * cols + col;
        if (frameIndex >= framesCount) break;
        
        const x = col * frameWidth;
        const y = row * frameHeight;
        
        // Draw frame background
        graphics.fillStyle(0x2a2a2a, 1);
        graphics.fillRect(x, y, frameWidth, frameHeight);
        
        // Draw placeholder dinosaur shape
        graphics.fillStyle(color, 1);
        this.drawDinosaurShape(graphics, x, y, frameWidth, frameHeight, frameIndex);
        
        // Draw frame border
        graphics.lineStyle(1, 0x444444, 1);
        graphics.strokeRect(x, y, frameWidth, frameHeight);
      }
    }

    graphics.generateTexture(key, width, height);
    graphics.destroy();
    
    console.log(`Generated placeholder spritesheet: ${key} (${width}x${height})`);
  }

  /**
   * Draw a simple dinosaur shape placeholder
   */
  private drawDinosaurShape(
    graphics: Phaser.GameObjects.Graphics, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    frameIndex: number
  ): void {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const size = Math.min(width, height) * 0.4;
    
    // Add slight animation offset based on frame
    const offset = Math.sin(frameIndex * 0.5) * 2;
    
    // Body
    graphics.fillEllipse(centerX, centerY + offset, size, size * 0.6);
    
    // Head
    graphics.fillEllipse(centerX + size * 0.4, centerY - size * 0.2 + offset, size * 0.4, size * 0.3);
    
    // Tail
    graphics.fillTriangle(
      centerX - size * 0.3, centerY + offset,
      centerX - size * 0.8, centerY + size * 0.1 + offset,
      centerX - size * 0.3, centerY + size * 0.2 + offset
    );
    
    // Legs
    graphics.fillRect(centerX - size * 0.2, centerY + size * 0.2 + offset, size * 0.15, size * 0.4);
    graphics.fillRect(centerX + size * 0.05, centerY + size * 0.2 + offset, size * 0.15, size * 0.4);
  }

  /**
   * Generate a placeholder image texture
   */
  private generatePlaceholderImage(image: ImageAsset): void {
    const { key } = image;
    
    // Determine size based on key
    let width = 64;
    let height = 64;
    
    if (key.includes('bg_')) {
      width = 1920;
      height = 1080;
    } else if (key.includes('healthbar') || key.includes('staminabar')) {
      width = 200;
      height = 24;
    } else if (key.includes('panel')) {
      width = 300;
      height = 200;
    } else if (key.includes('btn')) {
      width = 64;
      height = 64;
    } else if (key.includes('status_') || key.includes('node_')) {
      width = 32;
      height = 32;
    }

    const graphics = this.scene.add.graphics();
    const color = this.getPlaceholderColor(key);
    
    // Draw placeholder based on type
    if (key.includes('bg_')) {
      this.drawBackgroundPlaceholder(graphics, width, height, key);
    } else if (key.includes('healthbar') || key.includes('staminabar')) {
      this.drawBarPlaceholder(graphics, width, height, key);
    } else if (key.includes('panel')) {
      this.drawPanelPlaceholder(graphics, width, height);
    } else if (key.includes('btn')) {
      this.drawButtonPlaceholder(graphics, width, height, key);
    } else {
      this.drawIconPlaceholder(graphics, width, height, color);
    }

    graphics.generateTexture(key, width, height);
    graphics.destroy();
    
    console.log(`Generated placeholder image: ${key} (${width}x${height})`);
  }

  /**
   * Draw a background placeholder with gradient
   */
  private drawBackgroundPlaceholder(
    graphics: Phaser.GameObjects.Graphics, 
    width: number, 
    height: number,
    key: string
  ): void {
    // Determine colors based on biome
    let topColor = 0x87CEEB; // Sky blue
    let bottomColor = 0x228B22; // Forest green
    
    if (key.includes('volcanic')) {
      topColor = 0x8B0000;
      bottomColor = 0x2F1700;
    } else if (key.includes('tar')) {
      topColor = 0x36454F;
      bottomColor = 0x1a1a1a;
    } else if (key.includes('coastal')) {
      topColor = 0x87CEEB;
      bottomColor = 0x4682B4;
    } else if (key.includes('fern')) {
      topColor = 0x98FB98;
      bottomColor = 0x006400;
    }
    
    // Draw gradient using strips for better performance
    // Using 8-pixel strips instead of per-pixel for ~135x fewer draw calls
    const STRIP_HEIGHT = 8;
    for (let y = 0; y < height; y += STRIP_HEIGHT) {
      const ratio = y / height;
      const r = Math.floor(((topColor >> 16) & 0xFF) * (1 - ratio) + ((bottomColor >> 16) & 0xFF) * ratio);
      const g = Math.floor(((topColor >> 8) & 0xFF) * (1 - ratio) + ((bottomColor >> 8) & 0xFF) * ratio);
      const b = Math.floor((topColor & 0xFF) * (1 - ratio) + (bottomColor & 0xFF) * ratio);
      const color = (r << 16) | (g << 8) | b;
      
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, y, width, STRIP_HEIGHT);
    }
    
    // Add decorative texture elements for visual interest
    const TEXTURE_ELEMENT_COUNT = 20;
    graphics.fillStyle(0x000000, 0.1);
    for (let i = 0; i < TEXTURE_ELEMENT_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      graphics.fillCircle(x, y, Math.random() * 50 + 20);
    }
  }

  /**
   * Draw a health/stamina bar placeholder
   */
  private drawBarPlaceholder(
    graphics: Phaser.GameObjects.Graphics, 
    width: number, 
    height: number,
    key: string
  ): void {
    const isFrame = key.includes('frame');
    const isHealth = key.includes('health');
    
    if (isFrame) {
      graphics.fillStyle(0x333333, 1);
      graphics.fillRect(0, 0, width, height);
      graphics.lineStyle(2, 0x666666, 1);
      graphics.strokeRect(0, 0, width, height);
    } else {
      const color = isHealth ? 0x4a9d5f : 0x4a8bd9;
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, 0, width, height);
    }
  }

  /**
   * Draw a panel placeholder
   */
  private drawPanelPlaceholder(
    graphics: Phaser.GameObjects.Graphics, 
    width: number, 
    height: number
  ): void {
    graphics.fillStyle(0x2a2a2a, 0.9);
    graphics.fillRoundedRect(0, 0, width, height, 8);
    graphics.lineStyle(2, 0x4a9d5f, 1);
    graphics.strokeRoundedRect(0, 0, width, height, 8);
  }

  /**
   * Draw a button placeholder
   */
  private drawButtonPlaceholder(
    graphics: Phaser.GameObjects.Graphics, 
    width: number, 
    height: number,
    key: string
  ): void {
    let color = 0x4a9d5f;
    
    if (key.includes('attack')) color = 0xd94a3d;
    else if (key.includes('defend')) color = 0x4a8bd9;
    else if (key.includes('ability')) color = 0xffd43b;
    else if (key.includes('flee')) color = 0x845ef7;
    
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRoundedRect(0, 0, width, height, 8);
    graphics.lineStyle(3, color, 1);
    graphics.strokeRoundedRect(0, 0, width, height, 8);
    
    // Draw icon
    graphics.fillStyle(color, 1);
    graphics.fillCircle(width / 2, height / 2, 15);
  }

  /**
   * Draw an icon placeholder
   */
  private drawIconPlaceholder(
    graphics: Phaser.GameObjects.Graphics, 
    width: number, 
    height: number,
    color: number
  ): void {
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRoundedRect(0, 0, width, height, 4);
    graphics.fillStyle(color, 1);
    graphics.fillCircle(width / 2, height / 2, Math.min(width, height) / 3);
  }

  /**
   * Get a color based on the asset key
   */
  private getPlaceholderColor(key: string): number {
    // Player dinosaurs - green tones
    if (key.includes('deinonychus')) return 0x4a9d5f;
    if (key.includes('ankylosaurus')) return 0x5f9d4a;
    if (key.includes('pteranodon')) return 0x4a7a9d;
    
    // Enemies - red tones
    if (key.includes('compy') || key.includes('dilophosaurus')) return 0xd94a3d;
    if (key.includes('allosaurus')) return 0xcc5533;
    
    // Bosses - purple
    if (key.includes('boss')) return 0x9d4a9d;
    
    // Effects
    if (key.includes('attack')) return 0xd94a3d;
    if (key.includes('heal')) return 0x51cf66;
    if (key.includes('critical')) return 0xffd43b;
    
    // Status effects
    if (key.includes('bleeding')) return 0xd94a3d;
    if (key.includes('poison')) return 0x00ff00;
    if (key.includes('stun')) return 0xffd43b;
    if (key.includes('fortified')) return 0x4a8bd9;
    
    // Default
    return 0x888888;
  }

  /**
   * Create all animations from sprite configurations
   */
  createAnimations(): void {
    const sprites = getAllSprites();
    
    for (const sprite of sprites) {
      if (!sprite.animations || !this.scene.textures.exists(sprite.key)) continue;
      
      for (const anim of sprite.animations) {
        if (this.scene.anims.exists(anim.key)) continue;
        
        this.scene.anims.create({
          key: anim.key,
          frames: this.scene.anims.generateFrameNumbers(sprite.key, {
            start: anim.frames.start,
            end: anim.frames.end,
          }),
          frameRate: anim.frameRate,
          repeat: anim.repeat,
        });
      }
    }
    
    console.log('Animations created successfully');
  }

  /**
   * Check if an asset was loaded successfully
   */
  isLoaded(key: string): boolean {
    return this.loadedAssets.has(key) && !this.failedAssets.has(key);
  }

  /**
   * Get list of failed assets
   */
  getFailedAssets(): string[] {
    return Array.from(this.failedAssets);
  }
}
