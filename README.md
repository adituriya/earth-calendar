# Earth Calendar

A circular calendar that shows the Earth's position in its orbit
around the Sun.

## Installation

The calendar is bundled as a WordPress plugin. Install it manually
using `release/earth-calendar.zip` and activate it like any other plugin.

## Usage

Use the \[earth_calendar\] shortcode on any WordPress
post or page.

## Development

You can use [VVV](https://varyingvagrantvagrants.org/docs/en-US/installation/) for local development.

Once VVV is installed and working, choose a development site (or create a new one)
and clone this repository into the plugins directory, e.g.

```
cd ~/vvv-local/www/wordpress-one/public_html/wp-content/plugins
git clone https://github.com/adituriya/earth-calendar.git
```

From the project directory, you can launch Rollup in watch mode using
the npm `dev` script

```
cd earth-calendar
npm run dev
```

Finally, to build a `.zip` release,

```
npm run build
```