// components/landing-header.tsx (new custom header)
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="w-full flex justify-end p-4 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex gap-4">
        <Link href="/auth?signup=true">
          <Button variant="ghost">+ Create</Button>
        </Link>
        <Link href="/auth">
          <Button>Log In</Button>
        </Link>
      </div>
    </header>
  );
}