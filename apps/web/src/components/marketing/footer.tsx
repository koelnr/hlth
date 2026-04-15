import Link from "next/link";
import { Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { brand, footer } from "@/content/landing";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground w-fit">
              <Activity className="size-4 text-primary" strokeWidth={2.5} />
              <span className="text-base tracking-tight">{brand.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              {footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <div className="text-sm font-semibold text-foreground">{col.title}</div>
              <nav className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for independent practices.
          </p>
        </div>
      </div>
    </footer>
  );
}
