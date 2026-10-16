// Listes de presets des familles scroll, médias, landing, shaders et Lottie (données seules).
export const SC_TWEEN: Record<string, [Record<string, any>, Record<string, any>]> = {
  scale: [{ scale: 0.4, opacity: 0.3 }, { scale: 1.1, opacity: 1 }],
  rotate: [{ rotate: -90, opacity: 0.2 }, { rotate: 0, opacity: 1 }],
  fade: [{ opacity: 0 }, { opacity: 1 }],
  blur: [{ filter: 'blur(20px)', opacity: 0.3 }, { filter: 'blur(0px)', opacity: 1 }],
  slideX: [{ x: -160, opacity: 0 }, { x: 0, opacity: 1 }],
  slideY: [{ y: 120, opacity: 0 }, { y: 0, opacity: 1 }],
  clip: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
  skew: [{ skewY: 20, y: 80, opacity: 0 }, { skewY: 0, y: 0, opacity: 1 }],
  flip: [{ rotationX: -80, transformPerspective: 600, opacity: 0 }, { rotationX: 0, opacity: 1 }],
}
export const SC_SPECIAL = ['pin', 'progress', 'counter', 'highlight', 'horizontal', 'colorShift', 'staggerList', 'parallax']
export const IMAGES = ['kenBurns', 'hoverZoom', 'tilt3d', 'revealMask', 'grayHover', 'spotlight', 'rgbSplit', 'slices', 'blurUp', 'crossfade']
export const VIDEOS = ['videoBg', 'hoverPlay', 'circleReveal', 'playInView', 'grayHoverVideo', 'videoTilt']
export const LANDING = ['heroSphere', 'heroParticles', 'heroParallax', 'marquee', 'stats', 'features', 'gallery', 'curtain', 'magneticCta', 'spotlightHero']
export const SHADER_IDS = ['plasma', 'waves', 'clouds', 'aurora', 'tunnel', 'ripple', 'voronoi', 'kaleido', 'meshGradient', 'grid', 'metaballs', 'warp']
export const LOTTIE_IDS = ['spinner', 'pulse', 'ripple', 'bounce', 'morph', 'dots', 'check', 'ring', 'bars']
// Durée par défaut (s) des presets médias
export const DUR: Record<string, number> = { kenBurns: 8, revealMask: 1.4, blurUp: 1.6, slices: 0.6, crossfade: 1.2, circleReveal: 1.8, rgbSplit: 1.2 }
// Réglage propre à certains presets médias
export const MEDIA_X: Record<string, { key: string; label: string; min: number; max: number; step: number; def: number }> = {
  kenBurns: { key: 'zoom', label: 'Zoom (+%)', min: 0.05, max: 0.6, step: 0.05, def: 0.25 },
  hoverZoom: { key: 'zoom', label: 'Zoom au survol (+%)', min: 0.05, max: 0.6, step: 0.05, def: 0.2 },
  tilt3d: { key: 'deg', label: 'Inclinaison max (°)', min: 4, max: 30, step: 1, def: 14 },
  videoTilt: { key: 'deg', label: 'Inclinaison max (°)', min: 4, max: 30, step: 1, def: 14 },
  spotlight: { key: 'spot', label: 'Rayon du spot (px)', min: 40, max: 220, step: 10, def: 100 },
  rgbSplit: { key: 'split', label: 'Décalage des canaux (px)', min: 2, max: 20, step: 1, def: 8 },
  slices: { key: 'slices', label: 'Nombre de tranches', min: 4, max: 16, step: 1, def: 8 },
  blurUp: { key: 'blur', label: 'Flou initial (px)', min: 4, max: 40, step: 2, def: 20 },
}
