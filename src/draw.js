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
        .stroke({ width: dimensions.line, color: options.colorMonthLine })
    }
  }

  // Blend lines with transparency
  const transparency = function (add) {
    add.componentTransfer(function (add) {
      add.funcA({
        type: 'linear',
        slope: 0.33,
        intercept: 0
      })
    })
  }
  g1.filterWith(transparency)
  g2.filterWith(transparency)
  g3.filterWith(transparency)
  g4.filterWith(transparency)
}

export function drawEllipses (layer, under, rotation, gradients, dimensions) {
  const stroke = {
    width: dimensions.line,
    color: options.colorDarkLine
  }
  const w1 = dimensions.a * 2
  const h1 = dimensions.b * 2
  const w2 = w1 - dimensions.inset * 2
  const h2 = h1 - dimensions.inset * 2
  const w3 = (w1 + w2) / 2
  const h3 = (h1 + h2) / 2
  let offset = dimensions.padding + dimensions.inset / 2
  under.ellipse(w3, h3).stroke({
    width: dimensions.inset,
    color: options.colorEcliptic
  }).fill('none').move(offset, offset).filterWith(function (add) {
    const noise = add.turbulence('0.125 0.2', '1', Date.UTC(), 'noStitch', 'fractalNoise')
      .colorMatrix('matrix', '1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1')
      .componentTransfer(function (rgba) {
        rgba.funcR({
          type: 'linear',
          slope: 0.99,
          intercept: 0.25
        })
        rgba.funcG({
          type: 'linear',
          slope: 0.55,
          intercept: 0.25
        })
        rgba.funcB({
          type: 'linear',
          slope: 0.11,
          intercept: 0.25
        })
        rgba.funcA({
          type: 'linear',
          slope: 0,
          intercept: 0.25
        })
      })
    add.composite(noise, 'SourceGraphic', 'atop')
  })

  offset -= dimensions.inset / 2
  layer.ellipse(w1, h1).stroke(stroke).fill('none').move(offset, offset)
  offset += dimensions.inset
  layer.ellipse(w2, h2).stroke(stroke).fill('none').move(offset, offset)

  // Background gradient for the four quarters
  const gradient = under.gradient('radial', function (add) {
    add.stop(0, '#ffffff')
    add.stop(1, '#4f4f4f')
  })
  const mask = under.mask()
  mask.ellipse(w2, h2).stroke('none').fill(gradient).move(offset, offset).filterWith(function (add) {
    const noise = add.turbulence('0.0333', '1', Date.UTC(), 'stitch', 'fractalNoise')
      .colorMatrix('matrix', '1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1')
      .componentTransfer(function (rgba) {
        rgba.funcA({
          type: 'linear',
          slope: 0,
          intercept: 0.2
        })
      })
    add.composite(noise, 'SourceGraphic', 'atop')
  })

  const bg = under.group()
  bg.maskWith(mask)

  const rotateDegrees = (rotation * 180 / Math.PI)
  drawBackground(bg, '1', dimensions.cx, dimensions.cy, rotateDegrees + 180, false, gradients.quarter1, gradients.quarter1Hover)
  drawBackground(bg, '2', dimensions.cx, dimensions.cy, rotateDegrees + 180, true, gradients.quarter2, gradients.quarter2Hover)
  drawBackground(bg, '3', dimensions.cx, dimensions.cy, rotateDegrees, false, gradients.quarter3, gradients.quarter3Hover)
  drawBackground(bg, '4', dimensions.cx, dimensions.cy, rotateDegrees, true, gradients.quarter4, gradients.quarter4Hover)
}

function drawBackground(layer, label, cx, cy, rotation, flip, gradient1, gradient2) {
  flip = flip ? 'y' : ''
  const name = 'quarter' + label
  layer.rect(cx, cy, cx, cy).addClass(name).fill(gradient1).transform({
    rotate: rotation,
    origin: [cx, cy],
    flip: flip
  })
  layer.rect(cx, cy, cx, cy).addClass(name + '-hover').fill(gradient2).transform({
    rotate: rotation,
    origin: [cx, cy],
    flip: flip
  }).opacity(0)
}

