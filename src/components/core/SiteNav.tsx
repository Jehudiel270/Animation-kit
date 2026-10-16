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
          <motion.button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            whileTap={{ scale: 0.9 }}
            className="grid size-10 place-items-center rounded-xl border border-line bg-panel text-text transition-colors hover:border-teal"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -80, scale: 0.65 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 80, scale: 0.65 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="grid place-items-center"
              >
                {menuOpen ? <X size={19} /> : <Menu size={19} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              id="mobile-navigation"
              initial={{ opacity: 0, y: -12, scale: 0.97, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(3px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
              className="absolute inset-x-3 top-[calc(100%+0.5rem)] z-50 grid gap-1 rounded-2xl border border-line bg-panel p-2 shadow-2xl shadow-black/40 md:hidden"
            >
              {links.map((link, index) => (
                <li key={link.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.18, delay: index * 0.035 }}
                  >
                    <Link href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-mute transition-colors hover:bg-ink/70 hover:text-text">{link.label}</Link>
                  </motion.div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
