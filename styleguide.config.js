/*
 * @Author: 轻语
 * @Date: 2021-03-02 16:34:48
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-02 17:37:32
 * @Description: 
 */

const path = require('path')
const themeObj = require('./styleguide/theme.js')

module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	components: 'packages/**/*.vue',
	theme: themeObj,
	styleguideDir: 'docs', // 打包文件放置的位置
	require: [path.join(__dirname, 'styleguide/global.requires.js')], // 全局vue组件使用的插件
	// components: 'src/components/**/[A-Z]*.vue',
	// defaultExample: true,
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// },
	exampleMode: 'expand'
}
