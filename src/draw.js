import { svgEarth } from './earth.js'
import { parametricAngle } from './ellipse.js'
import { options } from './options.js'

export function drawDayLines (layer, days, dimensions) {
  for (let i = 0; i < days.length; i++) {
    const line = layer.line(dimensions.cx, dimensions.cy, days[i][2], days[i][3])
    // If it is the first of the month, use a different color
    if (days[i][5] === 1) {
      line.stroke({ width: dimensions.line / 2, color: options.colorDayLineFirst })
    } else {
      line.stroke({ width: dimensions.line / 2, color: options.colorDayLine })
    }
  }
}

export function drawEllipses (layer, dimensions) {
  const stroke = {
    width: dimensions.line,
    color: options.colorDarkLine
  }
  const w1 = dimensions.a * 2
  const h1 = dimensions.b * 2
  const w2 = w1 - dimensions.inset * 2
  const h2 = h1 - dimensions.inset * 2
  let offset = dimensions.padding
  layer.ellipse(w1, h1).stroke(stroke).fill('none').move(offset, offset)
  offset += dimensions.inset
  layer.ellipse(w2, h2).stroke(stroke).fill('none').move(offset, offset)
}

export function drawCusps (layer, cusps, dimensions) {
  const stroke = {
    width: dimensions.line,
    color: options.colorCuspLine
  }
  for (let i = 0; i < 6; i++) {
    const degree0 = cusps[i]
    const degree180 = cusps[i + 6]
    layer.line(degree0[2], degree0[3], degree180[2], degree180[3]).stroke(stroke)
  }
}

export function drawSun (layer, dimensions) {
  const stroke = {
    width: dimensions.line,
    color: options.colorSunBorder
  }
  layer.circle(dimensions.height / 5).stroke(stroke).fill(options.colorSunBody).attr({
    cx: dimensions.cx - dimensions.a / 2,
    cy: dimensions.cy
  })
}

export function drawEarth (layer, angle, dimensions) {
  angle = parametricAngle(angle, dimensions.a, dimensions.b)
  const globe = svgEarth(layer, options.colorEarthWater, options.colorEarthLand)
  globe.transform({
    scale: dimensions.cx / 2160,
    flip: 'y',
    rotate: 5,
    translate: [
      Math.cos(angle) * (dimensions.a - dimensions.inset / 2),
      Math.sin(angle) * (dimensions.b - dimensions.inset / 2)
    ],
    // Try to get the globe centered at cx, cy
    origin: [dimensions.cx - 30 + dimensions.cx / 25, dimensions.cy + 15 - dimensions.cx / 60]
  })
}

export function drawSlices (slices, under, over) {
  // console.log(under)
}
