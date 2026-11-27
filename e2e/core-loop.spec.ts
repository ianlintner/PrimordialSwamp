import { expect, test } from '@playwright/test';
import {
  capture,
  clickWhere,
  combatSnapshot,
  gameSnapshot,
  waitForScene
} from './helpers';

const SEED = 'ps-play-1';

test('core loop: menu -> select -> map -> combat -> resolution -> map/select', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  await page.goto(`/?seed=${SEED}`);
  await waitForScene(page, 'MenuScene');
  await page.waitForTimeout(800); // button entrance tween

  // 1. Menu: real click on START NEW RUN.
  await clickWhere(page, 'START NEW RUN', (c) =>
    c.scene === 'MenuScene' && c.label.includes('START NEW RUN')
  );
  await waitForScene(page, 'CharacterSelectScene');
  await page.waitForTimeout(900); // card entrance tweens

  // 2. Select: real click on a dinosaur card, then START RUN.
  await clickWhere(page, 'a dinosaur card', (c) =>
    c.scene === 'CharacterSelectScene' && !['BACK', 'START RUN'].includes(c.label)
  );
  await clickWhere(page, 'START RUN', (c) =>
    c.scene === 'CharacterSelectScene' && c.label === 'START RUN'
  );

  // 3. Map reached by clicking START RUN.
  await waitForScene(page, 'MapScene');
  await page.waitForTimeout(700);
  const capturePath = await capture(page, 'ps-play-1-map-after-start-1280.png');
  console.log(`capture=${capturePath}`);

  // 4. First available combat node.
  await clickWhere(page, 'first available map node', (c) =>
    c.scene === 'MapScene' && /^0-/.test(c.parentName)
  );
  await waitForScene(page, 'CombatScene');
  await page.waitForTimeout(500);

  // 5. Click ATTACK/DEFEND until the fight resolves.
  let outcome: 'RewardsScene' | 'GameOverScene' | null = null;
  for (let action = 0; action < 80; action++) {
    const scenes = (await gameSnapshot(page)).scenes;
    if (scenes.includes('RewardsScene')) {
      outcome = 'RewardsScene';
      break;
    }
    if (scenes.includes('GameOverScene')) {
      outcome = 'GameOverScene';
      break;
    }
    if (!scenes.includes('CombatScene')) {
      throw new Error(`Unexpected scenes during combat: ${scenes.join(',')}`);
    }

    const combat = await combatSnapshot(page);
    if (!combat.active) throw new Error('CombatScene active but combatSnapshot is inactive');
    await clickWhere(page, 'combat action', (c) =>
      c.scene === 'CombatScene' &&
      c.parentName === (combat.playerStamina >= 10 ? 'btn_attack' : 'btn_defend')
    );
    await page.waitForTimeout(900); // action tween + 500ms enemy turn
  }

  expect(outcome, 'combat should resolve within 80 actions').not.toBeNull();

  // 6. Resolution branch: both paths must return to a playable screen.
  if (outcome === 'RewardsScene') {
    await page.waitForTimeout(700);
    await clickWhere(page, 'CONTINUE EXPEDITION', (c) =>
      c.scene === 'RewardsScene' && c.label.includes('CONTINUE EXPEDITION')
    );
    await waitForScene(page, 'MapScene');
  } else {
    await page.waitForTimeout(1100); // GameOver camera fade-in
    await clickWhere(page, 'TRY AGAIN', (c) =>
      c.scene === 'GameOverScene' && c.label.includes('TRY AGAIN')
    );
    await waitForScene(page, 'CharacterSelectScene');
  }

  // Headless Chromium cannot decode this repo's audio assets; that is pre-existing
  // and unrelated to the core loop. Any other page error is a real regression.
  const unexpectedErrors = pageErrors.filter(
    (error) => !error.includes('Unable to decode audio data')
  );
  expect(unexpectedErrors, `page errors: ${unexpectedErrors.join(' | ')}`).toEqual([]);
});
