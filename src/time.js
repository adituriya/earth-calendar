
/**
 * Determine whether the provided year is a leap year in the Gregorian calendar
 * 
 * @param {Integer} year 
 * @returns Boolean
 */
export function isLeapYear (year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

/**
 * Convert dates to timestamps.
 * 
 * @param {Array} yearData Astronomical data for a single year (from `data.js`)
 * @returns Array
 */
export function timesFromDates (yearData) {
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