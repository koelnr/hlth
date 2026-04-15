import { SignIn } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your hlth account.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to your clinic workspace.
            </p>
          </div>

          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border border-border rounded-2xl bg-card p-6 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-border bg-background hover:bg-muted text-foreground text-sm font-medium rounded-lg h-10",
                  formFieldInput:
                    "border border-border bg-background rounded-lg text-sm h-10 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg h-10",
                  footerActionLink: "text-primary hover:text-primary/80",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground text-xs",
                  formFieldLabel: "text-sm font-medium text-foreground",
                  identityPreviewText: "text-foreground text-sm",
                  identityPreviewEditButtonIcon: "text-muted-foreground",
                },
              }}
            />
          </div>
        </div>
      </main>

      <div className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} hlth OS. Built for independent practices.
        </p>
      </div>
    </div>
  );
}
