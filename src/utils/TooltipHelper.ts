import Phaser from 'phaser';
import { GAME_CONFIG, TYPOGRAPHY, TOOLTIP_CONFIG, hexToColorString } from './Constants';

/**
 * TooltipHelper provides consistent tooltip functionality across scenes
 * Implements contextual help for mechanics and controls
 */
export class TooltipHelper {
  private scene: Phaser.Scene;
  private tooltip: Phaser.GameObjects.Container | null = null;
  private delayTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Show a tooltip near the specified position
   */
  public showTooltip(
    x: number,
    y: number,
    title: string,
    description: string,
    extra?: { cost?: string; shortcut?: string; warning?: string }
  ): void {
    this.hideTooltip();

    const container = this.scene.add.container(x, y + TOOLTIP_CONFIG.OFFSET_Y);
    container.setName('tooltip');
    container.setDepth(100);

    // Calculate text dimensions
    const padding = TOOLTIP_CONFIG.PADDING;
    const maxWidth = TOOLTIP_CONFIG.MAX_WIDTH;

    // Title text
    const titleText = this.scene.add.text(padding, padding, title, {
      fontSize: TYPOGRAPHY.SIZE_MD,
      color: hexToColorString(GAME_CONFIG.COLORS.PRIMARY),
      fontFamily: TYPOGRAPHY.FONT_FAMILY,
      fontStyle: 'bold'
    });

    // Description text
    const descText = this.scene.add.text(padding, padding + 24, description, {
      fontSize: TYPOGRAPHY.SIZE_SM,
      color: hexToColorString(GAME_CONFIG.COLORS.TEXT_SECONDARY),
      fontFamily: TYPOGRAPHY.FONT_FAMILY,
      wordWrap: { width: maxWidth - padding * 2 }
    });

    let currentY = padding + 24 + descText.height + 8;

    // Optional cost display
    let costText: Phaser.GameObjects.Text | null = null;
    if (extra?.cost) {
      costText = this.scene.add.text(padding, currentY, `Cost: ${extra.cost}`, {
        fontSize: TYPOGRAPHY.SIZE_SM,
        color: hexToColorString(GAME_CONFIG.COLORS.INFO),
        fontFamily: TYPOGRAPHY.FONT_FAMILY
      });
      currentY += 20;
    }

    // Optional warning display
    let warningText: Phaser.GameObjects.Text | null = null;
    if (extra?.warning) {
      warningText = this.scene.add.text(padding, currentY, `⚠ ${extra.warning}`, {
        fontSize: TYPOGRAPHY.SIZE_SM,
        color: hexToColorString(GAME_CONFIG.COLORS.WARNING),
        fontFamily: TYPOGRAPHY.FONT_FAMILY
      });
      currentY += 20;
    }

    // Optional shortcut display
    let shortcutText: Phaser.GameObjects.Text | null = null;
    if (extra?.shortcut) {
      shortcutText = this.scene.add.text(padding, currentY, extra.shortcut, {
        fontSize: TYPOGRAPHY.SIZE_XS,
        color: hexToColorString(GAME_CONFIG.COLORS.TEXT_MUTED),
        fontFamily: TYPOGRAPHY.FONT_FAMILY
      });
      currentY += 18;
    }

    // Calculate background size
    const textWidth = Math.max(
      titleText.width,
      descText.width,
      costText?.width || 0,
      warningText?.width || 0,
      shortcutText?.width || 0
    );
    const bgWidth = Math.min(maxWidth, textWidth + padding * 2);
    const bgHeight = currentY + padding;

    // Background
    const bg = this.scene.add.rectangle(
      bgWidth / 2,
      bgHeight / 2,
      bgWidth,
      bgHeight,
      0x1a1a1a,
      0.95
    );
    bg.setStrokeStyle(2, GAME_CONFIG.COLORS.PRIMARY);

    // Add elements to container
    const elements = [bg, titleText, descText];
    if (costText) elements.push(costText);
    if (warningText) elements.push(warningText);
    if (shortcutText) elements.push(shortcutText);
    container.add(elements);

    // Ensure tooltip stays on screen
    this.constrainToScreen(container, bgWidth, bgHeight);

    // Fade in animation
    container.setAlpha(0);
    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      duration: TOOLTIP_CONFIG.FADE_IN_MS,
      ease: 'Power2'
    });

    this.tooltip = container;
  }

  /**
   * Show tooltip with delay
   */
  public showTooltipDelayed(
    x: number,
    y: number,
    title: string,
    description: string,
    extra?: { cost?: string; shortcut?: string; warning?: string }
  ): void {
    this.hideTooltip();
    
    this.delayTimer = this.scene.time.delayedCall(
      TOOLTIP_CONFIG.DELAY_MS,
      () => this.showTooltip(x, y, title, description, extra)
    );
  }

  /**
   * Hide the current tooltip
   */
  public hideTooltip(): void {
    if (this.delayTimer) {
      this.delayTimer.destroy();
      this.delayTimer = null;
    }

    if (this.tooltip) {
      this.scene.tweens.add({
        targets: this.tooltip,
        alpha: 0,
        duration: TOOLTIP_CONFIG.FADE_OUT_MS,
        ease: 'Power2',
        onComplete: () => {
          if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
          }
        }
      });
    }
  }

  /**
   * Keep tooltip within screen bounds
   */
  private constrainToScreen(
    container: Phaser.GameObjects.Container,
    width: number,
    height: number
  ): void {
    const margin = 10;
    
    // Constrain X
    if (container.x - width / 2 < margin) {
      container.x = width / 2 + margin;
    } else if (container.x + width / 2 > GAME_CONFIG.WIDTH - margin) {
      container.x = GAME_CONFIG.WIDTH - width / 2 - margin;
    }
    
    // Constrain Y
    if (container.y < margin) {
      container.y = margin + height;
    } else if (container.y + height > GAME_CONFIG.HEIGHT - margin) {
      container.y = GAME_CONFIG.HEIGHT - margin - height;
    }
  }

  /**
   * Destroy the helper
   */
  public destroy(): void {
    this.hideTooltip();
  }
}

