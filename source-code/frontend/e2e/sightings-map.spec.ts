import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

import { sendRequest } from './utils/httpClient';
import { createTestUser } from './utils/createTestUser';

// Minimal 1x1 transparent PNG used as dummy photo for form submission
const DUMMY_PHOTO = {
  name: 'photo.png',
  mimeType: 'image/png',
  buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBQEBX4Ks6QAAAABJRU5ErkJggg==', 'base64'),
};

test.describe('SightingsMap', () => {

  test.describe('All users', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sightings-map'); // Sightings map page
    });

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

  test.describe('Logged users', () => {
    let authToken: string;
    let user: any;
    let username: string;

    test.beforeAll(async ({ request }) => {
      ({ authToken, user, username } = await createTestUser(request)); // Create test user
    });

    test.afterAll(async ({ request }) => {
      // Cleanup: Delete the test user
      const { token } = JSON.parse(readFileSync('.auth/token.json', 'utf-8'));
      const res = await sendRequest(request, 'DELETE', `/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok()) {
        console.log(`Cleanup skipped: DELETE /users/${username} returned ${res.status()}`);
      }
    });

    test.beforeEach(async ({ page }) => {
      await page.goto('/sightings-map'); // Sightings map page
      // Inject auth state into localStorage to simulate what the Angular Auth service does
      await page.evaluate(({ authToken, user }) => {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(user));
      }, { authToken, user });
      await page.reload(); // Reload so Angular picks up the token from localStorage
    });

    test('"Add sighting" form showed correctly', async ({ page }) => {
      // Arrange
      const openSidePanelButton = page.getByRole("button", { name: "Open side panel" });
      await openSidePanelButton.click();
      const addSightingButton = page.getByRole("button", { name: "Add sighting" });

      // Act
      await addSightingButton.click();

      // Assert
      const formCard = page.locator(".form-card");
      const formTitle = formCard.locator("h4", { hasText: "New Sighting" });
      const submitButton = formCard.getByRole("button", { name: "Add" });
      await expect(formCard).toBeVisible();
      await expect(formTitle).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('Sighting added correctly', async ({ page, request }) => {
      // Arrange
      const openSidePanelButton = page.getByRole("button", { name: "Open side panel" });
      await openSidePanelButton.click();
      await page.getByRole("button", { name: "Add sighting" }).click();
      await page.locator("input#title").fill("E2E Sighting");
      await page.locator("textarea#description").fill("E2E sighting description");
      await page.locator("input#photo").setInputFiles(DUMMY_PHOTO); // Upload dummy photo
      await page.locator("input#latitude").fill("41.9028");
      await page.locator("input#longitude").fill("12.4964");

      // Act
      const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/sightings') && res.request().method() === 'POST'),
        page.getByRole("button", { name: "Add" }).click(),
      ]);

      const { id: sightingId } = await response.json();

      // Assert
      await openSidePanelButton.click(); // Open side panel again
      const firstCard = page.getByTestId("sighting-card").first(); // First card in the side panel
      await expect(firstCard).toBeVisible();
      await expect(firstCard).toContainText("E2E Sighting"); // Card matches the inserted title

      // Cleanup: Delete the sighting with admin token
      const { token } = JSON.parse(readFileSync('.auth/token.json', 'utf-8'));
      const res = await sendRequest(request, 'DELETE', `/sightings/${sightingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok()) {
        console.log(`Cleanup skipped: DELETE /sightings/${sightingId} returned ${res.status()}`);
      }
    });
  });

});