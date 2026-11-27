import { expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

const CAPTURE_DIR =
  process.env.PS_CAPTURE_DIR || '/home/ilintner/lab/artifacts/primordial-swamp/t_9a1f6407';

export interface Clickable {
  scene: string;
  name: string;
  parentName: string;
  label: string;
  x: number;
  y: number;
}

export interface GameSnapshot {
  scenes: string[];
  clickables: Clickable[];
}

export interface CombatSnapshot {
  active: boolean;
  playerHp: number;
  playerStamina: number;
  enemyHp: number;
  turn: number;
}

/** Read-only view of the live Phaser game: active scenes and interactive objects. */
export async function gameSnapshot(page: Page): Promise<GameSnapshot> {
  return page.evaluate(() => {
    const game = (window as any).__psGame;
    if (!game) throw new Error('window.__psGame is not available');
    const active = game.scene.getScenes(true) as any[];
    const clickables: Clickable[] = [];

    const collect = (objects: any[], sceneKey: string, inheritedParentName: string): void => {
      for (const obj of objects) {
        if (!obj) continue;
        if (Array.isArray(obj.list) && obj.list.length) {
          collect(obj.list, sceneKey, obj.name || inheritedParentName);
        }
        if (!obj.input?.enabled || obj.visible === false) continue;
        if (typeof obj.getBounds !== 'function') continue;
        const alpha = obj.alpha * (obj.parentContainer?.alpha ?? 1);
        if (alpha < 0.9) continue; // skip disabled/fading-in controls
        const bounds = obj.getBounds();
        if (!bounds || bounds.width <= 0 || bounds.height <= 0) continue;

        let label = typeof obj.text === 'string' ? obj.text : '';
        if (!label && Array.isArray(obj.parentContainer?.list)) {
          const textChild = obj.parentContainer.list.find(
            (child: any) => typeof child?.text === 'string' && child.text.trim()
          );
          if (textChild) label = textChild.text;
        }

        clickables.push({
          scene: sceneKey,
          name: typeof obj.name === 'string' ? obj.name : '',
          parentName: obj.parentContainer?.name || inheritedParentName || '',
          label: label.replace(/\s+/g, ' ').trim(),
          x: bounds.centerX,
          y: bounds.centerY
        });
      }
    };

    for (const scene of active) collect(scene.children?.list ?? [], scene.scene.key, '');
    return { scenes: active.map((scene) => scene.scene.key), clickables };
  });
}

export async function waitForScene(page: Page, key: string, timeout = 15_000): Promise<void> {
  await expect
    .poll(async () => (await gameSnapshot(page)).scenes, {
      timeout,
      message: `expected scene ${key} to become active`
    })
    .toContain(key);
}

/** Compute a Phaser object's game-space centre and click it with the real mouse. */
export async function clickWhere(
  page: Page,
  description: string,
  predicate: (candidate: Clickable) => boolean
): Promise<Clickable> {
  const snapshot = await gameSnapshot(page);
  const target = snapshot.clickables.find(predicate);
  if (!target) {
    throw new Error(
      `No clickable ${description}. scenes=${snapshot.scenes.join(',')} ` +
        `clickables=${JSON.stringify(snapshot.clickables)}`
    );
  }

  const box = await page.locator('canvas').first().boundingBox();
  if (!box) throw new Error('Canvas bounding box unavailable');
  const x = box.x + (target.x / GAME_WIDTH) * box.width;
  const y = box.y + (target.y / GAME_HEIGHT) * box.height;

  await page.mouse.move(x, y);
  await page.waitForTimeout(100); // let pointerover/tweens settle
  await page.mouse.click(x, y);
  return target;
}

export async function combatSnapshot(page: Page): Promise<CombatSnapshot> {
  return page.evaluate(() => {
    const game = (window as any).__psGame;
    const scene = game.scene.getScene('CombatScene');
    if (!scene || !scene.scene.isActive()) {
      return { active: false, playerHp: 0, playerStamina: 0, enemyHp: 0, turn: 0 };
    }
    return {
      active: true,
      playerHp: scene.player?.hp ?? 0,
      playerStamina: scene.player?.stamina ?? 0,
      enemyHp: scene.enemy?.hp ?? 0,
      turn: scene.turn ?? 0
    };
  });
}

export async function capture(page: Page, filename: string): Promise<string> {
  mkdirSync(CAPTURE_DIR, { recursive: true });
  const path = `${CAPTURE_DIR}/${filename}`;
  await page.screenshot({ path });
  return path;
}
