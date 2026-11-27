import { defineConfig, devices } from '@playwright/test';

// Allow a dedicated port for local runs where another project's preview server
// may already own 4173. CI keeps the historical default.
const port = Number(process.env.PS_E2E_PORT || 4173);
const origin = `http://127.0.0.1:${port}`;
const basePath = '/primordial-swamp/';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: 'list',
  use: {
    baseURL: `${origin}${basePath}`,
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      `npm run build -- --base=${basePath} && npx vite preview --base=${basePath} --port ${port} --strictPort --host 127.0.0.1`,
    url: `${origin}${basePath}`,
    reuseExistingServer: !process.env.CI && !process.env.PS_E2E_PORT,
    timeout: 180_000
  }
});
