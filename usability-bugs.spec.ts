import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';

test('BUG-USA-001: error banner has no dismiss control and persists after clicks elsewhere', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.triggerError();

  await login.expectNoDismissControl();

  await page.mouse.click(10, 10); 
  await expect(login.errorBanner).toBeVisible();
  await expect(page).toHaveURL(/\/$/); 
});

test('BUG-USA-003: no horizontal overflow at 360px before or after login error', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const login = new LoginPage(page);
  await login.open();

  const noOverflow = () =>
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  expect(await noOverflow(), 'overflow present before error').toBe(true);

  await login.triggerError();

  expect(await noOverflow(), 'overflow present after error (BUG-USA-003)').toBe(true);
});
