import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { S, span, ease, out, lerp } from '../lib/acts'

/* The wrist companion, built from primitives (a stand-in until the real CAD exists). Units: ~40 wide. */
function knitTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d')
  g.fillStyle = '#55575c'; g.fillRect(0, 0, 256, 256)
  for (let y = 0; y < 256; y += 4) for (let x = 0; x < 256; x += 8) { const v = 82 + Math.sin(x * .9 + y * .3) * 10 + (Math.random() - .5) * 22; g.fillStyle = `rgb(${v},${v + 1},${v + 5})`; g.fillRect(x, y, 7, 3) }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 10); t.colorSpace = THREE.SRGBColorSpace; return t
}

function Device({ p, flags }) {
  const group = useRef(), btn = useRef(), led = useRef(), rings = useRef([])
  const { viewport } = useThree()
  const strap = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([[0, 16, -3], [0, 27, -11], [0, 27.5, -25], [0, 17, -36], [0, -1, -40], [0, -19, -34], [0, -27.5, -21], [0, -25, -8], [0, -14, -3], [0, 0, -4.2]].map(a => new THREE.Vector3(...a)), true, 'catmullrom', .5)
    const sh = new THREE.Shape(), w = 11, t = 1.3; sh.moveTo(-w, -t); sh.lineTo(w, -t); sh.lineTo(w, t); sh.lineTo(-w, t); sh.lineTo(-w, -t)
    return new THREE.ExtrudeGeometry(sh, { steps: 260, extrudePath: path, bevelEnabled: false })
  }, [])
  const knit = useMemo(knitTexture, [])
  const narrow = viewport.aspect < .9

  useFrame((state, dt) => {
    const v = p.get(), g = group.current; if (!g) return
    let i = 0; while (i < 5 && v >= S[i + 1]) i++; const l = span(v, S[i], S[i + 1])
    const left = narrow ? { x: -viewport.width * .22, y: -viewport.height * .2, s: .45 } : { x: -viewport.width * .3, y: -viewport.height * .2, s: .42 }
    let x = 0, y = 0, s = 0, ry = -.35, rx = .12
    if (i === 1) { const e = out(span(l, 0, .5)); s = lerp(.55, 1, e); ry = lerp(-1.4, -.35, e); y = lerp(-.4, 0, e) }
    else if (i === 2) { const m = ease(span(l, 0, .4)); s = lerp(1, left.s, m); x = lerp(0, left.x, m); y = lerp(0, left.y, m); ry = lerp(-.35, -.7, m) }
    else if (i === 3 || i === 4) { s = left.s; x = left.x; y = left.y; ry = -.7 + Math.sin(state.clock.elapsedTime * .3) * .05 }
    else if (i === 5) { const m = out(span(l, 0, .5)); s = lerp(left.s, .5, m) * (1 - span(l, .7, 1)); x = lerp(left.x, 0, m); y = lerp(left.y, -viewport.height * .26, m); ry = lerp(-.7, 0, m); rx = lerp(.12, .3, m) }
    const k = 1 - Math.exp(-dt * 8)
    g.position.x += (x - g.position.x) * k; g.position.y += (y - g.position.y) * k
    const fit = Math.min(1, viewport.width / 3.6), sc = g.scale.x + (s * .034 * fit - g.scale.x) * k; g.scale.setScalar(Math.max(sc, .0001))
    g.rotation.y += (ry - g.rotation.y) * k; g.rotation.x += (rx - g.rotation.x) * k
    g.visible = sc > .001
    // the press: button sinks, light wakes, rings ripple out
    const pressed = (flags.current.press || v > S[1] + (S[2] - S[1]) * .62) && i >= 1 && (i < 5 || l < .6)
    btn.current.position.z += ((pressed ? 5.05 : 5.7) - btn.current.position.z) * k
    led.current.material.emissiveIntensity += ((pressed ? 3 : .25) - led.current.material.emissiveIntensity) * k
    rings.current.forEach((r, n) => { if (!r) return; const ph = ((state.clock.elapsedTime * .7 + n / 3) % 1); r.scale.setScalar(1 + ph * 3.2); r.material.opacity = pressed ? (1 - ph) * .8 : 0 })
  })

  return (
    <group ref={group} scale={.0001}>
      <RoundedBox args={[40, 36, 11]} radius={7.5} smoothness={6}>
        <meshPhysicalMaterial color="#e9e6e0" roughness={.38} clearcoat={.55} clearcoatRoughness={.35} />
      </RoundedBox>
      <mesh position={[0, -1.5, 5.6]}><torusGeometry args={[10.4, .7, 24, 96]} /><meshPhysicalMaterial color="#c9cbcf" metalness={1} roughness={.3} /></mesh>
      <mesh ref={btn} position={[0, -1.5, 5.7]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[9.4, 9.4, 1.6, 96]} /><meshPhysicalMaterial color="#2a2b2f" roughness={.42} clearcoat={.3} /></mesh>
      {[0, 1, 2].map(n => <mesh key={n} ref={el => rings.current[n] = el} position={[0, -1.5, 6.6]}><torusGeometry args={[9.6, .35, 12, 96]} /><meshBasicMaterial color="#FFBF65" transparent opacity={0} depthWrite={false} /></mesh>)}
      {[-2, -1, 0, 1, 2].map(n => <mesh key={n} position={[n * 2.2, 13.2, 5.55]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.55, .55, .6, 16]} /><meshStandardMaterial color="#151517" /></mesh>)}
      <mesh ref={led} position={[13.5, 13.2, 5.4]}><sphereGeometry args={[.7, 20, 14]} /><meshStandardMaterial color="#E85D04" emissive="#FFBF65" emissiveIntensity={.25} toneMapped={false} /></mesh>
      <mesh geometry={strap}><meshStandardMaterial map={knit} bumpMap={knit} bumpScale={.35} roughness={.95} /></mesh>
    </group>
  )
}

