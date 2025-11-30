import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { GameStateManager } from '../managers/GameStateManager';

interface GameOverData {
  enemyName: string;
  depth: number;
  combatsWon: number;
  fossilsCollected: number;
  turnsInCombat: number;
  runDuration: number;
}

export class GameOverScene extends Phaser.Scene {
  private gameOverData!: GameOverData;

  constructor() {
    super({ key: SCENE_KEYS.GAME_OVER });
  }

  init(data: GameOverData): void {
    this.gameOverData = data;
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Dark background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a1a1a);
    
    // Defeat banner
    this.add.text(WIDTH / 2, 80, '💀 EXPEDITION FAILED 💀', {
      fontSize: '48px',
      color: '#d94a3d',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Cause of death
    this.add.text(WIDTH / 2, 140, `Defeated by ${this.gameOverData.enemyName}`, {
      fontSize: '24px',
      color: '#cccccc',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);

    // Stats panel
    const panelX = WIDTH / 2;
    const panelY = HEIGHT / 2 - 20;
    
    this.add.rectangle(panelX, panelY, 550, 320, 0x2a2a2a)
      .setStrokeStyle(3, 0xd94a3d);

    this.add.text(panelX, panelY - 130, 'EXPEDITION SUMMARY', {
      fontSize: '28px',
      color: '#d94a3d',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Stats list
    const stats = [
      { icon: '🗺️', label: 'Depth Reached', value: `Level ${this.gameOverData.depth}` },
      { icon: '⚔️', label: 'Combats Won', value: `${this.gameOverData.combatsWon}` },
      { icon: '🦴', label: 'Fossils Collected', value: `${this.gameOverData.fossilsCollected}` },
      { icon: '⏱️', label: 'Run Duration', value: this.formatDuration(this.gameOverData.runDuration) }
    ];

    stats.forEach((stat, index) => {
      const y = panelY - 70 + (index * 50);
      
      this.add.text(panelX - 220, y, stat.icon, {
        fontSize: '32px'
      }).setOrigin(0.5);
      
      this.add.text(panelX - 150, y, stat.label, {
        fontSize: '20px',
        color: '#cccccc',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0, 0.5);
      
      this.add.text(panelX + 200, y, stat.value, {
        fontSize: '22px',
        color: '#ffffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(1, 0.5);
    });

    // Meta-progress update
    const metaProgress = GameStateManager.getInstance().getMetaProgress();
    
    this.add.text(WIDTH / 2, panelY + 130, `Total Fossil Collection: ${metaProgress.fossilFragments} 🦴`, {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);

    // Buttons
    const buttonY = HEIGHT - 120;
    
    // Try Again button
    const tryAgainBtn = this.add.text(WIDTH / 2 - 150, buttonY, '🔄 TRY AGAIN', {
      fontSize: '24px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 25, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    tryAgainBtn.on('pointerover', () => {
      tryAgainBtn.setColor('#ffffff');
      tryAgainBtn.setBackgroundColor('#4a9d5f');
    });

    tryAgainBtn.on('pointerout', () => {
      tryAgainBtn.setColor('#4a9d5f');
      tryAgainBtn.setBackgroundColor('#2a2a2a');
    });

    tryAgainBtn.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
    });

    // Return to Menu button
    const menuBtn = this.add.text(WIDTH / 2 + 150, buttonY, '🏠 MAIN MENU', {
      fontSize: '24px',
      color: '#888888',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 25, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => {
      menuBtn.setColor('#ffffff');
      menuBtn.setBackgroundColor('#555555');
    });

    menuBtn.on('pointerout', () => {
      menuBtn.setColor('#888888');
      menuBtn.setBackgroundColor('#2a2a2a');
    });

    menuBtn.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.MENU);
    });

    // Educational fact about extinction
    const extinctionFacts = [
      'The dinosaurs went extinct 66 million years ago after an asteroid impact.',
      'Not all dinosaurs died out - birds are living dinosaurs!',
      'Mass extinctions have happened 5 times in Earth\'s history.',
      'The asteroid that killed the dinosaurs was about 6 miles wide.',
      'Some species survived the extinction, including crocodiles and turtles.'
    ];
    const randomFact = Phaser.Math.RND.pick(extinctionFacts);

    this.add.text(WIDTH / 2, HEIGHT - 40, `🔬 ${randomFact}`, {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: 800 }
    }).setOrigin(0.5);

    // Fade in animation
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
