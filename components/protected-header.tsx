import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions";

export async function ProtectedHeader() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <header className="w-full flex justify-between items-center p-4 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <h1 className="text-xl font-medium">
        Hello User!
      </h1>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {user.email} : Last signed in at {user.last_sign_in_at}
        </pre>
      </div>
      <form action={signOutAction}>
        <Button variant="ghost">Sign Out</Button>
      </form>
    </header>
  );
} 