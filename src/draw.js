import { svgEarth } from './earth.js'
import { parametricAngle } from './ellipse.js'
import { options } from './options.js'
import jQuery, { param } from 'jquery'
const $ = jQuery

export function drawDayLines (layer, days, dimensions) {
  const g = layer.group()
  // const bottom = g.group()
  // const top = g.group()
  const a2 = dimensions.a - dimensions.inset
  const b2 = dimensions.b - dimensions.inset
  for (let i = 0; i < days.length; i++) {
    const angle = parametricAngle(days[i][0], a2, b2)
    const x = dimensions.cx + Math.cos(angle) * a2
    const y = dimensions.cy + Math.sin(angle) * b2
    // If it is the first of the month, use a different color and put it on the top layer
    if (days[i][5] === 1) {
      g.line(
        dimensions.cx,
        dimensions.cy,
        x,
        y
      ).stroke({ width: dimensions.line * 0.5, color: options.colorDayLine })
      // Red line along the outside
      g.line(x, y, days[i][2], days[i][3])
        .stroke({ width: dimensions.line, color: options.colorDayLineFirst })
    } else {
      // g.line(dimensions.cx, dimensions.cy, days[i][2], days[i][3])
      //   .stroke({ width: dimensions.line * 0.5, color: options.colorDayLine })

      g.line(dimensions.cx, dimensions.cy, x, y)
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
  const r1 = dimensions.a - dimensions.inset * 3
  const r2 = dimensions.b - dimensions.inset * 3
  const paths = glyphs.paths

  // Sin and cos required for rotating glyphs into final position
  const rotationCos = Math.cos(-rotation)
  const rotationSin = Math.sin(-rotation)

  // Aries glyph goes at +75 degrees
  let angle = rotation + Math.PI * 5 / 12
  let theta = 0
  let x1 = 0
  let y1 = 0

  for (let i = 0; i < paths.length; i++, angle -= step) {
    if (angle < 0) {
      angle += Math.PI * 2
    }
    theta = parametricAngle(angle, r1, r2)
    x1 = Math.cos(theta) * r1
    y1 = Math.sin(theta) * r2
    layer.use(paths[i]).fill(options.colorCuspLine).transform({
      translate: [
        // rotate the coordinates into place
        dimensions.cx + x1 * rotationCos - y1 * rotationSin,
        dimensions.cy + y1 * rotationCos + x1 * rotationSin
      ],
      scale: scale,
      origin: [-180 * scale, -180 * scale]
    })
  }
}

export function drawMonthNames (layer, days, rotation, dimensions) {
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const a2 = dimensions.a - dimensions.inset * 0.2
  const b2 = dimensions.b - dimensions.inset * 0.2
  const a3 = dimensions.a - dimensions.inset * 0.8
  const b3 = dimensions.b - dimensions.inset * 0.8

  // Sin and cos required for rotating glyphs into final position
  const rotationCos = Math.cos(-rotation)
  const rotationSin = Math.sin(-rotation)
  const rotationDeg = rotation * 180 / Math.PI

  // const step = Math.PI / 6
  // let angle = 0
  let theta = Math.PI - rotation
  let x1 = 0
  let y1 = 0
  let x2 = 0
  let y2 = 0
  const limit = days.length
  let angle1 = days[0][0]
  let angle2 = 0
  let day = null
  let label = 0
  let textLabel = null

  for (let i = 31; i < limit; i++) {
    day = days[i]
    if (day[5] === 1) {
      angle2 = day[0]
      if (angle2 < 0) {
        angle2 += Math.PI * 2
      }

      if (angle2 > angle1) {
        angle2 -= Math.PI * 2
      }
      // angle = (angle1 + angle2) / 2

      textLabel = layer.text(labels[label]).fill(options.colorDayLineFirst)
        .font({
          family: 'Niconne, cursive',
          anchor: 'middle',
          size: dimensions.cy / 17
        })

      // let alpha = angle
      if (angle1 - rotation < Math.PI && angle1 > rotation) { 
        theta = parametricAngle(angle1, a2, b2)
        x1 = Math.cos(theta) * a2
        y1 = Math.sin(theta) * b2
        x2 = dimensions.cx + x1 * rotationCos - y1 * rotationSin
        y2 = dimensions.cy + y1 * rotationCos + x1 * rotationSin

        let path = 'M ' + x2 + ' ' + y2 + ' A '
        theta = parametricAngle(angle2, a2, b2)
        x1 = Math.cos(theta) * a2
        y1 = Math.sin(theta) * b2
        x2 = dimensions.cx + x1 * rotationCos - y1 * rotationSin
        y2 = dimensions.cy + y1 * rotationCos + x1 * rotationSin

        path += a2 + ' ' + b2 + ' -' + rotationDeg + ' 0 0 ' + x2 + ' ' + y2

        // console.log(path)
        // layer.path(path).stroke({
        //   width: dimensions.line,
        //   color: options.colorDayLineFirst
        // }).fill('none')

        textLabel.path(path).attr('startOffset', '50%')
      } else {
        theta = parametricAngle(angle2, a3, b3)
        x1 = Math.cos(theta) * a3
        y1 = Math.sin(theta) * b3
        x2 = dimensions.cx + x1 * rotationCos - y1 * rotationSin
        y2 = dimensions.cy + y1 * rotationCos + x1 * rotationSin

        let path = 'M ' + x2 + ' ' + y2 + ' A '
        theta = parametricAngle(angle1, a3, b3)
        x1 = Math.cos(theta) * a3
        y1 = Math.sin(theta) * b3
        x2 = dimensions.cx + x1 * rotationCos - y1 * rotationSin
        y2 = dimensions.cy + y1 * rotationCos + x1 * rotationSin

        path += a3 + ' ' + b3 + ' -' + rotationDeg + ' 0 1 ' + x2 + ' ' + y2

        // console.log(path)
        // layer.path(path).stroke({
        //   width: dimensions.line,
        //   color: options.colorDayLineFirst
        // }).fill('none')

        textLabel.path(path).attr('startOffset', '50%')
      }

      angle1 = angle2
      if (angle1 < 0) {
        angle1 += Math.PI * 2
      }
      label += 1
    
    
    
    }
    
  }
  angle2 = days[0][0]
  textLabel = layer.text(labels[label]).fill(options.colorDayLineFirst)
    .font({
      family: 'Niconne, cursive',
      anchor: 'middle',
      size: dimensions.cy / 17
    })
  theta = parametricAngle(angle2, a3, b3)
  x1 = Math.cos(theta) * a3
  y1 = Math.sin(theta) * b3
  x2 = dimensions.cx + x1 * rotationCos - y1 * rotationSin
  y2 = dimensions.cy + y1 * rotationCos + x1 * rotationSin

  let path = 'M ' + x2 + ' ' + y2 + ' A '
  theta = parametricAngle(angle1, a3, b3)
  x1 = Math.cos(theta) * a3
  y1 = Math.sin(theta) * b3
  x2 = dimensions.cx + x1 * rotationCos - y1 * rotationSin
  y2 = dimensions.cy + y1 * rotationCos + x1 * rotationSin

  path += a3 + ' ' + b3 + ' -' + rotationDeg + ' 0 1 ' + x2 + ' ' + y2

  // console.log(path)
  // layer.path(path).stroke({
  //   width: dimensions.line,
  //   color: options.colorDayLineFirst
  // }).fill('none')

  textLabel.path(path).attr('startOffset', '50%')
}

export function drawCardinalPoints (layer, rotation, dimensions) {
  
  const labels = ['N', 'E', 'S', 'W']
  const a2 = dimensions.a + dimensions.inset * 1.25
  const b2 = dimensions.b + dimensions.inset * 1.25

  // Sin and cos required for rotating glyphs into final position
  const rotationCos = Math.cos(-rotation)
  const rotationSin = Math.sin(-rotation)

  const step = Math.PI / 2
  let angle = Math.PI + rotation
  let theta = 0
  let x1 = 0
  let y1 = 0
  for (let i = 0; i < 4; i++, angle -= step) {
    theta = parametricAngle(angle, a2, b2)
    x1 = Math.cos(theta) * a2
    y1 = Math.sin(theta) * b2
    layer.text(labels[i]).fill(options.colorText)
      .font({
        family: 'Niconne, cursive',
        anchor: 'middle',
        size: dimensions.cy / 10
      })
      .transform({
      translate: [
        dimensions.cx + x1 * rotationCos - y1 * rotationSin,
        dimensions.cy + dimensions.cy / 30 + y1 * rotationCos + x1 * rotationSin
      ]
    })
  }
}

export function drawSlices (element, slices, under, over, dimensions) {
  // console.log(slices)
  for (let i = 0; i < slices.length; i++) {
    console.log(slices[i])
    const slice = slices[i]
    const x1 = slice.r1[2]
    const y1 = slice.r1[3]
    const x2 = slice.r2[2]
    const y2 = slice.r2[3]
    const shape = under.path(
      'M' + x1 + ' ' + y1 +
      ' A' + dimensions.a + ' ' + dimensions.b + ' 0 0 0 ' + x2 + ' ' + y2 +
      ' L' + dimensions.cx + ' ' + dimensions.cy + ' Z'
    ).fill('#ddaa33')

    // const frame = $(element + '-frame')
    const tooltip = $(element + '-tooltip').clone().prependTo(element + '-frame')
    const selector = element + '-tooltip-' + slice.id
    tooltip.attr({
      id: selector.substr(1),
      top: 0,
      left: 0
    })
    tooltip.html('<h6>' + slice.title + '</h6><p>' + slice.text + '</p>')
    // tooltip.show()
    console.log(element)
    console.log(tooltip)

    shape.on('mouseover', function () {
      $(selector).show()
    })

    shape.on('mouseout', function () {
      $(selector).hide()
    })
  }
}
