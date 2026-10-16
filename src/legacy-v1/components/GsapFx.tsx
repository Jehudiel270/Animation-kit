'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { G, applyIntensity } from '../lib/registry'
import { DEFAULT_TEXT, defaultsFor } from '../lib/params'

export default function GsapFx({ p }: { p: any }) {
  const v = { ...defaultsFor('gsap', p), ...p }
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = ref.current!, [from, to] = G[p.k]
    const split = p.mode === 'block' ? null : new SplitType(el, { types: p.mode })
    const targets = split ? (split as any)[p.mode] : el
    gsap.fromTo(targets, applyIntensity(from, v.intensity), {
      ...to, duration: v.duration, delay: v.delay, ease: v.ease === 'auto' ? (to.ease ?? 'power3.out') : v.ease,
      stagger: split ? { each: v.stagger, from: v.from } : 0, repeat: v.loop ? -1 : 0, repeatDelay: v.pause,
    })
    return () => split?.revert()
  }, { scope: ref, dependencies: [JSON.stringify(v)], revertOnUpdate: true })
  return <div ref={ref} style={{ fontSize: v.fontSize, color: v.color }} className="max-w-md px-4 text-center font-semibold leading-snug">{v.text || DEFAULT_TEXT}</div>
}
