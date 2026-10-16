// Mini constructeur d'animations Lottie : aucune dépendance de fichier, tout est généré ici.
type V = { color?: string; stroke?: number }
const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
const S = (k: any) => ({ a: 0, k })
const ez = (n: number) => ({ i: { x: Array(n).fill(0.667), y: Array(n).fill(1) }, o: { x: Array(n).fill(0.333), y: Array(n).fill(0) } })
const A = (fr: [number, number | number[]][]) => ({ a: 1, k: fr.map(([t, s], i) => { const sv = Array.isArray(s) ? s : [s]; return i < fr.length - 1 ? { t, s: sv, ...ez(sv.length) } : { t, s: sv } }) })
const tr = (o: any = {}) => ({ ty: 'tr', p: S([0, 0]), a: S([0, 0]), s: S([100, 100]), r: S(0), o: S(100), ...o })
const fl = (c: string) => ({ ty: 'fl', c: S([...rgb(c), 1]), o: S(100), r: 1 })
const st = (c: string, w: number, o = 100) => ({ ty: 'st', c: S([...rgb(c), 1]), o: S(o), w: S(w), lc: 2, lj: 2 })
const el = (d: number) => ({ ty: 'el', d: 1, s: S([d, d]), p: S([0, 0]) })
const tm = (e: any, o: any = S(0)) => ({ ty: 'tm', s: S(0), e, o, m: 1 })
const gr = (it: any[], t: any = {}) => ({ ty: 'gr', it: [...it, tr(t)] })
const layer = (shapes: any[], ks: any = {}) => ({ ty: 4, nm: 'layer', ip: 0, op: 120, st: 0, sr: 1, ddd: 0, ks: { o: S(100), r: S(0), p: S([100, 100, 0]), a: S([0, 0, 0]), s: S([100, 100, 100]), ...ks }, shapes })
const rc = (s: any, p: any, r: number) => ({ ty: 'rc', d: 1, s, p, r: S(r) })

const P: Record<string, (c: string, w: number) => any[]> = {
  spinner: (c, w) => [layer([gr([el(80), st(c, w), tm(A([[0, 5], [60, 60], [120, 5]]), A([[0, 0], [120, 360]]))])])],
  pulse: c => [layer([gr([el(60), fl(c)])], { s: A([[0, [80, 80, 100]], [60, [120, 120, 100]], [120, [80, 80, 100]]]), o: A([[0, 100], [60, 60], [120, 100]]) })],
  ripple: (c, w) => [layer([gr([el(100), st(c, w)])], { s: A([[0, [10, 10, 100]], [120, [100, 100, 100]]]), o: A([[0, 100], [120, 0]]) }), layer([gr([el(14), fl(c)])])],
  bounce: c => [layer([gr([el(36), fl(c)])], {
    p: A([[0, [100, 50, 0]], [40, [100, 150, 0]], [60, [100, 150, 0]], [120, [100, 50, 0]]]),
    s: A([[0, [100, 100, 100]], [38, [100, 100, 100]], [45, [130, 70, 100]], [60, [100, 100, 100]], [120, [100, 100, 100]]]),
  })],
  morph: c => [layer([gr([{ ...rc(S([70, 70]), S([0, 0]), 0), r: A([[0, 0], [60, 35], [120, 0]]) }, fl(c)])], { r: A([[0, 0], [120, 180]]) })],
  dots: c => [layer([-40, 0, 40].map((x, i) => { const d = i * 12; return gr([el(28), fl(c)], { p: S([x, 0]), s: A([[d, [60, 60]], [d + 30, [130, 130]], [d + 60, [60, 60]], [120, [60, 60]]]) }) }))],
  check: (c, w) => [layer([
    gr([el(100), st(c, w), tm(A([[0, 0], [40, 100], [120, 100]]))]),
    gr([{ ty: 'sh', ks: S({ i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-22, 2], [-6, 18], [24, -16]], c: false }) }, st(c, w), tm(A([[30, 0], [70, 100], [120, 100]]))]),
  ])],
  ring: (c, w) => [layer([gr([el(110), st('#ffffff', w, 15)]), gr([el(110), st(c, w), tm(A([[0, 0], [90, 100], [120, 100]]))])], { r: S(-90) })],
  bars: c => [layer([-45, -15, 15, 45].map((x, i) => { const d = i * 10; return gr([rc(A([[d, [18, 30]], [d + 30, [18, 110]], [d + 60, [18, 30]], [120, [18, 30]]]), A([[d, [x, 35]], [d + 30, [x, -5]], [d + 60, [x, 35]], [120, [x, 35]]]), 9), fl(c)]) }))],
}
export const lottieDoc = (k: string, v: V = {}) => ({
  v: '5.7.0', fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: k, ddd: 0, assets: [],
  layers: P[k](v.color ?? '#8b5cf6', v.stroke ?? 8).map((l, i) => ({ ...l, ind: i + 1 })),
})
