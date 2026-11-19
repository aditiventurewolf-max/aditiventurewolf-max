import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import Story from '../story/Story'
import { Atmos, Words, Reveal, Settle, Close } from '../components/ui'
import { DAY, LAB } from '../lib/content'

const lum = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4)).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0)
const contrast = (fg, bgs) => Math.min(...bgs.map(b => { const a = lum(fg), c = lum(b); return (Math.max(a, c) + .05) / (Math.min(a, c) + .05) }))

export function Trust() {
  return (
    <section className="light sec" aria-labelledby="ask-h">
      <Atmos plate="paper-glow" />
      <div className="wrap two">
        <div><Reveal as="p" className="m">Trust</Reveal><Words as="h2" className="h2" text="It asks before it acts." inView />
          <Reveal as="p" className="lede" delay={.2}>Sorting, saving and protecting your time happen quietly. Anything that reaches another person waits for one tap from you. It listens only while you press.</Reveal></div>
        <div className="lists">
          {[['Does quietly', ['Sorts what you say', 'Saves ideas for later', 'Nudges you at the right time', 'Protects your rest']], ['Waits for your tap', ['Messages and email', 'Shared calendar invites', 'Any purchase or payment']]].map(([h, items], c) => (
            <div key={h}><Reveal as="h3" className="m" delay={c * .1}>{h}</Reveal><ul>{items.map((t, n) => <Reveal as="li" key={t} delay={.15 + c * .1 + n * .07} y={14}>{t}</Reveal>)}</ul></div>))}
        </div>
      </div>
    </section>
  )
}

function Tile({ d, i }) {
  const reduce = useReducedMotion(), mx = useMotionValue(.5), my = useMotionValue(.5)
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 }), ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 })
  const shine = useTransform([mx, my], ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.55), transparent 55%)`)
  return (
    <Settle i={i}>
      <motion.article className={`tile ${d.cls}`} style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height) }}
        onPointerLeave={() => { mx.set(.5); my.set(.5) }} whileHover={reduce ? undefined : { y: -6 }}>
        {!reduce && <motion.div className="shine" style={{ background: shine }} />}
        <p className="m cr">◐ {contrast(d.fg, d.bg).toFixed(2)}:1</p><h3>{d.h}</h3><p>{d.p}</p>
      </motion.article>
    </Settle>
  )
}

export function Day() {
  return (
    <section className="dark sec" aria-labelledby="day-h">
      <Atmos plate="amber-eclipse" dim />
      <div className="wrap">
        <Reveal as="p" className="m">Through the day</Reveal><Words as="h2" className="h2" text="Same button. Different light." inView />
        <div className="tiles">{DAY.map((d, i) => <Tile key={d.h} d={d} i={i} />)}</div>
        <Reveal as="p" className="m" style={{ marginTop: 22 }}>Each tile shows its own text contrast, measured.</Reveal>
      </div>
    </section>
  )
}

function Lab() {
  return (
    <section className="dark sec" aria-labelledby="lab-h">
      <Atmos />
      <div className="wrap">
        <Reveal as="p" className="m">The lab</Reveal><Words as="h2" className="h2" text="One system. More rooms coming." inView />
        <Reveal as="p" className="lede" delay={.2}>Unobvious is a lab. Everything we make plugs into the same quiet system, so it gets more useful without asking more of you. Some of these are still just notes.</Reveal>
        <div className="lab-grid">{LAB.map((s, i) => (
          <Settle key={s.h} i={i} className={`station${s.live ? '' : ' quiet'}`} whileHover={{ borderColor: 'rgba(255,191,101,.7)', y: -4 }}>
            <motion.span className="dot" animate={s.live ? { scale: [1, 1.35, 1], opacity: [1, .7, 1] } : undefined} transition={{ duration: 2.4, repeat: Infinity }} />
            <div><h3>{s.h}</h3><p>{s.p}</p></div>
          </Settle>))}</div>
      </div>
    </section>
  )
}

export default function Home() {
  return <main id="main"><Story /><Trust /><Day /><Lab /><Close /></main>
}
