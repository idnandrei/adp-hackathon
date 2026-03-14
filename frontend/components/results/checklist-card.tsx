"use client";

import { useState } from "react";
import { Copy, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/toast-provider";
import { cn } from "@/lib/utils";

interface Action {
  id: string;
  text: string;
  tag: string;
}

interface ChecklistCardProps {
  actions: Action[];
}

const tagColors: Record<string, string> = {
  Pay: "bg-amber-100 text-amber-800",
  Call: "bg-blue-100 text-blue-800",
  Submit: "bg-emerald-100 text-emerald-800",
  Docs: "bg-slate-100 text-slate-800",
};

export function ChecklistCard({ actions }: ChecklistCardProps) {
  const { showToast } = useToast();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleCopy = () => {
    const text = actions.map(a => `[ ] ${a.text} (${a.tag})`).join("\n");
    navigator.clipboard.writeText(text);
    showToast("Checklist copied to clipboard");
  };

  const toggleChecked = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          Action Checklist
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
          <Copy className="h-3 w-3" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actions.map((action) => (
            <li key={action.id} className="flex items-start gap-3">
              <Checkbox
                id={action.id}
                checked={checked[action.id] || false}
                onCheckedChange={() => toggleChecked(action.id)}
                className="mt-0.5"
              />
              <label
                htmlFor={action.id}
                className={cn(
                  "flex-1 cursor-pointer text-sm leading-relaxed",
                  checked[action.id] && "text-muted-foreground line-through"
                )}
              >
                {action.text}
              </label>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  tagColors[action.tag] || "bg-muted text-muted-foreground"
                )}
              >
                {action.tag}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
