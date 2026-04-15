import { Waitlist } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Be among the first clinics to get early access to hlth — clinic management built for independent practices.",
};

export default function WaitlistPage() {
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

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              Early access
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Join the waitlist
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Be among the first independent practices to get access when we
              launch. No spam — just your spot in line.
            </p>
          </div>

          {/* Clerk Waitlist */}
          <div className="flex justify-center">
            <Waitlist />
          </div>
        </div>
      </main>

      {/* Footer note */}
      <div className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} hlth OS. Built for independent
          practices.
        </p>
      </div>
    </div>
  );
}
