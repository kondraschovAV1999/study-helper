import { LandingHeader } from "@/components/landing-header";
import LeftSidebar from "@/components/left-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function FolderLayout({
  children,
  left_side_bar,
}: Readonly<{
  children: React.ReactNode;
  left_side_bar: React.ReactNode;
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
        {children}
      </SidebarProvider>
    </div>
  );
}
