export type RecentItem = {
    id: string;
    title: string;
    type: "Flashcard set" | "Study guide" | "Practice test";
    terms?: number; // For flashcard sets
    questions?: number; // For practice tests
    updatedAt?: Date; // For sorting
  };
  
  // mock data for recent items
  export const mockRecentItems: RecentItem[] = [
    {
      id: "1",
      title: "Agile Software Development Principles Flashcards",
      type: "Flashcard set",
      terms: 87,
    },
    {
      id: "2",
      title: "Software Process Models Overview Flashcards",
      type: "Flashcard set",
      terms: 113,
    },
    {
      id: "3",
      title: "Software Engineering Fundamentals Practice Test",
      type: "Practice test",
      questions: 45,
    },
    {
      id: "4",
      title: "Agile Development Study Guide",
      type: "Study guide",
    },
    {
      id: "5",
      title: "Process Models Study Guide",
      type: "Study guide",
    },
    {
      id: "6",
      title: "Database Design Practice Test",
      type: "Practice test",
      questions: 30,
    },
  ];