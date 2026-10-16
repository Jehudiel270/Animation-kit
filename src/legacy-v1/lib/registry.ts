import { IMAGES, LANDING, LOTTIE_IDS, SC_SPECIAL, SC_TWEEN, SHADER_IDS, VIDEOS } from './extra'
// Ajouter une animation = ajouter une ligne dans G, M ou une entrée dans REG.
export type Cat = 'gsap' | 'motion' | 'particles' | 'three' | 'scroll' | 'media' | 'landing' | 'shader' | 'lottie'
export type Fx = { id: string; cat: Cat; name: string; p: any }
export const CATS: Cat[] = ['gsap', 'motion', 'particles', 'three', 'scroll', 'media', 'landing', 'shader', 'lottie']

// GSAP : [état de départ, état d'arrivée] — appliqué au bloc, aux lignes, aux mots ou aux lettres (SplitType)
export const G: Record<string, [Record<string, any>, Record<string, any>]> = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  fadeUp: [{ y: 60, opacity: 0 }, { y: 0, opacity: 1 }],
  fadeDown: [{ y: -60, opacity: 0 }, { y: 0, opacity: 1 }],
  fadeLeft: [{ x: -80, opacity: 0 }, { x: 0, opacity: 1 }],
  fadeRight: [{ x: 80, opacity: 0 }, { x: 0, opacity: 1 }],
  zoomIn: [{ scale: .4, opacity: 0 }, { scale: 1, opacity: 1 }],
  zoomOut: [{ scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1 }],
  rotate: [{ rotate: -25, opacity: 0 }, { rotate: 0, opacity: 1 }],
  blur: [{ filter: 'blur(18px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1 }],
  blurUp: [{ y: 40, filter: 'blur(12px)', opacity: 0 }, { y: 0, filter: 'blur(0px)', opacity: 1 }],
  skew: [{ skewX: 30, x: -60, opacity: 0 }, { skewX: 0, x: 0, opacity: 1 }],
  flipX: [{ rotationX: -90, transformPerspective: 600, opacity: 0 }, { rotationX: 0, opacity: 1 }],
  flipY: [{ rotationY: -90, transformPerspective: 600, opacity: 0 }, { rotationY: 0, opacity: 1 }],
  drop: [{ y: -160, opacity: 0 }, { y: 0, opacity: 1, ease: 'bounce.out' }],
  elastic: [{ scale: 0 }, { scale: 1, ease: 'elastic.out(1,.4)' }],
  swing: [{ rotationZ: -70, transformOrigin: 'top center', opacity: 0 }, { rotationZ: 0, opacity: 1, ease: 'elastic.out(1,.3)' }],
  spacing: [{ letterSpacing: '.8em', opacity: 0 }, { letterSpacing: '0em', opacity: 1 }],
  clipUp: [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }],
  clipLeft: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
  circle: [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }],
}
export const MODES = ['block', 'lines', 'words', 'chars'] as const

