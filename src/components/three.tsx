"use client";
import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { rnd } from "@/lib/utils";

const VIOLET = "#7c5cff", TEAL = "#3ddbd9", AMBER = "#ffb547";

/** Canvas R3F prêt à l'emploi : lumières, fond, caméra. */
export function Scene({ children, cam = [0, 0, 5], fov = 50, controls = false }: { children: ReactNode; cam?: [number, number, number]; fov?: number; controls?: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: cam, fov }}>
      <color attach="background" args={["#0e0f1a"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={25} color={TEAL} />
      {children}
      {controls && <OrbitControls enableZoom={false} />}
    </Canvas>
  );
}

export type Shape = "box" | "sphere" | "torus" | "knot" | "ico" | "octa" | "dodeca" | "cone" | "cyl";
export type Mat = "metal" | "wire" | "distort" | "wobble" | "toon" | "normal" | "flat" | "glow";
export type Motion = "spin" | "float" | "mouse" | "pulse" | "bounce";

function Geo({ s }: { s: Shape }) {
  switch (s) {
    case "box": return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    case "sphere": return <sphereGeometry args={[1, 64, 64]} />;
    case "torus": return <torusGeometry args={[1, 0.38, 32, 96]} />;
    case "knot": return <torusKnotGeometry args={[0.85, 0.28, 160, 24]} />;
    case "ico": return <icosahedronGeometry args={[1.1, 0]} />;
    case "octa": return <octahedronGeometry args={[1.3, 0]} />;
    case "dodeca": return <dodecahedronGeometry args={[1.1, 0]} />;
    case "cone": return <coneGeometry args={[0.9, 1.8, 32]} />;
    case "cyl": return <cylinderGeometry args={[0.7, 0.7, 1.7, 40]} />;
  }
}

function Material({ m, color }: { m: Mat; color: string }) {
  switch (m) {
    case "metal": return <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} />;
    case "wire": return <meshBasicMaterial color={color} wireframe />;
    case "distort": return <MeshDistortMaterial color={color} distort={0.45} speed={2} roughness={0.2} />;
    case "wobble": return <MeshWobbleMaterial color={color} factor={0.8} speed={2} roughness={0.3} />;
    case "toon": return <meshToonMaterial color={color} />;
    case "normal": return <meshNormalMaterial />;
    case "flat": return <meshStandardMaterial color={color} flatShading roughness={0.5} />;
    case "glow": return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />;
  }
}

/** Un objet 3D = une forme + un matériau + un mouvement. 9 × 8 × 5 combinaisons possibles. */
export function Shape3D({ shape, mat, motion, color = VIOLET }: { shape: Shape; mat: Mat; motion: Motion; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, pointer }, dt) => {
    const m = ref.current; if (!m) return;
    const t = clock.elapsedTime;
    if (motion === "spin") { m.rotation.x += dt * 0.5; m.rotation.y += dt * 0.7; }
    if (motion === "float") { m.position.y = Math.sin(t * 1.5) * 0.3; m.rotation.y += dt * 0.35; m.rotation.x = Math.sin(t) * 0.2; }
    if (motion === "mouse") { m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, pointer.x * 1.4, 0.08); m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, -pointer.y * 1.2, 0.08); }
    if (motion === "pulse") { const k = 1 + Math.sin(t * 2.5) * 0.12; m.scale.setScalar(k); m.rotation.y += dt * 0.3; }
    if (motion === "bounce") { m.position.y = Math.abs(Math.sin(t * 2.2)) * 0.9 - 0.45; m.rotation.y += dt * 0.8; }
  });
  return <mesh ref={ref}><Geo s={shape} /><Material m={mat} color={color} /></mesh>;
}

/** Grille de cubes instanciés dont la hauteur ondule. */
function WaveGrid() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 15, dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime; let i = 0;
    for (let x = 0; x < N; x++) for (let z = 0; z < N; z++) {
      const h = 0.6 + (Math.sin(x * 0.55 + t * 2) + Math.cos(z * 0.55 + t * 1.6)) * 0.5;
      dummy.position.set((x - N / 2) * 0.42, h / 2 - 0.5, (z - N / 2) * 0.42);
      dummy.scale.set(0.32, Math.max(h, 0.05), 0.32); dummy.updateMatrix();
      ref.current!.setMatrixAt(i++, dummy.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.rotation.y = t * 0.15;
  });
  return <instancedMesh ref={ref} args={[undefined, undefined, N * N]} position={[0, -0.4, 0]}><boxGeometry /><meshStandardMaterial color={VIOLET} roughness={0.3} metalness={0.4} /></instancedMesh>;
}

