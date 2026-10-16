'use client'
import { motion } from 'motion/react'
import { motionProps } from '../lib/registry'
import { defaultsFor } from '../lib/params'

export default function MotionFx({ p }: { p: any }) {
  const v = { ...defaultsFor('motion', p), ...p }
  return (
    <motion.div {...motionProps(p.k, v.speed)} style={{ width: v.size, height: v.size, background: v.color, borderRadius: `${v.radius}%` }}
      className="grid cursor-grab place-items-center text-sm font-medium">{p.k}</motion.div>
  )
}
