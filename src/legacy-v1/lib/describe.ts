import { G, applyIntensity, buildParticles, motionProps, type Fx } from './registry'
import { defaultsFor } from './params'
import { SC_TWEEN } from './extra'
import { VERT, fragmentSource } from './shaders'

const DG: Record<string, string> = {
  fade: 'Apparition en fondu.', fadeUp: 'Monte depuis le bas en apparaissant.', fadeDown: 'Descend depuis le haut en apparaissant.',
  fadeLeft: 'Arrive depuis la gauche.', fadeRight: 'Arrive depuis la droite.', zoomIn: 'Grossit depuis un petit format.',
  zoomOut: 'Rétrécit depuis un grand format.', rotate: 'Pivote légèrement en apparaissant.', blur: 'Passe du flou à la netteté.',
  blurUp: 'Monte en passant du flou à la netteté.', skew: 'Glisse en biais puis se redresse.', flipX: "Se retourne autour de l'axe horizontal.",
  flipY: "Se retourne autour de l'axe vertical.", drop: 'Tombe et rebondit.', elastic: 'Apparaît avec un effet ressort.',
  swing: 'Se balance comme suspendu, puis se stabilise.', spacing: "L'espacement des lettres se resserre.",
  clipUp: 'Révélé de bas en haut par un masque.', clipLeft: 'Révélé de gauche à droite par un masque.', circle: "Révélé par un cercle qui s'agrandit.",
}
const MODE_FR: Record<string, string> = { block: "sur le bloc entier", lines: 'ligne par ligne', words: 'mot par mot', chars: 'lettre par lettre' }
const DM: Record<string, string> = {
  hoverLift: 'Se soulève et grossit au survol.', hoverGlow: 'Halo lumineux au survol.', hoverShake: 'Secousse horizontale au survol.',
  hoverJelly: 'Effet gélatine au survol : large et aplati.', hoverRotate: 'Quart de tour au survol.', hoverFlip: 'Se retourne au survol.',
  skewHover: 'Se penche et glisse au survol.', tapSquish: "S'écrase quand on appuie.", tapSpin: 'Demi-tour quand on appuie.',
  springPop: 'Jaillit comme un ressort, en boucle.', float: 'Flotte de haut en bas.', pulse: 'Pulsation douce.', wobble: 'Se balance de gauche à droite.',
  spin: 'Rotation continue.', morph: 'Passe du carré arrondi au cercle.', colors: 'Change de couleur en continu.', breathe: "L'opacité respire.",
  orbit: 'Tourne en losange autour de sa position.', heartbeat: 'Double battement de cœur.', slideLoop: 'Va-et-vient horizontal.',
  drag: "Se déplace à la souris ou au doigt, avec de l'élasticité.", dragSnap: 'Se déplace puis revient à sa place.',
  inViewUp: "Monte en apparaissant à l'entrée dans l'écran.", inViewZoom: "Grossit à l'entrée dans l'écran.", inViewBlur: "Se précise à l'entrée dans l'écran.",
}
const SH: Record<string, string> = { circle: 'ronds', square: 'carrés', triangle: 'triangles', star: 'étoiles', polygon: 'pentagones', line: 'traits' }
const BH: Record<string, string> = { links: 'reliés entre eux par des lignes', bubble: 'qui grossissent près du curseur', repulse: 'repoussés par le curseur', attract: 'attirés par le curseur', grab: 'reliés au curseur par des lignes' }
const GE: Record<string, string> = { sphere: 'Sphère', knot: 'Nœud torique', icosa: 'Icosaèdre', box: 'Cube', torus: 'Tore' }
const MA: Record<string, string> = { distort: 'une matière qui se déforme', wobble: 'une matière qui ondule', wire: 'un rendu fil de fer', metal: 'un rendu métal poli' }
const GC: Record<string, string> = {
  sphere: '<sphereGeometry args={[1, 64, 64]} />', knot: '<torusKnotGeometry args={[0.7, 0.25, 160, 24]} />',
  icosa: '<icosahedronGeometry args={[1.1, 1]} />', box: '<boxGeometry args={[1.4, 1.4, 1.4]} />', torus: '<torusGeometry args={[0.9, 0.3, 32, 96]} />',
}
const MC = (m: string, v: Record<string, any>): string => ({
  distort: `<MeshDistortMaterial color="${v.color}" distort={${v.distort}} speed={3} />`, wobble: `<MeshWobbleMaterial color="${v.color}" factor={${v.wobble}} speed={2} />`,
  wire: `<meshBasicMaterial color="${v.color}" wireframe />`, metal: `<meshStandardMaterial color="${v.color}" metalness={1} roughness={${v.rough}} />`,
} as Record<string, string>)[m]
const MI: Record<string, string> = { distort: 'MeshDistortMaterial', wobble: 'MeshWobbleMaterial' }

