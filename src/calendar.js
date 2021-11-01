import { createCusps } from './cusps.js'
import { yearlyData } from './data.js'
import { createDays, currentDay, dayAngle } from './days.js'
import { parametricAngle } from './ellipse.js'
import { svgEarth } from './earth.js'
import { lookupDatesForYear } from './net.js'
import { isLeapYear } from './time.js'
import { options } from './options.js'
import { drawDayLines, drawEllipses, drawCusps, drawSun, drawEarth } from './draw.js'

import { SVG } from '@svgdotjs/svg.js'

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

  const time = new Date()
  // time.setFullYear(time.getFullYear() + 1)
  const currentYear = time.getFullYear() // local time
  const daysInYear = isLeapYear(currentYear) ? 366 : 365
  const yearData = yearlyData[currentYear]

  const cardinal3 = new Date(yearData[11])
  const perihelion = new Date(yearData[12])
  const cardinal3Time = cardinal3.getTime()
  const perihelionTime = perihelion.getTime()
  // Calculate the number of days between the winter solstice and the perihelion (projected forward a year)
  const perihelionDays = (perihelionTime + daysInYear * 86400000 - cardinal3Time) / 86400000

  const rotationDeg = 360 * perihelionDays / daysInYear
  const rotationRad = rotationDeg * Math.PI / 180

  const cusps = createCusps(rotationRad, dimensions)

  const days = createDays(currentYear, yearData, cusps, rotationRad, dimensions)

  // Async - fetch important dates from server and render them
  lookupDatesForYear(currentYear, days, under, over, dimensions)

  // Draw lines representing midnight local time of each day of the year
  drawDayLines(main, days, dimensions)

  // Draw outer rings
  drawEllipses(main, dimensions)

  // Draw sign cusps
  drawCusps(main, cusps, dimensions)

  // Draw sun
  drawSun(main, dimensions)

  // Draw earth
  drawEarth(main, dayAngle(days, time), dimensions)

  group.transform({
    rotate: -rotationDeg
  })

  return draw
}
