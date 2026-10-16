'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { defaultsFor } from '../lib/params'
import { VIDEOS } from '../lib/extra'
import { VIDEO_DEFAULT, art } from '../lib/art'

const bg = (src: string): React.CSSProperties => ({ backgroundImage: `url("${src}")`, backgroundSize: 'cover', backgroundPosition: 'center' })
const Vid = ({ src }: { src: string }) => <video src={src} muted loop playsInline autoPlay className="absolute inset-0 size-full object-cover" />

function Tilt({ deg, radius, children }: { deg: number; radius: number; children: React.ReactNode }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [deg, -deg]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-deg, deg]), { stiffness: 150, damping: 15 })
  return (
    <div style={{ perspective: 900 }} className="grid size-full place-items-center"
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }}
      onMouseLeave={() => { mx.set(0); my.set(0) }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, borderRadius: radius, transformStyle: 'preserve-3d' }} className="relative h-[78%] w-[78%] overflow-hidden shadow-2xl">{children}</motion.div>
    </div>
  )
}
function Spot({ src, size, radius }: { src: string; size: number; radius: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mask = `radial-gradient(circle ${size}px at var(--mx,50%) var(--my,50%), #000 30%, transparent 100%)`
  return (
    <div ref={ref} className="relative size-full overflow-hidden" style={{ borderRadius: radius }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`); ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`) }}>
      <div className="absolute inset-0" style={{ ...bg(src), filter: 'grayscale(1) brightness(.55)' }} />
      <div className="absolute inset-0" style={{ ...bg(src), WebkitMaskImage: mask, maskImage: mask }} />
    </div>
  )
}
function Cross({ imgs, dur }: { imgs: string[]; dur: number }) {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % imgs.length), (dur + 1.5) * 1000); return () => clearInterval(t) }, [imgs.length, dur])
  return <div className="relative size-full">{imgs.map((s, j) => <motion.div key={j} className="absolute inset-0" style={bg(s)} animate={{ opacity: i === j ? 1 : 0 }} transition={{ duration: dur }} />)}</div>
}
function HoverPlay({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  return (
    <div className="absolute inset-0" onMouseEnter={() => ref.current?.play().catch(() => {})} onMouseLeave={() => { const e = ref.current; if (e) { e.pause(); e.currentTime = 0 } }}>
      <video ref={ref} src={src} muted loop playsInline preload="auto" className="size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30 text-sm text-white/90">{title} · survole</div>
    </div>
  )
}
function PlayView({ src }: { src: string }) {
  const box = useRef<HTMLDivElement>(null), vid = useRef<HTMLVideoElement>(null)
  const inView = useInView(box, { amount: 0.5 })
  useEffect(() => { if (inView) vid.current?.play().catch(() => {}); else vid.current?.pause() }, [inView])
  return <motion.div ref={box} className="absolute inset-0" animate={{ opacity: inView ? 1 : 0.3 }}><video ref={vid} src={src} muted loop playsInline className="size-full object-cover" /></motion.div>
}

export default function MediaFx({ p }: { p: any }) {
  const v: any = { ...defaultsFor('media', p), ...p }
  const isVid = VIDEOS.includes(p.k)
  const src: string = v.src || (isVid ? VIDEO_DEFAULT : art())
  const r: number = v.radius
  const frame = (child: React.ReactNode) => <div className="grid size-full place-items-center p-[6%]"><div className="relative size-full overflow-hidden" style={{ borderRadius: r }}>{child}</div></div>
  const ov = (
    <div className="pointer-events-none absolute inset-0 flex items-end p-[6%]" style={{ background: `linear-gradient(to top, rgba(0,0,0,${v.overlay}), transparent 75%)` }}>
      <div className="text-lg font-bold text-white">{v.title}</div>
    </div>
  )
  switch (p.k) {
    case 'kenBurns': return frame(<motion.div className="absolute inset-0" style={bg(src)} animate={{ scale: [1, 1 + v.zoom, 1], x: ['0%', '-4%', '0%'], y: ['0%', '-3%', '0%'] }} transition={{ duration: v.duration, repeat: Infinity, ease: 'easeInOut' }} />)
    case 'hoverZoom': return frame(<motion.div className="absolute inset-0" style={bg(src)} whileHover={{ scale: 1 + v.zoom }} transition={{ duration: v.duration, ease: 'easeOut' }} />)
    case 'tilt3d': return <Tilt deg={v.deg} radius={r}><div className="absolute inset-0" style={bg(src)} /></Tilt>
    case 'revealMask': return frame(<motion.div className="absolute inset-0" style={bg(src)} animate={{ clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'] }} transition={{ duration: v.duration, repeat: Infinity, repeatDelay: 1.2, ease: [0.22, 1, 0.36, 1] }} />)
    case 'grayHover': return frame(<motion.div className="absolute inset-0" style={bg(src)} initial={{ filter: 'grayscale(1)', scale: 1 }} whileHover={{ filter: 'grayscale(0)', scale: 1.06 }} transition={{ duration: v.duration }} />)
    case 'spotlight': return <div className="grid size-full place-items-center p-[6%]"><Spot src={src} size={v.spot} radius={r} /></div>
    case 'rgbSplit': return frame(<>
      <div className="absolute inset-0" style={bg(src)} />
      <motion.div className="absolute inset-0" style={{ ...bg(src), mixBlendMode: 'screen', filter: 'hue-rotate(90deg)', opacity: 0.6 }} animate={{ x: [0, v.split, -v.split, 0] }} transition={{ duration: v.duration, repeat: Infinity }} />
      <motion.div className="absolute inset-0" style={{ ...bg(src), mixBlendMode: 'screen', filter: 'hue-rotate(-90deg)', opacity: 0.6 }} animate={{ x: [0, -v.split, v.split, 0] }} transition={{ duration: v.duration, repeat: Infinity }} />
    </>)
    case 'slices': { const n = Math.round(v.slices); return frame(<>{Array.from({ length: n }, (_, i) => (
      <motion.div key={i} className="absolute top-0 h-full" style={{ left: `${(i * 100) / n}%`, width: `${100 / n + 0.2}%`, backgroundImage: `url("${src}")`, backgroundSize: `${n * 100}% 100%`, backgroundPosition: `${(i / (n - 1)) * 100}% 50%` }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: v.duration, delay: i * 0.07, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.8 }} />
    ))}</>) }
    case 'blurUp': return frame(<motion.div className="absolute inset-0" style={bg(src)} animate={{ filter: [`blur(${v.blur}px)`, 'blur(0px)'], scale: [1.15, 1] }} transition={{ duration: v.duration, repeat: Infinity, repeatDelay: 1.2 }} />)
    case 'crossfade': return frame(<Cross imgs={[v.src || art(260, 320), art(30, 80), art(160, 200)]} dur={v.duration} />)
    case 'videoBg': return frame(<><Vid src={src} />{ov}</>)
    case 'hoverPlay': return frame(<HoverPlay src={src} title={v.title} />)
    case 'circleReveal': return frame(<motion.div className="absolute inset-0" animate={{ clipPath: ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'] }} transition={{ duration: v.duration, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}><Vid src={src} />{ov}</motion.div>)
    case 'playInView': return frame(<PlayView src={src} />)
    case 'grayHoverVideo': return frame(<motion.div className="absolute inset-0" initial={{ filter: 'grayscale(1)' }} whileHover={{ filter: 'grayscale(0)' }} transition={{ duration: v.duration }}><Vid src={src} />{ov}</motion.div>)
    case 'videoTilt': return <Tilt deg={v.deg} radius={r}><Vid src={src} />{ov}</Tilt>
    default: return null
  }
}
