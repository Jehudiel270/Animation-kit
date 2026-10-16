"use client";
import { SplitReveal, SplitFx, Typewriter, WordSwap, Scramble, Marquee, MarqueeRows, Counter } from "@/components/text";
import { make } from "./types";

const T = "Animer le web autrement";
const L = "Une bibliothèque d'animations pensée pour les projets exigeants, du simple effet de texte à la scène 3D complète.";
const G = "GSAP · SplitText";

const stroke = "[-webkit-text-stroke:1.5px_var(--color-text)] text-transparent";

export const text = make("text", [
  ["Lettres montantes", G, () => <SplitReveal text={T} mask="chars" from={{ yPercent: 110, opacity: 0 }} />],
  ["Lettres en rotation 3D", G, () => <SplitReveal text={T} from={{ rotationX: -90, opacity: 0, transformOrigin: "50% 100%", transformPerspective: 600 }} />],
  ["Lettres floues", G, () => <SplitReveal text={T} from={{ filter: "blur(14px)", opacity: 0, y: 20 }} />],
  ["Lettres en zoom", G, () => <SplitReveal text={T} from={{ scale: 0, opacity: 0 }} ease="back.out(2)" />],
  ["Lettres en ordre aléatoire", G, () => <SplitReveal text={T} from={{ y: 30, opacity: 0 }} stagger={{ each: 0.04, from: "random" }} />],
  ["Lettres qui rebondissent", G, () => <SplitReveal text={T} from={{ y: -70, opacity: 0 }} ease="elastic.out(1,0.4)" duration={1.6} />],
  ["Mots montants", G, () => <SplitReveal text={T} unit="words" mask="words" from={{ yPercent: 110, opacity: 0 }} stagger={0.12} />],
  ["Mots en fondu flou", G, () => <SplitReveal text={T} unit="words" from={{ opacity: 0, filter: "blur(10px)" }} stagger={0.15} />],
  ["Mots inclinés", G, () => <SplitReveal text={T} unit="words" from={{ skewX: 30, x: -40, opacity: 0 }} stagger={0.12} />],
  ["Mots qui se retournent", G, () => <SplitReveal text={T} unit="words" from={{ rotationY: 90, opacity: 0, transformPerspective: 600 }} stagger={0.12} />],
  ["Lignes masquées", G, () => <SplitReveal text={L} unit="lines" mask="lines" from={{ yPercent: 100, opacity: 0 }} stagger={0.15} />],
  ["Lignes en fondu", G, () => <SplitReveal text={L} unit="lines" from={{ opacity: 0, y: 30 }} stagger={0.2} />],
  ["Machine à écrire", "GSAP · TextPlugin", () => <Typewriter words={["Bonjour.", "Bienvenue.", "Créons ensemble."]} />],
  ["Mots qui défilent", "GSAP", () => <WordSwap prefix="Nous créons" words={["des sites", "des apps", "des marques"]} />],
  ["Brouillage de texte", "GSAP · ScrambleText", () => <Scramble text="Décodage en cours" />],
  ["Brouillage au survol", "GSAP · ScrambleText", () => <Scramble text="Survole ce texte" hover />],
  ["Bandeau défilant", "GSAP", () => <div className="grid h-full place-items-center text-5xl font-extrabold"><Marquee items={["Design", "Code", "Motion", "3D"]} /></div>],
  ["Deux bandeaux inversés", "GSAP", () => <MarqueeRows />],
  ["Vague de lettres", G, () => <SplitFx text={T} run={(t, tl) => { tl.to(t, { y: -18, duration: 0.5, ease: "sine.inOut", stagger: 0.06, yoyo: true, repeat: 1 }); }} />],
  ["Compteur", "GSAP", () => <Counter to={12840} />],
  ["Contour qui se remplit", G, () => <SplitFx text="Motion Kit" className={`text-6xl ${stroke}`} run={(t, tl) => { tl.to(t, { color: "#edeef7", duration: 0.6, stagger: 0.08 }).to(t, { color: "rgba(237,238,247,0)", duration: 0.5, delay: 1.2 }); }} />],
  ["Espacement qui s'ouvre", G, () => <SplitFx text="ESPACE" unit="words" className="text-5xl" run={(t, tl) => { tl.fromTo(t, { letterSpacing: "-0.12em", opacity: 0 }, { letterSpacing: "0.18em", opacity: 1, duration: 2.2, ease: "power3.out" }); }} />],
  ["Scintillement", G, () => <SplitFx text={T} run={(t, tl) => { tl.from(t, { opacity: 0, duration: 0.1, stagger: { each: 0.05, from: "random", repeat: 3, yoyo: true } }); }} />],
  ["Cascade d'arc-en-ciel", G, () => <SplitFx text={T} run={(t, tl) => { tl.to(t, { color: (i: number) => `hsl(${i * 16},90%,65%)`, duration: 0.4, stagger: 0.05 }).to(t, { color: "#edeef7", duration: 0.4, delay: 1.4 }); }} />],
]);
