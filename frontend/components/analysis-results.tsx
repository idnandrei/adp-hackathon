"use client";

import { Download, FileJson, FileText as FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SummaryCard } from "@/components/results/summary-card";
import { ChecklistCard } from "@/components/results/checklist-card";
import { DeadlinesCard } from "@/components/results/deadlines-card";
import { ReplyDraftCard } from "@/components/results/reply-draft-card";
import { useToast } from "@/components/toast-provider";

type Options = {
  includeSummary: boolean;
  includeChecklist: boolean;
  includeDeadlines: boolean;
  includeReply: boolean;
};

type ApiResponse = {
  results: Record<string, any>;
};

interface AnalysisResultsProps {
  results: ApiResponse | null;
  isLoading: boolean;
  options: Options;
}

function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileTextIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-semibold">No results yet</h3>
        <p className="text-sm text-muted-foreground">
          Provide a letter and click Analyze to see results here.
        </p>
      </CardContent>
    </Card>
  );
}

export function AnalysisResults({
  results,
  isLoading,
  options,
}: AnalysisResultsProps) {
  const { showToast } = useToast();

  const handleExportJSON = () => {
    if (!results) return;
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    showToast("JSON copied to clipboard");
  };

  const handleExportTXT = () => {
    showToast("Download started (mock)", "info");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Results</h2>
        </div>
        <ResultsSkeleton />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Results</h2>
        </div>
        <EmptyState />
      </div>
    );
  }

  const data = results.results ?? {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Results</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportJSON}>
              <FileJson className="mr-2 h-4 w-4" />
              Copy JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportTXT}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              Download TXT
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {options.includeSummary && typeof data.summary === "string" && (
          <SummaryCard summary={data.summary} keyPoints={[]} />
        )}

        {options.includeChecklist && Array.isArray(data.checklist) && (
          <ChecklistCard actions={data.checklist} />
        )}

        {options.includeDeadlines && Array.isArray(data.deadlines) && (
          <DeadlinesCard deadlines={data.deadlines} />
        )}

        {options.includeReply && typeof data.reply_draft === "string" && (
          <ReplyDraftCard initialDraft={data.reply_draft} />
        )}
      </div>
    </div>
  );
}
