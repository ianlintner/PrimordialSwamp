import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG, hexToColorString } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import { NodeType } from '../types/Encounter.types';
import { GameStateManager } from '../managers/GameStateManager';
import dinosaursData from '../data/dinosaurs.json';

interface MapNodeUI {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  connections: string[];
  data: any;
  visual: Phaser.GameObjects.Container;
  visited: boolean;
  available: boolean;
}

export class MapScene extends Phaser.Scene {
  private selectedDinosaur!: DinosaurType;
  private currentDepth: number = 0;
  private currentColumn: number = 0;
  private nodes: MapNodeUI[][] = [];
  
  // State is now managed by GameStateManager, but we keep local copies for display
  private playerHealth: number = 100;
  private playerMaxHealth: number = 100;
  private playerStamina: number = 70;
  private playerMaxStamina: number = 70;
  private fossils: number = 0;
  private playerTraits: string[] = [];

  constructor() {
    super({ key: SCENE_KEYS.MAP });
  }

  init(data: { dinosaur: DinosaurType }): void {
    // If passed from char select, we might use it, but prefer GameState
    const run = GameStateManager.getInstance().getCurrentRun();
    if (run) {
      this.selectedDinosaur = run.dinosaur;
      this.playerHealth = run.health;
      this.playerStamina = run.stamina;
      this.fossils = run.fossilsCollected;
      this.playerTraits = run.traits;
      
      // Load max stats from dino data
      const dinoData = dinosaursData.find(d => d.id === this.selectedDinosaur);
      if (dinoData) {
        this.playerMaxHealth = dinoData.baseStats.health;
        this.playerMaxStamina = dinoData.baseStats.stamina;
      } else {
        this.playerMaxHealth = 100;
        this.playerMaxStamina = 70;
      }
    } else if (data.dinosaur) {
      // Fallback if starting fresh (should have been created in CharSelect)
      this.selectedDinosaur = data.dinosaur;
    } else {
      // Error state, go back to menu
      this.scene.start(SCENE_KEYS.MENU);
    }
  }

  create(): void {
    const { WIDTH, HEIGHT, COLORS } = GAME_CONFIG;
    
    // Background
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, COLORS.BACKGROUND);
    
