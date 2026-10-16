"use client";
import { icons, type LucideProps } from "lucide-react";
import { motion, type TargetAndTransition, type Transition } from "motion/react";

export type IconName = keyof typeof icons;

/** <Icon name="Heart" /> : pratique pour des noms dynamiques. En production, préfère l'import direct (`import { Heart } from "lucide-react"`) : le bundle reste léger. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = icons[name];
  return <C {...props} />;
}

export type IconMotion = "spin" | "pulse" | "bounce" | "shake" | "float";
const variants: Record<IconMotion, { animate: TargetAndTransition; transition: Transition }> = {
  spin: { animate: { rotate: 360 }, transition: { duration: 2.4, repeat: Infinity, ease: "linear" } },
  pulse: { animate: { scale: [1, 1.25, 1] }, transition: { duration: 1.2, repeat: Infinity } },
  bounce: { animate: { y: [0, -10, 0] }, transition: { duration: 0.9, repeat: Infinity, ease: "easeOut" } },
  shake: { animate: { rotate: [0, -14, 14, -10, 10, 0] }, transition: { duration: 0.9, repeat: Infinity, repeatDelay: 0.8 } },
  float: { animate: { y: [0, -6, 0, 6, 0] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
};

/** Icône animée en boucle (spin, pulse, bounce, shake, float). */
export function AnimatedIcon({ name, motion: m = "pulse", ...props }: { name: IconName; motion?: IconMotion } & LucideProps) {
  const v = variants[m];
  return <motion.span className="inline-flex" animate={v.animate} transition={v.transition}><Icon name={name} {...props} /></motion.span>;
}
