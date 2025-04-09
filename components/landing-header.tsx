import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateMenu from "@/components/create-menu";
import { createClient } from "../utils/supabase/server";

export async function LandingHeader() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <header className="w-full flex justify-end p-4 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex gap-4">
        {/* Link to login page if user is not already signed in, if not dropdown menu for creating study materials */}
        <CreateMenu isLoggedIn={!!user && !error} />

        {/* Link to login page */}
        <Link href="/login">
          <Button className="text-base">Sign In</Button>
        </Link>
      </div>
    </header>
  );
}
