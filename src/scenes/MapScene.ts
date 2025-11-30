import Phaser from 'phaser';
import { SCENE_KEYS, GAME_CONFIG } from '../utils/Constants';
import { DinosaurType } from '../types/Dinosaur.types';
import { NodeType, MapNode } from '../types/Encounter.types';

interface MapNodeUI extends MapNode {
  visual: Phaser.GameObjects.Container;
  visited: boolean;
  available: boolean;
}

export class MapScene extends Phaser.Scene {
  private selectedDinosaur!: DinosaurType;
  private currentDepth: number = 0;
  private currentColumn: number = 0;
  private nodes: MapNodeUI[][] = [];
  private playerHealth: number = 100;
  private playerMaxHealth: number = 100;
  private playerStamina: number = 70;
  private playerMaxStamina: number = 70;
  private fossils: number = 0;

  constructor() {
    super({ key: SCENE_KEYS.MAP });
  }

  init(data: { dinosaur: DinosaurType }): void {
    this.selectedDinosaur = data.dinosaur;
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
    
    // Generate and display map
    this.generateMap();
    
    // Back button
    this.createBackButton();
  }

  private createStatsPanel(): void {
    const x = GAME_CONFIG.WIDTH - 200;
    const y = 150;
    
    const panel = this.add.rectangle(x, y, 180, 400, 0x2a2a2a, 1);
    panel.setStrokeStyle(2, 0x4a9d5f);
    
    this.add.text(x, y - 180, 'STATUS', {
      fontSize: '20px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Dinosaur name
    const dinoName = this.selectedDinosaur.charAt(0).toUpperCase() + 
                      this.selectedDinosaur.slice(1);
    this.add.text(x, y - 150, dinoName, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
    
    // Stats (will be updated dynamically)
    const statsText = this.add.text(x - 70, y - 110,
      `HP: ${this.playerHealth}/${this.playerMaxHealth}\n` +
      `STA: ${this.playerStamina}/${this.playerMaxStamina}\n\n` +
      `Depth: ${this.currentColumn + 1}/5\n` +
      `Fossils: ${this.fossils}`,
      {
        fontSize: '14px',
        color: '#f0f0f0',
        fontFamily: 'Courier New, monospace',
        lineSpacing: 8
      }
    );
    statsText.setName('statsText');
    
    // Legend
    this.add.text(x, y + 50, 'MAP LEGEND', {
      fontSize: '16px',
      color: '#4a9d5f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const legendText = 
      '⚔ Combat\n' +
      '🌿 Resource\n' +
      '❓ Event\n' +
      '💀 Elite\n' +
      '🔥 Rest\n' +
      '👑 Boss';
    
    this.add.text(x - 70, y + 80, legendText, {
      fontSize: '12px',
      color: '#cccccc',
      fontFamily: 'Courier New, monospace',
      lineSpacing: 6
    });
  }

  private generateMap(): void {
    console.log('🗺 Generating map...');
    
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
        return { enemy: 'elite' };
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
    switch (type) {
      case NodeType.COMBAT: return '⚔';
      case NodeType.RESOURCE: return '🌿';
      case NodeType.EVENT: return '❓';
      case NodeType.ELITE: return '💀';
      case NodeType.REST: return '🔥';
      case NodeType.BOSS: return '👑';
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
    const tooltip = this.add.container(node.x, node.y - 60);
    tooltip.setName('tooltip');
    
    const bg = this.add.rectangle(0, 0, 120, 40, 0x1a1a1a, 0.9);
    bg.setStrokeStyle(2, this.getNodeColor(node.type));
    
    const text = this.add.text(0, 0, this.getNodeName(node.type), {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);
    
    tooltip.add([bg, text]);
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
    
    // Update current column
    const [col] = node.id.split('-').map(Number);
    this.currentColumn = col;
    
    // Make next column available
    if (col + 1 < this.nodes.length) {
      const nextColumn = this.nodes[col + 1];
      
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
    
    // Handle node type
    this.handleNodeEncounter(node);
  }
  
  private handleNodeEncounter(node: MapNodeUI): void {
    switch (node.type) {
      case NodeType.COMBAT:
      case NodeType.ELITE:
      case NodeType.BOSS:
        this.scene.start(SCENE_KEYS.COMBAT, {
          dinosaur: this.selectedDinosaur,
          enemy: node.data.enemy,
          nodeType: node.type
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
    
    this.showMessage(`Found ${fossilsGained} fossil fragments!`, '#5f9d4a');
    this.updateStatsPanel();
  }
  
  private handleEventNode(node: MapNodeUI): void {
    // Random event (simplified for now)
    const events = [
      { text: 'You find an ancient nest. Gain 10 fossils.', effect: () => this.fossils += 10 },
      { text: 'A sudden storm! Lose 5 HP.', effect: () => this.playerHealth = Math.max(1, this.playerHealth - 5) },
      { text: 'You discover medicinal plants. Heal 15 HP.', effect: () => {
        this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 15);
      }}
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
    const statsText = this.children.getByName('statsText') as Phaser.GameObjects.Text;
    if (statsText) {
      statsText.setText(
        `HP: ${this.playerHealth}/${this.playerMaxHealth}\n` +
        `STA: ${this.playerStamina}/${this.playerMaxStamina}\n\n` +
        `Depth: ${this.currentColumn + 1}/5\n` +
        `Fossils: ${this.fossils}`
      );
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
}