// Motion : props passées directement à <motion.div />
export const M: Record<string, any> = {
  hoverLift: { whileHover: { y: -10, scale: 1.08 } },
  hoverGlow: { whileHover: { boxShadow: '0 0 48px #8b5cf6' } },
  hoverShake: { whileHover: { x: [0, -8, 8, -8, 0] } },
  hoverJelly: { whileHover: { scaleX: 1.25, scaleY: .8 } },
  hoverRotate: { whileHover: { rotate: 90 } },
  hoverFlip: { whileHover: { rotateY: 180 } },
  skewHover: { whileHover: { skewX: -12, x: 6 } },
  tapSquish: { whileTap: { scale: .8 } },
  tapSpin: { whileTap: { rotate: 180 } },
  springPop: { animate: { scale: [0, 1.2, 1] }, transition: { duration: 1, repeat: Infinity, repeatDelay: 1, ease: 'backOut' } },
  float: { animate: { y: [0, -16, 0] }, transition: { repeat: Infinity, duration: 3 } },
  pulse: { animate: { scale: [1, 1.12, 1] }, transition: { repeat: Infinity, duration: 1.4 } },
  wobble: { animate: { rotate: [0, 8, -8, 0] }, transition: { repeat: Infinity, duration: 1.6 } },
  spin: { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 5, ease: 'linear' } },
  morph: { animate: { borderRadius: ['12%', '50%', '12%'] }, transition: { repeat: Infinity, duration: 3 } },
  colors: { animate: { backgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#8b5cf6'] }, transition: { repeat: Infinity, duration: 4 } },
  breathe: { animate: { opacity: [.4, 1, .4] }, transition: { repeat: Infinity, duration: 2.4 } },
  orbit: { animate: { x: [0, 40, 0, -40, 0], y: [0, -40, 0, 40, 0] }, transition: { repeat: Infinity, duration: 4, ease: 'linear' } },
  heartbeat: { animate: { scale: [1, 1.2, 1, 1.2, 1] }, transition: { duration: 1.2, repeat: Infinity } },
  slideLoop: { animate: { x: [-40, 40] }, transition: { repeat: Infinity, repeatType: 'reverse', duration: 1.5, ease: 'easeInOut' } },
  drag: { drag: true, dragElastic: .2, whileDrag: { scale: 1.1 } },
  dragSnap: { drag: true, dragSnapToOrigin: true, whileDrag: { scale: 1.15, rotate: 8 } },
  inViewUp: { initial: { y: 50, opacity: 0 }, whileInView: { y: 0, opacity: 1 } },
  inViewZoom: { initial: { scale: .5, opacity: 0 }, whileInView: { scale: 1, opacity: 1 } },
  inViewBlur: { initial: { filter: 'blur(16px)', opacity: 0 }, whileInView: { filter: 'blur(0px)', opacity: 1 } },
}

// tsParticles : forme x comportement
export const SHAPES = ['circle', 'square', 'triangle', 'star', 'polygon', 'line']
export const BEHAVIORS = ['links', 'bubble', 'repulse', 'attract', 'grab']
export const DIST: Record<string, number> = { links: 130, bubble: 160, repulse: 120, attract: 200, grab: 160 }
export type PO = { count?: number; speed?: number; size?: number; opacity?: number; distance?: number; multicolor?: boolean; color?: string; bg?: string }
export const buildParticles = (shape: string, mode: string, o: PO = {}) => {
  const d = o.distance ?? DIST[mode], size = o.size ?? 6
  return {
    fullScreen: false, background: { color: o.bg ?? '#0b0d12' }, fpsLimit: 60,
    particles: {
      number: { value: o.count ?? 60 },
      color: { value: o.multicolor === false ? [o.color ?? '#8b5cf6'] : ['#8b5cf6', '#ec4899', '#22d3ee'] },
      shape: { type: shape, options: { polygon: { sides: 5 } } },
      size: { value: { min: Math.max(1, size / 3), max: size } }, opacity: { value: o.opacity ?? 0.7 },
      links: { enable: mode === 'links', distance: d, color: '#8b5cf6', opacity: 0.4 },
      move: { enable: true, speed: o.speed ?? 1.4, outModes: 'bounce' },
    },
    interactivity: {
      events: { onHover: { enable: mode !== 'links', mode }, resize: { enable: true } },
      modes: { bubble: { distance: d, size: size * 2, duration: 2, opacity: 1 }, repulse: { distance: d }, attract: { distance: d, speed: 3 }, grab: { distance: d, links: { opacity: 0.8 } } },
    },
  }
}

// Three.js / R3F : géométrie x matériau + 2 champs
export const GEOS = ['sphere', 'knot', 'icosa', 'box', 'torus']
export const MATS = ['distort', 'wobble', 'wire', 'metal']
export const MAT_COLOR: Record<string, string> = { distort: '#8b5cf6', wobble: '#ec4899', wire: '#22d3ee', metal: '#e5e7eb' }

export const REG: Fx[] = [
  ...Object.keys(G).flatMap(k => MODES.map(mode => ({ id: `gsap-${k}-${mode}`, cat: 'gsap' as Cat, name: `${k} / ${mode}`, p: { k, mode } }))),
  ...Object.keys(M).map(k => ({ id: `motion-${k}`, cat: 'motion' as Cat, name: k, p: { k } })),
  ...SHAPES.flatMap(shape => BEHAVIORS.map(mode => ({ id: `particles-${shape}-${mode}`, cat: 'particles' as Cat, name: `${shape} / ${mode}`, p: { shape, mode } }))),
  ...GEOS.flatMap(g => MATS.map(m => ({ id: `three-${g}-${m}`, cat: 'three' as Cat, name: `${g} / ${m}`, p: { g, m } }))),
  { id: 'three-stars', cat: 'three', name: 'stars', p: { k: 'stars' } },
  { id: 'three-sparkles', cat: 'three', name: 'sparkles', p: { k: 'sparkles' } },
  ...Object.keys(SC_TWEEN).flatMap(k => (['scrub', 'enter'] as const).map(mode => ({ id: `scroll-${k}-${mode}`, cat: 'scroll' as Cat, name: `${k} / ${mode}`, p: { k, mode } }))),
  ...SC_SPECIAL.map(k => ({ id: `scroll-${k}`, cat: 'scroll' as Cat, name: k, p: { k } })),
  ...IMAGES.map(k => ({ id: `media-${k}`, cat: 'media' as Cat, name: `image / ${k}`, p: { k } })),
  ...VIDEOS.map(k => ({ id: `media-${k}`, cat: 'media' as Cat, name: `vidéo / ${k}`, p: { k } })),
  ...LANDING.map(k => ({ id: `landing-${k}`, cat: 'landing' as Cat, name: k, p: { k } })),
  ...SHADER_IDS.map(k => ({ id: `shader-${k}`, cat: 'shader' as Cat, name: k, p: { k } })),
  ...LOTTIE_IDS.map(k => ({ id: `lottie-${k}`, cat: 'lottie' as Cat, name: k, p: { k } })),
]

// Intensité GSAP : multiplie les décalages de départ (x, y, rotations, échelle)
const LIN = ['x', 'y', 'rotate', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY']
export const applyIntensity = (from: Record<string, any>, k = 1) =>
  Object.fromEntries(Object.entries(from).map(([a, b]) => [a,
    typeof b !== 'number' ? b : LIN.includes(a) ? +(b * k).toFixed(2) : a === 'scale' ? +Math.max(0, 1 + (b - 1) * k).toFixed(2) : b]))

// Vitesse Motion : ajuste les durées d'un preset, ou impose une transition courte si le preset n'en a pas
export function motionProps(k: string, speed = 1) {
  const base = M[k], t = base.transition
  const transition = t
    ? { ...t, ...(t.duration ? { duration: +(t.duration / speed).toFixed(2) } : {}), ...(t.repeatDelay ? { repeatDelay: +(t.repeatDelay / speed).toFixed(2) } : {}) }
    : speed !== 1 ? { duration: +(0.4 / speed).toFixed(2), ease: 'easeOut' } : undefined
  return transition ? { ...base, transition } : base
}
