import { createClient } from "../supabase/server";

/**
 * Fetches the ID of a folder under the root directory by its name.
 *
 * This function uses a Supabase remote procedure call (RPC) to retrieve
 * the folder ID associated with the specified folder name. If the folder
 * does not exist, it returns `null`.
 *
 * @param folderName - The name of the folder whose ID is to be fetched.
 * @returns A promise that resolves to the folder ID as a string, or `null` if the folder is not found.
 * @throws An error if there is an issue during the RPC call.
 */
export async function fetchFolderIdUnderRoot(
  folderName: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data: folderId, error: fetch_err } = await supabase.rpc(
    "get_folder_id_under_root",
    {
      target_folder_name: folderName,
    }
  );

  if (fetch_err) {
    throw new Error("Error fetching folder's id: ", fetch_err);
  }
  return folderId;
}
