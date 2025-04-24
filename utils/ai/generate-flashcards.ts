import ai from "./create-ai";
import { Type } from "@google/genai";

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
export default async function generateFlashcards({
  text,
  count = 20,
}: {
  text: string;
  count?: number;
}) {
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
