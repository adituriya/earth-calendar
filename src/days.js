import { parametricAngle } from './ellipse.js'
import { timesFromDates } from './time.js'

function createSubDays (days, n, date, angle, increment, a, b, cx, cy) {
  let theta = 0
  for (let j = 0; j <= n; j++, angle -= increment) {
    theta = parametricAngle(angle, a, b)
    days.push([
      angle,
      theta,
      cx + Math.cos(theta) * a,
      cy + Math.sin(theta) * b,
      date.getDate() === 1 ? 1 : 0
    ])
    date.setDate(date.getDate() + 1)
  }
}

export function createDays (year, yearData, cusps, rotation, a, b, cx, cy) {
  
  // Extract times from yearData
  const times = timesFromDates(yearData)
  const newYear = new Date(year, 0, 1)
  const newYearTime = newYear.getTime()
  const nextYear = new Date(year + 1, 0, 1)
  const nextYearTime = nextYear.getTime()

  // Time between winter solstice and next new year
  const delta1 = nextYearTime - times[11]
  // Time between new year and perihelion
  const delta2 = times[12] - newYearTime
  // Estimate angle between new year's day and perihelion
  let offset = rotation * delta2 / (delta1 + delta2)

  let startAngle = Math.PI + offset

  // Cusps array starts at winter solstice
  let degreeIndex = 1
  let endAngle = cusps[degreeIndex][0] // target angle
  const days = []

  let startTimeCusp = newYearTime
  let startTimeMidnight = newYearTime
  let endDateCusp = null
  let endDateMidnight = null
  let endTimeCusp = 0
  let endTimeMidnight = 0

  let totalPeriod = 0

  let fullAngle = 0
  let actualAngle = 0
  let nDays = 0
  let increment = 0
  let date = newYear
  // let theta = 0
  let startOffset = 0
  let startFraction = 0
  let endOffset = 0
  let endFraction = 0

  for (let i = 0; i < 12; i++) {

    // Timestamp of next cusp
    endTimeCusp = times[i]
    // Local time of next cusp
    endDateCusp = new Date(endTimeCusp)
    // Local start of day before next cusp
    endDateMidnight = new Date(endDateCusp.getFullYear(), endDateCusp.getMonth(), endDateCusp.getDate())
    // Timestamp of local start of day before next cusp
    endTimeMidnight = endDateMidnight.getTime()

    // Total milliseconds of current period
    totalPeriod = endTimeCusp - startTimeCusp

    // Offset in ms between start cusp and start of next day
    startOffset = startTimeMidnight - startTimeCusp
    // Start offset as a fraction of the total period
    startFraction = startOffset / totalPeriod
    // Offset in ms between end cusp and start of that day
    endOffset = endTimeCusp - endTimeMidnight
    // End offset as a fraction of the total period
    endFraction = endOffset / totalPeriod

    // Full angle from cusp to cusp
    fullAngle = startAngle - endAngle
    while (fullAngle < 0) {
      fullAngle += Math.PI * 2
    }

    // Actual angle from start calendar day to end calendar day
    actualAngle = fullAngle - fullAngle * startFraction - fullAngle * endFraction

    nDays = Math.round((endTimeMidnight - startTimeMidnight) / 86400000)
    increment = actualAngle / nDays
    startAngle -= fullAngle * startFraction

    createSubDays (days, nDays, date, startAngle, increment, a, b, cx, cy)

    // Advance to next pair of cusps
    startAngle = endAngle

    // Reset cusp angle
    degreeIndex += 1
    degreeIndex %= 12
    endAngle = cusps[degreeIndex][0]

    // Reset initial time to start of first day in next sign
    endDateMidnight.setDate(endDateMidnight.getDate() + 1)
    startTimeMidnight = endDateMidnight.getTime()
    startTimeCusp = endTimeCusp
  }

  // New year of the following year
  endTimeCusp = nextYearTime

  // One day before the new year
  nextYear.setDate(nextYear.getDate() - 1)
  endTimeMidnight = nextYear.getTime()

  // Total period
  totalPeriod = endTimeCusp - startTimeCusp

  // Offset in ms between start cusp and start of next day
  startOffset = startTimeMidnight - startTimeCusp
  // Start offset as a fraction of the total period
  startFraction = startOffset / totalPeriod
  // Offset in ms between end cusp and start of that day
  endOffset = 86400000
  // End offset as a fraction of the total period
  endFraction = endOffset / totalPeriod

  endAngle = Math.PI + offset

  // Full angle from cusp to cusp
  fullAngle = startAngle - endAngle
  while (fullAngle < 0) {
    fullAngle += Math.PI * 2
  }

  // Actual angle from start calendar day to end calendar day
  actualAngle = fullAngle - fullAngle * startFraction - fullAngle * endFraction

  nDays = Math.round((endTimeMidnight - startTimeMidnight) / 86400000)
  increment = actualAngle / nDays
  startAngle -= fullAngle * startFraction

  createSubDays (days, nDays, date, startAngle, increment, a, b, cx, cy)

  return days
}
