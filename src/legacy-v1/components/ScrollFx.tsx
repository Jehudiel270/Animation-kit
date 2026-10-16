'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { applyIntensity } from '../lib/registry'
import { SC_TWEEN } from '../lib/extra'
import { defaultsFor } from '../lib/params'

gsap.registerPlugin(ScrollTrigger)
const LOREM = 'Les animations liées au scroll rendent une page vivante : chaque mot, chaque image réagit à la position de la lecture et guide le regard.'
const box = 'mx-auto grid size-32 place-items-center rounded-2xl text-sm font-semibold text-white'

// Une mini zone de défilement : fais défiler dedans pour voir l'animation (ScrollTrigger avec scroller dédié).
export default function ScrollFx({ p }: { p: any }) {
  const v: any = { ...defaultsFor('scroll', p), ...p }
  const k: string = p.k, tw = SC_TWEEN[k]
  const sc = useRef<any>(null), a = useRef<any>(null), b = useRef<any>(null), c = useRef<any>(null)
  const start = v.start ?? 85, end = v.end ?? 30

  useGSAP(() => {
    const scroller = sc.current, el = a.current
    const trig = (o: any = {}) => ({ trigger: el, scroller, markers: !!v.markers, ...o })
    let split: SplitType | null = null
    if (tw) {
      const from = applyIntensity(tw[0], v.intensity)
      if (p.mode === 'scrub') gsap.fromTo(el, from, { ...tw[1], ease: 'none', scrollTrigger: trig({ start: `top ${start}%`, end: `top ${end}%`, scrub: v.scrub > 0 ? v.scrub : true }) })
      else gsap.fromTo(el, from, { ...tw[1], duration: 1, ease: 'power3.out', scrollTrigger: trig({ start: `top ${start}%`, toggleActions: 'play none none reverse' }) })
    } else if (k === 'pin') {
      gsap.to(el, { rotate: 360, scale: 1.15, ease: 'none', scrollTrigger: trig({ start: 'top 20%', end: `+=${v.distance}%`, scrub: true, pin: true }) })
    } else if (k === 'progress') {
      gsap.to(b.current, { width: '100%', ease: 'none', scrollTrigger: trig({ start: 'top top', end: 'bottom bottom', scrub: true }) })
    } else if (k === 'counter') {
      const o = { n: 0 }
      gsap.to(o, { n: v.target, ease: 'none', onUpdate: () => { el.textContent = Math.round(o.n).toLocaleString('fr-FR') }, scrollTrigger: trig({ start: `top ${start}%`, end: `top ${end}%`, scrub: true }) })
    } else if (k === 'highlight') {
      split = new SplitType(el, { types: 'words' })
      gsap.fromTo(split.words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: trig({ start: `top ${start}%`, end: `bottom ${end}%`, scrub: true }) })
    } else if (k === 'horizontal') {
      const strip = b.current
      gsap.to(strip, { x: () => -(strip.scrollWidth - scroller.clientWidth + 48), ease: 'none', scrollTrigger: trig({ start: 'top top', end: () => `+=${strip.scrollWidth}`, scrub: true, pin: true, invalidateOnRefresh: true }) })
    } else if (k === 'colorShift') {
      gsap.fromTo(scroller, { backgroundColor: '#0b0d12' }, { backgroundColor: v.color, ease: 'none', scrollTrigger: trig({ start: 'top top', end: 'bottom bottom', scrub: true }) })
    } else if (k === 'staggerList') {
      gsap.from(el.children, { opacity: 0, y: 40, stagger: v.stagger, duration: 0.8, ease: 'power3.out', scrollTrigger: trig({ start: `top ${start}%`, toggleActions: 'play none none reverse' }) })
    } else if (k === 'parallax') {
      gsap.to(b.current, { yPercent: -12 * v.intensity, ease: 'none', scrollTrigger: trig({ start: 'top bottom', end: 'bottom top', scrub: true }) })
      gsap.to(c.current, { yPercent: 20 * v.intensity, ease: 'none', scrollTrigger: trig({ start: 'top bottom', end: 'bottom top', scrub: true }) })
    }
    return () => split?.revert()
  }, { scope: sc, dependencies: [JSON.stringify(v)], revertOnUpdate: true })

  let body: React.ReactNode
  if (tw || k === 'pin') body = <div ref={a} className={box} style={{ background: v.color }}>{k}</div>
  else if (k === 'progress') body = <div ref={a} className="space-y-3 text-sm text-white/70">{Array.from({ length: 10 }, (_, i) => <p key={i}>{LOREM}</p>)}</div>
  else if (k === 'counter') body = <div ref={a} className="text-center text-4xl font-bold tabular-nums" style={{ color: v.color }}>0</div>
  else if (k === 'highlight') body = <p ref={a} className="text-xl font-semibold leading-snug">{LOREM}</p>
  else if (k === 'horizontal') body = (
    <div ref={a} className="h-full overflow-hidden"><div ref={b} className="flex h-full w-max items-center gap-4 pr-6">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="grid h-[70%] w-52 shrink-0 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ background: v.color, opacity: 0.45 + i * 0.11 }}>{i}</div>)}</div></div>
  )
  else if (k === 'colorShift') body = <div ref={a} className="h-[200%] pt-10 text-center text-sm text-white/80">Continue de défiler : le fond change de couleur.</div>
  else if (k === 'staggerList') body = <div ref={a} className="grid gap-2">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="rounded-lg px-4 py-3 text-sm" style={{ background: `${v.color}44` }}>Ligne {i}</div>)}</div>
  else body = (
    <div ref={a} className="relative mx-auto h-44 w-full max-w-sm overflow-hidden rounded-2xl">
      <div ref={b} className="absolute -top-[40%] left-0 h-[180%] w-full" style={{ background: `linear-gradient(160deg, ${v.color}, #0b0d12)` }} />
      <div ref={c} className="relative z-10 grid h-full place-items-center text-2xl font-bold text-white">Parallaxe</div>
    </div>
  )
  return (
    <div ref={sc} data-lenis-prevent className="size-full overflow-y-auto overflow-x-hidden px-5" style={{ scrollbarWidth: 'thin' }}>
      {k === 'progress' && <div className="sticky top-0 z-10 -mx-5 h-1.5 bg-white/10"><div ref={b} className="h-full w-0" style={{ background: v.color }} /></div>}
      <div className="grid h-full place-items-center text-xs text-white/40">Fais défiler dans cette zone ↓</div>
      {body}
      <div className="h-[130%]" />
    </div>
  )
}
