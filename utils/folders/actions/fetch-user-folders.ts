"use server";
import { Folder } from "@/types/folder";
import { createClient } from "@/utils/supabase/server";

export async function fetchUserFolders() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: user_err,
    } = await supabase.auth.getUser();

    if (user_err) {
      throw new Error("Error fetching user: ", user_err);
    }
    if (!user || user === null) throw new Error("User is not authenticated");

    const { data: my_folders_id, error: err } = await supabase.rpc(
      "get_folder_id_under_root",
      {
        target_folder_name: "My Folders",
      }
    );

    if (err) {
      throw new Error("Error fetching My Folders id: ", err);
    }

    const { data, error } = await supabase
      .from("folder_in_folder")
      .select(
        `
        id: folder_id,
        name: folder_name,
        user (
          user_id: id
        )
      `
      )
      .eq("user.auth_user_id", user.id)
      .eq("parent_id", my_folders_id);

    if (error) {
      throw new Error("Error fetching user's folders: ", error);
    }
    const folders: Folder[] = data.map(({ user, ...rest }) => rest);
    return {
      success: true,
      message: "Success",
      content: folders,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      content: [],
    };
  }
}
