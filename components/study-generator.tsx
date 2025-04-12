"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ListChecks, FileText, Upload } from "lucide-react";
import { useState } from "react";

export function StudyGenerator() {
  const [inputText, setInputText] = useState("");
  const [materialType, setMaterialType] = useState<"flashcards" | "practice-test" | "study-guide">("flashcards");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleGenerate = () => {
    console.log({
      materialType,
      text: inputText,
      file: selectedFile
    });
  };

  return (
    <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Generate a </h2>
            <div className="w-[220px]">
            <Select 
                value={materialType} 
                onValueChange={(value: "flashcards" | "practice-test" | "study-guide") => 
                setMaterialType(value)
                }
            >
                <SelectTrigger>
                <SelectValue asChild>
                    <div className="flex items-center gap-2">
                    {materialType === "flashcards" && <FileText className="h-4 w-4" />}
                    {materialType === "practice-test" && <ListChecks className="h-4 w-4" />}
                    {materialType === "study-guide" && <BookOpen className="h-4 w-4" />}
                    <span>
                        {materialType === "flashcards" && "Flashcard Set"}
                        {materialType === "practice-test" && "Practice Test"}
                        {materialType === "study-guide" && "Study Guide"}
                    </span>
                    </div>
                </SelectValue>
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="flashcards" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Flashcard Set
                </SelectItem>
                <SelectItem value="practice-test" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" /> Practice Test
                </SelectItem>
                <SelectItem value="study-guide" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Study Guide
                </SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

      <div className="space-y-6">
        <div>
          <div className="relative">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                "Put your notes here, we'll do the rest."
              }
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
                accept=".pdf,.doc,.docx,.txt,.md,.pptx"
            />
            <Button
                variant="outline"
                className="gap-2"
                asChild
            >
                <label htmlFor="file-upload" className="cursor-pointer flex items-center">
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
                disabled={!inputText && !selectedFile}
            >
                {materialType === "flashcards" && "Generate Flashcards"}
                {materialType === "practice-test" && "Create Practice Test"}
                {materialType === "study-guide" && "Generate Study Guide"}
            </Button>
            </div>
        </div>
    </div>
</Card>
);
}