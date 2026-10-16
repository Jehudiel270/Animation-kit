"use client";
import { Edges } from "@react-three/drei";
import { Scene, Shape3D, Scenes as S, type Shape, type Mat, type Motion } from "@/components/three";
import { make } from "./types";

const L = "Three.js · React Three Fiber";
const sh = (shape: Shape, mat: Mat, motion: Motion, color?: string) => () => <Scene><Shape3D shape={shape} mat={mat} motion={motion} color={color} /></Scene>;
const sc = (children: React.ReactNode, props: Omit<React.ComponentProps<typeof Scene>, "children"> = {}) => () => <Scene {...props}>{children}</Scene>;

export const three = make("three", [
  ["Cube métallique en rotation", L, sh("box", "metal", "spin")],
  ["Sphère qui se déforme", L + " · drei", sh("sphere", "distort", "float", "#7c5cff")],
  ["Nœud en fil de fer", L, sh("knot", "wire", "spin", "#3ddbd9")],
  ["Icosaèdre toon flottant", L, sh("ico", "toon", "float", "#ffb547")],
  ["Octaèdre qui ondule", L + " · drei", sh("octa", "wobble", "spin", "#3ddbd9")],
  ["Tore qui suit la souris", L, sh("torus", "metal", "mouse", "#7c5cff")],
  ["Dodécaèdre aux normales", L, sh("dodeca", "normal", "spin")],
  ["Cône qui rebondit", L, sh("cone", "flat", "bounce", "#ff6b9a")],
  ["Cylindre lumineux qui pulse", L, sh("cyl", "glow", "pulse", "#3ddbd9")],
  ["Sphère filaire qui pulse", L, sh("sphere", "wire", "pulse", "#ffb547")],
  ["Nœud déformé par la souris", L + " · drei", sh("knot", "distort", "mouse", "#ff6b9a")],
  ["Cube avec contours", L + " · drei", sc(<mesh><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color="#171a2b" /><Edges color="#3ddbd9" /></mesh>, { controls: true })],
  ["Vague de cubes instanciés", L, sc(<S.WaveGrid />, { cam: [0, 3, 6] })],
  ["Anneaux gyroscopiques", L, sc(<S.Rings />)],
  ["Système solaire", L, sc(<S.Solar />, { cam: [0, 4, 7] })],
  ["Double hélice", L, sc(<S.Helix />, { cam: [0, 0, 6] })],
  ["Cubes en apesanteur", L + " · drei", sc(<S.CubeField />, { cam: [0, 0, 6] })],
  ["Caméra à parallaxe", L, sc(<S.CameraParallax />)],
  ["Espace étoilé", L + " · drei", sc(<S.Space />, { cam: [0, 0, 8] })],
  ["Plan ondulant", L, sc(<S.WavyPlane />, { cam: [0, 1.5, 5] })],
  ["Ondes par shader GLSL", L, sc(<S.Ripple />, { cam: [0, 0, 4.2] })],
  ["Tunnel d'anneaux", L, sc(<S.Tunnel />, { cam: [0, 0, 4] })],
  ["Sphères rebondissantes", L, sc(<S.Bouncers />, { cam: [0, 0.5, 5] })],
  ["Pendules", L, sc(<S.Pendulums />, { cam: [0, 0, 5.5] })],
  ["Grille réactive au curseur", L, sc(<S.PointerGrid />, { cam: [0, 0, 6] })],
  ["Sphère de cubes de Fibonacci", L, sc(<S.FibSphere />, { cam: [0, 0, 6] })],
]);
