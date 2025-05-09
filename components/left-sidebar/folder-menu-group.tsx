import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Folder as FolderIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameFolderDialog } from "../folder/rename-folder-dialog";
import { DeleteFolderDialog } from "../folder/delete-folder-dialog";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavComponent from "../utils/nav-component";
import ActionComponent from "../utils/action-component";
import { NavItem, ActionItem, DialogOption } from "@/types/left-side-bar";
import { CreateFolderDialog } from "../folder/create-folder-dialog";
import { SidebarMenuProps } from "./side-bar-menu-group";
import { Folder } from "@/types/folder";
import { createFolder } from "@/utils/folders/actions/create-folder";

export interface FolderMenuProps {
  folders: { id: string; name: string }[];
  onFoldersChange: (folders: { id: string; name: string }[]) => void;
}

export interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  active: DialogOption | null;
  setActive: (option: DialogOption) => void;
}

export function FolderMenuGroup({
  sidebarMenu,
  folderMenuProps: { folders = [], onFoldersChange },
  dialogProps: {
    open: dialogOpen,
    setOpen: setDialogOpen,
    active: activeDialog,
    setActive: setActiveDialog,
  },
}: {
  sidebarMenu: SidebarMenuProps;
  folderMenuProps: FolderMenuProps;
  dialogProps: DialogProps;
}) {
  const pathname = usePathname();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleSubmit = async (
    folder_name: string,
    parent_id: string = "00000000-0000-0000-0000-000000000000"
  ) => {
    const {
      success,
      message,
      content: newFolder,
    } = await createFolder(folder_name);

    if (success && newFolder) {
      onFoldersChange([...folders, newFolder]);
    }
    return { success, message };
  };

  const handleDeleteSuccess = (folderId: string) => {
    onFoldersChange(folders.filter((folder) => folder.id !== folderId));
  };

  const menuItems = [...sidebarMenu.menuItems];

  folders.forEach((folder) => {
    menuItems.unshift({
      component: "nav",
      item: {
        title: folder.name,
        href: `/protected/folders/${folder.id}`,
        icon: FolderIcon,
        options: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-accent rounded-md">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[100] w-fit p-0">
              <DropdownMenuItem
                className="flex items-center justify-center border border-border hover:bg-accent hover:!text-blue-300"
                onClick={() => {
                  setSelectedFolder(folder);
                  setActiveDialog(DialogOption.rename);
                  setDialogOpen(true);
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-center  border border-border hover:bg-accent hover:!text-blue-300"
                onClick={() => {
                  setSelectedFolder(folder);
                  setActiveDialog(DialogOption.delete);
                  setDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    });
  });

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
                        setActiveDialog(DialogOption.folder);
                        setDialogOpen(true);
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

      {dialogOpen && (
        <>
          {activeDialog === DialogOption.folder && (
            <CreateFolderDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSubmit={handleSubmit}
            />
          )}
          {selectedFolder && activeDialog === DialogOption.rename && (
            <RenameFolderDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              folder={selectedFolder}
              onSuccess={() => {}}
            />
          )}
          {selectedFolder && activeDialog === DialogOption.delete && (
            <DeleteFolderDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              folderId={selectedFolder.id}
              folderName={selectedFolder.name}
              onSuccess={() => handleDeleteSuccess(selectedFolder.id)}
            />
          )}
        </>
      )}
    </>
  );
}
