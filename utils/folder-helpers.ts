import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create a folder
export async function createFolder(name: string, userId: string) {
    const { data, error } = await supabase
      .from("folders")
      .insert([{ name, user_id: userId }])
      .select()
      .single();
  
    if (error) throw error;
    return data;
  }

// Rename a folder
export async function renameFolder(folderId: string, newName: string) {
    // Logic for renaming a folder
    const renamedFolder = { id: folderId, name: newName }; // Return the updated folder object
    return renamedFolder;
  }

// Delete a folder
export async function deleteFolder(folderId: string) {
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId);
  
    if (error) throw error;
  }