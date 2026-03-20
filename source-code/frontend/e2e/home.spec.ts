import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/home'); // Home page
});

test.describe('Home', () => {
  test('Page loaded', async ({ page }) => {
    // Arrange
    const homeTitle = page.getByText("Webtech's StreetCats");
    const exploreLink = page.getByRole("link", { name: "Explore the Map" });
    const homeNavTab = page.getByRole("tab", { name: "Home" });

    // Act & Assert
    await expect(homeTitle).toBeVisible();
    await expect(exploreLink).toBeVisible();
    await expect(homeNavTab).toHaveAttribute('routerlinkactive', 'active');
    await expect(page).toHaveURL(/\/home$/);
  });

  test('Redirected correctly to sightings map', async ({ page }) => {
    // Arrange
    const exploreLink = page.getByRole("link", { name: "Explore the Map" });

    // Act
    await exploreLink.click();

    // Assert
    await expect(page).toHaveURL(/\/sightings-map$/);
  });
});