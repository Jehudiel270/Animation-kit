"use client";
import { FAMILIES } from "@/registry";
import { SmoothScroll } from "@/components/core/SmoothScroll";

const ALL = FAMILIES.find((f) => f.id === "sections")!.items;

/** Affiche les sections de landing (toutes, ou celles listées dans `ids`) avec défilement fluide. */
export function Sections({ ids }: { ids?: string[] }) {
  const items = ids ? ALL.filter((i) => ids.includes(i.id)) : ALL;
  return (
    <SmoothScroll>
      {items.map((i) => <div key={i.id} id={i.id}><i.C /></div>)}
    </SmoothScroll>
  );
}
