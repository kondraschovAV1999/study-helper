import { Page, expect, test } from "@playwright/test";
import { User } from "./seeds";

export async function login(page: Page, user: User) {
  await test.step("Fill login form", async () => {
    await page.goto("/login");
    await page.getByPlaceholder("Enter your email address").fill(user.email);
    await page.getByPlaceholder("Enter your password").fill(user.password);
    await page
      .getByRole("button", { name: "Sign In" })
      .nth(1)
      .click({ force: true });
  });

  await test.step("Verify successful login", async () => {
    await expect(page).toHaveURL(/protected/);
    await expect(page.getByText("My Library")).toBeVisible();
  });
}
