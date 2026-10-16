"use client";
import * as C from "@/components/micro";
import { make } from "./types";

const M = "Motion";
export const micro = make("micro", [
  ["Bouton magnétique", M, C.Magnetic],
  ["Curseur personnalisé", M, C.CursorFollower],
  ["Carte inclinable avec reflet", M, C.TiltCard],
  ["Bouton à ondulation", M, C.Ripple],
  ["Interrupteur à ressort", M, C.Toggle],
  ["Lien souligné au survol", M, C.UnderlineLink],
  ["Cœur qui éclate", M, C.LikeBurst],
  ["Accordéon", M + " · AnimatePresence", C.Accordion],
  ["Liste animée automatiquement", "AutoAnimate", C.AutoList],
  ["Liste réordonnable", M + " · Reorder", C.ReorderList],
  ["Carte déplaçable", M + " · drag", C.DragCard],
  ["Carte à projecteur", M, C.Spotlight],
  ["Bouton avec reflet", M, C.Shine],
  ["Chargement en squelette", M, C.Skeleton],
  ["Champ avec libellé flottant", M, C.FloatingLabel],
  ["Info-bulle", M + " · AnimatePresence", C.Tooltip],
  ["Notifications empilées", M + " · layout", C.Toasts],
  ["Compteur à pas", M, C.Stepper],
  ["Cartes pressables", M + " · whileTap", C.PressCards],
  ["Menu burger animé", M, C.Hamburger],
]);
