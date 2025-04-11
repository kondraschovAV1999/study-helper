import ai from "./create-ai";
import chunkText from "./chunk-text";
import { Type } from "@google/genai";

const DEFAULT_MODEL = "gemini-2.0-flash-lite";

export type StudyGuidePart = {
  heading: string;
  summary: string;
  bulletPoints: string[];
  examples: string[];
};

const STUDY_GUIDE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      heading: {
        type: Type.STRING,
        description: "Section title or heading",
        nullable: false,
      },
      summary: {
        type: Type.STRING,
        description: "Brief summary of the section",
        nullable: false,
      },
      bulletPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Key points listed in the section",
        nullable: false,
      },
      examples: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Examples that illustrate the section content",
        nullable: false,
      },
    },
    required: ["heading", "summary", "bulletPoints", "examples"],
  },
};

const SYSTEM_INSTRUCTIONS = `
  You are an assistant designed to help students create learning materials from their notes.
  You will be given a one or more parts of notes.
  Your task is to create a study guide from the provided parts.
  The study guide should be structured and easy to follow, organizing the topics from the uploaded notes with clear headers,
  bullet points, examples, and other relevant details to help the student study effectively.
`.trim();

export default async function generateStudyGuideChunk({
  chunk,
}: {
  chunk: string;
}) {
  const chat = ai.chats.create({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
      responseSchema: STUDY_GUIDE_SCHEMA,
    },
  });

  const { text = "{}" } = await chat.sendMessage({ message: chunk });
  return text;
}

export async function generateStudyGuide(text: string) {
  const BATCH_SIZE = 5;
  const chunks = chunkText(text);
  const studyGuideParts: StudyGuidePart[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchResults = await Promise.all(
      chunks
        .slice(i, i + BATCH_SIZE)
        .map((chunk) => generateStudyGuideChunk({ chunk }))
    );

    studyGuideParts.push(
      ...batchResults.flatMap(
        (result) => JSON.parse(result) as StudyGuidePart[]
      )
    );
  }
  return { content: studyGuideParts };
}
