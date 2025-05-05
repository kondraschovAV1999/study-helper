import { config } from "dotenv";
import { resolve } from "path";

// Load test environment variables from .env.test
config({ path: resolve(process.cwd(), ".env.test") });

import "@testing-library/jest-dom";

// Mock authentication headers to simulate logged-in user
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name: string) => {
      if (name === "sb-access-token") return { value: "mock-access-token" };
      if (name === "sb-refresh-token") return { value: "mock-refresh-token" };
      return undefined;
    }),
    set: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(() => []),
    has: jest.fn(() => false),
  })),
}));

// If your folder operations require any setup or cleanup, you can define it here:
beforeAll(async () => {
  console.log("Ready to test folder operations...");
  // Optional: Seed initial folder data if needed
});

afterAll(async () => {
  console.log("Finished testing folder operations.");
  // Optional: Clean up created folders from Supabase
});
