"use client";
import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";
import OperationsStudyGuide, { StudyGuide } from "./operations-study-guide";
import { DialogOption } from "./left-sidebar";
import { useState } from "react";

export default function StudyGuideComponent({
  studyGuide,
}: {
  studyGuide: StudyGuide;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //   const [folder, setFolder] = useState<Folder | null>(null);
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
      <div className="p-6">
        <div className="flex items-center justify-between pb-10">
          <div className="text-2xl">{studyGuide.title}</div>
          <OperationsStudyGuide
            studyGuide={studyGuide}
            setActiveDialog={setActiveDialog}
            setIsDialogOpen={setIsDialogOpen}
            Trigger={Trigger}
          />
        </div>
        <div className="space-y-6">
          {studyGuide.content.map((part, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{part.heading}</h2>
              <p className="mb-2">{part.summary}</p>
              <ul className="list-disc list-inside mb-2">
                {part.bulletPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside">
                  {part.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
