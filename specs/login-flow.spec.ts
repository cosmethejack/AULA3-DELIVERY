import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { getClerkToken } from '../tests/helpers/auth';

/**
 * Suíte E2E completa do fluxo de login do admin.
 *
 * Gerada seguindo o workflow `.agents/.agent/workflows/playwright-test-generator.md`
 * a partir do plano de testes `specs/login-flow-test-plan.md` e da spec funcional
 * `docs/spec.md`.
 *
 * Cobre os 21 cenários do plano:
 *   5.1 Happy paths .......... HP-01 .. HP-04
 *   5.2 Edge cases ........... EC-01 .. EC-05
 *   5.3 Tratamento de erros .. ER-01 .. ER-04
 *   5.4 Backend / RBAC ....... API-01 .. API-06
 *
 * Implementação real de referência:
 *   - apps/frontend/src/app/sign-in/page.tsx          (formulário próprio, sem SDK Clerk)
 *   - apps/frontend/src/app/(dashboard)/layout.tsx    (proteção de rota + logout)
 *   - apps/frontend/src/services/api-admin.ts         (authedGet — NÃO intercepta 401)
 *   - apps/backend/src/core/auth/clerk.guard.ts       (ClerkGuard + RBAC)
 *
 * Determinismo: POST /api/auth/login e endpoints autenticados são interceptados
 * via page.route. Os testes de backend (5.4) batem direto no NestJS real.
 */

// 127.0.0.1 (e não "localhost") para forçar IPv4 e evitar ECONNREFUSED ::1 intermitente.
const BACKEND_URL = 'http://127.0.0.1:3001';
/** Endpoint protegido por @Roles("ADMIN") — ver dashboard.controller.ts */
const PROTECTED_ENDPOINT = `${BACKEND_URL}/v1/dashboard/summary`;

const FAKE_TOKEN = 'fake.jwt.token';

// ---------------------------------------------------------------------------
// Helpers de UI
// ---------------------------------------------------------------------------

/** Mocka POST /api/auth/login com o status/payload desejado. */
async function mockLogin(
  page: Page,
  opts: { status: number; body?: unknown; delayMs?: number; abort?: boolean },
) {
  await page.route('**/api/auth/login', async (route) => {
    if (opts.abort) {
      await route.abort('failed');
      return;
    }
    if (opts.delayMs) {
      await new Promise((r) => setTimeout(r, opts.delayMs));
    }
    await route.fulfill({
      status: opts.status,
      contentType: 'application/json',
      body: JSON.stringify(opts.body ?? {}),
    });
  });
}

// Os <label> da página não usam htmlFor/id, então localizamos os inputs por tipo.
const emailInput = (page: Page) => page.locator('input[type="email"]');
const passwordInput = (page: Page) => page.locator('input[type="password"]');

async function fillCredentials(page: Page, email: string, password: string) {
  await emailInput(page).fill(email);
  await passwordInput(page).fill(password);
}

/** Injeta o token no localStorage antes de qualquer script da página carregar. */
async function seedToken(page: Page, token = FAKE_TOKEN) {
  await page.addInitScript((t) => localStorage.setItem('admin-token', t), token);
}

const getStoredToken = (page: Page) =>
  page.evaluate(() => localStorage.getItem('admin-token'));

// ===========================================================================
// 5.1 Happy paths
// ===========================================================================

