"use server";
import { createClient } from "@/utils/supabase/server";

export async function createFolder(
  folder_name: string,
  parent_id: string = "00000000-0000-0000-0000-000000000000"
) {
  const supabase = await createClient();
  if (parent_id === "00000000-0000-0000-0000-000000000000") {
    const { data, error: err } = await supabase.rpc(
      "get_folder_id_under_root",
      {
        target_folder_name: "My Folders",
      }
    );
    if (err) {
      return {
        success: false,
        message: err.message,
        content: null,
      };
    }
    parent_id = data;
  }

  const { data, error } = await supabase.rpc("create_folder", {
    folder_name,
    parent_id,
  });

  if (error) {
    console.error("Folder creation error: ", error);
    if (error.code === "23505") {
      return {
        success: false,
        message: "A folder with this name already exists",
        content: null,
      };
    }
    return {
      success: false,
      message: error.message,
      content: null,
    };
  }
  const id = data?.folder_id as string;
  const name = data?.folder_name as string;

  return {
    success: true,
    message: "Folder was successfully created",
    content: { id, name },
  };
}
