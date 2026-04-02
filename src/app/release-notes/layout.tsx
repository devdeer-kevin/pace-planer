import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Notes | Pace Planer",
  description:
    "Pace Planer 4.0: Splits visualisieren mit Chart-Modus, Strategien vergleichen, Kilometertabelle anzeigen. Kostenlos, werbefrei – alle Updates seit Mai 2024.",
  keywords: [
    "Pace Planer Updates",
    "Pace Rechner App",
    "Pace Planer Changelog",
  ],
  alternates: {
    canonical: "https://pace-planer.de/release-notes",
  },
  openGraph: {
    title: "Release Notes – Pace Planer",
    description:
      "Alle Updates des Pace Planers seit Mai 2024 – Chart-Modus, Split-Strategien, Zieleinlaufzeit und mehr.",
    url: "https://pace-planer.de/release-notes",
    siteName: "Pace Planer",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col items-center overflow-y-auto h-full w-full py-24 px-6">
      {children}
    </main>
  );
}
