import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

import { sendRequest } from './utils/httpClient';

test.beforeEach(async ({ page }) => {
  await page.goto('/sign-up'); // Sign up page
});

test.afterEach(async ({ request }) => {
  // Cleanup: Delete the test user
  const { token } = JSON.parse(readFileSync('.auth/token.json', 'utf-8'));
  const res = await sendRequest(request, 'DELETE', '/users/E2E', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok()) {
    console.log(`Cleanup skipped: DELETE /users/E2E returned ${res.status()}`);
  }
});

// Serial to avoid creating duplicate users across parallel workers
test.describe.serial('SignUp', () => {
  test('Page loaded', async ({ page }) => {
    // Arrange
    const formCard = page.locator(".form-card");
    const signUpTitle = formCard.locator("h4", { hasText: "Sign Up" });
    const submitButton = formCard.getByRole("button", { name: "Sign Up" });

    // Act & Assert
    await expect(formCard).toBeVisible();
    await expect(signUpTitle).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(page).toHaveURL(/\/sign-up$/);
  });

  test('Signed up successfully', async ({ page }) => {
    // Arrange
    const formCard = page.locator(".form-card");
    const usernameInput = page.locator("input#username");
    const emailInput = page.locator("input#email");
    const passwordInput = page.locator("input#password");
    const confirmPasswordInput = page.locator("input#confirmPassword");
    const submitButton = formCard.getByRole("button", { name: "Sign Up" });

    // Act
    await usernameInput.fill("E2E");
    await emailInput.fill("e2e@e2e.com");
    await passwordInput.fill("E2Ee2e01!");
    await confirmPasswordInput.fill("E2Ee2e01!");
    await submitButton.click();

    // Assert
    const successToast = page.getByText("Signed up successfully.");
    await expect(successToast).toBeVisible();
  });
});