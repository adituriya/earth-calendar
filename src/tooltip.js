import jQuery, { param } from 'jquery'
const $ = jQuery

export function showTag (svg, element, selector, x, y) {
  const showing = svg.data('show')
  // svg.addClass('')
  if (showing && showing !== selector) {
    hideTag(svg, element, showing)
  }
  const popup = $(element + '-' + selector)
  popup.css({
    top: y + 'px',
    left: x + 'px'
  })
  popup.show()
}

function hideTagPopup (svg, popup) {
  if (popup.is(':visible')) {
    if (popup.is(':hover')) {
      popup.on('mouseleave', function () {
        setTimeout(() => {
          popup.hide()
          svg.data('show', null)
        }, 100)
      })
    } else {
      setTimeout(() => {
        popup.hide()
        svg.data('show', null)
      }, 100)
    }
  }
}

export function hideTag (svg, element, selector) {
  const popup = $(element + '-' + selector)
  hideTagPopup(svg, popup)
}

export function drawTagEvents (svg, target, element, selector, conditional, condition, dimensions) {
  const offset = $(element + '-frame').offset()
  const popup = $(element + '-' + selector)
  target.on('mouseover', (event) => {
    const zoom = svg.data('zoom')
    const zoomcss = svg.hasClass('zoom')
    if ((!conditional || (conditional && !!zoom == condition)) && !popup.is(':visible')) {
      svg.data('show', selector)
      // svg.parent().parent().addClass('tag-' + selector)
      showTag(svg, element, selector, 
        Math.min(event.pageX - offset.left, dimensions.cx + dimensions.cx / 20),
        event.pageY - offset.top)
    }
  })
  target.on('mouseleave', () => {
    // svg.parent().parent().removeClass('tag-' + selector)
    const zoom = svg.data('zoom')
    if ((!conditional || (conditional && !!zoom == condition)) && popup.is(':visible')) {
      hideTagPopup(svg, popup)
    }
  })
}

function estimatePosition (tooltip, dimensions, details) {
  const w = tooltip.width()
  const gap = (dimensions.cx - 360) / 2
  let x = dimensions.cx
  let y = dimensions.cy
  if (details.onLeft) {
    x = dimensions.cx / 20
  } else {
    x += dimensions.cx / 20
  }
  if (details.onTop) {
    tooltip.css({
      left: x,
      top: y + dimensions.cy / 20
    })
  } else {
    tooltip.css({
      left: x,
      bottom: y + dimensions.cy / 20 + 15
    })
  }
  
}

export function drawTooltip (element, selector, title, text, zoom, dimensions, details) {
  const tooltip = $(element + '-tooltip').clone().appendTo(element + '-frame')
  tooltip.attr({
    id: (element.substr(1) + '-' + selector)
  })
  if (!zoom) {
    estimatePosition(tooltip, dimensions, details)
  }
  tooltip.addClass(zoom ? 'tag-zoom' : 'tag-full').addClass('tag-' + selector)
  tooltip.html('<p><strong>' + title + ' &ndash; ' + text + '</strong></p>')
}

export function addTooltip (element, selector, title, text, zoom, dimensions, details) {
  const tooltip = $(element + '-tooltip')
  $('<div class="tooltip-text ' + selector + '"><p><strong>' + title + ' &ndash; ' + text + '</strong></p></div>').hide().appendTo(tooltip)
}