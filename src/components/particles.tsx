"use client";
import { useMemo, useRef } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rnd } from "@/lib/utils";

const init = async (engine: Engine) => { await loadSlim(engine); await loadEmittersPlugin(engine); };

/** Particules 2D tsParticles. `options` doit être un objet stable (constante de module). */
export function TsParticles({ id, options }: { id: string; options: ISourceOptions }) {
  return (
    <ParticlesProvider init={init}>
      <Particles id={id} options={options} className="absolute inset-0" />
    </ParticlesProvider>
  );
}

const base = { fullScreen: { enable: false }, background: { color: "transparent" }, fpsLimit: 60, detectRetina: true };
const fill = (color: string | string[]) => ({ fill: { enable: true, color: { value: color } } });
export const cfg = (o: object) => ({ ...base, ...o }) as ISourceOptions;
export { fill };

/** Nuage de points 3D. `make` place chaque point, `tick` l'anime (optionnel). */
type Make = (i: number, n: number) => [number, number, number];
type Tick = (p: Float32Array, t: number, pointer: { x: number; y: number }) => void;
function Points({ n = 1800, make, tick, spin = 0.1, color = "#7c5cff", size = 0.035 }: { n?: number; make: Make; tick?: Tick; spin?: number; color?: string; size?: number }) {
  const g = useRef<THREE.Points>(null);
  const positions = useMemo(() => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) a.set(make(i, n), i * 3); return a; }, [n, make]);
  useFrame(({ clock, pointer }, dt) => {
    const o = g.current!; o.rotation.y += dt * spin;
    if (tick) { tick(positions, clock.elapsedTime, pointer); (o.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true; }
  });
  return (
    <points ref={g}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

export function PointsScene(props: React.ComponentProps<typeof Points> & { cam?: number }) {
  const { cam = 5, ...rest } = props;
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, cam], fov: 55 }}><color attach="background" args={["#0e0f1a"]} /><Points {...rest} /></Canvas>;
}

export const generators = {
  sphere: ((i, n) => { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), a = i * 2.399963; return [Math.cos(a) * r * 1.8, y * 1.8, Math.sin(a) * r * 1.8]; }) as Make,
  galaxy: ((i, n) => { const arm = i % 3, r = (i / n) * 3.2, a = r * 2.2 + (arm * Math.PI * 2) / 3; const j = (rnd(i) - 0.5) * 0.35 * (r + 0.4); return [Math.cos(a) * r + j, (rnd(i + 9) - 0.5) * 0.25, Math.sin(a) * r + j]; }) as Make,
  grid: ((i, n) => { const s = Math.round(Math.sqrt(n)); return [((i % s) / s - 0.5) * 6, 0, (Math.floor(i / s) / s - 0.5) * 6]; }) as Make,
  cloud: ((i) => [(rnd(i) - 0.5) * 6, (rnd(i + 1) - 0.5) * 4, (rnd(i + 2) - 0.5) * 4]) as Make,
  lattice: ((i, n) => { const s = Math.round(Math.cbrt(n)); return [((i % s) / s - 0.5) * 4, ((Math.floor(i / s) % s) / s - 0.5) * 4, ((Math.floor(i / (s * s)) / s) - 0.5) * 4]; }) as Make,
  vortex: ((i, n) => { const h = i / n, a = h * 38, r = 0.25 + h * 1.8; return [Math.cos(a) * r, (h - 0.5) * 4, Math.sin(a) * r]; }) as Make,
};

export const ticks = {
  wave: ((p, t) => { for (let i = 0; i < p.length; i += 3) p[i + 1] = Math.sin(p[i] * 1.6 + t * 2) * 0.35 + Math.cos(p[i + 2] * 1.6 + t * 1.5) * 0.3; }) as Tick,
  drift: ((p, t) => { for (let i = 0; i < p.length; i += 3) p[i + 1] += Math.sin(t + i) * 0.0015; }) as Tick,
  attract: ((p, _t, ptr) => { const tx = ptr.x * 3, ty = ptr.y * 2; for (let i = 0; i < p.length; i += 3) { const dx = tx - p[i], dy = ty - p[i + 1]; const d = Math.hypot(dx, dy) + 0.2; if (d < 1.6) { p[i] += (dx / d) * 0.02; p[i + 1] += (dy / d) * 0.02; } else { p[i] += (rnd(i) - 0.5) * 0.004; p[i + 1] += (rnd(i + 1) - 0.5) * 0.004; } } }) as Tick,
  rings: ((p, t) => { const n = p.length / 3; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 * 8, r = ((t * 0.8 + Math.floor(i / (n / 4)) * 0.75) % 3) + 0.2; p[i * 3] = Math.cos(a) * r; p[i * 3 + 1] = Math.sin(a) * r; p[i * 3 + 2] = 0; } }) as Tick,
};
