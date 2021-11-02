import { svgEarth } from './earth.js'
import { parametricAngle } from './ellipse.js'
import { options } from './options.js'

export function drawDayLines (layer, days, dimensions) {
  const g = layer.group()
  // const bottom = g.group()
  // const top = g.group()
  const a2 = dimensions.a - dimensions.inset
  const b2 = dimensions.b - dimensions.inset
  for (let i = 0; i < days.length; i++) {
    // If it is the first of the month, use a different color and put it on the top layer
    if (days[i][5] === 1) {
      const angle = parametricAngle(days[i][0], a2, b2)
      const x = dimensions.cx + Math.cos(angle) * a2
      const y = dimensions.cy + Math.sin(angle) * b2
      g.line(
        dimensions.cx,
        dimensions.cy,
        x,
        y
      ).stroke({ width: dimensions.line * 0.5, color: options.colorDayLine })
      g.line(x, y, days[i][2], days[i][3])
        .stroke({ width: dimensions.line, color: options.colorDayLineFirst })
    } else {
      g.line(dimensions.cx, dimensions.cy, days[i][2], days[i][3])
        .stroke({ width: dimensions.line * 0.5, color: options.colorDayLine })
    }
  }
  g.filterWith(function (add) {
    add.componentTransfer(function (add) {
      add.funcA({
        type: 'linear',
        slope: 0.8,
        intercept: 0
      })
    })
  })
}

export function drawEllipses (layer, under, rotation, dimensions) {
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

  // Background gradient for the four quarters
  const gradient = under.gradient('radial', function (add) {
    add.stop(0, '#ffffff')
    add.stop(0.95, '#000000')
  })
  const mask = under.mask()
  mask.ellipse(w2, h2).stroke('none').fill(gradient).move(offset, offset)

  // Fill colors for the four quarters
  const fills = [
    options.colorQuarterRed,
    options.colorQuarterBlack,
    options.colorQuarterYellow,
    options.colorQuarterWhite
  ]
  const rotateDegrees = (rotation * 180 / Math.PI)
  for (let i = 0; i < 4; i++) {
    const rect = under.rect(dimensions.cx, dimensions.cy, dimensions.cx, dimensions.cy).fill(fills[i])
    const add = i < 2 ? 180 : 0
    rect.transform({
      rotate: rotateDegrees + add,
      origin: [dimensions.cx, dimensions.cy],
      flip: i % 2 === 0 ? '' : 'y'
    })
    rect.maskWith(mask)
  }
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
    // Try to get the globe centered at cx, cy regardless of drawing scale
    origin: [dimensions.cx - 30 + dimensions.cx / 25, dimensions.cy + 15 - dimensions.cx / 60]
  })
}

export function drawGlyphs (layer, glyphs, rotation, dimensions) {
  // 30 degree steps
  const step = Math.PI / 6

  // const rotateDegrees = rotation * 180 / Math.PI
  const scale = dimensions.a / 4500
  const r = dimensions.a / 4.5
  const paths = glyphs.paths

  // Aries glyph goes at +75 degrees
  let angle = Math.PI * 5 / 12

  for (let i = 0; i < paths.length; i++, angle -= step) {
    if (angle < 0) {
      angle += Math.PI * 2
    }
    // const theta = parametricAngle(angle, dimensions.a, dimensions.b)
    layer.use(paths[i]).fill(options.colorCuspLine).transform({
      // rotate: rotateDegrees,
      translate: [
        dimensions.cx + Math.cos(angle) * r,
        dimensions.cy + Math.sin(angle) * r
      ],
      scale: scale,
      origin: [-180 * scale, -180 * scale]
    })
  }
}

export function drawSlices (slices, under, over, dimensions) {
  console.log(slices)
  for (let i = 0; i < slices.length; i++) {
    console.log(slices[i])
    const slice = slices[i]
    const x1 = slice[0][2]
    const y1 = slice[0][3]
    const x2 = slice[1][2]
    const y2 = slice[1][3]
    const shape = under.path(
      'M' + x1 + ' ' + y1 +
      ' A' + dimensions.a + ' ' + dimensions.b + ' 0 0 0 ' + x2 + ' ' + y2 +
      ' L' + dimensions.cx + ' ' + dimensions.cy + ' Z'
    ).fill('#ddaa33')
    shape.on('mouseover', function() {
      this.parent().text('Text').move(20, 20).font({
        fill: '#000',
        family: 'sans-serif'
      })
    })
  }
}
