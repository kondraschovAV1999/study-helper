"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Folder, Plus } from "lucide-react";
import FlashcardsIcon from "@/components/flashcards-icon";
import PracticeIcon from "@/components/practice-icon";
import StudyGuideIcon from "@/components/study-guide-icon";
import { MenuItem, NavItem, ActionItem } from "@/types/left-side-bar";
import NavComponent from "./nav-component";
import ActionComponent from "./action-component";
import { redirect } from "next/navigation";

const menuItems = [
  {
    component: "action",
    item: {
      title: "Flashcards",
      action: (isLoggedIn) => {
        if (!isLoggedIn) {
          redirect("/login");
        }
      },
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
] as MenuItem[];

export default function CreateMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Menubar className="p-0 border-none">
      <MenubarMenu>
        <MenubarTrigger className="py-2 border-border border-[1px] text-base hover:bg-accent hover:text-blue-300">
          <Plus /> <span className="ml-2">Create</span>
        </MenubarTrigger>
        <MenubarContent>
          {menuItems.map((menuItem) => (
            <MenubarItem key={menuItem.item.title}>
              {menuItem.component === "nav" ? (
                <NavComponent
                  item={menuItem.item as NavItem}
                  pathname=""
                  className="flex items-center space-x-2"
                />
              ) : (
                <ActionComponent
                  item={menuItem.item as ActionItem}
                  className="flex items-center space-x-2"
                  isLoggedIn={isLoggedIn}
                />
              )}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
