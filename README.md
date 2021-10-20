# Earth Calendar

A circular calendar that shows the Earth's position in its orbit
around the Sun.

## Installation

The calendar is bundled as a WordPress plugin. Install it manually
using `release/earth-calendar.zip` and activate it like any other plugin.

The plugin also depends on the [Pods](https://wordpress.org/plugins/pods/) framework.
Install and activate the Pods plugin using the WordPress admin.

Next, under Pods Admin - Components, you'll need to activate the 'Migrate: Packages'
component.

Finally, use Pods Admin - Migrate Packages to import the `pods/pods-package.json`
file.

## Usage

1. Add Important Dates (custom post type) using the WordPress admin.
  Ensure each date has a Year assigned (custom taxonomy, used to filter dates). 

2. Use the \[earth_calendar\] shortcode on any WordPress post or page.

## Development

You can use [VVV](https://varyingvagrantvagrants.org/docs/en-US/installation/) for local development.

Once VVV is installed and working, choose a development site (or create a new one)
and clone this repository into the plugins directory, e.g.

```
cd ~/vvv-local/www/wordpress-one/public_html/wp-content/plugins
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