    // Header
    this.add.text(WIDTH / 2, 40, 'PRIMORDIAL SWAMP - EXPEDITION', {
      fontSize: '36px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Stats panel
    this.createStatsPanel();
    
    // Load or Generate map
    const run = GameStateManager.getInstance().getCurrentRun();
    if (run && run.mapNodes && run.mapNodes.length > 0) {
      this.loadMap(run.mapNodes);
    } else {
      this.generateMap();
    }
    
    // Back button
    this.createBackButton();
  }

  private createStatsPanel(): void {
    const x = GAME_CONFIG.WIDTH - 200;
    const y = 150;
    
    // Panel shadow
    this.add.rectangle(x + 4, y + 4, 180, 420, 0x000000, 0.3);
    
    const panel = this.add.rectangle(x, y, 180, 420, 0x1a1a1a, 1);
    panel.setStrokeStyle(2, 0x4a9d5f);
    
    // STATUS header
    const headerBg = this.add.rectangle(x, y - 190, 170, 28, 0x4a9d5f, 0.2);
    headerBg.setStrokeStyle(1, 0x4a9d5f, 0.5);
    this.add.text(x, y - 190, 'STATUS', {
      fontSize: '16px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Dinosaur name
    const dinoName = this.selectedDinosaur.charAt(0).toUpperCase() + 
                      this.selectedDinosaur.slice(1);
    this.add.text(x, y - 160, dinoName, {
      fontSize: '15px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
    
    // Health bar visual
    const hpBarY = y - 125;
    this.createMiniHealthBar(x, hpBarY, this.playerHealth, this.playerMaxHealth, 'HP');
    
    // Stamina bar visual  
    const staBarY = y - 85;
    this.createMiniStaminaBar(x, staBarY, this.playerStamina, this.playerMaxStamina, 'STA');
    
    // Depth progress with visual indicator
    const depthY = y - 40;
    this.add.text(x - 70, depthY, 'PROGRESS', {
      fontSize: '11px',
      color: hexToColorString(GAME_CONFIG.COLORS.TEXT_MUTED),
      fontFamily: 'Courier New, monospace'
    });
    
    // Depth progress bar
    const depthBarWidth = 140;
    const depthProgress = (this.currentColumn + 1) / 5;
    this.add.rectangle(x, depthY + 20, depthBarWidth, 8, 0x2a2a2a)
      .setStrokeStyle(1, 0x4a9d5f);
    this.add.rectangle(
      x - depthBarWidth/2 + (depthProgress * depthBarWidth)/2,
      depthY + 20,
      depthProgress * depthBarWidth,
      6,
      0x4a9d5f
    ).setName('depthFill');
    
    this.add.text(x, depthY + 35, `Depth ${this.currentColumn + 1}/5`, {
      fontSize: '13px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('depthText');
    
    // Fossils collected
    const fossilBg = this.add.rectangle(x, depthY + 60, 100, 22, 0xffd43b, 0.1);
    fossilBg.setStrokeStyle(1, 0xffd43b, 0.3);
    this.add.text(x, depthY + 60, `${this.fossils} Fossils`, {
      fontSize: '13px',
      color: '#ffd43b',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('fossilText');
    
    // Legend header
    const legendHeaderBg = this.add.rectangle(x, y + 60, 170, 22, 0x4a9d5f, 0.1);
    this.add.text(x, y + 60, 'MAP LEGEND', {
      fontSize: '13px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Legend with colored dots instead of emojis
    const legendItems = [
      { color: 0x4a9d5f, label: 'Combat' },
      { color: 0x5f9d4a, label: 'Resource' },
      { color: 0x9d7a4a, label: 'Event' },
      { color: 0x9d4a4a, label: 'Elite' },
      { color: 0x4a7a9d, label: 'Rest' },
      { color: 0x9d4a9d, label: 'Boss' }
    ];
    
    legendItems.forEach((item, index) => {
      const itemY = y + 85 + (index * 20);
      // Colored dot
      this.add.circle(x - 65, itemY, 5, item.color);
      // Label
      this.add.text(x - 55, itemY, item.label, {
        fontSize: '11px',
        color: `#${item.color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0, 0.5);
    });
    
    // Next action hint at bottom
    this.add.text(x, y + 200, 'Click a node\nto continue', {
      fontSize: '10px',
      color: hexToColorString(GAME_CONFIG.COLORS.TEXT_DISABLED),
      fontFamily: 'Courier New, monospace',
      align: 'center'
    }).setOrigin(0.5);
  }

  private createMiniHealthBar(x: number, y: number, current: number, max: number, label: string): void {
    const barWidth = 140;
    const barHeight = 16;
    const percentage = current / max;
    
    // Label
    this.add.text(x - 70, y - 10, label, {
      fontSize: '12px',
      color: '#888888',
      fontFamily: 'Courier New, monospace'
    });
    
    // Background
    this.add.rectangle(x, y + 8, barWidth, barHeight, 0x2a2a2a)
      .setStrokeStyle(1, 0x4a9d5f);
    
    // Fill - color based on health level
    let fillColor = 0x4a9d5f; // Green
    if (percentage < 0.3) fillColor = 0xd94a3d; // Red when low
    else if (percentage < 0.6) fillColor = 0xe8a735; // Yellow when medium
    
    this.add.rectangle(
      x - barWidth/2 + (percentage * barWidth)/2,
      y + 8,
      percentage * barWidth,
      barHeight - 2,
      fillColor
    ).setName('hpFill');
    
    // Value text
    this.add.text(x, y + 8, `${current}/${max}`, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('hpText');
  }

  private createMiniStaminaBar(x: number, y: number, current: number, max: number, label: string): void {
    const barWidth = 140;
    const barHeight = 14;
    const percentage = current / max;
    
    // Label
    this.add.text(x - 70, y - 10, label, {
      fontSize: '12px',
      color: '#888888',
      fontFamily: 'Courier New, monospace'
    });
    
    // Background
    this.add.rectangle(x, y + 7, barWidth, barHeight, 0x2a2a2a)
      .setStrokeStyle(1, 0x4a8bd9);
    
    // Fill
    this.add.rectangle(
      x - barWidth/2 + (percentage * barWidth)/2,
      y + 7,
      percentage * barWidth,
      barHeight - 2,
      0x4a8bd9
    ).setName('staFill');
    
    // Value text
    this.add.text(x, y + 7, `${current}/${max}`, {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5).setName('staText');
  }

  private getDinosaurEmoji(id: string): string {
    const emojiMap: Record<string, string> = {
      deinonychus: '🦖',
      ankylosaurus: '🦕',
      pteranodon: '🦅',
      tyrannosaurus: '👑🦖'
    };
    return emojiMap[id] || '🦴';
  }

  private generateMap(): void {
    
    const COLUMNS = 5; // 5 depths (columns)
    const NODES_PER_COLUMN = [1, 3, 3, 3, 1]; // Start->Middle->Boss
    const mapStartX = 100;
    const mapStartY = 120;
    const columnSpacing = 180;
    const nodeSpacing = 100;
    
    // Generate node structure
    for (let col = 0; col < COLUMNS; col++) {
      this.nodes[col] = [];
      const nodesInColumn = NODES_PER_COLUMN[col];
      const columnX = mapStartX + (col * columnSpacing);
      
      for (let row = 0; row < nodesInColumn; row++) {
        const columnY = mapStartY + (row * nodeSpacing) + 
                        ((3 - nodesInColumn) * nodeSpacing / 2); // Center vertically
        
        const nodeType = this.determineNodeType(col, row, nodesInColumn);
        
        const node: MapNodeUI = {
          id: `${col}-${row}`,
          type: nodeType,
          x: columnX,
          y: columnY,
          connections: [],
          data: this.getNodeData(nodeType),
          visual: this.add.container(0, 0),
          visited: false,
          available: col === 0 // Only first column is available initially
        };
        
        // Create visual representation
        this.createNodeVisual(node);
        
        this.nodes[col].push(node);
      }
    }
    
    // Create connections between nodes
    this.createConnections();
    
    // Draw all connection lines
    this.drawConnections();
    
    // Save the generated map to GameStateManager
    const serializableNodes = this.nodes.map(col => 
      col.map(node => {
        // Create a copy without the visual property which can't be serialized
        const { visual, ...serializableNode } = node;
        return serializableNode;
      })
    );
    GameStateManager.getInstance().setMapNodes(serializableNodes);
    
    console.log('🗺 Map generated with', COLUMNS, 'columns');
  }
  
  private determineNodeType(col: number, row: number, nodesInColumn: number): NodeType {
    // First node is always combat
    if (col === 0) return NodeType.COMBAT;
    
    // Last node is always boss
    if (col === 4) return NodeType.BOSS;
    
    // Elite enemies in later columns
    if (col >= 2 && Math.random() < 0.2) return NodeType.ELITE;
    
    // Distribute other types
    const rand = Math.random();
    if (rand < 0.5) return NodeType.COMBAT;
    if (rand < 0.7) return NodeType.RESOURCE;
    if (rand < 0.85) return NodeType.EVENT;
    return NodeType.REST;
  }
  
  private getNodeData(type: NodeType): any {
    switch (type) {
      case NodeType.COMBAT:
        return { enemy: 'random' };
      case NodeType.ELITE:
        return { enemy: 'random' }; // CombatScene uses nodeType to determine tier
      case NodeType.BOSS:
        return { enemy: 'boss' };
      case NodeType.RESOURCE:
        return { resourceType: 'fossil' };
      case NodeType.EVENT:
        return { eventId: 'random' };
      case NodeType.REST:
        return { healAmount: 30 };
      default:
        return {};
    }
  }
  
  private createNodeVisual(node: MapNodeUI): void {
    const container = node.visual;
    container.setPosition(node.x, node.y);
    
    // Node circle background
    const circle = this.add.circle(0, 0, 25, 0x2a2a2a, 1);
    circle.setStrokeStyle(3, this.getNodeColor(node.type));
    
    // Node icon
    const icon = this.add.text(0, 0, this.getNodeIcon(node.type), {
      fontSize: '24px'
    }).setOrigin(0.5);
    
    container.add([circle, icon]);
    container.setName(node.id);
    
    // Make interactive if available
    if (node.available) {
      circle.setInteractive({ useHandCursor: true });
      
      circle.on('pointerover', () => {
        circle.setFillStyle(0x3a3a3a);
        circle.setScale(1.1);
        this.showNodeTooltip(node);
      });
      
      circle.on('pointerout', () => {
        circle.setFillStyle(0x2a2a2a);
        circle.setScale(1.0);
        this.hideNodeTooltip();
      });
      
      circle.on('pointerdown', () => {
        this.selectNode(node);
      });
    } else if (!node.visited) {
      container.setAlpha(0.5);
    }
  }
  
  private getNodeIcon(type: NodeType): string {
    // Use simple text symbols instead of emojis
    switch (type) {
      case NodeType.COMBAT: return 'X';
      case NodeType.RESOURCE: return 'R';
      case NodeType.EVENT: return '?';
      case NodeType.ELITE: return '!';
      case NodeType.REST: return 'Z';
      case NodeType.BOSS: return 'B';
      default: return '?';
    }
  }
  
  private getNodeColor(type: NodeType): number {
    switch (type) {
      case NodeType.COMBAT: return 0x4a9d5f;
      case NodeType.RESOURCE: return 0x5f9d4a;
      case NodeType.EVENT: return 0x9d7a4a;
      case NodeType.ELITE: return 0x9d4a4a;
      case NodeType.REST: return 0x4a7a9d;
      case NodeType.BOSS: return 0x9d4a9d;
      default: return 0x666666;
    }
  }
  
  private createConnections(): void {
    for (let col = 0; col < this.nodes.length - 1; col++) {
      const currentColumn = this.nodes[col];
      const nextColumn = this.nodes[col + 1];
      
      for (const node of currentColumn) {
        // Connect to 1-2 nodes in next column
        const connectionsCount = nextColumn.length === 1 ? 1 : 
                                 Math.min(2, nextColumn.length);
        
        // Get random connections
        const shuffled = [...nextColumn].sort(() => Math.random() - 0.5);
        const connected = shuffled.slice(0, connectionsCount);
        
        for (const targetNode of connected) {
          node.connections.push(targetNode.id);
        }
      }
    }
  }
  
  private drawConnections(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x4a9d5f, 0.5);
    
    for (const column of this.nodes) {
      for (const node of column) {
        for (const connectionId of node.connections) {
          const [col, row] = connectionId.split('-').map(Number);
          const targetNode = this.nodes[col][row];
          
          graphics.lineBetween(
            node.x, node.y,
            targetNode.x, targetNode.y
          );
        }
      }
    }
    
    graphics.setDepth(-1); // Put lines behind nodes
  }
  
  private showNodeTooltip(node: MapNodeUI): void {
    // Remove existing tooltip
    this.hideNodeTooltip();
    
    const tooltipInfo = this.getNodeTooltipInfo(node.type);
    const tooltip = this.add.container(node.x, node.y - 70);
    tooltip.setName('tooltip');
    tooltip.setDepth(50);
    
    // Calculate tooltip size
    const padding = 12;
    const width = 200;
    const hasWarning = !!tooltipInfo.warning;
    const height = hasWarning ? 90 : 70;
    
    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a1a, 0.95);
    bg.setStrokeStyle(2, this.getNodeColor(node.type));
    
    // Title
    const title = this.add.text(0, -height/2 + padding + 8, tooltipInfo.title, {
      fontSize: '16px',
      color: '#' + this.getNodeColor(node.type).toString(16).padStart(6, '0'),
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Description
    const desc = this.add.text(0, 5, tooltipInfo.description, {
      fontSize: '12px',
      color: '#cccccc',
      fontFamily: 'Courier New, monospace',
      wordWrap: { width: width - padding * 2 },
      align: 'center'
    }).setOrigin(0.5);
    
    tooltip.add([bg, title, desc]);
    
    // Warning for elite/boss nodes
    if (tooltipInfo.warning) {
      const warning = this.add.text(0, height/2 - padding - 8, `⚠ ${tooltipInfo.warning}`, {
        fontSize: '11px',
        color: '#e8a735',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      tooltip.add(warning);
    }
    
    // Constrain tooltip to screen
    if (tooltip.x - width/2 < 10) tooltip.x = width/2 + 10;
    if (tooltip.x + width/2 > GAME_CONFIG.WIDTH - 10) tooltip.x = GAME_CONFIG.WIDTH - width/2 - 10;
    if (tooltip.y - height/2 < 10) tooltip.y = node.y + 70; // Show below instead
    
    // Fade in
    tooltip.setAlpha(0);
    this.tweens.add({
      targets: tooltip,
      alpha: 1,
      duration: 100,
      ease: 'Power2'
    });
  }
  
  private getNodeTooltipInfo(type: NodeType): { title: string; description: string; warning?: string } {
    switch (type) {
      case NodeType.COMBAT:
        return {
          title: 'Combat Encounter',
          description: 'Face a dinosaur in battle to earn fossils.'
        };
      case NodeType.RESOURCE:
        return {
          title: 'Resource Site',
          description: 'Gather fossil fragments and supplies.'
        };
      case NodeType.EVENT:
        return {
          title: 'Random Event',
          description: 'Unpredictable outcomes await...'
        };
      case NodeType.ELITE:
        return {
          title: 'Elite Enemy',
          description: 'A powerful foe with greater rewards.',
          warning: 'Dangerous!'
        };
      case NodeType.REST:
        return {
          title: 'Rest Site',
          description: 'Recover HP and restore stamina.'
        };
      case NodeType.BOSS:
        return {
          title: 'Boss Encounter',
          description: 'Defeat to advance to the next biome.',
          warning: 'Point of no return'
        };
      default:
        return {
          title: 'Unknown',
          description: 'Mysterious location.'
        };
    }
  }
  
  private hideNodeTooltip(): void {
    const tooltip = this.children.getByName('tooltip');
    if (tooltip) {
      tooltip.destroy();
    }
  }
  
  private getNodeName(type: NodeType): string {
    switch (type) {
      case NodeType.COMBAT: return 'Combat';
      case NodeType.RESOURCE: return 'Resource';
      case NodeType.EVENT: return 'Event';
      case NodeType.ELITE: return 'Elite Enemy';
      case NodeType.REST: return 'Rest Site';
      case NodeType.BOSS: return 'Boss Fight';
      default: return 'Unknown';
    }
  }
  
  private selectNode(node: MapNodeUI): void {
    console.log('🎯 Selected node:', node.id, node.type);
    
    // Mark as visited
    node.visited = true;
    node.available = false;
    
    // Disable interaction on the current node
    const currentCircle = node.visual.getAt(0) as Phaser.GameObjects.Arc;
    currentCircle.disableInteractive();
    currentCircle.setFillStyle(0x1a1a1a); // Darken visited node
    
    // Update GameStateManager
    GameStateManager.getInstance().visitNode(node.id);
    
    // Update current column
    const [col] = node.id.split('-').map(Number);
    this.currentColumn = col;
    
    // Make next column available
    if (col + 1 < this.nodes.length) {
      // Only make connected nodes available
      for (const connectionId of node.connections) {
        const [nextCol, nextRow] = connectionId.split('-').map(Number);
        const nextNode = this.nodes[nextCol][nextRow];
        nextNode.available = true;
        nextNode.visual.setAlpha(1);
        
        // Make interactive
        const circle = nextNode.visual.getAt(0) as Phaser.GameObjects.Arc;
        circle.setInteractive({ useHandCursor: true });
        
        circle.on('pointerover', () => {
          circle.setFillStyle(0x3a3a3a);
          circle.setScale(1.1);
          this.showNodeTooltip(nextNode);
        });
        
        circle.on('pointerout', () => {
          circle.setFillStyle(0x2a2a2a);
          circle.setScale(1.0);
          this.hideNodeTooltip();
        });
        
        circle.on('pointerdown', () => {
          this.selectNode(nextNode);
        });
      }
    }
    
    // Save updated map state to GameStateManager
    this.saveMapState();
    
    // Handle node type
    this.handleNodeEncounter(node);
  }
  
  private saveMapState(): void {
    // Serialize and save current node states
    const serializableNodes = this.nodes.map(col => 
      col.map(node => {
        const { visual, ...serializableNode } = node;
        return serializableNode;
      })
    );
    GameStateManager.getInstance().setMapNodes(serializableNodes);
  }
  
  private handleNodeEncounter(node: MapNodeUI): void {
    switch (node.type) {
      case NodeType.COMBAT:
      case NodeType.ELITE:
      case NodeType.BOSS:
        this.scene.start(SCENE_KEYS.COMBAT, {
          dinosaur: this.selectedDinosaur,
          enemy: node.data.enemy,
          nodeType: node.type,
          traits: this.playerTraits
        });
        break;
        
      case NodeType.RESOURCE:
        this.handleResourceNode(node);
        break;
        
      case NodeType.EVENT:
        this.handleEventNode(node);
        break;
        
      case NodeType.REST:
        this.handleRestNode(node);
        break;
    }
  }
  
  private handleResourceNode(node: MapNodeUI): void {
    // Grant resources
    const fossilsGained = 5 + Math.floor(Math.random() * 5);
    this.fossils += fossilsGained;
    
    // Update GameStateManager
    GameStateManager.getInstance().updateResources(fossilsGained);
    
    this.showMessage(`Found ${fossilsGained} fossil fragments!`, '#5f9d4a');
    this.updateStatsPanel();
  }
  
  private handleEventNode(node: MapNodeUI): void {
    // Random event (simplified for now)
    const events = [
      { 
        text: 'You find an ancient nest. Gain 10 fossils.', 
        effect: () => {
          this.fossils += 10;
          GameStateManager.getInstance().updateResources(10);
        } 
      },
      { 
        text: 'A sudden storm! Lose 5 HP.', 
        effect: () => {
          this.playerHealth = Math.max(1, this.playerHealth - 5);
          GameStateManager.getInstance().updatePlayerStats(this.playerHealth, this.playerStamina);
        } 
      },
      { 
        text: 'You discover medicinal plants. Heal 15 HP.', 
        effect: () => {
          this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 15);
          GameStateManager.getInstance().updatePlayerStats(this.playerHealth, this.playerStamina);
        }
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    
    this.showMessage(event.text, '#9d7a4a');
    this.updateStatsPanel();
  }
  
  private handleRestNode(node: MapNodeUI): void {
    const healAmount = 30;
    this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + healAmount);
    this.playerStamina = this.playerMaxStamina;
    
    // Update GameStateManager
    GameStateManager.getInstance().updatePlayerStats(this.playerHealth, this.playerStamina);
    
    this.showMessage(`Rested and recovered ${healAmount} HP!`, '#4a7a9d');
    this.updateStatsPanel();
  }
  
  private showMessage(text: string, color: string): void {
    const message = this.add.text(GAME_CONFIG.WIDTH / 2, 80, text, {
      fontSize: '18px',
      color: color,
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#1a1a1a',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: message,
      alpha: 0,
      y: 40,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => message.destroy()
    });
  }
  
  private updateStatsPanel(): void {
    const x = GAME_CONFIG.WIDTH - 200;
    const barWidth = 140;
    
    // Update HP bar
    const hpFill = this.children.getByName('hpFill') as Phaser.GameObjects.Rectangle;
    const hpText = this.children.getByName('hpText') as Phaser.GameObjects.Text;
    if (hpFill && hpText) {
      const hpPercent = this.playerHealth / this.playerMaxHealth;
      const newWidth = hpPercent * barWidth;
      hpFill.setSize(newWidth, 14);
      hpFill.x = x - barWidth/2 + newWidth/2;
      
      // Change color based on HP level
      if (hpPercent < 0.3) hpFill.setFillStyle(0xd94a3d);
      else if (hpPercent < 0.6) hpFill.setFillStyle(0xe8a735);
      else hpFill.setFillStyle(0x4a9d5f);
      
      hpText.setText(`${this.playerHealth}/${this.playerMaxHealth}`);
    }
    
    // Update Stamina bar
    const staFill = this.children.getByName('staFill') as Phaser.GameObjects.Rectangle;
    const staText = this.children.getByName('staText') as Phaser.GameObjects.Text;
    if (staFill && staText) {
      const staPercent = this.playerStamina / this.playerMaxStamina;
      const newWidth = staPercent * barWidth;
      staFill.setSize(newWidth, 12);
      staFill.x = x - barWidth/2 + newWidth/2;
      staText.setText(`${this.playerStamina}/${this.playerMaxStamina}`);
    }
    
    // Update depth
    const depthFill = this.children.getByName('depthFill') as Phaser.GameObjects.Rectangle;
    const depthText = this.children.getByName('depthText') as Phaser.GameObjects.Text;
    if (depthFill && depthText) {
      const depthPercent = (this.currentColumn + 1) / 5;
      const newWidth = depthPercent * barWidth;
      depthFill.setSize(newWidth, 6);
      depthFill.x = x - barWidth/2 + newWidth/2;
      depthText.setText(`Depth ${this.currentColumn + 1}/5`);
    }
    
    // Update fossils
    const fossilText = this.children.getByName('fossilText') as Phaser.GameObjects.Text;
    if (fossilText) {
      fossilText.setText(`${this.fossils} Fossils`);
    }
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

  private loadMap(savedNodes: any[][]): void {
    console.log('🗺 Loading map from save...');
    
    this.nodes = [];
    
    for (let col = 0; col < savedNodes.length; col++) {
      this.nodes[col] = [];
      for (let row = 0; row < savedNodes[col].length; row++) {
        const savedNode = savedNodes[col][row];
        
        const node: MapNodeUI = {
          ...savedNode,
          visual: this.add.container(0, 0) // Recreate container
        };
        
        this.nodes[col].push(node);
      }
    }
    
    // Now create visuals with proper interactivity
    for (const column of this.nodes) {
      for (const node of column) {
        this.createNodeVisualWithState(node);
      }
    }
    
    this.drawConnections();
    
    // Restore current column based on visited nodes
    const run = GameStateManager.getInstance().getCurrentRun();
    if (run && run.currentNodeId) {
        const [col] = run.currentNodeId.split('-').map(Number);
        this.currentColumn = col;
    }
  }
  
  private createNodeVisualWithState(node: MapNodeUI): void {
    const container = node.visual;
    container.setPosition(node.x, node.y);
    
    // Node circle background
    const circle = this.add.circle(0, 0, 25, node.visited ? 0x1a1a1a : 0x2a2a2a, 1);
    circle.setStrokeStyle(3, this.getNodeColor(node.type));
    
    // Node icon
    const icon = this.add.text(0, 0, this.getNodeIcon(node.type), {
      fontSize: '24px'
    }).setOrigin(0.5);
    
    container.add([circle, icon]);
    container.setName(node.id);
    
    // Set alpha based on availability
    if (node.visited) {
      container.setAlpha(0.6);
    } else if (!node.available) {
      container.setAlpha(0.5);
    }
    
    // Make interactive if available and not visited
    if (node.available && !node.visited) {
      circle.setInteractive({ useHandCursor: true });
      
      circle.on('pointerover', () => {
        circle.setFillStyle(0x3a3a3a);
        circle.setScale(1.1);
        this.showNodeTooltip(node);
      });
      
      circle.on('pointerout', () => {
        circle.setFillStyle(0x2a2a2a);
        circle.setScale(1.0);
        this.hideNodeTooltip();
      });
      
      circle.on('pointerdown', () => {
        this.selectNode(node);
      });
    }
  }
}
