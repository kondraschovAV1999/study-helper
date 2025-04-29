import { LandingHeader } from "@/components/landing-header";
import LeftSidebar from "@/components/left-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Recents } from "@/components/recents";
import { mockRecentItems } from "@/data/mock-recents";
import { StudyGenerator } from "@/components/study-generator";
import { fetchUserFolders } from "../actions";

export default async function ProtectedPage() {
  const { content: folders } = await fetchUserFolders();
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader isProtectedPage={true} />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "12rem",
            "--sidebar-width-mobile": "12rem",
          } as React.CSSProperties
        }
      >
        <LeftSidebar />
        <main className="container mx-auto p-4 flex-1 flex flex-col">
          <div className="max-w-full mx-auto flex-1">
            <div>
              <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
              <p className="mb-8">
                Ready to study? Access your generated study materials or upload
                new documents to get started.
              </p>

              {mockRecentItems.length > 0 && (
                <div className="mb-8">
                  <Recents items={mockRecentItems} title="Recents" />
                </div>
              )}
            </div>
            <div className="mt-auto pb-8">
              <StudyGenerator folders={folders} />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
