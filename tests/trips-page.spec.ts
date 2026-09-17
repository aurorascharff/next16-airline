import { expect, test } from '@playwright/test';

test.describe('Trips page (/trips)', () => {
  test('lists only the signed-in traveler’s bookings with their selections', async ({ page }) => {
    await page.goto('/trips');
    const card = page.getByTestId('trip-card');
    await expect(card).toHaveCount(1);
    await expect(card).toContainText('OSL');
    await expect(card).toContainText('Barcelona');
    await expect(card).toContainText('Seat 10A');
    await expect(card).toContainText('WAY204');
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'My trips' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('travelers cannot open each other’s trips', async ({ page }) => {
    await page.goto('/trips');
    await page.getByTestId('trip-card').click();
    await page.waitForURL(url => url.pathname.startsWith('/trips/'));
    await expect(page.getByRole('heading', { level: 1, name: 'See you in Barcelona.' })).toBeVisible();

    await page.goto('/trips/not-a-real-booking');
    await expect(page.getByRole('heading', { level: 1, name: 'That journey does not exist.' })).toBeVisible();
  });
});
