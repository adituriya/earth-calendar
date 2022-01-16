import { createCusps } from './cusps.js'
import { yearlyData } from './data.js'
import { createDays, dayAngle } from './days.js'
import { zodiacGlyphDefs } from './glyphs.js'
import { createGradients } from './gradients.js'
import { lookupDatesForYear } from './net.js'
import { defaultTags } from './tags.js'
import { isLeapYear } from './time.js'
import { options } from './options.js'
import { drawLabel, drawDayLines, drawEllipses, drawFixedDays, drawCusps, drawGlyphs, drawSun, drawEarth,
  drawMonthNames, drawCardinalPoints, drawQuarterLabels, addMouseEvents } from './draw.js'
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
    inset: width / 27,
    line: pad / 30,
    thinLine: pad / 60,
    width: width,
    height: height,
    solarDiameter: height / 5,
    solarOffset: (cx - pad) / 1.95
  }
}

/**
 * Estimate the angular offset between winter solstice and perihelion (projected forward a year)
 * - the whole drawing gets rotated by this amount.
 * 
 * @param {number} currentYear Current year number
 * @param {Array.<string>} yearData Timings array for current year
 * @returns {number} Angle in radians
 */
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
 * Combine default tags with any custom overrides that were provided.
 * 
 * @param {Object} overrides Custom tags
 * @returns {Object} Tags
 */
function parseTags (overrides) {
  return {
    cosmicDawn: overrides.tags.cosmicDawn ?? defaultTags.cosmicDawn,
    cosmicMidnight: overrides.tags.cosmicMidnight ?? defaultTags.cosmicMidnight,
    cosmicSunset: overrides.tags.cosmicSunset ?? defaultTags.cosmicSunset,
    cosmicMidday: overrides.tags.cosmicMidday ?? defaultTags.cosmicMidday,
    theSun: overrides.tags.theSun ?? defaultTags.theSun,
    theEcliptic: overrides.tags.theEcliptic ?? defaultTags.theEcliptic,
    theZodiac: overrides.tags.theZodiac ?? defaultTags.theZodiac,
    solarIngress: [
      overrides.tags.aquariusIngress ?? defaultTags.aquariusIngress,
      overrides.tags.piscesIngress ?? defaultTags.piscesIngress,
      overrides.tags.ariesIngress ?? defaultTags.ariesIngress,
      overrides.tags.taurusIngress ?? defaultTags.taurusIngress,
      overrides.tags.geminiIngress ?? defaultTags.geminiIngress,
      overrides.tags.cancerIngress ?? defaultTags.cancerIngress,
      overrides.tags.leoIngress ?? defaultTags.leoIngress,
      overrides.tags.virgoIngress ?? defaultTags.virgoIngress,
      overrides.tags.libraIngress ?? defaultTags.libraIngress,
      overrides.tags.scorpioIngress ?? defaultTags.scorpioIngress,
      overrides.tags.sagittariusIngress ?? defaultTags.sagittariusIngress,
      overrides.tags.capricornIngress ?? defaultTags.capricornIngress,
      overrides.tags.perihelion ?? defaultTags.perihelion,
      overrides.tags.aphelion ?? defaultTags.aphelion
    ]
  }
}

/**
 * Render the Earth Calendar using SVG.js
 *
 * @param {string} element CSS query selector for target element
 * @param {Object} overrides Custom option overrides
 * @returns {Object} SVG.js object
 */
export function drawCalendar (element, overrides) {

  const container = document.querySelector(element)
  const w = container.clientWidth
  const h = Math.max(container.clientHeight, w * options.relativeHeight)

  const dimensions = calculateDimensions(w, h)

  const draw = SVG().addTo(element).size(w, h).viewbox(0, 0, w, h)
  const defs = draw.defs()
  const glyphs = zodiacGlyphDefs(defs)
  const group = draw.group().addClass('svg-base')
  const under = group.group().addClass('svg-background')
  const main = group.group().addClass('svg-lines')
  const over = group.group().addClass('svg-overlay')
  const text = draw.group().addClass('svg-text')
  const top = draw.group().addClass('svg-top')
  // Add CSS class indicating full (zoomed-out) view
  draw.parent().parent().addClass('full')

  const time = new Date()
  // time.setFullYear(time.getFullYear() + 1)

  const currentYear = time.getFullYear() // local time
  const yearData = yearlyData[currentYear]
  const rotation = calculateRotation(currentYear, yearData)
  const cusps = createCusps(rotation, dimensions)
  const days = createDays(currentYear, yearData, cusps, rotation, dimensions)
  const gradients = createGradients(draw)

  const under1 = under.group()
  const under2 = under.group()

  const tags = parseTags(overrides)

  // drawQuarters(under, cusps, dimensions)

  drawLabel(element + '-label', time)

  // Draw lines representing midnight local time of each day of the year
  drawDayLines(main, days, rotation, dimensions)

  // Draw outer rings
  drawEllipses(main, under1, rotation, gradients, dimensions)

  // Async - fetch important dates from server and render them
  lookupDatesForYear(element, currentYear, days, under1, over, dimensions)
  // Draw fixed dates
  drawFixedDays(element, yearData, days, under2, dimensions, tags.solarIngress)

  // Draw glyphs
  drawGlyphs(text, glyphs, rotation, dimensions)

  // Draw month names
  drawMonthNames(text, days, rotation, dimensions)

  // Draw sign cusps
  drawCusps(main, cusps, dimensions)

  // Draw cardinal points
  drawCardinalPoints(text, rotation, dimensions)

  // Draw four quarters' labels
  drawQuarterLabels(text, dimensions)

  // Draw sun
  drawSun(element, top, dimensions, tags)

  // Draw earth
  drawEarth(top, dayAngle(days, time), dimensions)

  // Final adjustment (rotate into place)
  const adjust = {
    rotate: -(rotation * 180 / Math.PI),
    origin: [dimensions.cx, dimensions.cy]
  }
  group.transform(adjust)
  top.transform(adjust)

  addMouseEvents(element, draw, rotation, dimensions, tags)

  return draw
}
