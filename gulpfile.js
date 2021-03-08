/*
 * @Author: 轻语
 * @Date: 2021-03-08 10:21:17
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-08 11:17:36
 * @Description: 
 */

'use strict';

const gulp = require('gulp')
const { src, dest } = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
// const rename = require('gulp-rename')
// const concat = require('gulp-concat')

function compileCss() {
  return src('./packages/theme-chalk/*.scss')
    .pipe(sass.sync())
    .pipe(cssmin())
    .pipe(dest('./lib/theme-chalk'));
}

// function compileAll() {
//     return src('./packages/theme-chalk/src/*.scss')
//         .pipe(sass.sync())
//         .pipe(concat('index.css'))
//         .pipe(cssmin())
//         // .pipe(rename({
//         //     suffix: '.min'
//         // }))
//         .pipe(dest('./lib/theme-chalk'));
// }


gulp.task('css',compileCss)
// gulp.task('all',compileAll)