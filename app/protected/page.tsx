import { InfoIcon } from "lucide-react";
import { ProtectedHeader } from "@/components/protected-header";

export default async function ProtectedPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProtectedHeader />

      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <InfoIcon className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Protected Page</h2>
          </div>
          <div className="p-6 bg-card rounded-lg shadow">
            <p className="text-muted-foreground">
              This is a protected page. Only authenticated users can see this content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}