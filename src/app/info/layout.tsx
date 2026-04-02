import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über Pace Planer – Kostenloser Pace Rechner ohne Werbung",
  description:
    "Pace Planer ist ein kostenloser, werbefreier Pace Rechner – ohne Cookies, ohne Analytics, ohne App-Download. Direkt im Browser, für jede Distanz.",
  keywords: [
    "Pace Rechner kostenlos",
    "Pace Rechner ohne Werbung",
    "Lauf App ohne Tracking",
    "Pace Planer",
  ],
  alternates: {
    canonical: "https://pace-planer.de/info",
  },
  openGraph: {
    title: "Über Pace Planer – Kostenloser Pace Rechner ohne Werbung",
    description:
      "Kostenlos, werbefrei, ohne Cookies und ohne App-Download. Pace Planer läuft direkt im Browser – für jede Laufdistanz.",
    url: "https://pace-planer.de/info",
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
