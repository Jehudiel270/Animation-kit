"use client";
import { useEffect, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "motion/react";

/** Bascule true/false toutes les `ms` : sert à rejouer les démos en boucle. */
export function useToggle(ms = 2600) {
  const [on, set] = useState(false);
  useEffect(() => {
    const t = setInterval(() => set((v) => !v), ms);
    return () => clearInterval(t);
  }, [ms]);
  return on;
}

/** Inclinaison 3D qui suit le pointeur (cartes, images). */
export function useTilt(max = 14) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 18 });
  const sy = useSpring(py, { stiffness: 200, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const bind = {
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width);
      py.set((e.clientY - r.top) / r.height);
    },
    onPointerLeave: () => { px.set(0.5); py.set(0.5); },
  };
  return { rotateX, rotateY, px, py, bind };
}
