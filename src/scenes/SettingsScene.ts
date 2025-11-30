import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { GameStateManager } from '../managers/GameStateManager';

export class SettingsScene extends Phaser.Scene {
  private masterVolume: number = 1;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;
  private highContrast: boolean = false;
  private reducedMotion: boolean = false;

  constructor() {
    super({ key: SCENE_KEYS.SETTINGS });
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Load current settings
    const settings = GameStateManager.getInstance().getSettings();
    this.masterVolume = settings.masterVolume;
    this.musicVolume = settings.musicVolume;
    this.sfxVolume = settings.sfxVolume;
    this.highContrast = settings.accessibility.highContrast;
    this.reducedMotion = settings.accessibility.reducedMotion;

    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a1a1a);

    // Title
    this.add.text(WIDTH / 2, 60, '⚙ SETTINGS', {
      fontSize: '48px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Settings panels
    const panelStartY = 150;
    const panelSpacing = 220;

    // Audio Settings Panel
    this.createPanel(WIDTH / 2 - 300, panelStartY, 'AUDIO', [
      { label: 'Master Volume', type: 'slider', key: 'masterVolume', value: this.masterVolume },
      { label: 'Music Volume', type: 'slider', key: 'musicVolume', value: this.musicVolume },
      { label: 'SFX Volume', type: 'slider', key: 'sfxVolume', value: this.sfxVolume }
    ]);

    // Accessibility Settings Panel
    this.createPanel(WIDTH / 2 + 300, panelStartY, 'ACCESSIBILITY', [
      { label: 'High Contrast', type: 'toggle', key: 'highContrast', value: this.highContrast },
      { label: 'Reduced Motion', type: 'toggle', key: 'reducedMotion', value: this.reducedMotion }
    ]);

    // Graphics Settings (if time permits)
    this.add.text(WIDTH / 2, HEIGHT - 180, 'Graphics settings coming soon!', {
      fontSize: '16px',
      color: '#666666',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(WIDTH / 2, HEIGHT - 80, '← BACK TO MENU', {
      fontSize: '28px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => {
      backBtn.setColor('#ffffff');
      backBtn.setBackgroundColor('#4a9d5f');
    });

    backBtn.on('pointerout', () => {
      backBtn.setColor('#4a9d5f');
      backBtn.setBackgroundColor('#2a2a2a');
    });

    backBtn.on('pointerdown', () => {
      this.saveSettings();
      this.scene.start(SCENE_KEYS.MENU);
    });
  }

  private createPanel(x: number, y: number, title: string, options: any[]): void {
    const panelWidth = 400;
    const panelHeight = 300;

    // Panel background
    this.add.rectangle(x, y + panelHeight / 2, panelWidth, panelHeight, 0x2a2a2a)
      .setStrokeStyle(2, 0x4a9d5f);

    // Panel title
    this.add.text(x, y + 30, title, {
      fontSize: '24px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Options
    options.forEach((option, index) => {
      const optionY = y + 90 + (index * 70);

      this.add.text(x - 150, optionY, option.label, {
        fontSize: '18px',
        color: '#cccccc',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0, 0.5);

      if (option.type === 'slider') {
        this.createSlider(x + 80, optionY, option.key, option.value);
      } else if (option.type === 'toggle') {
        this.createToggle(x + 120, optionY, option.key, option.value);
      }
    });
  }

  private createSlider(x: number, y: number, key: string, initialValue: number): void {
    const sliderWidth = 150;
    const sliderHeight = 20;

    // Background track
    const track = this.add.rectangle(x, y, sliderWidth, 8, 0x444444);
    track.setStrokeStyle(1, 0x666666);

    // Fill (based on value)
    const fillWidth = initialValue * sliderWidth;
    const fill = this.add.rectangle(
      x - sliderWidth / 2 + fillWidth / 2,
      y,
      fillWidth,
      6,
      0x4a9d5f
    );

    // Handle
    const handle = this.add.circle(
      x - sliderWidth / 2 + (initialValue * sliderWidth),
      y,
      12,
      0x4a9d5f
    ).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true, draggable: true });

    // Value text
    const valueText = this.add.text(x + 100, y, `${Math.round(initialValue * 100)}%`, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0, 0.5);

    // Drag handling
    handle.on('drag', (pointer: Phaser.Input.Pointer, dragX: number) => {
      const minX = x - sliderWidth / 2;
      const maxX = x + sliderWidth / 2;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      
      handle.x = clampedX;
      
      const value = (clampedX - minX) / sliderWidth;
      (this as any)[key] = value;
      
      // Update fill
      fill.width = value * sliderWidth;
      fill.x = minX + (value * sliderWidth) / 2;
      
      // Update text
      valueText.setText(`${Math.round(value * 100)}%`);
    });
  }

  private createToggle(x: number, y: number, key: string, initialValue: boolean): void {
    const toggleWidth = 60;
    const toggleHeight = 30;

    // Background
    const bg = this.add.rectangle(x, y, toggleWidth, toggleHeight, initialValue ? 0x4a9d5f : 0x444444)
      .setStrokeStyle(2, 0x666666)
      .setInteractive({ useHandCursor: true });

    // Handle
    const handle = this.add.circle(
      initialValue ? x + toggleWidth / 4 : x - toggleWidth / 4,
      y,
      12,
      0xffffff
    );

    // Status text
    const statusText = this.add.text(x + 50, y, initialValue ? 'ON' : 'OFF', {
      fontSize: '16px',
      color: initialValue ? '#4a9d5f' : '#888888',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0, 0.5);

    // Toggle on click
    bg.on('pointerdown', () => {
      const newValue = !(this as any)[key];
      (this as any)[key] = newValue;

      // Animate toggle
      this.tweens.add({
        targets: handle,
        x: newValue ? x + toggleWidth / 4 : x - toggleWidth / 4,
        duration: 150,
        ease: 'Power2'
      });

      bg.setFillStyle(newValue ? 0x4a9d5f : 0x444444);
      statusText.setText(newValue ? 'ON' : 'OFF');
      statusText.setColor(newValue ? '#4a9d5f' : '#888888');
    });
  }

  private saveSettings(): void {
    const manager = GameStateManager.getInstance();
    
    manager.updateMasterVolume(this.masterVolume);
    manager.updateMusicVolume(this.musicVolume);
    manager.updateSfxVolume(this.sfxVolume);
    manager.toggleAccessibility('highContrast', this.highContrast);
    manager.toggleAccessibility('reducedMotion', this.reducedMotion);
  }
}
