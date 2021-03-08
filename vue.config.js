/*
 * @Author: 轻语
 * @Date: 2021-03-01 11:48:22
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-08 10:26:02
 * @Description: 
 */

// const path = require('path')

module.exports = {

    // 修改 src 目录 为 examples 目录
    pages: {
    index: {
        entry: 'examples/main.js',
        template: 'public/index.html',
        filename: 'index.html',
      },
    },
    css: {
      extract: false
  },
  // chainWebpack: config => {
  //   config.module
  //     .rule('js')
  //     .include.add(path.resolve(__dirname, 'packages')).end()
  //     .use('babel')
  //     .loader('babel-loader')
  //     .tap(options => {
  //       return options
  //     })
    // config.module
    //   .rule('md')
    //   .test(/\.md/)
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .end()
    //   .use('./build/md-loader/index.js')
    //   .loader('./build/md-loader/index.js')
  // },
    
  };    