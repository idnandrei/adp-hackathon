"use client";

import { Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/toast-provider";

interface SummaryCardProps {
  summary: string;
  keyPoints: string[];
}

export function SummaryCard({ summary, keyPoints }: SummaryCardProps) {
  const { showToast } = useToast();

  const handleCopy = () => {
    const text = `Summary:\n${summary}\n\nKey Points:\n${keyPoints.map(p => `• ${p}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    showToast("Summary copied to clipboard");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Summary
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
          <Copy className="h-3 w-3" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground">{summary}</p>
        
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Key Points</h4>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
