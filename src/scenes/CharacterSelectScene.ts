import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import { GameStateManager } from '../managers/GameStateManager';
import dinosaursData from '../data/dinosaurs.json';

export class CharacterSelectScene extends Phaser.Scene {
  private selectedDinosaur: DinosaurType | null = null;
  private dinosaurCards: Map<DinosaurType, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super({ key: SCENE_KEYS.CHARACTER_SELECT });
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;
    
    // Fade in
    this.cameras.main.fadeIn(300);
    
    // Atmospheric background
    this.createBackground(WIDTH, HEIGHT);
    
    // Title with glow
    this.createTitle(WIDTH);
    
    // Load available dinosaurs
    const availableDinosaurs = dinosaursData.filter(dino => 
      dino.unlockCondition?.type === 'always'
    );
    
    // Create dinosaur selection cards
    const cardWidth = 320;
    const cardSpacing = 40;
    const totalWidth = (cardWidth * availableDinosaurs.length) + (cardSpacing * (availableDinosaurs.length - 1));
    const startX = (WIDTH - totalWidth) / 2 + cardWidth / 2;
    const cardY = HEIGHT / 2 + 20;
    
    availableDinosaurs.forEach((dino, index) => {
      const x = startX + (index * (cardWidth + cardSpacing));
      const card = this.createDinosaurCard(x, cardY, dino as any);
      this.dinosaurCards.set(dino.id as DinosaurType, card);
      
      // Stagger card entrance
      card.setAlpha(0);
      card.y += 50;
      this.tweens.add({
        targets: card,
        alpha: 1,
        y: card.y - 50,
        duration: 400,
        delay: 200 + (index * 100),
        ease: 'Back.easeOut'
      });
    });
    
