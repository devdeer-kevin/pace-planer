import Link from "next/link";
import { ReactNode } from "react";
import type { Metadata } from "next";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:
    "Pace Rechner Guide – Lauftempo kostenlos und werbefrei berechnen & verstehen | Pace Planer App",
  description:
    "Alles über Pace, Splits und Rennstrategien: Wie du Lauftempo berechnest, was Negative Split bedeutet und welche Pace du für deinen Marathon brauchst.",
  keywords: [
    "Pace Rechner",
    "Lauftempo berechnen",
    "Pace berechnen",
    "Negative Split",
    "Pace Tabelle",
    "Marathon Pace",
    "Laufstrategie",
    "Split Rechner",
  ],
  alternates: {
    canonical: "https://pace-planer.de/guide",
  },
  openGraph: {
    title: "Pace Rechner Guide – Lauftempo berechnen & verstehen",
    description:
      "Wie du Pace berechnest, was Negative Split bedeutet und welche Pace du für deinen Marathon brauchst.",
    url: "https://pace-planer.de/guide",
    siteName: "Pace Planer",
    locale: "de_DE",
    type: "article",
  },
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col items-center overflow-y-auto h-full w-full py-24 px-6">
      {children}
    </main>
  );
}
