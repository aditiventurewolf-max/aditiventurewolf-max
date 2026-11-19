// Story timing: 0 the mess · 1 the press · 2 the thought leaves · 3 the system · 4 the gate · 5 quiet
export const S = [0, .13, .25, .42, .66, .83, 1]
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const span = (v, a, b) => clamp((v - a) / (b - a), 0, 1)
export const lerp = (a, b, t) => a + (b - a) * t
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
export const out = t => 1 - Math.pow(1 - t, 3)
export const actOf = v => { let i = 0; while (i < 5 && v >= S[i + 1]) i++; return [i, span(v, S[i], S[i + 1])] }
