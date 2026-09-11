import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Cinzel } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Control Urge - Gamified Habit Tracker & Willpower RPG",
  description:
    "Level up your willpower, conquer sexual urges, unlock Shonen anime hero titles at Level 10, and join legendary anime clans at Level 15.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2b1810",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${chakraPetch.variable} ${cinzel.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="h-full min-h-screen bg-[#1f120c] text-stone-900 antialiased font-sans selection:bg-amber-400 selection:text-black">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
