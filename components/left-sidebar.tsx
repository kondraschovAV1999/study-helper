"use client";
import { FolderOpen, Home, Plus, Book, Menu } from "lucide-react";
import FlashcardsIcon from "@/components/flashcards-icon";
import PracticeIcon from "@/components/practice-icon";
import StudyGuideIcon from "@/components/study-guide-icon";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

interface SidebarMenuGroupProps {
  sidebarMenu: {
    title: string;
    items: { title: string; url: string; icon: any }[];
  };
}

export function SidebarMenuGroup({ sidebarMenu }: SidebarMenuGroupProps) {
  return (
    <SidebarGroup>
      {sidebarMenu.title && (
        <SidebarGroupLabel>{sidebarMenu.title}</SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarMenu.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span className="ml-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const sidebarActions = {
  new_folder: {
    title: "Your folders",
    items: [
      {
        title: "New folder",
        url: "#",
        icon: Plus,
      },
    ],
  },
};

const sidebarMenus = {
  navigation: {
    title: "",
    items: [
      {
        title: "Home",
        url: "#",
        icon: Home,
      },
      {
        title: "Your library",
        url: "#",
        icon: FolderOpen,
      },
    ],
  },
  learning: {
    title: "Start here",
    items: [
      {
        title: "Flashcards",
        url: "#",
        icon: FlashcardsIcon,
      },
      {
        title: "Study Guides",
        url: "#",
        icon: StudyGuideIcon,
      },
      {
        title: "Practice Tests",
        url: "#",
        icon: PracticeIcon,
      },
      {
        title: "Expert Solutions",
        url: "#",
        icon: Book,
      },
    ],
  },
};

export default function LeftSidebar() {
  const { toggleSidebar } = useSidebar();

  const renderSidebarMenuButton = () => (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={toggleSidebar}>
        <Menu />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const renderNewFolderSection = () => (
    <SidebarGroup>
      <SidebarGroupLabel>{sidebarActions.new_folder.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarActions.new_folder.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton>
                <item.icon />
                <span className="ml-2">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const Divider = () => <hr className="border-t-2 border-border my-2 mx-2" />;

  return (
    <div className="flex">
      <div className="transition-all duration-300 ease-in-out fixed md:relative top-0 left-0 h-full z-40 bg-background border-r">
        <Sidebar collapsible="icon">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>{renderSidebarMenuButton()}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarMenuGroup sidebarMenu={sidebarMenus.navigation} />
          <Divider />
          {renderNewFolderSection()}
          <Divider />
          <SidebarMenuGroup sidebarMenu={sidebarMenus.learning} />
        </Sidebar>
      </div>

      <main className="flex-1 p-4">
        <button className="md:hidden mb-4" onClick={toggleSidebar}>
          <Menu />
        </button>
      </main>
    </div>
  );
}