function Rings() {
  const g = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  useFrame((_, dt) => { g[0].current!.rotation.x += dt * 0.9; g[1].current!.rotation.y += dt * 0.7; g[2].current!.rotation.z += dt * 0.5; });
  return <>{[[1.9, VIOLET], [1.5, TEAL], [1.1, AMBER]].map(([r, c], i) => <mesh key={i} ref={g[i]}><torusGeometry args={[r as number, 0.04, 16, 100]} /><meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.8} /></mesh>)}</>;
}

function Solar() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { g.current!.children.forEach((c, i) => { const t = clock.elapsedTime * (0.9 - i * 0.22); c.position.set(Math.cos(t) * (1.5 + i * 0.8), Math.sin(t * 0.6) * 0.2, Math.sin(t) * (1.5 + i * 0.8)); }); });
  return (
    <>
      <mesh><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.3} /></mesh>
      <group ref={g}>{[VIOLET, TEAL, "#ff6b9a"].map((c, i) => <mesh key={i}><sphereGeometry args={[0.22 + i * 0.06, 24, 24]} /><meshStandardMaterial color={c} /></mesh>)}</group>
    </>
  );
}

function Helix() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { g.current!.rotation.y += dt * 0.6; });
  return (
    <group ref={g} rotation={[0.3, 0, 0.3]}>
      {Array.from({ length: 36 }).map((_, i) => { const a = i * 0.45, y = (i - 18) * 0.16; return (
        <group key={i}>
          <mesh position={[Math.cos(a) * 0.9, y, Math.sin(a) * 0.9]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.6} /></mesh>
          <mesh position={[Math.cos(a + Math.PI) * 0.9, y, Math.sin(a + Math.PI) * 0.9]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.6} /></mesh>
        </group>); })}
    </group>
  );
}

function CubeField() {
  return <>{Array.from({ length: 22 }).map((_, i) => (
    <Float key={i} speed={1 + rnd(i) * 2} rotationIntensity={1.5} floatIntensity={1.5} position={[(rnd(i + 1) - 0.5) * 7, (rnd(i + 2) - 0.5) * 4, (rnd(i + 3) - 0.5) * 3]}>
      <mesh scale={0.25 + rnd(i + 4) * 0.35}><boxGeometry /><meshStandardMaterial color={[VIOLET, TEAL, AMBER][i % 3]} roughness={0.3} /></mesh>
    </Float>))}</>;
}

function CameraParallax() {
  useFrame(({ camera, pointer }) => { camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.6, 0.05); camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 1, 0.05); camera.lookAt(0, 0, 0); });
  return <>{[[-1.6, 0, -1, VIOLET], [0, 0.2, 0, TEAL], [1.6, -0.2, 1, AMBER], [0.4, 1.1, -2, "#ff6b9a"]].map(([x, y, z, c], i) => <mesh key={i} position={[x as number, y as number, z as number]}><icosahedronGeometry args={[0.7, 1]} /><meshStandardMaterial color={c as string} flatShading /></mesh>)}</>;
}

function Space() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { g.current!.rotation.y += dt * 0.05; });
  return <group ref={g}><Stars radius={30} depth={40} count={2500} factor={4} fade speed={1} /><Sparkles count={60} scale={7} size={4} speed={0.4} color={TEAL} /></group>;
}

function WavyPlane() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const pos = (ref.current!.geometry as THREE.PlaneGeometry).attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.sin(x * 1.4 + clock.elapsedTime * 2) * 0.35 + Math.cos(y * 1.2 + clock.elapsedTime * 1.5) * 0.3); }
    pos.needsUpdate = true;
  });
  return <mesh ref={ref} rotation={[-1.05, 0, 0]}><planeGeometry args={[7, 5, 48, 36]} /><meshBasicMaterial color={TEAL} wireframe /></mesh>;
}

