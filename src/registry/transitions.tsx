"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { make } from "./types";

const M = "Motion · AnimatePresence";
const PAGES = [{ n: "Accueil", c: "#7c5cff" }, { n: "Projets", c: "#3ddbd9" }, { n: "Contact", c: "#ffb547" }];
const Page = ({ i }: { i: number }) => <div className="grid h-full w-full place-items-center text-3xl font-extrabold text-ink" style={{ background: PAGES[i % 3].c }}>{PAGES[i % 3].n}</div>;

function useCycle(ms = 2600) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => v + 1), ms); return () => clearInterval(t); }, [ms]);
  return [i, setI] as const;
}

/** Transitions où la page sortante et la page entrante sont animées l'une avec l'autre. */
function Swap({ v }: { v: Variants }) {
  const [i] = useCycle();
  return <div className="absolute inset-0 overflow-hidden [perspective:900px]"><AnimatePresence mode="popLayout" initial={false}><motion.div key={i} className="absolute inset-0" variants={v} initial="in" animate="on" exit="out" transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}><Page i={i} /></motion.div></AnimatePresence></div>;
}

/** Transitions avec un élément qui recouvre l'écran pendant le changement de page. */
function Cover({ kind }: { kind: "wipe" | "circle" | "blocks" | "doors" }) {
  const [i] = useCycle(3000);
  const [shown, setShown] = useState(0);
  useEffect(() => { if (i === 0) return; const t = setTimeout(() => setShown(i), 600); return () => clearTimeout(t); }, [i]);
  const run = i > 0;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Page i={shown} />
      {run && kind === "wipe" && <motion.div key={i} className="absolute inset-0 bg-ink" initial={{ x: "-100%" }} animate={{ x: ["-100%", "0%", "100%"] }} transition={{ duration: 1.2, times: [0, 0.5, 1], ease: "easeInOut" }} />}
      {run && kind === "circle" && <motion.div key={i} className="absolute inset-0 bg-ink" initial={{ clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: ["circle(0% at 50% 50%)", "circle(75% at 50% 50%)", "circle(0% at 50% 50%)"] }} transition={{ duration: 1.2, times: [0, 0.5, 1] }} />}
      {run && kind === "blocks" && <div key={i} className="absolute inset-0 flex">{Array.from({ length: 6 }).map((_, k) => <motion.div key={k} className="h-full flex-1 bg-ink" initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 0], originY: [1, 1, 0] }} transition={{ duration: 1.2, times: [0, 0.5, 1], delay: k * 0.06 }} />)}</div>}
      {run && kind === "doors" && <div key={i} className="absolute inset-0 flex">{[0, 1].map((k) => <motion.div key={k} className="h-full w-1/2 bg-ink" initial={{ x: k ? "100%" : "-100%" }} animate={{ x: [k ? "100%" : "-100%", "0%", k ? "100%" : "-100%"] }} transition={{ duration: 1.2, times: [0, 0.5, 1], ease: "easeInOut" }} />)}</div>}
    </div>
  );
}

function Tabs() {
  const [i, setI] = useCycle(2800);
  const a = i % 3;
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex gap-1 p-3">{PAGES.map((p, k) => <button key={k} onClick={() => setI(k)} className="relative px-4 py-2 font-semibold">{p.n}{a === k && <motion.span layoutId="u" className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-teal" />}</button>)}</div>
      <div className="relative flex-1 overflow-hidden"><AnimatePresence mode="wait"><motion.div key={a} className="absolute inset-0" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}><Page i={a} /></motion.div></AnimatePresence></div>
    </div>
  );
}

const sw = (v: Variants) => () => <Swap v={v} />;

export const transitions = make("transitions", [
  ["Fondu", M, sw({ in: { opacity: 0 }, on: { opacity: 1 }, out: { opacity: 0 } })],
  ["Glissement horizontal", M, sw({ in: { x: "100%" }, on: { x: 0 }, out: { x: "-100%" } })],
  ["Glissement vertical", M, sw({ in: { y: "100%" }, on: { y: 0 }, out: { y: "-100%" } })],
  ["Zoom d'entrée", M, sw({ in: { scale: 0.6, opacity: 0 }, on: { scale: 1, opacity: 1 }, out: { scale: 1.2, opacity: 0 } })],
  ["Rotation", M, sw({ in: { rotate: 12, opacity: 0, x: 80 }, on: { rotate: 0, opacity: 1, x: 0 }, out: { rotate: -12, opacity: 0, x: -80 } })],
  ["Flou", M, sw({ in: { opacity: 0, filter: "blur(18px)" }, on: { opacity: 1, filter: "blur(0px)" }, out: { opacity: 0, filter: "blur(18px)" } })],
  ["Retournement 3D", M, sw({ in: { rotateY: -90, opacity: 0 }, on: { rotateY: 0, opacity: 1 }, out: { rotateY: 90, opacity: 0 } })],
  ["Zoom croisé", M, sw({ in: { scale: 0.8, opacity: 0 }, on: { scale: 1, opacity: 1 }, out: { scale: 1.6, opacity: 0 } })],
  ["Balayage de couleur", M, () => <Cover kind="wipe" />],
  ["Balayage circulaire", M, () => <Cover kind="circle" />],
  ["Blocs verticaux", M, () => <Cover kind="blocks" />],
  ["Portes qui s'ouvrent", M, () => <Cover kind="doors" />],
  ["Onglets avec soulignement partagé", M + " · layoutId", () => <Tabs />],
  ["Pile de pages", M, sw({ in: { y: "100%", scale: 0.9 }, on: { y: 0, scale: 1 }, out: { y: "-30%", scale: 0.85, opacity: 0, rotate: -4 } })],
]);
