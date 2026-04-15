import { Hero } from "@/components/marketing/hero";
import { Problem } from "@/components/marketing/problem";
import { Features } from "@/components/marketing/features";
import { ProductPreview } from "@/components/marketing/product-preview";
import { Trust } from "@/components/marketing/trust";
import { CTA } from "@/components/marketing/cta";

export default function MarketingPage() {
  return (
    <main>
      <Hero />
      <Problem />
      <Features />
      <ProductPreview />
      <Trust />
      <CTA />
    </main>
  );
}
