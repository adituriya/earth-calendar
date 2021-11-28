import { options } from './options.js'

function quarterRadialGradient (svg, color1, color2, extend) {
  const start = extend ? 0.5 : 0.333
  return svg.gradient('radial', function (add) {
    add.stop(start, color1)
    add.stop(1, color2)
  }).from(1, 1).to(1, 1).radius(0.9)
}

export function createGradients (svg) {
  return {
    quarter1: quarterRadialGradient(svg, options.colorQuarterRed1, options.colorQuarterRed2),
    quarter2: quarterRadialGradient(svg, options.colorQuarterBlack1, options.colorQuarterBlack2),
    quarter3: quarterRadialGradient(svg, options.colorQuarterYellow1, options.colorQuarterYellow2),
    quarter4: quarterRadialGradient(svg, options.colorQuarterWhite1, options.colorQuarterWhite2, true),
    quarter1Hover: quarterRadialGradient(svg, options.colorQuarterRedHover1, options.colorQuarterRedHover2),
    quarter2Hover: quarterRadialGradient(svg, options.colorQuarterBlackHover1, options.colorQuarterBlackHover2),
    quarter3Hover: quarterRadialGradient(svg, options.colorQuarterYellowHover1, options.colorQuarterYellowHover2),
    quarter4Hover: quarterRadialGradient(svg, options.colorQuarterWhiteHover1, options.colorQuarterWhiteHover2, true)
  }
}