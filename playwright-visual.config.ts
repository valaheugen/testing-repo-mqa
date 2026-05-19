import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests/playwright/visual',
  testMatch: '**/*_views.ts',
  timeout: 60_000,
  fullyParallel: false,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-visual-report', open: 'never' }],
    [
      '@argos-ci/playwright/reporter',
      {
        uploadToArgos: !!process.env.ARGOS_TOKEN,
      },
    ],
  ],
});
