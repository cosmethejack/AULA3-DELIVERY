import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

/**
 * Carrega o .env único da raiz para os testes E2E (ex.: CLERK_SECRET_KEY,
 * usado por tests/helpers/auth.ts). Usa a API nativa do Node (>= 20.12);
 * no CI o .env não existe e as variáveis vêm do ambiente do runner.
 * Como o webServer herda process.env, backend e frontend sobem com as
 * mesmas variáveis carregadas aqui (regra de .env único em docs/architecture.md).
 */
try {
  process.loadEnvFile(path.resolve(__dirname, '.env'));
} catch {
  /* .env ausente (ex.: CI) — variáveis vêm do ambiente */
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['specs/**/*.spec.ts', 'apps/frontend/tests/**/*.spec.ts'],
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Sobe backend (3001) e frontend (3000) antes dos testes.
     reuseExistingServer evita reiniciar se você já estiver rodando `npm run dev`. */
  webServer: [
    {
      command: 'npm run dev',
      cwd: './apps/backend',
      url: 'http://localhost:3001/v1/catalog',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      cwd: './apps/frontend',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
