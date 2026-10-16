/** Génère des animations Lottie (JSON) sans fichier externe : forme + mouvement + couleur. */
export type LShape = "rc" | "el" | "sr";
export type LAnim = "spin" | "pulse" | "bounce" | "swing" | "draw" | "orbit";
type RGB = [number, number, number];

const ease = (n: number) => ({ i: { x: Array(n).fill(0.5), y: Array(n).fill(1) }, o: { x: Array(n).fill(0.5), y: Array(n).fill(0) } });
const kf = (t: number, s: number[]) => ({ t, s, ...ease(s.length) });
const anim = (frames: [number, number[]][]) => ({ a: 1, k: frames.map(([t, s]) => kf(t, s)) });
const still = (k: number | number[]) => ({ a: 0, k });

export function makeLottie({ shape, anim: a, color, size = 70 }: { shape: LShape; anim: LAnim; color: RGB; size?: number }) {
  const c = [...color, 1];
  const geo =
    shape === "rc" ? { ty: "rc", d: 1, s: still([size, size]), p: still([0, a === "orbit" ? -50 : 0]), r: still(size * 0.22) }
    : shape === "el" ? { ty: "el", d: 1, s: still([size, size]), p: still([0, a === "orbit" ? -50 : 0]) }
    : { ty: "sr", sy: 1, d: 1, pt: still(5), p: still([0, a === "orbit" ? -50 : 0]), r: still(0), ir: still(size * 0.22), is: still(0), or: still(size / 2), os: still(0) };
  const styled = a === "draw"
    ? { ty: "st", c: still(c), o: still(100), w: still(10), lc: 2, lj: 2 }
    : { ty: "fl", c: still(c), o: still(100), r: 1 };
  const rotation = a === "spin" || a === "orbit" ? anim([[0, [0]], [60, [360]]]) : a === "swing" ? anim([[0, [0]], [15, [25]], [45, [-25]], [60, [0]]]) : a === "draw" ? anim([[0, [0]], [60, [360]]]) : still(0);
  const scale = a === "pulse" ? anim([[0, [100, 100, 100]], [30, [135, 135, 100]], [60, [100, 100, 100]]]) : still([100, 100, 100]);
  const pos = a === "bounce" ? anim([[0, [100, 70, 0]], [30, [100, 135, 0]], [60, [100, 70, 0]]]) : still([100, 100, 0]);
  const group = { ty: "gr", nm: "g", it: [geo, styled, { ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100) }] };
  const trim = { ty: "tm", s: anim([[0, [0]], [30, [0]], [60, [100]]]), e: anim([[0, [0]], [30, [100]], [60, [100]]]), o: still(0), m: 1 };
  return {
    v: "5.7.0", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "kit", ddd: 0, assets: [],
    layers: [{ ddd: 0, ind: 1, ty: 4, nm: "l", sr: 1, ks: { o: still(100), r: rotation, p: pos, a: still([0, 0, 0]), s: scale }, ao: 0, shapes: a === "draw" ? [group, trim] : [group], ip: 0, op: 60, st: 0, bm: 0 }],
  };
}
