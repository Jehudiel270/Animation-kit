'use client'
import dynamic from 'next/dynamic'
import type { Fx } from '../lib/registry'

const C: Record<string, React.ComponentType<{ p: any }>> = {
  gsap: dynamic(() => import('./GsapFx'), { ssr: false }),
  motion: dynamic(() => import('./MotionFx'), { ssr: false }),
  particles: dynamic(() => import('./ParticlesFx'), { ssr: false }),
  three: dynamic(() => import('./ThreeFx'), { ssr: false }),
  scroll: dynamic(() => import('./ScrollFx'), { ssr: false }),
  media: dynamic(() => import('./MediaFx'), { ssr: false }),
  landing: dynamic(() => import('./LandingFx'), { ssr: false }),
  shader: dynamic(() => import('./ShaderFx'), { ssr: false }),
  lottie: dynamic(() => import('./LottieFx'), { ssr: false }),
}
// o = réglages du labo, fusionnés par-dessus les paramètres du preset
export default function Demo({ f, o }: { f: Fx; o?: Record<string, any> }) {
  const X = C[f.cat]
  return <X p={{ ...f.p, ...o }} />
}
