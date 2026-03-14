import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/results/summary-card";
import { ChecklistCard } from "@/components/results/checklist-card";
import { DeadlinesCard } from "@/components/results/deadlines-card";
import { ReplyDraftCard } from "@/components/results/reply-draft-card";
import { mockHistoryData, mockAnalysisResponse } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const historyItem = mockHistoryData.find((item) => item.id === id);

  if (!historyItem) {
    notFound();
  }

  // In a real app, we'd fetch the specific analysis results
  // For demo, we use the mock response
  const results = mockAnalysisResponse;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 gap-1">
              <Link href="/history">
                <ArrowLeft className="h-4 w-4" />
                Back to History
              </Link>
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">{historyItem.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Analyzed on{" "}
              {new Date(historyItem.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-4">
            <SummaryCard summary={results.summary} keyPoints={results.key_points} />
            <ChecklistCard actions={results.actions} />
            <DeadlinesCard deadlines={results.deadlines} />
            <ReplyDraftCard initialDraft={results.reply_draft} />
          </div>
        </div>
      </main>
    </div>
  );
}
