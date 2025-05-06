"use server";
import { FolderInFolder } from "@/types/folder";
import { createClient } from "@/utils/supabase/server";

export async function fetchSubFolders(
  folder_name: string,
  parent_id: string = "00000000-0000-0000-0000-000000000000"
): Promise<{
  success: boolean;
  message: string;
  content: FolderInFolder[];
}> {
  const supabase = await createClient();
  const { data: user_id, error: err_fetching_user } = await supabase.rpc(
    "fetch_current_user_id"
  );
  if (err_fetching_user) {
    return {
      success: false,
      message: err_fetching_user.message,
      content: [],
    };
  }

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
        content: [],
        message: err.message,
      };
    }
    parent_id = data;
  }

  const { data, error } = await supabase
    .from("folder_in_folder")
    .select("*")
    .eq("user_id", user_id)
    .eq("parent_id", parent_id);

  if (error) {
    return {
      success: false,
      content: [],
      message: error.message,
    };
  }
  return {
    success: true,
    message: "",
    content: data as FolderInFolder[],
  };
}
