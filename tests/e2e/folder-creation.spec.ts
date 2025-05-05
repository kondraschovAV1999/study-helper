import { test, expect, Page } from "@playwright/test";
import { login } from "@/tests/utils/login";
import { createFolder } from "../utils/create-folder";
import { randomUUID } from "crypto";
import { signUpUser } from "../utils/signup-helper";

const getCreateDialog = (page: Page) =>
  page.getByRole("dialog").filter({ has: page.getByText("Create New Folder") });

test.describe("UC16: Folder creation", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const email = `${testInfo.parallelIndex}-${randomUUID()}@example.com`;
    await signUpUser(page, {
      email,
    });
    const user = { email, password: "password123", email_confirm: true };

    await login(page, user);
  });

  test("UC16_Test1: All valid inputs", async ({ page, browserName }) => {
    const folderName = `Test_${randomUUID()}`;
    await createFolder(page, folderName);

    // Submit and verify
    let dialog = getCreateDialog(page);
    await dialog.getByRole("button", { name: "Create folder" }).click({
      force: true,
    });
    if (browserName === "firefox" || browserName === "webkit") {
      await page.waitForTimeout(1000);
    }

    await expect(getCreateDialog(page)).toBeHidden({
      timeout: 25000,
    });
    await expect(page.getByText(folderName).first()).toBeVisible({
      timeout: 25000,
    });

    await page.getByRole("button", { name: "Sign Out" }).click();
  });

  test("UC16_Test2: Duplicate name", async ({ page }) => {
    const uniqueFolderName = `Test_${randomUUID()}`;

    // First folder creation
    await createFolder(page, uniqueFolderName);
    let dialog = getCreateDialog(page);
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Create folder" }).click();

    // Wait for network idle
    await page.waitForLoadState("networkidle");

    // Use retry logic for checking dialog visibility
    await expect(async () => {
      const isVisible = await getCreateDialog(page).isVisible();
      expect(isVisible).toBeFalsy();
    }).toPass({ timeout: 30000 });

    await expect(page.getByText(uniqueFolderName).first()).toBeVisible({
      timeout: 25000,
    });

    // Duplicate folder creation
    await createFolder(page, uniqueFolderName);
    dialog = getCreateDialog(page);
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Create folder" }).click();

    // Wait for network idle after clicking
    await page.waitForLoadState("networkidle");

    // Wait for any error message that might contain the text about duplicate folder
    // This is more flexible than looking for exact text
    await expect(
      page.getByText(/folder with this name already exists/i, { exact: false })
    ).toBeVisible({ timeout: 30000 });

    // Close the dialog
    await page.keyboard.press("Escape");

    // Verify dialog closes
    await expect(async () => {
      const isVisible = await getCreateDialog(page).isVisible();
      expect(isVisible).toBeFalsy();
    }).toPass({ timeout: 15000 });

    await page.getByRole("button", { name: "Sign Out" }).click();
  });

  test("UC16_Test3: Empty name", async ({ page }) => {
    await createFolder(page, "");
    let dialog = getCreateDialog(page);
    await expect(
      dialog.getByRole("button", { name: "Create folder" })
    ).toBeDisabled();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Sign Out" }).click();
  });
});
