import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Notes - Pace Planer App",
  description:
    "Erfahre mehr über die neuesten Updates und Verbesserungen der Pace Planer App.",
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
