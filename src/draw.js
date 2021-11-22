import { svgEarth } from './earth.js'
import { parametricAngle, isPointInEllipse } from './ellipse.js'
import { options } from './options.js'
import { SVG } from '@svgdotjs/svg.js'
import jQuery, { param } from 'jquery'
const $ = jQuery

/**
 * Create a group with a given class name and stroke style.
 * 
 * @param {SVG.G} layer SVG group to add the group to
 * @param {string} name Class name for the new group
 * @param {number} width Default line width for this group
 * @returns {SVG.G} New SVG group object
 */
function dayLinesGroup (layer, name, width) {
  return layer.group().addClass(name).stroke({
    width: width,
    color: options.colorDayLine
  })
}

/**
 * Draw a line for each day of the year using precomputed angles.
 * 
 * @param {SVG.G} layer SVG layer to which the day lines will be added
 * @param {Array.<Array.<number>>} days Precomputed angles and endpoints for each day of the year
 * @param {number} rotation Drawing rotation in radians
 * @param {Object.<string, number>} dimensions Drawing dimensions
 */
export function drawDayLines (layer, days, rotation, dimensions) {

  // Create a group for each quarter
  const g1 = dayLinesGroup(layer, 'q1-days', dimensions.thinLine)
  const g2 = dayLinesGroup(layer, 'q2-days', dimensions.thinLine)
  const g3 = dayLinesGroup(layer, 'q3-days', dimensions.thinLine)
  const g4 = dayLinesGroup(layer, 'q4-days', dimensions.thinLine)

  // Calculate bounds of (inner) ellipse
  const a2 = dimensions.a - dimensions.inset
  const b2 = dimensions.b - dimensions.inset

  let angle, theta, x, y
  for (let i = 0; i < days.length; i++) {

    angle = days[i][0]
    theta = parametricAngle(angle, a2, b2)
    x = dimensions.cx + Math.cos(theta) * a2
    y = dimensions.cy + Math.sin(theta) * b2

    // Determine what quarter the line will be in when rotated into place
    angle -= rotation
    if (angle < 0) {
      angle += Math.PI * 2
    }
    if (angle < Math.PI * 0.5) {
      g1.line(dimensions.cx, dimensions.cy, x, y)
    } else if (angle < Math.PI) {
      g4.line(dimensions.cx, dimensions.cy, x, y)
    } else if (angle < Math.PI * 1.5) {
      g3.line(dimensions.cx, dimensions.cy, x, y)
    } else {
      g2.line(dimensions.cx, dimensions.cy, x, y)
    }

    // If it is the first of the month, draw a line segment on the outer ring
    if (days[i][5] === 1) {
      layer.line(x, y, days[i][2], days[i][3])
        .stroke({ width: dimensions.line, color: options.colorDayLineFirst })
    }
  }

  // Blend lines with transparency
  const transparency = function (add) {
    add.componentTransfer(function (add) {
      add.funcA({
        type: 'linear',
        slope: 0.5,
        intercept: 0
      })
    })
  }
  g1.filterWith(transparency)
  g2.filterWith(transparency)
  g3.filterWith(transparency)
  g4.filterWith(transparency)
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
    rect.addClass('quarter' + (i + 1))
    const add = i < 2 ? 180 : 0
    const transform = {
      rotate: rotateDegrees + add,
      origin: [dimensions.cx, dimensions.cy],
      flip: i % 2 === 0 ? '' : 'y'
    }
    rect.transform(transform)
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
  const scale = dimensions.a / 4200
  const r1 = dimensions.a - dimensions.inset * 2.5
  const r2 = dimensions.b - dimensions.inset * 2.5
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

      textLabel = layer.text(labels[label]).fill(options.colorDayLineFirst)
        .font({
          family: 'Niconne, cursive',
          anchor: 'middle',
          size: dimensions.cy / 14
        })

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
      size: dimensions.cy / 14
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
  textLabel.path(path).attr('startOffset', '50%')
}

