import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Text;
  private codexButton!: Phaser.GameObjects.Text;
  private settingsButton!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.MENU });
  }

  create(): void {
    const { WIDTH, HEIGHT, COLORS } = GAME_CONFIG;
    
    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, COLORS.BACKGROUND);
    
    // Title
    this.titleText = this.add.text(WIDTH / 2, 150, 'PRIMORDIAL SWAMP', {
      fontSize: '72px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Subtitle
    this.add.text(WIDTH / 2, 230, 'A Paleontological Roguelite', {
      fontSize: '24px',
      color: '#3d7a4d',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
    
    // Fossil decoration
    this.add.text(WIDTH / 2 - 200, 150, '🦴', {
      fontSize: '48px'
    });
    this.add.text(WIDTH / 2 + 200, 150, '🦴', {
      fontSize: '48px'
    });
    
    // Menu buttons
    const buttonY = 400;
    const buttonSpacing = 80;
    
    this.startButton = this.createMenuButton(
      WIDTH / 2,
      buttonY,
      '▶ START NEW RUN',
      () => this.startGame()
    );
    
    this.codexButton = this.createMenuButton(
      WIDTH / 2,
      buttonY + buttonSpacing,
      '📚 CODEX',
      () => this.openCodex()
    );
    
    this.settingsButton = this.createMenuButton(
      WIDTH / 2,
      buttonY + buttonSpacing * 2,
      '⚙ SETTINGS',
      () => this.openSettings()
    );
    
    // Version info
    this.add.text(WIDTH - 20, HEIGHT - 20, 'v0.1.0 MVP', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(1);
    
    // Fun fact at bottom
    this.displayRandomFact();
    
    // Animate title
    this.tweens.add({
      targets: this.titleText,
      y: 140,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createMenuButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, text, {
      fontSize: '32px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    // Hover effects
    button.on('pointerover', () => {
      button.setColor('#ffffff');
      button.setBackgroundColor('#4a9d5f');
    });
    
    button.on('pointerout', () => {
      button.setColor('#4a9d5f');
      button.setBackgroundColor('#2a2a2a');
    });
    
    button.on('pointerdown', callback);
    
    return button;
  }

  private startGame(): void {
    console.log('🦕 Starting new run...');
    this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
  }

  private openCodex(): void {
    console.log('📚 Opening codex...');
    // TODO: Implement codex scene
    this.add.text(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2, 'CODEX COMING SOON', {
      fontSize: '48px',
      color: '#4a9d5f'
    }).setOrigin(0.5);
  }

  private openSettings(): void {
    console.log('⚙ Opening settings...');
    // TODO: Implement settings scene
  }

  private displayRandomFact(): void {
    const facts = [
      'Did you know? T. rex lived closer in time to humans than to Stegosaurus!',
      'Dinosaurs ruled Earth for over 165 million years.',
      'Not all dinosaurs went extinct - birds are their descendants!',
      'The word "dinosaur" means "terrible lizard" in Greek.',
      'Some dinosaurs had hollow bones, like modern birds.'
    ];
    
    const randomFact = Phaser.Math.RND.pick(facts);
    
    this.add.text(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT - 80, randomFact, {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New, monospace',
      align: 'center',
      wordWrap: { width: 800 }
    }).setOrigin(0.5);
  }
}
