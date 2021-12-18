# Earth Calendar

A circular calendar that shows the Earth's position in its orbit
around the Sun.

## Installation

The calendar is bundled as a WordPress plugin. Install it manually
using `release/earth-calendar.zip` and activate it like any other plugin.

The plugin also depends on [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/).
Install and activate the ACF plugin using the WordPress admin.

Then, use Custom Fields - Tools to import the `acf/acf-export.json` file.

## Usage

1. Add Important Dates (custom post type) using the WordPress admin.
  Ensure each date has a Year assigned (custom taxonomy, used to filter dates). 

2. Use the \[earth_calendar\] shortcode on any WordPress post or page.

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

Finally, to build a `.zip` release,

```
npm run build
```