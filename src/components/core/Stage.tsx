"use client";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import { Check, Copy, Maximize2, RotateCcw } from "lucide-react";
import { createPortal } from "react-dom";
import Lab from "@/legacy-v1/components/Lab";
import { REG as LEGACY_EFFECTS, type Fx } from "@/legacy-v1/lib/registry";
import { v2ControlsFor } from "@/registry/v2-controls";
import type { FamilyId, Item } from "@/registry/types";

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
export function Stage({ id, title, lib, children, legacy, item, siblings = [] }: { id: string; title: string; lib: string; children: ReactNode; legacy?: Fx; item?: Item; siblings?: Item[] }) {
  const [ref, inView] = useInView<HTMLElement>();
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeLegacy, setActiveLegacy] = useState<Fx | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

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

  const copy = async () => {
    await navigator.clipboard?.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <figure id={id} ref={ref} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative h-60 overflow-hidden bg-ink">{inView && !open && <Fragment key={run}>{children}</Fragment>}</div>
      <figcaption className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="truncate text-sm text-mute">{lib} — {id}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="icon-btn" aria-label="Agrandir et régler l'animation" onClick={() => { setActiveLegacy(legacy ?? null); setActiveItem(item ?? null); setOpen(true); }}><Maximize2 size={16} /></button>
          <button className="icon-btn" aria-label="Rejouer l'animation" onClick={() => setRun((r) => r + 1)}><RotateCcw size={16} /></button>
          <button className="icon-btn" aria-label="Copier l'identifiant" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
        </div>
      </figcaption>
      {portalRoot && createPortal(
        <AnimatePresence mode="wait">
        {open && activeLegacy ? (
          <Lab
            key={`v1-${activeLegacy.id}`}
            f={activeLegacy}
            onClose={() => setOpen(false)}
            onNav={(delta) => {
              const effects = LEGACY_EFFECTS.filter((effect) => effect.cat === activeLegacy.cat);
              const index = effects.findIndex((effect) => effect.id === activeLegacy.id);
              setActiveLegacy(effects[(index + delta + effects.length) % effects.length] ?? activeLegacy);
            }}
          />
        ) : open && activeItem ? (
          <Lab
            key={`v2-${activeItem.id}`}
            v2={{
              id: activeItem.id,
              title: activeItem.title,
              lib: activeItem.lib,
              family: activeItem.id.split("-")[0] ?? "",
              preview: <activeItem.C />,
              controls: v2ControlsFor(activeItem.id, activeItem.title, activeItem.id.split("-")[0] as FamilyId),
            }}
            onClose={() => setOpen(false)}
            onNav={(delta) => {
              const index = siblings.findIndex((candidate) => candidate.id === activeItem.id);
              const next = siblings[(index + delta + siblings.length) % siblings.length];
              if (next) setActiveItem(next);
            }}
          />
        ) : null}
        </AnimatePresence>,
        portalRoot,
      )}
    </figure>
  );
}
