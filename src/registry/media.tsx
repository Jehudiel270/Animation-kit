"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Pause, Play } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useTilt, useToggle } from "@/lib/hooks";
import { IMAGES, VIDEO } from "@/lib/media";
import { make } from "./types";

const M = "Motion";
const img = "h-full w-full object-cover";
const Img = ({ i = 0, className = img }: { i?: number; className?: string }) => <img src={IMAGES[i]} alt="" draggable={false} className={className} />;
const Frame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`absolute inset-0 overflow-hidden ${className}`}>{children}</div>;
const Vid = ({ className = img, ...p }: React.ComponentProps<"video">) => <video src={VIDEO.src} poster={VIDEO.poster} muted loop playsInline preload="metadata" className={className} {...p} />;

const loopT = { duration: 1.3, repeat: Infinity, repeatType: "reverse" as const, repeatDelay: 1, ease: "easeInOut" as const };

function Slices() {
  const on = useToggle(3200);
  return <Frame><div className="flex h-full">{[0, 1, 2, 3, 4].map((i) => <motion.div key={i} className="h-full flex-1" style={{ backgroundImage: `url(${IMAGES[1]})`, backgroundSize: "500% 100%", backgroundPosition: `${i * 25}% 0` }} animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }} />)}</div></Frame>;
}

function TiltImage() {
  const { rotateX, rotateY, bind } = useTilt(16);
  return <div className="grid h-full place-items-center [perspective:800px]" {...bind}><motion.div style={{ rotateX, rotateY }} className="h-40 w-60 overflow-hidden rounded-2xl shadow-2xl"><Img i={2} /></motion.div></div>;
}

function Glitch() {
  return (
    <Frame>
      <Img i={3} />
      {[["#ff3d7f", [-10, 8, 0]], ["#3ddbd9", [10, -8, 0]]].map(([c, xs], k) => (
        <motion.div key={k} className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: `url(${IMAGES[3]})`, backgroundSize: "cover", clipPath: k ? "inset(55% 0 20% 0)" : "inset(15% 0 55% 0)" }} animate={{ x: xs as number[] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}>
          <div className="h-full w-full opacity-40" style={{ background: c as string }} />
        </motion.div>
      ))}
    </Frame>
  );
}

function Trail() {
  const box = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0, n: 0 });
  const { contextSafe } = useGSAP({ scope: box });
  const move = contextSafe((e: React.PointerEvent<HTMLDivElement>) => {
    const r = box.current!.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (Math.hypot(x - last.current.x, y - last.current.y) < 60) return;
    last.current = { x, y, n: last.current.n + 1 };
    const el = document.createElement("img");
    el.src = IMAGES[last.current.n % IMAGES.length]; el.className = "pointer-events-none absolute h-24 w-20 rounded-lg object-cover"; el.style.left = `${x - 40}px`; el.style.top = `${y - 48}px`;
    box.current!.appendChild(el);
    gsap.fromTo(el, { scale: 0.4, opacity: 0, rotate: (Math.random() - 0.5) * 30 }, { scale: 1, opacity: 1, duration: 0.3 });
    gsap.to(el, { opacity: 0, scale: 0.8, delay: 0.6, duration: 0.5, onComplete: () => el.remove() });
  });
  return <div ref={box} onPointerMove={move} className="absolute inset-0 grid place-items-center overflow-hidden"><span className="pointer-events-none text-mute">Bouge la souris ici</span></div>;
}

function Carousel() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % IMAGES.length), 2200); return () => clearInterval(t); }, []);
  return <Frame><AnimatePresence mode="popLayout"><motion.img key={i} src={IMAGES[i]} alt="" className={`${img} absolute inset-0`} initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} /></AnimatePresence></Frame>;
}

function Masonry() {
  const on = useToggle(3600);
  const h = [90, 130, 110, 140, 100, 120];
  return <div className="grid h-full grid-cols-3 content-center gap-2 p-4">{h.map((v, i) => <motion.div key={i} className="overflow-hidden rounded-lg" style={{ height: v }} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 30 }} transition={{ delay: i * 0.08, duration: 0.5 }}><Img i={i} /></motion.div>)}</div>;
}

function MouseParallax() {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20 }), sy = useSpring(y, { stiffness: 120, damping: 20 });
  return <Frame><div className="h-full w-full" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(((e.clientX - r.left) / r.width - 0.5) * -40); y.set(((e.clientY - r.top) / r.height - 0.5) * -40); }}><motion.img src={IMAGES[4]} alt="" className={`${img} scale-125`} style={{ x: sx, y: sy }} /></div></Frame>;
}

