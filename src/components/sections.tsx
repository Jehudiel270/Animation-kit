"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useInView } from "motion/react";
import { Float } from "@react-three/drei";
import { Box, Film, Layers, MousePointerClick, Shapes, Sparkles, Zap } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useTilt } from "@/lib/hooks";
import { IMAGES, VIDEO } from "@/lib/media";
import { Scene, Shape3D } from "./three";
import { TsParticles, cfg, fill } from "./particles";
import { Marquee, SplitReveal } from "./text";

const Cta = () => <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3"><Link href="/catalogue" className="btn btn-primary">Explorer le catalogue</Link><Link href="/icons" className="btn btn-ghost">Voir les icônes</Link></div>;
const H1 = "text-5xl md:text-7xl";

export function Hero3D() {
  return (
    <section className="relative h-[88vh] min-h-[520px] overflow-hidden">
      <div className="absolute inset-0"><Scene cam={[0, 0, 6]}><Float speed={2} floatIntensity={1.2}><Shape3D shape="knot" mat="distort" motion="mouse" color="#7c5cff" /></Float></Scene></div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
        <div className="max-w-4xl">
          <SplitReveal text="Le mouvement donne vie au web" unit="words" mask="words" from={{ yPercent: 110, opacity: 0 }} stagger={0.12} loop={false} className={H1} wrap="" />
          <p className="mx-auto mt-5 max-w-xl text-lg text-mute">396 animations V1 + V2 prêtes à copier dans tes projets : texte, scroll, 3D, particules, vidéo et plus.</p>
          <Cta />
        </div>
      </div>
    </section>
  );
}

const heroParticles = cfg({ particles: { number: { value: 70 }, ...fill("#7c5cff"), size: { value: { min: 1, max: 3 } }, opacity: { value: 0.7 }, links: { enable: true, distance: 140, color: "#3ddbd9", opacity: 0.3, width: 1 }, move: { enable: true, speed: 1, outModes: { default: "out" } } }, interactivity: { events: { onHover: { enable: true, mode: "grab" } }, modes: { grab: { distance: 170, links: { opacity: 0.9 } } } } });
export function HeroParticles() {
  const id = useId().replace(/:/g, "");
  return (
    <section className="relative grid h-[80vh] min-h-[480px] place-items-center overflow-hidden px-6 text-center">
      <TsParticles id={`hp${id}`} options={heroParticles} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="pointer-events-none relative max-w-3xl">
        <h2 className={`${H1} font-extrabold tracking-tight`}>Un réseau d'idées en mouvement</h2>
        <p className="mt-4 text-lg text-mute">Les particules réagissent au curseur : approche-le des points.</p>
      </motion.div>
    </section>
  );
}

export function HeroVideo() {
  return (
    <section className="relative flex h-[80vh] min-h-[480px] flex-col justify-end overflow-hidden">
      <video src={VIDEO.src} poster={VIDEO.poster} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative px-6 pb-10"><h2 className={`${H1} font-extrabold tracking-tight`}>Raconter en images</h2></div>
      <Marquee items={["Photo", "Vidéo", "Motion", "Son", "3D"]} speed={80} className="relative border-t border-white/20 py-3 text-xl font-semibold" />
    </section>
  );
}

const STEPS = [["Dessine", "Pose les bases : formes, couleurs, rythme.", "#7c5cff"], ["Anime", "Donne du mouvement avec GSAP ou Motion.", "#3ddbd9"], ["Publie", "Déploie en une commande sur Vercel.", "#ffb547"]];
export function PinnedShowcase() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root.current);
    gsap.set(steps.slice(1), { opacity: 0, y: 40 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=300%", pin: true, scrub: 1 } });
    steps.forEach((s, i) => {
      if (i > 0) tl.to(steps[i - 1], { opacity: 0, y: -40 }).to(s, { opacity: 1, y: 0 }, "<").to("[data-panel]", { backgroundColor: STEPS[i][2], rotate: i * 12, scale: 1 + i * 0.08 }, "<");
      tl.to({}, { duration: 0.8 });
    });
  }, { scope: root });
  return (
    <section ref={root} className="flex h-screen items-center gap-10 px-8 md:px-20">
      <div className="relative h-56 flex-1">{STEPS.map(([t, d], i) => <div key={t} data-step className="absolute inset-0"><p className="text-mute">Étape {i + 1} sur 3</p><h2 className="mt-2 text-5xl font-extrabold">{t}</h2><p className="mt-3 max-w-md text-lg text-mute">{d}</p></div>)}</div>
      <div data-panel className="hidden aspect-square w-72 rounded-[2rem] md:block" style={{ background: STEPS[0][2] }} />
    </section>
  );
}

