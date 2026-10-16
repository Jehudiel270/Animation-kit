"use client";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, Reorder, useMotionValue, useSpring } from "motion/react";
import { Heart, Minus, Plus } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTilt } from "@/lib/hooks";

const center = "grid h-full place-items-center";

export function Magnetic() {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15 }), sy = useSpring(y, { stiffness: 220, damping: 15 });
  return (
    <div className={center} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35); }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.button style={{ x: sx, y: sy }} className="btn btn-primary px-10 py-4">Bouton magnétique</motion.button>
    </div>
  );
}

export function CursorFollower() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 25 }), sy = useSpring(y, { stiffness: 300, damping: 25 });
  return (
    <div className="relative h-full cursor-none" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left - 20); y.set(e.clientY - r.top - 20); }}>
      <p className="grid h-full place-items-center text-mute">Bouge la souris ici</p>
      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 h-10 w-10 rounded-full bg-text mix-blend-difference" />
    </div>
  );
}

export function TiltCard() {
  const { rotateX, rotateY, px, py, bind } = useTilt(14);
  return (
    <div className={`${center} [perspective:800px]`} {...bind}>
      <motion.div style={{ rotateX, rotateY }} className="relative h-36 w-60 overflow-hidden rounded-2xl bg-violet p-5 font-bold">
        Carte inclinable
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,.35), transparent 55%)", ["--x" as string]: useSpringPct(px), ["--y" as string]: useSpringPct(py) }} />
      </motion.div>
    </div>
  );
}
import { useTransform, type MotionValue } from "motion/react";
function useSpringPct(v: MotionValue<number>) { return useTransform(v, (n) => `${n * 100}%`); }

export function Ripple() {
  const [r, setR] = useState<{ id: number; x: number; y: number }[]>([]);
  return (
    <div className={center}>
      <button className="btn btn-primary relative overflow-hidden px-10 py-4" onClick={(e) => { const b = e.currentTarget.getBoundingClientRect(); const id = Date.now(); setR((a) => [...a, { id, x: e.clientX - b.left, y: e.clientY - b.top }]); setTimeout(() => setR((a) => a.filter((k) => k.id !== id)), 700); }}>
        Clique-moi
        {r.map((k) => <motion.span key={k.id} className="pointer-events-none absolute h-6 w-6 rounded-full bg-white/50" style={{ left: k.x - 12, top: k.y - 12 }} initial={{ scale: 0, opacity: 0.7 }} animate={{ scale: 12, opacity: 0 }} transition={{ duration: 0.7 }} />)}
      </button>
    </div>
  );
}

export function Toggle() {
  const [on, setOn] = useState(false);
  return <div className={center}><button role="switch" aria-checked={on} aria-label="Activer" onClick={() => setOn(!on)} className={`flex h-10 w-20 items-center rounded-full p-1 transition-colors ${on ? "justify-end bg-teal" : "justify-start bg-line"}`}><motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="h-8 w-8 rounded-full bg-white" /></button></div>;
}

export function UnderlineLink() {
  return <div className={center}><motion.a href="#" onClick={(e) => e.preventDefault()} whileHover="h" className="relative text-3xl font-extrabold">Voir le projet<motion.span variants={{ h: { scaleX: 1 } }} initial={{ scaleX: 0 }} transition={{ duration: 0.35 }} style={{ originX: 0 }} className="absolute -bottom-1 left-0 h-[3px] w-full bg-teal" /></motion.a></div>;
}

