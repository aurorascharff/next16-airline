import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Search page (/search)', () => {
  test('searching a route lists its flights', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('From').filter({ visible: true }).selectOption('CPH');
    await page.getByLabel('To').filter({ visible: true }).selectOption('AMS');
    await page.getByLabel('Departure').filter({ visible: true }).fill('2026-11-12');
    await page.getByRole('button', { name: 'Search flights' }).filter({ visible: true }).click();

    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('to') === 'AMS');
    await expect(page.getByRole('heading', { level: 2, name: 'CPH to AMS' })).toBeVisible();
    await expect(page.getByTestId('flight-result')).toHaveCount(2);
    await expect(page.getByText('Thu 12 Nov')).toBeVisible();
  });

  test('without a destination the page lists routes from the chosen hub', async ({ page }) => {
    await page.goto('/search?from=CPH');
    await expect(page.getByRole('heading', { level: 2, name: 'Where Waypoint flies from CPH' })).toBeVisible();
    await expect(page.getByTestId('route-suggestion')).toHaveCount(3);
    await page.getByTestId('route-suggestion').filter({ hasText: 'Lisbon' }).click();
    await page.waitForURL(url => url.searchParams.get('to') === 'LIS');
    await expect(page.getByLabel('To').filter({ visible: true }).last()).toHaveValue('LIS');
    await expect(page.getByRole('heading', { level: 2, name: 'CPH to LIS' })).toBeVisible();
  });

  test('selecting a flight navigates instantly into the booking flow', async ({ page }) => {
    await page.goto('/search?from=OSL&to=BCN&date=2026-11-12');
    await expect(page.getByTestId('flight-result')).toHaveCount(2);

    await instant(page, async () => {
      await page.getByRole('link', { name: 'Select' }).first().click();
      await page.waitForURL(url => url.pathname === '/book/wp-21/baggage');
      await expect(page.getByRole('heading', { level: 2, name: 'Build your journey' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: 'What are you bringing?' })).toBeVisible();
    });

    await expect(page.getByTestId('booking-experience')).toBeVisible();
  });
});
