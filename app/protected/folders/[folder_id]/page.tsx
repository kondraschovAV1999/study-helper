"use client";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useState, useEffect } from "react";
import { DialogOption } from "@/components/left-sidebar";
import { Folder } from "@/components/operations-folder";
import OperationsFolder from "@/components/operations-folder";
import { RenameFolderDialog } from "@/components/rename-folder-dialog";
import { DeleteFolderDialog } from "@/components/delete-folder-dialog";
import CreateDropdown from "@/components/create-menu";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";

export default function FolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params.folder_id as string;
  const supabase = createClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [activeDialog, setActiveDialog] = useState<
    DialogOption | "addStudyMaterials" | null
  >(null);
  const Trigger = () => (
    <Button className="rounded-full border-accent border-2 bg-background hover:bg-accent">
      <Ellipsis className="text-foreground" />
    </Button>
  );

  // This is solely for testing we'll rewvrite it with server actions later on
  useEffect(() => {
    const fetchData = async () => {
      const { data: folder, error: folder_err } = await supabase
        .from("folder_in_folder")
        .select("id:folder_id, name:folder_name")
        .eq("folder_id", folderId)
        .single();
      if (!folder_err) {
        setFolder(folder);
      } else {
        setFolder({
          id: "test",
          name: "test",
        });
      }
    };
    fetchData();
  }, [folderId, folder]);

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
        </div>
      </main>
      {folder && (
        <>
          {activeDialog === DialogOption.rename && (
            <RenameFolderDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              folderId={folder.id}
              currentName={folder.name}
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
