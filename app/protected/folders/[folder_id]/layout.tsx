import { LandingHeader } from "@/components/landing-header";
import LeftSidebar from "@/components/left-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function FolderLayout({
  left_side_bar,
  folder,
}: Readonly<{
  left_side_bar: React.ReactNode;
  folder: React.ReactNode;
}>) {
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
        {left_side_bar}
        {folder}
      </SidebarProvider>
    </div>
  );
}
