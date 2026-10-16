"use client";
import { useMemo } from "react";
import { Lottie } from "lottie-react";
import { useRive } from "@rive-app/react-canvas";
import { makeLottie, type LAnim, type LShape } from "@/lib/lottie";

const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

/** Lottie généré en code. Pour un vrai fichier : <Lottie src={json} /> avec ton export After Effects ou LottieFiles (prop `src` : objet JSON ou URL). */
export function LottieDemo({ shape, anim, color }: { shape: LShape; anim: LAnim; color: string }) {
  const data = useMemo(() => makeLottie({ shape, anim, color: hex(color) }), [shape, anim, color]);
  return <div className="grid h-full place-items-center"><Lottie src={data} loop className="h-44 w-44" /></div>;
}

/** Animation Rive : dépose ton fichier .riv dans /public/rive et passe son chemin dans `src`. */
export function RiveSlot({ src, stateMachines }: { src: string; stateMachines?: string }) {
  const { RiveComponent } = useRive({ src, stateMachines, autoplay: true });
  return <div className="h-full w-full"><RiveComponent /></div>;
}
