import { Page, expect } from "@playwright/test";

export async function signUpUser(
  page: Page,
  {
    firstName = "John",
    lastName = "Doe",
    birthDay: birthMonth = "1",
    birthDay = "1",
    birthYear = "2000",
    email = `testuser${Date.now()}@example.com`,
    password = "password123",
    confirmPassword = "password123",
  }: {
    firstName?: string;
    lastName?: string;
    birthDay?: string;
    birthYear?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }
) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign Up" }).first().click();

  await page.getByPlaceholder("John").fill(firstName);
  await page.getByPlaceholder("Doe").fill(lastName);

  await page.selectOption('select[name="birthMonth"]', birthMonth);
  await page.selectOption('select[name="birthDay"]', birthDay);
  await page.selectOption('select[name="birthYear"]', birthYear);

  await page.getByPlaceholder("Enter your email address").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByPlaceholder("Confirm your password").fill(confirmPassword);

  await page.getByRole("button", { name: "Create Account" }).click();

  return email; // return email in case you want to use it later
}
