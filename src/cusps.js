import { parametricAngle } from './ellipse.js'

export function createCusps (offset, dimensions) {
  const cusps = new Array(12)
  const step = Math.PI / 6
  let target = Math.PI + offset
  let actual = target

  const a2 = dimensions.a - dimensions.inset
  const b2 = dimensions.b - dimensions.inset

  for (let i = 0; i < 12; i++, target -= step) {
    if (target < 0) {
      target += Math.PI * 2
    }
    actual = parametricAngle(target, a2, b2)
    cusps[i] = [
      target,
      actual,
      dimensions.cx + Math.cos(actual) * a2,
      dimensions.cy + Math.sin(actual) * b2
    ]
  }
  return cusps
}
