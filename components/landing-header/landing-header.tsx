import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateDropdown from "@/components/utils/create-menu";
import { createClient } from "../../utils/supabase/server";
import { signOutAction } from "@/app/actions";

export async function LandingHeader({ isProtectedPage = false}: { isProtectedPage?: boolean }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <header className="w-full flex justify-end p-4 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex gap-4">
        {/* Link to login page if user is not already signed in, if not dropdown menu for creating study materials */}
        <CreateDropdown isLoggedIn={!!user} />

        { isProtectedPage || user ? (
          <form action={signOutAction}>
            <Button className="text-base" type="submit">
              Sign Out
            </Button>
          </form>
        ) : (
        <Link href="/login">
          <Button className="text-base">Sign In</Button>
        </Link>
        )}
      </div>
    </header>
  );
}
