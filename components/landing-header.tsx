
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="w-full flex justify-end p-4 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex gap-4">
        {/* Link to login page if user is not already signed in, if not dropdown menu for creating study materials */}
        <Link href="/login">
          <Button variant="ghost" className = "text-base px-4 py-2 h-11">
            + Create
            </Button>
        </Link>

        {/* Link to login page */}
        <Link href="/login">
          <Button size = "lg" className = "text-base">
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  );
}