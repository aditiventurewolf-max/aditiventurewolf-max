import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { CAPTIONS, FRAGMENTS, NOTE, STATIONS, FLY_ORDER, JOIN } from '../lib/content'
import { S, span, lerp, ease, out, actOf } from '../lib/acts'
import { Magnetic, Words, EASE } from '../components/ui'
const Scene = lazy(() => import('./Scene'))

const NOTE_LEN = NOTE.reduce((a, p) => a + p[0].length, 0)
const TYPO = 'rohan proposl aftersch cat clth?? reel fellwshp dedline wait whre was'
const rnd = s => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }

function noteParts(n) { const out = []; let left = n; for (const [t, f] of NOTE) { if (left <= 0) break; const s = t.slice(0, left); left -= s.length; out.push([s, f]) } return out }

export default function Story() {
  const reduce = useReducedMotion()
  if (reduce) return <StaticStory />
  return <LiveStory />
}

function LiveStory() {
  const section = useRef(), stage = useRef()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: .35, restDelta: .0003 })
  const flags = useRef({ press: false, yes: false, send: false })
  const [act, setAct] = useState(0), [vis, setVis] = useState({}), [landed, setLanded] = useState({}), [typed, setTyped] = useState(0), [ui, setUi] = useState({ press: false, yes: false, send: false })
  const fragRefs = useRef([]), cardT = useRef({}), heroRef = useRef(), phoneRef = useRef(), phoneTxt = useRef(), silRef = useRef(), plates = useRef({})
  const geo = useRef({ W: 1, H: 1, narrow: false, chaos: [], target: {} })

  const frags = useMemo(() => { const R = rnd(19); return FRAGMENTS.map(([t, kind = 'noise', key = null]) => ({ t, kind, key, u: R(), v: R(), rot: (R() - .5) * 26, size: kind === 'key' ? 22 + R() * 10 : kind === 'filler' ? 16 + R() * 14 : 14 + R() * 20, appear: kind === 'key' ? R() * .25 : (R() < .4 ? -1 : R() * .7), wx: (R() - .5) * 16, wy: (R() - .5) * 14, wd: 4 + R() * 5 })) }, [])

  // measure the stage: where the chaos lives, where each thought lands
  useLayoutEffect(() => {
    const measure = () => {
      const sr = stage.current.getBoundingClientRect(), W = sr.width, H = sr.height, narrow = W < 861
      const cx = narrow ? W * .5 : W * .7, cy = narrow ? H * .74 : H * .5, rx = narrow ? W * .44 : W * .25, ry = narrow ? H * .2 : H * .38
      geo.current = { W, H, narrow, chaos: frags.map(f => { const a = f.u * 6.283, r = Math.sqrt(f.v); return { x: cx + Math.cos(a) * rx * r - 60, y: cy + Math.sin(a) * ry * r, fs: narrow ? f.size * .72 : f.size } }), target: {} }
      Object.entries(cardT.current).forEach(([k, el]) => { if (!el) return; const r = el.getBoundingClientRect(); geo.current.target[k] = { x: r.left - sr.left, y: r.top - sr.top + r.height / 2, fs: parseFloat(getComputedStyle(el).fontSize) } })
      render(p.get())
    }
    measure(); const ro = new ResizeObserver(measure); ro.observe(stage.current)
    document.fonts && document.fonts.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  // the continuous parts are written straight to the DOM; discrete parts go through state
  const render = v => {
    const [i, l] = actOf(v), g = geo.current; if (!g.chaos.length) return
    const pl = plates.current
    if (pl.w) { pl.w.style.opacity = 1 - span(v, S[2], S[3]); pl.d.style.opacity = .6 * span(v, S[2], S[3]) * (1 - span(v, S[5], S[5] + .06)); pl.h.style.opacity = span(v, S[5], S[5] + .08) }
    const h0 = i === 0 ? 1 - span(l, .3, .75) : 0
    if (heroRef.current) { heroRef.current.style.opacity = h0; heroRef.current.style.visibility = h0 < .01 ? 'hidden' : 'visible'; heroRef.current.style.filter = `blur(${((1 - h0) * 8).toFixed(1)}px)` }
    if (silRef.current) silRef.current.style.opacity = i === 0 ? .75 : i === 1 ? .75 * (1 - l) : 0
    frags.forEach((f, n) => {
      const el = fragRefs.current[n]; if (!el) return
      const a = g.chaos[n]; let x = a.x, y = a.y, rot = f.rot, sc = 1, op = 0, bl = 0
      if (i === 0) { const loud = f.appear < 0 ? .5 + .5 * span(l, .2, .5) : span(l, f.appear, f.appear + .15); op = loud * (f.kind === 'key' ? 1 : .75); bl = f.kind === 'notif' ? 0 : (1 - loud) * 6; sc = 1 + span(l, .4, 1) * .06 }
      else if (i <= 2) { op = f.kind === 'key' ? .55 : .2; bl = f.kind === 'key' ? 1.5 : 4; if (i === 1) { const t = out(l); op = lerp(f.kind === 'key' ? 1 : .75, op, t); bl = lerp(0, bl, t) } }
      else if (i === 3) {
        const b = f.key && g.target[f.key]
        if (b) { const ks = FLY_ORDER.indexOf(f.key), t2 = ease(span(l, .12 + ks * .1, .32 + ks * .1)); x = lerp(a.x, b.x, t2); y = lerp(a.y, b.y, t2); rot = lerp(f.rot, 0, t2); sc = lerp(1, b.fs / a.fs, t2); op = t2 < 1 ? lerp(.55, 1, span(t2, 0, .3)) : 0; bl = lerp(1.5, 0, t2) }
        else { const gg = span(l, .05, .5); op = .2 * (1 - gg); bl = 4 + gg * 14; y += gg * 40 }
      }
      el.style.opacity = op.toFixed(3); el.style.filter = bl > .05 ? `blur(${bl.toFixed(1)}px)` : 'none'
      el.style.fontSize = a.fs + 'px'; el.style.transform = `translate(${x.toFixed(1)}px,${(y - a.fs / 2).toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`
    })
    // the phone in your hand: typed into, given up on, turned face down
    const ph = phoneRef.current
    if (ph) { const pd = i === 0 ? span(l, .72, .95) : 1, vis = i === 0 ? span(l, .1, .25) * (1 - span(l, .9, 1)) : 0
      ph.style.opacity = vis; ph.style.transform = `translate(${(g.narrow ? g.W * .72 : g.W * .6) - 50}px,${(g.narrow ? g.H * .62 : g.H * .56) - 100}px) perspective(700px) rotateX(${pd * 180}deg)`
      const face = pd < .5; ph.style.background = face ? '' : '#0B0F12'; ph.style.boxShadow = face ? '' : '0 10px 30px rgba(0,0,0,.6)'
      if (phoneTxt.current) { phoneTxt.current.style.opacity = face ? 1 : 0; if (i === 0) phoneTxt.current.textContent = TYPO.slice(0, Math.round(span(l, .25, .7) * TYPO.length)) } }
    // discrete state, only when it changes
    setAct(a => a === i ? a : i)
    const nv = { press: i === 1 && l > .2 && l < .9, ask: i === 4 && l < .62, gate: i === 4 && l > .48, end: i === 5 && l > .25, coda: i === 5 && l > .6, cap: (i > 0 || l > .65) && !(i === 5 && l > .3), cue: i === 0 && l < .2 }
    setVis(o => Object.keys(nv).every(k => o[k] === nv[k]) ? o : nv)
    setTyped(t => { const n = i === 2 ? Math.round(span(l, .05, .72) * NOTE_LEN) : i > 2 ? NOTE_LEN : 0; return t === n ? t : n })
    setLanded(prev => { const next = {}; FLY_ORDER.forEach((k, ks) => { next[k] = i > 3 || (i === 3 && span(l, .12 + ks * .1, .32 + ks * .1) >= 1) }); return FLY_ORDER.every(k => prev[k] === next[k]) ? prev : next })
    const auto = { press: v > S[1] + (S[2] - S[1]) * .62, yes: (i === 4 && l > .4) || i === 5, send: (i === 4 && l > .9) || i === 5 }
    setUi(u => { const n = { press: flags.current.press || auto.press, yes: flags.current.yes || auto.yes, send: flags.current.send || auto.send }; return u.press === n.press && u.yes === n.yes && u.send === n.send ? u : n })
  }
  useMotionValueEvent(p, 'change', render)
  const tap = k => () => { flags.current[k] = true; render(p.get()) }
  const fadeAsk = vis.ask, fadeGate = vis.gate

  return (
    <section ref={section} className="story live" aria-label="How Unobvious OS works, told as one walk">
      <div ref={stage} className="stage dark">
        <div ref={el => plates.current.w = el} className="plate" style={{ backgroundImage: 'url(assets/media/bg/amber-window.webp)' }} aria-hidden="true" />
        <div ref={el => plates.current.d = el} className="plate" style={{ backgroundImage: 'url(assets/media/bg/amber-eclipse.webp)', opacity: 0 }} aria-hidden="true" />
        <div ref={el => plates.current.h = el} className="plate" style={{ backgroundImage: 'url(assets/media/bg/amber-horizon.webp)', opacity: 0 }} aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div ref={silRef} className="sil" aria-hidden="true" />
        <div className="frags" aria-hidden="true">{frags.map((f, n) => (
          <span key={n} ref={el => fragRefs.current[n] = el} className={`frag ${f.kind}`}>
            <motion.span style={{ display: 'inline-block' }} animate={{ x: [0, f.wx, 0], y: [0, f.wy, 0] }} transition={{ duration: f.wd, repeat: Infinity, ease: 'easeInOut' }}>{f.t}</motion.span>
          </span>))}</div>
        <div ref={phoneRef} className="phone2d" aria-hidden="true"><div ref={phoneTxt} className="txt" /></div>

        <Suspense fallback={null}><Scene p={p} flags={flags} /></Suspense>

        <div ref={heroRef} className="hero-copy">
          <motion.p className="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Unobvious · a lab in Bengaluru</motion.p>
          <h1 className="display"><Words text="You think." delay={.15} /><br /><Words text="It handles the rest." delay={.45} soft /></h1>
          <motion.p className="lede" initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.1, ease: EASE, delay: .9 }}>Your head is busy. Unobvious OS is a quiet system behind one button: say it messy, and it sorts it, gets it done, and asks before anything leaves your hands.</motion.p>
          <motion.div className="ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 1.1 }}>
            <Magnetic className="pill-hot" href={JOIN}>Ask for early access</Magnetic><Magnetic className="pill-line" href="#os">See Unobvious OS</Magnetic></motion.div>
        </div>

        {/* act 1: press */}
        <AnimatePresence>{vis.press && (
          <motion.div className="pressbtn" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: .5, ease: EASE }}>
            <Magnetic as="button" className="pill-hot" type="button" onClick={tap('press')}>
              <AnimatePresence mode="wait" initial={false}><motion.span key={ui.press ? 'l' : 'p'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{ui.press ? 'Listening…' : 'Press to speak'}</motion.span></AnimatePresence>
            </Magnetic>
          </motion.div>)}</AnimatePresence>

        {/* act 2: the spoken note */}
        <AnimatePresence>{act === 2 && (
          <motion.p className="say" aria-hidden="true" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: .6 }}>
            {noteParts(typed).map(([s, f], n) => f ? <span key={n} className="f">{s}</span> : <span key={n}>{s}</span>)}<span className="cur" />
          </motion.p>)}</AnimatePresence>

        {/* act 3–4: the system */}
        <motion.div className="map" aria-hidden="true" animate={{ opacity: act === 3 || act === 4 ? 1 : 0, scale: act === 5 ? .96 : 1 }} transition={{ duration: .6, ease: EASE }}>
          {STATIONS.map(st => (
            <div key={st.id} className={`st st-${st.id}${st.cards.some(c => landed[c.k]) ? ' on' : ''}`}>
              <p className="lbl m"><b />{st.label}</p>
              {st.cards.map(c => (
                <motion.div key={c.k} layout className={`card${c.wait && !ui.send ? ' wait' : ''}`}
                  initial={false} animate={{ opacity: landed[c.k] ? (fadeGate && c.k !== 'proposal' ? .4 : 1) : 0, y: landed[c.k] ? 0 : 8 }} transition={{ duration: .45, ease: EASE }}>
                  <p className="k m">{c.k === 'proposal' && ui.send ? 'Sent · after your tap' : c.tag}</p>
                  <p className="t" ref={el => cardT.current[c.k] = el}>{c.t}</p>{c.s && <p className="s">{c.s}</p>}
                </motion.div>))}
            </div>))}
          <motion.div className="st st-quiet" animate={{ opacity: act === 3 ? 1 : 0 }}><p className="lbl m"><b />Also in the system</p><div className="chips2"><span>Errands</span><span>Reading</span><span>Learning</span><span>Care</span></div></motion.div>
        </motion.div>

        {/* act 4: one question, then the gate */}
        <AnimatePresence>{fadeAsk && (
          <motion.div className="askq" style={{ x: '-50%' }} initial={{ opacity: 0, y: -12, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }} transition={{ duration: .5, ease: EASE }}>
            <p>“That guy from the maker thing” — Rohan from yesterday’s meetup?</p>
            <Magnetic as="button" type="button" className={ui.yes ? 'pill-sm' : 'pill-sm pill-line'} style={ui.yes ? { background: 'var(--moon)', color: 'var(--night)' } : undefined} onClick={tap('yes')}>{ui.yes ? 'Yes, him ✓' : 'Yes, him'}</Magnetic>
          </motion.div>)}</AnimatePresence>
        <AnimatePresence>{fadeGate && (
          <motion.div className="gate" style={{ x: '-50%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .5, ease: EASE }}>
            <p className="m">Only this one reaches another person</p>
            <motion.div className="line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .9, ease: EASE }} />
            <Magnetic as="button" type="button" className="pill-hot" style={ui.send ? { background: 'var(--moon)', color: 'var(--night)' } : undefined} onClick={tap('send')}>
              <AnimatePresence mode="wait" initial={false}><motion.span key={ui.send ? 's' : 'n'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{ui.send ? 'Sent ✓' : 'Send it'}</motion.span></AnimatePresence>
            </Magnetic>
          </motion.div>)}</AnimatePresence>

        {/* act 5: quiet */}
        <AnimatePresence>{vis.end && (
          <motion.div className="end" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="display"><Words text="Then it goes quiet." /><br /><Words text="And you look up." delay={.5} soft /></p>
          </motion.div>)}</AnimatePresence>
        <AnimatePresence>{vis.coda && (
          <motion.div className="coda" aria-hidden="true" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
            <p className="m">Sunday · Unobvious</p><p>Want to film the reel? Your hook’s ready: “how messy my head is.”</p>
          </motion.div>)}</AnimatePresence>

        {/* chrome */}
        <AnimatePresence mode="wait">{vis.cap && (
          <motion.p key={act} className="cap" initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }} transition={{ duration: .55, ease: EASE }}>
            <span className="n m">0{act}</span><span className="t">{CAPTIONS[act]}</span></motion.p>)}</AnimatePresence>
        <AnimatePresence>{act >= 2 && act <= 4 && <motion.p className="sim m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Simulated example</motion.p>}</AnimatePresence>
        <div className="progress" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map(n => <motion.span key={n} className={n === act ? 'on' : ''} animate={{ scale: n === act ? 1.5 : 1 }} />)}</div>
        <AnimatePresence>{vis.cue && <motion.div className="cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.6 }}>
          <span className="m">Scroll · follow one thought</span><motion.i animate={{ scaleY: [0, 1, 0], originY: 0 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} /></motion.div>}</AnimatePresence>
      </div>
      <StaticStory hidden />
    </section>
  )
}

