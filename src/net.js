import { drawSlices } from './draw.js'
import jQuery from 'jquery'
const $ = jQuery

/**
 * Look up the root URL for the current site (will not work if WordPress
 * is installed in a subdirectory).
 *
 * @returns WordPress site root url
 */
export function rootUrl () {
  let url = window.location.protocol + '//' + window.location.hostname
  if (window.location.port) {
    url += ':' + window.location.port
  }
  return url
}

export function lookupDatesForYear (element, year, days, under, over, dimensions) {
  const wpRoot = rootUrl()
  // Look up all years (custom taxonomy for calendar_date post type)
  $.ajax({
    url: wpRoot + '/wp-json/wp/v2/year'
  }).done(function (data) {

    let yearId = 0
    let allYearsId = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].slug == year) {
        yearId = data[i].id
      } else if (data[i].slug === 'yearly') {
        allYearsId = data[i].id
      }
    }

    let yearQuery = '' + yearId
    if (allYearsId) {
      yearQuery += ',' + allYearsId
    }

    $.ajax({
      url: wpRoot + '/wp-json/wp/v2/calendar_date?year=' + yearQuery
    }).done(function (dates) {
      const slices = []
      for (let j = 0; j < dates.length; j++) {
        const candidate = dates[j]
        const allYears = candidate.year.includes(allYearsId)
        const acf = candidate.acf

        let candidateDate = null
        let realDate = acf.date
        if (allYears) {
          // If this event is for 'all years', use the current year
          realDate = year + realDate.substr(4)
        }
        if (!realDate) continue;
        if (realDate.length < 10) {
          realDate = realDate.substr(0, 4) + '-' + realDate.substr(4, 2) + '-' + realDate.substr(6)
        }

        if (acf.time) {
          candidateDate = new Date(realDate + 'T' + acf.time + 'Z')
        } else {
          candidateDate = new Date(realDate + 'T00:00:00')
        }

        const candidateTime = candidateDate.getTime()
        for (let k = 0; k < days.length; k++) {
          let day = days[k]
          const dayTime = day[4]
          if (dayTime > candidateTime) {
            // Back one day
            k -= 1
            if (k < 0) {
              k += days.length
            }
            const nextDay = days[k]

            let dateString = candidateDate.getDate() + ' ' + candidateDate.toLocaleString('en-US', { month: 'long' }) + ', ' + candidateDate.getFullYear()

            // Handle end date for multi-day events
            if (acf.end_date && acf.end_date !== '0000-00-00') {
              realDate = acf.end_date
              if (allYears) {
                // If this event is for 'all years', use the current year
                realDate = year + realDate.substr(4)
              }
              if (realDate.length < 10) {
                realDate = realDate.substr(0, 4) + '-' + realDate.substr(4, 2) + '-' + realDate.substr(6)
              }
              let endDate = new Date(realDate + 'T00:00:00')
              if (acf.time) {
                endDate = new Date(realDate + 'T' + acf.time + 'Z')
              }
              const duration = Math.round((endDate.getTime() - candidateTime) / 86400000)
              k += duration + 1
              if (k >= days.length) {
                k -= days.length
              }
              day = days[k]

              if (endDate.getMonth() === candidateDate.getMonth()) {
                dateString = candidateDate.getDate() + ' - ' + endDate.getDate() + ' ' + candidateDate.toLocaleString('en-US', { month: 'long' }) + ', ' + candidateDate.getFullYear()
              } else {
                dateString = candidateDate.getDate() + ' ' + candidateDate.toLocaleString('en-US', { month: 'long' }) + ' - ' +
                             endDate.getDate() + ' ' + endDate.toLocaleString('en-US', { month: 'long' }) + ', ' + candidateDate.getFullYear()
              }
            }
            
            slices.push({
              r1: day,
              r2: nextDay,
              id: candidate.slug,
              title: dateString,
              text: acf.description
            })
            // Terminate inner loop
            break
          }
        }
      }
      drawSlices(element, slices, under, over, dimensions)
    })

  })
}