export function drawCardinalPoints (layer, rotation, dimensions) {
  
  const labels = ['N', 'E', 'S', 'W']
  const a2 = dimensions.a + dimensions.padding * 0.6
  const b2 = dimensions.b + dimensions.padding * 0.6

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


export function drawQuarterLabels (layer, dimensions) {
  
  const labels = ['Dawn', 'Midday', 'Sunset', 'Midnight']
  const a2 = dimensions.a / 4
  const b2 = dimensions.b / 4

  // Sin and cos required for rotating glyphs into final position
  // const rotationCos = Math.cos(-rotation)
  // const rotationSin = Math.sin(-rotation)

  const step = Math.PI / 2
  let angle = Math.PI / 4 // + rotation
  let theta = 0
  let x1 = 0
  let y1 = 0
  for (let i = 0; i < 4; i++, angle += step) {
    while (angle >= Math.PI * 2) {
      angle -= Math.PI * 2
    }
    theta = parametricAngle(angle, a2, b2)
    x1 = Math.cos(theta) * a2
    y1 = Math.sin(theta) * b2
    layer.text(labels[i]).fill(options.colorText)
      .font({
        family: 'Niconne, cursive',
        anchor: 'middle',
        size: dimensions.cy / 12
      })
      .transform({
      translate: [
        // dimensions.cx + x1 * rotationCos - y1 * rotationSin,
        // dimensions.cy + dimensions.cy / 30 + y1 * rotationCos + x1 * rotationSin
        dimensions.cx + x1,
        dimensions.cy + dimensions.cy / 30 + y1
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
    ).fill('#ddaa33').css({
      'cursor': 'pointer'
    })

    // const frame = $(element + '-frame')
    const tooltip = $(element + '-tooltip').clone().prependTo(element + '-frame')
    const selector = element + '-tooltip-' + slice.id
    const offset = $(element + '-frame').offset()
    // console.log(offset)
    tooltip.attr({
      id: selector.substr(1),
      top: 0,
      left: 0
    })
    tooltip.html('<p><strong>' + slice.title + '</strong></p><p>' + slice.text + '</p>')
    // tooltip.show()
    // console.log(element)
    // console.log(tooltip)

    shape.on('mouseover', (event) => {
      const popup = $(selector)
      if (!popup.is(':visible')) {
        popup.css({
          top: (event.pageY - offset.top) + 'px',
          left: (event.pageX - offset.left) + 'px'
        })
      }
      popup.show()
    })

    shape.on('mouseout', () => {
      setTimeout(() => {
        $(selector).hide()
      }, 500)
      
    })
  }
}



export function addMouseEvents (container, svg, rotation, dimensions) {

  svg.on('mousemove', (event) => {
    // Detect the offset of the container element using jQuery
    const offset = $(container).offset()
    // Also detect the vertical scroll offset
    const scroll = $(window).scrollTop()

    // Calculate the x,y coordinates relative to the centre of the SVG drawing
    const x = event.clientX - offset.left - dimensions.cx
    const y = event.clientY - offset.top + scroll - dimensions.cy
    // Determine what quarter the mouse is in
    const onLeft = x < 0
    const onTop = y < 0
    // Determine if the mouse is inside the outermost ellipse
    const inside = isPointInEllipse(x, y, rotation, dimensions)

    if (inside) {
      svg.css({
        'cursor': 'pointer'
      })
      if (onLeft) {
        if (onTop) {
          // Top left
          SVG('.quarter3').fill(options.colorQuarterYellowHover)
          SVG('.quarter1').fill(options.colorQuarterRed)
          SVG('.quarter2').fill(options.colorQuarterBlack)
          SVG('.quarter4').fill(options.colorQuarterWhite)
          svg.click(function () {
            svg.animate().viewbox(0, 0, dimensions.cx + dimensions.inset, dimensions.cy + dimensions.inset)
          })
        } else {
          // Bottom left
          SVG('.quarter4').fill(options.colorQuarterWhiteHover)
          SVG('.quarter1').fill(options.colorQuarterRed)
          SVG('.quarter2').fill(options.colorQuarterBlack)
          SVG('.quarter3').fill(options.colorQuarterYellow)
        }
      } else {
        if (onTop) {
          // Top right
          SVG('.quarter2').fill(options.colorQuarterBlackHover)
          SVG('.quarter1').fill(options.colorQuarterRed)
          SVG('.quarter3').fill(options.colorQuarterYellow)
          SVG('.quarter4').fill(options.colorQuarterWhite)
        } else {
          // Bottom right
          SVG('.quarter1').fill(options.colorQuarterRedHover)
          SVG('.quarter2').fill(options.colorQuarterBlack)
          SVG('.quarter3').fill(options.colorQuarterYellow)
          SVG('.quarter4').fill(options.colorQuarterWhite)
        }
      }
    } else {
      // Reset
      svg.css({
        'cursor': 'default'
      })
      SVG('.quarter1').fill(options.colorQuarterRed)
      SVG('.quarter2').fill(options.colorQuarterBlack)
      SVG('.quarter3').fill(options.colorQuarterYellow)
      SVG('.quarter4').fill(options.colorQuarterWhite)
      svg.click(null)
    }
    
  })

}
