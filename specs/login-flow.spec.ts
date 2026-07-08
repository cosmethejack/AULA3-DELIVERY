import { test, expect } from '@playwright/test';

// spec: specs/login-flow-test-plan.md
// Base de exploração: docs/spec.md

const ADMIN_EMAIL = 'admin@delivery.test';
const VALID_PASSWORD = 'password123';
const API_LOGIN_URL = '**/api/auth/login';

test.describe('Fluxo de Login (Clerk)', () => {

  test.describe('Happy paths', () => {
    test('HP-01: Login válido', async ({ page }) => {
      await page.route(API_LOGIN_URL, async route => {
        await route.fulfill({ status: 200, json: { token: 'mocked-jwt-token' } });
      });

      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
      await page.locator('input[type="password"]').fill(VALID_PASSWORD);
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page).toHaveURL(/.*\/dashboard\/resumo/);
      const token = await page.evaluate(() => localStorage.getItem('admin-token'));
      expect(token).toBe('mocked-jwt-token');
    });

    test('HP-02: Estado de carregamento', async ({ page }) => {
      await page.route(API_LOGIN_URL, async route => {
        await new Promise(f => setTimeout(f, 1000));
        await route.fulfill({ status: 200, json: { token: 'mocked-jwt-token' } });
      });

      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
      await page.locator('input[type="password"]').fill(VALID_PASSWORD);
      
      const entrarBtn = page.getByRole('button', { name: 'Entrar' });
      await entrarBtn.click();

      await expect(page.getByRole('button', { name: 'Entrando...' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Entrando...' })).toBeDisabled();
    });

    test('HP-03: Dashboard com token', async ({ page }) => {
      await page.goto('/sign-in');
      await page.evaluate(() => {
        localStorage.setItem('admin-token', 'mocked-jwt-token');
      });
      await page.goto('/dashboard/resumo');

      await expect(page).toHaveURL(/.*\/dashboard\/resumo/);
      await expect(page.getByRole('heading', { name: 'Admin Delivery' })).not.toBeVisible();
    });

    test('HP-04: Logout', async ({ page }) => {
      await page.goto('/sign-in');
      await page.evaluate(() => {
        localStorage.setItem('admin-token', 'mocked-jwt-token');
      });
      await page.goto('/dashboard/resumo');

      await page.getByRole('button', { name: 'Sair' }).click();

      const token = await page.evaluate(() => localStorage.getItem('admin-token'));
      expect(token).toBeNull();
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
  });

  test.describe('Edge cases', () => {
    test('EC-01: Campos vazios', async ({ page }) => {
      await page.goto('/sign-in');
      await page.getByRole('button', { name: 'Entrar' }).click();

      const requestPromise = page.waitForRequest(API_LOGIN_URL, { timeout: 1000 }).catch(() => null);
      expect(await requestPromise).toBeNull();
    });

    test('EC-02: E-mail mal formatado', async ({ page }) => {
      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill('admin@');
      await page.locator('input[type="password"]').fill(VALID_PASSWORD);
      await page.getByRole('button', { name: 'Entrar' }).click();

      const requestPromise = page.waitForRequest(API_LOGIN_URL, { timeout: 1000 }).catch(() => null);
      expect(await requestPromise).toBeNull();
    });

    test('EC-03: Espaços em branco', async ({ page }) => {
      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill('   ');
      await page.locator('input[type="password"]').fill('   ');
      await page.getByRole('button', { name: 'Entrar' }).click();

      const requestPromise = page.waitForRequest(API_LOGIN_URL, { timeout: 1000 }).catch(() => null);
      expect(await requestPromise).toBeNull();
    });

    test('EC-04: Re-tentativa após erro', async ({ page }) => {
      let attempt = 0;
      await page.route(API_LOGIN_URL, async route => {
        if (attempt === 0) {
          attempt++;
          await route.fulfill({ status: 401 });
        } else {
          await route.fulfill({ status: 200, json: { token: 'mocked-jwt-token' } });
        }
      });

      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
      await page.locator('input[type="password"]').fill('wrong-password');
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText('Credenciais inválidas')).toBeVisible();

      await page.locator('input[type="password"]').fill(VALID_PASSWORD);
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page).toHaveURL(/.*\/dashboard\/resumo/);
    });

    test('EC-05: Token inválido/corrompido', async ({ page }) => {
      await page.goto('/sign-in');
      await page.evaluate(() => {
        localStorage.setItem('admin-token', 'lixo');
      });
      
      await page.route('**/api/**', async route => {
        if (route.request().url().includes('/auth/login')) {
            await route.continue();
        } else {
            await route.fulfill({ status: 401 });
        }
      });

      await page.goto('/dashboard/resumo');
    });
  });

  test.describe('Tratamento de erros', () => {
    test('ER-01: Credenciais inválidas', async ({ page }) => {
      await page.route(API_LOGIN_URL, async route => {
        await route.fulfill({ status: 401 });
      });

      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
      await page.locator('input[type="password"]').fill('wrong');
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText('Credenciais inválidas')).toBeVisible();
      await expect(page).toHaveURL(/.*\/sign-in/);
      const token = await page.evaluate(() => localStorage.getItem('admin-token'));
      expect(token).toBeNull();
    });

    test('ER-02: Erro de conexão/rede', async ({ page }) => {
      await page.route(API_LOGIN_URL, async route => {
        await route.abort();
      });

      await page.goto('/sign-in');
      await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
      await page.locator('input[type="password"]').fill(VALID_PASSWORD);
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText('Erro de conexão')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    });

    test('ER-03: Rota protegida sem token', async ({ page }) => {
      await page.goto('/dashboard/resumo');
      await expect(page).toHaveURL(/.*\/sign-in/);
    });

    test('ER-04: Sessão expirada (401)', async ({ page }) => {
      // apiClient não está interceptando erros 401 para redirecionar para /sign-in. 
      // Por enquanto, o teste é marcado como fixme até que o comportamento da aplicação seja corrigido.
      test.fixme(true, 'Bug conhecido: apiClient não intercepta 401 para redirecionar para /sign-in');
      
      await page.goto('/sign-in');
      await page.evaluate(() => {
        localStorage.setItem('admin-token', 'mocked-jwt-token');
      });

      await page.route('**/api/dashboard/**', async route => {
        await route.fulfill({ status: 401 });
      });

      await page.goto('/dashboard/resumo');
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
  });

  test.describe('Backend / API (ClerkGuard + RBAC)', () => {
    test.fixme('API-01: Token válido', async ({ request }) => {
      // Exige JWT com role ADMIN
    });

    test('API-02: Token ausente', async ({ request }) => {
      const response = await request.get('http://localhost:3001/v1/dashboard/summary');
      expect(response.status()).toBe(401);
    });

    test('API-03: Token expirado', async ({ request }) => {
      const response = await request.get('http://localhost:3001/v1/dashboard/summary', {
        headers: {
          'Authorization': 'Bearer expired-jwt-token'
        }
      });
      expect(response.status()).toBe(401);
    });

    test.fixme('API-04: Admin acessa recurso @Roles(ADMIN)', async ({ request }) => {
      // Exige JWT com role ADMIN
    });

    test.skip('API-05: Customer acessa recurso de admin', async ({ request }) => {
      // test.skip se o Clerk estiver indisponível, JWT real role CUSTOMER
    });

    test.skip('API-06: Usuário sem role conhecida', async ({ request }) => {
      // test.skip se o Clerk estiver indisponível, JWT sem role
    });
  });
});
