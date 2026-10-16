import type { Family } from "./types";
import { text } from "./text";
import { scroll } from "./scroll";
import { three } from "./three";
import { particles } from "./particles";
import { media } from "./media";
import { transitions } from "./transitions";
import { micro } from "./micro";
import { lottie } from "./lottie";
import { sections } from "./sections";
import { v1Families } from "./v1";

export const FAMILIES: Family[] = [
  { id: "text", label: "Texte et typographie", lib: "GSAP, SplitText", items: text },
  { id: "scroll", label: "Scroll et parallaxe", lib: "GSAP ScrollTrigger, Lenis", items: scroll },
  { id: "three", label: "3D et WebGL", lib: "Three.js, React Three Fiber, drei", items: three },
  { id: "particles", label: "Particules", lib: "tsParticles, R3F Points", items: particles },
  { id: "media", label: "Vidéo et image", lib: "Motion, GSAP, HTML5 video", items: media },
  { id: "transitions", label: "Transitions de page", lib: "Motion", items: transitions },
  { id: "micro", label: "Micro-interactions", lib: "Motion, AutoAnimate", items: micro },
  { id: "lottie", label: "Lottie et Rive", lib: "lottie-react, Rive", items: lottie },
  { id: "sections", label: "Sections de landing", lib: "Toutes les familles", items: sections },
  ...v1Families,
];

export const TOTAL = FAMILIES.reduce((n, f) => n + f.items.length, 0);
