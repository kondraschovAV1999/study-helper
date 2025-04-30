"use client";
import { Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogOption } from "@/types/left-side-bar";
import { JSX } from "react";
import { StudyGuide } from "@/types/study-guide";

export default function OperationsStudyGuide({
  studyGuide,
  setActiveDialog,
  setIsDialogOpen,
  Trigger,
}: {
  studyGuide: StudyGuide;
  setActiveDialog: (option: DialogOption) => void;
  setIsDialogOpen: (open: boolean) => void;
  Trigger: () => JSX.Element;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{Trigger()}</DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100] w-fit p-0">
        <DropdownMenuItem
          className="flex items-center justify-center border border-border hover:bg-accent hover:!text-blue-300"
          onClick={() => {
            setActiveDialog(DialogOption.rename);
            setIsDialogOpen(true);
          }}
        >
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-center  border border-border hover:bg-accent hover:!text-blue-300"
          onClick={() => {
            setActiveDialog(DialogOption.delete);
            setIsDialogOpen(true);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
