import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Home page (/)', () => {
  test('initial load shows the shell before the trip dashboard streams in', async ({ baseURL, page }) => {
    await instant(
      page,
      async () => {
        await page.goto('/');
        await expect(page.getByRole('link', { name: 'Waypoint home' })).toBeVisible();
        await expect(page.getByTestId('start-booking')).toHaveCount(0);
      },
      { baseURL },
    );

    await expect(page.getByTestId('start-booking')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Barcelona is closer than it feels.');
  });

  test('the overview link is marked as the current page', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Trips' })).not.toHaveAttribute('aria-current', 'page');
  });
});
