import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { GameStateManager } from '../managers/GameStateManager';
import enemiesData from '../data/enemies.json';

export class CodexScene extends Phaser.Scene {
  private enemies: any[];
  private selectedEnemyId: string | null = null;

  constructor() {
    super({ key: SCENE_KEYS.CODEX });
    this.enemies = enemiesData;
  }

  create(): void {
    this.createBackground();
    this.createHeader();
    this.createEnemyList();
    this.createDetailsPanel();
    this.createBackButton();
  }

  private createBackground(): void {
    this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, 0x1a1a1a).setOrigin(0);
    
    // Grid pattern
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333333, 0.3);
    
    for (let x = 0; x < GAME_CONFIG.WIDTH; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, GAME_CONFIG.HEIGHT);
    }
    
    for (let y = 0; y < GAME_CONFIG.HEIGHT; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(GAME_CONFIG.WIDTH, y);
    }
    
    graphics.strokePath();
  }

  private createHeader(): void {
    this.add.text(GAME_CONFIG.WIDTH / 2, 50, 'PALEONTOLOGICAL CODEX', {
      fontSize: '32px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const unlockedCount = GameStateManager.getInstance().getMetaProgress().codexEntries.length;
    const totalCount = this.enemies.length;
    
    this.add.text(GAME_CONFIG.WIDTH / 2, 90, `Discovered: ${unlockedCount}/${totalCount}`, {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
  }

  private createEnemyList(): void {
    const startX = 100;
    const startY = 150;
    const itemHeight = 50;
    const unlockedEntries = GameStateManager.getInstance().getMetaProgress().codexEntries;

    this.enemies.forEach((enemy, index) => {
      const isUnlocked = unlockedEntries.includes(enemy.id);
      const y = startY + (index * itemHeight);
      
      const container = this.add.container(startX, y);
      
      // Background
      const bg = this.add.rectangle(0, 0, 300, 40, 0x2a2a2a)
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });
        
      // Text
      const text = this.add.text(20, 0, isUnlocked ? enemy.name : '???', {
        fontSize: '20px',
        color: isUnlocked ? '#ffffff' : '#666666',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0, 0.5);
      
      container.add([bg, text]);
      
      bg.on('pointerover', () => {
        bg.setFillStyle(0x3a3a3a);
        text.setColor('#4a9d5f');
      });
      
      bg.on('pointerout', () => {
        if (this.selectedEnemyId !== enemy.id) {
          bg.setFillStyle(0x2a2a2a);
          text.setColor(isUnlocked ? '#ffffff' : '#666666');
        }
      });
      
      bg.on('pointerdown', () => {
        this.selectedEnemyId = enemy.id;
        this.updateDetailsPanel(enemy, isUnlocked);
        
        // Reset all other backgrounds
        this.children.each((child) => {
          if (child instanceof Phaser.GameObjects.Container && child.x === startX) {
            const childBg = child.getAt(0) as Phaser.GameObjects.Rectangle;
            const childText = child.getAt(1) as Phaser.GameObjects.Text;
            childBg.setFillStyle(0x2a2a2a);
            // Check if this child corresponds to an unlocked enemy
            // This is a bit hacky, better to store reference
          }
        });
        
        bg.setFillStyle(0x4a9d5f);
        text.setColor('#ffffff');
      });
    });
  }

  private createDetailsPanel(): void {
    const panelX = 500;
    const panelY = 130;
    const width = 700;
    const height = 500;
    
    const bg = this.add.rectangle(panelX, panelY, width, height, 0x222222).setOrigin(0);
    bg.setStrokeStyle(2, 0x4a9d5f);
    
    this.add.text(panelX + width / 2, panelY + height / 2, 'Select an entry to view details', {
      fontSize: '24px',
      color: '#666666',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('placeholder');
  }

  private updateDetailsPanel(enemy: any, isUnlocked: boolean): void {
    // Clear previous details
    const panelX = 500;
    const panelY = 130;
    
    // Remove placeholder
    const placeholder = this.children.getByName('placeholder');
    if (placeholder) placeholder.destroy();
    
    // Remove previous details
    this.children.each((child) => {
      if (child.getData('isDetail')) child.destroy();
    });
    
    if (!isUnlocked) {
      this.add.text(panelX + 350, panelY + 250, 'DATA ENCRYPTED\nEncounter this species to unlock.', {
        fontSize: '24px',
        color: '#ff4444',
        fontFamily: 'Courier New, monospace',
        align: 'center'
      }).setOrigin(0.5).setData('isDetail', true);
      return;
    }
    
    // Name
    this.add.text(panelX + 40, panelY + 40, enemy.name, {
      fontSize: '36px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setData('isDetail', true);
    
    // Scientific Info
    const infoY = panelY + 100;
    this.add.text(panelX + 40, infoY, `Period: ${enemy.scientificInfo.period} (${enemy.scientificInfo.mya} MYA)`, {
      fontSize: '18px',
      color: '#aaaaaa',
      fontFamily: 'Courier New, monospace'
    }).setData('isDetail', true);
    
    this.add.text(panelX + 40, infoY + 30, `Size: ${enemy.scientificInfo.size} | Weight: ${enemy.scientificInfo.weight}`, {
      fontSize: '18px',
      color: '#aaaaaa',
      fontFamily: 'Courier New, monospace'
    }).setData('isDetail', true);
    
    // Stats
    const statsY = infoY + 80;
    this.add.text(panelX + 40, statsY, 'COMBAT STATISTICS', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setData('isDetail', true);
    
    const stats = [
      `HP: ${enemy.stats.hp}`,
      `Attack: ${enemy.stats.attack}`,
      `Defense: ${enemy.stats.defense}`,
      `Speed: ${enemy.stats.speed}`
    ];
    
    stats.forEach((stat, i) => {
      this.add.text(panelX + 40, statsY + 40 + (i * 30), stat, {
        fontSize: '18px',
        color: '#dddddd',
        fontFamily: 'Courier New, monospace'
      }).setData('isDetail', true);
    });
    
    // Fun Fact
    const factY = statsY + 200;
    this.add.text(panelX + 40, factY, 'PALEONTOLOGIST NOTES:', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setData('isDetail', true);
    
    this.add.text(panelX + 40, factY + 40, enemy.scientificInfo.fact, {
      fontSize: '18px',
      color: '#dddddd',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: 600 }
    }).setData('isDetail', true);
    
    // Emoji/Image
    this.add.text(panelX + 550, panelY + 80, enemy.emoji, {
      fontSize: '120px'
    }).setOrigin(0.5).setData('isDetail', true);
  }

  private createBackButton(): void {
    const button = this.add.text(40, GAME_CONFIG.HEIGHT - 40, '← BACK TO MENU', {
      fontSize: '20px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 15, y: 8 }
    }).setInteractive({ useHandCursor: true });
    
    button.on('pointerover', () => {
      button.setColor('#ffffff');
      button.setBackgroundColor('#4a9d5f');
    });
    
    button.on('pointerout', () => {
      button.setColor('#4a9d5f');
      button.setBackgroundColor('#2a2a2a');
    });
    
    button.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.MENU);
    });
  }
}
