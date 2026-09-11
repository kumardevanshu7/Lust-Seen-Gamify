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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="alternate icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="h-full min-h-screen bg-[#1f120c] text-stone-900 antialiased font-sans selection:bg-amber-400 selection:text-black">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
