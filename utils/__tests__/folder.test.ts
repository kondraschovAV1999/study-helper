import { createFolder, renameFolder, deleteFolder } from "../folder-helpers";

const testUserId = "user123"; // Or get from your seeded users
let folderId: string;

describe("Folder feature tests", () => {
  // Step 1: Create a folder before running tests
  beforeAll(async () => {
    const folder = await createFolder("Test Folder", testUserId);
    folderId = folder.id;
    console.log("Created folder for testing:", folder);
  });

  test("should create a new folder", async () => {
    expect(folderId).toBeDefined();
  });

  test("should rename the folder", async () => {
    const renamed = await renameFolder(folderId, "Renamed Folder");
    expect(renamed.name).toBe("Renamed Folder");
  });

  test("should delete the folder", async () => {
    await expect(deleteFolder(folderId)).resolves.not.toThrow();
  });
  
});
