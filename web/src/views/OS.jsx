import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from 'framer-motion'
import { Atmos, Words, Reveal, Magnetic, Close, EASE } from '../components/ui'
import { Trust, Day } from './Home'
import { DEMO_NOTES, FAQ, JOIN } from '../lib/content'

/* The device in a halo; a focus frame follows the pointer and only what is inside it is sharp. */
function Lens() {
  const reduce = useReducedMotion(), fw = .36, fh = .36
  const fx = useSpring(.13, { stiffness: 120, damping: 18 }), fy = useSpring(.38, { stiffness: 120, damping: 18 })
  const clip = useTransform([fx, fy], ([x, y]) => `inset(${y * 100}% ${(1 - x - fw) * 100}% ${(1 - y - fh) * 100}% ${x * 100}%)`)
  const left = useTransform(fx, x => `${x * 100}%`), top = useTransform(fy, y => `${y * 100}%`)
  const ref = useRef()
  return (
    <motion.div ref={ref} className="lens" aria-hidden="true" initial={reduce ? false : { opacity: 0, scale: .94, filter: 'blur(14px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.4, ease: EASE, delay: .3 }}
      onPointerMove={e => { if (reduce) return; const r = ref.current.getBoundingClientRect(); fx.set(Math.min(1.05 - fw, Math.max(-.05, (e.clientX - r.left) / r.width - fw / 2))); fy.set(Math.min(1 - fh, Math.max(0, (e.clientY - r.top) / r.height - fh / 2))) }}
      onPointerLeave={() => { fx.set(.13); fy.set(.38) }} data-focus>
      <motion.div className="halo" style={{ backgroundImage: 'url(assets/media/bg/halo.webp)' }} animate={reduce ? undefined : { rotate: [0, 6, 0], scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <img className="dev blur" src="assets/media/device-hero.webp" alt="" />
      <motion.img className="dev sharp" src="assets/media/device-hero.webp" alt="" style={{ clipPath: clip }} />
      <motion.div className="frame" style={{ left, top, width: `${fw * 100}%`, height: `${fh * 100}%` }} initial={reduce ? false : { scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, duration: 1, ease: EASE }}><i /><i /><i /><i /></motion.div>
    </motion.div>
  )
}

function Demo() {
  const reduce = useReducedMotion(), ref = useRef(), seen = useInView(ref, { once: true, amount: .3 })
  const [n, setN] = useState(0), [k, setK] = useState(0), [done, setDone] = useState(false), [sent, setSent] = useState({}), [yes, setYes] = useState(false)
  const note = DEMO_NOTES[n], len = note.say.reduce((a, p) => a + p[0].length, 0)
  useEffect(() => { setK(reduce ? len : 0); setDone(!!reduce); setSent({}); setYes(false) }, [n])
  useEffect(() => { if (!seen || done) return; if (k >= len) { setDone(true); return } const t = setTimeout(() => setK(x => Math.min(len, x + 2)), 22); return () => clearTimeout(t) }, [seen, k, done, len])
  let left = k
  return (
    <div ref={ref} className="demo">
      <div>
        <p className="m">Pick a note</p>
        <div className="chips" role="group" aria-label="Example notes">{DEMO_NOTES.map((d, i) => (
          <motion.button key={d.label} type="button" className={`chip${i === n ? ' on' : ''}`} aria-pressed={i === n} onClick={() => setN(i)} whileTap={{ scale: .95 }}>
            {i === n && <motion.span layoutId="chipbg" className="bg" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}{d.label}</motion.button>))}</div>
        <p className="m">What you said</p>
        <p className="ramble" aria-live="polite">{note.say.map(([t, f], i) => { if (left <= 0) return null; const s = t.slice(0, left); left -= s.length; return f ? <span key={i} className="f">{s}</span> : <span key={i}>{s}</span> })}{!done && <span className="cur" />}</p>
      </div>
      <div>
        <p className="m">What it made of it</p>
        <div className="results" aria-live="polite">
          <AnimatePresence>
            {done && note.ask && <motion.div key={`ask${n}`} className="ask" initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: .5, ease: EASE }}>
              <p>{note.ask}</p><Magnetic as="button" type="button" className={yes ? 'pill-sm' : 'pill-sm pill-line'} style={yes ? { background: 'var(--moon)', color: 'var(--night)' } : undefined} onClick={() => setYes(true)}>{yes ? 'Yes, him ✓' : 'Yes, him'}</Magnetic></motion.div>}
            {done && note.out.map(([kk, h, s, gate], j) => (
              <motion.div key={`${n}-${j}`} className={`res${gate ? ' gate' : ''}`} initial={{ opacity: 0, y: 24, rotate: j % 2 ? 4 : -4, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: .96 }}
                transition={{ type: 'spring', stiffness: 120, damping: 16, delay: (note.ask ? .4 : 0) + j * .18 }}>
                <p className="m k">{gate && sent[j] ? 'Sent · after your tap' : kk}</p><h4>{h}</h4><p>{s}</p>
                {gate && <div className="send"><Magnetic as="button" type="button" className="pill-sm pill-hot" style={sent[j] ? { background: 'var(--moon)', color: 'var(--night)' } : undefined} onClick={() => setSent(o => ({ ...o, [j]: true }))}>{sent[j] ? 'Sent ✓' : 'Send it'}</Magnetic></div>}
              </motion.div>))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const QIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.25" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.25c-.8.4-1.2.95-1.2 1.85" /><path d="M12 16.6v.01" /></svg>
function Faq() {
  const [open, setOpen] = useState(0), btns = useRef([])
  const key = (e, i) => { const n = { ArrowDown: (i + 1) % FAQ.length, ArrowUp: (i - 1 + FAQ.length) % FAQ.length, Home: 0, End: FAQ.length - 1 }[e.key]; if (n !== undefined) { e.preventDefault(); btns.current[n].focus() } }
  return (
    <section className="dark sec" id="faq" aria-labelledby="faq-h">
      <Atmos />
      <Reveal as="p" className="m" style={{ textAlign: 'center' }}>Questions</Reveal>
      <Words as="h2" className="h2" id="faq-h" style={{ textAlign: 'center' }} text="Frequently asked." inView />
      <div className="faq-list">{FAQ.map(([q, a], i) => (
        <Reveal key={q} delay={i * .05} y={16}><div className={`faq-item${open === i ? ' open' : ''}`}>
          <h3 style={{ fontWeight: 500 }}><button ref={el => btns.current[i] = el} type="button" aria-expanded={open === i} aria-controls={`faq-a${i}`} id={`faq-q${i}`} onClick={() => setOpen(o => o === i ? -1 : i)} onKeyDown={e => key(e, i)}>
            <QIcon /><span>{q}</span><motion.svg className="chev" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: .35, ease: EASE }} aria-hidden="true"><path d="m6 9 6 6 6-6" /></motion.svg></button></h3>
          <AnimatePresence initial={false}>{open === i && (
            <motion.div id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`} className="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .4, ease: EASE }}>
              {a.map(t => <p key={t}>{t}</p>)}</motion.div>)}</AnimatePresence>
        </div></Reveal>))}</div>
    </section>
  )
}

export default function OS() {
  return (
    <main id="main">
      <section className="lens-hero dark" aria-labelledby="os-h1">
        <Atmos plate="amber-horizon" />
        <div>
          <motion.p className="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Experiment 001 · Private alpha</motion.p>
          <h1 id="os-h1" className="display" style={{ marginTop: 18 }}><Words text="Unobvious OS" delay={.1} /></h1>
          <Reveal as="p" className="lede" delay={.5}>An assistant you talk to, not one you look at. Press once, say what’s on your mind, however messy, and put your phone away. It sorts it, handles what it can, and asks before anything leaves your hands.</Reveal>
          <Reveal className="ctas" delay={.7}><Magnetic className="pill-hot" href={JOIN}>Ask for early access</Magnetic><Magnetic className="pill-line" href="#os-demo" onClick={e => { e.preventDefault(); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }) }}>Try a messy note</Magnetic></Reveal>
        </div>
        <Lens />
      </section>
      <section className="dark sec" id="demo" aria-labelledby="demo-h">
        <Atmos plate="amber-window" dim />
        <div className="wrap">
          <Reveal as="p" className="m">Try it</Reveal><Words as="h2" className="h2" text="Say it messy. It gives you back the meaning." inView />
          <Reveal as="p" className="lede" delay={.2}>Pick a note. Filler and all, it comes out as a few clear things, and only what reaches another person waits for you.</Reveal>
          <Demo />
          <p className="m" style={{ marginTop: 22 }}>A simulated example. Nothing is sent anywhere.</p>
        </div>
      </section>
      <Trust /><Day /><Faq /><Close />
    </main>
  )
}
