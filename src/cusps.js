import { parametricAngle } from './ellipse.js'

export function createCusps (offset, a, b, cx, cy) {
  const cusps = new Array(12)
  const step = Math.PI / 6
  let target = Math.PI + offset
  let actual = target

  for (let i = 0; i < 12; i++, target -= step) {
    if (target < 0) {
      target += Math.PI * 2
    }
    actual = parametricAngle(target, a, b)
    cusps[i] = [
      target,
      actual,
      cx + Math.cos(actual) * a,
      cy + Math.sin(actual) * b
    ]
  }
  return cusps
}
