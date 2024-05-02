import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pace Planer",
  description:
    "Calculate your target running time for various distances based on your pace with this easy-to-use app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <nav className="fixed top-0 w-full">
            <div className="flex flex-row justify-between p-4">
              <div className="flex flex-row gap-2">
                <Link href="/">
                  <h1 className="text-4xl font-bold text-center text-slate-700">
                    Pace Planer
                  </h1>
                </Link>
                <div className="text-yellow-400 font-mono text-sm">alpha</div>
              </div>
            </div>
          </nav>
          <div className="max-w-4xl items-center justify-center font-mono text-sm flex-col gap-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
