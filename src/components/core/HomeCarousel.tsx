"use client";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const V2Home = dynamic(() => import("@/components/catalogue/Sections").then((module) => module.Sections), { ssr: false });
const V1Home = dynamic(() => import("@/legacy-v1/app/page"), { ssr: false });

const slides = [
  { id: "v2", label: "Accueil V2", description: "La nouvelle vitrine du kit" },
  { id: "v1", label: "Accueil V1", description: "Le catalogue original, conservé" },
] as const;

export function HomeCarousel() {
  const [active, setActive] = useState<(typeof slides)[number]["id"]>("v2");

  return (
    <main>
      <nav aria-label="Choisir l'accueil" className="mx-auto my-6 flex w-fit max-w-[calc(100%-2rem)] flex-col items-center gap-3 rounded-2xl border border-line bg-panel/80 p-3 shadow-xl shadow-black/10 sm:flex-row sm:rounded-full sm:py-2 sm:pl-5 sm:pr-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-mute sm:mr-1">Deux accueils</span>
        <div className="flex items-center rounded-full border border-line/70 bg-ink/70 p-1">
          {slides.map((slide) => (
            <button
              key={slide.id}
              type="button"
              aria-pressed={active === slide.id}
              onClick={() => setActive(slide.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === slide.id ? "text-white" : "text-mute hover:text-text"}`}
            >
              {active === slide.id && <motion.span layoutId="home-slide-indicator" className="absolute inset-0 rounded-full bg-violet" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{slide.label}</span>
            </button>
          ))}
        </div>
        <span className="hidden text-sm text-mute md:inline">{slides.find((slide) => slide.id === active)?.description}</span>
      </nav>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: active === "v1" ? 48 : -48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: active === "v1" ? -48 : 48 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {active === "v1" ? <V1Home heroOnly /> : <V2Home ids={["sections-01", "sections-06", "sections-12"]} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
