# Earth Calendar

A circular calendar that shows the Earth's position in its orbit around the Sun,
highlighting important dates of the year.

## Installation

The calendar is bundled as a WordPress plugin, and has one dependency.

This plugin depends on [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/).
Install and activate the ACF plugin using the WordPress admin.

Once installed, use Custom Fields - Tools to import the `acf/acf-export.json` file.

To install the calendar itself, this project needs to be built using the instructions below.
This will generate a `release/earth-calendar.zip` file, which can be uploaded to your WordPress site.

## Usage

1. Add important Dates using the WordPress admin (the plugin adds a custom post type:
  Calendar Date). Ensure that each date has a Year assigned ('Year' is a custom taxonomy,
  and is used to filter dates: it should be set to either 'Yearly' or a specific year).
  Dates with no 'Year' assigned will not be displayed on the calendar.

2. Finally, use the \[earth_calendar\] shortcode on any WordPress post or page. You can
  add your own introductory text or instructions; the shortcode merely outputs the current
  date and the rendered SVG drawing.

## Development

Set up a local WordPress development environment using your method of choice
(VVV, Chassis, Local, etc.)

With your local development site up and running,
clone this repository within the WordPress plugins directory:

```
git clone https://github.com/adituriya/earth-calendar.git
```

Install the dev dependencies using `npm install` from inside the project directory.
Then, you can launch Rollup in watch mode using

```
npm run dev
```

`CTRL+C` will halt watch mode. Finally, to build a `.zip` release,

```
npm run build
```