"use client";

import { FolderOpen, Home, Plus, Book, Menu } from "lucide-react";
import FlashcardsIcon from "@/components/icons/flashcards-icon";
import PracticeIcon from "@/components/icons/practice-icon";
import StudyGuideIcon from "@/components/icons/study-guide-icon";
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { DialogOption, MenuItem } from "@/types/left-side-bar";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { FolderMenuGroup } from "./folder-menu-group";
import { SidebarMenuGroup } from "./side-bar-menu-group";
import { Folder } from "@/types/folder";

const sidebarMenus = {
  navigation: {
    title: "",
    menuItems: [
      {
        component: "nav",
        item: {
          title: "Home",
          href: "/protected",
          icon: Home,
        },
      },
      {
        component: "nav",
        item: {
          title: "My library",
          href: "/protected/library/study-guides",
          icon: FolderOpen,
        },
      },
    ] as MenuItem[],
  },
  folderItems: {
    title: "My folders",
    menuItems: [
      {
        component: "action",
        item: {
          title: "Create New",
          action: () => {},
          icon: Plus,
        },
      },
    ] as MenuItem[],
  },
  learning: {
    title: "Start here",
    menuItems: [
      {
        component: "action",
        item: {
          title: "Flashcards",
          action: () => {},
          icon: FlashcardsIcon,
        },
      },
      {
        component: "nav",
        item: {
          title: "Study Guides",
          href: "#",
          icon: StudyGuideIcon,
        },
      },
      {
        component: "nav",
        item: {
          title: "Practice Tests",
          href: "#",
          icon: PracticeIcon,
        },
      },
      {
        component: "nav",
        item: {
          title: "Expert Solutions",
          href: "#",
          icon: Book,
        },
      },
    ] as MenuItem[],
  },
};

export default function LeftSidebar({
  initialFolders,
}: {
  initialFolders: Folder[];
}) {
  const { toggleSidebar } = useSidebar();
  const [isFlashcardDialogOpen, setIsFlashcardDialogOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogOption | null>(null);

  const renderSidebarMenuButton = () => (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={toggleSidebar}>
        <Menu className="!w-6 !h-6" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const Divider = () => <hr className="border-t-2 border-border my-2 mx-2" />;

  return (
    <div className="flex">
      <div className="transition-all duration-300 ease-in-out fixed md:relative top-0 left-0 h-full z-50 bg-background border-r">
        <Sidebar collapsible="icon">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>{renderSidebarMenuButton()}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarMenuGroup
            sidebarMenu={sidebarMenus.navigation}
            dialogProps={{
              open: dialogOpen,
              setOpen: setDialogOpen,
              active: activeDialog,
              setActive: setActiveDialog,
            }}
          />
          <Divider />
          <FolderMenuGroup
            sidebarMenu={sidebarMenus.folderItems}
            dialogProps={{
              open: dialogOpen,
              setOpen: setDialogOpen,
              active: activeDialog,
              setActive: setActiveDialog,
            }}
            folderMenuProps={{
              folders,
              onFoldersChange: setFolders,
            }}
          />
          <Divider />
          <SidebarMenuGroup
            sidebarMenu={sidebarMenus.learning}
            dialogProps={{
              open: dialogOpen,
              setOpen: setDialogOpen,
              active: activeDialog,
              setActive: setActiveDialog,
            }}
          />
        </Sidebar>
      </div>

      <main className="flex-1 p-4">
        <button className="md:hidden mb-4" onClick={toggleSidebar}>
          <Menu size={34} />
        </button>
      </main>
    </div>
  );
}
