import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "/public/Pace-Planer-Logo.svg";

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
        <nav className="fixed top-0 w-full bg-slate-950">
          <div className="flex flex-row justify-between p-4">
            <div className="flex flex-row gap-1">
              <Link href="/">
                <Image src={Logo} alt="logo" width={50} height={50} />
              </Link>
              <div className="text-slate-500 font-mono text-sm">beta</div>
            </div>
          </div>
        </nav>

        <main className="flex flex-col h-svh items-center justify-center font-mono text-sm">
          {children}
        </main>
      </body>
    </html>
  );
}
