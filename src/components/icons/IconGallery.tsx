"use client";
import { useDeferredValue, useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { AnimatedIcon, Icon, type IconMotion, type IconName } from "./Icon";
import { icons } from "lucide-react";

const ALL = Object.keys(icons).filter((n) => !n.endsWith("Icon") && !n.startsWith("Lucide")).sort() as IconName[];
const PAGE = 240;
const MOTIONS: IconMotion[] = ["spin", "pulse", "bounce", "shake", "float"];

export function IconGallery() {
  const [q, setQ] = useState("");
  const [size, setSize] = useState(28);
  const [stroke, setStroke] = useState(2);
  const [color, setColor] = useState("#edeef7");
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState<string | null>(null);
  const dq = useDeferredValue(q.trim().toLowerCase());
  const list = useMemo(() => ALL.filter((n) => n.toLowerCase().includes(dq)), [dq]);

  const copy = async (n: string) => {
    await navigator.clipboard?.writeText(`import { ${n} } from "lucide-react";\n\n<${n} size={${size}} strokeWidth={${stroke}} />`);
    setCopied(n); setTimeout(() => setCopied(null), 1200);
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Bibliothèque d'icônes</h1>
      <p className="mt-2 max-w-2xl text-mute">{ALL.length.toLocaleString("fr-FR")} icônes Lucide. Clique sur une icône pour copier son import et son code JSX.</p>

      <section aria-label="Icônes animées" className="mt-8 flex flex-wrap gap-4">
        {MOTIONS.map((m, i) => (
          <div key={m} className="flex w-32 flex-col items-center gap-3 rounded-2xl border border-line bg-panel p-5">
            <AnimatedIcon name={(["LoaderCircle", "Heart", "ArrowDown", "Bell", "Cloud"] as IconName[])[i]} motion={m} size={32} />
            <span className="text-sm text-mute">{m}</span>
          </div>
        ))}
      </section>

      <div className="sticky top-14 z-20 mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-ink/90 p-4 backdrop-blur">
        <label className="relative min-w-60 flex-1"><span className="sr-only">Rechercher une icône</span><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" /><input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Rechercher : heart, arrow, user…" className="w-full rounded-xl border border-line bg-panel py-2.5 pl-10 pr-3 outline-none focus:border-teal" /></label>
        <label className="flex items-center gap-2 text-sm text-mute">Taille<input type="range" min={16} max={64} value={size} onChange={(e) => setSize(+e.target.value)} />{size}px</label>
        <label className="flex items-center gap-2 text-sm text-mute">Trait<input type="range" min={0.5} max={3} step={0.25} value={stroke} onChange={(e) => setStroke(+e.target.value)} />{stroke}</label>
        <label className="flex items-center gap-2 text-sm text-mute">Couleur<input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded bg-transparent" /></label>
      </div>

      <p className="mt-4 text-sm text-mute" aria-live="polite">{list.length.toLocaleString("fr-FR")} résultat{list.length > 1 ? "s" : ""}</p>
      <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
        {list.slice(0, limit).map((n) => (
          <li key={n}>
            <button onClick={() => copy(n)} className="flex h-full w-full flex-col items-center gap-2 rounded-xl border border-line bg-panel p-3 hover:border-teal" title={`Copier ${n}`}>
              {copied === n ? <Check size={size} color="#3ddbd9" /> : <Icon name={n} size={size} strokeWidth={stroke} color={color} />}
              <span className="w-full truncate text-xs text-mute">{copied === n ? "Copié" : n}</span>
            </button>
          </li>
        ))}
      </ul>
      {limit < list.length && <div className="mt-8 text-center"><button className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>Afficher plus ({list.length - limit} restantes)</button></div>}
    </main>
  );
}
