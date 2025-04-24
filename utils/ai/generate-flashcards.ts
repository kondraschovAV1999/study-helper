import ai from "./create-ai";
import { Type } from "@google/genai";
import { createClient } from "@/utils/supabase/server";

const DEFAULT_MODEL = "gemini-2.0-flash-lite";
const SYSTEM_INSTRUCTIONS = `
  You are an assistant designed to help students create learning materials from their notes.
  You will be given a peice of text.
  Your task is to create a set of flashcards from provided text.
  Flashcards should cover different topics from the provided text.
`.trim();

export type Flashcard = {
  question: string;
  answer: string;
};

const FLASHCARD_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "Front side of the flashcard. Contains the question",
        nullable: false,
      },
      answer: {
        type: Type.STRING,
        description: "Back side of the flashcard. Contains the answer",
        nullable: false,
      },
    },
    required: ["question", "answer"],
  },
};
export default async function generateFlashcards(
  text: string,
  count: number = 20
) {
  const chat = ai.chats.create({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
      responseSchema: FLASHCARD_SCHEMA,
    },
  });
  const { text: res = {} } = await chat.sendMessage({
    message: `Number of flashcards to be generated is ${count}` + text,
  });
  return res as Flashcard[];
}

export async function createFlashcardSet(
  text: string,
  set_title: string,
  p_folder_id?: string,
  p_study_guide_id?: string
) {
  const supabase = await createClient();
  const flashcards = await generateFlashcards(text);
  let { data, error: creat_flashcard_set_err } = await supabase.rpc(
    "create_flashcard_set",
    {
      flashcards,
      p_folder_id,
      p_study_guide_id,
      set_title,
    }
  );

  if (creat_flashcard_set_err) throw new Error(creat_flashcard_set_err.message);

  return data;
}
