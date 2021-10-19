import { SVG } from '@svgdotjs/svg.js'
import { yearlyData } from './data.js'

function isLeapYear (year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

/**
 * Calculate the length of the radius of an ellipse at a given angle
 * relative to the major axis.
 * 
 * https://en.wikipedia.org/wiki/Ellipse#Polar_form_relative_to_center
 * 
 * @param {Number} major Radius of major axis
 * @param {Number} minor Radius of minor axis
 * @param {Number} angle Angle in radians relative to major axis
 */
function ellipticRadius (major, minor, angle) {
  const aSinThetaSquared = Math.pow(major * Math.sin(angle), 2)
  const bCosThetaSquared = Math.pow(minor * Math.cos(angle), 2)
  return major * minor / Math.sqrt(aSinThetaSquared + bCosThetaSquared)
}

/**
 * Find the linear distance between two points.
 * 
 * @param {Array} p1 x, y
 * @param {Array} p2 x, y
 * @returns Number
 */
function linearDistance (p1, p2) {
  const xd = Math.abs(p2[0] - p1[0])
  const yd = Math.abs(p2[1] - p1[1])
  return Math.sqrt(xd * xd + yd * yd)
}

function generatePoints (n, a, b, cx, cy, start, time) {
  const total = n
  const points = new Array(total)
  const duration = 86400000
  const limit = 2 * Math.PI
  const step = limit / total
  let x = 0
  let y = 0
  let s = 0
  let d = 0
  let avg = 0
  let t = start
  let prev = null
  for (let i = 0; i < total; i++) {
    x = Math.cos(t) * a
    y = Math.sin(t) * b
    x = cx + x
    y = cy + y
    s = time + i * duration
    d = prev ? linearDistance(prev, [x, y]) : 0
    avg += d
    points[i] = [s, t, x, y, d, step]
    prev = [x, y]
    t -= step
    if (t < 0) {
      t += Math.PI * 2
    }
  }
  d = linearDistance(prev, [points[0][2], points[0][3]])
  points[0][4] = d
  avg += d
  avg /= total

  return {
    points: points,
    spacing: avg
  }
}

function equalizeSpacing (points, a, b, cx, cy) {

  const p = points.points
  const spacing = points.spacing
  const limit = p.length
  const step = Math.PI * 2 / limit
  // const last = p[limit - 1]
  const first = p[0]
  let t = first[1]
  let prev = [first[2], first[3]]
  let ref = first[1]
  let delta = 0
  let current = null
  let avgDelta = 0
  let x = 0
  let y = 0
  let gap = 0
  let avg = 0
  let adjust = 0
  for (let i = 1; i < limit; i++) {
    current = p[i]
    // console.log(current)
    delta = (spacing - current[4]) / spacing
    // console.log(delta)
    avgDelta += Math.abs(delta)
    // t -= step + delta * step
    adjust = current[5] + current[5] * delta
    // console.log(adjust)
    t = ref - adjust
    // console.log((current[1] - ref))
    if (t < 0) {
      t += Math.PI * 2
    }
    x = cx + Math.cos(t) * a
    y = cy + Math.sin(t) * b
    gap = linearDistance(prev, [x, y])
    // console.log(gap)
    avg += gap
    current[1] = t
    current[2] = x
    current[3] = y
    current[4] = gap
    current[5] = adjust
    prev = [x, y]
    ref = t
  }
  current = p[0]
  delta = (spacing - current[4]) / spacing
  avgDelta += Math.abs(delta)
  gap = linearDistance(prev, [current[2], current[3]])
  current[4] = gap
  avg += gap
  points.spacing = avg / limit
  return avgDelta / limit
}

function createDegrees (rotation, a, b, cx, cy) {

  // Create a reference grid of 360 degrees
  const degrees = generatePoints(360, a, b, cx, cy, rotation, 0)

  // Equalize the spacing between points along the edge of the ellipse
  let deviance = equalizeSpacing(degrees, a, b, cx, cy)
  // Repeat until average deviance from equal spacing is less than 0.01%
  while (deviance > 0.0001) {
    deviance = equalizeSpacing(degrees, a, b, cx, cy)
  }
  
  return degrees
}

function timesFromDates (yearData) {
  return [
    (new Date(yearData[0])).getTime(),
    (new Date(yearData[1])).getTime(),
    (new Date(yearData[2])).getTime(),
    (new Date(yearData[3])).getTime(),
    (new Date(yearData[4])).getTime(),
    (new Date(yearData[5])).getTime(),
    (new Date(yearData[6])).getTime(),
    (new Date(yearData[7])).getTime(),
    (new Date(yearData[8])).getTime(),
    (new Date(yearData[9])).getTime(),
    (new Date(yearData[10])).getTime(),
    (new Date(yearData[11])).getTime(),
    (new Date(yearData[12])).getTime(),
    (new Date(yearData[13])).getTime()
  ]
}

function createDays (year, yearData, degrees, rotation, a, b, cx, cy) {
  const daysInYear = isLeapYear(year) ? 366 : 365
  // Extract times from yearData
  const times = timesFromDates(yearData)
  const points = degrees.points
  // let cardinal = points[180]
  const newYear = new Date(year, 0, 1)
  const newYearTime = newYear.getTime()
  const nextYear = new Date(year + 1, 0, 1)
  const nextYearTime = nextYear.getTime()
  const delta1 = nextYearTime - times[11]
  const delta2 = times[12] - newYearTime
  // Estimate angle between new year's day and perihelion
  const offset = rotation * delta2 / (delta1 + delta2)
  // console.log(offset)
  // console.log(rotation)
  let initialTime = newYearTime
  let startAngle = Math.PI + offset

  // Degrees array currently starts at summer solstice
  // So 0 degrees Aquarius is 210 degrees later (index 209)
  let degreeIndex = 209
  let nextCuspAngle = points[degreeIndex][1]
  let prevCuspDegreeAngle = 0
  let startDelta = 0
  let startAngleDelta = 0
  let t = 0
  const days = []
  let cutoff = 0
  let distance = 0
  let fullAngle = 0
  let actualAngle = 0
  let nDays = 0
  let increment = 0
  let date = newYear

  for (let i = 0; i < 12; i++) {

    if (i > 0) {
      // Fraction of day from previous cusp to start of first day in present sign
      startDelta = (initialTime - times[i - 1]) / 86400000
      startAngleDelta = startDelta * prevCuspDegreeAngle
    }

    // Local time of next sign cusp
    cutoff = new Date(times[i])
    // Local start of day of next sign cusp
    const earlyCutoff = new Date(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate())
    // Milliseconds between start of day and sign cusp
    const cutoffDelta = times[i] - earlyCutoff.getTime()

    const cutoffFraction = cutoffDelta / 86400000

    const degreeAngle = points[degreeIndex][5]

    const cutoffAngle = degreeAngle * cutoffFraction * 360 / daysInYear

    // Total milliseconds of current period
    distance = times[i] - initialTime + startDelta
    // cutoffDelta as a fraction of the total distance
    const adjust = (startDelta + cutoffDelta) / distance
    fullAngle = startAngle - nextCuspAngle
    if (fullAngle < 0) {
      fullAngle += Math.PI * 2
    }
    // actualAngle = fullAngle - fullAngle * adjust
    actualAngle = fullAngle - cutoffAngle - startAngleDelta

    nDays = Math.round((earlyCutoff.getTime() - initialTime) / 86400000)
    increment = actualAngle / nDays
    startAngle -= startAngleDelta
    for (let j = 0; j <= nDays; j++) {
      t = startAngle - increment * j
      days.push([
        t,
        cx + Math.cos(t) * a,
        cy + Math.sin(t) * b,
        date.getDate() === 1 ? 1 : 0
      ])
      date.setDate(date.getDate() + 1)
    }

    // Advance to next pair of cusps
    startAngle = nextCuspAngle
    prevCuspDegreeAngle = degreeAngle
    degreeIndex += 30
    degreeIndex %= 360
    nextCuspAngle = points[degreeIndex][1]
    // Advance cutoff date by one day
    earlyCutoff.setDate(earlyCutoff.getDate() + 1)
    // Reset initial time to start of first day in next sign
    initialTime = earlyCutoff.getTime()
  }
  // Finally, position the days between winter solstice and following new year
  startDelta = (initialTime - times[11]) / 86400000
  startAngleDelta = startDelta * prevCuspDegreeAngle
  distance = nextYearTime - initialTime + startDelta
  nextCuspAngle = Math.PI + offset
  fullAngle = startAngle - nextCuspAngle
  if (fullAngle < 0) {
    fullAngle += Math.PI * 2
  }
  actualAngle = fullAngle - startAngleDelta
  nDays = Math.round((nextYearTime - initialTime) / 86400000)
  increment = actualAngle / nDays
  startAngle -= startAngleDelta
  for (let j = 0; j < nDays; j++) {
    t = startAngle - increment * j
    days.push([
      t,
      cx + Math.cos(t) * a,
      cy + Math.sin(t) * b,
      date.getDate() === 1 ? 1 : 0
    ])
    date.setDate(date.getDate() + 1)
  }

  return days
}

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

  const time = new Date()
  // time.setFullYear(time.getFullYear() + 1)
  const currentYear = time.getFullYear() // local time
  const daysInYear = isLeapYear(currentYear) ? 366 : 365
  const yearData = yearlyData[currentYear]
  const cardinal0 = new Date(yearData[2])
  const cardinal1 = new Date(yearData[5])
  const cardinal2 = new Date(yearData[8])
  const cardinal3 = new Date(yearData[11])
  const perihelion = new Date(yearData[12])
  const aphelion = new Date(yearData[13])
  const cardinal0Time = cardinal0.getTime()
  const cardinal1Time = cardinal1.getTime()
  const cardinal2Time = cardinal2.getTime()
  const cardinal3Time = cardinal3.getTime()
  const perihelionTime = perihelion.getTime()
  const aphelionTime = aphelion.getTime()
  const aphelionDays = (aphelionTime - cardinal1Time) / 86400000

  // Approximate orbital rotation for the current year (summer solstice relative to aphelion)
  const rotation = 360 * aphelionDays / daysInYear
  const rotationRad = rotation * Math.PI / 180

  const outerDiameterX = w - padding * 2
  const outerDiameterY = h - padding * 2
  const innerDiameterX = outerDiameterX - inset * 2
  const innerDiameterY = outerDiameterY - inset * 2
  const a = outerDiameterX / 2
  const b = outerDiameterY / 2

  const rings = draw.group()

  const degrees = createDegrees(rotationRad, a, b, cx, cy)
  const degreePoints = degrees.points

  const days = createDays(currentYear, yearData, degrees, rotationRad, a, b, cx, cy)

  // Draw days
  for (let i = 0; i < days.length; i++) {
    if (days[i][3] === 1) {
      rings.line(cx, cy, days[i][1], days[i][2]).stroke({ width: thickness / 2, color: '#c54' })
    } else {
      rings.line(cx, cy, days[i][1], days[i][2]).stroke({ width: thickness / 2, color: '#bbb' })
    }
  }

  // Draw outer rings
  rings.ellipse(outerDiameterX, outerDiameterY).stroke({ width: thickness, color: '#333' }).fill('none').move(padding, padding)
  rings.ellipse(innerDiameterX, innerDiameterY).stroke({ width: thickness, color: '#333' }).fill('none').move(padding + inset, padding + inset)
  

  // Draw sign cusps
  for (let i = 0; i < 180; i += 30) {
    let degree0 = degreePoints[i]
    let degree180 = degreePoints[i + 180]
    rings.line(degree0[2], degree0[3], degree180[2], degree180[3]).stroke({ width: thickness, color: '#37b' })
  }

  // Draw sun
  rings.circle(h / 5).stroke({ width: thickness, color: '#333' }).fill('#f9f3df').attr({
    cx: cx - w/4,
    cy: cy
  })

  // Draw cardinal Earths
  for (let i = 0; i < 360; i += 90) {
    const cardinalAngle = degreePoints[i][1]
    rings.circle(h / 10).stroke({ width: thickness, color: '#333' }).fill('#ffffff').attr({
      cx: cx + Math.cos(cardinalAngle) * (a - padding / 2),
      cy: cy + Math.sin(cardinalAngle) * (b - padding / 2)
    })
  }

  rings.transform({
    rotate: -rotation
  })

  return draw
}
