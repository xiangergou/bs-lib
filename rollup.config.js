// rollup.config.js
const fs = require('fs-extra');
const path = require('path');
const pkg = require("./package.json")

import vue from 'rollup-plugin-vue2'
import postcss from 'rollup-plugin-postcss'
import postcssScss from 'postcss-scss'
import autoprefixer from 'autoprefixer'
import base64 from 'postcss-base64'
import url from '@rollup/plugin-url';

import progress from 'rollup-plugin-progress'
import filesize from 'rollup-plugin-filesize';

function isDir(dir) {
  return fs.lstatSync(dir).isDirectory();
}

const packages = {};
const dir = path.join(__dirname, './packages');
const files = fs.readdirSync(dir);
files.forEach(file => {
    const absolutePath = path.join(dir, file);
    if (isDir(absolutePath) && file !=='theme-chalk') {
        packages[file] =`packages/${file}/index.js`;
    }
});
const allScript = `${pkg.name}.all`
packages[allScript] = `packages/index.js`;

function createRollupConfig (file, name) {
  const config = {
    input: file,
    output: {
        file: name === allScript ? `lib/index.js` : `lib/${name}/index.js`,
        format: 'es',
        name: name,
        sourcemap: true
    },
    plugins: [
      vue(),
      postcss({
        extract: true,
        parser: postcssScss,
        plugins: [
          base64({
            extensions: ['.png', '.jpeg'],
            root: './packages/',
          }),
          autoprefixer({ add: true }),
        ]
      }),
      url({
        limit: 10 * 1024,
        emitFiles: true
          //include: ['.svg']
      }),
      progress(),
      filesize()
    ]
  }
  return config
}

const buildPackages = []
for (let name in packages) {
  const file = packages[name]
  buildPackages.push(createRollupConfig(file, name))
}

export default buildPackages;