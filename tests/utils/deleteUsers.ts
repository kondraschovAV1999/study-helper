import { supabaseAdmin } from "./supabase-client";
import { deleteUser } from "./helper-functions";

export async function deleteUserById(id: string) {
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
