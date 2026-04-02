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

const anchors = [
  { label: "Was ist Pace?", href: "#was-ist-pace" },
  { label: "Pace berechnen", href: "#pace-berechnen" },
  { label: "Zielzeit", href: "#zielzeit-berechnen" },
  { label: "Distanz", href: "#distanz-berechnen" },
  { label: "Splits", href: "#splits" },
  { label: "Negative Split", href: "#negative-split" },
  { label: "Strategien", href: "#split-strategien" },
  { label: "Tabelle", href: "#pace-tabelle" },
];

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col max-w-2xl gap-6">
      {/* Back navigation */}
      <div className="flex flex-row gap-6 text-slate-400 leading-6 text-md">
        <Link className="underline text-yellow-400" href="/">
          Zur App
        </Link>
        <div>|</div>
        <Link className="underline text-yellow-400" href="/release-notes">
          Release Notes
        </Link>
        <div>|</div>
        <Link className="underline text-yellow-400" href="/info">
          Über die App
        </Link>
      </div>

      {/* Sticky anchor nav */}
      <nav className="sticky top-4 z-10 -mx-1">
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          {anchors.map((anchor) => (
            <Link
              key={anchor.href}
              href={anchor.href}
              className="text-xs text-slate-600 hover:text-yellow-400 transition-colors whitespace-nowrap"
            >
              {anchor.label}
            </Link>
          ))}
        </div>
        <div className="mt-3 border-t border-slate-800" />
      </nav>

      {/* Page content */}
      {children}
    </div>
  );
}
