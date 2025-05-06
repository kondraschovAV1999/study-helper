"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Folder } from "@/types/folder";
import { renameFolder } from "@/utils/folders/actions/rename-folder";

interface RenameFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder;
  onSuccess: () => void;
}

export function RenameFolderDialog({
  open,
  onOpenChange,
  folder,
  onSuccess,
}: RenameFolderDialogProps) {
  const [folderName, setFolderName] = useState(folder.name);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = folderName.trim();
    setError(null);
    const result = await renameFolder(folder.id, trimmedName);
    if (result.success) {
      folder.name = trimmedName;
      setFolderName("");
      onOpenChange(false);
      onSuccess();
    } else {
      setError(result.message || "Failed to rename folder");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
          setFolderName(folder.name);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>
            Enter a new name for your folder.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  setError(null);
                }}
                placeholder="Folder name"
                className={cn(
                  error && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!folderName.trim() || folderName === folder.name}
            >
              Rename folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
