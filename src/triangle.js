/**
 * https://www.gamedev.net/forums/topic.asp?topic_id=295943
 */
export function isPointInTriangle (x, y, x1, y1, x2, y2, x3, y3) {

  let b1 = sideOfEdge(x, y, x1, y1, x2, y2) < 0
  let b2 = sideOfEdge(x, y, x2, y2, x3, y3) < 0
  let b3 = sideOfEdge(x, y, x3, y3, x1, y1) < 0
  return b1 === b2 && b2 === b3
}

function sideOfEdge (x, y, x1, y1, x2, y2) {
  return (x - x2) * (y1 - y2) - (x1 - x2) * (y - y2)
}
