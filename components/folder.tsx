"use client";
import { Button } from "@/components/ui/button";
import { Ellipsis, Link } from "lucide-react";
import { useState, useEffect } from "react";
import { DialogOption } from "@/types/left-side-bar";
import OperationsFolder from "@/components/operations-folder";
import { RenameFolderDialog } from "@/components/rename-folder-dialog";
import { DeleteFolderDialog } from "@/components/delete-folder-dialog";
import CreateDropdown from "@/components/create-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Folder } from "@/types/folder";

import { Recents } from "@/components/recents";
import { RecentItem } from "@/types/recent";

export default function FolderComponent({
  props,
}: {
  props: { folder: Folder; content: RecentItem[] };
}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folder, setFolder] = useState<Folder | null>(props.folder);
  const [activeDialog, setActiveDialog] = useState<
    DialogOption | "addStudyMaterials" | null
  >(null);
  const Trigger = () => (
    <Button className="rounded-full border-accent border-2 bg-background hover:bg-accent">
      <Ellipsis className="text-foreground" />
    </Button>
  );

  return (
    <>
      <main className="container mx-auto p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between w-2/3 mx-auto">
            <h1 className="text-2xl font-bold mb-4">{folder?.name}</h1>
            {folder && (
              <OperationsFolder
                folder={folder}
                setActiveDialog={setActiveDialog}
                setSelectedFolder={setFolder}
                setIsDialogOpen={setIsDialogOpen}
                Trigger={Trigger}
              />
            )}
          </div>
          {props.content ? (
            <div className="w-2/3 mx-auto">
              <Recents items={props.content} title="" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 mt-5 mx-auto bg-accent w-2/3 px-5 py-10 items-center rounded-xl">
              <p>Let's start building your folder</p>
              <Button
                className="rounded-full w-1/5"
                onClick={() => {
                  setActiveDialog("addStudyMaterials");
                  setIsDialogOpen(true);
                }}
              >
                Add study materials
              </Button>
            </div>
          )}
        </div>
      </main>
      {folder && (
        <>
          {activeDialog === DialogOption.rename && (
            <RenameFolderDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              folder={folder}
              onSuccess={() => {
                router.push(`/protected/folders/${folder.id}`);
              }}
            />
          )}
          {activeDialog === DialogOption.delete && (
            <DeleteFolderDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              folderId={folder.id}
              folderName={folder.name}
              onSuccess={() => {
                router.push("/protected");
              }}
            />
          )}
        </>
      )}
      {activeDialog === "addStudyMaterials" && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
            }
            setIsDialogOpen(open);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl">
                Add study materials
              </DialogTitle>
            </DialogHeader>
            <div className="mx-auto flex flex-col justify-center items-center p-4">
              <p className="pb-4">
                You haven't created or studied any items yet
              </p>
              <CreateDropdown isLoggedIn={true} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
