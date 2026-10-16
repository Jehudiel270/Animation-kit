"use client";
import { useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

const COLORS = ["#7c5cff", "#3ddbd9", "#ffb547", "#ff6b9a", "#6ee7a0", "#5b8cff"];
export type Part = "bar" | "ring" | "path" | "count" | "par" | "marquee";
export type Setup = (s: HTMLElement, q: gsap.utils.SelectorFunc) => void | (() => void);

/**
 * Banc d'essai de défilement : une zone scrollable avec du contenu générique.
 * `setup` reçoit l'élément qui défile : passe-le en `scroller` à tes ScrollTrigger.
 */
export function ScrollBox({ setup, parts = [], layout = "default", lenis = false }: { setup: Setup; parts?: Part[]; layout?: "default" | "stack" | "horizontal"; lenis?: boolean }) {
  const scroller = useRef<HTMLDivElement>(null);
  useGSAP((_ctx, _safe) => {
    const s = scroller.current!;
    let l: Lenis | undefined;
    let tick: ((t: number) => void) | undefined;
    if (lenis) {
      l = new Lenis({ wrapper: s, content: s.firstElementChild as HTMLElement, lerp: 0.08 });
      l.on("scroll", ScrollTrigger.update);
      tick = (t: number) => l!.raf(t * 1000);
      gsap.ticker.add(tick);
    }
    const q = gsap.utils.selector(s);
    const off = setup(s, q);
    ScrollTrigger.refresh();
    return () => { off?.(); if (tick) gsap.ticker.remove(tick); l?.destroy(); };
  }, { scope: scroller });

  const has = (p: Part) => parts.includes(p);
  return (
    <div ref={scroller} data-lenis-prevent={lenis ? undefined : ""} className="h-full overflow-y-auto overflow-x-hidden">
      <div className="relative">
        {has("bar") && <div className="sticky top-0 z-10 h-1 origin-left scale-x-0 bg-violet" data-bar />}
        {has("ring") && (
          <svg className="sticky top-3 z-10 ml-auto mr-3 -mb-12 block" width="44" height="44" viewBox="0 0 44 44" aria-hidden>
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-line)" strokeWidth="4" />
            <circle data-ring cx="22" cy="22" r="18" fill="none" stroke="var(--color-teal)" strokeWidth="4" strokeLinecap="round" transform="rotate(-90 22 22)" />
          </svg>
        )}
        {layout === "horizontal" ? (
          <div data-wrap className="h-[900px]">
            <div className="sticky top-0 flex h-60 items-center overflow-hidden">
              <div data-track className="flex gap-4 px-6">
                {COLORS.map((c, i) => <div key={i} className="grid h-40 w-56 shrink-0 place-items-center rounded-2xl text-xl font-bold text-ink" style={{ background: c }}>Carte {i + 1}</div>)}
              </div>
            </div>
          </div>
        ) : (
          <>
            <section className="grid h-56 place-items-center"><h3 data-hero className="text-3xl font-extrabold">Fais défiler</h3></section>
            {has("par") && <p data-par className="px-8 pb-24 text-2xl font-bold leading-snug">Chaque mot s'allume au rythme du défilement, du premier jusqu'au dernier.</p>}
            {has("count") && <div className="grid h-40 place-items-center"><span data-count className="text-6xl font-extrabold tabular-nums">0</span></div>}
            {has("marquee") && <div className="overflow-hidden whitespace-nowrap py-6 text-5xl font-extrabold"><div data-mq className="flex w-max">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="pr-10">Défilement</span>)}</div></div>}
            <div className="flex flex-col gap-24 px-8 pb-24">
              {COLORS.map((c, i) => (
                <div key={i} data-blk className={`grid place-items-center rounded-2xl text-xl font-bold text-ink ${layout === "stack" ? "sticky top-6 h-44" : "h-32"}`} style={{ background: c }}>Bloc {i + 1}</div>
              ))}
            </div>
            {has("path") && (
              <svg viewBox="0 0 300 200" className="mx-auto mb-24 w-64" aria-hidden>
                <path data-path d="M10 180 C 60 20, 120 20, 150 100 S 240 190, 290 20" fill="none" stroke="var(--color-teal)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            )}
          </>
        )}
      </div>
    </div>
  );
}
