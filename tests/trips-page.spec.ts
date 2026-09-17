import { expect, test } from '@playwright/test';

test.describe('Trips page (/trips)', () => {
  test('lists the shared demo trips with their selections, but not other travelers’ bookings', async ({ page }) => {
    await page.goto('/trips');
    const cards = page.getByTestId('trip-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toContainText('OSL');
    await expect(cards.first()).toContainText('Barcelona');
    await expect(cards.first()).toContainText('Seat 10A');
    await expect(cards.first()).toContainText('WAY204');
    await expect(page.getByText('Amsterdam')).toHaveCount(0);
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'My trips' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('demo trips cannot be cancelled, and other travelers’ trips cannot be opened', async ({ page }) => {
    await page.goto('/trips/trip-default-barcelona');
    await expect(page.getByRole('heading', { level: 1, name: 'See you in Barcelona.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel trip' })).toHaveCount(0);
    await expect(page.getByText('Demo trip · cannot be cancelled')).toBeVisible();

    await page.goto('/trips/trip-traveler-amsterdam');
    await expect(page.getByRole('heading', { level: 1, name: 'That journey does not exist.' })).toBeVisible();
  });
});
