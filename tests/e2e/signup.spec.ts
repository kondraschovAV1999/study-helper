import { test, expect } from "@playwright/test";
import { signUpUser } from "../utils/signup-helper";

let email: string;
test.describe("Sign Up Form", () => {
  test("R1: All valid inputs", async ({ page }) => {
    email = await signUpUser(page, {});
    await expect(
      page.getByText(
        "Thanks for signing up! Please check your email for a verification link."
      )
    ).toBeVisible();
  });
  test("R2: Empty first name", async ({ page }) => {
    email = await signUpUser(page, {
      firstName: "",
    });
    const firstNameInput = page.getByPlaceholder("John");
    const isFirstNameMissing = await firstNameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isFirstNameMissing).toBe(true);
  });
  test("R3: Empty last name", async ({ page }) => {
    email = await signUpUser(page, {
      lastName: "",
    });
    const lastNameInput = page.getByPlaceholder("Doe");
    const isLastNameMissing = await lastNameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isLastNameMissing).toBe(true);
  });
  test("R4: No birthday month selected", async ({ page }) => {
    email = await signUpUser(page, {
      birthDay: "",
    });
    const birthMonthInput = page.locator('select[name="birthMonth"]');
    const isBirthMonthMissing = await birthMonthInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isBirthMonthMissing).toBe(true);
  });
  test("R5: No birthday day selected", async ({ page }) => {
    email = await signUpUser(page, {
      birthDay: "",
    });
    const birthDayInput = page.locator('select[name="birthDay"]');
    const isBirthDayInputMissing = await birthDayInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isBirthDayInputMissing).toBe(true);
  });

  test("R6: No birthday year selected", async ({ page }) => {
    email = await signUpUser(page, {
      birthYear: "",
    });
    const birthYearInput = page.locator('select[name="birthYear"]');
    const isBirthYearInputMissing = await birthYearInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isBirthYearInputMissing).toBe(true);
  });

  test("R7: Empty email", async ({ page }) => {
    email = await signUpUser(page, {
      email: "",
    });
    const emailInput = page.getByPlaceholder("Enter your email address");
    const isEmailMissing = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isEmailMissing).toBe(true);
  });
  test("R8: Invalid email format", async ({ page }) => {
    email = await signUpUser(page, {
      email: "asdhhdfhsdh@test",
    });
    await expect(
      page.getByText("Please enter a valid email address")
    ).toBeVisible();
  });
  test("R9: Empty password", async ({ page }) => {
    email = await signUpUser(page, {
      password: "",
    });
    const passwordInput = page.getByPlaceholder("Enter your password");
    const isPasswordMissing = await passwordInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isPasswordMissing).toBe(true);
  });
  test("R10: Confirm password is empty", async ({ page }) => {
    email = await signUpUser(page, {
      confirmPassword: "",
    });
    const confirmPassInput = page.getByPlaceholder("Confirm your password");
    const isconfirmPassMissing = await confirmPassInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isconfirmPassMissing).toBe(true);
  });

  test("R11: Password and confirm password mistach", async ({ page }) => {
    email = await signUpUser(page, {
      email: "mismatch@example.com",
      password: "123456",
      confirmPassword: "sadbsda",
    });
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });
});
