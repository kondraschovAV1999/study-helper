"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Plus } from "lucide-react";
import FlashcardsIcon from "@/components/flashcards-icon";
import PracticeIcon from "@/components/practice-icon";
import StudyGuideIcon from "@/components/study-guide-icon";
import { MenuItem } from "./left-sidebar";
import NavComponent, { NavItem } from "./nav-component";
import ActionComponent, { ActionItem } from "./action-component";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

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

export default function CreateDropdown({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="py-2 border-border border-[1px] text-base hover:bg-accent hover:text-blue-300 bg-background text-foreground">
          <Plus /> <span className="ml-2">Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menuItems.map((menuItem) => (
          <DropdownMenuItem key={menuItem.item.title}>
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
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