export function LikeBurst() {
  const [liked, setLiked] = useState(false);
  return (
    <div className={center}>
      <button aria-label="J'aime" aria-pressed={liked} onClick={() => setLiked(!liked)} className="relative">
        <motion.div animate={{ scale: liked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.4 }}><Heart size={64} className={liked ? "fill-[#ff6b9a] text-[#ff6b9a]" : "text-mute"} /></motion.div>
        <AnimatePresence>{liked && Array.from({ length: 8 }).map((_, i) => <motion.span key={i} className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#ff6b9a]" initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos((i / 8) * 6.283) * 56, y: Math.sin((i / 8) * 6.283) * 56, opacity: 0 }} transition={{ duration: 0.6 }} />)}</AnimatePresence>
      </button>
    </div>
  );
}

export function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  const rows = [["Pourquoi ce kit ?", "Pour réutiliser les mêmes animations dans tous tes projets."], ["Et pour Nuxt ?", "GSAP, Three.js et tsParticles fonctionnent tels quels."], ["Les icônes ?", "Plus de 1 500 icônes Lucide avec une galerie."]];
  return <div className="flex h-full flex-col justify-center gap-2 px-6">{rows.map(([q, a], i) => (
    <div key={i} className="rounded-xl border border-line bg-panel"><button className="flex w-full items-center justify-between p-3 text-left font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}<motion.span animate={{ rotate: open === i ? 45 : 0 }}><Plus size={18} /></motion.span></button>
      <AnimatePresence initial={false}>{open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-3 pb-3 text-sm text-mute">{a}</motion.p>}</AnimatePresence></div>))}</div>;
}

export function AutoList() {
  const [items, setItems] = useState(["Maquette", "Prototype", "Livraison"]);
  const [parent] = useAutoAnimate({ duration: 250 });
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <ul ref={parent} className="flex w-56 flex-col gap-2">{items.map((t) => <li key={t} className="rounded-lg bg-panel px-4 py-2">{t}</li>)}</ul>
      <div className="flex gap-2"><button className="btn btn-ghost" onClick={() => setItems((a) => [`Tâche ${a.length + 1}`, ...a])}>Ajouter</button><button className="btn btn-ghost" onClick={() => setItems((a) => a.slice(1))}>Retirer</button></div>
    </div>
  );
}

export function ReorderList() {
  const [items, setItems] = useState(["Design", "Code", "Test", "Déploiement"]);
  return <div className={center}><Reorder.Group axis="y" values={items} onReorder={setItems} className="flex w-56 flex-col gap-2">{items.map((t) => <Reorder.Item key={t} value={t} whileDrag={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }} className="cursor-grab rounded-lg bg-violet px-4 py-2 font-semibold active:cursor-grabbing">{t}</Reorder.Item>)}</Reorder.Group></div>;
}

export function DragCard() {
  const box = useRef<HTMLDivElement>(null);
  return <div ref={box} className="grid h-full place-items-center"><motion.div drag dragConstraints={box} dragElastic={0.25} whileDrag={{ scale: 1.08, rotate: 3 }} className="grid h-24 w-40 cursor-grab place-items-center rounded-2xl bg-teal font-bold text-ink active:cursor-grabbing">Déplace-moi</motion.div></div>;
}

export function Spotlight() {
  const [p, setP] = useState({ x: 50, y: 50 });
  return <div className={center}><div onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top }); }} className="relative h-36 w-64 overflow-hidden rounded-2xl border border-line bg-panel p-5 font-bold" style={{ backgroundImage: `radial-gradient(180px circle at ${p.x}px ${p.y}px, rgba(124,92,255,.35), transparent 70%)` }}>Carte à projecteur<p className="mt-1 text-sm font-normal text-mute">La lumière suit le curseur.</p></div></div>;
}

export function Shine() {
  return <div className={center}><motion.button whileHover="h" className="btn btn-primary relative overflow-hidden px-10 py-4">Reflet<motion.span variants={{ h: { x: "250%" } }} initial={{ x: "-150%" }} transition={{ duration: 0.8 }} className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/40" /></motion.button></div>;
}

