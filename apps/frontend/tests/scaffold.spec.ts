import { test, expect } from '@playwright/test';
import { getClerkToken } from '../../../tests/helpers/auth';

let clerkToken: string;

test.beforeAll(async () => {
  clerkToken = await getClerkToken();
});

test('adicionar X-Burger ao carrinho e finalizar pedido', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.evaluate((token) => {
    localStorage.setItem('admin-token', token);
  }, clerkToken);

  await page.getByRole('heading', { name: 'Delivery' }).waitFor();

  await page.getByRole('article').filter({ hasText: 'X-Burger' }).getByRole('button', { name: 'Adicionar' }).click();

  await page.getByRole('heading', { name: 'X-Burger' }).waitFor();

  await page.getByRole('button', { name: 'Adicionar ao Carrinho' }).click();

  await page.getByRole('heading', { name: 'Checkout' }).waitFor();

  await expect(page.getByText('2x X-Burger')).toBeVisible();

  const timestamp = Date.now();
  const form = page.locator('form');
  await form.locator('input').nth(0).fill('Teste');
  await form.locator('input').nth(1).fill(`teste${timestamp}@teste.com`);
  await form.locator('input').nth(2).fill('11999999999');
  await form.locator('textarea').fill('Rua Teste, 123');

  await page.getByRole('button', { name: /Finalizar/ }).click();

  await expect(page.getByRole('heading', { name: 'Pedido Confirmado!' })).toBeVisible({ timeout: 10000 });
});
