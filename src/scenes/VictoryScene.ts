import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { GameStateManager } from '../managers/GameStateManager';
import { VictorySummary } from '../types/Victory.types';
import dinosaursData from '../data/dinosaurs.json';

/**
 * Terminal success scene. Mirrors GameOverScene's layout so victory and defeat
 * read as a matched pair.
 */
export class VictoryScene extends Phaser.Scene {
  private summary!: VictorySummary;

  constructor() {
    super({ key: SCENE_KEYS.VICTORY });
  }

  init(data: VictorySummary): void {
    this.summary = data ?? {
      dinosaur: 'deinonychus' as VictorySummary['dinosaur'],
      depth: 5,
      combatsWon: 0,
      fossilsCollected: 0,
      runDurationMs: 0,
    };
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;
    const summary = this.summary;

    // Dark background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x1a2a1a);

    // Victory banner
    this.add.text(WIDTH / 2, 80, '🏆 EXPEDITION COMPLETE 🏆', {
      fontSize: '44px',
      color: '#51cf66',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(
      WIDTH / 2,
      140,
      'You defeated the apex of the swamp and made it out alive!',
      {
        fontSize: '22px',
        color: '#cccccc',
        fontFamily: 'Courier New, monospace',
      }
    ).setOrigin(0.5);

    // Stats panel
    const panelX = WIDTH / 2;
    const panelY = HEIGHT / 2 - 20;

    this.add.rectangle(panelX, panelY, 550, 320, 0x2a2a2a)
      .setStrokeStyle(3, 0x51cf66);

    this.add.text(panelX, panelY - 130, 'EXPEDITION SUMMARY', {
      fontSize: '28px',
      color: '#51cf66',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const dinosaurName =
      dinosaursData.find((dino) => dino.id === summary.dinosaur)?.name ??
      summary.dinosaur;

    const stats = [
      { icon: '🦖', label: 'Dinosaur', value: dinosaurName },
      { icon: '🗺️', label: 'Depth Reached', value: `Level ${summary.depth}` },
      { icon: '⚔️', label: 'Combats Won', value: `${summary.combatsWon}` },
      { icon: '🦴', label: 'Fossils Collected', value: `${summary.fossilsCollected}` },
      {
        icon: '⏱️',
        label: 'Run Duration',
        value: this.formatDuration(summary.runDurationMs),
      },
    ];

    stats.forEach((stat, index) => {
      const y = panelY - 85 + index * 44;

      this.add.text(panelX - 220, y, stat.icon, { fontSize: '28px' }).setOrigin(0.5);

      this.add.text(panelX - 150, y, stat.label, {
        fontSize: '20px',
        color: '#cccccc',
        fontFamily: 'Courier New, monospace',
      }).setOrigin(0, 0.5);

      this.add.text(panelX + 200, y, stat.value, {
        fontSize: '22px',
        color: '#ffffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold',
      }).setOrigin(1, 0.5);
    });

    // Meta-progress line
    const metaProgress = GameStateManager.getInstance().getMetaProgress();
    this.add.text(
      WIDTH / 2,
      panelY + 135,
      `Expeditions Won: ${metaProgress.victories} 🏆   Fossil Collection: ${metaProgress.fossilFragments} 🦴`,
      {
        fontSize: '18px',
        color: '#888888',
        fontFamily: 'Courier New, monospace',
      }
    ).setOrigin(0.5);

    // Buttons
    const buttonY = HEIGHT - 120;

    const newRunBtn = this.add.text(WIDTH / 2 - 150, buttonY, '🔄 NEW RUN', {
      fontSize: '24px',
      color: '#51cf66',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 25, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    newRunBtn.on('pointerover', () => {
      newRunBtn.setColor('#ffffff');
      newRunBtn.setBackgroundColor('#4a9d5f');
    });
    newRunBtn.on('pointerout', () => {
      newRunBtn.setColor('#51cf66');
      newRunBtn.setBackgroundColor('#2a2a2a');
    });
    newRunBtn.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
    });

    const menuBtn = this.add.text(WIDTH / 2 + 150, buttonY, '🏠 MAIN MENU', {
      fontSize: '24px',
      color: '#888888',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: 25, y: 12 },
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

    this.add.text(
      WIDTH / 2,
      HEIGHT - 40,
      '🔬 Birds are living dinosaurs — the lineage never truly ended.',
      {
        fontSize: '14px',
        color: '#666666',
        fontFamily: 'Courier New, monospace',
        wordWrap: { width: 800 },
      }
    ).setOrigin(0.5);

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
