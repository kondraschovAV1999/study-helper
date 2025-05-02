"use server";
import { createClient } from "@/utils/supabase/server";

export async function renameFolder(
  folder_id: string,
  new_name: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("folder_in_folder")
    .update({ folder_name: new_name })
    .eq("folder_id", folder_id);

  if (error) {
    console.error("Folder rename error: ", error);
    if (error.code === "23505") {
      return {
        success: false,
        message: "A folder with this name already exists",
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Folder was successfully renamed",
  };
}
