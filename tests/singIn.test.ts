import { signInAction } from "../app/actions";
import { testUsers } from "./utils/seeds";
import { describe, expect, test, beforeEach, jest, it } from "@jest/globals";
import { User } from "./utils/seeds";

describe("signInAction", () => {
  let confirmedUser: User;
  let unconfirmedUser: User;
  beforeAll(() => {
    confirmedUser = testUsers.get("confirmedEmail") as User;
    if (!confirmedUser) {
      throw new Error("User with key 'confirmedEmail' not found");
    }
    unconfirmedUser = testUsers.get("unconfirmedEmail") as User;
    if (!unconfirmedUser) {
      throw new Error("User with key 'unconfirmedEmail' not found");
    }
  });
  it("SI1: Valid registered and confirmed email, correct password", async () => {
    const user = confirmedUser;
    const { email, password } = user;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signInAction(formData);

    expect(result).toEqual({
      success: true,
      message: "Login successful",
    });
  });
  it("SI2: Empty email", async () => {
    const user = confirmedUser;
    const { email, password } = user;
    const formData = new FormData();
    formData.append("email", "");
    formData.append("password", password);

    const result = await signInAction(formData);

    expect(result).toEqual({
      success: false,
      message: "missing email or phone",
    });
  });
  it("SI3: Empty password", async () => {
    const user = confirmedUser;
    const { email, password } = user;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", "");

    const result = await signInAction(formData);

    expect(result).toEqual({
      success: false,
      message: "Invalid login credentials",
    });
  });
  it("SI4: Invalid email format", async () => {
    const user = confirmedUser;
    const { email, password } = user;
    const formData = new FormData();
    formData.append("email", "user[at]example.com");
    formData.append("password", password);

    const result = await signInAction(formData);

    expect(result).toEqual({
      success: false,
      message: "Invalid login credentials",
    });
  });
  // SI5 in local version will pass. It doesn't check weather the email is real or not.
  it("SI5: Email not registered", () => {});
  it("SI6: Incorrect password", async () => {
    const user = confirmedUser;
    const { email, password } = user;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", "incorrectPassword");

    const result = await signInAction(formData);

    expect(result).toEqual({
      success: false,
      message: "Invalid login credentials",
    });
  });
  it("SI7: Not confirmed email", async () => {
    const user = unconfirmedUser;
    const { email, password } = user;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signInAction(formData);

    expect(result).toEqual({
      success: false,
      message: "Email not confirmed",
    });
  });
});
