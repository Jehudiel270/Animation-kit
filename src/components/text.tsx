"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Unit = "chars" | "words" | "lines";
type Run = (targets: Element[], tl: gsap.core.Timeline, split: SplitText) => void;

/** Base de tous les effets de texte : découpe en lettres/mots/lignes puis lance `run` dans une timeline. */
export function SplitFx({
  text, unit = "chars", mask, run, loop = true, className = "", wrap = "h-full",
}: { text: string; unit?: Unit; mask?: Unit; run: Run; loop?: boolean; className?: string; wrap?: string }) {
  const box = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = box.current!.firstElementChild as HTMLElement;
    const split = SplitText.create(el, {
      type: unit === "chars" ? "chars,words" : unit,
      mask,
    });
    const tl = gsap.timeline(loop ? { repeat: -1, repeatDelay: 1.2 } : {});
    run(split[unit] as Element[], tl, split);
    return () => split.revert();
  }, { scope: box });
  return (
    <div ref={box} className={`flex items-center justify-center px-6 text-center ${wrap}`}>
      <p className={`font-extrabold leading-tight tracking-tight ${className || "text-3xl"}`}>{text}</p>
    </div>
  );
}

/** Révélation générique : `from` décrit l'état de départ (toujours inclure opacity: 0). */
export function SplitReveal({
  from, stagger = 0.03, ease = "power4.out", duration = 1, ...rest
}: { text: string; unit?: Unit; mask?: Unit; from: gsap.TweenVars; stagger?: gsap.TweenVars["stagger"]; ease?: string; duration?: number; loop?: boolean; className?: string; wrap?: string }) {
  return (
    <SplitFx {...rest} run={(t, tl) => {
      tl.from(t, { ...from, stagger, ease, duration });
      if (rest.loop !== false) tl.to(t, { opacity: 0, duration: 0.4, delay: 1.4, stagger: { amount: 0.2 } });
    }} />
  );
}

export function Typewriter({ words }: { words: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = box.current!.querySelector<HTMLElement>("[data-t]")!;
    const caret = box.current!.querySelector<HTMLElement>("[data-c]")!;
    gsap.to(caret, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });
    const tl = gsap.timeline({ repeat: -1 });
    words.forEach((w) => {
      tl.to(el, { text: w, duration: w.length * 0.07, ease: "none" })
        .to({}, { duration: 1.1 })
        .to(el, { text: "", duration: w.length * 0.03, ease: "none" });
    });
  }, { scope: box });
  return (
    <div ref={box} className="grid h-full place-items-center px-6 text-3xl font-extrabold">
      <p><span data-t /><span data-c className="ml-0.5 inline-block w-[3px] bg-violet">&nbsp;</span></p>
    </div>
  );
}

/** Mots qui défilent verticalement dans une fenêtre d'une ligne. */
export function WordSwap({ prefix, words }: { prefix: string; words: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const inner = box.current!.querySelector("[data-i]")!;
    const n = words.length;
    const tl = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= n; i++) tl.to(inner, { yPercent: -(100 / (n + 1)) * i, duration: 0.7, ease: "power3.inOut", delay: 1 });
    tl.set(inner, { yPercent: 0 });
  }, { scope: box });
  return (
    <div ref={box} className="flex h-full items-center justify-center gap-3 text-3xl font-extrabold">
      <span>{prefix}</span>
      <span className="h-[1.3em] overflow-hidden text-teal leading-[1.3em]">
        <span data-i className="block">{[...words, words[0]].map((w, i) => <span key={i} className="block">{w}</span>)}</span>
      </span>
    </div>
  );
}

export function Scramble({ text, hover = false }: { text: string; hover?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { contextSafe } = useGSAP(() => {
    if (!hover) gsap.to(ref.current, { duration: 1.8, scrambleText: { text, chars: "upperCase", speed: 0.6 }, repeat: -1, repeatDelay: 1.4 });
  }, { scope: ref });
  const run = contextSafe(() => gsap.to(ref.current, { duration: 1.2, scrambleText: { text, chars: "XO#%&$", speed: 0.5 }, overwrite: true }));
  return (
    <div className="grid h-full place-items-center px-6">
      <p ref={ref} onPointerEnter={hover ? run : undefined} tabIndex={hover ? 0 : undefined} className="cursor-default text-3xl font-extrabold">{hover ? text : ""}</p>
    </div>
  );
}

export function Marquee({ items, speed = 60, reverse = false, className = "" }: { items: string[]; speed?: number; reverse?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const w = track.current!.scrollWidth / 2;
    gsap.fromTo(track.current, { x: reverse ? -w : 0 }, { x: reverse ? 0 : -w, duration: w / speed, ease: "none", repeat: -1 });
  }, { scope: track, dependencies: [speed, reverse] });
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="flex w-max">
        {[...items, ...items].map((t, i) => <span key={i} className="pr-10">{t}</span>)}
      </div>
    </div>
  );
}

export function MarqueeRows() {
  const a = ["Création", "Animation", "Interaction", "Mouvement"];
  return (
    <div className="flex h-full flex-col justify-center gap-4 text-5xl font-extrabold">
      <Marquee items={a} speed={70} />
      <Marquee items={a} speed={50} reverse className="text-transparent [-webkit-text-stroke:1.5px_var(--color-text)]" />
    </div>
  );
}

export function Counter({ to = 12840, suffix = "" }: { to?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 2.2, ease: "power3.out", repeat: -1, repeatDelay: 1.4, onUpdate: () => { ref.current!.textContent = Math.round(o.v).toLocaleString("fr-FR") + suffix; } });
  }, { scope: ref });
  return <div className="grid h-full place-items-center"><span ref={ref} className="text-6xl font-extrabold tabular-nums">0</span></div>;
}
