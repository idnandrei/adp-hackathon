"use client";

import { useState, useRef } from "react";
import { Sparkles, FileUp, RotateCcw, Camera, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { sampleLetter } from "@/lib/mock-data";
import { useToast } from "@/components/toast-provider";

interface AnalyzeFormProps {
  onAnalyze: (
    text: string,
    options: {
      includeSummary: boolean;
      includeChecklist: boolean;
      includeDeadlines: boolean;
      includeReply: boolean;
    }
  ) => void;
  onReset: () => void;
  isLoading: boolean;
  hasResults: boolean;
}

export function AnalyzeForm({ onAnalyze, onReset, isLoading, hasResults }: AnalyzeFormProps) {
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [options, setOptions] = useState({
    includeSummary: true,
    includeChecklist: true,
    includeDeadlines: true,
    includeReply: true,
  });
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const charCount = text.length;
  const maxChars = 10000;

  const handleUseSample = () => {
    setText(sampleLetter);
    showToast("Sample letter loaded", "info");
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }
    setError("");
    onAnalyze(text, options);
  };

  const handleReset = () => {
    setText("");
    setError("");
    onReset();
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileUpload = async (file: File, type: "pdf" | "photo") => {
    setUploadedFile(file);
    setIsExtracting(true);
    setError("");
    
    // Simulate text extraction delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For prototype: simulate extracted text
    const extractedText = type === "pdf" 
      ? `[Extracted from PDF: ${file.name}]\n\n${sampleLetter}`
      : `[Extracted from photo: ${file.name}]\n\n${sampleLetter}`;
    
    setText(extractedText);
    setIsExtracting(false);
    showToast(`Text extracted from ${file.name}`, "success");
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
      handleFileUpload(file, "pdf");
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      handleFileUpload(file, "photo");
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setText("");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="paste">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paste">Paste text</TabsTrigger>
            <TabsTrigger value="pdf">
              <FileUp className="mr-1.5 h-3 w-3" />
              Upload PDF
            </TabsTrigger>
            <TabsTrigger value="photo">
              <Camera className="mr-1.5 h-3 w-3" />
              Upload Photo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="paste" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="letter-text" className="text-sm">
                  Letter content
                </Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleUseSample}
                  className="h-auto p-0 text-xs"
                >
                  Use sample letter
                </Button>
              </div>
              <Textarea
                id="letter-text"
                placeholder="Paste your official letter here..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError("");
                }}
                className="min-h-[200px] resize-y"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className={charCount > maxChars ? "text-destructive" : ""}>
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
                </span>
                {error && <span className="text-destructive">{error}</span>}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="pdf" className="mt-3">
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfSelect}
              className="hidden"
              id="pdf-upload"
            />
            {uploadedFile && uploadedFile.type === "application/pdf" ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-border bg-muted/30">
                {isExtracting ? (
                  <>
                    <Spinner className="mb-2 h-8 w-8" />
                    <p className="text-sm font-medium">Extracting text...</p>
                    <p className="text-xs text-muted-foreground">{uploadedFile.name}</p>
                  </>
                ) : (
                  <>
                    <FileText className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">Text extracted successfully</p>
                    <Button variant="outline" size="sm" onClick={clearFile} className="gap-1.5">
                      <X className="h-3 w-3" />
                      Remove file
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <label
                htmlFor="pdf-upload"
                className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-center transition-colors hover:bg-muted/50 hover:border-primary/50"
              >
                <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload PDF</p>
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </label>
            )}
          </TabsContent>
          <TabsContent value="photo" className="mt-3">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
              id="photo-upload"
            />
            {uploadedFile && uploadedFile.type.startsWith("image/") ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-border bg-muted/30">
                {isExtracting ? (
                  <>
                    <Spinner className="mb-2 h-8 w-8" />
                    <p className="text-sm font-medium">Running OCR...</p>
                    <p className="text-xs text-muted-foreground">{uploadedFile.name}</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">Text extracted successfully</p>
                    <Button variant="outline" size="sm" onClick={clearFile} className="gap-1.5">
                      <X className="h-3 w-3" />
                      Remove file
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-center transition-colors hover:bg-muted/50 hover:border-primary/50"
              >
                <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload photo</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, or HEIC</p>
              </label>
            )}
          </TabsContent>
        </Tabs>

        {/* Options */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="space-y-2">
            <Label className="text-sm">Include in output</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "includeSummary", label: "Summary" },
                { key: "includeChecklist", label: "Checklist" },
                { key: "includeDeadlines", label: "Deadlines" },
                { key: "includeReply", label: "Reply Draft" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Switch
                    id={key}
                    checked={options[key as keyof typeof options]}
                    onCheckedChange={() => toggleOption(key as keyof typeof options)}
                  />
                  <Label htmlFor={key} className="text-sm font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-border pt-4">
          {hasResults && (
            <Button type="button" variant="outline" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 gap-1.5"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
