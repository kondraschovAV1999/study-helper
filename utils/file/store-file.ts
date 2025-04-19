import { v4 as uuidv4 } from "uuid";
import { SupabaseClient } from "@supabase/supabase-js";
/**
 * Stores a file in Supabase storage and returns the object ID
 *
 * @param file - The file to store
 * @param bucketName - The name of the Supabase storage bucket
 * @param userId - The ID of the user storing the file
 * @param supabase - The Supabase client instance
 * @returns Promise<string> - The ID of the stored file object
 * @throws Error if the file upload fails
 */
export default async function storeFile(
  file: File,
  bucketName: string,
  userId: string,
  supabase: SupabaseClient<any, any, any>
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${userId}/${uuidv4()}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }
  return data.id;
}
