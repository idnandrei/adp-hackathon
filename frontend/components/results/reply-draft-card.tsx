"use client";

import { useState } from "react";
import { Copy, MessageSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/toast-provider";

interface ReplyDraftCardProps {
  initialDraft: string;
}

export function ReplyDraftCard({ initialDraft }: ReplyDraftCardProps) {
  const { showToast } = useToast();
  const [draft, setDraft] = useState(initialDraft);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    showToast("Reply draft copied to clipboard");
  };

  const handleReset = () => {
    setDraft(initialDraft);
    showToast("Draft reset to original", "info");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Reply Draft
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 gap-1.5 text-xs">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
            <Copy className="h-3 w-3" />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-[200px] resize-y font-mono text-sm"
          placeholder="Your reply draft will appear here..."
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Edit the draft above to customize your reply. Placeholders are shown in [BRACKETS].
        </p>
      </CardContent>
    </Card>
  );
}
