"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nav, brand } from "@/content/landing";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Activity className="size-4 text-primary" strokeWidth={2.5} />
          <span className="text-base tracking-tight">{brand.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild size="sm" className="px-4">
            <Link href={nav.cta.href}>{nav.cta.label}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background transition-all duration-200 md:hidden",
          open ? "max-h-96" : "max-h-0 border-transparent"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Button asChild size="sm" className="w-full">
              <Link href={nav.cta.href} onClick={() => setOpen(false)}>
                {nav.cta.label}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
