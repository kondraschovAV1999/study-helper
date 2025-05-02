"use server";
import { createFlashcardSet } from "@/utils/ai/generate-flashcards";
import { createClient } from "@/utils/supabase/server";

/**
 * Creates a flashcard set from a study guide.
 *
 * This function retrieves the original file associated with the given study guide ID,
 * extracts its content, and generates a flashcard set with the specified title and optional folder ID.
 *
 * @param studyGuideId - The unique identifier of the study guide.
 * @param title - The title of the flashcard set to be created.
 * @param folder_id - (Optional) The ID of the folder where the flashcard set will be stored.
 * @returns A promise that resolves to an object indicating the success or failure of the operation.
 *          On success, the object contains a success flag and a success message.
 *          On failure, the object contains a success flag and an error message.
 *
 */
export async function createFlashcardsFromStudyGuide(
  studyGuideId: string,
  title: string,
  folder_id?: string
) {
  try {
    const supabase = await createClient();
    if (!studyGuideId) throw new Error("Study guide id is absent");

    const { data: fileInfo, error: get_orig_file_err } = (await supabase.rpc(
      "get_orig_file",
      {
        studyGuideId,
      }
    )) as { data: { name: string; bucket: string }; error: any };

    if (get_orig_file_err) throw new Error(get_orig_file_err.message);

    if (!fileInfo)
      throw new Error(
        `Didn't find original file for stugy guide with id=${studyGuideId}`
      );

    const { data: file, error: file_err } = await supabase.storage
      .from(fileInfo.bucket)
      .download(fileInfo.name);

    if (file_err) throw new Error(file_err.message);

    const content = await file.text();
    const data = createFlashcardSet(content, title, folder_id, studyGuideId);

    return {
      success: true,
      message: "Flashcard set was successfully created",
    };
  } catch (error) {
    console.error("Error creating flashcard set from stugy guide:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
