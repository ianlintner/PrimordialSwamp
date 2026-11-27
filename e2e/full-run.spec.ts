import { expect, test, type Page } from '@playwright/test';
import { capture, clickWhere, gameSnapshot, waitForScene } from './helpers';

const SEED = 'ps-play-2';
const DEPTHS = [0, 1, 2, 3, 4]; // five map columns, column 4 is the boss

async function activeScenes(page: Page): Promise<string[]> {
  return (await gameSnapshot(page)).scenes;
}

/**
 * Resolve a combat in one real ATTACK click. The harness only lowers enemy HP
 * to 1 — every navigation click in this run goes through the real canvas.
 */
async function resolveCombat(page: Page): Promise<void> {
  if (!(await activeScenes(page)).includes('CombatScene')) return;

  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const scene = (window as any).__psGame.scene.getScene('CombatScene');
    if (!scene?.scene?.isActive()) throw new Error('CombatScene is not active');
    scene.enemy.hp = 1;
    scene.updateCombatUI();
  });

  await clickWhere(page, 'ATTACK', (candidate) =>
    candidate.scene === 'CombatScene' && candidate.parentName === 'btn_attack'
  );

  await expect
    .poll(async () => {
      const scenes = await activeScenes(page);
      return scenes.includes('RewardsScene') || scenes.includes('VictoryScene');
    }, {
      timeout: 15_000,
      message: 'combat should resolve to RewardsScene or VictoryScene',
    })
    .toBe(true);

  if ((await activeScenes(page)).includes('RewardsScene')) {
    await page.waitForTimeout(700);
    await clickWhere(page, 'CONTINUE EXPEDITION', (candidate) =>
      candidate.scene === 'RewardsScene' &&
      candidate.label.includes('CONTINUE EXPEDITION')
    );
  }
}

test('full run: five depths -> boss -> VictoryScene -> NEW RUN', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  await page.goto(`/?seed=${SEED}`);
  await waitForScene(page, 'MenuScene');
  await page.waitForTimeout(800);

  await clickWhere(page, 'START NEW RUN', (candidate) =>
    candidate.scene === 'MenuScene' && candidate.label.includes('START NEW RUN')
  );
  await waitForScene(page, 'CharacterSelectScene');
  await page.waitForTimeout(900);

  await clickWhere(page, 'a dinosaur card', (candidate) =>
    candidate.scene === 'CharacterSelectScene' &&
    !['BACK', 'START RUN'].includes(candidate.label)
  );
  await clickWhere(page, 'START RUN', (candidate) =>
    candidate.scene === 'CharacterSelectScene' && candidate.label === 'START RUN'
  );
  await waitForScene(page, 'MapScene');
  await page.waitForTimeout(700);

  for (const depth of DEPTHS) {
    await waitForScene(page, 'MapScene');
    await page.waitForTimeout(500);

    // Non-combat nodes stay on the map; combat nodes transition on click.
    await clickWhere(page, `available node in column ${depth}`, (candidate) =>
      candidate.scene === 'MapScene' &&
      candidate.parentName.startsWith(`${depth}-`)
    );
    await page.waitForTimeout(500);

    const scenes = await activeScenes(page);
    if (scenes.includes('VictoryScene')) break;
    if (!scenes.includes('CombatScene') && !scenes.includes('MapScene')) {
      throw new Error(`Unexpected scenes at depth ${depth}: ${scenes.join(',')}`);
    }

    await resolveCombat(page);
  }

  await waitForScene(page, 'VictoryScene', 30_000);
  await page.waitForTimeout(1100); // camera fade-in
  const victoryCapture = await capture(page, 'ps-play-victory-1280.png');
  console.log(`capture=${victoryCapture}`);

  const victoryText = await page.evaluate(() => {
    const scene = (window as any).__psGame.scene.getScene('VictoryScene');
    const objects = scene?.children?.list ?? [];
    return objects
      .filter((object: any) => typeof object.text === 'string')
      .map((object: any) => object.text)
      .join(' | ');
  });
  expect(victoryText).toContain('EXPEDITION COMPLETE');
  expect(victoryText).toContain('Combats Won');

  // NEW RUN must return to character select by a real click.
  await clickWhere(page, 'NEW RUN', (candidate) =>
    candidate.scene === 'VictoryScene' && candidate.label.includes('NEW RUN')
  );
  await waitForScene(page, 'CharacterSelectScene');

  const unexpectedErrors = pageErrors.filter(
    (error) => !error.includes('Unable to decode audio data')
  );
  expect(unexpectedErrors, `page errors: ${unexpectedErrors.join(' | ')}`).toEqual([]);
});
