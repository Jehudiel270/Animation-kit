"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemePicker } from "./ThemeProvider";

const links = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/sections", label: "Sections" },
  { href: "/icons", label: "Icônes" },
  { href: "/landing", label: "Landing" },
];

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-xl">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-5">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-2 text-base font-extrabold tracking-tight sm:text-lg">Motion Kit <span className="shrink-0 rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-violet">V1 + V2</span></Link>
        <ul className="hidden items-center gap-5 text-sm text-mute md:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="whitespace-nowrap transition-colors hover:text-text">{l.label}</Link></li>
          ))}
        </ul>
        <div className="ml-auto hidden md:block"><ThemePicker /></div>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:hidden">
          <ThemePicker />
          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-xl border border-line bg-panel text-text transition hover:border-teal"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              id="mobile-navigation"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute inset-x-3 top-[calc(100%+0.5rem)] z-50 grid gap-1 rounded-2xl border border-line bg-panel p-2 shadow-2xl shadow-black/40 md:hidden"
            >
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-mute transition-colors hover:bg-ink/70 hover:text-text">{link.label}</Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
