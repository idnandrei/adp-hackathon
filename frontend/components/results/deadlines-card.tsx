"use client";

import { Copy, Calendar, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/toast-provider";
import { cn } from "@/lib/utils";

interface Deadline {
  date: string;
  label: string;
  confidence: "high" | "medium" | "low";
}

interface DeadlinesCardProps {
  deadlines: Deadline[];
}

const confidenceColors: Record<string, string> = {
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-800",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DeadlinesCard({ deadlines }: DeadlinesCardProps) {
  const { showToast } = useToast();

  const handleCopy = () => {
    const text = deadlines.map(d => `${formatDate(d.date)}: ${d.label}`).join("\n");
    navigator.clipboard.writeText(text);
    showToast("Deadlines copied to clipboard");
  };

  const handleAddToCalendar = (deadline: Deadline) => {
    showToast(`"${deadline.label}" added to calendar`, "info");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Key Deadlines
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
          <Copy className="h-3 w-3" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {deadlines.map((deadline, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{deadline.label}</p>
                <p className="text-xs text-muted-foreground">{formatDate(deadline.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    confidenceColors[deadline.confidence]
                  )}
                >
                  {deadline.confidence}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddToCalendar(deadline)}
                  className="h-8 w-8 p-0"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span className="sr-only">Add to calendar</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
