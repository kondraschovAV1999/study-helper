"use server";
import { Folder } from "@/types/folder";
import { RecentItem } from "@/types/recent";
import { MaterialType } from "@/types/stugy-generator";
import { createClient } from "@/utils/supabase/server";

export async function fetchFolder(id: string, parent_id?: string) {
  const supabase = await createClient();
  try {
    if (!parent_id) {
      let { data, error } = await supabase.rpc("get_folder_id_under_root", {
        target_folder_name: "My Folders",
      });
      if (error) throw new Error(error.message);
      parent_id = data;
    }

    const { data, error } = await supabase
      .from("folder")
      .select(
        `folder_in_folder:folder_in_folder!folder_id(id: folder_id, name: folder_name), 
        set (id, title, type),
        study_guide(id, title)
        `
      )
      .eq("id", id)
      .eq("folder_in_folder.parent_id", parent_id)
      .single();

    if (error) throw new Error(error.message);

    const studyGuides: RecentItem[] = data.study_guide.map((sg) => {
      return { ...sg, type: MaterialType.study_guide };
    });
    const sets: RecentItem[] = data.set.map((set) => {
      return {
        id: set.id,
        title: set.title,
        type:
          set.type === "flashcard"
            ? MaterialType.flashcards
            : MaterialType.practice_test,
      };
    });
    const result = {
      folder: {
        id: data.folder_in_folder[0].id as string,
        name: data.folder_in_folder[0].name as string,
      } as Folder,
      content: [...studyGuides, ...sets],
    };
    return {
      success: true,
      message: "Successfuly fetched folder",
      content: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      content: {
        folder: {
          id: "",
          name: "",
        } as Folder,
        content: [] as RecentItem[],
      },
    };
  }
}