export function StaticStory({ hidden }) {
  return (
    <div className={hidden ? 'vh' : 'story-static dark'}>
      {!hidden && <div className="grain" aria-hidden="true" />}
      {!hidden && <><p className="m">Unobvious · a lab in Bengaluru</p><h1 className="display" style={{ marginTop: 18 }}>You think. <span className="soft">It handles the rest.</span></h1>
        <div className="ctas"><a className="pill pill-hot" href={JOIN}>Ask for early access</a><a className="pill pill-line" href="#os">See Unobvious OS</a></div></>}
      <p className="m" style={{ marginTop: hidden ? 0 : 72 }}>How it works · a simulated example</p>
      <h2 className="h2">Say it messy. It gives you back the meaning.</h2>
      <p className="quote">{NOTE.map(n => n[0]).join('')}</p>
      <ol>
        <li><p className="m">Messages · waits for you</p><h3>After-school proposal for Rohan</h3><p>It works out who “that guy” is, drafts it from your notes, and sends nothing until you say so.</p></li>
        <li><p className="m">Ideas · saved</p><h3>Functional cat clothing</h3><p>A new idea, saved for research later. Nothing else happens.</p></li>
        <li><p className="m">Planner · a nudge</p><h3>Film the reel</h3><p>A gentle prompt on Sunday, with your own line as the hook.</p></li>
        <li><p className="m">Planner · calendar</p><h3>Fellowship deadline</h3><p>On your calendar with writing time and a reminder.</p></li>
      </ol>
      <p className="lede">Then it goes quiet, and you look up.</p>
    </div>
  )
}
