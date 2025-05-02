"use server";
import { generateStudyGuide } from "@/utils/ai/generate-study-guide";
import deleteFromStorage from "@/utils/file/delete-from-storage";
import storeFile from "@/utils/file/store-file";
import { converterMap } from "@/utils/general/convert-map";
import { createClient } from "@/utils/supabase/server";

/**
 * Creates a study guide from an uploaded file
 *
 * @param formData - Form data containing:
 *   - folderId: The ID of the folder to store the files in
 *   - title: The title of the study guide
 *   - file: The file to generate the study guide from
 *
 * @returns Promise<{success: boolean, message: string}>
 *   - success: Whether the operation was successful
 *   - message: A description of the result or error
 *
 * The function:
 * 1. Validates the user is authenticated
 * 2. Converts the uploaded file to text using an appropriate converter
 * 3. Generates an AI study guide from the text
 * 4. Stores both the original and generated files in Supabase storage
 * 5. Creates a study guide record linking the files
 *
 */
export async function createStudyGuide({
  title,
  folderId,
  formFile,
  inputText,
}: {
  title: string;
  folderId?: string;
  formFile: File | null;
  inputText: string;
}) {
  const bucketName = "study-guides";
  let origFileId;
  let genFileId;
  const supabase = await createClient();
  try {
    if (!formFile && !inputText)
      throw new Error("No file nor text input provided");
    if (formFile && inputText)
      throw new Error("Both file and text input provided");

    const { data: userId, error } = await supabase.rpc("fetch_current_user_id");
    if (error) throw new Error(error.message);

    // if user doesn't specify the folder, by default it's stored in Study Guides folder
    if (!folderId) {
      let { data, error } = await supabase.rpc("get_folder_id_under_root", {
        target_folder_name: "Study Guides",
      });
      if (error) throw new Error(error.message);
      folderId = data;
    }
    let text;
    if (formFile) {
      const buffer = Buffer.from(await formFile.arrayBuffer());
      const converter = converterMap[formFile.type];
      if (!converter) throw new Error("Unsupported file type");
      text = await converter.convert(buffer);
    } else {
      formFile = new File([inputText], `inputText-${uuidv4()}`, {
        type: "text/plain",
      });
      text = inputText;
    }

    origFileId = await storeFile(formFile, bucketName, userId, supabase);
    const studyGuide = await generateStudyGuide(text);
    const studyGuideString = JSON.stringify(studyGuide);
    const arrayBuffer = new TextEncoder().encode(studyGuideString);
    const genFile = new File([arrayBuffer], `${formFile.name}-ai.json`, {
      type: "application/json",
    });

    genFileId = await storeFile(genFile, bucketName, userId, supabase);

    const { error: rpcError } = await supabase.rpc("create_study_guide", {
      orig_file_id: origFileId,
      gen_file_id: genFileId,
      folder_id: folderId,
      title: title,
      orig_file_name: formFile.name,
      gen_file_name: genFile.name,
    });

    if (rpcError) throw new Error(rpcError.message);

    return {
      success: true,
      message: "Study guide created successfully",
    };
  } catch (error) {
    console.error("Error creating study guide:", error);
    // rolling back object creation
    if (origFileId) deleteFromStorage(origFileId, supabase);
    if (genFileId) deleteFromStorage(genFileId, supabase);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
function uuidv4() {
  throw new Error("Function not implemented.");
}
