import { expect, test } from '@playwright/test';

test.describe('Booking flow (/book/[flightId]/[step])', () => {
  test('selections are kept in the URL across steps', async ({ page }) => {
    await page.goto('/book/wp-21/baggage?date=2026-11-12&bags=0&carryOn=1');
    await page.getByRole('button', { name: '1 bag' }).click();
    await expect(page).toHaveURL(/bags=1/);

    await page.getByTestId('booking-next').filter({ visible: true }).click();
    await page.waitForURL(url => url.pathname === '/book/wp-21/seats');
    await expect(page.getByRole('heading', { level: 1, name: 'Where would you like to sit?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select a seat' })).toBeDisabled();

    await page.getByRole('button', { exact: true, name: 'Seat 10C' }).click();
    await expect(page).toHaveURL(/seat=wp-21-10C/);
    await page.getByTestId('booking-next').filter({ visible: true }).click();
    await page.waitForURL(url => url.pathname === '/book/wp-21/extras');
    await expect(page).toHaveURL(/bags=1/);
    await expect(page).toHaveURL(/seat=wp-21-10C/);
  });

  test('steps a flight does not offer are skipped', async ({ page }) => {
    await page.goto('/book/wp-22/baggage?date=2026-11-12');
    await expect(page.getByRole('list', { name: 'Booking progress' }).getByRole('listitem')).toHaveCount(3);
    await page.getByTestId('booking-next').filter({ visible: true }).click();
    await page.waitForURL(url => url.pathname === '/book/wp-22/extras');

    await page.goto('/book/wp-61/extras?date=2026-11-12');
    await page.waitForURL(url => url.pathname === '/book/wp-61/review');
  });

  test('seats booked by another traveler on that date are occupied', async ({ page }) => {
    await page.goto('/book/wp-21/seats?date=2026-10-09&seat=');
    await expect(page.getByRole('button', { exact: true, name: 'Seat 10A, occupied' })).toBeDisabled();

    await page.goto('/book/wp-21/seats?date=2026-11-12&seat=');
    await expect(page.getByRole('button', { exact: true, name: 'Seat 10A' })).toBeEnabled();
  });

  test('confirming stores the trip in My trips, and cancelling removes it', async ({ page }) => {
    await page.goto('/book/wp-41/review?date=2026-12-03&bags=2&carryOn=1&seat=wp-41-12A&extras=wp-41-lounge');
    await expect(page.getByRole('heading', { level: 1, name: 'Review your journey' })).toBeVisible();
    await expect(page.getByTestId('trip-total')).toHaveText('€350');

    await page.getByTestId('booking-confirm').filter({ visible: true }).click();
    await page.waitForURL(url => url.pathname.startsWith('/trips/') && url.searchParams.get('confirmed') === '1');
    await expect(page.getByTestId('trip-confirmed')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'See you in Lisbon.' })).toBeVisible();
    await expect(page.getByText('Total paid').locator('..')).toContainText('€350');

    await page.getByRole('link', { name: 'My trips' }).first().click();
    await page.waitForURL(url => url.pathname === '/trips');
    await expect(page.getByTestId('trip-card')).toHaveCount(3);

    await page.getByTestId('trip-card').filter({ hasText: 'Thu 3 Dec' }).click();
    await page.getByRole('button', { name: 'Cancel trip' }).click();
    await page.waitForURL(url => url.pathname === '/trips');
    await expect(page.getByTestId('trip-card')).toHaveCount(2);
  });
});
