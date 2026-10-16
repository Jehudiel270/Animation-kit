import type { ComponentType } from "react";
import type { Fx } from "@/legacy-v1/lib/registry";

export type FamilyId = "text" | "scroll" | "three" | "particles" | "media" | "transitions" | "micro" | "lottie" | "sections" | `v1-${string}`;
export type Item = { id: string; title: string; lib: string; C: ComponentType; legacy?: Fx };
export type Family = { id: FamilyId; label: string; lib: string; items: Item[] };

/** Fabrique une famille : [titre, bibliothèque, composant] -> items avec id stable (text-01, text-02...). */
export const make = (id: FamilyId, defs: [string, string, ComponentType][]): Item[] =>
  defs.map(([title, lib, C], i) => ({ id: `${id}-${String(i + 1).padStart(2, "0")}`, title, lib, C }));
