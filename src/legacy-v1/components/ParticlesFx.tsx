'use client'
import { useMemo } from 'react'
import { Particles, ParticlesProvider } from '@tsparticles/react'
import type { Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { buildParticles } from '../lib/registry'
import { defaultsFor } from '../lib/params'

const initParticles = async (engine: Engine) => { await loadSlim(engine) }

export default function ParticlesFx({ p }: { p: any }) {
  const dep = JSON.stringify(p)
  const options = useMemo(() => buildParticles(p.shape, p.mode, { ...defaultsFor('particles', p), ...p }) as any, [dep]) // eslint-disable-line react-hooks/exhaustive-deps
  return <ParticlesProvider init={initParticles}><Particles key={dep} id={`tsp-v1-${p.shape}-${p.mode}`} options={options} /></ParticlesProvider>
}
