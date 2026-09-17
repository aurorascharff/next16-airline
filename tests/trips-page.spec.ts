import { expect, test } from '@playwright/test';

test.describe('Trips page (/trips)', () => {
  test('lists only the signed-in traveler’s bookings', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.getByRole('link', { name: /Oslo to Barcelona/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Copenhagen to Amsterdam/ })).toHaveCount(0);
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Trips' }),
    ).toHaveAttribute('aria-current', 'page');
  });
});
