import Phaser from 'phaser';
import { SCENE_KEYS } from '../utils/Constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    // Show loading progress
    this.createLoadingBar();
    
    // Load essential assets
    // TODO: Load actual sprite assets when available
    this.load.on('progress', (value: number) => {
      this.updateLoadingBar(value);
    });
    
    this.load.on('complete', () => {
      this.hideLoadingScreen();
    });
  }

  create(): void {
    // Create pixel texture for particles
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 4, 4);
    graphics.generateTexture('pixel', 4, 4);
    
    // Initialize game systems
    console.log('🦕 Primordial Swamp - Boot Complete');
    
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
