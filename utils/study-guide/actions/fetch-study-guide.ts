"use server";
import { StudyGuide, StudyGuidePart } from "@/types/study-guide";
import { fetchGenFileInfo } from "../fetch-gen-file";
import { createClient } from "@/utils/supabase/server";

export async function fetchStudyGuide(id: string) {
  const supabase = await createClient();
  try {
    const { data, error: fetch_err } = await supabase
      .from("study_guide")
      .select("title")
      .eq("id", id)
      .single();
    const title = data?.title as string;

    if (fetch_err) throw new Error(fetch_err.message);

    const genFileInfo = await fetchGenFileInfo(id);
    if (!genFileInfo)
      throw new Error(`Didn't find gen file for stugy guide with id=${id}`);

    const { data: file, error: file_err } = await supabase.storage
      .from(genFileInfo.bucket)
      .download(genFileInfo.name);

    if (file_err) throw new Error(file_err.message);

    const content: StudyGuidePart[] = JSON.parse(await file.text()).content;
    const studyGuide: StudyGuide = {
      id,
      title,
      content,
    };
    return {
      success: true,
      message: "Successfully fetched study guide",
      content: studyGuide,
    };
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: errorMessage,
      content: {
        id,
        title: "",
        content: [] as StudyGuidePart[],
      } as StudyGuide,
    };
  }
}
