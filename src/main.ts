import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { MapScene } from './scenes/MapScene';
import { CombatScene } from './scenes/CombatScene';
import { CodexScene } from './scenes/CodexScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1a1a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    MenuScene,
    CharacterSelectScene,
    MapScene,
    CombatScene,
    CodexScene
  ]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
