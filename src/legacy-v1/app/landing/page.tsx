'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ReactLenis } from 'lenis/react'
import { motion, useScroll, useSpring } from 'motion/react'

const L = dynamic(() => import('../../components/LandingFx'), { ssr: false })
const Section = ({ h, p }: { h: string; p: any }) => <section className="relative" style={{ height: h }}><L p={p} /></section>

// Landing immersive d'exemple : chaque section est un preset du kit, réglable dans le labo de l'accueil.
export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <ReactLenis root>
      <motion.div style={{ scaleX: w }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-violet-500" />
      <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 backdrop-blur-md sm:px-8">
        <Link href="/" className="font-bold">← Animation Kit</Link>
        <span className="hidden text-sm text-white/60 sm:block">Landing immersive d'exemple</span>
      </nav>
      <Section h="100vh" p={{ k: 'heroSphere', title: 'Votre produit, en mouvement' }} />
      <Section h="38vh" p={{ k: 'marquee' }} />
      <Section h="60vh" p={{ k: 'stats' }} />
      <Section h="70vh" p={{ k: 'features' }} />
      <Section h="70vh" p={{ k: 'gallery' }} />
      <Section h="60vh" p={{ k: 'spotlightHero', title: 'Passe la souris' }} />
      <Section h="60vh" p={{ k: 'magneticCta' }} />
      <footer className="px-6 py-10 text-center text-sm text-white/40">Chaque section est un preset du kit : change ses paramètres dans le labo de la page d'accueil.</footer>
    </ReactLenis>
  )
}
