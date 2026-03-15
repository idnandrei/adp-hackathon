import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-4 -ml-2 gap-1"
            >
              <Link href="/history">
                <ArrowLeft className="h-4 w-4" />
                Back to History
              </Link>
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">Analysis {id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              History details are not available in the MVP yet.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
