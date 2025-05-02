"use server";
import { createFlashcardSet } from "@/utils/ai/generate-flashcards";
import { converterMap } from "@/utils/general/convert-map";

/**
 * Creates a flashcard set based on the provided title, file, or text input.
 *
 * @param title - The title of the flashcard set.
 * @param formFile - A file containing the content for the flashcards. Must be null if `inputText` is provided.
 * @param inputText - A string containing the content for the flashcards. Must be empty if `formFile` is provided.
 * @param folder_id - (Optional) The ID of the folder where the flashcard set will be stored.
 * @returns A promise that resolves to an object indicating the success or failure of the operation.
 *          On success: `{ success: true, message: "Flashcard set was successfully created" }`.
 *          On failure: `{ success: false, message: string }` with an error message.
 */
export async function createFlashcards(
  title: string,
  formFile: File | null,
  inputText: string,
  folder_id?: string
) {
  try {
    if (!formFile && !inputText)
      throw new Error("No file nor text input provided");
    if (formFile && inputText)
      throw new Error("Both file and text input provided");

    let text;
    if (formFile) {
      const buffer = Buffer.from(await formFile.arrayBuffer());
      const converter = converterMap[formFile.type];
      if (!converter) throw new Error("Unsupported file type");
      text = await converter.convert(buffer);
    } else {
      text = inputText;
    }
    const result = await createFlashcardSet(text, title, folder_id);

    return {
      success: true,
      message: "Flashcard set was successfully created",
    };
  } catch (error) {
    console.error("Error creating flashcard set", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
