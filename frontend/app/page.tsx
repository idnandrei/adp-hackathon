import Link from "next/link";
import { ArrowRight, FileText, CheckSquare, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4" />
            Decode official letters in seconds
          </div>
          
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Understand Any Official Letter{" "}
            <span className="text-muted-foreground">Instantly</span>
          </h1>
          
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Paste confusing letters from schools, councils, insurers, or government agencies. 
            Get a plain-language summary, action checklist, key deadlines, and even a reply draft.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/analyze">
                Try it now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/history">View examples</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="mb-12 text-center text-2xl font-semibold md:text-3xl">
            What you get from every analysis
          </h2>
          
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<FileText className="h-5 w-5" />}
              title="Plain-Language Summary"
              description="Complex jargon translated into simple terms you can actually understand."
            />
            <FeatureCard
              icon={<CheckSquare className="h-5 w-5" />}
              title="Action Checklist"
              description="A clear list of what you need to do, with tags like Pay, Call, Submit, and Docs."
            />
            <FeatureCard
              icon={<Calendar className="h-5 w-5" />}
              title="Key Deadlines"
              description="Important dates extracted and ready to add to your calendar."
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Reply Draft"
              description="A starter template for responding to the letter, editable to your needs."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>Letter Decoder - A hackathon demo project</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
