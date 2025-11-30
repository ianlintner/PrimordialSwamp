import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import { NodeType } from '../types/Encounter.types';
import dinosaursData from '../data/dinosaurs.json';
import enemiesData from '../data/enemies.json';

interface Combatant {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  stamina: number;
  maxStamina: number;
  emoji: string;
}

export class CombatScene extends Phaser.Scene {
  private playerDinosaur!: DinosaurType;
  private enemyId!: string;
  private nodeType!: NodeType;
  
  private player!: Combatant;
  private enemy!: Combatant;
  
  private turn: number = 1;
  private combatLog: string[] = [];
  private playerDefending: boolean = false;
  private enemyDefending: boolean = false;

  constructor() {
    super({ key: SCENE_KEYS.COMBAT });
  }

  init(data: { dinosaur: DinosaurType; enemy: string; nodeType?: NodeType }): void {
    this.playerDinosaur = data.dinosaur;
    this.enemyId = data.enemy || 'allosaurus';
    this.nodeType = data.nodeType || NodeType.COMBAT;
    
    // Initialize player from dinosaur data
    const dinoData = dinosaursData.find(d => d.id === this.playerDinosaur);
    if (dinoData) {
      this.player = {
        name: dinoData.name,
        hp: dinoData.baseStats.hp,
        maxHp: dinoData.baseStats.hp,
        attack: dinoData.baseStats.attack,
        defense: dinoData.baseStats.defense,
        speed: dinoData.baseStats.speed,
        stamina: dinoData.baseStats.stamina,
        maxStamina: dinoData.baseStats.stamina,
        emoji: this.getDinosaurEmoji(this.playerDinosaur)
      };
    }
    
    // Initialize enemy from enemies data
    let enemyData;
    if (this.enemyId === 'random') {
      // Select random enemy based on node type
      const tier = this.nodeType === NodeType.ELITE ? 'elite' : 'basic';
      const validEnemies = enemiesData.filter(e => e.tier === tier || e.tier === 'advanced');
      enemyData = validEnemies[Math.floor(Math.random() * validEnemies.length)];
    } else if (this.enemyId === 'boss') {
      // Select random boss
      const bosses = enemiesData.filter(e => e.tier === 'boss');
      enemyData = bosses[Math.floor(Math.random() * bosses.length)];
    } else {
      enemyData = enemiesData.find(e => e.id === this.enemyId);
    }
    
    if (enemyData) {
      this.enemy = {
        name: enemyData.name,
        hp: enemyData.stats.hp,
        maxHp: enemyData.stats.hp,
        attack: enemyData.stats.attack,
        defense: enemyData.stats.defense,
        speed: enemyData.stats.speed,
        stamina: 50, // Enemies have fixed stamina for now
        maxStamina: 50,
        emoji: enemyData.emoji
      };
    }
  }
  
  private getDinosaurEmoji(id: DinosaurType): string {
    const emojiMap: Record<string, string> = {
      deinonychus: '🦖',
      ankylosaurus: '🦕',
      pteranodon: '🦅',
      tyrannosaurus: '🦖'
    };
    return emojiMap[id] || '🦴';
  }

  create(): void {
    const { WIDTH, HEIGHT, COLORS } = GAME_CONFIG;
    
    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a2a1a);
    
