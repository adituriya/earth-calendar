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

Clone this repository into a local project directory, e.g.

```
cd ~/Projects
git clone https://github.com/adituriya/earth-calendar.git
```

then create a symbolic link to the VVV site you will be using for development.
For example,

```
ln -s ./earth-calendar ~/vvv-local/www/wordpress-one/public_html/wp-content/plugins/earth-calendar
```