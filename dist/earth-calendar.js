/*! earth-calendar v0.1.0 BUILT: Fri Oct 01 2021 19:52:27 GMT-0400 (Eastern Daylight Time) */;
var EarthCalendar = (function (exports, svg_js) {
  'use strict';

  function drawCalendar(element, width, height) {
    var draw = svg_js.SVG().addTo(element).size(width, height);
    draw.ellipse(460, 360).stroke({
      width: 1,
      color: '#333'
    }).fill('none').move(20, 20);
    console.log(draw);
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
