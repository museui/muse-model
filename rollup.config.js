import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import packageJson from './package.json';

const name = packageJson.name;
const banner = `/* ${name} myron.liu version ${packageJson.version} */`;
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
    '__VERSION__': packageJson.version
  })
];
const external = ['vue', 'vuex'];
const output = [];
const input = 'src/index.js';

switch (env) {
  case 'module':
    output.push({
      banner,
      file: `dist/${name}.common.js`,
      format: 'cjs'
    });
    output.push({
      banner,
      file: `dist/${name}.esm.js`,
      format: 'es'
    });
    break;
  case 'production':
    output.push({
      banner,
      file: `dist/${name}.js`,
      format: 'umd',
      globals: {
        vue: 'Vue',
        vuex: 'Vuex'
      },
      name: 'MuseModel'
    });
    // plugins.push(uglify());
    break;
}

export default {
  input,
  output,
  plugins,
  external
};
