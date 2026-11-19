import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { Nav, Footer, FocusCursor, EASE } from './components/ui'
import Home from './views/Home'
import OS from './views/OS'
import About from './views/About'
import Legal from './views/Legal'

const ROUTES = ['', 'os', 'about', 'privacy', 'terms']
const readRoute = () => { const h = location.hash.replace('#', ''); return ROUTES.includes(h) ? h : '' }
const TITLES = { '': 'Unobvious · You think. It handles the rest.', os: 'Unobvious OS · An assistant you talk to, not look at', about: 'About · Unobvious', privacy: 'Privacy Policy · Unobvious', terms: 'Terms of Service · Unobvious' }

export default function App() {
  const reduce = useReducedMotion()
  const [route, setRoute] = useState(readRoute)
  // smooth scroll (off when the visitor prefers less motion)
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    window.__lenis = lenis; let raf
    const loop = t => { lenis.raf(t); raf = requestAnimationFrame(loop) }; raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null }
  }, [reduce])
  useEffect(() => { const on = () => setRoute(readRoute()); addEventListener('hashchange', on); return () => removeEventListener('hashchange', on) }, [])
  useEffect(() => { document.title = TITLES[route]; (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)) }, [route])
  const go = useCallback(r => e => { e.preventDefault(); if (r === route) { window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0 }); return } location.hash = r; setRoute(r) }, [route])
  const View = { '': Home, os: OS, about: About, privacy: () => <Legal which="privacy" />, terms: () => <Legal which="terms" /> }[route]
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus?.(); document.getElementById('main')?.scrollIntoView() }}>Skip to content</a>
      <FocusCursor />
      <Nav route={route} go={go} />
      <AnimatePresence mode="wait">
        <motion.div key={route} initial={{ opacity: 0, filter: 'blur(14px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(14px)' }} transition={{ duration: .6, ease: EASE }}
          onAnimationComplete={() => { document.querySelector('.page')?.style && (document.querySelector('.page').style.filter = 'none') }} className="page">
          <View />
        </motion.div>
      </AnimatePresence>
      <Footer go={go} />
    </MotionConfig>
  )
}
