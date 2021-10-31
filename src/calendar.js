import { createCusps } from './cusps.js'
import { yearlyData } from './data.js'
import { createDays } from './days.js'
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
  // const cardinal0 = new Date(yearData[2])
  // const cardinal1 = new Date(yearData[5])
  // const cardinal2 = new Date(yearData[8])
  const cardinal3 = new Date(yearData[11])
  const perihelion = new Date(yearData[12])
  // const aphelion = new Date(yearData[13])
  // const cardinal0Time = cardinal0.getTime()
  // const cardinal1Time = cardinal1.getTime()
  // const cardinal2Time = cardinal2.getTime()
  const cardinal3Time = cardinal3.getTime()
  const perihelionTime = perihelion.getTime()
  // const aphelionTime = aphelion.getTime()
  // const aphelionDays = (aphelionTime - cardinal1Time) / 86400000
  // Calculate the number of days between the winter solstice and the perihelion (projected forward a year)
  const perihelionDays = (perihelionTime + daysInYear * 86400000 - cardinal3Time) / 86400000

  // console.log(perihelionDays)

  // Approximate orbital rotation for the current year (summer solstice relative to aphelion)
  // let rotation = 360 * aphelionDays / daysInYear
  // let rotationRad = rotation * Math.PI / 180

  const offsetDeg = 360 * perihelionDays / daysInYear
  const offsetRad = offsetDeg * Math.PI / 180
  // const rotationRad = parametricAngle(offsetRad, a, b)
  // const rotationDeg = rotationRad * 180 / Math.PI
  const rotationRad = offsetRad
  const rotationDeg = offsetDeg

  const cusps = createCusps(rotationRad, a, b, cx, cy)

  const rings = draw.group()

  const days2 = createDays(currentYear, yearData, cusps, rotationRad, a, b, cx, cy)

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


  for (let i = 0; i < days2.length; i++) {
    if (days2[i][4] === 1) {
      rings.line(cx, cy, days2[i][2], days2[i][3]).stroke({ width: thickness / 2, color: '#c54' })
    } else {
      rings.line(cx, cy, days2[i][2], days2[i][3]).stroke({ width: thickness / 2, color: '#bbb' })
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

  // const globe = svgEarth(rings, cx, cy, rotationDeg, '#93d0d9', '#598742')

  // globe.transform({
  //   // translate: [cx, cy]
  // })

  rings.transform({
    rotate: -rotationDeg
  })

  return draw
}
