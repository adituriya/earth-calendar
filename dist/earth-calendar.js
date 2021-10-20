/*! earth-calendar v0.1.2 BUILT: Wed Oct 20 2021 15:53:39 GMT-0400 (Eastern Daylight Time) */;
var EarthCalendar = (function (exports, svg_js) {
  'use strict';

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

  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  /**
   * Find the linear distance between two points.
   * 
   * @param {Array} p1 x, y
   * @param {Array} p2 x, y
   * @returns Number
   */


  function linearDistance(p1, p2) {
    var xd = Math.abs(p2[0] - p1[0]);
    var yd = Math.abs(p2[1] - p1[1]);
    return Math.sqrt(xd * xd + yd * yd);
  }

  function generatePoints(n, a, b, cx, cy, start, time) {
    var total = n;
    var points = new Array(total);
    var duration = 86400000;
    var limit = 2 * Math.PI;
    var step = limit / total;
    var x = 0;
    var y = 0;
    var s = 0;
    var d = 0;
    var avg = 0;
    var t = start;
    var prev = null;

    for (var i = 0; i < total; i++) {
      x = Math.cos(t) * a;
      y = Math.sin(t) * b;
      x = cx + x;
      y = cy + y;
      s = time + i * duration;
      d = prev ? linearDistance(prev, [x, y]) : 0;
      avg += d;
      points[i] = [s, t, x, y, d, step];
      prev = [x, y];
      t -= step;

      if (t < 0) {
        t += Math.PI * 2;
      }
    }

    d = linearDistance(prev, [points[0][2], points[0][3]]);
    points[0][4] = d;
    avg += d;
    avg /= total;
    return {
      points: points,
      spacing: avg
    };
  }

  function equalizeSpacing(points, a, b, cx, cy) {
    var p = points.points;
    var spacing = points.spacing;
    var limit = p.length;

    var first = p[0];
    var t = first[1];
    var prev = [first[2], first[3]];
    var ref = first[1];
    var delta = 0;
    var current = null;
    var avgDelta = 0;
    var x = 0;
    var y = 0;
    var gap = 0;
    var avg = 0;
    var adjust = 0;

    for (var i = 1; i < limit; i++) {
      current = p[i]; // console.log(current)

      delta = (spacing - current[4]) / spacing; // console.log(delta)

      avgDelta += Math.abs(delta); // t -= step + delta * step

      adjust = current[5] + current[5] * delta; // console.log(adjust)

      t = ref - adjust; // console.log((current[1] - ref))

      if (t < 0) {
        t += Math.PI * 2;
      }

      x = cx + Math.cos(t) * a;
      y = cy + Math.sin(t) * b;
      gap = linearDistance(prev, [x, y]); // console.log(gap)

      avg += gap;
      current[1] = t;
      current[2] = x;
      current[3] = y;
      current[4] = gap;
      current[5] = adjust;
      prev = [x, y];
      ref = t;
    }

    current = p[0];
    delta = (spacing - current[4]) / spacing;
    avgDelta += Math.abs(delta);
    gap = linearDistance(prev, [current[2], current[3]]);
    current[4] = gap;
    avg += gap;
    points.spacing = avg / limit;
    return avgDelta / limit;
  }

  function createDegrees(rotation, a, b, cx, cy) {
    // Create a reference grid of 360 degrees
    var degrees = generatePoints(360, a, b, cx, cy, rotation, 0); // Equalize the spacing between points along the edge of the ellipse

    var deviance = equalizeSpacing(degrees, a, b, cx, cy); // Repeat until average deviance from equal spacing is less than 0.01%

    while (deviance > 0.0001) {
      deviance = equalizeSpacing(degrees, a, b, cx, cy);
    }

    return degrees;
  }

  function timesFromDates(yearData) {
    return [new Date(yearData[0]).getTime(), new Date(yearData[1]).getTime(), new Date(yearData[2]).getTime(), new Date(yearData[3]).getTime(), new Date(yearData[4]).getTime(), new Date(yearData[5]).getTime(), new Date(yearData[6]).getTime(), new Date(yearData[7]).getTime(), new Date(yearData[8]).getTime(), new Date(yearData[9]).getTime(), new Date(yearData[10]).getTime(), new Date(yearData[11]).getTime(), new Date(yearData[12]).getTime(), new Date(yearData[13]).getTime()];
  }

  function createDays(year, yearData, degrees, rotation, a, b, cx, cy) {
    var daysInYear = isLeapYear(year) ? 366 : 365; // Extract times from yearData

    var times = timesFromDates(yearData);
    var points = degrees.points; // let cardinal = points[180]

    var newYear = new Date(year, 0, 1);
    var newYearTime = newYear.getTime();
    var nextYear = new Date(year + 1, 0, 1);
    var nextYearTime = nextYear.getTime();
    var delta1 = nextYearTime - times[11];
    var delta2 = times[12] - newYearTime; // Estimate angle between new year's day and perihelion

    var offset = rotation * delta2 / (delta1 + delta2); // console.log(offset)
    // console.log(rotation)

    var initialTime = newYearTime;
    var startAngle = Math.PI + offset; // Degrees array currently starts at summer solstice
    // So 0 degrees Aquarius is 210 degrees later (index 209)

    var degreeIndex = 209;
    var nextCuspAngle = points[degreeIndex][1];
    var prevCuspDegreeAngle = 0;
    var startDelta = 0;
    var startAngleDelta = 0;
    var t = 0;
    var days = [];
    var cutoff = 0;
    var fullAngle = 0;
    var actualAngle = 0;
    var nDays = 0;
    var increment = 0;
    var date = newYear;

    for (var i = 0; i < 12; i++) {
      if (i > 0) {
        // Fraction of day from previous cusp to start of first day in present sign
        startDelta = (initialTime - times[i - 1]) / 86400000;
        startAngleDelta = startDelta * prevCuspDegreeAngle;
      } // Local time of next sign cusp


      cutoff = new Date(times[i]); // Local start of day of next sign cusp

      var earlyCutoff = new Date(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate()); // Milliseconds between start of day and sign cusp

      var cutoffDelta = times[i] - earlyCutoff.getTime();
      var cutoffFraction = cutoffDelta / 86400000;
      var degreeAngle = points[degreeIndex][5];
      var cutoffAngle = degreeAngle * cutoffFraction * 360 / daysInYear; // Total milliseconds of current period
      fullAngle = startAngle - nextCuspAngle;

      if (fullAngle < 0) {
        fullAngle += Math.PI * 2;
      } // actualAngle = fullAngle - fullAngle * adjust


      actualAngle = fullAngle - cutoffAngle - startAngleDelta;
      nDays = Math.round((earlyCutoff.getTime() - initialTime) / 86400000);
      increment = actualAngle / nDays;
      startAngle -= startAngleDelta;

      for (var j = 0; j <= nDays; j++) {
        t = startAngle - increment * j;
        days.push([t, cx + Math.cos(t) * a, cy + Math.sin(t) * b, date.getDate() === 1 ? 1 : 0]);
        date.setDate(date.getDate() + 1);
      } // Advance to next pair of cusps


      startAngle = nextCuspAngle;
      prevCuspDegreeAngle = degreeAngle;
      degreeIndex += 30;
      degreeIndex %= 360;
      nextCuspAngle = points[degreeIndex][1]; // Advance cutoff date by one day

      earlyCutoff.setDate(earlyCutoff.getDate() + 1); // Reset initial time to start of first day in next sign

      initialTime = earlyCutoff.getTime();
    } // Finally, position the days between winter solstice and following new year


    startDelta = (initialTime - times[11]) / 86400000;
    startAngleDelta = startDelta * prevCuspDegreeAngle;
    nextCuspAngle = Math.PI + offset;
    fullAngle = startAngle - nextCuspAngle;

    if (fullAngle < 0) {
      fullAngle += Math.PI * 2;
    }

    actualAngle = fullAngle - startAngleDelta;
    nDays = Math.round((nextYearTime - initialTime) / 86400000);
    increment = actualAngle / nDays;
    startAngle -= startAngleDelta;

    for (var _j = 0; _j < nDays; _j++) {
      t = startAngle - increment * _j;
      days.push([t, cx + Math.cos(t) * a, cy + Math.sin(t) * b, date.getDate() === 1 ? 1 : 0]);
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

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
    var time = new Date(); // time.setFullYear(time.getFullYear() + 1)

    var currentYear = time.getFullYear(); // local time

    var daysInYear = isLeapYear(currentYear) ? 366 : 365;
    var yearData = yearlyData[currentYear];
    var cardinal0 = new Date(yearData[2]);
    var cardinal1 = new Date(yearData[5]);
    var cardinal2 = new Date(yearData[8]);
    var cardinal3 = new Date(yearData[11]);
    var perihelion = new Date(yearData[12]);
    var aphelion = new Date(yearData[13]);
    cardinal0.getTime();
    var cardinal1Time = cardinal1.getTime();
    cardinal2.getTime();
    cardinal3.getTime();
    perihelion.getTime();
    var aphelionTime = aphelion.getTime();
    var aphelionDays = (aphelionTime - cardinal1Time) / 86400000; // Approximate orbital rotation for the current year (summer solstice relative to aphelion)

    var rotation = 360 * aphelionDays / daysInYear;
    var rotationRad = rotation * Math.PI / 180;
    var outerDiameterX = w - padding * 2;
    var outerDiameterY = h - padding * 2;
    var innerDiameterX = outerDiameterX - inset * 2;
    var innerDiameterY = outerDiameterY - inset * 2;
    var a = outerDiameterX / 2;
    var b = outerDiameterY / 2;
    var rings = draw.group();
    var degrees = createDegrees(rotationRad, a, b, cx, cy);
    var degreePoints = degrees.points;
    var days = createDays(currentYear, yearData, degrees, rotationRad, a, b, cx, cy); // Draw days

    for (var i = 0; i < days.length; i++) {
      if (days[i][3] === 1) {
        rings.line(cx, cy, days[i][1], days[i][2]).stroke({
          width: thickness / 2,
          color: '#c54'
        });
      } else {
        rings.line(cx, cy, days[i][1], days[i][2]).stroke({
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

    for (var _i = 0; _i < 180; _i += 30) {
      var degree0 = degreePoints[_i];
      var degree180 = degreePoints[_i + 180];
      rings.line(degree0[2], degree0[3], degree180[2], degree180[3]).stroke({
        width: thickness,
        color: '#37b'
      });
    } // Draw sun


    rings.circle(h / 5).stroke({
      width: thickness,
      color: '#333'
    }).fill('#f9f3df').attr({
      cx: cx - w / 4,
      cy: cy
    }); // Draw cardinal Earths

    for (var _i2 = 0; _i2 < 360; _i2 += 90) {
      var cardinalAngle = degreePoints[_i2][1];
      rings.circle(h / 10).stroke({
        width: thickness,
        color: '#333'
      }).fill('#ffffff').attr({
        cx: cx + Math.cos(cardinalAngle) * (a - padding / 2),
        cy: cy + Math.sin(cardinalAngle) * (b - padding / 2)
      });
    }

    rings.transform({
      rotate: -rotation
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

})({}, SVG);
//# sourceMappingURL=earth-calendar.js.map
