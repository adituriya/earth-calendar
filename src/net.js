

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