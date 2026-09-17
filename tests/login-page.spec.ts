import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login page (/login)', () => {
  test('signed-out visitors are redirected to the login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(url => url.pathname === '/login');
    await expect(page.getByRole('heading', { level: 1, name: 'Waypoint' })).toBeVisible();
  });

  test('signing in with an email lands on the home page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Demo email').fill('new-traveler@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(url => url.pathname === '/');
    await expect(page.getByRole('heading', { level: 1, name: 'Where to next?' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
