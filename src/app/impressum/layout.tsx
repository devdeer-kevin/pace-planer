import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum - Pace Planer",
  description:
    "Impressum von Pace Planer: Informationen zu Verantwortlichkeiten, Datenschutz und Haftungsausschluss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-lvh items-center justify-center w-full py-24 px-6">
      {children}
    </main>
  );
}