/* The phone: face down, used but never looked at. */
function Phone({ p }) {
  const ref = useRef(); const { viewport } = useThree()
  useFrame((_, dt) => {
    const v = p.get(); let i = 0; while (i < 5 && v >= S[i + 1]) i++; const l = span(v, S[i], S[i + 1])
    const vis = i === 2 ? out(span(l, 0, .35)) : i === 3 ? 1 - span(l, .3, .6) : 0
    const k = 1 - Math.exp(-dt * 8), r = ref.current
    const fit = Math.min(1, viewport.width / 3.6)
    r.scale.setScalar(Math.max(.0001, r.scale.x + (vis * fit - r.scale.x) * k)); r.visible = r.scale.x > .01
    r.position.set(viewport.width * .3, viewport.aspect < .9 ? -viewport.height * .04 : -viewport.height * .12, 0)
    r.rotation.set(-1.25, 0, .35)
  })
  return (
    <group ref={ref} scale={.0001}>
      <RoundedBox args={[.62, 1.25, .06]} radius={.08} smoothness={4}><meshPhysicalMaterial color="#0d1013" roughness={.35} clearcoat={.8} /></RoundedBox>
      <mesh position={[.16, .42, .035]}><circleGeometry args={[.07, 24]} /><meshStandardMaterial color="#222" metalness={.8} roughness={.3} /></mesh>
    </group>
  )
}

