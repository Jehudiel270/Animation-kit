"use client";
import { LottieDemo as L, RiveSlot } from "@/components/lottie";
import { make } from "./types";

const LT = "lottie-react";
const RV = "@rive-app/react-canvas";
const V = "#7c5cff", T = "#3ddbd9", A = "#ffb547", P = "#ff6b9a";

export const lottie = make("lottie", [
  ["Carré qui tourne", LT, () => <L shape="rc" anim="spin" color={V} />],
  ["Cercle qui pulse", LT, () => <L shape="el" anim="pulse" color={T} />],
  ["Étoile qui tourne", LT, () => <L shape="sr" anim="spin" color={A} />],
  ["Carré qui rebondit", LT, () => <L shape="rc" anim="bounce" color={P} />],
  ["Étoile qui se balance", LT, () => <L shape="sr" anim="swing" color={T} />],
  ["Anneau de chargement", LT, () => <L shape="el" anim="draw" color={V} />],
  ["Satellite en orbite", LT, () => <L shape="el" anim="orbit" color={A} />],
  ["Cercle qui rebondit", LT, () => <L shape="el" anim="bounce" color={T} />],
  ["Animation Rive (exemple en ligne)", RV, () => <RiveSlot src="https://cdn.rive.app/animations/vehicles.riv" stateMachines="bumpy" />],
  ["Emplacement Rive (ton fichier)", RV, () => <RiveSlot src="/rive/mon-animation.riv" />],
]);
