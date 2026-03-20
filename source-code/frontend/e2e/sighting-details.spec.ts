import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

import { sendRequest } from './utils/httpClient';
import { createTestUser } from './utils/createTestUser';
import { createTestSighting } from './utils/createTestSighting';

test.describe('SightingDetails', () => {

  test.describe('Logged users', () => {
    let authToken: string;
    let user: any;
    let username: string;
    let sightingId: string;

    test.beforeAll(async ({ request }) => {
      ({ authToken, user, username } = await createTestUser(request)); // Create test user
      ({ sightingId } = await createTestSighting(request, authToken, username)); // Create test sighting
    });

    test.afterAll(async ({ request }) => {
      // Cleanup: Delete the sighting and the test user
      const { token } = JSON.parse(readFileSync('.auth/token.json', 'utf-8'));
      const resSighting = await sendRequest(request, 'DELETE', `/sightings/${sightingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resSighting.ok()) {
        console.log(`Cleanup skipped: DELETE /sightings/${sightingId} returned ${resSighting.status()}`);
      }
      const resUser = await sendRequest(request, 'DELETE', `/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resUser.ok()) {
        console.log(`Cleanup skipped: DELETE /users/${username} returned ${resUser.status()}`);
      }
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(`/sightings/${sightingId}`); // Sighting detail page
      // Inject auth state into localStorage to simulate what the Angular Auth service does
      await page.evaluate(({ authToken, user }) => {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(user));
      }, { authToken, user });
      await page.reload(); // Reload so Angular picks up the token from localStorage
    });

    test('Page loaded', async ({ page }) => {
      // Arrange
      const title = page.locator("[data-testid='sighting-title']");
      const image = page.locator("[data-testid='sighting-image']");
      const coordinates = page.locator("[data-testid='sighting-coordinates']");

      // Act & Assert
      await expect(title).toBeVisible();
      await expect(image).toBeVisible();
      await expect(coordinates).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`/sightings/${sightingId}$`));
    });

    test('Edit form showed correctly', async ({ page }) => {
      // Arrange
      const editButton = page.getByRole("button", { name: "Edit sighting" });

      // Act
      await editButton.click();

      // Assert
      await expect(page.locator("input#title")).toBeVisible();
      await expect(page.locator("textarea#description")).toBeVisible();
      await expect(page.locator("input#latitude")).toBeVisible();
      await expect(page.locator("input#longitude")).toBeVisible();
    });
  });

});