import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "/public/Pace-Planer-Logo.svg";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

export const metadata: Metadata = {
  title: "Pace Planer",
  description:
    "Berechne auf der Grundlage deiner Pace mit dieser benutzerfreundlichen App deine Ziellaufzeit für 5k, 10k, Halbmarathon und Marathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <nav className="fixed px-2 top-0 w-full bg-slate-950">
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
                <InformationCircleIcon className="h-5 w-5" />
                Über Pace Planer
              </Link>
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
