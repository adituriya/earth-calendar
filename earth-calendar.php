<?php
/*
Plugin Name:  Earth Calendar
Plugin URI:   https://www.aeoncentre.com/earth-calendar
Description:  Earth Calendar plugin for WordPress
Version:      0.4.5
Author:       Adi Turiya <adi@turiya.dev>
Author URI:   https://www.aeoncentre.com
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  earth-calendar
Domain Path:  /languages
*/

/**
 * Output a single custom option (see `override_options`).
 * 
 * If the provided option is present in WordPress, output a JavaScript key-value pair.
 */
function output_custom_option($option, $value) {
  if ($opt = get_option($option)) {
    return ' ' . $value . ': "' . $opt . '",' . "\n";
  }
  return '';
}

/**
 * Output javascript for overriding default options.
 */
function override_options() {
  $overrides = '{ options: {';
  $overrides .= "},\n";

  // Load custom tags
  $overrides .= 'tags: {';
  $tag_map = array(
    'earth_calendar_settings_cosmic_dawn' => 'cosmicDawn',
    'earth_calendar_settings_cosmic_midnight' => 'cosmicMidnight',
    'earth_calendar_settings_cosmic_sunset' => 'cosmicSunset',
    'earth_calendar_settings_cosmic_midday' => 'cosmicMidday',
    'earth_calendar_settings_the_sun' => 'theSun',
    'earth_calendar_settings_the_ecliptic' => 'theEcliptic',
    'earth_calendar_settings_the_zodiac' => 'theZodiac',
    'earth_calendar_settings_aries_ingress' => 'ariesIngress',
    'earth_calendar_settings_taurus_ingress' => 'taurusIngress',
    'earth_calendar_settings_gemini_ingress' => 'geminiIngress',
    'earth_calendar_settings_cancer_ingress' => 'cancerIngress',
    'earth_calendar_settings_leo_ingress' => 'leoIngress',
    'earth_calendar_settings_virgo_ingress' => 'virgoIngress',
    'earth_calendar_settings_libra_ingress' => 'libraIngress',
    'earth_calendar_settings_scorpio_ingress' => 'scorpioIngress',
    'earth_calendar_settings_sagittarius_ingress' => 'sagittariusIngress',
    'earth_calendar_settings_capricorn_ingress' => 'capricornIngress',
    'earth_calendar_settings_aquarius_ingress' => 'aquariusIngress',
    'earth_calendar_settings_pisces_ingress' => 'piscesIngress',
    'earth_calendar_settings_perihelion' => 'perihelion',
    'earth_calendar_settings_aphelion' => 'aphelion',
  );
  foreach ($tag_map as $tag => $variable) {
    $overrides .= output_custom_option($tag, $variable);
  }
  $overrides .= '}';
  
  return $overrides . '}';
}

/**
 * Create the [earth_calendar] shortcode for adding the Earth Calendar to site content.
 *
 * The present implementation depends on jQuery, svg.js and svg.filter.js.
 *
 * jQuery is bundled with WordPress core. the SVG.js dependencies could be included in the
 * Rollup build, but here they are loaded from the jsdelivr CDN.
 */
function earth_calendar_shortcode($attributes = [], $content = '') {

  // $content = 'Test!';

  // Load required fonts
  wp_enqueue_style( 'earth-calendar-fonts', 'https://fonts.googleapis.com/css2?family=Niconne&display=swap', false );
  wp_enqueue_style( 'earth-calendar-style', plugin_dir_url( __FILE__ ) . 'css/earth-calendar.css' );

  // Load required JavaScript libraries
  wp_enqueue_script( 'jquery', false, array(), false, false );
  wp_enqueue_script( 'svgjs', 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.1.1/dist/svg.min.js', array(), false, true );
  wp_enqueue_script( 'svgjs-filter', 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.filter.js@3.0.8/dist/svg.filter.min.js', ['svgjs'], false, true );
  wp_enqueue_script( 'earth-calendar', '/wp-content/plugins/earth-calendar/dist/earth-calendar.js', ['jquery', 'svgjs', 'svgjs-filter'], false, true );
  
  // Create a random ID for this calendar (in case multiple are included on the same page)
  $n = rand(1, 999999);
  $id = 'earth-calendar-' . $n;

  // Output the HTML container elements
  $content .= '<p id="' . $id . '-label" class="entry-meta earth-calendar-label"></p>';
  $content .= '<div id="' . $id . '-frame" class="earth-calendar-frame">';
  $content .= '  <div id="' . $id . '" class="earth-calendar-svg"></div>';
  $content .= '  <div id="' . $id . '-tooltip" class="entry-meta earth-calendar-tooltip"></div>';
  $content .= '</div>';

  // Output the JavaScript that renders the calendar
  $content .= '<script>';
  $content .= 'document.addEventListener("DOMContentLoaded", function() { ';

  // Draw the calendar, overriding any options that have been configured in WP Settings
  $content .= 'EarthCalendar.drawCalendar("#' . $id . '", ' . override_options() . ');';
  $content .= '});</script>';

  return $content;
}
add_shortcode( 'earth_calendar', 'earth_calendar_shortcode' );

/**
 * Add custom post type for important calendar dates.
 */
function earth_calendar_post_type() {
  $labels = array(
    'name'               => _x( 'Calendar dates', 'post type general name' ),
    'singular_name'      => _x( 'Calendar date', 'post type singular name' ),
    'menu_name'          => 'Calendar',
    'all_items'          => 'All Dates',
    'add_new_item'       => 'Add New Date',
    'add_new'            => 'Add New Date',
    'edit_item'          => 'Edit Date',
    'not_found'          => 'No dates found.',
    'not_found_in_trash' => 'No dates found in Trash.'
  );
    $args = array(
    'labels'        => $labels,
    'description'   => 'Important calendar dates',
    'public'        => true,
    'menu_position' => 45,
    'menu_icon'     => 'dashicons-calendar-alt',
    'supports'      => array( 'title' ),
    'has_archive'   => true,
    'show_in_rest'  => true,
    'query_var'     => true,
    'exclude_from_search' => true
  );
  register_post_type( 'calendar_date', $args );
}
add_action( 'init', 'earth_calendar_post_type' );

/**
 * Taxonomy for years, so we can easily query all dates for a given year.
 */
function earth_calendar_year_taxonomy () {
  $labels = array(
    'name'              => _x( 'Year', 'taxonomy general name' ),
    'singular_name'     => _x( 'Year', 'taxonomy singular name' ),
    'search_items'      => __( 'Search Years' ),
    'all_items'         => __( 'All Years' ),
    'edit_item'         => __( 'Edit Year' ),
    'update_item'       => __( 'Update Year' ),
    'add_new_item'      => __( 'Add New Year' ),
    'new_item_name'     => __( 'New Year' ),
    'menu_name'         => __( 'Years' ),
  );
  $args   = array(
    'hierarchical'      => false,
    'labels'            => $labels,
    'show_ui'           => true,
    'show_admin_column' => true,
    'show_in_rest'      => true,
    'query_var'         => true,
    'rewrite'           => [ 'slug' => 'year' ],
  );
  register_taxonomy( 'year', [ 'calendar_date' ], $args );
}
add_action( 'init', 'earth_calendar_year_taxonomy' );
