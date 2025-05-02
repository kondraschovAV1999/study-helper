"use client";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const triggerStyle = (isActive: boolean) => {
  return `
        ${isActive ? "font-semibold border-b-2 border-blue-400" : ""}
        px-4 py-2 font-medium
      `;
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const flashcarsPath = "/protected/library/flashcards";
  const parcticeTestsPath = "/protected/library/practice-tests";
  const studyGuidesPath = "/protected/library/study-guides";
  const foldersPath = "/protected/library/folders";
  console.log(path);
  return (
    <div className="w-2/3 mx-auto">
      <div className="flex items-center gap-2 mb-6 ">
        <FolderOpen className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Your library</h1>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b mb-6">
        <Link
          href={flashcarsPath}
          className={triggerStyle(path === flashcarsPath)}
        >
          Flashcard sets
        </Link>
        <Link
          href={parcticeTestsPath}
          className={triggerStyle(path === parcticeTestsPath)}
        >
          Practice tests
        </Link>
        <Link
          href={studyGuidesPath}
          className={triggerStyle(path === studyGuidesPath)}
        >
          Study guides
        </Link>
        <Link href="*" className="px-4 py-2 font-medium">
          Expert solutions
        </Link>
        <Link href={foldersPath} className={triggerStyle(path === foldersPath)}>
          Folders
        </Link>
      </div>

      {/* Content section */}
      {children}
    </div>
  );
}
