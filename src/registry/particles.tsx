"use client";
import { useId } from "react";
import { TsParticles, PointsScene, generators as g, ticks, cfg, fill } from "@/components/particles";
import { make } from "./types";

const TS = "tsParticles";
const R3 = "React Three Fiber · Points";
const move = (o: object = {}) => ({ enable: true, speed: 1, outModes: { default: "out" }, ...o });

const network = cfg({ particles: { number: { value: 70 }, ...fill("#7c5cff"), size: { value: { min: 1, max: 3 } }, opacity: { value: 0.7 }, links: { enable: true, distance: 140, color: "#3ddbd9", opacity: 0.35, width: 1 }, move: move({ speed: 1.1 }) }, interactivity: { events: { onHover: { enable: true, mode: "grab" } }, modes: { grab: { distance: 170, links: { opacity: 0.9 } } } } });
const snow = cfg({ particles: { number: { value: 90 }, ...fill("#ffffff"), size: { value: { min: 1, max: 4 } }, opacity: { value: { min: 0.3, max: 0.9 } }, move: move({ direction: "bottom", speed: 1.2, straight: false }) } });
const fireflies = cfg({ particles: { number: { value: 45 }, ...fill("#ffb547"), size: { value: { min: 2, max: 4 } }, opacity: { value: { min: 0.1, max: 1 }, animation: { enable: true, speed: 0.8, sync: false } }, move: move({ speed: 0.6, random: true }) } });
const bubbles = cfg({ particles: { number: { value: 50 }, ...fill(["#7c5cff", "#3ddbd9"]), size: { value: { min: 3, max: 8 } }, opacity: { value: 0.6 }, move: move({ speed: 0.7 }) }, interactivity: { events: { onHover: { enable: true, mode: "bubble" } }, modes: { bubble: { distance: 150, size: 18, duration: 2, opacity: 1 } } } });
const repulse = cfg({ particles: { number: { value: 90 }, ...fill("#3ddbd9"), size: { value: 3 }, opacity: { value: 0.8 }, move: move({ speed: 0.5 }) }, interactivity: { events: { onHover: { enable: true, mode: "repulse" } }, modes: { repulse: { distance: 120, duration: 0.4 } } } });
const attract = cfg({ particles: { number: { value: 80 }, ...fill("#ffb547"), size: { value: { min: 1, max: 3 } }, move: move({ speed: 1 }) }, interactivity: { events: { onHover: { enable: true, mode: "attract" } }, modes: { attract: { distance: 220, speed: 3 } } } });
const stars = cfg({ particles: { number: { value: 40 }, ...fill(["#ffb547", "#ffffff"]), shape: { type: "star" }, size: { value: { min: 4, max: 9 } }, rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 8 } }, move: move({ speed: 0.6 }) } });
const emoji = cfg({ particles: { number: { value: 28 }, shape: { type: "emoji", options: { emoji: { value: ["✨", "🎉", "💫", "⭐"] } } }, size: { value: { min: 14, max: 24 } }, move: move({ direction: "top", speed: 1.4 }) } });
const confetti = cfg({ particles: { number: { value: 0 }, ...fill(["#7c5cff", "#3ddbd9", "#ffb547", "#ff6b9a"]), shape: { type: "square" }, size: { value: { min: 4, max: 8 } }, rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 20 } }, move: { enable: true, direction: "top", speed: { min: 8, max: 16 }, gravity: { enable: true, acceleration: 9 }, decay: 0.03, outModes: { default: "destroy", bottom: "destroy" } }, life: { duration: { value: 3 }, count: 1 } }, emitters: { position: { x: 50, y: 100 }, rate: { quantity: 6, delay: 0.25 }, size: { width: 20, height: 0 } } });
const rain = cfg({ particles: { number: { value: 110 }, ...fill("#9bb4ff"), shape: { type: "line" }, size: { value: { min: 8, max: 16 } }, opacity: { value: 0.5 }, move: move({ direction: "bottom", speed: 14, straight: true }) } });

const ts = (cfgObj: ReturnType<typeof cfg>) => function Demo() { const id = useId().replace(/:/g, ""); return <TsParticles id={`p${id}`} options={cfgObj} />; };

export const particles = make("particles", [
  ["Réseau de points reliés", TS, ts(network)],
  ["Neige", TS, ts(snow)],
  ["Lucioles", TS, ts(fireflies)],
  ["Bulles qui grossissent au survol", TS, ts(bubbles)],
  ["Particules repoussées par le curseur", TS, ts(repulse)],
  ["Particules attirées par le curseur", TS, ts(attract)],
  ["Étoiles qui tournent", TS, ts(stars)],
  ["Emojis flottants", TS, ts(emoji)],
  ["Confettis", TS + " · emitters", ts(confetti)],
  ["Pluie", TS, ts(rain)],
  ["Sphère de points", R3, () => <PointsScene make={g.sphere} spin={0.25} />],
  ["Galaxie spirale", R3, () => <PointsScene n={3000} make={g.galaxy} spin={0.15} color="#3ddbd9" cam={6} />],
  ["Nappe ondulante", R3, () => <PointsScene n={2500} make={g.grid} tick={ticks.wave} spin={0.05} color="#7c5cff" cam={5} />],
  ["Nuage à la dérive", R3, () => <PointsScene n={1500} make={g.cloud} tick={ticks.drift} spin={0.04} color="#ffb547" />],
  ["Points attirés par le curseur", R3, () => <PointsScene n={1400} make={g.cloud} tick={ticks.attract} spin={0} color="#3ddbd9" cam={6} />],
  ["Ondes d'anneaux", R3, () => <PointsScene n={1600} make={g.grid} tick={ticks.rings} spin={0} color="#ff6b9a" cam={6} />],
  ["Réseau cubique de points", R3, () => <PointsScene n={1000} make={g.lattice} spin={0.2} color="#7c5cff" cam={6} />],
  ["Tornade", R3, () => <PointsScene n={2200} make={g.vortex} spin={0.9} color="#ffb547" cam={6} />],
]);
