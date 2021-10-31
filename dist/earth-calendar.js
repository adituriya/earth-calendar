/*! earth-calendar v0.1.2 BUILT: Sun Oct 31 2021 15:18:38 GMT-0400 (Eastern Daylight Time) */;
var EarthCalendar = (function (exports, svg_js, jQuery) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var jQuery__default = /*#__PURE__*/_interopDefaultLegacy(jQuery);

  /**
   * Convert a target angle, relative to the centre of the ellipse,
   * to the corresponding parametric ellipse angle.
   *
   * https://www.petercollingridge.co.uk/tutorials/computational-geometry/finding-angle-around-ellipse/
   *
   * @param {Number} target Target angle (relative to centre), in radians
   * @param {Number} a Length of semimajor axis
   * @param {Number} b Length of semimimor axis
   * @returns Parametric angle in radians
   */
  function parametricAngle(target, a, b) {
    // Convert target angle to parametric angle
    var t = Math.atan(Math.tan(target) * a / b); // Determine what quarter the angle is in

    var quarter = Math.ceil(target / (Math.PI / 2)); // Rotate result into the correct quarter

    if (quarter === 2 || quarter === 3) {
      t += Math.PI;
    } else if (quarter === 4) {
      t += 2 * Math.PI;
    }

    return t;
  }
  /**
   * Find the linear distance between two points.
   *
   * @param {Array} p1 x, y
   * @param {Array} p2 x, y
   * @returns Number
   */
  // function linearDistance (p1, p2) {
  //   const xd = Math.abs(p2[0] - p1[0])
  //   const yd = Math.abs(p2[1] - p1[1])
  //   return Math.sqrt(xd * xd + yd * yd)
  // }

  function createCusps(offset, a, b, cx, cy) {
    var cusps = new Array(12);
    var step = Math.PI / 6;
    var target = Math.PI + offset;
    var actual = target;

    for (var i = 0; i < 12; i++, target -= step) {
      if (target < 0) {
        target += Math.PI * 2;
      }

      actual = parametricAngle(target, a, b);
      cusps[i] = [target, actual, cx + Math.cos(actual) * a, cy + Math.sin(actual) * b];
    }

    return cusps;
  }

  /**
   * Data adapted from http://astropixels.com/ephemeris/soleq2001.html
   * and http://astropixels.com/ephemeris/perap2001.html
   * and https://www.yourzodiacsign.com/calendar/2021/
   * 
   * Each year includes 14 dates: 12 sign cusps beginning with Aquarius,
   * followed by Perihelion and finally Aphelion. Times in UTC.
   */
  var yearlyData = {
    '2021': ['2021-01-19T20:39:00Z', '2021-02-18T10:43:00Z', '2021-03-20T09:37:00Z', '2021-04-19T20:33:00Z', '2021-05-20T19:37:00Z', '2021-06-21T03:32:00Z', '2021-07-22T14:26:00Z', '2021-08-22T21:34:00Z', '2021-09-22T19:21:00Z', '2021-10-23T04:51:00Z', '2021-11-22T02:33:00Z', '2021-12-21T15:59:00Z', '2021-01-02T13:51:00Z', '2021-07-05T22:27:00Z'],
    '2022': ['2022-01-20T02:39:00Z', '2022-02-18T16:42:00Z', '2022-03-20T15:33:00Z', '2022-04-20T02:24:00Z', '2022-05-21T01:22:00Z', '2022-06-21T09:13:00Z', '2022-07-22T20:06:00Z', '2022-08-23T03:16:00Z', '2022-09-23T01:03:00Z', '2022-10-23T10:35:00Z', '2022-11-22T08:20:00Z', '2022-12-21T21:48:00Z', '2022-01-04T06:55:00Z', '2022-07-04T07:11:00Z'] // '2023': [
    //   '2023-03-20T21:25:00Z',
    //   '2023-06-21T14:58:00Z',
    //   '2023-09-23T06:50:00Z',
    //   '2023-12-22T03:28:00Z',
    //   '2023-01-04T16:17:00Z',
    //   '2023-07-06T20:07:00Z'
    // ],
    // '2024': [
    //   '2024-03-20T03:07:00Z',
    //   '2024-06-20T20:51:00Z',
    //   '2024-09-22T12:44:00Z',
    //   '2024-12-21T09:20:00Z',
    //   '2024-01-03T00:39:00Z',
    //   '2024-07-05T05:06:00Z'
    // ],
    // '2025': [
    //   '2025-03-20T09:02:00Z',
    //   '2025-06-21T02:42:00Z',
    //   '2025-09-22T18:20:00Z',
    //   '2025-12-21T15:03:00Z',
    //   '2025-01-04T13:28:00Z',
    //   '2025-07-03T19:55:00Z'
    // ],
    // '2026': [
    //   '2026-03-20T14:46:00Z',
    //   '2026-06-21T08:25:00Z',
    //   '2026-09-23T00:06:00Z',
    //   '2026-12-21T20:50:00Z',
    //   '2026-01-03T17:16:00Z',
    //   '2026-07-06T17:31:00Z'
    // ],
    // '2027': [
    //   '2027-03-20T20:25:00Z',
    //   '2027-06-21T14:11:00Z',
    //   '2027-09-23T06:02:00Z',
    //   '2027-12-22T02:43:00Z',
    //   '2027-01-03T02:33:00Z',
    //   '2027-07-05T05:06:00Z'
    // ],
    // '2028': [
    //   '2028-03-20T02:17:00Z',
    //   '2028-06-20T20:02:00Z',
    //   '2028-09-22T11:45:00Z',
    //   '2028-12-21T08:20:00Z',
    //   '2028-01-05T12:28:00Z',
    //   '2028-07-03T22:18:00Z'
    // ],
    // '2029': [
    //   '2029-03-20T08:01:00Z',
    //   '2029-06-21T01:48:00Z',
    //   '2029-09-22T17:37:00Z',
    //   '2029-12-21T14:14:00Z',
    //   '2029-01-02T18:13:00Z',
    //   '2029-07-06T05:12:00Z'
    // ],
    // '2030': [
    //   '2030-03-20T13:51:00Z',
    //   '2030-06-21T07:31:00Z',
    //   '2030-09-22T23:27:00Z',
    //   '2030-12-21T20:09:00Z',
    //   '2030-01-03T10:12:00Z',
    //   '2030-07-04T12:58:00Z'
    // ]

  };

  /**
   * Determine whether the provided year is a leap year in the Gregorian calendar
   * 
   * @param {Integer} year 
   * @returns Boolean
   */
  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  /**
   * Convert dates to timestamps.
   * 
   * @param {Array} yearData Astronomical data for a single year (from `data.js`)
   * @returns Array
   */

  function timesFromDates(yearData) {
    return [new Date(yearData[0]).getTime(), new Date(yearData[1]).getTime(), new Date(yearData[2]).getTime(), new Date(yearData[3]).getTime(), new Date(yearData[4]).getTime(), new Date(yearData[5]).getTime(), new Date(yearData[6]).getTime(), new Date(yearData[7]).getTime(), new Date(yearData[8]).getTime(), new Date(yearData[9]).getTime(), new Date(yearData[10]).getTime(), new Date(yearData[11]).getTime(), new Date(yearData[12]).getTime(), new Date(yearData[13]).getTime()];
  }

  function createSubDays(days, n, date, angle, increment, a, b, cx, cy) {
    var theta = 0;

    for (var j = 0; j <= n; j++, angle -= increment) {
      theta = parametricAngle(angle, a, b);
      days.push([angle, theta, cx + Math.cos(theta) * a, cy + Math.sin(theta) * b, date.getDate() === 1 ? 1 : 0]);
      date.setDate(date.getDate() + 1);
    }
  }

  function createDays(year, yearData, cusps, rotation, a, b, cx, cy) {
    // Extract times from yearData
    var times = timesFromDates(yearData);
    var newYear = new Date(year, 0, 1);
    var newYearTime = newYear.getTime();
    var nextYear = new Date(year + 1, 0, 1);
    var nextYearTime = nextYear.getTime(); // Time between winter solstice and next new year

    var delta1 = nextYearTime - times[11]; // Time between new year and perihelion

    var delta2 = times[12] - newYearTime; // Estimate angle between new year's day and perihelion

    var offset = rotation * delta2 / (delta1 + delta2);
    var startAngle = Math.PI + offset; // Cusps array starts at winter solstice

    var degreeIndex = 1;
    var endAngle = cusps[degreeIndex][0]; // target angle

    var days = [];
    var startTimeCusp = newYearTime;
    var startTimeMidnight = newYearTime;
    var endDateCusp = null;
    var endDateMidnight = null;
    var endTimeCusp = 0;
    var endTimeMidnight = 0;
    var totalPeriod = 0;
    var fullAngle = 0;
    var actualAngle = 0;
    var nDays = 0;
    var increment = 0;
    var date = newYear; // let theta = 0

    var startOffset = 0;
    var startFraction = 0;
    var endOffset = 0;
    var endFraction = 0;

    for (var i = 0; i < 12; i++) {
      // Timestamp of next cusp
      endTimeCusp = times[i]; // Local time of next cusp

      endDateCusp = new Date(endTimeCusp); // Local start of day before next cusp

      endDateMidnight = new Date(endDateCusp.getFullYear(), endDateCusp.getMonth(), endDateCusp.getDate()); // Timestamp of local start of day before next cusp

      endTimeMidnight = endDateMidnight.getTime(); // Total milliseconds of current period

      totalPeriod = endTimeCusp - startTimeCusp; // Offset in ms between start cusp and start of next day

      startOffset = startTimeMidnight - startTimeCusp; // Start offset as a fraction of the total period

      startFraction = startOffset / totalPeriod; // Offset in ms between end cusp and start of that day

      endOffset = endTimeCusp - endTimeMidnight; // End offset as a fraction of the total period

      endFraction = endOffset / totalPeriod; // Full angle from cusp to cusp

      fullAngle = startAngle - endAngle;

      while (fullAngle < 0) {
        fullAngle += Math.PI * 2;
      } // Actual angle from start calendar day to end calendar day


      actualAngle = fullAngle - fullAngle * startFraction - fullAngle * endFraction;
      nDays = Math.round((endTimeMidnight - startTimeMidnight) / 86400000);
      increment = actualAngle / nDays;
      startAngle -= fullAngle * startFraction;
      createSubDays(days, nDays, date, startAngle, increment, a, b, cx, cy); // Advance to next pair of cusps

      startAngle = endAngle; // Reset cusp angle

      degreeIndex += 1;
      degreeIndex %= 12;
      endAngle = cusps[degreeIndex][0]; // Reset initial time to start of first day in next sign

      endDateMidnight.setDate(endDateMidnight.getDate() + 1);
      startTimeMidnight = endDateMidnight.getTime();
      startTimeCusp = endTimeCusp;
    } // New year of the following year


    endTimeCusp = nextYearTime; // One day before the new year

    nextYear.setDate(nextYear.getDate() - 1);
    endTimeMidnight = nextYear.getTime(); // Total period

    totalPeriod = endTimeCusp - startTimeCusp; // Offset in ms between start cusp and start of next day

    startOffset = startTimeMidnight - startTimeCusp; // Start offset as a fraction of the total period

    startFraction = startOffset / totalPeriod; // Offset in ms between end cusp and start of that day

    endOffset = 86400000; // End offset as a fraction of the total period

    endFraction = endOffset / totalPeriod;
    endAngle = Math.PI + offset; // Full angle from cusp to cusp

    fullAngle = startAngle - endAngle;

    while (fullAngle < 0) {
      fullAngle += Math.PI * 2;
    } // Actual angle from start calendar day to end calendar day


    actualAngle = fullAngle - fullAngle * startFraction - fullAngle * endFraction;
    nDays = Math.round((endTimeMidnight - startTimeMidnight) / 86400000);
    increment = actualAngle / nDays;
    startAngle -= fullAngle * startFraction;
    createSubDays(days, nDays, date, startAngle, increment, a, b, cx, cy);
    return days;
  }

  /**
   * Look up the root URL for the current site (will not work if WordPress
   * is installed in a subdirectory).
   * 
   * @returns WordPress site root url
   */
  function rootUrl() {
    var url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
      url += ':' + window.location.port;
    }

    return url;
  }

  var $ = jQuery__default["default"];
  /**
   * Render the Earth Calendar using SVG.js
   *
   * @param {String} element CSS query selector for target element
   * @returns {Object} SVG.js object
   */

  function drawCalendar(element) {
    var container = document.querySelector(element);
    var w = container.clientWidth;
    var h = Math.max(container.clientHeight, w * 0.8);
    var cx = w / 2;
    var cy = h / 2;
    var padding = Math.round(w / 30);
    var thickness = w / 450;
    var inset = padding * 0.75;
    var draw = svg_js.SVG().addTo(element).size(w, h);
    var outerDiameterX = w - padding * 2;
    var outerDiameterY = h - padding * 2;
    var innerDiameterX = outerDiameterX - inset * 2;
    var innerDiameterY = outerDiameterY - inset * 2;
    var a = outerDiameterX / 2;
    var b = outerDiameterY / 2;
    var time = new Date(); // time.setFullYear(time.getFullYear() + 1)

    var currentYear = time.getFullYear(); // local time

    var daysInYear = isLeapYear(currentYear) ? 366 : 365;
    var yearData = yearlyData[currentYear]; // const cardinal0 = new Date(yearData[2])
    // const cardinal1 = new Date(yearData[5])
    // const cardinal2 = new Date(yearData[8])

    var cardinal3 = new Date(yearData[11]);
    var perihelion = new Date(yearData[12]); // const aphelion = new Date(yearData[13])
    // const cardinal0Time = cardinal0.getTime()
    // const cardinal1Time = cardinal1.getTime()
    // const cardinal2Time = cardinal2.getTime()

    var cardinal3Time = cardinal3.getTime();
    var perihelionTime = perihelion.getTime(); // const aphelionTime = aphelion.getTime()
    // const aphelionDays = (aphelionTime - cardinal1Time) / 86400000
    // Calculate the number of days between the winter solstice and the perihelion (projected forward a year)

    var perihelionDays = (perihelionTime + daysInYear * 86400000 - cardinal3Time) / 86400000; // console.log(perihelionDays)
    // Approximate orbital rotation for the current year (summer solstice relative to aphelion)
    // let rotation = 360 * aphelionDays / daysInYear
    // let rotationRad = rotation * Math.PI / 180

    var offsetDeg = 360 * perihelionDays / daysInYear;
    var offsetRad = offsetDeg * Math.PI / 180; // const rotationRad = parametricAngle(offsetRad, a, b)
    // const rotationDeg = rotationRad * 180 / Math.PI

    var rotationRad = offsetRad;
    var rotationDeg = offsetDeg;
    var cusps = createCusps(rotationRad, a, b, cx, cy);
    var rings = draw.group();
    var days2 = createDays(currentYear, yearData, cusps, rotationRad, a, b, cx, cy);
    var wpRoot = rootUrl(); // Look up all years (custom taxonomy for calendar_date post type)

    $.ajax({
      // url: wpRoot + '/wp-json/wp/v2/calendar_date?year=2'
      url: wpRoot + '/wp-json/wp/v2/year' // url: wpRoot + '/wp-json/'

    }).done(function (data) {
      var yearId = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].slug == currentYear) {
          yearId = data[i].id;
          break;
        }
      }

      $.ajax({
        url: wpRoot + '/wp-json/wp/v2/calendar_date?year=' + yearId
      });
    });

    for (var i = 0; i < days2.length; i++) {
      if (days2[i][4] === 1) {
        rings.line(cx, cy, days2[i][2], days2[i][3]).stroke({
          width: thickness / 2,
          color: '#c54'
        });
      } else {
        rings.line(cx, cy, days2[i][2], days2[i][3]).stroke({
          width: thickness / 2,
          color: '#bbb'
        });
      }
    } // Draw outer rings


    rings.ellipse(outerDiameterX, outerDiameterY).stroke({
      width: thickness,
      color: '#333'
    }).fill('none').move(padding, padding);
    rings.ellipse(innerDiameterX, innerDiameterY).stroke({
      width: thickness,
      color: '#333'
    }).fill('none').move(padding + inset, padding + inset); // Draw sign cusps

    for (var _i = 0; _i < 6; _i++) {
      var degree0 = cusps[_i];
      var degree180 = cusps[_i + 6];
      rings.line(degree0[2], degree0[3], degree180[2], degree180[3]).stroke({
        width: thickness,
        color: '#37b'
      });
    } // Draw sun


    rings.circle(h / 5).stroke({
      width: thickness,
      color: '#643'
    }).fill('#f9f3df').attr({
      cx: cx - w / 4,
      cy: cy
    }); // Draw cardinal Earths
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
    });
    return draw;
  }

  var calendar = {
    __proto__: null,
    drawCalendar: drawCalendar
  };

  exports.calendar = calendar;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, SVG, jQuery);
//# sourceMappingURL=earth-calendar.js.map
