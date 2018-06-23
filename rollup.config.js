import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import packageJson from './package.json';

const { name, version } = packageJson;
const banner = `/* ${name} myron.liu version ${version} */`;
const env = process.env.NODE_ENV;
const plugins = [
  postcss({ extensions: ['.less'], extract: `dist/${name}${env === 'production' ? '.all' : ''}.css` }),
  resolve({ jsnext: true, main: true, browser: true }),
  commonjs(),
  babel({
    babelrc: false,
    include: 'src/**',
    runtimeHelpers: false,
    presets: [
      [
        'env',
        {
          modules: false
        }
      ],
      'stage-2',
      'es2015-rollup'
    ]
  }),
  replace({
    '__VERSION__': version
  })
];
const external = ['vue', 'vuex'];
const input = 'src/index.js';

export default [{
  input,
  output: [{
    banner,
    file: `dist/${name}.common.js`,
    format: 'cjs'
  }, {
    banner,
    file: `dist/${name}.esm.js`,
    format: 'es'
  }],
  plugins: plugins,
  external
}, {
  input,
  output: {
    banner,
    file: `dist/${name}.js`,
    format: 'umd',
    globals: {
      vue: 'Vue',
      vuex: 'Vuex'
    },
    name: 'MuseModel'
  },
  plugins: [
    ...plugins,
    uglify()
  ],
  external
}];