export function HorizontalGallery() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
    gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 80), ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${track.scrollWidth}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
  }, { scope: root });
  return (
    <section ref={root} className="flex h-screen flex-col justify-center gap-8 overflow-hidden">
      <h2 className="px-8 text-4xl font-extrabold md:px-20">Galerie horizontale</h2>
      <div data-track className="flex w-max gap-6 px-8 md:px-20">{IMAGES.map((s, i) => <img key={i} src={s} alt="" className="h-[48vh] w-[34vw] min-w-64 rounded-3xl object-cover" />)}</div>
    </section>
  );
}

function Stat({ to, label, suffix = "" }: { to: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    const element = ref.current;
    if (!inView || !element) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (value) => { element.textContent = Math.round(value).toLocaleString("fr-FR") + suffix; },
      onComplete: () => { element.textContent = to.toLocaleString("fr-FR") + suffix; },
    });
    return () => controls.stop();
  }, [inView, suffix, to]);
  return <div><span ref={ref} className="text-5xl font-extrabold tabular-nums md:text-6xl">{to.toLocaleString("fr-FR") + suffix}</span><p className="mt-2 text-mute">{label}</p></div>;
}
export function Stats() {
  return <section className="mx-auto grid max-w-6xl gap-10 px-6 py-28 sm:grid-cols-2 md:grid-cols-4"><Stat to={396} label="animations V1 + V2" /><Stat to={18} label="familles" /><Stat to={1500} suffix="+" label="icônes" /><Stat to={26} label="thèmes" /></section>;
}

const FEATURES = [[Zap, "Rapide à copier", "Chaque animation est un composant isolé."], [Layers, "Bibliothèques reconnues", "GSAP, Motion, Three.js, tsParticles, Lenis."], [Box, "3D intégrée", "Scènes React Three Fiber prêtes à l'emploi."], [Sparkles, "Particules", "2D avec tsParticles, 3D avec des points WebGL."], [Film, "Vidéo et image", "Masques, révélations, lecteurs, effets au survol."], [MousePointerClick, "Micro-interactions", "Boutons, cartes, listes, menus."]] as const;
function Feature({ Icon, title, text }: { Icon: (typeof FEATURES)[number][0]; title: string; text: string }) {
  const [p, setP] = useState({ x: -200, y: -200 });
  return (
    <div onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top }); }} className="rounded-2xl border border-line bg-panel p-6" style={{ backgroundImage: `radial-gradient(220px circle at ${p.x}px ${p.y}px, rgba(124,92,255,.28), transparent 70%)` }}>
      <Icon className="text-teal" size={28} /><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-1 text-mute">{text}</p>
    </div>
  );
}
export function FeatureGrid() {
  return <section className="mx-auto max-w-6xl px-6 py-24"><h2 className="mb-10 text-4xl font-extrabold">Tout ce qu'il faut pour animer</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map(([I, t, d]) => <Feature key={t} Icon={I} title={t} text={d} />)}</div></section>;
}

