import { test, expect } from '@playwright/test';

test.describe('User Login - Sign In Functionality', () => {
  const baseURL = 'http://localhost:3000'; // Change to your app's base URL

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
  });

  test('SI2 - Empty email', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', '');
    await page.fill('input[placeholder="Enter your password"]', 'correctPass');
    await page.click('button[type="submit"]');

    const emailField = page.locator('input[placeholder="Enter your email address"]');
    await expect(emailField).toHaveAttribute('required', '');
  });

  test('SI3 - Empty password', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', 'user@example.com');
    await page.fill('input[placeholder="Enter your password"]', '');
    await page.click('button[type="submit"]');

    const passwordField = page.locator('input[placeholder="Enter your password"]');
    await expect(passwordField).toHaveAttribute('required', '');
  });

  test('SI4 - Invalid email format', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', 'user[at]example.com');
    await page.fill('input[placeholder="Enter your password"]', 'correctPass');
    await page.click('button[type="submit"]');

    const emailError = page.locator('text=Please include an');
    await expect(emailError).toBeVisible();
  });

  test('SI5 - Email not registered', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', 'notfound@example.com');
    await page.fill('input[placeholder="Enter your password"]', 'correctPass');
    await page.click('button[type="submit"]');

    const error = page.locator('text=Invalid login credentials');
    await expect(error).toBeVisible();
  });

  test('SI6 - Registered email, incorrect password', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', 'user@example.com');
    await page.fill('input[placeholder="Enter your password"]', 'wrongPass');
    await page.click('button[type="submit"]');

    const error = page.locator('text=Invalid login credentials');
    await expect(error).toBeVisible();
  });

  test('SI7 - Registered email but not confirmed', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', 'unconfirmed@gmail.com');
    await page.fill('input[placeholder="Enter your password"]', 'correctPass');
    await page.click('button[type="submit"]');

    const error = page.locator('text=Email not confirmed');
    await expect(error).toBeVisible();
  });

  test('SI1 - Valid registered and confirmed email, correct password', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email address"]', 'confirmed@gmail.com');
    await page.fill('input[placeholder="Enter your password"]', 'correctPass');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(`${baseURL}/protected`);
  });
});
