"use client";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Maximize2, RotateCcw, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import Lab from "@/legacy-v1/components/Lab";
import { REG as LEGACY_EFFECTS, type Fx } from "@/legacy-v1/lib/registry";

/** true quand l'élément est visible. Sert à ne monter les démos lourdes (WebGL...) que quand on les voit. */
export function useInView<T extends HTMLElement>(margin = "100px") {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

/** Carte de démonstration : monte l'animation à l'écran, permet de la rejouer et de copier son identifiant. */
export function Stage({ id, title, lib, children, legacy }: { id: string; title: string; lib: string; children: ReactNode; legacy?: Fx }) {
  const [ref, inView] = useInView<HTMLElement>();
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [hue, setHue] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [activeLegacy, setActiveLegacy] = useState<Fx | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const root = previewRef.current;
    if (!root || activeLegacy) return;
    const rate = speed / 100;
    root.getAnimations({ subtree: true }).forEach((animation) => { animation.playbackRate = rate; });
    const elements = [root, ...root.querySelectorAll<HTMLElement>("*")];
    const tweens = new Set(elements.flatMap((element) => gsap.getTweensOf(element)));
    tweens.forEach((tween) => tween.timeScale(rate));
  }, [activeLegacy, open, run, speed]);

  const copy = async () => {
    await navigator.clipboard?.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <figure id={id} ref={ref} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative h-60 overflow-hidden bg-ink">{inView && <Fragment key={run}>{children}</Fragment>}</div>
      <figcaption className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="truncate text-sm text-mute">{lib} — {id}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="icon-btn" aria-label="Agrandir et régler l'animation" onClick={() => { setActiveLegacy(legacy ?? null); setOpen(true); }}><Maximize2 size={16} /></button>
          <button className="icon-btn" aria-label="Rejouer l'animation" onClick={() => setRun((r) => r + 1)}><RotateCcw size={16} /></button>
          <button className="icon-btn" aria-label="Copier l'identifiant" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
        </div>
      </figcaption>
      <AnimatePresence>
        {open && (activeLegacy ? (
          <Lab
            key={activeLegacy.id}
            f={activeLegacy}
            onClose={() => setOpen(false)}
            onNav={(delta) => {
              const effects = LEGACY_EFFECTS.filter((effect) => effect.cat === activeLegacy.cat);
              const index = effects.findIndex((effect) => effect.id === activeLegacy.id);
              setActiveLegacy(effects[(index + delta + effects.length) % effects.length] ?? activeLegacy);
            }}
          />
        ) : (
          <motion.div role="dialog" aria-modal="true" aria-labelledby={`viewer-${id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col bg-ink">
            <header className="flex items-center gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0 flex-1">
                <h2 id={`viewer-${id}`} className="truncate text-lg font-bold">{title}</h2>
                <p className="text-sm text-mute">{lib} · {id}</p>
              </div>
              <button className="icon-btn" aria-label="Fermer" onClick={() => setOpen(false)}><X size={18} /></button>
            </header>
            <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="relative grid min-h-[45vh] place-items-center overflow-hidden border-b border-line bg-panel lg:min-h-0 lg:border-b-0 lg:border-r">
                <div ref={previewRef} key={run} className="grid size-full place-items-center overflow-hidden" style={{ transform: `scale(${scale / 100})`, filter: `brightness(${brightness}%) hue-rotate(${hue}deg)` }}>{children}</div>
                <button className="btn btn-primary absolute bottom-5 left-5" onClick={() => setRun((value) => value + 1)}><RotateCcw size={16} /> Rejouer</button>
              </div>
              <aside className="space-y-6 overflow-y-auto p-6">
                <div><h3 className="text-xl font-bold">Réglages</h3><p className="mt-1 text-sm text-mute">Ajuste le rendu de la démo. Les effets V1 disposent en plus de leurs paramètres dédiés.</p></div>
                {[
                  { label: "Vitesse", value: speed, min: 25, max: 200, step: 5, set: setSpeed, suffix: "%" },
                  { label: "Échelle", value: scale, min: 60, max: 140, step: 5, set: setScale, suffix: "%" },
                  { label: "Luminosité", value: brightness, min: 50, max: 150, step: 5, set: setBrightness, suffix: "%" },
                  { label: "Teinte", value: hue, min: 0, max: 360, step: 5, set: setHue, suffix: "°" },
                ].map((control) => (
                  <label key={control.label} className="grid gap-2 text-sm">
                    <span className="flex justify-between"><span>{control.label}</span><span className="text-mute">{control.value}{control.suffix}</span></span>
                    <input type="range" min={control.min} max={control.max} step={control.step} value={control.value} onChange={(event) => control.set(Number(event.target.value))} />
                  </label>
                ))}
                <button className="btn btn-ghost w-full" onClick={() => { setSpeed(100); setScale(100); setBrightness(100); setHue(0); setRun((value) => value + 1); }}>Réinitialiser les réglages</button>
                <button className="btn btn-ghost w-full" onClick={copy}>{copied ? "Identifiant copié" : `Copier l'identifiant · ${id}`}</button>
              </aside>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </figure>
  );
}
