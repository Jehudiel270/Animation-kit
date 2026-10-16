'use client'
import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import ParticlesFx from './ParticlesFx'
import { defaultsFor } from '../lib/params'
import { art } from '../lib/art'

// Blocs de landing fluides : tailles en unités de conteneur (cqw / cqh), ils s'adaptent à n'importe quelle zone.
const fs = (k: number, min: number, max: number) => ({ fontSize: `clamp(${min}px, ${k}cqw, ${max}px)` })

function Title({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(() => {
    const s = new SplitType(ref.current!, { types: 'chars' })
    gsap.from(s.chars, { y: 40, opacity: 0, stagger: 0.03, duration: 0.8, ease: 'power3.out', repeat: -1, repeatDelay: 2.5 })
    return () => s.revert()
  }, { scope: ref, dependencies: [text] })
  return <h2 ref={ref} style={fs(6, 22, 72)} className="font-extrabold leading-tight tracking-tight">{text}</h2>
}

function HeroSphere({ v }: { v: any }) {
  return (<>
    <div className="absolute inset-0"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.6} /><directionalLight position={[3, 3, 3]} intensity={2} />
      <Float speed={v.speed * 2} floatIntensity={1.5}><mesh position={[1.7, 0, 0]}><sphereGeometry args={[1.3, 64, 64]} /><MeshDistortMaterial color={v.color} distort={v.distort} speed={v.speed * 3} /></mesh></Float>
    </Canvas></div>
    <div className="relative z-10 flex h-full max-w-[60%] flex-col justify-center gap-[3cqh] pl-[7cqw]">
      <Title text={v.title} />
      <button className="w-fit rounded-full px-[3cqw] py-[1.4cqw] font-semibold text-black" style={{ background: v.color, ...fs(1.8, 11, 18) }}>Commencer</button>
    </div>
  </>)
}
function HeroParticles({ v }: { v: any }) {
  return (<>
    <div className="fill absolute inset-0"><ParticlesFx p={{ shape: 'circle', mode: 'links', count: v.count, multicolor: false, color: v.color, size: 4 }} /></div>
    <div className="pointer-events-none relative z-10 grid h-full place-items-center px-[8cqw] text-center">
      <motion.h2 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={fs(7, 22, 80)} className="font-extrabold">{v.title}</motion.h2>
    </div>
  </>)
}
function Layer({ sx, sy, k, className, style, children }: any) {
  const x = useTransform(sx, [-1, 1], [-k, k]), y = useTransform(sy, [-1, 1], [-k, k])
  return <motion.div style={{ x, y, ...style }} className={className}>{children}</motion.div>
}
function HeroParallax({ v }: { v: any }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 18 }), sy = useSpring(my, { stiffness: 80, damping: 18 })
  return (
    <div className="absolute inset-0" onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1) }} onMouseLeave={() => { mx.set(0); my.set(0) }}>
      <Layer sx={sx} sy={sy} k={v.depth * 3} className="absolute left-[8%] top-[14%] size-[34cqh] rounded-full opacity-40 blur-2xl" style={{ background: v.color }} />
      <Layer sx={sx} sy={sy} k={v.depth * 2} className="absolute bottom-[10%] right-[10%] size-[40cqh] rounded-full bg-pink-500 opacity-30 blur-2xl" />
      <Layer sx={sx} sy={sy} k={v.depth} className="relative z-10 grid h-full place-items-center px-[6cqw] text-center"><h2 style={fs(7, 22, 80)} className="font-extrabold">{v.title}</h2></Layer>
    </div>
  )
}
function Marquee({ v }: { v: any }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[2cqh] overflow-hidden">
      {Array.from({ length: v.rows }, (_, i) => (
        <motion.div key={i} animate={{ x: i % 2 ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 22 / v.speed, repeat: Infinity, ease: 'linear' }}
          className="flex w-max whitespace-nowrap font-extrabold uppercase" style={{ ...fs(v.size, 18, 120), color: i % 2 ? 'transparent' : v.color, WebkitTextStroke: i % 2 ? `1px ${v.color}` : undefined }}>
          {[0, 1, 2, 3].map(j => <span key={j} className="pr-[4cqw]">{v.text}</span>)}
        </motion.div>
      ))}
    </div>
  )
}
function Num({ to, d }: { to: number; d: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inV = useInView(ref)
  useEffect(() => {
    if (!inV) return
    const c = animate(0, to, { duration: d, ease: 'easeOut', onUpdate: x => { if (ref.current) ref.current.textContent = Math.round(x).toLocaleString('fr-FR') } })
    return () => c.stop()
  }, [inV, to, d])
  return <span ref={ref}>0</span>
}
const STATS: [number, string, string][] = [[120, '+', 'projets livrés'], [98, '%', 'clients satisfaits'], [24, '', 'pays']]
function Stats({ v }: { v: any }) {
  return (
    <div className="absolute inset-0 grid grid-cols-3 content-center gap-[3cqw] px-[6cqw] text-center">
      {STATS.map(([n, suf, l]) => (
        <div key={l}><div className="font-extrabold tabular-nums" style={{ ...fs(v.size, 20, 90), color: v.color }}><Num to={n} d={v.duration} />{suf}</div><div className="text-white/60" style={fs(1.6, 10, 16)}>{l}</div></div>
      ))}
    </div>
  )
}
const FEAT = ['Rapide', 'Modulaire', 'Responsive', 'Accessible', 'Animé', 'Léger']
function Features({ v }: { v: any }) {
  return (
    <div className="absolute inset-0 grid content-center gap-[2cqw] p-[5cqw]" style={{ gridTemplateColumns: `repeat(${v.cols}, minmax(0, 1fr))` }}>
      {FEAT.map((f, i) => (
        <motion.div key={f} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * v.stagger, duration: 0.5 }} whileHover={{ y: -6 }}
          className="rounded-xl border border-white/10 bg-white/5 p-[2cqw]" style={fs(2, 11, 20)}>
          <div className="mb-[0.5em] size-[1.2em] rounded-full" style={{ background: v.color }} />{f}
        </motion.div>
      ))}
    </div>
  )
}
function Gallery({ v }: { v: any }) {
  return (
    <div className="absolute inset-0 grid content-center overflow-hidden">
      <motion.div drag="x" dragConstraints={{ left: -600, right: 0 }} className="flex w-max cursor-grab px-[4cqw]" style={{ gap: v.gap }}>
        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="shrink-0 rounded-2xl" style={{ width: `${v.size * 0.8}cqh`, height: `${v.size}cqh`, backgroundImage: `url("${art(200 + i * 30, 260 + i * 30)}")`, backgroundSize: 'cover', outline: i === 0 ? `2px solid ${v.color}` : undefined }} />)}
      </motion.div>
    </div>
  )
}
function Curtain({ v }: { v: any }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tl.fromTo('.cu-t', { yPercent: 0 }, { yPercent: -100, duration: v.duration, ease: 'power4.inOut' })
      .fromTo('.cu-b', { yPercent: 0 }, { yPercent: 100, duration: v.duration, ease: 'power4.inOut' }, '<')
      .fromTo('.cu-h', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: v.duration, ease: 'power3.out' }, '<0.2')
  }, { scope: ref, dependencies: [v.duration, v.title, v.color] })
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      <h2 className="cu-h px-[6cqw] text-center font-extrabold" style={fs(8, 24, 90)}>{v.title}</h2>
      <div className="cu-t absolute inset-x-0 top-0 h-1/2" style={{ background: v.color }} />
      <div className="cu-b absolute inset-x-0 bottom-0 h-1/2" style={{ background: v.color }} />
    </div>
  )
}
function Magnetic({ v }: { v: any }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 }), sy = useSpring(y, { stiffness: 200, damping: 15 })
  return (
    <div className="absolute inset-0 grid place-items-center" onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * v.strength); y.set((e.clientY - r.top - r.height / 2) * v.strength) }} onMouseLeave={() => { x.set(0); y.set(0) }}>
      <motion.button style={{ x: sx, y: sy, background: v.color, ...fs(2.4, 12, 22) }} whileTap={{ scale: 0.94 }} className="rounded-full px-[5cqw] py-[2cqw] font-bold text-black">{v.label}</motion.button>
    </div>
  )
}
function SpotHero({ v }: { v: any }) {
  const x = useMotionValue(200), y = useMotionValue(100)
  const mask = useMotionTemplate`radial-gradient(circle ${v.size}px at ${x}px ${y}px, #000 20%, transparent 100%)`
  return (
    <div className="absolute inset-0 grid place-items-center" onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }}>
      <h2 className="select-none px-[6cqw] text-center font-extrabold text-white/15" style={fs(9, 24, 96)}>{v.title}</h2>
      <motion.h2 aria-hidden style={{ ...fs(9, 24, 96), color: v.color, WebkitMaskImage: mask, maskImage: mask }} className="pointer-events-none absolute inset-0 grid select-none place-items-center px-[6cqw] text-center font-extrabold">{v.title}</motion.h2>
    </div>
  )
}

export default function LandingFx({ p }: { p: any }) {
  const v: any = { ...defaultsFor('landing', p), ...p }
  const B: Record<string, React.ReactNode> = {
    heroSphere: <HeroSphere v={v} />, heroParticles: <HeroParticles v={v} />, heroParallax: <HeroParallax v={v} />, marquee: <Marquee v={v} />, stats: <Stats v={v} />,
    features: <Features v={v} />, gallery: <Gallery v={v} />, curtain: <Curtain v={v} />, magneticCta: <Magnetic v={v} />, spotlightHero: <SpotHero v={v} />,
  }
  return <div className="absolute inset-0 overflow-hidden bg-[#0b0d12]" style={{ containerType: 'size' }}>{B[p.k]}</div>
}
