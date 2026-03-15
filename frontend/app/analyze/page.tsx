"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { AnalyzeForm } from "@/components/analyze-form";
import { AnalysisResults } from "@/components/analysis-results";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

console.log("BACKEND_URL:", BACKEND_URL);
console.log("POST URL:", `${BACKEND_URL}/api/v1/analyses`);

type Options = {
  includeSummary: boolean;
  includeChecklist: boolean;
  includeDeadlines: boolean;
  includeReply: boolean;
};

type ApiResponse = { results: Record<string, any> };

async function analyzeWithBackend(params: {
  letterText?: string;
  letterFile?: File | null;
  options: Options;
}): Promise<ApiResponse> {
  const form = new FormData();

  form.append("summary", String(params.options.includeSummary));
  form.append("checklist", String(params.options.includeChecklist));
  form.append("deadlines", String(params.options.includeDeadlines));
  form.append("reply_draft", String(params.options.includeReply));

  if (params.letterFile) {
    form.append("letter_file", params.letterFile);
  } else {
    form.append("letter_text", (params.letterText ?? "").trim());
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/analyses`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Backend error ${res.status}: ${msg}`);
  }

  return res.json();
}

export default function AnalyzePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [options, setOptions] = useState<Options>({
    includeSummary: true,
    includeChecklist: true,
    includeDeadlines: true,
    includeReply: true,
  });

  const handleAnalyze = async (params: {
    letterText?: string;
    letterFile?: File | null;
    options: Options;
  }) => {
    setIsLoading(true);
    setOptions(params.options);
    try {
      const result = await analyzeWithBackend(params);
      setResults(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => setResults(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">Analyze Letter</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <AnalyzeForm
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                isLoading={isLoading}
                hasResults={!!results}
              />
            </div>

            <div>
              <AnalysisResults
                results={results as any}
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
