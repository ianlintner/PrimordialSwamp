import Phaser from 'phaser';
import { SCENE_KEYS } from '../utils/Constants';
import { AssetLoader } from '../utils/AssetLoader';

export class BootScene extends Phaser.Scene {
  private assetLoader!: AssetLoader;

  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    // Show loading progress
    this.createLoadingBar();
    
    // Initialize asset loader
    this.assetLoader = new AssetLoader(this);
    
    // Load all game assets
    this.assetLoader.loadAllAssets();
    
    this.load.on('progress', (value: number) => {
      this.updateLoadingBar(value);
    });
    
    this.load.on('complete', () => {
      this.hideLoadingScreen();
    });
  }

  create(): void {
    // Generate placeholder textures for any missing assets
    this.assetLoader.generatePlaceholders();
    
    // Create animations from loaded sprites
    this.assetLoader.createAnimations();
    
    // Create pixel texture for particles
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 4, 4);
    graphics.generateTexture('pixel', 4, 4);
    graphics.destroy();
    
    // Log asset loading status
    const failedAssets = this.assetLoader.getFailedAssets();
    if (failedAssets.length > 0) {
      console.log(`🦕 Primordial Swamp - Boot Complete (${failedAssets.length} placeholder assets generated)`);
    } else {
      console.log('🦕 Primordial Swamp - Boot Complete (all assets loaded)');
    }
    
    // Transition to menu
    this.time.delayedCall(500, () => {
      this.scene.start(SCENE_KEYS.MENU);
    });
  }

  private createLoadingBar(): void {
    // Loading bar is handled by HTML for initial load
  }

  private updateLoadingBar(progress: number): void {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
  }

  private hideLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }
}
