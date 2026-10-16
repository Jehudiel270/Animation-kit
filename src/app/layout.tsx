import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
import { SiteNav } from "@/components/core/SiteNav";
import { ThemeProvider } from "@/components/core/ThemeProvider";

export const metadata: Metadata = {
  title: "Motion Kit",
  description: "396 animations V1 et V2 (GSAP, Motion, Three.js, particules, vidéo, Lottie, Rive), 26 thèmes et une bibliothèque d'icônes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body><ThemeProvider><SiteNav />{children}</ThemeProvider></body>
    </html>
  );
}
