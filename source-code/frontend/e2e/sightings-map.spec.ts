import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/sightings-map'); // Sightings map page
});

test.describe('SightingsMap', () => {
  test('Page loaded', async ({ page }) => {
    // Arrange
    const sightingsMapNavTab = page.getByRole("tab", { name: "Sightings Map" });
    const map = page.locator("#map");

    // Act & Assert
    await expect(map).toBeVisible();
    await expect(sightingsMapNavTab).toHaveAttribute('routerlinkactive', 'active');
    await expect(page).toHaveURL(/\/sightings-map$/);
  });

  test('Side panel showed correctly', async ({ page }) => {
    // Arrange
    const openSidePanelButton = page.getByRole("button", { name: "Open side panel" });

    // Act
    await openSidePanelButton.click();

    // Assert
    const sidePanel = page.locator(".side-panel");
    await expect(sidePanel).toBeVisible();
  });
});