    // Combat arena decorations
    this.add.text(WIDTH / 2, 30, '⚔ COMBAT ENCOUNTER ⚔', {
      fontSize: '36px',
      color: '#d94a3d',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Player side (left)
    this.createCombatant(
      250,
      HEIGHT / 2,
      this.playerDinosaur,
      this.playerHealth,
      true
    );
    
    // Enemy side (right)
    this.createCombatant(
      WIDTH - 250,
      HEIGHT / 2,
      this.enemyType,
      this.enemyHealth,
      false
    );
    
    // VS text
    this.add.text(WIDTH / 2, HEIGHT / 2 - 50, 'VS', {
      fontSize: '48px',
      color: '#888888',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Action buttons
    this.createActionButtons();
    
    // Combat log
    this.createCombatLog();
    
    // Turn indicator
    this.add.text(WIDTH / 2, HEIGHT - 40, `Turn ${this.turn}`, {
      fontSize: '24px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('turnText');
    
    // Add initial log entry
    this.addLog(`Combat begins! ${this.playerDinosaur} vs ${this.enemyType}`);
  }

  private createCombatant(
    x: number,
    y: number,
    type: string,
    health: number,
    isPlayer: boolean
  ): void {
    // Sprite placeholder (emoji)
    const emoji = isPlayer ? '🦖' : '🦕';
    this.add.text(x, y - 80, emoji, {
      fontSize: '120px'
    }).setOrigin(0.5);
    
    // Name
    this.add.text(x, y + 80, type.toUpperCase(), {
      fontSize: '24px',
      color: isPlayer ? '#4a9d5f' : '#d94a3d',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Health bar
    this.createHealthBar(x, y + 120, health, 100, isPlayer);
    
    if (isPlayer) {
      // Stamina bar
      this.createStaminaBar(x, y + 150, this.playerStamina, 70);
    }
  }

  private createHealthBar(
    x: number,
    y: number,
    current: number,
    max: number,
    isPlayer: boolean
  ): void {
    const width = 200;
    const height = 20;
    
    // Background
    const bg = this.add.rectangle(x, y, width, height, 0x2a2a2a);
    bg.setStrokeStyle(2, 0x4a9d5f);
    
    // Fill
    const fillWidth = (current / max) * width;
    const fill = this.add.rectangle(
      x - width / 2 + fillWidth / 2,
      y,
      fillWidth,
      height - 4,
      isPlayer ? 0x4a9d5f : 0xd94a3d
    );
    fill.setName(isPlayer ? 'playerHealthFill' : 'enemyHealthFill');
    
    // Text
    this.add.text(x, y, `${current}/${max}`, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName(isPlayer ? 'playerHealthText' : 'enemyHealthText');
  }

  private createStaminaBar(x: number, y: number, current: number, max: number): void {
    const width = 200;
    const height = 15;
    
    // Background
    const bg = this.add.rectangle(x, y, width, height, 0x2a2a2a);
    bg.setStrokeStyle(2, 0x4a8bd9);
    
    // Fill
    const fillWidth = (current / max) * width;
    const fill = this.add.rectangle(
      x - width / 2 + fillWidth / 2,
      y,
      fillWidth,
      height - 4,
      0x4a8bd9
    );
    fill.setName('playerStaminaFill');
    
    // Text
    this.add.text(x, y, `STA: ${current}/${max}`, {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('playerStaminaText');
  }

  private createActionButtons(): void {
    const buttonY = GAME_CONFIG.HEIGHT - 180;
    const buttonSpacing = 160;
    const startX = 200;
    
    // Attack button
    this.createButton(startX, buttonY, '⚔ ATTACK', () => this.playerAttack());
    
    // Defend button
    this.createButton(startX + buttonSpacing, buttonY, '🛡 DEFEND', () => this.playerDefend());
    
    // Ability button
    this.createButton(startX + buttonSpacing * 2, buttonY, '✨ ABILITY', () => this.playerAbility());
    
    // Flee button
    this.createButton(startX + buttonSpacing * 3, buttonY, '🏃 FLEE', () => this.playerFlee());
  }

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.text(x, y, text, {
      fontSize: '20px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 15, y: 10 }
    }).setInteractive({ useHandCursor: true });
    
    button.on('pointerover', () => {
      button.setColor('#ffffff');
      button.setBackgroundColor('#4a9d5f');
    });
    
    button.on('pointerout', () => {
      button.setColor('#4a9d5f');
      button.setBackgroundColor('#2a2a2a');
    });
    
    button.on('pointerdown', callback);
  }

  private createCombatLog(): void {
    const x = 50;
    const y = 120;
    
    this.add.text(x, y, 'COMBAT LOG:', {
      fontSize: '18px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    });
    
    this.add.rectangle(x + 200, y + 100, 380, 180, 0x2a2a2a)
      .setStrokeStyle(2, 0x4a9d5f)
      .setOrigin(0.5);
    
    this.add.text(x + 10, y + 20, '', {
      fontSize: '14px',
      color: '#cccccc',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: 360 },
      lineSpacing: 5
    }).setName('combatLogText');
  }

  private addLog(message: string): void {
    this.combatLog.push(`[T${this.turn}] ${message}`);
    if (this.combatLog.length > 8) {
      this.combatLog.shift();
    }
    
    const logText = this.children.getByName('combatLogText') as Phaser.GameObjects.Text;
    if (logText) {
      logText.setText(this.combatLog.join('\n'));
    }
  }

  private playerAttack(): void {
    const damage = Phaser.Math.Between(8, 12);
    this.enemyHealth = Math.max(0, this.enemyHealth - damage);
    this.playerStamina = Math.max(0, this.playerStamina - 10);
    
    this.addLog(`You attack for ${damage} damage!`);
    this.updateCombatUI();
    
    if (this.enemyHealth <= 0) {
      this.victory();
    } else {
      this.enemyTurn();
    }
  }

  private playerDefend(): void {
    this.addLog('You brace for impact! (+5 DEF this turn)');
    this.playerStamina = Math.min(70, this.playerStamina + 5);
    this.updateCombatUI();
    this.enemyTurn();
  }

  private playerAbility(): void {
    if (this.playerStamina < 30) {
      this.addLog('Not enough stamina!');
      return;
    }
    
    const damage = Phaser.Math.Between(15, 20);
    this.enemyHealth = Math.max(0, this.enemyHealth - damage);
    this.playerStamina -= 30;
    
    this.addLog(`You use a special ability for ${damage} damage!`);
    this.updateCombatUI();
    
    if (this.enemyHealth <= 0) {
      this.victory();
    } else {
      this.enemyTurn();
    }
  }

  private playerFlee(): void {
    const fleeChance = 0.5;
    if (Math.random() < fleeChance) {
      this.addLog('You successfully flee from combat!');
      this.time.delayedCall(1000, () => {
        this.scene.start(SCENE_KEYS.MAP, { dinosaur: this.playerDinosaur });
      });
    } else {
      this.addLog('Failed to flee!');
      this.enemyTurn();
    }
  }

  private enemyTurn(): void {
    this.turn++;
    
    this.time.delayedCall(500, () => {
      const damage = Phaser.Math.Between(5, 10);
      this.playerHealth = Math.max(0, this.playerHealth - damage);
      
      this.addLog(`${this.enemyType} attacks for ${damage} damage!`);
      this.updateCombatUI();
      
      if (this.playerHealth <= 0) {
        this.defeat();
      }
      
      // Update turn counter
      const turnText = this.children.getByName('turnText') as Phaser.GameObjects.Text;
      if (turnText) {
        turnText.setText(`Turn ${this.turn}`);
      }
    });
  }

  private updateCombatUI(): void {
    // Update health bars and text
    const playerHealthFill = this.children.getByName('playerHealthFill') as Phaser.GameObjects.Rectangle;
    const playerHealthText = this.children.getByName('playerHealthText') as Phaser.GameObjects.Text;
    const enemyHealthFill = this.children.getByName('enemyHealthFill') as Phaser.GameObjects.Rectangle;
    const enemyHealthText = this.children.getByName('enemyHealthText') as Phaser.GameObjects.Text;
    const staminaFill = this.children.getByName('playerStaminaFill') as Phaser.GameObjects.Rectangle;
    const staminaText = this.children.getByName('playerStaminaText') as Phaser.GameObjects.Text;
    
    if (playerHealthFill) {
      const width = (this.playerHealth / 100) * 200;
      playerHealthFill.setSize(width, 16);
      playerHealthFill.x = 250 - 200 / 2 + width / 2;
    }
    if (playerHealthText) {
      playerHealthText.setText(`${this.playerHealth}/100`);
    }
    
    if (enemyHealthFill) {
      const width = (this.enemyHealth / 100) * 200;
      enemyHealthFill.setSize(width, 16);
      enemyHealthFill.x = (GAME_CONFIG.WIDTH - 250) - 200 / 2 + width / 2;
    }
    if (enemyHealthText) {
      enemyHealthText.setText(`${this.enemyHealth}/100`);
    }
    
    if (staminaFill) {
      const width = (this.playerStamina / 70) * 200;
      staminaFill.setSize(width, 11);
      staminaFill.x = 250 - 200 / 2 + width / 2;
    }
    if (staminaText) {
      staminaText.setText(`STA: ${this.playerStamina}/70`);
    }
  }

  private victory(): void {
    this.addLog('💀 Enemy defeated! VICTORY!');
    
    this.time.delayedCall(2000, () => {
      // TODO: Show rewards screen
      this.scene.start(SCENE_KEYS.MAP, { dinosaur: this.playerDinosaur });
    });
  }

  private defeat(): void {
    this.addLog('💀 You have been defeated...');
    
    this.time.delayedCall(2000, () => {
      // TODO: Show game over screen with stats
      this.scene.start(SCENE_KEYS.MENU);
    });
  }
}
