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
export function parametricAngle (target, a, b) {

  // Convert target angle to parametric angle
  let t = Math.atan(Math.tan(target) * a / b)

  // Determine what quarter the angle is in
  const quarter = Math.ceil(target / (Math.PI / 2))

  // Rotate result into the correct quarter
  if (quarter === 2 || quarter === 3) {
    t += Math.PI
  } else if (quarter === 4) {
    t += 2 * Math.PI
  }

  return t
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
 export function ellipticRadius (major, minor, angle) {
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
// function linearDistance (p1, p2) {
//   const xd = Math.abs(p2[0] - p1[0])
//   const yd = Math.abs(p2[1] - p1[1])
//   return Math.sqrt(xd * xd + yd * yd)
// }
