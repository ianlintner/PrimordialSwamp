import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG, SPACING } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import { NodeType } from '../types/Encounter.types';
import { StatusEffect, StatusEffectType } from '../types/Combat.types';
import { Trait, TraitType } from '../types/Trait.types';
import dinosaursData from '../data/dinosaurs.json';
import enemiesData from '../data/enemies.json';
import traitsData from '../data/traits.json';
import { GameStateManager } from '../managers/GameStateManager';

interface Combatant {
  id?: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  stamina: number;
  maxStamina: number;
  emoji: string;
  statusEffects: StatusEffect[];
  abilityCooldown: number;
  traits: string[];
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

  init(data: { dinosaur: DinosaurType; enemy: string; nodeType?: NodeType; traits?: string[] }): void {
    this.playerDinosaur = data.dinosaur;
    this.enemyId = data.enemy || 'allosaurus';
    this.nodeType = data.nodeType || NodeType.COMBAT;
    
    // Initialize player from dinosaur data
    const dinoData = dinosaursData.find(d => d.id === this.playerDinosaur);
    if (dinoData) {
      this.player = {
        name: dinoData.name,
        hp: dinoData.baseStats.health,
        maxHp: dinoData.baseStats.health,
        attack: dinoData.baseStats.attack,
        defense: dinoData.baseStats.defense,
        speed: dinoData.baseStats.speed,
        stamina: dinoData.baseStats.stamina,
        maxStamina: dinoData.baseStats.stamina,
        emoji: this.getDinosaurEmoji(this.playerDinosaur),
        statusEffects: [],
        abilityCooldown: 0,
        traits: data.traits || []
      };
      
      // Apply passive traits
      this.applyPassiveTraits(this.player);
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
        id: enemyData.id,
        name: enemyData.name,
        hp: enemyData.stats.hp,
        maxHp: enemyData.stats.hp,
        attack: enemyData.stats.attack,
        defense: enemyData.stats.defense,
        speed: enemyData.stats.speed,
        stamina: 50, // Enemies have fixed stamina for now
        maxStamina: 50,
        emoji: enemyData.emoji,
        statusEffects: [],
        abilityCooldown: 0,
        traits: []
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
      this.player,
      true
    );
    
    // Enemy side (right)
    this.createCombatant(
      WIDTH - 250,
      HEIGHT / 2,
      this.enemy,
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
    this.addLog(`Combat begins! ${this.player.name} vs ${this.enemy.name}`);
    
    // Trigger Combat Start Traits
    this.checkTraitTrigger(this.player, TraitType.COMBAT_START);
    this.checkTraitTrigger(this.enemy, TraitType.COMBAT_START);
  }

  private createCombatant(
    x: number,
    y: number,
    combatant: Combatant,
    isPlayer: boolean
  ): void {
    // Sprite placeholder (emoji)
    this.add.text(x, y - 80, combatant.emoji, {
      fontSize: '120px'
    }).setOrigin(0.5);
    
    // Name
    this.add.text(x, y + 80, combatant.name.toUpperCase(), {
      fontSize: '24px',
      color: isPlayer ? '#4a9d5f' : '#d94a3d',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Status Effects Text
    this.add.text(x, y + 105, '', {
      fontSize: '14px',
      color: '#ffff00',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName(isPlayer ? 'playerStatusText' : 'enemyStatusText');
    
    // Health bar
    this.createHealthBar(x, y + 120, combatant.hp, combatant.maxHp, isPlayer);
    
    if (isPlayer) {
      // Stamina bar
      this.createStaminaBar(x, y + 150, combatant.stamina, combatant.maxStamina);
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
    
    // Attack button with stamina cost display
    this.createActionButton(startX, buttonY, '⚔ ATTACK', '10 STA', 'attack', () => this.playerAttack());
    
    // Defend button with effect display
    this.createActionButton(startX + buttonSpacing, buttonY, '🛡 DEFEND', '+15 STA', 'defend', () => this.playerDefend());
    
    // Ability button with stamina cost display
    this.createActionButton(startX + buttonSpacing * 2, buttonY, '✨ ABILITY', '30 STA', 'ability', () => this.playerAbility());
    
    // Flee button
    this.createActionButton(startX + buttonSpacing * 3, buttonY, '🏃 FLEE', '', 'flee', () => this.playerFlee());
    
    // Add keyboard shortcut hints below buttons
    this.addKeyboardHints(startX, buttonY + 50, buttonSpacing);
  }

  private createActionButton(
    x: number, 
    y: number, 
    text: string, 
    costText: string,
    actionType: string,
    callback: () => void
  ): void {
    const container = this.add.container(x, y);
    container.setName(`btn_${actionType}`);
    
    // Main button text
    const button = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#2a2a2a',
      padding: { x: SPACING.BUTTON_PADDING_X - 5, y: SPACING.BUTTON_PADDING_Y }
    }).setInteractive({ useHandCursor: true });
    
    // Cost indicator below button
    let costIndicator: Phaser.GameObjects.Text | null = null;
    if (costText) {
      costIndicator = this.add.text(
        button.width / 2 + SPACING.BUTTON_PADDING_X - 5, 
        button.height + SPACING.MD + 2, 
        costText, 
        {
          fontSize: '12px',
          color: '#888888',
          fontFamily: 'Courier New, monospace'
        }
      ).setOrigin(0.5);
    }
    
    container.add(button);
    if (costIndicator) container.add(costIndicator);
    
    // Hover effects with tooltip
    button.on('pointerover', () => {
      button.setColor('#ffffff');
      button.setBackgroundColor('#4a9d5f');
      this.showActionTooltip(x, y - 80, actionType);
    });
    
    button.on('pointerout', () => {
      button.setColor('#4a9d5f');
      button.setBackgroundColor('#2a2a2a');
      this.hideActionTooltip();
    });
    
    button.on('pointerdown', callback);
  }

  private addKeyboardHints(startX: number, y: number, spacing: number): void {
    const hints = ['[1]', '[2]', '[3]', '[4]'];
    hints.forEach((hint, index) => {
      this.add.text(startX + (spacing * index), y, hint, {
        fontSize: '12px',
        color: '#666666',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0, 0.5);
    });
  }

  private showActionTooltip(x: number, y: number, actionType: string): void {
    // Remove existing tooltip
    this.hideActionTooltip();
    
    const tooltips: Record<string, { title: string; desc: string; extra?: string }> = {
      attack: { 
        title: 'Basic Attack', 
        desc: 'Strike your enemy. Damage based on ATK vs DEF.',
        extra: 'Cost: 10 Stamina'
      },
      defend: { 
        title: 'Defend', 
        desc: 'Increase defense by 50% and recover stamina.',
        extra: 'Gain: +15 Stamina'
      },
      ability: { 
        title: 'Special Ability', 
        desc: 'Powerful attack that ignores 50% defense.',
        extra: 'Cost: 30 STA • 3 turn cooldown'
      },
      flee: { 
        title: 'Flee', 
        desc: 'Attempt to escape. Success based on Speed.',
        extra: '⚠ Failed flee allows free enemy attack'
      }
    };
    
    const tip = tooltips[actionType];
    if (!tip) return;
    
    const container = this.add.container(x, y);
    container.setName('actionTooltip');
    container.setDepth(100);
    
    // Background
    const bg = this.add.rectangle(0, 0, 220, 80, 0x1a1a1a, 0.95);
    bg.setStrokeStyle(2, 0x4a9d5f);
    
    // Title
    const title = this.add.text(-100, -30, tip.title, {
      fontSize: '16px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    });
    
    // Description
    const desc = this.add.text(-100, -8, tip.desc, {
      fontSize: '12px',
      color: '#cccccc',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: 200 }
    });
    
    // Extra info
    const extraText = tip.extra ? this.add.text(-100, 18, tip.extra, {
      fontSize: '11px',
      color: actionType === 'flee' ? '#e8a735' : '#4a8bd9',
      fontFamily: 'Courier New, monospace'
    }) : null;
    
    container.add([bg, title, desc]);
    if (extraText) container.add(extraText);
    
    // Fade in
    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 100,
      ease: 'Power2'
    });
  }

  private hideActionTooltip(): void {
    const tooltip = this.children.getByName('actionTooltip');
    if (tooltip) {
      tooltip.destroy();
    }
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

  private processStatusEffects(combatant: Combatant): void {
    const activeEffects: StatusEffect[] = [];
    
    for (const effect of combatant.statusEffects) {
      // Apply tick effects
      if (effect.type === StatusEffectType.BLEEDING || effect.type === StatusEffectType.POISONED) {
        const damage = effect.tickDamage || 5;
        combatant.hp = Math.max(0, combatant.hp - damage);
        this.addLog(`${combatant.name} takes ${damage} ${effect.name} damage!`);
      } else if (effect.type === StatusEffectType.STUNNED) {
        this.addLog(`${combatant.name} is stunned!`);
      }
      
      // Decrement duration
      effect.remainingDuration--;
      
      if (effect.remainingDuration > 0) {
        activeEffects.push(effect);
      } else {
        this.addLog(`${combatant.name}'s ${effect.name} wore off.`);
      }
    }
    
    combatant.statusEffects = activeEffects;
    this.updateCombatUI();
  }

  private applyStatusEffect(target: Combatant, type: StatusEffectType, duration: number): void {
    // Check if already has effect
    const existing = target.statusEffects.find(e => e.type === type);
    if (existing) {
      existing.remainingDuration = Math.max(existing.remainingDuration, duration);
      this.addLog(`${target.name}'s ${type} extended!`);
    } else {
      const effect: StatusEffect = {
        id: `${type}-${Date.now()}`,
        type: type,
        name: type.toUpperCase(),
        duration: duration,
        remainingDuration: duration,
        tickDamage: type === StatusEffectType.BLEEDING ? 5 : (type === StatusEffectType.POISONED ? 3 : 0)
      };
      target.statusEffects.push(effect);
      this.addLog(`${target.name} is now ${type}!`);
    }
    this.updateCombatUI();
  }

  private applyPassiveTraits(combatant: Combatant): void {
    for (const traitId of combatant.traits) {
      const trait = (traitsData as unknown as Trait[]).find(t => t.id === traitId);
      if (!trait || trait.type !== TraitType.PASSIVE_STAT) continue;
      
      for (const effect of trait.effects) {
        if ('stat' in effect && 'value' in effect && effect.stat && effect.value) {
          // Apply flat bonus
          (combatant as any)[effect.stat] += effect.value;
          
          // If max HP/Stamina increased, also increase current
          if (effect.stat === 'maxHp') combatant.hp += effect.value;
          if (effect.stat === 'maxStamina') combatant.stamina += effect.value;
        }
      }
    }
  }

  private checkTraitTrigger(combatant: Combatant, type: TraitType, context: any = {}): void {
    for (const traitId of combatant.traits) {
      const trait = (traitsData as unknown as Trait[]).find(t => t.id === traitId);
      if (!trait || trait.type !== type) continue;
      
      // Check conditions
      let conditionMet = true;
      // TODO: Implement complex conditions
      
      if (conditionMet) {
        this.applyTraitEffect(combatant, trait, context);
      }
    }
  }

  private applyTraitEffect(source: Combatant, trait: Trait, context: any): void {
    this.addLog(`${source.name}'s ${trait.name} triggered!`);
    
    for (const effect of trait.effects) {
      // Stat modification (temporary or permanent)
      if ('stat' in effect && 'value' in effect && effect.stat && effect.value) {
        if (effect.condition === 'first_turn' && this.turn === 1) {
           // Handled in specific logic or apply temporary buff
           // For simplicity, we might just modify the value in the calculation context
           if (context.modifiers) context.modifiers[effect.stat] = (context.modifiers[effect.stat] || 0) + effect.value;
        }
      }
      
      // Healing
      if ('stat' in effect && effect.stat === 'hp' && 'multiplier' in effect && effect.multiplier && context.damageDealt) {
        const healAmount = Math.floor(context.damageDealt * effect.multiplier);
        source.hp = Math.min(source.maxHp, source.hp + healAmount);
        this.addLog(`${source.name} healed for ${healAmount}!`);
      }
      
      // Status Effects
      if ('statusEffect' in effect && 'chance' in effect && effect.statusEffect && effect.chance) {
        if (Math.random() < effect.chance && context.target) {
          this.applyStatusEffect(context.target, effect.statusEffect as StatusEffectType, 3);
        }
      }
      
      // Reflect Damage
      if ('stat' in effect && effect.stat === 'hp' && 'value' in effect && effect.value && effect.value < 0 && effect.condition === 'attacker' && context.attacker) {
        const reflectDamage = Math.abs(effect.value);
        context.attacker.hp = Math.max(0, context.attacker.hp - reflectDamage);
        this.addLog(`${context.attacker.name} took ${reflectDamage} reflected damage!`);
      }
    }
    
    this.updateCombatUI();
  }

  private playerAttack(): void {
    const staminaCost = 10;
    if (this.player.stamina < staminaCost) {
      this.addLog('Not enough stamina!');
      return;
    }

    this.playAttackAnimation('player');
    
    // Calculate damage: Attack * (100 / (100 + Defense))
    const defense = this.enemyDefending ? this.enemy.defense * 1.5 : this.enemy.defense;
    const damageMultiplier = 100 / (100 + defense);
    
    // Apply trait modifiers
    let attackValue = this.player.attack;
    
    // Check for Ambush Predator (First Turn)
    if (this.turn === 1 && this.player.traits.includes('ambush_predator')) {
        attackValue += 10;
        this.addLog('Ambush Predator active!');
    }
    
    // Check for Adrenaline (Low HP)
    if (this.player.hp < this.player.maxHp * 0.3 && this.player.traits.includes('adrenaline')) {
        attackValue += 10;
        this.addLog('Adrenaline active!');
    }
    
    // Check for Apex Predator
    if ((this.nodeType === NodeType.ELITE || this.nodeType === NodeType.BOSS) && this.player.traits.includes('apex_predator')) {
        attackValue = Math.floor(attackValue * 1.2);
        this.addLog('Apex Predator active!');
    }

    const baseDamage = attackValue;
    const damage = Math.max(1, Math.floor(baseDamage * damageMultiplier * Phaser.Math.FloatBetween(0.9, 1.1)));
    
    this.enemy.hp = Math.max(0, this.enemy.hp - damage);
    this.player.stamina -= staminaCost;
    
    this.addLog(`You attack for ${damage} damage!`);
    this.playHitEffect('enemy');
    
    // Trigger On Hit Traits
    this.checkTraitTrigger(this.enemy, TraitType.ON_HIT, { attacker: this.player, damageTaken: damage });
    
    this.updateCombatUI();
    
    if (this.enemy.hp <= 0) {
      // Trigger On Kill Traits
      this.checkTraitTrigger(this.player, TraitType.ON_KILL);
      this.victory();
    } else {
      this.enemyTurn();
    }
  }

  private playerDefend(): void {
    this.playerDefending = true;
    this.addLog('You brace for impact! (Defense UP)');
    
    // Trigger On Defend Traits
    this.checkTraitTrigger(this.player, TraitType.ON_DEFEND);
    
    // Recover some stamina
    this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 15);
    this.updateCombatUI();
    this.enemyTurn();
  }

  private playerAbility(): void {
    if (this.player.abilityCooldown > 0) {
      this.addLog(`Ability on cooldown! (${this.player.abilityCooldown} turns)`);
      return;
    }

    const staminaCost = 30;
    if (this.player.stamina < staminaCost) {
      this.addLog('Not enough stamina!');
      return;
    }
    
    // Ability does 1.5x damage and ignores some defense
    const defense = this.enemyDefending ? this.enemy.defense * 1.5 : this.enemy.defense;
    const damageMultiplier = 100 / (100 + (defense * 0.5)); // Ignores 50% defense
    const baseDamage = this.player.attack * 1.5;
    const damage = Math.max(1, Math.floor(baseDamage * damageMultiplier));
    
    this.playAttackAnimation('player');
    
    this.enemy.hp = Math.max(0, this.enemy.hp - damage);
    this.player.stamina -= staminaCost;
    this.player.abilityCooldown = 3; // 3 turn cooldown
    
    this.addLog(`You use a special ability for ${damage} damage!`);
    this.playHitEffect('enemy');
    
    // Chance to apply Bleed
    if (Math.random() < 0.5) {
      this.applyStatusEffect(this.enemy, StatusEffectType.BLEEDING, 3);
    }
    
    this.updateCombatUI();
    
    if (this.enemy.hp <= 0) {
      this.victory();
    } else {
      this.enemyTurn();
    }
  }

  private playerFlee(): void {
    // Chance based on speed difference
    const speedDiff = this.player.speed - this.enemy.speed;
    const baseChance = 0.5;
    const fleeChance = Phaser.Math.Clamp(baseChance + (speedDiff * 0.05), 0.1, 0.9);
    
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

  private startPlayerTurn(): void {
    this.processStatusEffects(this.player);
    
    // Trigger Turn Start Traits
    this.checkTraitTrigger(this.player, TraitType.TURN_START);
    
    // Decrement cooldowns
    if (this.player.abilityCooldown > 0) {
      this.player.abilityCooldown--;
    }
    
    if (this.player.hp <= 0) {
      this.defeat();
      return;
    }
    
    const isStunned = this.player.statusEffects.some(e => e.type === StatusEffectType.STUNNED);
    if (isStunned) {
      this.addLog('You are stunned and cannot act!');
      this.time.delayedCall(1000, () => {
        this.enemyTurn();
      });
    } else {
      // Player can act
    }
  }

  private enemyTurn(): void {
    this.turn++;
    
    this.time.delayedCall(500, () => {
      // Process enemy status effects
      this.processStatusEffects(this.enemy);
      
      if (this.enemy.hp <= 0) {
        this.victory();
        return;
      }
      
      // Check for stun
      const isStunned = this.enemy.statusEffects.some(e => e.type === StatusEffectType.STUNNED);
      if (isStunned) {
        this.addLog(`${this.enemy.name} is stunned and cannot act!`);
        this.startPlayerTurn();
        return;
      }

      // Enemy logic: Attack or Defend (simple AI)
      let action = 'attack';
      
      // If low health, higher chance to defend
      if (this.enemy.hp < this.enemy.maxHp * 0.3 && Math.random() < 0.5) {
        action = 'defend';
      }
      // If player is stunned, always attack
      else if (this.player.statusEffects.some(e => e.type === StatusEffectType.STUNNED)) {
        action = 'attack';
      }
      // Random chance
      else if (Math.random() < 0.2) {
        action = 'defend';
      }
      
      if (action === 'defend') {
        this.enemyDefending = true;
        this.addLog(`${this.enemy.name} braces for impact!`);
      } else {
        this.enemyDefending = false;
        
        this.playAttackAnimation('enemy');
        
        // Calculate damage
        const defense = this.playerDefending ? this.player.defense * 1.5 : this.player.defense;
        const damageMultiplier = 100 / (100 + defense);
        const baseDamage = this.enemy.attack;
        const damage = Math.max(1, Math.floor(baseDamage * damageMultiplier * Phaser.Math.FloatBetween(0.9, 1.1)));
        
        this.player.hp = Math.max(0, this.player.hp - damage);
        this.addLog(`${this.enemy.name} attacks for ${damage} damage!`);
        this.playHitEffect('player');
      }
      
      // Reset player defending status for next turn
      this.playerDefending = false;
      
      this.updateCombatUI();
      
      if (this.player.hp <= 0) {
        this.defeat();
      } else {
        this.startPlayerTurn();
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
      const width = (this.player.hp / this.player.maxHp) * 200;
      playerHealthFill.setSize(width, 16);
      playerHealthFill.x = 250 - 200 / 2 + width / 2;
    }
    if (playerHealthText) {
      playerHealthText.setText(`${this.player.hp}/${this.player.maxHp}`);
    }
    
    if (enemyHealthFill) {
      const width = (this.enemy.hp / this.enemy.maxHp) * 200;
      enemyHealthFill.setSize(width, 16);
      enemyHealthFill.x = (GAME_CONFIG.WIDTH - 250) - 200 / 2 + width / 2;
    }
    if (enemyHealthText) {
      enemyHealthText.setText(`${this.enemy.hp}/${this.enemy.maxHp}`);
    }
    
    if (staminaFill) {
      const width = (this.player.stamina / this.player.maxStamina) * 200;
      staminaFill.setSize(width, 11);
      staminaFill.x = 250 - 200 / 2 + width / 2;
    }
    if (staminaText) {
      staminaText.setText(`STA: ${this.player.stamina}/${this.player.maxStamina}`);
    }
    
    // Update status effects display
    const playerStatusText = this.children.getByName('playerStatusText') as Phaser.GameObjects.Text;
    const enemyStatusText = this.children.getByName('enemyStatusText') as Phaser.GameObjects.Text;
    
    if (playerStatusText) {
      const effects = this.player.statusEffects.map(e => `${e.name}(${e.remainingDuration})`).join(' ');
      playerStatusText.setText(effects);
    }
    
    if (enemyStatusText) {
      const effects = this.enemy.statusEffects.map(e => `${e.name}(${e.remainingDuration})`).join(' ');
      enemyStatusText.setText(effects);
    }
  }

  private victory(): void {
    this.addLog('💀 Enemy defeated! VICTORY!');
    
    // Update GameStateManager with current health/stamina
    GameStateManager.getInstance().updatePlayerStats(this.player.hp, this.player.stamina);
    
    // Unlock Codex Entry
    if (this.enemy && this.enemy.id) {
      GameStateManager.getInstance().unlockCodexEntry(this.enemy.id);
    }

    // Calculate rewards
    const fossilsEarned = 5 + Math.floor(Math.random() * 10);
    const experienceGained = 10 + (this.nodeType === 'elite' ? 15 : 0) + (this.nodeType === 'boss' ? 30 : 0);
    
    // Add fossils to run
    GameStateManager.getInstance().updateResources(fossilsEarned);
    
    this.time.delayedCall(1500, () => {
      this.scene.start(SCENE_KEYS.REWARDS, {
        dinosaur: this.playerDinosaur,
        enemyName: this.enemy.name,
        fossilsEarned: fossilsEarned,
        experienceGained: experienceGained,
        combatTurns: this.turn
      });
    });
  }

  private defeat(): void {
    this.addLog('💀 You have been defeated...');
    
    // Get run stats before clearing
    const run = GameStateManager.getInstance().getCurrentRun();
    const depth = run?.depth || 0;
    const combatsWon = run?.combatsWon || 0;
    const fossilsCollected = run?.fossilsCollected || 0;
    const runDuration = run ? Date.now() - run.startTime : 0;
    
    // Clear current run
    GameStateManager.getInstance().clearCurrentRun();
    
    this.time.delayedCall(1500, () => {
      this.scene.start(SCENE_KEYS.GAME_OVER, {
        enemyName: this.enemy.name,
        depth: depth,
        combatsWon: combatsWon,
        fossilsCollected: fossilsCollected,
        turnsInCombat: this.turn,
        runDuration: runDuration
      });
    });
  }

  private playHitEffect(target: 'player' | 'enemy'): void {
    // Screen shake
    this.cameras.main.shake(200, 0.01);
    
    // Flash target
    const sprite = target === 'player' 
      ? this.children.getByName('playerSprite') as Phaser.GameObjects.Sprite
      : this.children.getByName('enemySprite') as Phaser.GameObjects.Sprite;
      
    if (sprite) {
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: 50,
        yoyo: true,
        repeat: 3
      });
      
      // Damage particles
      const particles = this.add.particles(sprite.x, sprite.y, 'pixel', {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        lifespan: 500,
        quantity: 10,
        tint: 0xff0000
      });
      
      this.time.delayedCall(500, () => particles.destroy());
    }
  }

  private playAttackAnimation(attacker: 'player' | 'enemy'): void {
    const sprite = attacker === 'player'
      ? this.children.getByName('playerSprite') as Phaser.GameObjects.Sprite
      : this.children.getByName('enemySprite') as Phaser.GameObjects.Sprite;
      
    if (sprite) {
      const originalX = sprite.x;
      const forwardX = attacker === 'player' ? originalX + 50 : originalX - 50;
      
      this.tweens.add({
        targets: sprite,
        x: forwardX,
        duration: 100,
        yoyo: true,
        ease: 'Power1'
      });
    }
  }
}
