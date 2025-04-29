export type StudyGuide = {
  id: string;
  title: string;
  content: StudyGuidePart[];
};
export type StudyGuidePart = {
  heading: string;
  summary: string;
  bulletPoints: string[];
  examples: string[];
};
