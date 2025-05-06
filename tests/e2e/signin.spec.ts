import { test, expect } from "@playwright/test";

import { fillInLoginForm, signUp } from "../utils/helper-functions";
import { testUsers, User } from "../utils/seeds";

test.describe("User Login - Sign In Functionality", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(`/login`);
  });

  test("SI2 - Empty email", async ({ page }) => {
    await fillInLoginForm(page, "", "password");

    const emailInput = page.getByPlaceholder("Enter your email address");
    const isEmailMissing = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isEmailMissing).toBe(true);
  });

  test("SI3 - Empty password", async ({ page }) => {
    await fillInLoginForm(page, "useremail@test.com", "");

    const passInput = page.getByPlaceholder("Enter your password");
    const isPassMissing = await passInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isPassMissing).toBe(true);
  });

  test("SI4 - Invalid email format", async ({ page }) => {
    await fillInLoginForm(page, "useremail[at]test.com", "password");

    const emailInput = page.getByPlaceholder("Enter your email address");
    const isInvalidEmail = await emailInput.evaluate((el: HTMLInputElement) =>
      el.checkValidity()
    );
    expect(isInvalidEmail).toBe(false);
  });

  test("SI5 - Email not registered", async ({ page }, testInfo) => {
    // there's no way to check it locally
  });

  test("SI6 - Registered email, incorrect password", async ({
    page,
  }, testInfo) => {
    const user = await signUp(page, testInfo, "password123");
    await page.goto("/login");
    await expect(page).toHaveURL(/login/, { timeout: 15000 });
    await fillInLoginForm(page, user.email, "incorrentPassword");

    await expect(page.getByText("Invalid login credentials")).toBeVisible({
      timeout: 15000,
    });
  });

  test("SI7 - Registered email but not confirmed", async ({
    page,
  }, testInfo) => {
    const user: User =
      testUsers.get("unconfirmedEmail") ??
      (() => {
        throw new Error("User 'confirmedEmail' not found");
      })();
    await page.goto("/login");
    await expect(page).toHaveURL(/login/, { timeout: 15000 });
    await fillInLoginForm(page, user.email, user.password);

    await expect(page.getByText("Email not confirmed")).toBeVisible({
      timeout: 15000,
    });
  });

  test("SI1 - Valid registered and confirmed email, correct password", async ({
    page,
  }, testInfo) => {
    const user = await signUp(page, testInfo, "password123");
    await page.goto("/login");
    await expect(page).toHaveURL(/login/, { timeout: 15000 });

    await fillInLoginForm(page, user.email, user.password);

    await test.step("Verify successful login", async () => {
      await expect(page).toHaveURL(/protected/, { timeout: 15000 });
      await expect(page.getByText("My Library")).toBeVisible();
    });
    await page.getByRole("button", { name: "Sign Out" }).click();
  });
});
