"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, FileEdit } from "lucide-react";

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFromUpload: (formData: FormData) => Promise<{
    success: boolean;
    message: string;
  }>;
  onCreateManually: () => Promise<{
    success: boolean;
    message: string;
  }>;
}

export function FlashcardDialog({
  open,
  onOpenChange,
  onCreateFromUpload,
  onCreateManually,
}: FlashcardDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<"upload" | "manual" | null>(null);

  const handleFileUpload = async (formData: FormData) => {
    setIsLoading("upload");
    setError(null);
    const result = await onCreateFromUpload(formData);
    setIsLoading(null);
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.message || "Failed to create from upload");
    }
  };

  const handleManualCreate = async () => {
    setIsLoading("manual");
    setError(null);
    const result = await onCreateManually();
    setIsLoading(null);
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.message || "Failed to create manually");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            How do you want to create your flashcard set?
          </DialogTitle>
          {error && (
            <DialogDescription className="text-center text-destructive">
              {error}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Upload Option */}
          <form action={handleFileUpload}>
            <input
              type="file"
              name="file"
              id="flashcard-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.pptx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const formData = new FormData();
                  formData.append("file", e.target.files[0]);
                  handleFileUpload(formData);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center gap-2 h-24 w-full"
              onClick={() => document.getElementById('flashcard-upload')?.click()}
              disabled={isLoading === "upload"}
            >
              {isLoading === "upload" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  <span>Generate from an upload</span>
                </>
              )}
            </Button>
          </form>

          {/* Manual Option */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-24 w-full"
            onClick={handleManualCreate}
            disabled={isLoading === "manual"}
          >
            {isLoading === "manual" ? (
              <span>Preparing editor...</span>
            ) : (
              <>
                <FileEdit className="h-6 w-6" />
                <span>Create them yourself</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}