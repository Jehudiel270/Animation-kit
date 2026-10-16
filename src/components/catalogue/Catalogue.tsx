"use client";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { FAMILIES, TOTAL } from "@/registry";
import type { FamilyId } from "@/registry/types";
import { Stage } from "@/components/core/Stage";

export function Catalogue() {
  const [fam, setFam] = useState<FamilyId | "all">("all");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = FAMILIES.filter((f) => fam === "all" || f.id === fam);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">{TOTAL} animations</h1>
      <p className="mt-2 max-w-2xl text-mute">Chaque carte montre l'animation en direct. Rejoue-la, puis copie son identifiant pour retrouver le code dans <code className="font-code text-text">src/registry</code>.</p>

      <div className="mt-8 rounded-2xl border border-line bg-panel/70 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:max-w-md"><span className="sr-only">Rechercher une animation</span><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher : parallaxe, 3D, curseur…" className="w-full rounded-xl border border-line bg-ink/70 py-3 pl-10 pr-3 outline-none transition focus:border-teal" /></label>
          <p className="text-sm text-mute sm:ml-auto">{needle ? `${FAMILIES.reduce((count, family) => count + family.items.filter((item) => `${item.title} ${item.lib} ${family.label}`.toLowerCase().includes(needle)).length, 0)} résultats` : `${TOTAL} animations disponibles`}</p>
        </div>
        <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Familles d'animations">
          <button role="tab" aria-selected={fam === "all"} onClick={() => setFam("all")} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${fam === "all" ? "border-violet bg-violet text-white" : "border-line bg-ink/50 text-mute hover:border-teal hover:text-text"}`}>Toutes <span className="ml-1 opacity-70">{TOTAL}</span></button>
          {FAMILIES.map((f) => <button key={f.id} role="tab" aria-selected={fam === f.id} onClick={() => setFam(f.id)} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${fam === f.id ? "border-violet bg-violet text-white" : "border-line bg-ink/50 text-mute hover:border-teal hover:text-text"}`}>{f.label} <span className="ml-1 opacity-70">{f.items.length}</span></button>)}
        </div>
      </div>

      {shown.map((f) => {
        const items = f.items.filter((i) => !needle || `${i.title} ${i.lib} ${f.label}`.toLowerCase().includes(needle));
        if (!items.length) return null;
        return (
          <section key={f.id} className="mt-10" aria-labelledby={`h-${f.id}`}>
            <h2 id={`h-${f.id}`} className="text-2xl font-bold">{f.label}</h2>
            <p className="mb-5 text-mute">{f.lib}</p>
            {f.id === "sections" ? (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((i) => <li key={i.id}><Link href={`/sections#${i.id}`} className="block rounded-2xl border border-line bg-panel p-5 hover:border-teal"><p className="font-semibold">{i.title}</p><p className="text-sm text-mute">{i.lib} — {i.id}</p></Link></li>)}</ul>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((i) => <Stage key={i.id} id={i.id} title={i.title} lib={i.lib} legacy={i.legacy}><i.C /></Stage>)}</div>
            )}
          </section>
        );
      })}
    </main>
  );
}