export function Skeleton() {
  const bar = (w: string) => <motion.div className="h-4 rounded" style={{ width: w, backgroundImage: "linear-gradient(90deg,#171a2b 0%,#2b3050 50%,#171a2b 100%)", backgroundSize: "200% 100%" }} animate={{ backgroundPosition: ["200% 0", "-200% 0"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />;
  return <div className="flex h-full flex-col justify-center gap-3 px-10"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-line" />{bar("60%")}</div>{bar("100%")}{bar("85%")}{bar("70%")}</div>;
}

export function FloatingLabel() {
  const [v, setV] = useState(""); const [f, setF] = useState(false);
  const up = f || v.length > 0;
  return <div className={center}><label className="relative block w-64"><motion.span animate={{ y: up ? -24 : 0, scale: up ? 0.8 : 1, color: f ? "#3ddbd9" : "#a3a8c7" }} style={{ originX: 0 }} className="pointer-events-none absolute left-4 top-3">Adresse e-mail</motion.span><input value={v} onChange={(e) => setV(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} className="w-full rounded-xl border border-line bg-panel px-4 pb-2 pt-3 outline-none focus:border-teal" /></label></div>;
}

export function Tooltip() {
  const [o, setO] = useState(false);
  return <div className={center}><div className="relative" onPointerEnter={() => setO(true)} onPointerLeave={() => setO(false)} onFocus={() => setO(true)} onBlur={() => setO(false)}><button className="btn btn-ghost">Survole-moi</button><AnimatePresence>{o && <motion.span role="tooltip" initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.9 }} className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-text px-3 py-1.5 text-sm font-semibold text-ink">Info-bulle animée</motion.span>}</AnimatePresence></div></div>;
}

export function Toasts() {
  const [t, setT] = useState<number[]>([]);
  const add = () => { const id = Date.now(); setT((a) => [...a.slice(-2), id]); setTimeout(() => setT((a) => a.filter((k) => k !== id)), 2200); };
  return (
    <div className="relative h-full">
      <div className={center}><button className="btn btn-primary" onClick={add}>Afficher une notification</button></div>
      <div className="absolute bottom-3 right-3 flex flex-col gap-2"><AnimatePresence>{t.map((id) => <motion.div key={id} layout initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} className="rounded-xl border border-line bg-panel px-4 py-2 text-sm shadow-lg">Enregistré avec succès</motion.div>)}</AnimatePresence></div>
    </div>
  );
}

export function Stepper() {
  const [n, setN] = useState(1); const [d, setD] = useState(1);
  const go = (k: number) => { setD(k); setN((v) => Math.max(0, v + k)); };
  return (
    <div className={center}><div className="flex items-center gap-5">
      <button className="icon-btn" aria-label="Moins" onClick={() => go(-1)}><Minus size={16} /></button>
      <div className="relative h-14 w-14 overflow-hidden text-center text-5xl font-extrabold tabular-nums"><AnimatePresence mode="popLayout" custom={d}><motion.span key={n} custom={d} className="absolute inset-0" initial={{ y: d * 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: d * -40, opacity: 0 }} transition={{ duration: 0.25 }}>{n}</motion.span></AnimatePresence></div>
      <button className="icon-btn" aria-label="Plus" onClick={() => go(1)}><Plus size={16} /></button>
    </div></div>
  );
}

export function PressCards() {
  return <div className="flex h-full items-center justify-center gap-3">{["#7c5cff", "#3ddbd9", "#ffb547"].map((c) => <motion.button key={c} whileHover={{ y: -8 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="h-28 w-20 rounded-2xl" style={{ background: c }} aria-label="Carte" />)}</div>;
}

export function Hamburger() {
  const [o, setO] = useState(false);
  const bar = "absolute left-0 h-0.5 w-full rounded bg-text";
  return <div className={center}><button aria-label="Menu" aria-expanded={o} onClick={() => setO(!o)} className="relative h-6 w-9"><motion.span className={`${bar} top-0`} animate={{ y: o ? 11 : 0, rotate: o ? 45 : 0 }} /><motion.span className={`${bar} top-[11px]`} animate={{ opacity: o ? 0 : 1, x: o ? -10 : 0 }} /><motion.span className={`${bar} top-[22px]`} animate={{ y: o ? -11 : 0, rotate: o ? -45 : 0 }} /></button></div>;
}

export type { ReactNode };
