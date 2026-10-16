import { DIST, MAT_COLOR, type Cat } from './registry'
import { DUR, MEDIA_X, SC_TWEEN, VIDEOS } from './extra'

export type Param = { key: string; label: string; type: 'range' | 'color' | 'text' | 'select' | 'check'; def: any; min?: number; max?: number; step?: number; options?: string[] }
export const EASES = ['auto', 'power3.out', 'power1.inOut', 'back.out(1.7)', 'elastic.out(1,.4)', 'expo.out', 'bounce.out', 'sine.inOut']
export const DEFAULT_TEXT = 'Des animations modernes à copier dans tous vos projets'

const r = (key: string, label: string, min: number, max: number, step: number, def: number): Param => ({ key, label, type: 'range', min, max, step, def })
const c = (key: string, label: string, def: string): Param => ({ key, label, type: 'color', def })

// Source unique des réglages visibles dans le labo (et de leurs valeurs par défaut)
export function paramsFor(cat: Cat, p: any): Param[] {
  if (cat === 'gsap') return [
    { key: 'text', label: 'Texte', type: 'text', def: DEFAULT_TEXT },
    r('fontSize', 'Taille du texte (px)', 16, 64, 1, 28), c('color', 'Couleur du texte', '#f2f2f0'),
    r('duration', 'Durée (s)', 0.2, 4, 0.1, 1), r('delay', 'Délai avant départ (s)', 0, 2, 0.1, 0), r('intensity', 'Intensité du mouvement', 0.2, 1.8, 0.1, 1),
    ...(p.mode !== 'block' ? [r('stagger', 'Décalage entre éléments (s)', 0, 0.4, 0.01, 0.05), { key: 'from', label: 'Origine du décalage', type: 'select' as const, options: ['start', 'center', 'end', 'edges', 'random'], def: 'start' }] : []),
    { key: 'ease', label: 'Courbe', type: 'select', options: EASES, def: 'auto' },
    { key: 'loop', label: 'Boucler', type: 'check', def: true }, r('pause', 'Pause entre boucles (s)', 0, 4, 0.2, 1.4),
  ]
  if (cat === 'motion') return [r('size', 'Taille (px)', 48, 200, 4, 96), r('radius', 'Arrondi (%)', 0, 50, 1, 17), c('color', 'Couleur', '#8b5cf6'), r('speed', 'Vitesse', 0.25, 3, 0.25, 1)]
  if (cat === 'particles') return [
    r('count', 'Quantité', 10, 200, 10, 60), r('speed', 'Vitesse', 0.2, 6, 0.2, 1.4), r('size', 'Taille max (px)', 2, 20, 1, 6), r('opacity', 'Opacité', 0.1, 1, 0.1, 0.7),
    r('distance', p.mode === 'links' ? 'Distance des liens (px)' : "Rayon d'action (px)", 30, 300, 10, DIST[p.mode]),
    { key: 'multicolor', label: 'Multicolore', type: 'check', def: true }, c('color', 'Couleur (si non multicolore)', '#8b5cf6'), c('bg', 'Fond', '#0b0d12'),
  ]
  if (cat === 'scroll') {
    const tw = SC_TWEEN[p.k]
    const col = c('color', 'Couleur', '#8b5cf6')
    const mk: Param = { key: 'markers', label: 'Afficher les repères ScrollTrigger', type: 'check', def: false }
    const sa = r('start', 'Déclenchement (% de la zone)', 40, 95, 5, 85)
    const ea = r('end', 'Fin (% de la zone)', 5, 70, 5, 30)
    if (tw) return [r('intensity', 'Intensité du mouvement', 0.2, 1.8, 0.1, 1), ...(p.mode === 'scrub' ? [r('scrub', 'Lissage du scrub (s)', 0, 3, 0.1, 0.6), sa, ea] : [sa]), col, mk]
    const sp: Record<string, Param[]> = {
      pin: [r('distance', 'Distance épinglée (% de la zone)', 50, 400, 10, 150)],
      counter: [r('target', 'Valeur finale', 100, 100000, 100, 12500), sa, ea],
      highlight: [sa, { ...ea, def: 40 }],
      staggerList: [r('stagger', 'Décalage (s)', 0.02, 0.3, 0.02, 0.1), sa],
      parallax: [r('intensity', 'Intensité', 0.2, 1.8, 0.1, 1)],
    }
    return [...(sp[p.k] ?? []), col, mk]
  }
  if (cat === 'media') {
    const vid = VIDEOS.includes(p.k), x = MEDIA_X[p.k]
    return [
      { key: 'src', label: vid ? 'Vidéo (URL .mp4 ou /media/ton-fichier.mp4)' : 'Image (URL ou /media/ton-image.jpg)', type: 'text', def: '' },
      r('radius', 'Arrondi (px)', 0, 48, 2, 16), r('duration', 'Durée (s)', 0.2, 12, 0.2, DUR[p.k] ?? 0.4),
      ...(x ? [r(x.key, x.label, x.min, x.max, x.step, x.def)] : []),
      ...(vid ? [r('overlay', 'Voile sombre', 0, 0.9, 0.05, 0.35), { key: 'title', label: 'Titre sur la vidéo', type: 'text' as const, def: 'Titre sur vidéo' }] : []),
    ]
  }
  if (cat === 'landing') {
    const T = (def: string): Param => ({ key: 'title', label: 'Titre', type: 'text', def })
    const col = c('color', "Couleur d'accent", '#8b5cf6')
    const L: Record<string, Param[]> = {
      heroSphere: [T('Votre produit, en mouvement'), col, r('speed', 'Vitesse', 0.2, 3, 0.1, 1), r('distort', 'Déformation', 0, 1, 0.05, 0.5)],
      heroParticles: [T('Une landing qui bouge'), col, r('count', 'Particules', 20, 150, 10, 70)],
      heroParallax: [T('Profondeur au curseur'), col, r('depth', 'Profondeur (px)', 5, 60, 5, 25)],
      marquee: [{ key: 'text', label: 'Texte', type: 'text', def: 'Animations · Modernes · Réglables' }, col, r('speed', 'Vitesse', 0.2, 4, 0.2, 1), r('size', 'Taille du texte', 4, 16, 1, 9), r('rows', 'Lignes', 1, 3, 1, 2)],
      stats: [col, r('duration', 'Durée du comptage (s)', 0.5, 4, 0.1, 2), r('size', 'Taille des chiffres', 5, 16, 1, 10)],
      features: [col, r('stagger', 'Décalage (s)', 0.05, 0.4, 0.05, 0.12), r('cols', 'Colonnes', 1, 4, 1, 3)],
      gallery: [col, r('size', 'Hauteur des cartes (%)', 30, 90, 2, 66), r('gap', 'Espace (px)', 8, 40, 2, 16)],
      curtain: [T('Rideau'), c('color', 'Couleur du rideau', '#8b5cf6'), r('duration', 'Durée (s)', 0.6, 3, 0.1, 1.4)],
      magneticCta: [{ key: 'label', label: 'Texte du bouton', type: 'text', def: 'Commencer' }, col, r('strength', 'Force magnétique', 0.1, 0.8, 0.05, 0.35)],
      spotlightHero: [T('Éclaire le texte'), col, r('size', 'Taille du spot (px)', 60, 300, 10, 140)],
    }
    return L[p.k]
  }
  if (cat === 'shader') return [r('speed', 'Vitesse', 0, 3, 0.1, 1), r('scale', 'Échelle', 0.4, 3, 0.1, 1), r('intensity', 'Luminosité', 0.5, 1.5, 0.05, 1), c('c1', 'Couleur 1', '#1b1464'), c('c2', 'Couleur 2', '#ec4899'), c('c3', 'Couleur 3', '#22d3ee')]
  if (cat === 'lottie') return [
    r('size', 'Taille (px)', 80, 400, 10, 200), r('speed', 'Vitesse', 0.25, 3, 0.25, 1), c('color', 'Couleur', '#8b5cf6'), r('stroke', 'Épaisseur du trait', 2, 20, 1, 8),
    { key: 'loop', label: 'Boucler', type: 'check', def: true }, { key: 'url', label: "URL d'un fichier Lottie .json à tester (facultatif)", type: 'text', def: '' },
  ]
  if (p.k === 'stars') return [r('count', "Quantité d'étoiles", 500, 8000, 500, 5000), r('speed', 'Vitesse', 0, 5, 0.5, 1), c('bg', 'Fond', '#0b0d12')]
  if (p.k === 'sparkles') return [r('count', 'Quantité', 20, 400, 10, 120), r('size', 'Taille', 1, 12, 1, 4), r('speed', 'Vitesse', 0, 5, 0.5, 1), c('color', 'Couleur', '#ffffff'), c('bg', 'Fond', '#0b0d12')]
  return [
    c('color', 'Couleur', MAT_COLOR[p.m]), r('speed', 'Vitesse de rotation', 0, 3, 0.1, 0.6), r('scale', 'Taille', 0.5, 1.8, 0.1, 1), r('float', 'Flottement', 0, 3, 0.1, 1),
    ...(p.m === 'distort' ? [r('distort', 'Déformation', 0, 1, 0.05, 0.5)] : []), ...(p.m === 'wobble' ? [r('wobble', 'Ondulation', 0, 2, 0.1, 0.8)] : []),
    ...(p.m === 'metal' ? [r('rough', 'Rugosité', 0, 1, 0.05, 0.15)] : []), c('bg', 'Fond', '#0b0d12'),
  ]
}
export const defaultsFor = (cat: Cat, p: any): Record<string, any> => Object.fromEntries(paramsFor(cat, p).map(x => [x.key, x.def]))
