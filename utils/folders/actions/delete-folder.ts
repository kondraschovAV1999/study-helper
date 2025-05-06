"use server";
import { createClient } from "@/utils/supabase/server";

export async function deleteFolder(folder_id: string): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase.from("folder").delete().eq("id", folder_id);

  if (error) {
    console.error("Folder deletion error: ", error);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Folder was successfully deleted",
  };
}
