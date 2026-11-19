import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { JOIN, EMAIL, NAV } from '../lib/content'

export const EASE = [.16, 1, .3, 1]

export const Mark = ({ size = 22 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square"><path d="M8 22V8h14M42 8h14v14M56 42v14H42M22 56H8V42" /></g>
    <circle cx="32" cy="32" r="9" fill="#FFBF65" />
  </svg>
)

export const Atmos = ({ plate, dim, children }) => (<>
  {plate && <div className="plate" style={{ backgroundImage: `url(assets/media/bg/${plate}.webp)`, opacity: dim ? .5 : 1 }} aria-hidden="true" />}
  <div className="grain" aria-hidden="true" />{children}</>)

/* A pill that leans toward the pointer and presses in. */
export function Magnetic({ as = 'a', className = '', children, strength = .28, ...rest }) {
  const ref = useRef(), reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 260, damping: 18 }), y = useSpring(0, { stiffness: 260, damping: 18 })
  const C = as === 'button' ? motion.button : motion.a
  return (
    <C ref={ref} className={`pill ${className}`} style={{ x, y }}
      onPointerMove={e => { if (reduce || e.pointerType !== 'mouse') return; const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength) }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      whileHover={reduce ? undefined : { scale: 1.04, boxShadow: className.includes('hot') ? '0 14px 44px rgba(255,191,101,.38)' : 'none' }}
      whileTap={{ scale: .96 }} {...rest}>{children}</C>
  )
}

/* Words arrive out of focus and settle into place. */
export function Words({ text, as = 'span', className = '', delay = 0, stagger = .05, inView = false, soft = false, ...rest }) {
  const ref = useRef(), seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' }), reduce = useReducedMotion()
  const go = inView ? seen : true
  const T = motion[as]
  return (
    <T ref={ref} className={className} aria-label={text} {...rest}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className={`word${soft ? ' soft' : ''}`} aria-hidden="true"
          initial={reduce ? false : { opacity: 0, y: '.35em', filter: 'blur(10px)' }}
          animate={go ? { opacity: 1, y: 0, filter: soft ? 'blur(1.6px)' : 'blur(0px)' } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}>{w}{' '}</motion.span>
      ))}
    </T>
  )
}

/* Anything that should blur into focus as it enters. */
export const Reveal = ({ children, delay = 0, y = 28, className = '', as = 'div', ...rest }) => {
  const reduce = useReducedMotion(); const T = motion[as]
  return <T className={className} initial={reduce ? false : { opacity: 0, y, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 1.1, ease: EASE, delay }} {...rest}>{children}</T>
}

/* Chaos settles into clarity: starts scattered, lands in place. */
export const Settle = ({ children, i = 0, className = '', style, ...rest }) => {
  const reduce = useReducedMotion(); const r = [[-30, 40, -6], [20, -30, 5], [-24, 50, 4], [30, -20, -5]][i % 4]
  return <motion.div className={className} style={style} initial={reduce ? false : { x: r[0], y: r[1], rotate: r[2], opacity: .4, filter: 'blur(8px)' }}
    whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1, filter: 'blur(0px)' }} viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ type: 'spring', stiffness: 70, damping: 16, delay: i * .08 }} {...rest}>{children}</motion.div>
}

/* The Focus mark as a cursor: brackets snap around whatever you're about to press. */
export function FocusCursor() {
  const reduce = useReducedMotion(), [on, setOn] = useState(false)
  const x = useSpring(-100, { stiffness: 520, damping: 40 }), y = useSpring(-100, { stiffness: 520, damping: 40 })
  const w = useSpring(26, { stiffness: 380, damping: 32 }), h = useSpring(26, { stiffness: 380, damping: 32 })
  useEffect(() => {
    if (reduce || !matchMedia('(hover:hover) and (pointer:fine)').matches) return
    setOn(true)
    const move = e => {
      const t = e.target.closest && e.target.closest('a,button,[data-focus]')
      if (t) { const r = t.getBoundingClientRect(); x.set(r.left - 6); y.set(r.top - 6); w.set(r.width + 12); h.set(r.height + 12) }
      else { x.set(e.clientX - 13); y.set(e.clientY - 13); w.set(26); h.set(26) }
    }
    addEventListener('pointermove', move, { passive: true }); return () => removeEventListener('pointermove', move)
  }, [reduce])
  if (!on) return null
  return <motion.div className="fcursor" style={{ x, y, width: w, height: h }} aria-hidden="true"><i /><i /><i /><i /><b /></motion.div>
}

