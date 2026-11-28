import { describe, it, expect, vi } from 'vitest';
import { AssetLoader } from '../../src/utils/AssetLoader';
import {
  getAllSprites,
  getAllImages,
  getLoadableSprites,
  getLoadableImages,
  getLoadableAudio,
} from '../../src/config/assets';

type LoaderScene = ConstructorParameters<typeof AssetLoader>[0];

describe('AssetLoader', () => {
  it('queues only manifest entries marked available', async () => {
    const load = {
      on: vi.fn(),
      spritesheet: vi.fn(),
      image: vi.fn(),
      audio: vi.fn(),
    };
    const scene = { load } as unknown as LoaderScene;

    await new AssetLoader(scene).loadAllAssets();

    expect(load.on).toHaveBeenCalledWith('loaderror', expect.any(Function));
    expect(load.spritesheet).toHaveBeenCalledTimes(getLoadableSprites().length);
    expect(load.image).toHaveBeenCalledTimes(getLoadableImages().length);
    expect(load.audio).toHaveBeenCalledTimes(getLoadableAudio().length);
  });

  it('still generates a placeholder texture for every manifest key', () => {
    const graphics = {
      fillStyle: vi.fn(),
      fillRect: vi.fn(),
      fillEllipse: vi.fn(),
      fillTriangle: vi.fn(),
      fillCircle: vi.fn(),
      fillRoundedRect: vi.fn(),
      lineStyle: vi.fn(),
      strokeRect: vi.fn(),
      strokeRoundedRect: vi.fn(),
      generateTexture: vi.fn(),
      destroy: vi.fn(),
    };
    const scene = {
      textures: { exists: () => false },
      add: { graphics: () => graphics },
    } as unknown as LoaderScene;

    new AssetLoader(scene).generatePlaceholders();

    expect(graphics.generateTexture).toHaveBeenCalledTimes(
      getAllSprites().length + getAllImages().length
    );
  });
});