function VideoControls() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [p, setP] = useState(0);
  return (
    <Frame>
      <Vid ref={ref} autoPlay onTimeUpdate={(e) => setP(e.currentTarget.currentTime / (e.currentTarget.duration || 1))} />
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full bg-ink/70 px-3 py-2 backdrop-blur">
        <button className="icon-btn" aria-label={playing ? "Pause" : "Lecture"} onClick={() => { const v = ref.current!; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } }}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-teal" style={{ width: `${p * 100}%` }} /></div>
      </div>
    </Frame>
  );
}

function VideoScrub() {
  const ref = useRef<HTMLVideoElement>(null);
  return <Frame><div className="h-full w-full" onPointerMove={(e) => { const v = ref.current!; const r = e.currentTarget.getBoundingClientRect(); if (v.duration) v.currentTime = ((e.clientX - r.left) / r.width) * v.duration; }}><Vid ref={ref} preload="auto" /><span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-sm">Glisse horizontalement</span></div></Frame>;
}

function VideoHoverPlay() {
  const ref = useRef<HTMLVideoElement>(null);
  return <Frame><div className="h-full w-full" onPointerEnter={() => ref.current?.play()} onPointerLeave={() => ref.current?.pause()}><Vid ref={ref} /><span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-sm">Survole pour lire</span></div></Frame>;
}

function VideoKnockout() {
  return <Frame><Vid autoPlay /><div className="absolute inset-0 grid place-items-center bg-black mix-blend-multiply"><span className="text-8xl font-black tracking-tight text-white">VIDÉO</span></div></Frame>;
}

export const media = make("media", [
  ["Zoom lent (Ken Burns)", M, () => <Frame><motion.img src={IMAGES[0]} alt="" className={img} animate={{ scale: [1, 1.25], x: [0, -20] }} transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "linear" }} /></Frame>],
  ["Zoom au survol", M, () => <Frame><motion.div className="h-full w-full" whileHover="h"><motion.img src={IMAGES[1]} alt="" className={img} variants={{ h: { scale: 1.18 } }} transition={{ duration: 0.7 }} /></motion.div></Frame>],
  ["Révélation par rideau", M, () => <Frame><motion.div className="h-full w-full" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={loopT}><Img i={2} /></motion.div></Frame>],
  ["Révélation circulaire", M, () => <Frame><motion.div className="h-full w-full" initial={{ clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: "circle(75% at 50% 50%)" }} transition={loopT}><Img i={3} /></motion.div></Frame>],
  ["Parallaxe à la souris", M, () => <MouseParallax />],
  ["Gris vers couleur", M, () => <Frame><motion.div className="h-full w-full" initial={{ filter: "grayscale(1)" }} whileHover={{ filter: "grayscale(0)" }} transition={{ duration: 0.5 }}><Img i={4} /></motion.div></Frame>],
  ["Tranches verticales", M, () => <Slices />],
  ["Image inclinée en 3D", M, () => <TiltImage />],
  ["Glitch par tranches", M, () => <Glitch />],
  ["Traînée d'images", "GSAP", () => <Trail />],
  ["Carrousel en fondu", M + " · AnimatePresence", () => <Carousel />],
  ["Mosaïque en cascade", M, () => <Masonry />],
  ["Vidéo en boucle avec titre", M, () => <Frame><Vid autoPlay /><motion.p className="absolute inset-0 grid place-items-center text-4xl font-extrabold" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.4 }}>En mouvement</motion.p></Frame>],
  ["Vidéo dans un masque rond", M, () => <Frame><motion.div className="h-full w-full" initial={{ clipPath: "circle(28% at 50% 50%)" }} whileHover={{ clipPath: "circle(80% at 50% 50%)" }} transition={{ duration: 0.7 }}><Vid autoPlay /></motion.div></Frame>],
  ["Lecture au survol", M, () => <VideoHoverPlay />],
  ["Lecteur avec contrôles", M, () => <VideoControls />],
  ["Vidéo pilotée par la souris", M, () => <VideoScrub />],
  ["Vidéo qui grandit", M, () => <div className="grid h-full place-items-center"><motion.div className="h-40 w-64 overflow-hidden" initial={{ scale: 0.6, borderRadius: 48 }} animate={{ scale: 1.25, borderRadius: 12 }} transition={loopT}><Vid autoPlay /></motion.div></div>],
  ["Texte découpé dans la vidéo", M, () => <VideoKnockout />],
  ["Vidéo noir et blanc vers couleur", M, () => <Frame><motion.div className="h-full w-full" initial={{ filter: "grayscale(1)", scale: 1 }} whileHover={{ filter: "grayscale(0)", scale: 1.08 }} transition={{ duration: 0.6 }}><Vid autoPlay /></motion.div></Frame>],
]);
