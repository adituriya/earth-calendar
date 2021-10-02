<?php
/*
Plugin Name:  Earth Calendar
Plugin URI:   https://www.aeoncentre.com/earth-calendar
Description:  Earth Calendar plugin for WordPress
Version:      0.1.0
Author:       Adi Turiya <adi@turiya.dev>
Author URI:   https://www.aeoncentre.com
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  earth-calendar
Domain Path:  /languages
*/

add_shortcode('earth_calendar', 'earth_calendar_shortcode');
function earth_calendar_shortcode($attributes = [], $content = '') {
  wp_enqueue_script('svgjs', 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js', array(), false, true);
  wp_enqueue_script('earth-calendar', '/wp-content/plugins/earth-calendar/dist/earth-calendar.js', ['svgjs'], false, true);
  $n = rand(100000, 999999);
  $id = 'earth-calendar-' . $n;
  $content .= '<div id="' . $id . '"></div>';
  $content .= '<script>document.addEventListener("DOMContentLoaded", function() { EarthCalendar.calendar.drawCalendar("#' . $id . '", 500, 400) });</script>';
  return $content;
}
