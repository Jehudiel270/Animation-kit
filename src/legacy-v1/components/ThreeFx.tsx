'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Sparkles, Stars } from '@react-three/drei'
import { defaultsFor } from '../lib/params'

const geo: Record<string, React.ReactNode> = {
  sphere: <sphereGeometry args={[1, 64, 64]} />, knot: <torusKnotGeometry args={[.7, .25, 160, 24]} />,
  icosa: <icosahedronGeometry args={[1.1, 1]} />, box: <boxGeometry args={[1.4, 1.4, 1.4]} />, torus: <torusGeometry args={[.9, .3, 32, 96]} />,
}
const mat = (m: string, v: any): React.ReactNode => ({
  distort: <MeshDistortMaterial color={v.color} distort={v.distort} speed={3} />,
  wobble: <MeshWobbleMaterial color={v.color} factor={v.wobble} speed={2} />,
  wire: <meshBasicMaterial color={v.color} wireframe />,
  metal: <meshStandardMaterial color={v.color} metalness={1} roughness={v.rough} />,
} as Record<string, React.ReactNode>)[m]

function Obj({ g, m, v }: { g: string; m: string; v: any }) {
  const ref = useRef<any>(null)
  useFrame((_, d) => { ref.current.rotation.y += d * v.speed; ref.current.rotation.x += d * v.speed / 3 })
  return <Float speed={2} floatIntensity={v.float}><mesh ref={ref} scale={v.scale}>{geo[g]}{mat(m, v)}</mesh></Float>
}
export default function ThreeFx({ p }: { p: any }) {
  const v = { ...defaultsFor('three', p), ...p }
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4] }}>
      <color attach="background" args={[v.bg]} />
      <ambientLight intensity={.7} /><directionalLight position={[3, 3, 3]} intensity={2} />
      {p.k === 'stars' ? <Stars count={v.count} speed={v.speed} /> : p.k === 'sparkles' ? <Sparkles count={v.count} scale={4} size={v.size} speed={v.speed} color={v.color} /> : <Obj g={p.g} m={p.m} v={v} />}
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
