"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  FileUp,
  RotateCcw,
  Camera,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/toast-provider";

type AnalyzeOptions = {
  includeSummary: boolean;
  includeChecklist: boolean;
  includeDeadlines: boolean;
  includeReply: boolean;
};

interface AnalyzeFormProps {
  onAnalyze: (params: {
    emailContent?: string;
    letterText?: string;
    letterFile?: File | null;
    options: AnalyzeOptions;
  }) => void;
  onReset: () => void;
  isLoading: boolean;
  hasResults: boolean;
}

export function AnalyzeForm({
  onAnalyze,
  onReset,
  isLoading,
  hasResults,
}: AnalyzeFormProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"paste" | "pdf" | "photo">(
    "paste",
  );

  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [options, setOptions] = useState<AnalyzeOptions>({
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
    setActiveTab("paste");
    setUploadedFile(null);
    setText(sampleLetter);
    showToast("Sample letter loaded", "info");
  };

  const handleSubmit = () => {
    setError("");

    const hasFile = uploadedFile !== null;
    const hasText = Boolean(text.trim());

    if (activeTab === "paste") {
      if (!hasText) {
        setError("Please enter some text to analyze");
        return;
      }
      onAnalyze({
        emailContent: email,
        letterText: text,
        letterFile: null,
        options,
      });
      return;
    }

    // pdf/photo tabs: we send the file to backend for OCR
    if (!hasFile) {
      setError("Please upload a file to analyze");
      return;
    }

    onAnalyze({
      emailContent: email,
      letterFile: uploadedFile,
      options,
    });
  };

  const handleReset = () => {
    setActiveTab("paste");
    setEmail("");
    setText("");
    setError("");
    setUploadedFile(null);
    setIsExtracting(false);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (photoInputRef.current) photoInputRef.current.value = "";
    onReset();
  };

  const toggleOption = (key: keyof AnalyzeOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // UI-only: show "extracting" spinner; backend does real OCR.
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsExtracting(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsExtracting(false);
    showToast(`File ready: ${file.name}`, "success");
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    setActiveTab("pdf");
    setText(""); // enforce exclusive input mode
    handleFileUpload(file);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setActiveTab("photo");
    setText(""); // enforce exclusive input mode
    handleFileUpload(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setIsExtracting(false);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Optional Email Content Input */}
        <div className="space-y-2">
          <Label htmlFor="email-content" className="text-sm">
            Email content <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="email-content"
            placeholder="Paste the email that came with the attachment..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[80px] resize-y"
          />
          <p className="text-xs text-muted-foreground">
            Include the email body for additional context
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            const next = v as "paste" | "pdf" | "photo";
            setActiveTab(next);
            setError("");
            // enforce "text OR file"
            if (next === "paste") {
              clearFile();
            } else {
              setText("");
            }
          }}
        >
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
                <span
                  className={charCount > maxChars ? "text-destructive" : ""}
                >
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()}{" "}
                  characters
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
                    <p className="text-sm font-medium">Preparing...</p>
                    <p className="text-xs text-muted-foreground">
                      {uploadedFile.name}
                    </p>
                  </>
                ) : (
                  <>
                    <FileText className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      Ready to OCR on Analyze
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFile}
                      className="gap-1.5"
                    >
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
                <p className="text-xs text-muted-foreground">
                  or drag and drop
                </p>
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
                    <p className="text-sm font-medium">Preparing...</p>
                    <p className="text-xs text-muted-foreground">
                      {uploadedFile.name}
                    </p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      Ready to OCR on Analyze
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFile}
                      className="gap-1.5"
                    >
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
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, or HEIC
                </p>
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
                    checked={options[key as keyof AnalyzeOptions]}
                    onCheckedChange={() =>
                      toggleOption(key as keyof AnalyzeOptions)
                    }
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
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isExtracting}
            className="flex-1 gap-1.5"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                Analyzing...
              </>
            ) : isExtracting ? (
              <>
                <Spinner className="h-4 w-4" />
                Preparing...
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
