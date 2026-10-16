'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, animate, motion } from 'motion/react'
import Link from 'next/link'
import { ReactLenis } from 'lenis/react'
import { CATS, REG, type Cat, type Fx } from '../lib/registry'
import { paramsFor } from '../lib/params'
import { info } from '../lib/describe'
import Card from '../components/Card'
import Lab from '../components/Lab'

const LABEL: Record<string, string> = { all: 'Tout', gsap: 'GSAP', motion: 'Motion', particles: 'Particules', three: '3D', scroll: 'Scroll', media: 'Médias', landing: 'Landing', shader: 'Shaders', lottie: 'Lottie' }

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0)
  useEffect(() => { const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) }); return () => c.stop() }, [to])
  return <>{n}</>
}

export default function Page({ heroOnly = false }: { heroOnly?: boolean }) {
  const [cat, setCat] = useState<'all' | Cat>('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Fx | null>(null)
  const text = useMemo(() => new Map(REG.map(f => [f.id, `${f.id} ${f.name} ${info(f).desc}`.toLowerCase()])), [])
  const list = useMemo(() => REG.filter(f => (cat === 'all' || f.cat === cat) && text.get(f.id)!.includes(q.trim().toLowerCase())), [cat, q, text])
  const nParams = useMemo(() => REG.reduce((s, f) => s + paramsFor(f.cat, f.p).length, 0), [])
  const nav = useCallback((d: number) => setSel(cur => { if (!cur) return cur; const i = list.findIndex(x => x.id === cur.id); return list[(i + d + list.length) % list.length] ?? cur }), [list])
  const close = useCallback(() => setSel(null), [])
  const up = (d: number) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const } })

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root>
        <section className="relative overflow-hidden border-b border-white/10">
          <motion.div aria-hidden animate={{ x: [0, 70, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-24 -top-24 size-[420px] rounded-full bg-violet-600/30 blur-3xl" />
          <motion.div aria-hidden animate={{ x: [0, -60, 0], y: [0, 50, 0] }} transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-24 top-10 size-[380px] rounded-full bg-pink-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pt-28">
            <motion.p {...up(0)} className="flex items-center gap-2 text-sm text-violet-300"><span className="rounded-full border border-violet-300/40 bg-violet-300/10 px-2 py-0.5 text-[10px] font-bold tracking-wider">V1</span>GSAP, ScrollTrigger, Motion, tsParticles, Three.js, shaders, Lottie</motion.p>
            <motion.h1 {...up(0.1)} className="mt-4 max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
              Des animations modernes, <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">réglables et prêtes à copier.</span>
            </motion.h1>
            <motion.p {...up(0.2)} className="mt-6 max-w-xl text-lg text-white/65">Chaque animation a sa description, ses paramètres visibles et son code. Tu règles, tu testes, tu copies dans ton projet.</motion.p>
            <motion.div {...up(0.25)} className="mt-6"><Link href="/landing/" className="inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 active:scale-95">Voir la landing immersive</Link></motion.div>
            <motion.div {...up(0.3)} className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
              {[[<Counter key="a" to={REG.length} />, 'animations'], [7, 'librairies'], [<Counter key="b" to={nParams} />, 'réglages au total']].map(([n, l], k) => (
                <div key={k}><div className="text-4xl font-bold tabular-nums">{n}</div><div className="text-sm text-white/50">{l}</div></div>
              ))}
            </motion.div>
          </div>
        </section>

        {!heroOnly && <>
        <div className="mt-8 border-y border-white/10 bg-[#0b0c10]/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
            <div className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto">
              {(['all', ...CATS] as const).map(k => (
                <button key={k} onClick={() => setCat(k)} aria-pressed={cat === k} className="group relative shrink-0 rounded-full px-3.5 py-2 text-sm transition">
                  {cat === k && <motion.span layoutId="legacy-filter-pill" className="absolute inset-0 rounded-full bg-violet-500" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className={`relative flex items-center gap-2 transition-colors ${cat === k ? 'font-semibold text-white' : 'text-white/65 group-hover:text-white'}`}>
                    {LABEL[k]}
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${cat === k ? 'bg-white/15 text-white/80' : 'bg-white/5 text-white/45'}`}>{k === 'all' ? REG.length : REG.filter(f => f.cat === k).length}</span>
                  </span>
                </button>
              ))}
            </div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Chercher : flou, survol, étoiles…" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition placeholder:text-white/35 focus:border-violet-400 sm:ml-auto sm:w-72" />
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="mb-5 text-sm text-white/50">{list.length} animation{list.length > 1 ? 's' : ''}</p>
          {list.length === 0 ? <p className="py-24 text-center text-white/50">Aucune animation ne correspond. Essaie « fondu », « particules » ou « 3D ».</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((f, i) => <Card key={f.id} f={f} i={i} onOpen={setSel} />)}</div>
          )}
        </main>
        <AnimatePresence>{sel && <Lab key="lab" f={sel} onClose={close} onNav={nav} />}</AnimatePresence>
        </>}
      </ReactLenis>
    </MotionConfig>
  )
}
