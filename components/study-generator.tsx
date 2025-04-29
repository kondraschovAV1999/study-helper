"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, ListChecks, FileText, Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { createStudyGuide } from "@/app/actions";
import { MaterialType } from "@/types/stugy-generator";

export function StudyGenerator({
  folders,
}: {
  folders: { id: string; name: string }[];
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [materialType, setMaterialType] = useState<MaterialType>(
    MaterialType.flashcards
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<
    string | undefined
  >();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    const { success, message } = await createStudyGuide({
      title,
      formFile: selectedFile,
      inputText,
    });
    setIsLoading(false);
    if (!success) {
      setError(message);
      return;
    }

    setSuccess(message);
    setError("");
    setSelectedFile(null);
    setInputText("");
    setTitle("");
    setMaterialType(MaterialType.flashcards);
  };

  return (
    <Card className="p-6">
      {error && <p className=" text-destructive">{error}</p>}
      {success && <p className=" text-blue-400">{success}</p>}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Generate a </h2>
        <div className="w-[220px]">
          <Select
            value={materialType}
            onValueChange={(value: MaterialType) => setMaterialType(value)}
          >
            <SelectTrigger>
              <SelectValue asChild>
                <div className="flex items-center gap-2">
                  {materialType === MaterialType.flashcards && (
                    <FileText className="h-4 w-4" />
                  )}
                  {materialType === MaterialType.practice_test && (
                    <ListChecks className="h-4 w-4" />
                  )}
                  {materialType === MaterialType.study_guide && (
                    <BookOpen className="h-4 w-4" />
                  )}
                  <span>
                    {materialType === MaterialType.flashcards &&
                      "Flashcard Set"}
                    {materialType === MaterialType.practice_test &&
                      "Practice Test"}
                    {materialType === MaterialType.study_guide && "Study Guide"}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="flashcards"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> Flashcard Set
              </SelectItem>
              <SelectItem
                value="practice-test"
                className="flex items-center gap-2"
              >
                <ListChecks className="h-4 w-4" /> Practice Test
              </SelectItem>
              <SelectItem
                value="study-guide"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" /> Study Guide
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="block p-1">
          <Input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          {folders.length !== 0 && (
            <Select
              value={selectedFolderId}
              onValueChange={setSelectedFolderId}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a Folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
                {folders.length === 0 && (
                  <SelectItem disabled value="">
                    No folders available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="relative">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"Put your notes here, we'll do the rest."}
              className="min-h-[200px]"
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              {inputText.length}/10,000 characters
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              name="file"
              accept=".pdf,.doc,.docx,.txt,.md,.pptx"
            />
            <Button variant="outline" className="gap-2" asChild>
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </label>
            </Button>
            {selectedFile && (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setInputText("");
                setSelectedFile(null);
              }}
              disabled={!inputText && !selectedFile}
            >
              Clear
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (!inputText && !selectedFile)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" /> // Show loader if isLoading is true
              ) : (
                <>
                  {materialType === MaterialType.flashcards &&
                    "Generate Flashcards"}
                  {materialType === MaterialType.practice_test &&
                    "Create Practice Test"}
                  {materialType === MaterialType.study_guide &&
                    "Generate Study Guide"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
