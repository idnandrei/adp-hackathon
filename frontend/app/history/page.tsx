import Link from "next/link";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHistoryData } from "@/lib/mock-data";
import { FileText, ChevronRight, Clock, CheckCircle, AlertCircle } from "lucide-react";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusConfig = {
  analyzed: {
    icon: CheckCircle,
    label: "Analyzed",
    variant: "default" as const,
  },
  pending: {
    icon: Clock,
    label: "Pending",
    variant: "secondary" as const,
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    variant: "destructive" as const,
  },
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">History</h1>
            <p className="mt-1 text-muted-foreground">
              View your past letter analyses.
            </p>
          </div>

          {mockHistoryData.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 font-semibold">No history yet</h3>
                <p className="text-sm text-muted-foreground">
                  Your analyzed letters will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mockHistoryData.map((item) => {
                const status = statusConfig[item.status];
                const StatusIcon = status.icon;
                return (
                  <Link key={item.id} href={`/history/${item.id}`}>
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-medium">{item.title}</h3>
                            <Badge variant={status.variant} className="shrink-0 gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {item.preview}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
