import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Atmos, Words, Reveal, Close } from '../components/ui'
import { MANIFESTO, EMAIL } from '../lib/content'

/* One word of the manifesto: scattered and blurred until your reading reaches it. */
function W({ w, i, n, p, k, key2 }) {
  const a = i / n, b = Math.min(1, a + .08)
  const x = useTransform(p, [a, b], [k.x, 0]), y = useTransform(p, [a, b], [k.y, 0]), r = useTransform(p, [a, b], [k.r, 0])
  const o = useTransform(p, [a, b], [.18, 1]), f = useTransform(p, [a, b], ['blur(6px)', 'blur(0px)'])
  return <motion.span className={`word${key2 ? ' key' : ''}`} style={{ x, y, rotate: r, opacity: o, filter: f }}>{w}&nbsp;</motion.span>
}

function Manifesto() {
  const ref = useRef(), reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const words = useMemo(() => { let s = 7; const R = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
    return MANIFESTO.map(par => { const key = par.startsWith('*'); return { key, w: par.replace(/^\*/, '').split(' ').map(w => ({ w, k: { x: (R() - .5) * 120, y: (R() - .5) * 70, r: (R() - .5) * 26 } })) } }) }, [])
  const total = words.reduce((a, p) => a + p.w.length, 0); let idx = 0
  return (
    <div ref={ref} className="manif">
      {words.map((par, pi) => <p key={pi} className={par.key ? 'key' : ''}>{par.w.map((o, wi) => { const i = idx++; return reduce ? <span key={wi}>{o.w} </span> : <W key={wi} w={o.w} i={i} n={total} p={scrollYProgress} k={o.k} key2={par.key} /> })}</p>)}
    </div>
  )
}

export default function About() {
  return (
    <main id="main">
      <section className="dark sec" style={{ paddingTop: 170 }} aria-labelledby="about-h">
        <Atmos plate="amber-horizon" dim />
        <div className="wrap">
          <Reveal as="p" className="m">About</Reveal>
          <h1 id="about-h" className="display" style={{ marginTop: 18, maxWidth: '12em' }}><Words text="Built for the people the giants won’t build for." stagger={.06} /></h1>
          <Reveal as="p" className="lede" delay={.6}>Unobvious is an independent lab in Bengaluru, run by Aditi, making quiet technology that takes the mess in your head and gives you back the meaning.</Reveal>
        </div>
      </section>
      <section className="dark sec" aria-label="Why we are building the Unobvious">
        <Atmos />
        <div className="wrap">
          <p className="m" style={{ marginBottom: 28 }}>Why we are building the Unobvious · it started as scattered notes</p>
          <Manifesto />
          <dl className="facts">{[['Studio', 'Unobvious'], ['Founder', 'Aditi'], ['Based in', 'Bengaluru, Karnataka, India'], ['Legal entity', 'Avaia Innovations (OPC) Private Limited'], ['Contact', EMAIL]].map(([a, b], i) =>
            <Reveal key={a} delay={i * .06} y={12}><div><dt>{a}</dt><dd>{b}</dd></div></Reveal>)}</dl>
        </div>
      </section>
      <Close />
    </main>
  )
}
