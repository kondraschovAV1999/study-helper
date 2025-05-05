import { supabaseAdmin } from "../utils/supabase-client";
import { deleteUser } from "../utils/helper-functions";

export default async function cleanUpUsesrs() {
  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers();
  const deletionPromises: Promise<void>[] = [];
  for (const user of users) {
    deletionPromises.push(deleteUser(user.id));
    console.log("Deleting", user.id);
  }
  await Promise.all(deletionPromises);
  console.log("Deleted all created users");
}