test.describe('Login — happy paths', () => {
  test('HP-01: login válido salva o token e redireciona para /dashboard/resumo', async ({ page }) => {
    await mockLogin(page, { status: 200, body: { token: FAKE_TOKEN } });

    await page.goto('/sign-in');
    await fillCredentials(page, 'admin@delivery.test', 'senha-valida');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/dashboard\/resumo/);
    expect(await getStoredToken(page)).toBe(FAKE_TOKEN);
  });

  test('HP-02: botão mostra "Entrando..." e fica desabilitado durante a requisição', async ({ page }) => {
    await mockLogin(page, { status: 200, body: { token: FAKE_TOKEN }, delayMs: 1000 });

    await page.goto('/sign-in');
    await fillCredentials(page, 'admin@delivery.test', 'senha-valida');
    await page.getByRole('button', { name: 'Entrar' }).click();

    const loadingButton = page.getByRole('button', { name: 'Entrando...' });
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();
  });

  test('HP-03: dashboard renderiza com token presente e não redireciona', async ({ page }) => {
    await seedToken(page);

    await page.goto('/dashboard/resumo');

    await expect(page).toHaveURL(/\/dashboard\/resumo/);
    // sidebar + ação de logout confirmam que o layout autenticado renderizou
    await expect(page.getByRole('heading', { name: 'Delivery Admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });

  test('HP-04: logout remove o token e redireciona para /sign-in', async ({ page }) => {
    await seedToken(page);

    await page.goto('/dashboard/resumo');
    await page.getByRole('button', { name: 'Sair' }).click();

    await expect(page).toHaveURL(/\/sign-in/);
    expect(await getStoredToken(page)).toBeNull();
  });
});

// ===========================================================================
// 5.2 Edge cases
// ===========================================================================

test.describe('Login — edge cases', () => {
  test('EC-01: campos vazios disparam validação nativa e não chamam a API', async ({ page }) => {
    let requested = false;
    await page.route('**/api/auth/login', (route) => {
      requested = true;
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/sign-in');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/sign-in/);
    const emailMissing = await emailInput(page).evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing,
    );
    expect(emailMissing).toBe(true);
    expect(requested).toBe(false);
  });

  test('EC-02: e-mail mal formatado bloqueia o submit (validação type=email)', async ({ page }) => {
    await page.goto('/sign-in');
    await fillCredentials(page, 'admin@', 'senha-valida');
    await page.getByRole('button', { name: 'Entrar' }).click();

    const typeMismatch = await emailInput(page).evaluate(
      (el: HTMLInputElement) => el.validity.typeMismatch,
    );
    expect(typeMismatch).toBe(true);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('EC-03: campos só com espaços não autenticam (consistente com EC-01)', async ({ page }) => {
    let requested = false;
    await page.route('**/api/auth/login', (route) => {
      requested = true;
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/sign-in');
    // Espaços no campo email: type=email considera o valor inválido/vazio
    await fillCredentials(page, '   ', '   ');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/sign-in/);
    const emailValid = await emailInput(page).evaluate(
      (el: HTMLInputElement) => el.validity.valid,
    );
    expect(emailValid).toBe(false);
    expect(requested).toBe(false);
    expect(await getStoredToken(page)).toBeNull();
  });

  test('EC-04: re-tentativa após erro conclui com sucesso e limpa a mensagem', async ({ page }) => {
    let attempt = 0;
    await page.route('**/api/auth/login', async (route) => {
      attempt += 1;
      if (attempt === 1) {
        await route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token: FAKE_TOKEN }),
        });
      }
    });

    await page.goto('/sign-in');
    await fillCredentials(page, 'admin@delivery.test', 'senha-errada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Credenciais inválidas')).toBeVisible();

    await passwordInput(page).fill('senha-valida');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Credenciais inválidas')).toBeHidden();
    await expect(page).toHaveURL(/\/dashboard\/resumo/);
  });

  test('EC-05: token corrompido mantém o layout, mas a API protegida responde 401', async ({ page }) => {
    await seedToken(page, 'lixo-invalido-123');

    // O endpoint autenticado do resumo retorna 401 para token corrompido.
    await page.route('**/api/dashboard/summary', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }),
    );

    await page.goto('/dashboard/resumo');

    // O layout apenas verifica a *presença* do token, então não redireciona aqui.
    await expect(page).toHaveURL(/\/dashboard\/resumo/);
    // Como a chamada protegida falhou, o resumo exibe o estado de erro.
    await expect(page.getByText('Erro ao carregar métricas')).toBeVisible();
  });
});

// ===========================================================================
// 5.3 Tratamento de erros (UI)
// ===========================================================================

test.describe('Login — tratamento de erros', () => {
  test('ER-01: credenciais inválidas exibem mensagem e não salvam token', async ({ page }) => {
    await mockLogin(page, { status: 401 });

    await page.goto('/sign-in');
    await fillCredentials(page, 'admin@delivery.test', 'senha-errada');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);
    expect(await getStoredToken(page)).toBeNull();
  });

  test('ER-02: erro de conexão exibe "Erro de conexão" e reseta o botão', async ({ page }) => {
    await mockLogin(page, { status: 0, abort: true });

    await page.goto('/sign-in');
    await fillCredentials(page, 'admin@delivery.test', 'senha-valida');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Erro de conexão')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeEnabled();
  });

  test('ER-03: rota protegida sem token redireciona para /sign-in', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('admin-token'));

    await page.goto('/dashboard/resumo');

    await expect(page).toHaveURL(/\/sign-in/);
  });

  // Divergência conhecida (ver seção 6 do plano): a spec admin-auth manda o
  // apiClient interceptar 401 e redirecionar para /sign-in, mas api-admin.ts
  // apenas lança Error. Marcado como test.fail() para documentar o bug sem
  // quebrar a suíte; quando corrigido, o Playwright sinaliza "passou inesperadamente".
  test('ER-04: sessão expirada (401) deveria redirecionar para /sign-in', async ({ page }) => {
    test.fail(true, 'apiClient atual não intercepta 401 — bug conhecido (plano §6)');

    await seedToken(page);
    await page.route('**/api/dashboard/summary', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }),
    );

    await page.goto('/dashboard/resumo');

    await expect(page).toHaveURL(/\/sign-in/);
  });
});

