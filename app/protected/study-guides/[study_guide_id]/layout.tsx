import { LandingHeader } from "@/components/landing-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default async function RootLayout({
  left_sidebar,
  main,
}: {
  left_sidebar: React.ReactNode;
  main: React.ReactNode;
}) {

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
        {left_sidebar}

        <main className="container mx-auto p-4 flex-1 flex flex-col">
          {main}
        </main>
      </SidebarProvider>
    </div>
  );
}
