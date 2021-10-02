import { SVG } from '@svgdotjs/svg.js'


export function drawCalendar(element, width, height) {
  const draw = SVG().addTo(element).size(width, height)
  var ellipse = draw.ellipse(460, 360).stroke({ width: 1, color: '#333' }).fill('none').move(20, 20)
  console.log(draw)
  return draw
}