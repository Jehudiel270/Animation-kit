// Image de démonstration générée en SVG (aucun fichier à héberger) et vidéo libre de droits par défaut.
export const art = (h = 260, h2 = 320) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},80%,55%)'/><stop offset='1' stop-color='hsl(${h2},85%,40%)'/></linearGradient></defs><rect width='800' height='500' fill='url(#g)'/><circle cx='620' cy='140' r='90' fill='hsl(${h + 40},90%,70%)' opacity='.8'/><path d='M0 400 Q200 300 400 380 T800 340 V500 H0Z' fill='hsl(${h2},60%,25%)' opacity='.8'/><path d='M0 450 Q250 380 500 440 T800 410 V500 H0Z' fill='hsl(${h},50%,15%)'/></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
export const VIDEO_DEFAULT = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