const QUOTES = ["Un seul kit pour tous nos sites : on gagne des jours.", "Les animations se copient en deux minutes.", "La 3D est enfin accessible à toute l'équipe.", "Des effets propres, sans réinventer la roue."];
export function Testimonials() {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <section className="overflow-hidden py-24">
      <h2 className="mb-8 px-6 text-4xl font-extrabold md:px-20">Ce que l'équipe en dit</h2>
      <div ref={wrap} className="px-6 md:px-20"><motion.div drag="x" dragConstraints={{ left: -520, right: 0 }} className="flex w-max cursor-grab gap-5 active:cursor-grabbing">{QUOTES.map((q, i) => <figure key={i} className="w-80 shrink-0 rounded-2xl border border-line bg-panel p-6"><blockquote className="text-lg">« {q} »</blockquote><figcaption className="mt-4 text-mute">Membre de l'équipe {i + 1}</figcaption></figure>)}</motion.div></div>
    </section>
  );
}

export function LogosMarquee() {
  return <section className="py-20"><Marquee items={["GSAP", "Motion", "Three.js", "tsParticles", "Lenis", "Lottie", "Rive", "Tailwind"]} speed={70} className="text-5xl font-extrabold text-mute" /><div className="mt-10 text-center"><Link href="/catalogue" className="btn btn-primary">Commencer maintenant</Link></div></section>;
}

export function ParallaxStory() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-l]", root.current).forEach((el, i) => gsap.fromTo(el, { yPercent: -12 * (i + 1) }, { yPercent: 12 * (i + 1), ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }));
  }, { scope: root });
  return (
    <section ref={root} className="relative h-[110vh] overflow-hidden">
      {[0, 1, 2].map((i) => <img key={i} data-l src={IMAGES[i + 2]} alt="" className="absolute h-[55%] w-[36%] rounded-3xl object-cover" style={{ left: `${8 + i * 30}%`, top: `${10 + (i % 2) * 28}%` }} />)}
      <div className="absolute inset-0 grid place-items-center px-6 text-center"><h2 className="max-w-3xl text-5xl font-extrabold tracking-tight mix-blend-difference md:text-7xl">Des couches qui bougent à des vitesses différentes</h2></div>
    </section>
  );
}

function Plan({ name, price, hot }: { name: string; price: string; hot?: boolean }) {
  const { rotateX, rotateY, bind } = useTilt(10);
  return (
    <div className="[perspective:900px]" {...bind}>
      <motion.div style={{ rotateX, rotateY }} className={`rounded-3xl p-8 ${hot ? "bg-violet" : "border border-line bg-panel"}`}>
        <h3 className="text-xl font-bold">{name}</h3><p className="mt-3 text-5xl font-extrabold">{price}</p><p className="mt-1 opacity-80">par mois</p>
        <button className={`btn mt-6 w-full ${hot ? "bg-ink text-text" : "btn-ghost"}`}>Choisir</button>
      </motion.div>
    </div>
  );
}
export function PricingTilt() {
  return <section className="mx-auto max-w-5xl px-6 py-24"><h2 className="mb-10 text-center text-4xl font-extrabold">Tarifs (exemple)</h2><div className="grid gap-5 md:grid-cols-3"><Plan name="Essentiel" price="9 €" /><Plan name="Pro" price="29 €" hot /><Plan name="Équipe" price="79 €" /></div></section>;
}

export function InteractiveFooter() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const chars = gsap.utils.toArray<HTMLElement>("[data-ch]", root.current);
    const move = (e: PointerEvent) => chars.forEach((c) => { const r = c.getBoundingClientRect(); const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)); gsap.to(c, { scale: 1 + Math.max(0, 1 - d / 260) * 0.6, y: -Math.max(0, 1 - d / 260) * 24, color: d < 130 ? "#3ddbd9" : "#edeef7", duration: 0.35, overwrite: true }); });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, { scope: root });
  return (
    <footer ref={root} className="overflow-hidden border-t border-line px-6 pt-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 pb-10"><p className="max-w-sm text-lg text-mute">Une base d'animations à réutiliser dans chacun de tes projets.</p><nav className="flex gap-5 font-semibold"><Link href="/catalogue">Catalogue</Link><Link href="/sections">Sections</Link><Link href="/icons">Icônes</Link></nav></div>
      <p className="select-none whitespace-nowrap text-center text-[17vw] font-extrabold leading-none tracking-tighter" aria-label="Motion Kit">{"MotionKit".split("").map((c, i) => <span key={i} data-ch className="inline-block" aria-hidden>{c}</span>)}</p>
    </footer>
  );
}

export { Shapes, ScrollTrigger };
