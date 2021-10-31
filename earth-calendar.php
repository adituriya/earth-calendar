<?php
/*
Plugin Name:  Earth Calendar
Plugin URI:   https://www.aeoncentre.com/earth-calendar
Description:  Earth Calendar plugin for WordPress
Version:      0.1.4
Author:       Adi Turiya <adi@turiya.dev>
Author URI:   https://www.aeoncentre.com
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  earth-calendar
Domain Path:  /languages
*/

/**
 * Add a shortcode so the calendar can be easily added anywhere on the site.
 *
 * The Earth Calendar JavaScript depends on JQuery and SVG.js.
 *
 * JQuery is not the most lightweight means of performing REST API lookups,
 * but it is often already present in WordPress themes, and is bundled as part
 * of WordPress core.
 */
function earth_calendar_shortcode($attributes = [], $content = '') {
  wp_enqueue_script( 'jquery' );
  wp_enqueue_script( 'svgjs', 'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js', array(), false, true );
  wp_enqueue_script( 'earth-calendar', '/wp-content/plugins/earth-calendar/dist/earth-calendar.js', ['jquery', 'svgjs'], false, true );
  $n = rand(100000, 999999);
  $id = 'earth-calendar-' . $n;
  $content .= '<div style="border: 1px solid #caa;" id="' . $id . '"></div>';
  $content .= '<script>document.addEventListener("DOMContentLoaded", function() { EarthCalendar.calendar.drawCalendar("#' . $id . '") });</script>';
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

/**
 * Disable block editor for the custom post type.
 */
function earth_calendar_disable_block_editor($current_status, $post_type)
{
  if ( $post_type === 'calendar_date' ) return false;
  return $current_status;
}
add_filter('use_block_editor_for_post_type', 'earth_calendar_disable_block_editor', 10, 2);
