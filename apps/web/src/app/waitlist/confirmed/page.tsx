import { CheckCircle2, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're on the list",
  description: "You've successfully joined the hlth waitlist.",
};

export default function WaitlistConfirmedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header */}
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <Activity className="size-4 text-primary" strokeWidth={2.5} />
            <span className="text-base tracking-tight">hlth OS</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="size-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            You&apos;re on the list
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Thanks for signing up. We&apos;ll reach out when your spot is ready.
            We&apos;re onboarding practices in order — you&apos;ll hear from us soon.
          </p>

          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5 text-left">
            <div className="text-sm font-semibold text-foreground mb-3">
              What happens next
            </div>
            <div className="flex flex-col gap-3">
              {[
                "We review your practice profile and prepare your workspace",
                "You get an invite email with setup instructions",
                "Onboarding takes less than a day — no IT team required",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <span className="text-[10px] font-semibold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
