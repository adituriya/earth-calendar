import { createCusps } from './cusps.js'
import { yearlyData } from './data.js'
import { createDays, currentDay } from './days.js'
import { parametricAngle } from './ellipse.js'
import { svgEarth } from './earth.js'
import { rootUrl } from './net.js'
import { isLeapYear } from './time.js'

import { SVG } from '@svgdotjs/svg.js'
import jQuery from 'jquery'
const $ = jQuery

/**
 * Render the Earth Calendar using SVG.js
 *
 * @param {String} element CSS query selector for target element
 * @returns {Object} SVG.js object
 */
export function drawCalendar (element) {

  const container = document.querySelector(element)
  const w = container.clientWidth
  const h = Math.max(container.clientHeight, w * 0.8)
  const cx = w / 2
  const cy = h / 2
  const padding = Math.round(w / 30)
  const thickness = w / 450
  const inset = padding * 0.75
  const draw = SVG().addTo(element).size(w, h)

  const outerDiameterX = w - padding * 2
  const outerDiameterY = h - padding * 2
  const innerDiameterX = outerDiameterX - inset * 2
  const innerDiameterY = outerDiameterY - inset * 2
  const a = outerDiameterX / 2
  const b = outerDiameterY / 2

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

  const offsetDeg = 360 * perihelionDays / daysInYear
  const offsetRad = offsetDeg * Math.PI / 180
  const rotationRad = offsetRad
  const rotationDeg = offsetDeg

  const cusps = createCusps(rotationRad, a, b, cx, cy)

  const rings = draw.group()

  const days = createDays(currentYear, yearData, cusps, rotationRad, a, b, cx, cy)

  const wpRoot = rootUrl()

  // Look up all years (custom taxonomy for calendar_date post type)
  $.ajax({
    // url: wpRoot + '/wp-json/wp/v2/calendar_date?year=2'
    url: wpRoot + '/wp-json/wp/v2/year'
    // url: wpRoot + '/wp-json/'
  }).done(function (data) {

    let yearId = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].slug == currentYear) {
        yearId = data[i].id
        break
      }
    }

    $.ajax({
      url: wpRoot + '/wp-json/wp/v2/calendar_date?year=' + yearId
    })

  })

  for (let i = 0; i < days.length; i++) {
    if (days[i][5] === 1) {
      rings.line(cx, cy, days[i][2], days[i][3]).stroke({ width: thickness / 2, color: '#c54' })
    } else {
      rings.line(cx, cy, days[i][2], days[i][3]).stroke({ width: thickness / 2, color: '#bbb' })
    }
  }

  // Draw outer rings
  rings.ellipse(outerDiameterX, outerDiameterY).stroke({ width: thickness, color: '#333' }).fill('none').move(padding, padding)
  rings.ellipse(innerDiameterX, innerDiameterY).stroke({ width: thickness, color: '#333' }).fill('none').move(padding + inset, padding + inset)

  // Draw sign cusps
  for (let i = 0; i < 6; i++) {
    let degree0 = cusps[i]
    let degree180 = cusps[i + 6]
    rings.line(degree0[2], degree0[3], degree180[2], degree180[3]).stroke({ width: thickness, color: '#37b' })
  }

  // Draw sun
  rings.circle(h / 5).stroke({ width: thickness, color: '#643' }).fill('#f9f3df').attr({
    cx: cx - w/4,
    cy: cy
  })

  // Draw cardinal Earths
  // for (let i = 0; i < 360; i += 90) {
  //   const cardinalAngle = degreePoints[i][1]
  //   rings.circle(h / 10).stroke({ width: thickness, color: '#333' }).fill('#ffffff').attr({
  //     cx: cx + Math.cos(cardinalAngle) * (a - padding / 2),
  //     cy: cy + Math.sin(cardinalAngle) * (b - padding / 2)
  //   })
  // }

  const globe = svgEarth(rings, cx, cy, rotationDeg, '#93d0d9', '#598742')

  const current = currentDay(days, time)
  const thisDay = days[current]
  const todayAngle = thisDay[0]
  const todayTheta = parametricAngle(todayAngle, a - inset / 2, b - inset / 2)

  globe.transform({
    scale: cx / 2160,
    flip: 'y',
    rotate: 5,
    translate: [Math.cos(todayTheta) * (a - inset / 2), Math.sin(todayTheta) * (b - inset / 2)],
    origin: [cx - 30 + cx / 25, cy + 15 - cx / 60]
  })

  rings.transform({
    rotate: -rotationDeg
  })

  return draw
}
