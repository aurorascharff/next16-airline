import { expect, test } from '@playwright/test';

test.describe('Search page (/search)', () => {
  test('choosing a destination shows the route from Oslo', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { level: 2, name: 'Choose where to go' })).toBeVisible();

    await page.getByLabel('To').selectOption('BCN');
    await page.getByRole('button', { name: 'Search flights' }).click();
    await page.waitForURL(url => url.searchParams.get('to') === 'BCN');
    await expect(page.getByRole('heading', { level: 2, name: 'OSL to BCN' })).toBeVisible();
    await expect(page.getByText('€218')).toBeVisible();
  });

  test('destination chips lead to the explore page', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('link', { name: 'Explore Lisbon' }).click();
    await page.waitForURL(url => url.pathname === '/explore/lisbon');
    await expect(page.getByRole('heading', { level: 1, name: 'Lisbon' })).toBeVisible();
  });
});
