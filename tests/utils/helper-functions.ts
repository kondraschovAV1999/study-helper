import { randomUUID } from "crypto";
import { supabaseAdmin } from "../utils/supabase-client";
import { Page, TestInfo, test } from "@playwright/test";
import { signUpUser } from "./signup-helper";
export async function createUser(user: {
  email?: string | undefined;
  password?: string | undefined;
  email_confirm?: boolean | undefined;
}) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser(user);

  if (error) {
    console.error("Failed to seed auth user:", error.message);
    throw error;
  }
  return data.user?.id!;
}

export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Failed to delete seeded auth user:", error.message);
    throw error;
  }
}

export async function signUp(page: Page, testInfo: TestInfo, password: string) {
  const email = `${testInfo.parallelIndex}-${randomUUID()}@example.com`;
  await signUpUser(page, {
    email,
  });
  const user = { email, password, email_confirm: true };
  return user;
}

export async function fillInLoginForm(
  page: Page,
  email: string,
  password: string
) {
  await test.step("Fill login form", async () => {
    await page.getByPlaceholder("Enter your email address").fill(email);
    await page.getByPlaceholder("Enter your password").fill(password);
    await page.getByRole("button", { name: "Sign In" }).nth(1).click();
  });
}