export function drawCusps (layer, cusps, dimensions) {
  const months = layer.group()
  const quarters = layer.group()
  for (let i = 0; i < 6; i++) {
    const degree0 = cusps[i]
    const degree180 = cusps[i + 6]
    // const line = layer.line(degree0[2], degree0[3], degree180[2], degree180[3])
    if (i % 3 === 0) {
      quarters.line(degree0[2], degree0[3], degree180[2], degree180[3])
        .stroke({
          width: dimensions.line,
          color: options.colorDarkLine
        })
    } else {
      months.line(degree0[2], degree0[3], degree180[2], degree180[3])
        .stroke({
          width: dimensions.line,
          color: options.colorCuspLine
        })
    }
  }
  months.filterWith(function (add) {
    add.componentTransfer(function (rgba) {
      rgba.funcA({
        type: 'linear',
        slope: 0.667,
        intercept: 0
      })
    })
  })
}

export function drawSun (element, layer, dimensions, tags) {
  const gradient = layer.gradient('radial', function (add) {
    add.stop(0, options.colorSunBody)
    add.stop(0.85, options.colorSunBody)
    add.stop(1, options.colorSunShadow)
  })
  const stroke = {
    width: dimensions.line,
    color: options.colorSunBorder
  }
  const solar = layer.circle(dimensions.height / 5).stroke(stroke).fill(gradient).attr({
    cx: dimensions.cx - dimensions.a / 1.95,
    cy: dimensions.cy
  })

  const selector = 'tooltip-sun'
  drawTooltip(element, selector, 'The Sun', tags.theSun)
  drawTagEvents(layer.root(), solar, element, selector, true, false)

  solar.filterWith(function (add) {
    const noise = add.turbulence('0.18', '2', Date.UTC(), 'noStitch', 'fractalNoise')
      .colorMatrix('matrix', '1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1')
      .componentTransfer(function (rgba) {
        rgba.funcR({
          type: 'linear',
          slope: 0.99,
          intercept: 0
        })
        rgba.funcG({
          type: 'linear',
          slope: 0.75,
          intercept: 0
        })
        rgba.funcB({
          type: 'linear',
          slope: 0.1,
          intercept: 0
        })
        rgba.funcA({
          type: 'linear',
          slope: 0,
          intercept: 0.25
        })
      })
    add.composite(noise, 'SourceGraphic', 'atop')
  })

  layer.circle(dimensions.height / 5).stroke({
    width: dimensions.line / 2,
    color: options.colorSunBorder
  }).fill('none').attr({
    cx: dimensions.cx - dimensions.a / 1.95,
    cy: dimensions.cy
  })

}

export function drawEarth (layer, angle, dimensions) {
  const theta = parametricAngle(angle, dimensions.a, dimensions.b)
  const scale = dimensions.cx / 2160
  const globe = svgEarth(layer, options.colorEarthWater, options.colorEarthLand)

  const offsetX = 0.5 - Math.cos(angle) * 0.1
  const offsetY = 0.5 + Math.sin(angle) * 0.1

  const gradient = layer.gradient('radial', function (add) {
    add.stop({
      offset: 0,
      color: options.colorEarthShadow,
      opacity: 0
    })
    add.stop({
      offset: 0.75,
      color: options.colorEarthShadow,
      opacity: 0.2
    })
    add.stop({
      offset: 1,
      color: options.colorEarthShadow,
      opacity: 0.6
    })
  }).from(offsetX, offsetY).to(offsetX, offsetY)

  globe.circle(300, 300).fill(gradient).stroke({
    width: dimensions.thinLine / scale,
    color: options.colorEarthShadow
  }).transform({
    translate: [
      268, 171
    ]
  })
  globe.transform({
    scale: scale,
    flip: 'y',
    rotate: 5,
    translate: [
      Math.cos(theta) * (dimensions.a - dimensions.inset / 2),
      Math.sin(theta) * (dimensions.b - dimensions.inset / 2)
    ],
    // Try to get the globe centered at cx, cy regardless of drawing scale
    origin: [dimensions.cx - 31 + dimensions.cx / 30, dimensions.cy + 16 - dimensions.cy / 30]
  })
}

