"use client";
import { FolderOpen, Home, Plus, Book, Menu, MoreVertical, Trash2 } from "lucide-react";
import { Folder as FolderIcon } from "lucide-react";
import FlashcardsIcon from "@/components/flashcards-icon";
import PracticeIcon from "@/components/practice-icon";
import StudyGuideIcon from "@/components/study-guide-icon";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FlashcardDialog } from "./flashcard-dialog";
import { fetchSubFolders, createFolder } from "../app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameFolderDialog } from "./rename-folder-dialog";
import { DeleteFolderDialog } from "./delete-folder-dialog";

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
import { CreateFolderDialog } from "./create-folder-dialog";

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
  folder = 'folder',
  flashcards = 'flashcards'
  rename = 'rename',
  delete = 'delete'
}

interface SidebarMenuProps {
  title: string;
  menuItems: MenuItem[];
}

export function SidebarMenuGroup({
  sidebarMenu,
}: {
  sidebarMenu: SidebarMenuProps;
}) {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [activeDialog, setActiveDialog] = useState<DialogOption | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>(null);
  const [subfolders, setSubfolders] = useState<{ id: string; name: string }[]>([]);

  const handleSubmit = async (
    folder_name: string,
    parent_id: string = "00000000-0000-0000-0000-000000000000"
  ) => {
    const { success, message } = await createFolder(folder_name);

    if (success) {
      await loadFolders();
    }
    return { success, message };
  };

  const loadFolders = async () => {
    const { success, message, content } = await fetchSubFolders("My Folders");

    if (!success) {
      console.error(message);
      return;
    }

    if (content) {
      setSubfolders(
        content.map((f) => ({
          id: f.folder_id,
          name: f.folder_name,
        }))
      );
    }

    const handleFlashcardAction = async (type: 'upload' | 'manual') => {
      if (type === 'upload') {
        // upload logic
      } else {
        // manual creation
      }
      setIsDialogOpen(false);
    };
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleRenameSuccess = () => {
    loadFolders();
  };

  const handleDeleteSuccess = () => {
    loadFolders();
  };

  const menuItems = [...sidebarMenu.menuItems];
  if (sidebarMenu.title === "My folders") {
    subfolders.forEach((folder) => {
      menuItems.unshift({
        component: "nav",
        item: {
          title: folder.name,
          href: `/folders/${folder.id}`,
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
                  }}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    setSelectedFolder(folder);
                    setActiveDialog(DialogOption.delete);
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
  }

  return (
    <>
    <SidebarGroup className="!text-xl">
      {/* ... existing group content ... */}
        <SidebarMenu>
          {menuItems.map((menuItem) => (
            <SidebarMenuItem key={menuItem.item.title}>
              <SidebarMenuButton asChild className="text-base">
                {menuItem.component === "nav" ? (
                  <NavComponent item={menuItem.item as NavItem} pathname={pathname} />
                ) : (
                  <ActionComponent
                    item={{
                      ...(menuItem.item as ActionItem),
                      action: () => {
                        if (sidebarMenu.title === "My folders") {
                          setActiveDialog(DialogOption.folder);
                          setIsDialogOpen(true);
                        } else if (menuItem.item.title === "Flashcards") {
                          setActiveDialog(DialogOption.flashcards);
                          setIsDialogOpen(true);
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

    {activeDialog === DialogOption.folder && (
      <CreateFolderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
      />

    )}

    {activeDialog === DialogOption.flashcards && (
      <FlashcardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateFromUpload={() => handleFlashcardAction('upload')} // upload logic
        onCreateManually={() => handleFlashcardAction('manual')} // manual creation logic
      />
    )}
  </>
);


      {selectedFolder && (
        <>
          <RenameFolderDialog
            open={isRenameDialogOpen}
            onOpenChange={setIsRenameDialogOpen}
            folderId={selectedFolder.id}
            currentName={selectedFolder.name}
            onSuccess={handleRenameSuccess}
          />
          <DeleteFolderDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            folderId={selectedFolder.id}
            folderName={selectedFolder.name}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </>
  );

}

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
          href: "#",
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

export default function LeftSidebar() {
  const { toggleSidebar } = useSidebar();
  const [isFlashcardDialogOpen, setIsFlashcardDialogOpen] = useState(false);

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

          <SidebarMenuGroup sidebarMenu={sidebarMenus.navigation} />
          <Divider />
          <SidebarMenuGroup sidebarMenu={sidebarMenus.folderItems} />
          <Divider />
          <SidebarMenuGroup sidebarMenu={sidebarMenus.learning} />
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
