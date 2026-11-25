import { defineConfig, devices } from '@playwright/test';
import { urls } from './src/config/env';

const isCI = !!process.env.CI;

/**
 * One config for UI (3 browsers), API and tooling tests.
 * - Retries only in CI, so flakiness is surfaced (and reported) instead of hidden locally.
 * - Traces are captured on the first retry: every flaky failure comes with a debuggable trace.
 * - CI writes blob reports per shard; they are merged into HTML + JSON in the workflow.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: isCI
    ? [['blob'], ['github'], ['list']]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'reports/results.json' }],
      ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium',
      testMatch: 'ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: 'ui/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: 'ui/**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
      use: {
        baseURL: urls.api,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
    {
      name: 'tooling',
      testMatch: 'tooling/**/*.spec.ts',
    },
  ],
});
