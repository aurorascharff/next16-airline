import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login page (/login)', () => {
  test('signed-out visitors are redirected to the login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(url => url.pathname === '/login');
    await expect(page.getByRole('heading', { level: 1, name: 'Waypoint' })).toBeVisible();
  });

  test('choosing a traveler signs in and lands on the overview', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Aurora Scharff/ }).click();
    await page.waitForURL(url => url.pathname === '/');
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Overview' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('start-booking')).toBeVisible();
  });
});
