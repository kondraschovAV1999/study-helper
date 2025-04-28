"use client";
import { usePathname } from "next/navigation";
import { FlashcardDialog } from "./flashcard-dialog";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavComponent from "./nav-component";
import ActionComponent, { ActionItem } from "./action-component";
import { NavItem } from "./nav-component";
import { DialogProps } from "./folder-menu-group";

export interface NavMenuItem {
  component: "nav";
  item: NavItem;
}

export interface ActionMenuItem {
  component: "action";
  item: ActionItem;
}

export type MenuItem = NavMenuItem | ActionMenuItem;

export enum DialogOption {
  folder = "folder",
  flashcards = "flashcards",
  rename = "rename",
  delete = "delete",
}

export interface SidebarMenuProps {
  title: string;
  menuItems: MenuItem[];
}

export function SidebarMenuGroup({
  sidebarMenu,
  dialogProps: {
    open: dialogOpen,
    setOpen: setDialogOpen,
    active: activeDialog,
    setActive: setActiveDialog,
  },
}: {
  sidebarMenu: SidebarMenuProps;
  dialogProps: DialogProps;
}) {
  const pathname = usePathname();
  const menuItems = [...sidebarMenu.menuItems];

  return (
    <>
      <SidebarGroup className="!text-xl">
        <SidebarMenu>
          {menuItems.map((menuItem) => (
            <SidebarMenuItem key={menuItem.item.title}>
              <SidebarMenuButton asChild className="text-base">
                {menuItem.component === "nav" ? (
                  <NavComponent
                    item={menuItem.item as NavItem}
                    pathname={pathname}
                  />
                ) : (
                  <ActionComponent
                    item={{
                      ...(menuItem.item as ActionItem),
                      action: () => {
                        if (menuItem.item.title === "Flashcards") {
                          setActiveDialog(DialogOption.flashcards);
                          setDialogOpen(true);
                        } else {
                          (menuItem.item as ActionItem).action(true);
                        }
                      },
                    }}
                    isLoggedIn={true}
                  />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {dialogOpen && activeDialog === DialogOption.flashcards && (
        <FlashcardDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCreateFromUpload={() => handleFlashcardAction("upload")}
          onCreateManually={() => handleFlashcardAction("manual")}
        />
      )}
    </>
  );
}