const DSC: Record<string, string> = {
  scale: 'Grossit et devient opaque', rotate: 'Pivote jusqu\'à sa place', fade: 'Apparaît en fondu', blur: 'Passe du flou à la netteté',
  slideX: 'Arrive depuis la gauche', slideY: 'Monte depuis le bas', clip: 'Révélé de gauche à droite par un masque', skew: 'Se redresse en glissant', flip: 'Se retourne vers l\'écran',
  pin: 'Épingle l\'élément pendant que tu défiles, avec une rotation liée au scroll.', progress: 'Barre de progression de lecture liée au scroll.',
  counter: 'Compteur qui monte avec le scroll.', highlight: 'Texte qui s\'éclaire mot par mot en défilant.', horizontal: 'Le défilement vertical devient un défilement horizontal de panneaux.',
  colorShift: 'Le fond change de couleur au fil du scroll.', staggerList: 'Les lignes d\'une liste arrivent en cascade.', parallax: 'Deux couches bougent à des vitesses différentes (parallaxe).',
}
const SCROLL_CODE: Record<string, (v: any) => string> = {
  pin: v => `gsap.to(el, { rotate: 360, scale: 1.15, ease: 'none', scrollTrigger: { trigger: el, start: 'top 20%', end: '+=${v.distance}%', scrub: true, pin: true } })`,
  progress: () => `gsap.to(bar, { width: '100%', ease: 'none', scrollTrigger: { trigger: content, start: 'top top', end: 'bottom bottom', scrub: true } })`,
  counter: v => `const o = { n: 0 }\ngsap.to(o, { n: ${v.target}, ease: 'none', onUpdate: () => { el.textContent = Math.round(o.n).toLocaleString('fr-FR') },\n  scrollTrigger: { trigger: el, start: 'top ${v.start}%', end: 'top ${v.end}%', scrub: true } })`,
  highlight: v => `import SplitType from 'split-type'\nconst split = new SplitType(el, { types: 'words' })\ngsap.fromTo(split.words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: 'none',\n  scrollTrigger: { trigger: el, start: 'top ${v.start}%', end: 'bottom ${v.end}%', scrub: true } })`,
  horizontal: () => `gsap.to(strip, { x: () => -(strip.scrollWidth - window.innerWidth), ease: 'none',\n  scrollTrigger: { trigger: wrap, start: 'top top', end: () => '+=' + strip.scrollWidth, scrub: true, pin: true, invalidateOnRefresh: true } })`,
  colorShift: v => `gsap.fromTo(document.body, { backgroundColor: '#0b0d12' }, { backgroundColor: '${v.color}', ease: 'none',\n  scrollTrigger: { trigger: content, start: 'top top', end: 'bottom bottom', scrub: true } })`,
  staggerList: v => `gsap.from(list.children, { opacity: 0, y: 40, stagger: ${v.stagger}, duration: 0.8, ease: 'power3.out',\n  scrollTrigger: { trigger: list, start: 'top ${v.start}%', toggleActions: 'play none none reverse' } })`,
  parallax: v => `gsap.to(bg, { yPercent: ${+(-12 * v.intensity).toFixed(1)}, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } })\ngsap.to(fg, { yPercent: ${+(20 * v.intensity).toFixed(1)}, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } })`,
}
const DMEDIA: Record<string, string> = {
  kenBurns: 'Zoom et dérive lente en boucle (effet Ken Burns).', hoverZoom: 'Zoome doucement au survol.', tilt3d: 'Se penche en 3D vers le curseur.',
  revealMask: 'Révélée par un masque qui monte, en boucle.', grayHover: 'Passe du noir et blanc à la couleur au survol.', spotlight: 'Un spot de couleur suit le curseur sur une image en noir et blanc.',
  rgbSplit: 'Effet glitch : les canaux de couleur se décalent.', slices: 'Se révèle en tranches verticales décalées.', blurUp: 'Passe du flou à la netteté en zoomant.',
  crossfade: 'Fondu enchaîné entre plusieurs images.', videoBg: 'Vidéo en fond avec voile sombre et titre.', hoverPlay: "La vidéo ne se lit qu'au survol.",
  circleReveal: "La vidéo est révélée par un cercle qui s'agrandit.", playInView: "Lecture automatique quand la vidéo entre dans l'écran.",
  grayHoverVideo: 'Vidéo en noir et blanc qui reprend ses couleurs au survol.', videoTilt: 'Vidéo inclinée en 3D vers le curseur.',
}
const DLAND: Record<string, string> = {
  heroSphere: 'Hero avec sphère 3D qui se déforme et titre qui apparaît lettre par lettre.', heroParticles: 'Hero avec réseau de particules en fond.',
  heroParallax: 'Hero à plusieurs couches de profondeur qui suivent le curseur.', marquee: 'Bandeaux de texte qui défilent en continu.',
  stats: "Chiffres clés qui comptent en entrant dans l'écran.", features: 'Grille de cartes qui arrivent en cascade.', gallery: 'Galerie de cartes à faire glisser.',
  curtain: 'Rideau qui s\'ouvre pour révéler le titre.', magneticCta: 'Bouton attiré par le curseur.', spotlightHero: 'Texte révélé par un spot qui suit la souris.',
}
const DSHADER: Record<string, string> = {
  plasma: 'Plasma coloré en mouvement.', waves: 'Vagues ondulantes.', clouds: 'Nuages de bruit fractal.', aurora: 'Aurore boréale.', tunnel: 'Tunnel en perspective.',
  ripple: 'Ondes qui partent du curseur.', voronoi: 'Cellules de Voronoï animées.', kaleido: 'Kaléidoscope.', meshGradient: 'Dégradé fluide de type mesh gradient.',
  grid: 'Grille en défilement.', metaballs: 'Métaballes qui fusionnent.', warp: 'Distorsion de domaine organique.',
}
const DLOT: Record<string, string> = {
  spinner: 'Loader circulaire.', pulse: 'Cercle qui pulse.', ripple: "Onde qui s'étend.", bounce: 'Balle qui rebondit.', morph: 'Carré qui devient cercle en tournant.',
  dots: 'Trois points de chargement.', check: 'Coche qui se dessine.', ring: 'Anneau de progression.', bars: "Barres d'égaliseur.",
}

