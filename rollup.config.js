import * as pkg from './package.json'
import { babel } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

const buildDate = Date()

const headerShort = `/*! ${pkg.name} v${pkg.version} BUILT: ${buildDate} */;`

const getBabelConfig = (targets, corejs = false) =>
  babel({
    include: 'src/**',
    babelHelpers: 'runtime',
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: targets || pkg.browserslist
          // useBuiltIns: 'usage'
          // corejs: 3
        }
      ]
    ],
    plugins: [
      ['@babel/plugin-proposal-optional-chaining'],
      [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        {
          loose: true
        }
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: corejs,
          helpers: true,
          useESModules: true
        }
      ]
    ]
  })

const config = (node, min, esm = false) => ({
  external: [
    '@svgdotjs/svg.js',
    // '@svgdotjs/svg.filter.js',
    // '@svgdotjs/svg.panzoom.js'
  ],
  input: 'src/index.js',
  output: {
    file: esm
      ? './dist/earth-calendar.esm.js'
      : node
      ? './dist/earth-calendar.node.js'
      : min
      ? './dist/earth-calendar.min.js'
      : './dist/earth-calendar.js',
    format: esm ? 'esm' : node ? 'cjs' : 'iife',
    name: 'EarthCalendar',
    sourcemap: true,
    banner: headerShort,
    // remove Object.freeze
    freeze: false,
    globals: {
      '@svgdotjs/svg.js': 'SVG'
    }
  },
  treeshake: {
    // property getter have no sideeffects
    propertyReadSideEffects: false
  },
  plugins: [
    resolve(),
    getBabelConfig(node && 'maintained node versions'),
    commonjs(),
    filesize(),
    !min
      ? {}
      : terser({
          // output: {
          //   preamble: headerShort
          // }
        })
  ]
})

// [node, minified, esm]
const modes = [[false], [false, true]]

export default modes.map(m => config(...m))