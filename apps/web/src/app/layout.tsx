import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "hlth — Clinic management for independent practices",
    template: "%s | hlth",
  },
  description:
    "hlth gives independent doctors and small clinics a clean, organized workspace for appointments, patients, staff, and daily operations.",
  metadataBase: new URL("https://hlth.app"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(spaceGrotesk.variable)}>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
