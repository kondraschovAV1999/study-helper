import { Card } from "@/components/ui/card";

import FlashcardsIcon from "@/components/flashcards-icon";
import PracticeIcon from "@/components/practice-icon";
import StudyGuideIcon from "@/components/study-guide-icon";
import Link from "next/link";
import { MaterialType } from "@/types/stugy-generator";
import { RecentItem } from "@/types/recent";

interface RecentsProps {
  items: RecentItem[];
  title?: string;
}

export function Recents({ items, title = "Recents" }: RecentsProps) {
  const getIcon = (type: MaterialType) => {
    switch (type) {
      case MaterialType.flashcards:
        return <FlashcardsIcon />;
      case MaterialType.practice_test:
        return <PracticeIcon />;
      case MaterialType.study_guide:
        return <StudyGuideIcon />;
    }
  };

  const getSubtitle = (item: RecentItem) => {
    switch (item.type) {
      case MaterialType.flashcards:
        return "Flashcard set";
      case MaterialType.practice_test:
        return "Practice test";
      case MaterialType.study_guide:
        return "Study guide";
      default:
        return "";
    }
  };

  const getItemUrl = (item: RecentItem) => {
    switch (item.type) {
      case MaterialType.flashcards:
        return `/protected/flashcards/${item.id}`;
      case MaterialType.practice_test:
        return `/protected/practice-tests/${item.id}`;
      case MaterialType.study_guide:
        return `/protected/study-guides/${item.id}`;
      default:
        return "#";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={getItemUrl(item)}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="mt-1">{getIcon(item.type)}</div>
            <div className="flex-1">
              <h3 className="font-medium leading-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {getSubtitle(item)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
