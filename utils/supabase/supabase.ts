import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function createFolder(name: string, userId: string) {
  const { data, error } = await supabase
    .from("folders") // Make sure you have the 'folders' table in your database
    .insert([{ name, user_id: userId }])
    .single(); // Ensure you get a single record back

  if (error) throw error;  // Handle any errors

  return data;  // This should return the folder object from Supabase (including the generated 'id')
}