    // Back button
    this.createNavButton(100, HEIGHT - 60, 'BACK', 0x888888, () => {
      this.cameras.main.fadeOut(300);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENE_KEYS.MENU);
      });
    });
    
    // Start button (disabled until selection)
    const startButton = this.createNavButton(
      WIDTH - 100,
      HEIGHT - 60,
      'START RUN',
      0x4a9d5f,
      () => this.startRun(),
      false
    );
    startButton.setName('startButton');
  }

  private createBackground(width: number, height: number): void {
    const graphics = this.add.graphics();
    
    // Gradient background
    for (let i = 0; i < 20; i++) {
      const t = i / 20;
      const r = Math.floor(20 + (10 * t));
      const g = Math.floor(20 + (25 * t));
      const b = Math.floor(20 + (15 * t));
      graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      graphics.fillRect(0, (height / 20) * i, width, height / 20 + 1);
    }
    
    // Subtle grid pattern
    graphics.lineStyle(1, 0x4a9d5f, 0.05);
    for (let x = 0; x < width; x += 40) {
      graphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      graphics.lineBetween(0, y, width, y);
    }
  }

  private createTitle(width: number): void {
    // Shadow
    this.add.text(width / 2 + 3, 63, 'SELECT YOUR DINOSAUR', {
      fontSize: '42px',
      color: '#1a1a1a',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Main title
    this.add.text(width / 2, 60, 'SELECT YOUR DINOSAUR', {
      fontSize: '42px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      stroke: '#2a5a3a',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Decorative line
    const line = this.add.graphics();
    line.lineStyle(2, 0x4a9d5f, 0.5);
    line.lineBetween(width / 2 - 200, 90, width / 2 + 200, 90);
  }

  private createDinosaurCard(
    x: number,
    y: number,
    dinoData: any
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const cardWidth = 300;
    const cardHeight = 420;
    
    // Card shadow
    const shadow = this.add.rectangle(5, 5, cardWidth, cardHeight, 0x000000, 0.3);
    
    // Card background with gradient effect
    const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x1a1a1a, 1);
    bg.setStrokeStyle(2, 0x4a9d5f);
    
    // Top accent bar
    const accent = this.add.rectangle(0, -cardHeight/2 + 15, cardWidth - 4, 26, 0x4a9d5f, 0.2);
    
    // Dinosaur silhouette/icon area
    const iconBg = this.add.ellipse(0, -120, 120, 100, 0x2a3a2a, 1);
    const dinoGraphics = this.createDinoGraphic(dinoData.id);
    dinoGraphics.setPosition(0, -120);
    
    // Name
    const name = this.add.text(0, -40, dinoData.name.toUpperCase(), {
      fontSize: '22px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Role badge
    const roleBg = this.add.rectangle(0, -10, 100, 22, this.getRoleColor(dinoData.role), 0.3);
    roleBg.setStrokeStyle(1, this.getRoleColor(dinoData.role));
    const role = this.add.text(0, -10, dinoData.role.toUpperCase(), {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
    
    // Stats with visual bars
    const statsY = 35;
    const stats = [
      { label: 'HP', value: dinoData.baseStats.health, max: 150, color: 0x4a9d5f },
      { label: 'ATK', value: dinoData.baseStats.attack, max: 20, color: 0xd94a3d },
      { label: 'DEF', value: dinoData.baseStats.defense, max: 20, color: 0x4a8bd9 },
      { label: 'SPD', value: dinoData.baseStats.speed, max: 15, color: 0xffd43b },
      { label: 'STA', value: dinoData.baseStats.stamina, max: 100, color: 0x845ef7 }
    ];
    
    const statsContainer = this.createStatsDisplay(stats, cardWidth - 40, statsY);
    
    // Description
    const description = this.add.text(0, 150, dinoData.description, {
      fontSize: '12px',
      color: '#888888',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: cardWidth - 30 },
      align: 'center',
      lineSpacing: 4
    }).setOrigin(0.5);
    
    container.add([shadow, bg, accent, iconBg, dinoGraphics, name, roleBg, role, statsContainer, description]);
    
    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      if (this.selectedDinosaur !== dinoData.id) {
        bg.setStrokeStyle(3, 0xffffff);
        this.tweens.add({
          targets: container,
          scaleX: 1.03,
          scaleY: 1.03,
          duration: 150,
          ease: 'Power2'
        });
      }
    });
    
    bg.on('pointerout', () => {
      if (this.selectedDinosaur !== dinoData.id) {
        bg.setStrokeStyle(2, 0x4a9d5f);
      }
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
    });
    
    bg.on('pointerdown', () => {
      this.selectDinosaur(dinoData.id as DinosaurType);
    });
    
    return container;
  }

  private createDinoGraphic(id: string): Phaser.GameObjects.Graphics {
    const graphics = this.add.graphics();
    const colors: Record<string, number> = {
      deinonychus: 0x4a9d5f,
      ankylosaurus: 0x6b8e23,
      pteranodon: 0x4a8bd9,
      tyrannosaurus: 0x8b4513
    };
    const color = colors[id] || 0x4a9d5f;
    
    graphics.fillStyle(color, 1);
    
    // Simple dinosaur silhouette based on type
    if (id === 'deinonychus') {
      // Raptor shape
      graphics.beginPath();
      graphics.moveTo(-30, 20);
      graphics.lineTo(-20, -10);
      graphics.lineTo(0, -25);
      graphics.lineTo(20, -15);
      graphics.lineTo(30, 0);
      graphics.lineTo(40, 5);
      graphics.lineTo(30, 15);
      graphics.lineTo(10, 20);
      graphics.lineTo(-10, 25);
      graphics.lineTo(-30, 20);
      graphics.closePath();
      graphics.fill();
    } else if (id === 'ankylosaurus') {
      // Armored tank shape
      graphics.fillEllipse(0, 0, 60, 35);
      graphics.fillCircle(-25, -5, 12);
      graphics.fillCircle(30, 5, 15);
    } else if (id === 'pteranodon') {
      // Flying shape
      graphics.beginPath();
      graphics.moveTo(-40, 0);
      graphics.lineTo(-20, -20);
      graphics.lineTo(0, -5);
      graphics.lineTo(20, -20);
      graphics.lineTo(40, 0);
      graphics.lineTo(20, 10);
      graphics.lineTo(-20, 10);
      graphics.closePath();
      graphics.fill();
    } else {
      // Generic T-Rex shape
      graphics.beginPath();
      graphics.moveTo(-25, 25);
      graphics.lineTo(-20, 0);
      graphics.lineTo(-10, -20);
      graphics.lineTo(10, -25);
      graphics.lineTo(25, -15);
      graphics.lineTo(30, 0);
      graphics.lineTo(25, 20);
      graphics.lineTo(0, 25);
      graphics.closePath();
      graphics.fill();
    }
    
    return graphics;
  }

  private createStatsDisplay(stats: Array<{label: string, value: number, max: number, color: number}>, width: number, startY: number): Phaser.GameObjects.Container {
    const container = this.add.container(0, startY);
    const barWidth = width - 60;
    const barHeight = 8;
    const spacing = 20;
    
    stats.forEach((stat, index) => {
      const y = index * spacing;
      
      // Label
      const label = this.add.text(-width/2 + 5, y, stat.label, {
        fontSize: '11px',
        color: '#888888',
        fontFamily: 'Courier New, monospace'
      });
      
      // Bar background
      const barBg = this.add.rectangle(15, y + 4, barWidth, barHeight, 0x2a2a2a, 1);
      barBg.setStrokeStyle(1, 0x3a3a3a);
      barBg.setOrigin(0, 0.5);
      
      // Bar fill
      const fillWidth = (stat.value / stat.max) * barWidth;
      const fill = this.add.rectangle(15, y + 4, fillWidth, barHeight - 2, stat.color, 1);
      fill.setOrigin(0, 0.5);
      
      // Value text
      const value = this.add.text(width/2 - 5, y, stat.value.toString(), {
        fontSize: '11px',
        color: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(1, 0);
      
      container.add([label, barBg, fill, value]);
    });
    
    return container;
  }

  private getRoleColor(role: string): number {
    const colors: Record<string, number> = {
      hunter: 0xd94a3d,
      tank: 0x4a8bd9,
      scout: 0xffd43b,
      apex: 0x9d4a9d
    };
    return colors[role.toLowerCase()] || 0x4a9d5f;
  }

  private selectDinosaur(dinosaur: DinosaurType): void {
    // Deselect previous
    if (this.selectedDinosaur) {
      const prevCard = this.dinosaurCards.get(this.selectedDinosaur);
      if (prevCard) {
        const bg = prevCard.getAt(1) as Phaser.GameObjects.Rectangle;
        bg.setStrokeStyle(2, 0x4a9d5f);
        bg.setFillStyle(0x1a1a1a, 1);
      }
    }
    
    // Select new
    this.selectedDinosaur = dinosaur;
    const card = this.dinosaurCards.get(dinosaur);
    if (card) {
      const bg = card.getAt(1) as Phaser.GameObjects.Rectangle;
      bg.setStrokeStyle(3, 0x4a9d5f);
      bg.setFillStyle(0x1a3a2a, 1);
      
      // Pulse animation
      this.tweens.add({
        targets: card,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 200,
        yoyo: true,
        ease: 'Power2'
      });
    }
    
    // Enable start button
    const startButton = this.children.getByName('startButton') as Phaser.GameObjects.Container;
    if (startButton) {
      startButton.setAlpha(1);
      const bg = startButton.getAt(1) as Phaser.GameObjects.Rectangle;
      bg.setInteractive({ useHandCursor: true });
    }
  }

  private createNavButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void,
    enabled: boolean = true
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const buttonWidth = 140;
    const buttonHeight = 40;
    
    const shadow = this.add.rectangle(3, 3, buttonWidth, buttonHeight, 0x000000, 0.3);
    const bg = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x1a1a1a, 1);
    bg.setStrokeStyle(2, color);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    container.add([shadow, bg, label]);
    container.setSize(buttonWidth, buttonHeight);
    
    if (enabled) {
      bg.setInteractive({ useHandCursor: true });
      
      bg.on('pointerover', () => {
        bg.setFillStyle(color, 0.2);
        label.setColor('#ffffff');
      });
      
      bg.on('pointerout', () => {
        bg.setFillStyle(0x1a1a1a, 1);
        label.setColor(`#${color.toString(16).padStart(6, '0')}`);
      });
      
      bg.on('pointerdown', callback);
    } else {
      container.setAlpha(0.5);
    }
    
    return container;
  }

  private startRun(): void {
    if (!this.selectedDinosaur) return;
    
    // Initialize game state
    const seed = Math.random().toString(36).substring(7);
    GameStateManager.getInstance().startNewRun(this.selectedDinosaur, seed);
    
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENE_KEYS.MAP, {
        dinosaur: this.selectedDinosaur
      });
    });
  }
}
