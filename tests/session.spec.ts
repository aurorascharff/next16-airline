import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Sessions', () => {
  test('a first visit gets a session and sees the shared demo trips', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.getByTestId('trip-card')).toHaveCount(2);
    const cookies = await page.context().cookies();
    expect(cookies.some(cookie => cookie.name === 'waypoint-session')).toBe(true);
  });
});
