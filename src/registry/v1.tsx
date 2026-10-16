"use client";
import type { ComponentType } from "react";
import Demo from "@/legacy-v1/components/Demo";
import { CATS, REG, type Cat, type Fx } from "@/legacy-v1/lib/registry";
import { info } from "@/legacy-v1/lib/describe";
import type { Family, FamilyId, Item } from "./types";

const LABEL: Record<Cat, string> = {
  gsap: "GSAP",
  motion: "Motion",
  particles: "Particules",
  three: "3D",
  scroll: "Scroll",
  media: "Médias",
  landing: "Landing",
  shader: "Shaders",
  lottie: "Lottie",
};

const legacyFamilyId = (category: Cat) => `v1-${category}` as FamilyId;

function makeLegacyItem(fx: Fx): Item {
  const Preview: ComponentType = () => <Demo f={fx} />;
  return {
    id: `v1-${fx.id}`,
    title: fx.name,
    lib: `V1 · ${LABEL[fx.cat]}`,
    C: Preview,
    legacy: fx,
  };
}

export const v1Families: Family[] = CATS.map((category) => {
  const effects = REG.filter((fx) => fx.cat === category);
  return {
    id: legacyFamilyId(category),
    label: `V1 · ${LABEL[category]}`,
    lib: effects.map((fx) => info(fx).deps).filter((value, index, all) => all.indexOf(value) === index).join(", "),
    items: effects.map(makeLegacyItem),
  };
});
