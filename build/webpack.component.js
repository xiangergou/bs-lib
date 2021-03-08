
//  webpack --config ./build/webpack.component.js
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const path = require("path");
var nodeExternals = require('webpack-node-externals');
// const TerserJSPlugin = require('terser-webpack-plugin')

const Components = require('./get-components')();

const entryHash = {}
Components.forEach(c => {
  entryHash[c] = `./packages/${c}/index.js`;
});

// 不打包第三方模块内容
var externals = [Object.assign({
  vue: 'vue'
}), nodeExternals()];


module.exports = {
      mode: 'production',
      entry: entryHash,
      output: {
          filename: '[name].js',
          path: path.resolve(__dirname, '../lib'),
          publicPath: '/',
          libraryTarget: 'umd'
      },
      externals:externals,
      module:{
        rules:[
              {
                test: /\.vue$/,
                use: [
                  {
                    loader: 'vue-loader',
                  }
                ]
              },
              {
                test: /\.m?jsx?$/,
                use: [
                  {
                    loader: 'cache-loader',
                  },
                  {
                    loader: 'babel-loader'
                  }
                ]
              },
        ]
      },
      plugins:[
          new VueLoaderPlugin(),
          new webpack.ProgressPlugin(),
      ],
      optimization: {
        minimize: false,
      }
}

 





















// const path = require('path');
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');

// const Components = require('./get-components')();
// console.log('Components',Components)
// const entry = {};
// Components.forEach(c => {
//   entry[c] = `./packages/${c}/index.js`;
// });
// const webpackConfig = {
//   mode: 'production',
//   entry: entry,
//   output: {
//     path: path.resolve(process.cwd(), './lib'),
//     filename: '[name].js',
//     chunkFilename: '[id].js',
//     libraryTarget: 'umd'
//   },
//   resolve: {
//     extensions: ['.js', '.vue', '.json']
//   },
//   performance: {
//     hints: false
//   },
//   stats: 'none',  
//   module: {
//     rules: [{
//       test: /\.js$/,
//       loader: 'babel-loader',
//       exclude: /node_modules/
//     }, {
//       test: /\.vue$/,
//       loader: 'vue-loader'
//     }]
//   },
//   plugins: [
//     new ProgressBarPlugin(),
//     new VueLoaderPlugin()
//   ]
// };

// module.exports = webpackConfig;
