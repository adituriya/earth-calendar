import { parametricAngle } from './ellipse.js'

export function createCusps (offset, dimensions) {
  const cusps = new Array(12)
  const step = Math.PI / 6
  let target = Math.PI + offset
  let actual = target

  for (let i = 0; i < 12; i++, target -= step) {
    if (target < 0) {
      target += Math.PI * 2
    }
    actual = parametricAngle(target, dimensions.a, dimensions.b)
    cusps[i] = [
      target,
      actual,
      dimensions.cx + Math.cos(actual) * dimensions.a,
      dimensions.cy + Math.sin(actual) * dimensions.b
    ]
  }
  return cusps
}
