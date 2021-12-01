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
 * Determine if the given point is inside the ellipse defined by the provided parameters.
 * 
 * https://math.stackexchange.com/a/76463
 * 
 * @param {number} x X coordinate of test point
 * @param {number} y Y coordinate of test point
 * @param {number} a Semi-major axis of ellipse
 * @param {number} b Semi-minor axis of ellipse
 * @param {number} rotation Drawing rotation in radians
 * @returns {boolean} Whether or not the point is in bounds
 */
export function isPointInEllipse (x, y, a, b, rotation) {
  // Rotate the point into position (so we can calculate against the non-rotated ellipse)
  const rotationSin = Math.sin(rotation)
  const rotationCos = Math.cos(rotation)
  const rx = x * rotationCos - y * rotationSin
  const ry = y * rotationCos + x * rotationSin

  // Use the equation of the ellipse area to determine if the point is in bounds
  const bounds = (rx * rx) / (a * a) + (ry * ry) / (b * b)
  return bounds <= 1 ? true : false
}
