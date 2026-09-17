import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Home page (/)', () => {
  test('initial load shows the search shell before the personal trip streams in', async ({ baseURL, page }) => {
    await instant(
      page,
      async () => {
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1, name: 'Where to next?' })).toBeVisible();
        // Everything that reads request data (the Delays cookie, the session) streams in afterwards.
        await expect(page.getByRole('button', { name: 'Search flights' })).toHaveCount(0);
        await expect(page.getByTestId('next-trip')).toHaveCount(0);
      },
      { baseURL },
    );

    await expect(page.getByRole('button', { name: 'Search flights' })).toBeVisible();
    await expect(page.getByTestId('next-trip')).toContainText('Oslo to Barcelona');
    await expect(page.getByTestId('destination-card')).toHaveCount(3);
  });

  test('the home link is marked as the current page', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'My trips' })).not.toHaveAttribute('aria-current', 'page');
  });

  test('destination cards lead to the explore page with routes from both hubs', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Lisbon/ }).click();
    await page.waitForURL(url => url.pathname === '/explore/lisbon');
    await expect(page.getByRole('heading', { level: 1, name: 'Lisbon' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Fly from Oslo/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Fly from Copenhagen/ })).toBeVisible();
  });
});
