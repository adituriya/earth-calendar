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
    // url: wpRoot + '/wp-json/wp/v2/calendar_date?year=2'
    url: wpRoot + '/wp-json/wp/v2/year'
    // url: wpRoot + '/wp-json/'
  }).done(function (data) {

    let yearId = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].slug == year) {
        yearId = data[i].id
        break
      }
    }

    $.ajax({
      url: wpRoot + '/wp-json/wp/v2/calendar_date?year=' + yearId
    }).done(function (dates) {
      // console.log(dates)
      const slices = new Array(dates.length)
      for (let j = 0; j < dates.length; j++) {
        const candidate = dates[j]
        let candidateDate = null
        if (candidate.calendar_time) {
          candidateDate = new Date(candidate.calendar_date + 'T' + candidate.calendar_time + 'Z')
        } else {
          candidateDate = new Date(candidate.calendar_date + 'T00:00:00')
        }
        const candidateTime = candidateDate.getTime()
        // console.log(candidateDate)
        for (let k = 0; k < days.length; k++) {
          const day = days[k]
          const dayTime = day[4]
          if (dayTime >= candidateTime) {
            // Advance to next day
            k += 1
            if (k === days.length) {
              k = 0
            }
            const nextDay = days[k]
            // slices[j] = [day, nextDay, candidate.slug, candidate.title.rendered, candidate.description]
            slices[j] = {
              r1: day,
              r2: nextDay,
              id: candidate.slug,
              title: candidate.title.rendered,
              text: candidate.description
            }
            // Terminate inner loop
            break
          }
        }
      }
      drawSlices(element, slices, under, over, dimensions)
    })

  })
}