/**
 * Tooltip content definitions for combat actions
 */
export const COMBAT_TOOLTIPS = {
  attack: {
    title: 'Basic Attack',
    description: 'Strike your enemy with a basic attack. Damage is based on your ATK stat minus enemy DEF.',
    cost: '10 Stamina',
    shortcut: 'Press 1 or A'
  },
  defend: {
    title: 'Defend',
    description: 'Take a defensive stance, increasing your defense by 50% for this turn. Also recovers stamina.',
    cost: '+15 Stamina',
    shortcut: 'Press 2 or D'
  },
  ability: {
    title: 'Special Ability',
    description: 'Use your species\' unique ability for increased damage and special effects. Has a cooldown after use.',
    cost: '30 Stamina',
    warning: '3 turn cooldown',
    shortcut: 'Press 3 or S'
  },
  flee: {
    title: 'Flee',
    description: 'Attempt to escape from combat. Success is based on your Speed compared to the enemy.',
    warning: 'Failed flee lets enemy attack freely',
    shortcut: 'Press 4 or F'
  }
};

/**
 * Tooltip content definitions for map nodes
 */
export const MAP_NODE_TOOLTIPS = {
  combat: {
    title: 'Combat Encounter',
    description: 'Face a dinosaur in battle. Defeat it to earn fossils and continue your expedition.'
  },
  resource: {
    title: 'Resource Site',
    description: 'A gathering spot where you can find fossil fragments and other valuable resources.'
  },
  event: {
    title: 'Random Event',
    description: 'A mysterious location with unpredictable outcomes. Could be beneficial or dangerous!'
  },
  elite: {
    title: 'Elite Enemy',
    description: 'A powerful enemy that offers greater rewards but poses significant danger.',
    warning: 'Prepare carefully!'
  },
  rest: {
    title: 'Rest Site',
    description: 'A safe haven to rest and recover. Restores HP and fully replenishes stamina.'
  },
  boss: {
    title: 'Boss Encounter',
    description: 'The guardian of this biome. Defeat it to advance to the next area!',
    warning: 'Point of no return'
  }
};

/**
 * Tooltip content for stats
 */
export const STAT_TOOLTIPS = {
  hp: {
    title: 'Health Points (HP)',
    description: 'Your current health. When it reaches 0, your expedition ends in defeat.'
  },
  stamina: {
    title: 'Stamina',
    description: 'Energy used for actions. Regenerates each turn. Defending grants extra recovery.'
  },
  attack: {
    title: 'Attack (ATK)',
    description: 'Your base damage output. Higher attack means more damage dealt to enemies.'
  },
  defense: {
    title: 'Defense (DEF)',
    description: 'Reduces incoming damage. Higher defense means less damage taken.'
  },
  speed: {
    title: 'Speed (SPD)',
    description: 'Determines turn order and flee success. Faster dinosaurs act first.'
  },
  fossils: {
    title: 'Fossil Fragments',
    description: 'Currency collected during your expedition. Used for permanent upgrades.'
  },
  depth: {
    title: 'Current Depth',
    description: 'Your progress through the current biome. Reach depth 5 to face the boss.'
  }
};
