"use client";

import * as React from "react";
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

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (folderName: string) => Promise<{ success: boolean; error?: string }>;
}

export function CreateFolderDialog({ open, onOpenChange, onSubmit }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = folderName.trim();
    setError(null);
    const result = await onSubmit(trimmedName);
    if (result.success) {
      setFolderName("");
      onOpenChange(false);
    } else {
      setError(result.error || "Failed to create folder");
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
          setFolderName("");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
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
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!folderName.trim()}>
              Create folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 