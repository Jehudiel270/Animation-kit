'use client'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { VERT, fragmentSource } from '../lib/shaders'
import { defaultsFor } from '../lib/params'

const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)

function Plane({ k, v }: { k: string; v: any }) {
  const vr = useRef(v)
  vr.current = v
  const u = useMemo(() => ({
    uTime: { value: 0 }, uScale: { value: 1 }, uIntensity: { value: 1 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uC1: { value: new THREE.Vector3() }, uC2: { value: new THREE.Vector3() }, uC3: { value: new THREE.Vector3() },
  }), [])
  useFrame((s, d) => {
    const c = vr.current
    u.uTime.value += d * c.speed; u.uScale.value = c.scale; u.uIntensity.value = c.intensity
    u.uRes.value.set(s.size.width, s.size.height); u.uMouse.value.set(s.pointer.x * 0.5 + 0.5, s.pointer.y * 0.5 + 0.5)
    u.uC1.value.fromArray(rgb(c.c1)); u.uC2.value.fromArray(rgb(c.c2)); u.uC3.value.fromArray(rgb(c.c3))
  })
  return <mesh frustumCulled={false}><planeGeometry args={[2, 2]} /><shaderMaterial key={k} uniforms={u} vertexShader={VERT} fragmentShader={fragmentSource(k)} /></mesh>
}
export default function ShaderFx({ p }: { p: any }) {
  const v = { ...defaultsFor('shader', p), ...p }
  return <Canvas dpr={[1, 1.5]} gl={{ antialias: false }}><Plane k={p.k} v={v} /></Canvas>
}
