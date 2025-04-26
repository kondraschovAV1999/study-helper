import { supabaseAdmin } from "../utils/supabase-client";
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

export async function deleteUser(userId: string ) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Failed to delete seeded auth user:", error.message);
    throw error;
  }
}
