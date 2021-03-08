/*
 * @Author: 轻语
 * @Date: 2021-03-08 10:21:17
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-08 11:53:35
 * @Description: 
 */

'use strict';

const gulp = require('gulp')
const { src, dest } = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
// const rename = require('gulp-rename')
const concat = require('gulp-concat')

function compileCss() {
  return src('./packages/theme-chalk/css/*.scss')
    .pipe(sass.sync())
    .pipe(cssmin())
    .pipe(dest('./lib/theme-chalk'));
}

function compileAll() {
    return src('./packages/theme-chalk/css/src/*.scss')
        .pipe(sass.sync())
        .pipe(concat('index.css'))
        .pipe(cssmin())
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(dest('./lib/theme-chalk'));
}

function copyfont() {
  return src('./packages/theme-chalk/fonts/**')
    .pipe(dest('./lib/theme-chalk/fonts'));
}

function copyImg() {
  return src('./packages/theme-chalk/imgs/**')
    .pipe(dest('./lib/theme-chalk/imgs'));
}

gulp.task('css',compileCss, compileAll)
gulp.task('cssAll', compileAll)
gulp.task('font', copyfont)
gulp.task('img', copyImg)