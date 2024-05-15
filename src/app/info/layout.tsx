import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pace Planer - Info",
  description:
    "Berechne auf der Grundlage deiner Pace mit dieser benutzerfreundlichen App deine Ziellaufzeit für 5k, 10k, Halbmarathon und Marathon.",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-full w-full py-24 px-6">{children}</main>;
}
