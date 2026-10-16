import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
import { SiteNav } from "@/components/core/SiteNav";
import { ThemeProvider } from "@/components/core/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Motion Kit — Bibliothèque d’animations interactives",
    template: "%s | Motion Kit",
  },
  description: "Explorez 396 animations réutilisables V1 et V2, classées en 18 familles, avec plus de 1 500 icônes et 26 thèmes personnalisables.",
  applicationName: "Motion Kit",
  keywords: [
    "animations web",
    "bibliothèque d’animations",
    "Motion",
    "GSAP",
    "Three.js",
    "Lottie",
    "Rive",
    "icônes",
    "Next.js",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Motion Kit",
    title: "Motion Kit — Bibliothèque d’animations interactives",
    description: "396 animations V1 + V2, 18 familles, plus de 1 500 icônes et 26 thèmes personnalisables.",
  },
  twitter: {
    card: "summary",
    title: "Motion Kit — Bibliothèque d’animations interactives",
    description: "396 animations V1 + V2, 18 familles, plus de 1 500 icônes et 26 thèmes personnalisables.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body><ThemeProvider><SiteNav />{children}</ThemeProvider></body>
    </html>
  );
}