const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }";
const FS = "varying vec2 vUv; uniform float uTime; void main(){ float d = distance(vUv, vec2(0.5)); float w = sin(d * 38.0 - uTime * 3.0) * 0.5 + 0.5; vec3 c = mix(vec3(0.05,0.06,0.12), vec3(0.49,0.36,1.0), w * smoothstep(0.55, 0.0, d)); gl_FragColor = vec4(c, 1.0); }";
function Ripple() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => { mat.current!.uniforms.uTime.value = clock.elapsedTime; });
  return <mesh><planeGeometry args={[5, 5]} /><shaderMaterial ref={mat} uniforms={uniforms} vertexShader={VS} fragmentShader={FS} /></mesh>;
}

function Tunnel() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { g.current!.children.forEach((c, i) => { const z = ((i * 0.7 + clock.elapsedTime * 2) % 14) - 12; c.position.z = z; c.scale.setScalar(1 + (z + 12) * 0.02); c.rotation.z = clock.elapsedTime * 0.3 + i * 0.4; }); });
  return <group ref={g}>{Array.from({ length: 20 }).map((_, i) => <mesh key={i}><torusGeometry args={[1.6, 0.025, 8, 6 + (i % 3)]} /><meshBasicMaterial color={i % 2 ? VIOLET : TEAL} /></mesh>)}</group>;
}

function Bouncers() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { g.current!.children.forEach((c, i) => { c.position.y = Math.abs(Math.sin(clock.elapsedTime * 2.4 + i * 0.6)) * 1.4 - 0.8; }); });
  return <group ref={g}>{Array.from({ length: 6 }).map((_, i) => <mesh key={i} position={[(i - 2.5) * 0.8, 0, 0]}><sphereGeometry args={[0.32, 32, 32]} /><meshStandardMaterial color={[VIOLET, TEAL, AMBER][i % 3]} /></mesh>)}</group>;
}

function Pendulums() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { g.current!.children.forEach((c, i) => { c.rotation.z = Math.sin(clock.elapsedTime * 2 + i * 0.35) * 0.6; }); });
  return <group ref={g} position={[0, 1.4, 0]}>{Array.from({ length: 7 }).map((_, i) => (
    <group key={i} position={[(i - 3) * 0.5, 0, 0]}><mesh position={[0, -1.1, 0]}><sphereGeometry args={[0.22, 24, 24]} /><meshStandardMaterial color={VIOLET} metalness={0.5} roughness={0.3} /></mesh><mesh position={[0, -0.55, 0]}><cylinderGeometry args={[0.01, 0.01, 1.1]} /><meshBasicMaterial color="#a3a8c7" /></mesh></group>))}</group>;
}

function PointerGrid() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 14, dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ pointer, viewport }) => {
    const px = (pointer.x * viewport.width) / 2, py = (pointer.y * viewport.height) / 2; let i = 0;
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
      const gx = (x - N / 2 + 0.5) * 0.4, gy = (y - N / 2 + 0.5) * 0.4;
      const d = Math.hypot(gx - px, gy - py), k = 0.12 + Math.max(0, 1 - d / 1.6) * 0.5;
      dummy.position.set(gx, gy, 0); dummy.scale.setScalar(k); dummy.updateMatrix(); ref.current!.setMatrixAt(i++, dummy.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[undefined, undefined, N * N]}><boxGeometry /><meshStandardMaterial color={TEAL} /></instancedMesh>;
}

function FibSphere() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 220, dummy = useMemo(() => new THREE.Object3D(), []);
  useMemo(() => { /* positions calculées au premier rendu */ }, []);
  useFrame(({ clock }) => {
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), a = i * 2.399963;
      const k = 1.6 + Math.sin(clock.elapsedTime * 1.6 + i * 0.1) * 0.12;
      dummy.position.set(Math.cos(a) * r * k, y * k, Math.sin(a) * r * k); dummy.scale.setScalar(0.09); dummy.lookAt(0, 0, 0); dummy.updateMatrix(); ref.current!.setMatrixAt(i, dummy.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true; ref.current!.rotation.y = clock.elapsedTime * 0.3;
  });
  return <instancedMesh ref={ref} args={[undefined, undefined, N]}><boxGeometry /><meshStandardMaterial color={AMBER} /></instancedMesh>;
}

export const Scenes = { WaveGrid, Rings, Solar, Helix, CubeField, CameraParallax, Space, WavyPlane, Ripple, Tunnel, Bouncers, Pendulums, PointerGrid, FibSphere };
