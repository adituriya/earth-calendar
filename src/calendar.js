import { createCusps } from './cusps.js'
import { yearlyData } from './data.js'
import { createDays, dayAngle } from './days.js'
import { zodiacGlyphDefs } from './glyphs.js'
import { lookupDatesForYear } from './net.js'
import { isLeapYear } from './time.js'
import { options } from './options.js'
import { drawDayLines, drawEllipses, drawCusps, drawGlyphs, drawSun, drawEarth,
  drawMonthNames, drawCardinalPoints } from './draw.js'

import { SVG } from '@svgdotjs/svg.js'

/**
 * Calculate the `a` and `b` parameters
 * 
 * @param {Number} width Width of the full drawing area
 * @param {Number} height Height of the full drawing area
 * @returns Object Geometric dimensions
 */
function calculateDimensions (width, height) {
  const cx = width / 2
  const cy = height / 2
  const pad = width / 20
  return {
    a: cx - pad,
    b: cy - pad,
    cx: cx,
    cy: cy,
    padding: pad,
    inset: pad / 2,
    line: pad / 30,
    width: width,
    height: height
  }
}

function calculateRotation (currentYear, yearData) {
  const daysInYear = isLeapYear(currentYear) ? 366 : 365
  const solstice = new Date(yearData[11])
  const perihelion = new Date(yearData[12])
  const solsticeTime = solstice.getTime()
  const perihelionTime = perihelion.getTime()
  // Calculate the number of days between the winter solstice and the perihelion (projected forward a year)
  const perihelionDays = (perihelionTime + daysInYear * 86400000 - solsticeTime) / 86400000
  return 2 * Math.PI * perihelionDays / daysInYear
}

/**
 * Render the Earth Calendar using SVG.js
 *
 * @param {String} element CSS query selector for target element
 * @returns {Object} SVG.js object
 */
export function drawCalendar (element) {

  const container = document.querySelector(element)
  const w = container.clientWidth
  const h = Math.max(container.clientHeight, w * options.relativeHeight)

  const dimensions = calculateDimensions(w, h)

  const draw = SVG().addTo(element).size(w, h)
  const group = draw.group()
  const under = group.group()
  const main = group.group()
  const over = group.group()
  const text = draw.group()
  const top = draw.group()
  const defs = draw.defs()
  const glyphs = zodiacGlyphDefs(defs)

  const time = new Date()
  // time.setFullYear(time.getFullYear() + 1)

  const currentYear = time.getFullYear() // local time
  const yearData = yearlyData[currentYear]
  const rotation = calculateRotation(currentYear, yearData)
  const cusps = createCusps(rotation, dimensions)
  const days = createDays(currentYear, yearData, cusps, rotation, dimensions)

  // Async - fetch important dates from server and render them
  lookupDatesForYear(element, currentYear, days, under, over, dimensions)

  // drawQuarters(under, cusps, dimensions)

  // Draw lines representing midnight local time of each day of the year
  drawDayLines(main, days, dimensions)

  // Draw outer rings
  drawEllipses(main, under, rotation, dimensions)

  // Draw glyphs
  drawGlyphs(text, glyphs, rotation, dimensions)

  // Draw month names
  drawMonthNames(text, days, rotation, dimensions)

  // Draw sign cusps
  drawCusps(top, cusps, dimensions)

  // Draw cardinal points
  drawCardinalPoints(text, rotation, dimensions)

  // Draw sun
  drawSun(top, dimensions)

  // Draw earth
  drawEarth(top, dayAngle(days, time), dimensions)

  group.transform({
    rotate: -(rotation * 180 / Math.PI)
  })
  top.transform({
    rotate: -(rotation * 180 / Math.PI)
  })

  return draw
}
