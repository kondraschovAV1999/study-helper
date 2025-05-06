import { expect, Page } from "@playwright/test";

export async function createFolder(page: Page, folderName: string) {
  const create_new = page.getByRole("button", { name: "Create New" });
  await expect(create_new).toBeVisible();

  // Folder creation
  await create_new.click({ force: true });
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const folderInput = dialog.locator("input#name");
  await expect(folderInput).toBeEditable();
  await folderInput.fill(folderName);
}
