'use client'
import { useEffect, useMemo, useState } from 'react'
import { Lottie } from 'lottie-react'
import { lottieDoc } from '../lib/lottie'
import { defaultsFor } from '../lib/params'

export default function LottieFx({ p }: { p: any }) {
  const v: any = { ...defaultsFor('lottie', p), ...p }
  const [remote, setRemote] = useState<any>(null)
  useEffect(() => {
    if (!v.url) { setRemote(null); return }
    let ok = true
    fetch(v.url).then(r => r.json()).then(j => { if (ok) setRemote(j) }).catch(() => { if (ok) setRemote(null) })
    return () => { ok = false }
  }, [v.url])
  const data = useMemo(() => remote ?? lottieDoc(p.k, { color: v.color, stroke: v.stroke }), [remote, p.k, v.color, v.stroke])
  return <div className="grid size-full place-items-center"><Lottie src={data} loop={v.loop} speed={v.speed} style={{ width: v.size, height: v.size }} /></div>
}
