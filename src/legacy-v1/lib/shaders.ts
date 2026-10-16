export const VERT = `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`

export const HEAD = `precision highp float;
varying vec2 vUv;
uniform float uTime, uScale, uIntensity;
uniform vec2 uRes, uMouse;
uniform vec3 uC1, uC2, uC3;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; } return v; }
`
// Corps de chaque shader : variables disponibles uv, p (centré, ratio corrigé), t (temps), col (résultat)
export const BODY: Record<string, string> = {
  plasma: `float v = sin(p.x*3.+t) + sin(p.y*3.+t*1.3) + sin((p.x+p.y)*3.+t*.7) + sin(length(p)*5.-t);
  col = mix(uC1, uC2, .5+.5*sin(v)); col = mix(col, uC3, .5+.5*sin(v*1.7));`,
  waves: `float w = sin(p.x*4.+t+sin(p.y*3.+t))*.5+.5;
  col = mix(uC1, uC2, smoothstep(.2,.8,w)); col += uC3*smoothstep(.9,1.,w)*.5;`,
  clouds: `float n = fbm(p*1.5+vec2(t*.2,t*.1));
  col = mix(uC1, uC2, n); col = mix(col, uC3, smoothstep(.55,.9,n));`,
  aurora: `float n = fbm(vec2(p.x*1.2, t*.2));
  float band = smoothstep(0., .8, sin(p.y*2.+n*4.+t*.5)*.5+.5);
  col = mix(uC1, uC2, band); col += uC3*pow(band, 3.);`,
  tunnel: `float r = length(p); float a = atan(p.y, p.x);
  float v = sin(1./(r+.05)*2.+t*2.+a*3.);
  col = mix(uC1, uC2, .5+.5*v); col *= smoothstep(0., .6, r); col += uC3*.04/(r+.1);`,
  ripple: `vec2 m = (uMouse-.5)*vec2(uRes.x/uRes.y, 1.)*uScale*2.;
  float d = length(p-m); float w = sin(d*12.-t*3.)*exp(-d*1.2);
  col = mix(uC1, uC2, .5+.5*w); col += uC3*pow(max(w, 0.), 2.);`,
  voronoi: `vec2 g = floor(p*2.); vec2 f = fract(p*2.); float md = 8.;
  for (int j = -1; j <= 1; j++) { for (int i = -1; i <= 1; i++) {
    vec2 b = vec2(float(i), float(j)); vec2 o = hash2(g+b); o = .5+.5*sin(t+6.28*o);
    float d = length(b+o-f); md = min(md, d); } }
  col = mix(uC1, uC2, md); col += uC3*smoothstep(.08, 0., abs(md-.35));`,
  kaleido: `float a = atan(p.y, p.x); float r = length(p);
  a = abs(mod(a, 1.0472) - .5236); vec2 q = r*vec2(cos(a), sin(a));
  float v = sin(q.x*6.+t) + sin(q.y*6.-t);
  col = mix(uC1, uC2, .5+.5*v); col = mix(col, uC3, smoothstep(.8, 1., .5+.5*sin(r*10.-t*2.)));`,
  meshGradient: `float a = sin(uv.x*3.+t)*.5+.5; float b = cos(uv.y*3.-t*.8)*.5+.5;
  col = mix(mix(uC1, uC2, a), uC3, b*.6);`,
  grid: `vec2 g = abs(fract(p*3.+vec2(0., t*.3))-.5); float l = smoothstep(.46, .5, max(g.x, g.y));
  col = mix(uC1, uC2, uv.y); col += uC3*l*.8;`,
  metaballs: `float s = 0.;
  for (int i = 0; i < 5; i++) { float fi = float(i); vec2 c = vec2(sin(t*.6+fi*1.7), cos(t*.5+fi*2.3))*.8; s += .12/length(p-c); }
  col = mix(uC1, uC2, smoothstep(.8, 1.2, s)); col += uC3*smoothstep(1.2, 2., s);`,
  warp: `vec2 q = vec2(fbm(p+t*.1), fbm(p+vec2(5.2,1.3)-t*.1)); float n = fbm(p+3.*q);
  col = mix(uC1, uC2, n); col = mix(col, uC3, length(q)*.6);`,
}
export const fragmentSource = (k: string) => `${HEAD}void main() {
  vec2 uv = vUv; float t = uTime;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * uScale * 2.0;
  vec3 col = vec3(0.0);
  ${BODY[k]}
  gl_FragColor = vec4(col * uIntensity, 1.0);
}`
