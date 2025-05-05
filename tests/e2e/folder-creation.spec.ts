import { test, expect } from "@playwright/test";
import { testUsers, User } from "../utils/seeds";
import { login } from "@/tests/utils/login";

test.describe("Folder creation test", () => {
  let folderName: string;
  let user: User;
  test.beforeAll(() => {
    const fetchedUser = testUsers.get("confirmedEmail");
    if (!fetchedUser) {
      throw new Error('User with key "confirmedEmail" not found in testUsers.');
    }
    user = fetchedUser;
  });

  test.beforeEach(async () => {
    folderName = `Test Folder ${Date.now()}`;
  });

  test("FC1: All valid inputs", async ({ page }) => {
    login(page, user);

    await test.step("Find Create New button", async () => {
      const create_new = page.getByRole("button", { name: "Create New" });
      await expect(create_new).toBeVisible();
    });

    // Folder creation
    await page.getByRole("button", { name: "Create New" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const folderInput = dialog.locator("input#name");
    await expect(folderInput).toBeEditable();
    await folderInput.fill(folderName);

    // Submit and verify
    await dialog.getByRole("button", { name: "Create folder" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText(folderName).first()).toBeVisible();
  });
});
