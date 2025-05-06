"use server";
import { MaterialType } from "@/types/stugy-generator";
import { fetchFolderIdUnderRoot } from "../folders/fetch-folde-id-under-root";
import { createClient } from "../supabase/server";

export async function fetchRecents() {
  const supabase = await createClient();
  const STUDY_GUIDES_FOLDER = "Study Guides";
  const FLASHCARDS_FOLDER = "Flashcards";
  const QUIZZES_FOLDER = "Quizzes";
  try {
    const studyGuidesFolderId =
      await fetchFolderIdUnderRoot(STUDY_GUIDES_FOLDER);
    const flashcardsFolderId = await fetchFolderIdUnderRoot(FLASHCARDS_FOLDER);
    const quizzesFolderId = await fetchFolderIdUnderRoot(QUIZZES_FOLDER);

    const { data, error } = await supabase
      .from("folder")
      .select(
        `
      id,
      set (id, title),
      study_guide(id, title)
      `
      )
      .in("id", [studyGuidesFolderId, flashcardsFolderId, quizzesFolderId]);

    if (error) throw new Error(error.message);
    const result = data?.reduce(
      (acc: { type: MaterialType; id: string; title: string }[], folder) => {
        const items =
          folder.id === studyGuidesFolderId
            ? folder.study_guide.map((sg: { id: string; title: string }) => ({
                ...sg,
                type: MaterialType.study_guide,
              }))
            : folder.set.map((item: { id: string; title: string }) => ({
                ...item,
                type:
                  folder.id === flashcardsFolderId
                    ? MaterialType.flashcards
                    : MaterialType.practice_test,
              }));
        return acc.concat(items);
      },
      []
    );
    return {
      success: true,
      message: "Successfuly retrived objects from folders",
      content: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      content: [],
    };
  }
}