export function Nav({ route, go }) {
  const [open, setOpen] = useState(false), { scrollY } = useScroll(), [hide, setHide] = useState(false)
  useEffect(() => scrollY.on('change', v => { const prev = scrollY.getPrevious() ?? 0; setHide(v > 300 && v > prev) }), [scrollY])
  useEffect(() => setOpen(false), [route])
  return (<>
    <motion.header className="nav" animate={{ y: hide && !open ? -80 : 0 }} transition={{ duration: .5, ease: EASE }}>
      <a className="brand" href="#" onClick={go('')} aria-label="Unobvious, home"><Mark />Unobvious</a>
      <nav aria-label="Main"><ul>{NAV.map(([r, l]) => <li key={r}><a href={`#${r}`} onClick={go(r)} aria-current={route === r ? 'page' : undefined}>{l}{route === r && <motion.span layoutId="navbar" className="bar" />}</a></li>)}</ul></nav>
      <Magnetic className="pill-hot pill-sm" href={JOIN}>Early access</Magnetic>
      <button className="burger" type="button" aria-expanded={open} aria-controls="mmenu" onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'Menu'}</button>
    </motion.header>
    <AnimatePresence>{open && (
      <motion.nav id="mmenu" className="mmenu" aria-label="Menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .35, ease: EASE }}>
        {NAV.map(([r, l], i) => <motion.a key={r} href={`#${r}`} onClick={go(r)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 + i * .05 }}>{l}</motion.a>)}
        <a href={JOIN}>Early access</a>
      </motion.nav>)}</AnimatePresence>
  </>)
}

export const Close = () => (
  <section className="close dark" aria-labelledby="close-h">
    <Atmos plate="amber-horizon" />
    <div className="wrap close-row">
      <div><Words as="h2" className="h2" text="Want an early look?" inView /><Reveal as="p" className="m" delay={.2}>Private alpha · small on purpose · {EMAIL}</Reveal></div>
      <Reveal className="ctas" delay={.3}><Magnetic className="pill-hot" href={JOIN}>Ask for early access</Magnetic><Magnetic className="pill-line" href="#about">About the lab</Magnetic></Reveal>
    </div>
  </section>
)

export function Footer({ go }) {
  const ref = useRef(), { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(14px)', 'blur(0px)']), yy = useTransform(scrollYProgress, [0, 1], ['40%', '16%'])
  const reduce = useReducedMotion()
  return (
    <footer ref={ref} className="dark">
      <div className="wrap">
        <div className="foot"><div><a className="brand" href="#" onClick={go('')}><Mark />Unobvious</a><p>An independent lab in Bengaluru. Quiet technology that takes the mess in your head and gives you back the meaning.</p></div>
          <nav aria-label="Footer"><ul>{[...NAV, ['privacy', 'Privacy'], ['terms', 'Terms']].map(([r, l]) => <li key={r}><a href={`#${r}`} onClick={go(r)}>{l}</a></li>)}<li><a href={JOIN}>Contact</a></li></ul></nav></div>
        <div className="strip m"><span>© 2026 Avaia Innovations (OPC) Private Limited</span><span>Bengaluru · 12.97° N 77.59° E</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}>Back to top ↑</button></div>
      </div>
      <motion.p className="bigword" aria-hidden="true" style={reduce ? undefined : { filter: blur, y: yy }}>Unobvious</motion.p>
    </footer>
  )
}
