import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entdecke Pace Planer",
  description:
    "Deine kostenlose, werbefreie Lauf-App für einfache Zielzeit-Berechnungen ohne Cookies oder Analytics. Perfekt für alle Distanzen – plane deinen Lauf mit Klarheit und Privatsphäre.",
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
