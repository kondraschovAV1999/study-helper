export interface User {
  email: string;
  password: string;
  email_confirm: boolean;
}

export const testUsers = new Map<string, User>();
testUsers.set("confirmedEmail", {
  email: "usera@test.com",
  password: "password123",
  email_confirm: true,
});
testUsers.set("unconfirmedEmail", {
  email: "userb@test.com",
  password: "password456",
  email_confirm: false,
});
