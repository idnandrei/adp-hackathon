"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { AnalyzeForm } from "@/components/analyze-form";
import { AnalysisResults } from "@/components/analysis-results";
import { analyzeText, type AnalysisResult } from "@/lib/mock-data";

export default function AnalyzePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [options, setOptions] = useState({
    includeSummary: true,
    includeChecklist: true,
    includeDeadlines: true,
    includeReply: true,
  });

  const handleAnalyze = async (
    text: string,
    opts: typeof options
  ) => {
    setIsLoading(true);
    setOptions(opts);
    try {
      const result = await analyzeText(text, opts);
      setResults(result);
    } catch {
      // Error handling would go here
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">Analyze Letter</h1>
            <p className="mt-1 text-muted-foreground">
              Paste your official letter below to decode it instantly.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <AnalyzeForm
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                isLoading={isLoading}
                hasResults={!!results}
              />
            </div>

            {/* Results Section */}
            <div>
              <AnalysisResults
                results={results}
                isLoading={isLoading}
                options={options}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
