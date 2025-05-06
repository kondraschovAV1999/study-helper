import { LucideIcon } from "lucide-react";
import { JSX } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  options?: React.ReactNode;
}

export interface ActionItem {
  title: string;
  action: (isLoggedIn: boolean) => void;
  icon: JSX.ElementType;
}

export interface NavMenuItem {
  component: "nav";
  item: NavItem;
}

export interface ActionMenuItem {
  component: "action";
  item: ActionItem;
}

export enum DialogOption {
  folder = "folder",
  flashcards = "flashcards",
  rename = "rename",
  delete = "delete",
}

export type MenuItem = NavMenuItem | ActionMenuItem;
