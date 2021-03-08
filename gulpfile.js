
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

gulp.task('css',compileCss, compileAll)
gulp.task('cssAll', compileAll)
gulp.task('font', copyfont)