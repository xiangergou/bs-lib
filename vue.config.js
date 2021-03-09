const path = require('path')
const resolve = (dir) => {
  return path.join(__dirname, dir)
}
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
    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('examples'),
          packages: path.resolve(__dirname, './packages'),
          examples: path.resolve(__dirname, './examples'),
          'bs-lib': path.resolve(__dirname, './')
        }
      }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10 * 1024 }))
  }

    
//   chainWebpack: config => {
//     // packages和examples目录需要加入编译
//     config.module
//       .rule('js')
//       .include.add(/packages/)
//       .end()
//       .include.add(/src/)
//       .end()
//       .use('babel')
//       .loader('babel-loader')
//       .tap(options => {
//           // 修改它的选项...
//           return options;
//       });
// }
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