import { SupabaseClient } from "@supabase/supabase-js";
import createFile from "./create-file";

/**
 * Creates a file within a specified folder database and stores the file in Supabase storage.
 * @param file - The file object to be stored
 * @param folderId - The ID of the folder where the file will be stored
 * @param isAigenerated - Boolean flag indicating if the file is AI-generated (defaults to false)
 * @param userId - The ID of the user creating the file
 * @param bucketName - The name of the Supabase storage bucket
 * @param supabase - The Supabase client instance
 * @returns Promise<string> - Returns the file ID of the created file
 * @throws Error if file creation or database insertion fails
 */
export default async function createFileInFolder(
  file: File,
  folderId: string,
  isAigenerated = false,
  userId: string,
  bucketName: string,
  supabase: SupabaseClient<any, any, any>
) {
  try {
    const fileId = createFile(
      file,
      isAigenerated,
      bucketName,
      userId,
      supabase
    );
    const { data, error } = await supabase
      .from("file_in_folder")
      .insert({
        file_id: fileId,
        user_id: userId,
        file_name: file.name,
        folder_id: folderId,
      })
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data[0].file_id;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create file"
    );
  }
}