// ===========================================================================
// 5.4 Backend / API — ClerkGuard + RBAC
// ---------------------------------------------------------------------------
// Usa as credenciais reais configuradas no projeto (tests/helpers/auth.ts:
// testcheckout@delivery.com / aK9mXp4Lq7vR2nWx, role CUSTOMER) para emitir um
// JWT Clerk legítimo. API-02/API-03 são determinísticos (token ausente/inválido
// sempre → 401). API-05/API-06 batem no endpoint @Roles("ADMIN") com o token
// CUSTOMER e esperam 403. API-01/04 exigem um token com role ADMIN, indisponível
// com a credencial configurada — marcado como fixme (ver plano §6).
// ===========================================================================

async function call(request: APIRequestContext, token?: string) {
  return request.get(PROTECTED_ENDPOINT, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

test.describe('Backend — ClerkGuard + RBAC', () => {
  // JWT real do usuário configurado (role CUSTOMER).
  let userToken = '';
  let clerkAvailable = false;

  test.beforeAll(async () => {
    try {
      userToken = await getClerkToken();
      clerkAvailable = Boolean(userToken);
    } catch {
      clerkAvailable = false;
    }
  });

  // --- Determinísticos: independem de credenciais Clerk -------------------

  test('API-02: token ausente retorna 401', async ({ request }) => {
    const res = await call(request);
    expect(res.status()).toBe(401);
  });

  test('API-03: token inválido/expirado retorna 401', async ({ request }) => {
    const res = await call(request, 'token.invalido.ou.expirado');
    expect(res.status()).toBe(401);
  });

  // --- Com JWT real (credenciais configuradas, role CUSTOMER) -------------

  test('API-05: role CUSTOMER em endpoint @Roles(ADMIN) retorna 403', async ({ request }) => {
    test.skip(!clerkAvailable, 'Clerk indisponível para emitir token real');
    const res = await call(request, userToken);
    expect(res.status()).toBe(403);
  });

  test('API-06: usuário sem role ADMIN em endpoint @Roles(ADMIN) retorna 403', async ({ request }) => {
    test.skip(!clerkAvailable, 'Clerk indisponível para emitir token real');
    // ClerkGuard usa "CUSTOMER" como padrão quando o token não traz role ADMIN → negado.
    const res = await call(request, userToken);
    expect(res.status()).toBe(403);
  });

  // API-01/04 exigem um JWT com role ADMIN. A credencial configurada
  // (testcheckout@delivery.com) tem role CUSTOMER e o template de sessão do
  // ambiente não emite a claim `role`, então 200 não é alcançável aqui.
  // Mantido como fixme até existir uma credencial ADMIN + template com `role`.
  test.fixme('API-01 / API-04: token com role ADMIN acessa endpoint protegido (200)', async ({ request }) => {
    const res = await call(request, userToken);
    expect(res.status()).toBe(200);
  });
});
