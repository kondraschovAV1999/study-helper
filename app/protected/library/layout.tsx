import { LandingHeader } from "@/components/landing-header";
import LeftSidebar from "@/components/left-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchUserFolders } from "@/app/actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="flex">
          <LeftSidebar initialFolders={folders} />
          <main className="flex-1 flex justify-center"> 
            <div className="w-full max-w-4xl p-4"> 
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}