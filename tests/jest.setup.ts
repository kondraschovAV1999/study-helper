import { testUsers } from "./utils/seeds";
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.test") });
import "@testing-library/jest-dom";
import { createUser, deleteUser } from "./utils/helper-functions";
const testUsersIds = new Map<string, string>();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name: string) => {
      if (name === "sb-access-token") return { value: "mock-access-token" };
      if (name === "sb-refresh-token") return { value: "mock-refresh-token" };
      return undefined; // Or your default mock value
    }),
    set: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(() => []),
    has: jest.fn(() => false),
  })),
}));

beforeAll(async () => {
  const creationPromises: Promise<string>[] = [];
  testUsers.forEach((value, key) => {
    creationPromises.push(createUser(value));
    testUsersIds.set(key, "");
  });
  const userIds = await Promise.all(creationPromises);
  let i = 0;
  testUsers.forEach((_, key) => {
    testUsersIds.set(key, userIds[i++]);
  });
  console.log("Seeded user IDs:", testUsersIds);
});

afterAll(async () => {
  const deletionPromises: Promise<void>[] = [];
  for (const userId of Array.from(testUsersIds.values())) {
    deletionPromises.push(deleteUser(userId));
    console.log("Deleting", userId);
  }
  await Promise.all(deletionPromises);
  console.log("Deleted all seeded users");
});
