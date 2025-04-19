import { Card } from "@/components/ui/card";
import { RecentItem } from "@/data/mock-recents";
import FlashcardsIcon from "@/components/flashcards-icon";
import PracticeIcon from "@/components/practice-icon";
import StudyGuideIcon from "@/components/study-guide-icon";
import Link from "next/link";

interface RecentsProps {
  items: RecentItem[];
  title?: string;
}

export function Recents({ items, title = "Recents" }: RecentsProps) {
  const getIcon = (type: RecentItem["type"]) => {
    switch (type) {
      case "Flashcard set":
        return <FlashcardsIcon/>;
      case "Practice test":
        return <PracticeIcon/>;
      case "Study guide":
        return <StudyGuideIcon />;
      default:
        return <StudyGuideIcon />;
    }
  };

  const getSubtitle = (item: RecentItem) => {
    switch (item.type) {
      case "Flashcard set":
        return `${item.type} • ${item.terms} terms`;
      case "Practice test":
        return `${item.type} • ${item.questions} questions`;
      case "Study guide":
        return item.type;
      default:
        return "";
    }
  };

  const getItemUrl = (item: RecentItem) => {
    switch (item.type) {
      case "Flashcard set":
        return `/flashcards/${item.id}`;
      case "Practice test":
        return `/practice-tests/${item.id}`;
      case "Study guide":
        return `/study-guides/${item.id}`;
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