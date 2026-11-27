import { describe, it, expect, beforeAll, vi } from 'vitest';
import { spawnSync } from 'child_process';
import { existsSync, readFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { getAllSprites, getAllImages, getAllAudio } from '../../src/config/assets';
import { resolveAssetUrl } from '../../src/utils/AssetLoader';

const BASE = '/primordial-swamp/';
const root = resolve(__dirname, '../..');
let outDir = '';
let html = '';

describe('subpath build (--base=/primordial-swamp/)', () => {
  beforeAll(async () => {
    outDir = mkdtempSync(join(tmpdir(), 'ps-subpath-'));
    // Child process: esbuild cannot run inside the jsdom test environment.
    const res = spawnSync(
      process.execPath,
      [
        resolve(root, 'node_modules/vite/bin/vite.js'),
        'build',
        `--base=${BASE}`,
        '--outDir',
        outDir,
        '--emptyOutDir',
      ],
      { cwd: root, encoding: 'utf8' }
    );
    expect(res.status, res.stdout + res.stderr).toBe(0);
    html = readFileSync(join(outDir, 'index.html'), 'utf8');
  }, 120_000);

  it('emits only base-prefixed script/link URLs in index.html', () => {
    const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith(BASE), `unexpected URL ${url}`).toBe(true);
      const file = join(outDir, url.slice(BASE.length));
      expect(existsSync(file), `missing ${url}`).toBe(true);
    }
  });

  it('ships every configured game asset that exists in public/', () => {
    const all = [...getAllSprites(), ...getAllImages(), ...getAllAudio()];
    let shipped = 0;
    for (const a of all) {
      if (existsSync(join(root, 'public', a.path))) {
        expect(existsSync(join(outDir, a.path)), `not in dist: ${a.path}`).toBe(true);
        shipped++;
      }
    }
    // public/ (not repo-root assets/) is what Vite copies into dist/.
    expect(shipped).toBeGreaterThanOrEqual(0);
    expect(existsSync(join(outDir, 'assets/README.md'))).toBe(true);
  });

  it('resolves asset URLs under the base, never root-absolute', () => {
    vi.stubEnv('BASE_URL', BASE);
    expect(resolveAssetUrl('assets/a.png')).toBe('/primordial-swamp/assets/a.png');
    vi.stubEnv('BASE_URL', './');
    expect(resolveAssetUrl('assets/a.png')).toBe('./assets/a.png');
    vi.unstubAllEnvs();
    expect(resolveAssetUrl('https://cdn.example/a.mp3')).toBe('https://cdn.example/a.mp3');
  });
});
