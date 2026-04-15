import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cta } from "@/content/landing";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-primary dark:bg-secondary py-20 sm:py-24">
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          {cta.headline}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
          {cta.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link href={cta.primary.href}>{cta.primary.label}</Link>
          </Button>
          <Button asChild variant="default" size="lg">
            <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