export type Info = { desc: string; code: string; deps: string; files: string }

// Description, code copiable et dépendances d'un preset, avec les réglages du labo (o) déjà appliqués.
export function info(f: Fx, o: Record<string, any> = {}): Info {
  const p = f.p, v = { ...defaultsFor(f.cat, p), ...o }
  if (f.cat === 'gsap') {
    const [from, to] = G[p.k]
    const split = p.mode !== 'block'
    const vars = JSON.stringify({
      ...to, duration: v.duration, ...(v.delay ? { delay: v.delay } : {}), ease: v.ease === 'auto' ? (to.ease ?? 'power3.out') : v.ease,
      ...(split ? { stagger: { each: v.stagger, from: v.from } } : {}), ...(v.loop ? { repeat: -1, repeatDelay: v.pause } : {}),
    })
    const f2 = JSON.stringify(applyIntensity(from, v.intensity))
    const code = `import gsap from 'gsap'\n${split ? "import SplitType from 'split-type'\n" : ''}\n` +
      (split ? `const split = new SplitType(el, { types: '${p.mode}' })\ngsap.fromTo(split.${p.mode},\n  ${f2},\n  ${vars})\n// au démontage : split.revert()` : `gsap.fromTo(el,\n  ${f2},\n  ${vars})`)
    return { desc: `${DG[p.k]} Appliqué ${MODE_FR[p.mode]}.`, code, deps: split ? 'gsap @gsap/react split-type' : 'gsap @gsap/react', files: `components/GsapFx.tsx, lib/params.ts + G.${p.k} dans lib/registry.ts` }
  }
  if (f.cat === 'motion') {
    const props = Object.entries(motionProps(p.k, v.speed)).map(([k, x]) => `  ${k}={${JSON.stringify(x)}}`).join('\n')
    const style = JSON.stringify({ width: v.size, height: v.size, background: v.color, borderRadius: `${v.radius}%` })
    return { desc: DM[p.k], code: `import { motion } from 'motion/react'\n\n<motion.div\n${props}\n  style={${style}}\n/>`, deps: 'motion', files: `components/MotionFx.tsx, lib/params.ts + M.${p.k} dans lib/registry.ts` }
  }
  if (f.cat === 'particles') {
    const opts = JSON.stringify(buildParticles(p.shape, p.mode, v), null, 2)
    return {
      desc: `Champ de ${SH[p.shape]} ${BH[p.mode]}.${p.mode === 'links' ? '' : ' Passe la souris sur la zone pour tester.'}`,
      code: `import Particles, { initParticlesEngine } from '@tsparticles/react'\nimport { loadSlim } from '@tsparticles/slim'\n\n// une fois au montage : await initParticlesEngine(async e => { await loadSlim(e) })\n<Particles id="mes-particules" options={${opts}} />`,
      deps: '@tsparticles/react @tsparticles/slim @tsparticles/engine', files: 'components/ParticlesFx.tsx, lib/params.ts + buildParticles dans lib/registry.ts',
    }
  }
  if (f.cat === 'scroll') {
    const tw = SC_TWEEN[p.k]
    const imp = `import gsap from 'gsap'\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'\ngsap.registerPlugin(ScrollTrigger)\n\n`
    const mk = v.markers ? ', markers: true' : ''
    let body: string
    let desc: string
    if (tw) {
      const f2 = JSON.stringify(applyIntensity(tw[0], v.intensity)), t2 = JSON.stringify(tw[1])
      body = p.mode === 'scrub'
        ? `gsap.fromTo(el, ${f2},\n  { ...${t2}, ease: 'none',\n    scrollTrigger: { trigger: el, start: 'top ${v.start}%', end: 'top ${v.end}%', scrub: ${v.scrub > 0 ? v.scrub : 'true'}${mk} } })`
        : `gsap.fromTo(el, ${f2},\n  { ...${t2}, duration: 1, ease: 'power3.out',\n    scrollTrigger: { trigger: el, start: 'top ${v.start}%', toggleActions: 'play none none reverse'${mk} } })`
      desc = `${DSC[p.k]}. ${p.mode === 'scrub' ? "L'animation suit exactement la position du scroll (scrub)." : "Se déclenche quand l'élément entre dans l'écran et revient en arrière si tu remontes."} Fais défiler dans la zone d'essai.`
    } else { body = SCROLL_CODE[p.k](v); desc = `${DSC[p.k]} Fais défiler dans la zone d'essai.` }
    return { desc, code: imp + body, deps: p.k === 'highlight' ? 'gsap @gsap/react split-type' : 'gsap @gsap/react', files: 'components/ScrollFx.tsx, lib/params.ts, lib/extra.ts' }
  }
  if (f.cat === 'media' || f.cat === 'landing') {
    const comp = f.cat === 'media' ? 'MediaFx' : 'LandingFx', defs = defaultsFor(f.cat, p)
    const diff = Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== defs[k]))
    return {
      desc: (f.cat === 'media' ? DMEDIA : DLAND)[p.k],
      deps: f.cat === 'media' ? 'motion' : 'motion gsap @gsap/react split-type three @react-three/fiber @react-three/drei @tsparticles/react @tsparticles/slim @tsparticles/engine',
      files: f.cat === 'media' ? 'components/MediaFx.tsx, lib/params.ts, lib/art.ts, lib/extra.ts' : 'components/LandingFx.tsx, components/ParticlesFx.tsx, lib/params.ts, lib/registry.ts, lib/art.ts',
      code: `// cas '${p.k}' dans components/${comp}.tsx\n<${comp} p={${JSON.stringify({ k: p.k, ...diff })}} />`,
    }
  }
  if (f.cat === 'shader') return {
    desc: DSHADER[p.k], deps: 'three @react-three/fiber', files: 'components/ShaderFx.tsx, lib/shaders.ts, lib/params.ts',
    code: `// <mesh frustumCulled={false}><planeGeometry args={[2, 2]} /><shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} /></mesh>\n// uniforms : uTime (temps x ${v.speed}), uScale ${v.scale}, uIntensity ${v.intensity}, uRes, uMouse, uC1 ${v.c1}, uC2 ${v.c2}, uC3 ${v.c3}\n\nconst VERT = \`${VERT}\`\n\nconst FRAG = \`${fragmentSource(p.k)}\``,
  }
  if (f.cat === 'lottie') return {
    desc: DLOT[p.k], deps: 'lottie-react', files: 'components/LottieFx.tsx, lib/lottie.ts, lib/params.ts',
    code: `import Lottie from 'lottie-react'\nimport { lottieDoc } from './lib/lottie'\n\n<Lottie animationData={lottieDoc('${p.k}', { color: '${v.color}', stroke: ${v.stroke} })} loop={${v.loop}} style={{ width: ${v.size}, height: ${v.size} }} />\n\n// Avec un fichier exporté d'After Effects ou de LottieFiles :\n// <Lottie animationData={await (await fetch('/mon-animation.json')).json()} />`,
  }
  const deps = 'three @react-three/fiber @react-three/drei'
  const files = 'components/ThreeFx.tsx, lib/params.ts'
  const bg = `  <color attach="background" args={['${v.bg}']} />`
  if (p.k) {
    const el = p.k === 'stars' ? `<Stars count={${v.count}} speed={${v.speed}} />` : `<Sparkles count={${v.count}} scale={4} size={${v.size}} speed={${v.speed}} color="${v.color}" />`
    return { desc: p.k === 'stars' ? "Champ d'étoiles 3D. Glisse pour tourner autour." : "Nuage d'étincelles 3D. Glisse pour tourner autour.", deps, files,
      code: `import { Canvas } from '@react-three/fiber'\nimport { ${p.k === 'stars' ? 'Stars' : 'Sparkles'}, OrbitControls } from '@react-three/drei'\n\n<Canvas camera={{ position: [0, 0, 4] }}>\n${bg}\n  ${el}\n  <OrbitControls enableZoom={false} />\n</Canvas>` }
  }
  const imp = ['Float', MI[p.m], 'OrbitControls'].filter(Boolean).join(', ')
  return {
    desc: `${GE[p.g]} avec ${MA[p.m]}, en rotation et en flottement. Glisse pour la faire pivoter.`, deps, files,
    code: `import { Canvas, useFrame } from '@react-three/fiber'\nimport { ${imp} } from '@react-three/drei'\n\n<Canvas camera={{ position: [0, 0, 4] }}>\n${bg}\n  <ambientLight intensity={0.7} />\n  <directionalLight position={[3, 3, 3]} intensity={2} />\n  <Float speed={2} floatIntensity={${v.float}}>\n    <mesh scale={${v.scale}}> {/* useFrame : mesh.rotation.y += delta * ${v.speed} */}\n      ${GC[p.g]}\n      ${MC(p.m, v)}\n    </mesh>\n  </Float>\n  <OrbitControls enableZoom={false} />\n</Canvas>`,
  }
}
