import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "./assets/Pace-Planer-Logo.svg";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Pace Rechner – Lauftempo, Splits & Zielzeit werbefrei berechnen | Pace Planer",
  description:
    "Pace, Splits, Zielzeit oder Distanz berechnen – kostenlos, werbefrei und ohne Tracking. Für 5K, 10K, Halbmarathon, Marathon und jede andere Distanz.",
  keywords: [
    "Pace Rechner",
    "Lauftempo berechnen",
    "Pace berechnen",
    "Zielzeit berechnen",
    "Marathon Pace",
    "Halbmarathon Pace",
    "Laufzeit berechnen",
    "Pace Kalkulator",
  ],
  alternates: {
    canonical: "https://pace-planer.de",
  },
  openGraph: {
    title: "Pace Rechner – Lauftempo, Splits & Zielzeit berechnen",
    description:
      "Pace, Splits Zielzeit oder Distanz berechnen – kostenlos, werbefrei und ohne Tracking. Für 5K, 10K, Halbmarathon und Marathon.",
    url: "https://pace-planer.de",
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
    <html lang="de" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <nav className="fixed px-2 top-0 w-full bg-slate-950 bg-opacity-80 backdrop-blur-md">
          <div className="flex flex-row justify-between items-center p-4">
            <div className="flex flex-row">
              <Link href="/">
                <Image
                  className="size-11"
                  src={Logo}
                  alt="Logo Pace Planer"
                  width={50}
                  height={50}
                />
              </Link>
            </div>
            <div>
              <Link
                href="/info"
                className="flex flex-row gap-1 font-mono items-center justify-center text-slate-600 text-sm"
              >
                <Info className="h-5 w-5" />
                Über Pace Planer
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex flex-col h-svh items-center justify-center font-mono">
          {children}
        </main>
      </body>
    </html>
  );
}
