import { FolderOpen } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Your library</h1>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b mb-6">
        <Link href="#" className="px-4 py-2 font-medium border-b-2 border-black">
          Flashcard sets
        </Link>
        <Link href="#" className="px-4 py-2 font-medium text-gray-500">
          Practice tests
        </Link>
        <Link href="#" className="px-4 py-2 font-medium text-gray-500">
          Study guides
        </Link>
        <Link href="#" className="px-4 py-2 font-medium text-gray-500">
          Expert solutions
        </Link>
        <Link href="#" className="px-4 py-2 font-medium text-gray-500">
          Folders
        </Link>
      </div>

      {/* Content section */}
      <div className="border-2 border-dashed rounded-lg p-12 text-center">
        <h2 className="text-xl font-medium mb-2">
          Generate study guides from your notes and other materials.
        </h2>
        <button className="mt-4 px-4 py-2 bg-black text-white rounded-md">
          Start uploading
        </button>
      </div>
    </>
  );
}