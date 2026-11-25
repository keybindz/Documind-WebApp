import { test, expect } from '@playwright/test';
test('unauthenticated visitors are sent to sign in', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name:'Sign in to your workspace' })).toBeVisible();
});