export function drawGlyphs (layer, glyphs, rotation, dimensions) {

  const g = layer.group()

  // 30 degree steps
  const step = Math.PI / 6

  // const rotateDegrees = rotation * 180 / Math.PI
  const scale = dimensions.a / 4400
  const r1 = dimensions.a - dimensions.inset * 2.4
  const r2 = dimensions.b - dimensions.inset * 2.4
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
    g.use(paths[i]).fill(options.colorCuspLine).transform({
      translate: [
        // rotate the coordinates into place
        dimensions.cx + x1 * rotationCos - y1 * rotationSin,
        dimensions.cy + y1 * rotationCos + x1 * rotationSin
      ],
      scale: scale,
      origin: [-180 * scale, -180 * scale]
    })
  }

  g.filterWith(function (add) {
    add.componentTransfer(function (rgba) {
      rgba.funcA({
        type: 'linear',
        slope: 0.75,
        intercept: 0
      })
    })
  })
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
  const a2 = dimensions.a - dimensions.inset * 0.23
  const b2 = dimensions.b - dimensions.inset * 0.23
  const a3 = dimensions.a - dimensions.inset * 0.77
  const b3 = dimensions.b - dimensions.inset * 0.77

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

      textLabel = layer.text(labels[label]).fill(options.colorMonthName)
        .font({
          family: 'Niconne, cursive',
          anchor: 'middle',
          size: dimensions.cy / 13
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
  textLabel = layer.text(labels[label]).fill(options.colorMonthName)
    .font({
      family: 'Niconne, cursive',
      anchor: 'middle',
      size: dimensions.cy / 13
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
  const a2 = dimensions.a / 3.5
  const b2 = dimensions.b / 3.5

  const step = Math.PI / 2
  let angle = Math.PI / 4 // + rotation
  let theta = 0
  let x1 = 0
  let y1 = 0
  const font = {
    family: 'Niconne, cursive',
    anchor: 'middle',
    size: dimensions.cy / 10.5
  }
  for (let i = 0; i < 4; i++, angle += step) {
    while (angle >= Math.PI * 2) {
      angle -= Math.PI * 2
    }
    theta = parametricAngle(angle, a2, b2)
    x1 = Math.cos(theta) * a2
    y1 = Math.sin(theta) * b2

    // Blurred highlight behind text
    layer.text(labels[i]).fill(options.colorHighlight).font(font).transform({
      translate: [
        dimensions.cx + x1,
        dimensions.cy + dimensions.cy / 30 + y1
      ]
    }).opacity(0.7).filterWith(function (add) {
      add.gaussianBlur(dimensions.line * 4)
    })

    // Main text layer
    layer.text(labels[i]).fill(options.colorText).font(font).transform({
      translate: [
        dimensions.cx + x1,
        dimensions.cy + dimensions.cy / 30 + y1
      ]
    })

  }
}

function showTag (svg, element, selector, x, y) {
  const showing = svg.data('show')
  if (showing && showing !== selector) {
    hideTag(svg, element, showing)
  }
  const popup = $(element + '-' + selector)
  svg.data('show', selector)
  popup.css({
    top: y + 'px',
    left: x + 'px'
  })
  popup.show()
}

function hideTag (svg, element, selector) {
  const popup = $(element + '-' + selector)
  hideTagPopup(svg, popup)
}

function hideTagPopup (svg, popup) {
  if (popup.is(':visible')) {
    if (popup.is(':hover')) {
      popup.on('mouseleave', function () {
        svg.data('show', null)
        setTimeout(() => {
          popup.hide()
        }, 100)
      })
    } else {
      svg.data('show', null)
      setTimeout(() => {
        popup.hide()
      }, 100)
    }
  } else {
    svg.data('show', null)
  }
}

function drawTagEvents (svg, target, element, selector, conditional, condition, state) {
  const offset = $(element + '-frame').offset()
  const popup = $(element + '-' + selector)
  target.on('mouseover', (event) => {
    const zoom = svg.data('zoom')
    if ((!conditional || (conditional && !!zoom == condition)) && !popup.is(':visible')) {
      showTag(svg, element, selector, event.pageX - offset.left, event.pageY - offset.top)
    }
  })
  target.on('mouseleave', () => {
    hideTagPopup(svg, popup)
  })
}

function drawTooltip (element, selector, title, text) {
  const tooltip = $(element + '-tooltip').clone().appendTo(element + '-frame')
  tooltip.attr({
    id: (element.substr(1) + '-' + selector),
    top: 0,
    left: 0
  })
  tooltip.html('<p><strong>' + title + '</strong> &ndash; ' + text + '</p>')
}

export function drawSlices (element, slices, under, over, dimensions) {
  // console.log(slices)
  for (let i = 0; i < slices.length; i++) {
    // console.log(slices[i])
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

    const selector = 'tooltip-' + slice.id
    drawTooltip(element, selector, slice.title, slice.text)
    drawTagEvents(under.root(), shape, element, selector, true, true)

  }
}

function resetHoverQuarter (svg, quarter) {
  // Detect previous hover quadrant
  const hover = svg.data('hover')
  if (hover && hover != quarter) {
    // Fade out the previous hover effect
    SVG('.quarter' + hover + '-hover').animate(200).opacity(0)
  }
  // Save the hovered quarter
  svg.data('hover', quarter)
}

/**
 * Activate the hover effect on a given quarter, and add clicke event for zooming
 * into that quarter.
 * 
 * @param {SVG} svg SVG.js object 
 * @param {number} quarter Quarter number (1-4)
 * @param {Array} viewbox Viewbox parameters (x, y, width, height)
 */
function activateQuarter (svg, element, quarter, viewbox) {

  // Fade out previously active quarter
  resetHoverQuarter(svg, quarter)

  // Fade in the new hover effect
  SVG('.quarter' + quarter + '-hover').animate(200).opacity(1)
  
  
  // Clear any previous click events
  svg.click(null)

  // Add event to zoom into currently active quarter
  svg.click(function () {
    svg.data('animating', 1)
    svg.data('zoom', quarter)
    const showing = svg.data('show')
    if (showing) {
      hideTag(svg, element, showing)
    }
    svg.animate(600).viewbox(viewbox[0], viewbox[1], viewbox[2], viewbox[3]).after(function() {
      svg.data('animating', null)
    })
    // Fade out hover effect on active quarter
    SVG('.quarter' + quarter + '-hover').animate(600).opacity(0)
  })
}


export function addMouseEvents (element, svg, rotation, gradients, dimensions, tags) {

  drawTooltip(element, 'cosmic-dawn', 'Cosmic Dawn (red)', tags.cosmicDawn)
  drawTooltip(element, 'cosmic-midnight', 'Cosmic Midnight (black)', tags.cosmicMidnight)
  drawTooltip(element, 'cosmic-sunset', 'Cosmic Sunset (yellow)', tags.cosmicSunset)
  drawTooltip(element, 'cosmic-midday', 'Cosmic Midday (white)', tags.cosmicMidday)
  drawTooltip(element, 'tooltip-zodiac', 'The Zodiac', tags.theZodiac)
  drawTooltip(element, 'tooltip-ecliptic', 'The Ecliptic', tags.theEcliptic)

  svg.on('mousemove', (event) => {

    if (svg.data('animating')) {
      // If currently animating, reset click event and do nothing further
      svg.click(null)
      return
    }

    // Detect the offset of the container element using jQuery
    const offset = $(element).offset()
    // Also detect the vertical scroll offset
    const scroll = $(window).scrollTop()

    // Calculate the x,y coordinates relative to the centre of the SVG drawing
    let x = event.clientX - offset.left - dimensions.cx
    let y = event.clientY - offset.top + scroll - dimensions.cy

    // Convert x and y to viewbox coordinates
    const viewbox = svg.viewbox()
    const zoomed = viewbox.width !== dimensions.width
    if (zoomed) {
      x = (viewbox.cx - dimensions.cx) + x * viewbox.width / dimensions.width
      y = (viewbox.cy - dimensions.cy) + y * viewbox.height / dimensions.height
    }

    // Determine what quarter the mouse is in
    const onLeft = x < 0
    const onTop = y < 0
    let showing = svg.data('show')
    let toShow = ''

    // Determine if the mouse is inside the outermost ellipse
    let hitEllipseOuter = isPointInEllipse(x, y, dimensions.a, dimensions.b, rotation)
    if (hitEllipseOuter && !zoomed && showing !== 'tooltip-sun') {
      // We are not zoomed in, and hovered somewhere inside the outer ellipse
      // Are we inside the inner ellipse?
      if (isPointInEllipse(x, y, dimensions.a - dimensions.inset, dimensions.b - dimensions.inset, rotation)) {
        // If so, are we inside the inner region?
        if (isPointInEllipse(x, y, dimensions.a - dimensions.inset * 4, dimensions.b - dimensions.inset * 4, rotation)) {
          // In the inner region (4 quarters)
          if (onLeft) {
            if (onTop) {
              toShow = 'cosmic-sunset'
            } else {
              toShow = 'cosmic-midday'
            }
          } else {
            if (onTop) {
              toShow = 'cosmic-midnight'
            } else {
              toShow = 'cosmic-dawn'
            }
          }
        } else {
          // In the middle region (zodiac)
          toShow = 'tooltip-zodiac'
        }
      } else {
        // In the outer region (ecliptic)
        toShow = 'tooltip-ecliptic'
      }
    }

    // Hide previous tag if it has changed
    if (showing && showing !== toShow && showing !== 'tooltip-sun') {
      hideTag(svg, element, showing)
      showing = svg.data('show')
    }

    // Show new tag if it has changed
    if (!showing && toShow) {
      showTag(svg, element, toShow, event.pageX - offset.left, event.pageY - offset.top)
    }

    // Previous hover and zoom data
    const hover = svg.data('hover')
    const zoom = svg.data('zoom')

    if (hitEllipseOuter) {
      if (zoom) {
        // Inside ellipse and zoomed in
        svg.click(null)
        svg.css({
          'cursor': 'default'
        })
      } else {
        // Inside ellipse and not zoomed in
        svg.css({
          'cursor': 'pointer'
        })
        if (onLeft) {
          if (onTop && hover !== 3) {
            activateQuarter(svg, element, 3, [
              0,
              0,
              dimensions.cx + dimensions.inset,
              dimensions.cy + dimensions.inset
            ])
          } else if (!onTop && hover !== 4) {
            activateQuarter(svg, element, 4, [
              0,
              dimensions.cy - dimensions.inset,
              dimensions.cx + dimensions.inset,
              dimensions.cy + dimensions.inset
            ])
          }
        } else {
          if (onTop && hover !== 2) {
            activateQuarter(svg, element, 2, [
              dimensions.cx - dimensions.inset,
              0,
              dimensions.cx + dimensions.inset,
              dimensions.cy + dimensions.inset
            ])
          } else if (!onTop && hover !== 1) {
            activateQuarter(svg, element, 1, [
              dimensions.cx - dimensions.inset,
              dimensions.cy - dimensions.inset,
              dimensions.cx + dimensions.inset,
              dimensions.cy + dimensions.inset
            ])
          }
        }
      }
    } else {
      if (zoom) {
        // Outside ellipse and zoomed in -- add event to zoom back out
        svg.css({
          'cursor': 'pointer'
        })
        svg.data('hover', 0)
        svg.click(null)
        svg.click(function () {
          svg.animate(600)
            .viewbox(0, 0, dimensions.width, dimensions.height)
            .after(function () {
              svg.data('animating', null)
            })
          svg.data('animating', 1)
          svg.data('zoom', 0)
        })
      } else {
        // Outside ellipse and not zoomed in -- reset
        svg.css({
          'cursor': 'default'
        })
        resetHoverQuarter(svg, 0)
        svg.click(null)
        svg.data('hover', 0)
        hideTag(svg, element, showing)
      }
    }
    
  })

}
