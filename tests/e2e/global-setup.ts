import { createUser } from "../utils/helper-functions";
import { testUsers, User } from "../utils/seeds";

export default async function setUp() {
  console.log("Global setup");
  const user: User =
    testUsers.get("confirmedEmail") ??
    (() => {
      throw new Error("User 'confirmedEmail' not found");
    })();
  const id = await createUser(user);
  console.log(`user has been created successfuly, id=${id}`);
}
