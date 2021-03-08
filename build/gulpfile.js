'use strict';

// const gulp = require('gulp')
const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat')
const cssmin = require('gulp-cssmin');


function compileCss() {
  return src('../packages/theme-chalk/*.scss')
    .pipe(sass.sync())
    // .pipe(autoprefixer({
    //   browsers: ['ie > 9', 'last 2 versions'],
    //   cascade: false
    // }))
    .pipe(cssmin())
    .pipe(dest('../lib'));
}

function compileAll() {
    return src('./packages/theme-chalk/src/*.scss')
      .pipe(sass.sync())
      // .pipe(autoprefixer({
      //   browsers: ['ie > 9', 'last 2 versions'],
      //   cascade: false
      // }))
      .pipe(concat('index.css'))
      .pipe(cssmin())
      // .pipe(rename({
      //     suffix: '.min'
      // }))
      .pipe(dest('./lib'));
}

// function copyfont() {
//   return src('./src/fonts/**')
//     .pipe(cssmin())
//     .pipe(dest('./lib/fonts'));
// }


exports.build = series(compileCss, compileAll);


// gulp.task('css',compileCss)
// gulp.task('all', compileAll)


// function compile() {
//   return src('./src/*.scss')
//     .pipe(sass.sync())
//     .pipe(autoprefixer({
//       browsers: ['ie > 9', 'last 2 versions'],
//       cascade: false
//     }))
//     .pipe(cssmin())
//     .pipe(dest('./lib'));
// }

// function copyfont() {
//   return src('./src/fonts/**')
//     .pipe(cssmin())
//     .pipe(dest('./lib/fonts'));
// }


// 'use strict';

// const gulp = require('gulp')
// const { series, src, dest } = require('gulp');
// const sass = require('gulp-sass');
// const cssmin = require('gulp-cssmin');
// const rename = require('gulp-rename')
// const concat = require('gulp-concat')

// function compileCss() {
//   return src('./components/theme-chalk/*.scss')
//     .pipe(sass.sync())
//     .pipe(cssmin())
//     .pipe(dest('./dist/css'));
// }

// function compileAll() {
//     return src('./components/theme-chalk/*.scss')
//         .pipe(sass.sync())
//         .pipe(concat('index.css'))
//         .pipe(cssmin())
//         // .pipe(rename({
//         //     suffix: '.min'
//         // }))
//         .pipe(dest('./dist/css'));
// }


// gulp.task('css',compileCss)
// gulp.task('all',compileAll)

// // function copyfont() {
// //   return src('./src/fonts/**')
// //     .pipe(cssmin())
// //     .pipe(dest('./lib/fonts'));
// // }
