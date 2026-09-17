import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Booking flow (/book/[bookingId]/[step])', () => {
  test('starting a booking navigates instantly to the baggage step', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('start-booking')).toBeVisible();

    await instant(page, async () => {
      await page.getByTestId('start-booking').click();
      await page.waitForURL(url => url.pathname === '/book/wpt-204/baggage');
      await expect(page.getByRole('heading', { level: 2, name: 'Build your journey' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: 'What are you bringing?' })).toBeVisible();
    });

    await expect(page.getByTestId('booking-experience')).toBeVisible();
  });

  test('selections are kept in the URL across steps', async ({ page }) => {
    await page.goto('/book/wpt-204/baggage?bags=0&carryOn=1');
    await page.getByRole('button', { name: '1 bag' }).click();
    await expect(page).toHaveURL(/bags=1/);

    await page.getByTestId('booking-next').click();
    await page.waitForURL(url => url.pathname === '/book/wpt-204/seats');
    await expect(page.getByRole('heading', { level: 1, name: 'Where would you like to sit?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select a seat' })).toBeDisabled();

    await page.getByRole('button', { exact: true, name: 'Seat 10A' }).click();
    await expect(page).toHaveURL(/seat=wpt-204-10A/);
    await page.getByTestId('booking-next').click();
    await page.waitForURL(url => url.pathname === '/book/wpt-204/extras');
    await expect(page).toHaveURL(/bags=1/);
    await expect(page).toHaveURL(/seat=wpt-204-10A/);
  });

  test('travelers cannot open each other’s bookings', async ({ page }) => {
    await page.goto('/book/wpt-318/baggage');
    await expect(page.getByRole('heading', { level: 1, name: 'That journey does not exist.' })).toBeVisible();
  });
});
