import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pace Planer",
  description:
    "Berechne auf der Grundlage deiner Pace mit dieser benutzerfreundlichen App deine Ziellaufzeit für 5k, 10k, Halbmarathon und Marathon.",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <main className="flex flex-col items-center justify-center">
          <nav className="fixed top-0 w-full bg-slate-950">
            <div className="flex flex-row justify-between p-4">
              <div className="flex flex-row gap-2">
                <Link href="/">
                  <h1 className="text-4xl font-bold text-center text-slate-700">
                    Pace Planer
                  </h1>
                </Link>
                <div className="text-yellow-400 font-mono text-sm">beta</div>
              </div>
            </div>
          </nav>
          <div className="max-w-4xl pt-20 items-center justify-center font-mono text-sm flex-col gap-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
