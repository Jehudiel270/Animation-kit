'use client'
import { useMemo, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { Fx } from '../lib/registry'
import { paramsFor } from '../lib/params'
import { info } from '../lib/describe'
import Demo from './Demo'

// Le demo ne se monte que visible : évite des dizaines de contextes WebGL / canvas simultanés.
export default function Card({ f, i, onOpen }: { f: Fx; i: number; onOpen: (f: Fx) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { margin: '120px' })
  const desc = useMemo(() => info(f).desc, [f])
  const n = useMemo(() => paramsFor(f.cat, f.p).length, [f])
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div ref={ref} layout="position" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, delay: Math.min(i * 0.025, 0.5), ease: 'easeOut' }}
      onMouseMove={move} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#11131a] transition-colors duration-300 hover:border-violet-400/50">
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(260px circle at var(--x,50%) var(--y,50%), rgba(139,92,246,.14), transparent 70%)' }} />
      <div className="fill relative grid h-44 place-items-center overflow-hidden border-b border-white/10 bg-[#0b0d12]">{visible && <Demo f={f} />}</div>
      <div className="grid gap-3 p-4">
        <div><div className="text-xs text-violet-300">{f.cat}</div><div className="font-semibold">{f.name}</div></div>
        <p className="line-clamp-2 min-h-10 text-sm text-white/60">{desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">{n} réglages</span>
          <button type="button" onClick={() => onOpen(f)} className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:scale-105 active:scale-95">Tester et régler</button>
        </div>
      </div>
    </motion.div>
  )
}