/* The system: you at the centre, stations on slow orbits, the thought travelling in as light. */
function System({ p, flags }) {
  const root = useRef(), orbits = useRef(), tube = useRef(), sparks = useRef([]), you = useRef()
  const { viewport } = useThree()
  const narrow = viewport.aspect < .9
  const youPos = useMemo(() => new THREE.Vector3(0, narrow ? viewport.height * .32 : .1, 0), [viewport.width, viewport.height])
  const curve = useMemo(() => {
    const fit = Math.min(1, viewport.width / 3.6), b = new THREE.Vector3((narrow ? -viewport.width * .22 : -viewport.width * .3) - .16 * fit, -viewport.height * .2 - .05 * fit, .3)
    const ph = new THREE.Vector3(viewport.width * .3, narrow ? -viewport.height * .04 : -viewport.height * .12, 0)
    return new THREE.CatmullRomCurve3([b, new THREE.Vector3((b.x + ph.x) / 2, b.y - .5, .4), ph, new THREE.Vector3(ph.x * .6, youPos.y + .9, .2), youPos.clone()])
  }, [viewport.width, viewport.height, youPos])
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 220, .012, 8, false), [curve])
  const stations = useMemo(() => Array.from({ length: 7 }, (_, n) => ({ r: [1.0, 1.45, 1.9][n % 3], a: n / 7 * Math.PI * 2, sp: .12 + (n % 3) * .04, on: n < 3 })), [])

  useFrame((state, dt) => {
    const v = p.get(); let i = 0; while (i < 5 && v >= S[i + 1]) i++; const l = span(v, S[i], S[i + 1]), t = state.clock.elapsedTime
    // the filament draws itself from the button, through the phone, to you
    const fl = i === 2 ? span(l, .35, .9) : i === 3 ? 1 - span(l, .4, .7) : 0
    geo.setDrawRange(0, Math.floor(geo.index.count * fl)); tube.current.visible = fl > 0
    sparks.current.forEach((sp, n) => { if (!sp) return; const u = ((t * .35 + n / 4) % 1) * fl; sp.position.copy(curve.getPointAt(Math.min(u, .999))); sp.visible = fl > .05; sp.scale.setScalar(.6 + Math.sin(t * 6 + n) * .25) })
    // the constellation grows in, then folds back into the device's light
    const show = i === 3 ? out(span(l, 0, .25)) : i === 4 ? 1 : i === 5 ? 1 - ease(span(l, 0, .5)) : 0
    const k = 1 - Math.exp(-dt * 7), r = root.current
    const sc = Math.max(.0001, r.scale.x + (show * Math.min(1, viewport.width / 4.2) - r.scale.x) * k); r.scale.setScalar(sc); r.visible = sc > .01
    const fold = i === 5 ? ease(span(l, 0, .5)) : 0
    r.position.set(lerp(youPos.x, narrow ? -viewport.width * .22 : -viewport.width * .3, fold), lerp(youPos.y, -viewport.height * .2, fold), 0)
    orbits.current.rotation.z = t * .05
    orbits.current.children.forEach((c, n) => { const s = stations[n]; if (!s) return; const a = s.a + t * s.sp; c.position.set(Math.cos(a) * s.r, Math.sin(a) * s.r * .42, Math.sin(a) * .3); c.material.emissiveIntensity = s.on && i >= 3 && l > .3 + n * .1 || (s.on && i > 3) ? 2.2 : .15 })
    you.current.scale.setScalar(1 + Math.sin(t * 2) * .06)
  })

  return (
    <>
      <mesh ref={tube} geometry={geo}><meshBasicMaterial color="#FFBF65" toneMapped={false} /></mesh>
      {[0, 1, 2, 3].map(n => <mesh key={n} ref={el => sparks.current[n] = el} visible={false}><sphereGeometry args={[.035, 12, 8]} /><meshBasicMaterial color="#FFE2B0" toneMapped={false} /></mesh>)}
      <group ref={root} scale={.0001}>
        <mesh ref={you}><sphereGeometry args={[.09, 32, 16]} /><meshStandardMaterial color="#F0EEEB" emissive="#F0EEEB" emissiveIntensity={1.6} toneMapped={false} /></mesh>
        {[1.0, 1.45, 1.9].map(rr => <mesh key={rr} scale={[1, .42, 1]}><torusGeometry args={[rr, .003, 6, 160]} /><meshBasicMaterial color="#F0EEEB" transparent opacity={.22} /></mesh>)}
        <group ref={orbits}>{stations.map((s, n) => <mesh key={n}><sphereGeometry args={[s.on ? .05 : .035, 16, 12]} /><meshStandardMaterial color={s.on ? '#FFBF65' : '#9aa3a8'} emissive={s.on ? '#FFBF65' : '#9aa3a8'} emissiveIntensity={.15} toneMapped={false} /></mesh>)}</group>
      </group>
    </>
  )
}

export default function Scene({ p, flags }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ antialias: true, alpha: true }} aria-hidden="true">
      <ambientLight intensity={.25} />
      <directionalLight position={[-4, 6, 5]} intensity={2.2} />
      <directionalLight position={[3, 1, -4]} intensity={.8} color="#FFBF65" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[-3, 3, 4]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#FFBF65" position={[4, -1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={1} color="#7aa7ff" position={[0, 4, -4]} scale={3} />
      </Environment>
      <Device p={p} flags={flags} />
      <Phone p={p} />
      <System p={p} flags={flags} />
    </Canvas>
  )
}
