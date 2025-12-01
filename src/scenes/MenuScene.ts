import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Container;
  private codexButton!: Phaser.GameObjects.Container;
  private settingsButton!: Phaser.GameObjects.Container;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: SCENE_KEYS.MENU });
  }

  create(): void {
    const { WIDTH, HEIGHT, COLORS } = GAME_CONFIG;
    
    // Gradient background with atmosphere
    this.createAtmosphericBackground(WIDTH, HEIGHT);
    
    // Floating particles for ambiance
    this.createAmbientParticles(WIDTH, HEIGHT);
    
    // Title with glow effect
    this.createPolishedTitle(WIDTH);
    
    // Decorative dinosaur silhouettes
    this.createDinoSilhouettes(WIDTH);
    
    // Menu buttons with polish
    const buttonY = 400;
    const buttonSpacing = 75;
    
    this.startButton = this.createPolishedButton(
      WIDTH / 2,
      buttonY,
      'START NEW RUN',
      0x4a9d5f,
      () => this.startGame()
    );
    
    this.codexButton = this.createPolishedButton(
      WIDTH / 2,
      buttonY + buttonSpacing,
      'CODEX',
      0x4a8bd9,
      () => this.openCodex()
    );
    
    this.settingsButton = this.createPolishedButton(
      WIDTH / 2,
      buttonY + buttonSpacing * 2,
      'SETTINGS',
      0x888888,
      () => this.openSettings()
    );
    
    // Stagger button entrance animation
    this.animateButtonEntrance([this.startButton, this.codexButton, this.settingsButton]);
    
    // Version info with subtle styling
    this.add.text(WIDTH - 20, HEIGHT - 20, 'v0.1.0', {
      fontSize: '12px',
      color: '#444444',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(1);
    
    // Fun fact at bottom
    this.displayRandomFact();
  }

  private createAtmosphericBackground(width: number, height: number): void {
    // Dark gradient background
    const graphics = this.add.graphics();
    
    // Create gradient effect with multiple rectangles
    for (let i = 0; i < 20; i++) {
      const t = i / 20;
      const r = Math.floor(26 + (14 * t));
      const g = Math.floor(26 + (34 * t));
      const b = Math.floor(26 + (19 * t));
      graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      graphics.fillRect(0, (height / 20) * i, width, height / 20 + 1);
    }
    
    // Add subtle vignette effect
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0);
    vignette.fillRect(0, 0, width, height);
    
    // Atmospheric fog at bottom
    for (let i = 0; i < 5; i++) {
      const fogAlpha = 0.03 - (i * 0.005);
      graphics.fillStyle(0x4a9d5f, fogAlpha);
      graphics.fillRect(0, height - 150 + (i * 30), width, 30);
    }
  }

  private createAmbientParticles(width: number, height: number): void {
    // Create floating dust particles
    this.particles = this.add.particles(width / 2, height / 2, 'pixel', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speed: { min: 5, max: 20 },
      angle: { min: 260, max: 280 },
      scale: { start: 0.5, end: 0.1 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 8000,
      frequency: 200,
      quantity: 1,
      tint: [0x4a9d5f, 0x3d7a4d, 0xffffff]
    });
  }

  private createPolishedTitle(width: number): void {
    // Title shadow for depth
    const shadowText = this.add.text(width / 2 + 4, 154, 'PRIMORDIAL SWAMP', {
      fontSize: '68px',
      color: '#1a1a1a',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Main title with gradient-like effect
    this.titleText = this.add.text(width / 2, 150, 'PRIMORDIAL SWAMP', {
      fontSize: '68px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      stroke: '#2a5a3a',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Subtitle with elegant styling
    this.add.text(width / 2, 225, 'A Paleontological Roguelite', {
      fontSize: '22px',
      color: '#6ab87a',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    // Decorative line under subtitle
    const line = this.add.graphics();
    line.lineStyle(2, 0x4a9d5f, 0.5);
    line.lineBetween(width / 2 - 180, 255, width / 2 + 180, 255);
    
    // Animate title with gentle float
    this.tweens.add({
      targets: [this.titleText, shadowText],
      y: '+=8',
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createDinoSilhouettes(width: number): void {
    // Left dinosaur silhouette
    const leftDino = this.add.graphics();
    leftDino.fillStyle(0x2a3a2a, 0.3);
    this.drawDinoSilhouette(leftDino, 80, 320, 0.8, false);
    
    // Right dinosaur silhouette
    const rightDino = this.add.graphics();
    rightDino.fillStyle(0x2a3a2a, 0.3);
    this.drawDinoSilhouette(rightDino, width - 80, 320, 0.8, true);
    
    // Subtle animation
    this.tweens.add({
      targets: [leftDino, rightDino],
      alpha: { from: 0.3, to: 0.5 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private drawDinoSilhouette(graphics: Phaser.GameObjects.Graphics, x: number, y: number, scale: number, flipX: boolean): void {
    const dir = flipX ? -1 : 1;
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + (30 * dir * scale), y - 60 * scale);
    graphics.lineTo(x + (50 * dir * scale), y - 80 * scale);
    graphics.lineTo(x + (70 * dir * scale), y - 70 * scale);
    graphics.lineTo(x + (60 * dir * scale), y - 40 * scale);
    graphics.lineTo(x + (80 * dir * scale), y - 20 * scale);
    graphics.lineTo(x + (100 * dir * scale), y + 10 * scale);
    graphics.lineTo(x + (80 * dir * scale), y + 40 * scale);
    graphics.lineTo(x + (40 * dir * scale), y + 40 * scale);
    graphics.lineTo(x + (30 * dir * scale), y + 20 * scale);
    graphics.lineTo(x, y);
    graphics.closePath();
    graphics.fill();
  }

  private createPolishedButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const buttonWidth = 280;
    const buttonHeight = 50;
    
    // Button shadow
    const shadow = this.add.rectangle(4, 4, buttonWidth, buttonHeight, 0x000000, 0.3);
    shadow.setStrokeStyle(0);
    
    // Button background
    const bg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x1a1a1a, 1);
    bg.setStrokeStyle(2, color);
    
    // Button highlight (top edge)
    const highlight = this.add.rectangle(0, -buttonHeight/2 + 2, buttonWidth - 4, 2, color, 0.3);
    
    // Button text
    const label = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    container.add([shadow, bg, highlight, label]);
    container.setSize(buttonWidth, buttonHeight);
    
    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    
    bg.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Power2'
      });
      bg.setFillStyle(color, 0.2);
      label.setColor('#ffffff');
    });
    
    bg.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power2'
      });
      bg.setFillStyle(0x1a1a1a, 1);
      label.setColor(`#${color.toString(16).padStart(6, '0')}`);
    });
    
    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: callback
      });
    });
    
    return container;
  }

  private animateButtonEntrance(buttons: Phaser.GameObjects.Container[]): void {
    buttons.forEach((button, index) => {
      button.setAlpha(0);
      button.x += 100;
      
      this.tweens.add({
        targets: button,
        x: button.x - 100,
        alpha: 1,
        duration: 400,
        delay: 200 + (index * 100),
        ease: 'Back.easeOut'
      });
    });
  }

  private startGame(): void {
    // Fade out effect
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
    });
  }

  private openCodex(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENE_KEYS.CODEX);
    });
  }

  private openSettings(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENE_KEYS.SETTINGS);
    });
  }

  private displayRandomFact(): void {
    const facts = [
      'Did you know? T. rex lived closer in time to humans than to Stegosaurus!',
      'Dinosaurs ruled Earth for over 165 million years.',
      'Not all dinosaurs went extinct - birds are their descendants!',
      'The word "dinosaur" means "terrible lizard" in Greek.',
      'Some dinosaurs had hollow bones, like modern birds.',
      'Velociraptors were actually the size of turkeys, not as shown in movies.',
      'The largest dinosaur eggs were about the size of basketballs.',
      'Pteranodons had wingspans of up to 25 feet!'
    ];
    
    const randomFact = Phaser.Math.RND.pick(facts);
    
    // Fact container with subtle background
    const factBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 60,
      700,
      40,
      0x1a1a1a,
      0.8
    );
    factBg.setStrokeStyle(1, 0x4a9d5f, 0.3);
    
    this.add.text(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT - 60, randomFact, {
      fontSize: '14px',
      color: '#6ab87a',
      fontFamily: 'Courier New, monospace',
      align: 'center',
      fontStyle: 'italic',
      wordWrap: { width: 680 }
    }).setOrigin(0.5);
  }
}
