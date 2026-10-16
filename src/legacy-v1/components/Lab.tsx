'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import Demo from './Demo'
import { info } from '../lib/describe'
import { defaultsFor, paramsFor, type Param } from '../lib/params'
import type { Fx } from '../lib/registry'

const box = 'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-violet-400'

function Field({ P, v, on }: { P: Param; v: any; on: (x: any) => void }) {
  if (P.type === 'check') return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80">{P.label}
      <input type="checkbox" checked={v} onChange={e => on(e.target.checked)} className="size-4 accent-violet-500" /></label>
  )
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-sm"><span className="text-white/70">{P.label}</span><span className="tabular-nums text-white">{P.type === 'range' ? v : P.type === 'color' ? v : ''}</span></div>
      {P.type === 'range' && <input type="range" min={P.min} max={P.max} step={P.step} value={v} onChange={e => on(+e.target.value)} className="h-5 accent-violet-500" />}
      {P.type === 'color' && <input type="color" value={v} onChange={e => on(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-white/15 bg-transparent" />}
      {P.type === 'text' && <input value={v} onChange={e => on(e.target.value)} className={box} />}
      {P.type === 'select' && <select value={v} onChange={e => on(e.target.value)} className={box + ' bg-[#12151c]'}>{P.options!.map(x => <option key={x} value={x}>{x}</option>)}</select>}
    </div>
  )
}

export default function Lab({ f, onClose, onNav }: { f: Fx; onClose: () => void; onNav: (d: number) => void }) {
  const [o, setO] = useState<Record<string, any>>({})
  const [n, setN] = useState(0)
  const [copied, setCopied] = useState('')
  const params = useMemo(() => paramsFor(f.cat, f.p), [f])
  const vals = useMemo(() => ({ ...defaultsFor(f.cat, f.p), ...o }), [f, o])
  const i = info(f, o)
  const changed = Object.keys(o).length

  useEffect(() => { setO({}); setN(x => x + 1) }, [f.id])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNav(1); if (e.key === 'ArrowLeft') onNav(-1) }
    const t = (e: KeyboardEvent) => (e.target as HTMLElement)?.tagName
    const k = (e: KeyboardEvent) => { if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(t(e))) h(e); else if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    document.documentElement.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.documentElement.style.overflow = '' }
  }, [onClose, onNav])
  const copy = async (text: string, tag: string) => { await navigator.clipboard.writeText(text); setCopied(tag); setTimeout(() => setCopied(''), 1400) }
  // GSAP, Motion, Lottie, scroll et landing redémarrent à chaque réglage ; le reste se met à jour en direct
  const key = ['gsap', 'motion', 'lottie', 'scroll', 'landing'].includes(f.cat) ? `${n}-${JSON.stringify(o)}` : String(n)

  return (
    <motion.div data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex flex-col bg-[#090a0f]">
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <button onClick={onClose} className="rounded-full border border-white/15 px-3 py-1.5 text-sm transition hover:border-white/40">Retour</button>
        <div className="min-w-0 flex-1"><div className="text-xs text-violet-300">{f.cat}</div><h2 className="truncate text-lg font-semibold">{f.name}</h2></div>
        <button onClick={() => onNav(-1)} aria-label="Animation précédente" className="grid size-9 place-items-center rounded-full border border-white/15 transition hover:border-white/40">‹</button>
        <button onClick={() => onNav(1)} aria-label="Animation suivante" className="grid size-9 place-items-center rounded-full border border-white/15 transition hover:border-white/40">›</button>
      </header>
      <div className="grid min-h-0 flex-1 grid-rows-[40vh_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_460px] lg:grid-rows-1">
        <div className="relative border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="fill absolute inset-0 grid place-items-center bg-[#0b0d12]"><Demo key={key} f={f} o={o} /></div>
          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
            <button onClick={() => setN(x => x + 1)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 active:scale-95">Rejouer</button>
          </div>
        </div>
        <motion.div key={f.id} data-lenis-prevent initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="min-h-0 space-y-7 overflow-y-auto p-5 sm:p-6">
          <p className="text-white/75">{i.desc}</p>
          <section className="grid gap-4">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Paramètres</h3>
              <button onClick={() => { setO({}); setN(x => x + 1) }} disabled={!changed} className="rounded-full border border-white/20 px-3 py-1 text-xs transition enabled:hover:border-white/50 disabled:opacity-40">Réinitialiser{changed ? ` (${changed})` : ''}</button></div>
            {params.map(P => <Field key={P.key} P={P} v={vals[P.key]} on={x => setO(s => ({ ...s, [P.key]: x }))} />)}
          </section>
          <section className="grid gap-2 text-sm">
            <h3 className="text-lg font-semibold">Utiliser dans ton projet</h3>
            <div className="text-white/50">Installer</div>
            <button onClick={() => copy(`npm i ${i.deps}`, 'deps')} className="rounded-lg border border-white/15 px-3 py-2 text-left font-mono text-xs transition hover:border-white/40">npm i {i.deps}{copied === 'deps' ? '  (copié)' : ''}</button>
            <div className="mt-1 text-white/50">Fichiers à copier</div><div className="text-white/80">{i.files}</div>
          </section>
          <section className="grid gap-2">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Code avec tes réglages</h3>
              <button onClick={() => copy(i.code, 'code')} className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:border-white/50">{copied === 'code' ? 'Copié' : 'Copier'}</button></div>
            <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-white/85">{i.code}</pre>
          </section>
        </motion.div>
      </div>
    </motion.div>
  )
}
