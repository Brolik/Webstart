const { dest, parallel, series, src, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const debug = require('gulp-debug');
const flatten = require('gulp-flatten');
const postcss = require('gulp-postcss');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const outputPath = './craft/web';

const imageGlob = [
  './src/images/**/*.{gif,jpg,jpeg,svg}'
];

const sassGlob = [
  './src/components/**/*.{sass,scss}',
  './src/pages/**/*.{sass,scss}',
  './src/sass/**/*.{sass,scss}',
  './src/shared/**/*.{sass,scss}'
];

const appGlob = [
  './src/**/_*.{js,ts}'
];

const globalJsGlob = [];

const site = {
  images: () => {
    return src(imageGlob)
      .pipe(flatten())
    .pipe(dest(`${outputPath}/images`))
  },
  javascript: () => {
    return src(appGlob)
      .pipe(debug({ title: 'file:' }))
      .pipe(sourcemaps.init())
      .pipe(concat('app.min.js'))
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
    .pipe(dest(`${outputPath}/js`));
  },
  sass: () => {
    return src(sassGlob)
      .pipe(debug({ title: 'file:' }))
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded',
        includePaths: ['./src/sass', './src/shared', 'node_modules']
      })).on('error', sass.logError)
      .pipe(postcss([
        autoprefixer(),
      ]))
      .pipe(cleanCSS({ level: 2 }))
      .pipe(flatten())
      .pipe(sourcemaps.write('./maps'))
    .pipe(dest(`${outputPath}/css`))
  },
  watcher: () => {
    watch(imageGlob, series(site.images));
    watch(sassGlob, series(site.sass));
    watch(appGlob, series(site.javascript));
  }
}

exports.default = series(parallel(site.images, site.sass, site.javascript), site.watcher);
