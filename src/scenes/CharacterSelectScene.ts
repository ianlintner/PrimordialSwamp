import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import dinosaursData from '../data/dinosaurs.json';

export class CharacterSelectScene extends Phaser.Scene {
  private selectedDinosaur: DinosaurType | null = null;
  private dinosaurCards: Map<DinosaurType, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super({ key: SCENE_KEYS.CHARACTER_SELECT });
  }

  create(): void {
    const { WIDTH, HEIGHT, COLORS } = GAME_CONFIG;
    
    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, COLORS.BACKGROUND);
    
    // Title
    this.add.text(WIDTH / 2, 80, 'SELECT YOUR DINOSAUR', {
      fontSize: '48px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Load available dinosaurs
    const availableDinosaurs = dinosaursData.filter(dino => 
      dino.unlockCondition?.type === 'always'
    );
    
    // Create dinosaur selection cards
    const cardWidth = 320;
    const cardSpacing = 40;
    const totalWidth = (cardWidth * availableDinosaurs.length) + (cardSpacing * (availableDinosaurs.length - 1));
    const startX = (WIDTH - totalWidth) / 2 + cardWidth / 2;
    const cardY = HEIGHT / 2;
    
    availableDinosaurs.forEach((dino, index) => {
      const x = startX + (index * (cardWidth + cardSpacing));
      const card = this.createDinosaurCard(x, cardY, dino as any);
      this.dinosaurCards.set(dino.id as DinosaurType, card);
    });
    
    // Back button
    this.createButton(
      100,
      HEIGHT - 60,
      '← BACK',
      () => this.scene.start(SCENE_KEYS.MENU)
    );
    
    // Start button (disabled until selection)
    const startButton = this.createButton(
      WIDTH - 100,
      HEIGHT - 60,
      'START RUN →',
      () => this.startRun(),
      false
    );
    startButton.setName('startButton');
  }

  private createDinosaurCard(
    x: number,
    y: number,
    dinoData: any
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const cardWidth = 320;
    const cardHeight = 450;
    
    // Card background
    const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x2a2a2a, 1);
    bg.setStrokeStyle(3, 0x4a9d5f);
    
    // Dinosaur emoji (placeholder for sprite)
    const emoji = this.getDinosaurEmoji(dinoData.id);
    const dinoIcon = this.add.text(0, -150, emoji, {
      fontSize: '80px'
    }).setOrigin(0.5);
    
    // Name
    const name = this.add.text(0, -80, dinoData.name.toUpperCase(), {
      fontSize: '24px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Role
    const role = this.add.text(0, -50, `[${dinoData.role.toUpperCase()}]`, {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
    
    // Stats
    const statsY = 0;
    const stats = this.add.text(0, statsY, 
      `HP:  ${dinoData.baseStats.health}\n` +
      `ATK: ${dinoData.baseStats.attack}\n` +
      `DEF: ${dinoData.baseStats.defense}\n` +
      `SPD: ${dinoData.baseStats.speed}\n` +
      `STA: ${dinoData.baseStats.stamina}`,
      {
        fontSize: '18px',
        color: '#f0f0f0',
        fontFamily: 'Courier New, monospace',
        lineSpacing: 8,
        align: 'left'
      }
    ).setOrigin(0.5);
    
    // Description
    const description = this.add.text(0, 120, dinoData.description, {
      fontSize: '14px',
      color: '#cccccc',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: cardWidth - 40 },
      align: 'center'
    }).setOrigin(0.5);
    
    container.add([bg, dinoIcon, name, role, stats, description]);
    
    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      bg.setStrokeStyle(4, 0xffffff);
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200
      });
    });
    
    bg.on('pointerout', () => {
      if (this.selectedDinosaur !== dinoData.id) {
        bg.setStrokeStyle(3, 0x4a9d5f);
      }
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });
    
    bg.on('pointerdown', () => {
      this.selectDinosaur(dinoData.id as DinosaurType);
    });
    
    return container;
  }

  private selectDinosaur(dinosaur: DinosaurType): void {
    // Deselect previous
    if (this.selectedDinosaur) {
      const prevCard = this.dinosaurCards.get(this.selectedDinosaur);
      if (prevCard) {
        const bg = prevCard.getAt(0) as Phaser.GameObjects.Rectangle;
        bg.setStrokeStyle(3, 0x4a9d5f);
      }
    }
    
    // Select new
    this.selectedDinosaur = dinosaur;
    const card = this.dinosaurCards.get(dinosaur);
    if (card) {
      const bg = card.getAt(0) as Phaser.GameObjects.Rectangle;
      bg.setStrokeStyle(4, 0x4a9d5f);
      bg.setFillStyle(0x1a3d2a);
    }
    
    // Enable start button
    const startButton = this.children.getByName('startButton') as Phaser.GameObjects.Text;
    if (startButton) {
      startButton.setAlpha(1);
      startButton.setInteractive({ useHandCursor: true });
      
      // Add event listeners if not already added
      startButton.removeAllListeners();
      startButton.on('pointerover', () => {
        startButton.setColor('#ffffff');
        startButton.setBackgroundColor('#4a9d5f');
      });
      
      startButton.on('pointerout', () => {
        startButton.setColor('#4a9d5f');
        startButton.setBackgroundColor('#2a2a2a');
      });
      
      startButton.on('pointerdown', () => this.startRun());
    }
    
    console.log(`🦕 Selected: ${dinosaur}`);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void,
    enabled: boolean = true
  ): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    if (enabled) {
      button.setInteractive({ useHandCursor: true });
      
      button.on('pointerover', () => {
        button.setColor('#ffffff');
        button.setBackgroundColor('#4a9d5f');
      });
      
      button.on('pointerout', () => {
        button.setColor('#4a9d5f');
        button.setBackgroundColor('#2a2a2a');
      });
      
      button.on('pointerdown', callback);
    } else {
      button.setAlpha(0.5);
    }
    
    return button;
  }

  private startRun(): void {
    if (!this.selectedDinosaur) return;
    
    console.log(`🦕 Starting run with ${this.selectedDinosaur}`);
    
    // TODO: Initialize game state with selected dinosaur
    this.scene.start(SCENE_KEYS.MAP, {
      dinosaur: this.selectedDinosaur
    });
  }

  private getDinosaurEmoji(id: string): string {
    const emojiMap: Record<string, string> = {
      deinonychus: '🦖',
      ankylosaurus: '🦕',
      pteranodon: '🦅',
      tyrannosaurus: '🦖'
    };
    return emojiMap[id] || '🦴';
  }
}
