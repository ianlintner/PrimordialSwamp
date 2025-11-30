import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import { GameStateManager } from '../managers/GameStateManager';

interface RewardData {
  dinosaur: DinosaurType;
  enemyName: string;
  fossilsEarned: number;
  experienceGained: number;
  combatTurns: number;
}

export class RewardsScene extends Phaser.Scene {
  private rewardData!: RewardData;

  constructor() {
    super({ key: SCENE_KEYS.REWARDS });
  }

  init(data: RewardData): void {
    this.rewardData = data;
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a2a1a);
    
    // Victory banner
    this.add.text(WIDTH / 2, 80, '🏆 VICTORY! 🏆', {
      fontSize: '48px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Enemy defeated message
    this.add.text(WIDTH / 2, 140, `You defeated ${this.rewardData.enemyName}!`, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);

    // Rewards panel
    const panelX = WIDTH / 2;
    const panelY = HEIGHT / 2;
    
    this.add.rectangle(panelX, panelY, 500, 300, 0x2a2a2a)
      .setStrokeStyle(3, 0x4a9d5f);

    this.add.text(panelX, panelY - 120, 'REWARDS', {
      fontSize: '32px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Rewards list
    const rewards = [
      { icon: '🦴', label: 'Fossils Earned', value: `+${this.rewardData.fossilsEarned}` },
      { icon: '⭐', label: 'Experience', value: `+${this.rewardData.experienceGained}` },
      { icon: '⚔️', label: 'Combat Turns', value: `${this.rewardData.combatTurns}` }
    ];

    rewards.forEach((reward, index) => {
      const y = panelY - 50 + (index * 60);
      
      this.add.text(panelX - 180, y, reward.icon, {
        fontSize: '36px'
      }).setOrigin(0.5);
      
      this.add.text(panelX - 100, y, reward.label, {
        fontSize: '22px',
        color: '#cccccc',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0, 0.5);
      
      this.add.text(panelX + 180, y, reward.value, {
        fontSize: '24px',
        color: '#4a9d5f',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(1, 0.5);
    });

    // Animate rewards appearing
    this.tweens.add({
      targets: this.children.list,
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Power2'
    });

    // Continue button
    const continueBtn = this.add.text(WIDTH / 2, HEIGHT - 100, '▶ CONTINUE EXPEDITION', {
      fontSize: '28px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    continueBtn.on('pointerover', () => {
      continueBtn.setColor('#ffffff');
      continueBtn.setBackgroundColor('#4a9d5f');
    });

    continueBtn.on('pointerout', () => {
      continueBtn.setColor('#4a9d5f');
      continueBtn.setBackgroundColor('#2a2a2a');
    });

    continueBtn.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.MAP, { dinosaur: this.rewardData.dinosaur });
    });

    // Fun paleontology fact
    const facts = [
      'T. rex could exert a bite force of 12,800 pounds!',
      'Velociraptors were only about the size of a turkey.',
      'The first dinosaur fossil was named in 1824.',
      'Dinosaurs lived on every continent, including Antarctica.',
      'Some dinosaurs had feathers for warmth and display.'
    ];
    const randomFact = Phaser.Math.RND.pick(facts);

    this.add.text(WIDTH / 2, HEIGHT - 40, `💡 ${randomFact}`, {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: 800 }
    }).setOrigin(0.5);
  }
}
