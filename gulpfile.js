// The require statement tells Node to look into the node_modules folder for a package
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
'use strict';
const { src, dest, watch, series, parallel } = require('gulp');
const colors = require('ansi-colors');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const bourbon = require('node-bourbon').includePaths;
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');
const panini = require('panini');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const removeCode = require('gulp-remove-code');
const removeLog = require('gulp-remove-logging');
const prettyHtml = require('gulp-pretty-html');
const sassLint = require('gulp-sass-lint');
const htmllint = require('gulp-htmllint');
const jshint = require('gulp-jshint');
const htmlreplace = require('gulp-html-replace');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const accessibility = require('gulp-accessibility');
const babel = require('gulp-babel');
const ghPages = require('gulp-gh-pages');
const chalk = require('chalk');
const log = console.log;

// File paths
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js'
}

// ------------ DEVELOPMENT TASKS -------------

// COMPILE SCSS INTO CSS
function compileSCSS() {
  log(chalk.red.bold('---------------COMPILING SCSS---------------'));
  return src(['src/assets/scss/main.scss', 'src/assets/scss/rtl.scss'])
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: 'map',
      sourceMap: 'scss',
      includePaths: bourbon
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream());
}

// USING PANINI, TEMPLATE, PAGE AND PARTIAL FILES ARE COMBINED TO FORM HTML MARKUP
function compileHTML() {
  log(chalk.red.bold('---------------COMPILING HTML WITH PANINI---------------'));
  panini.refresh();
  return src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      // pageLayouts: {
           // All pages inside src/pages/blog will use the blog.html layout
      //     'blog': 'blog'
      // }
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// COPY CUSTOM JS
function compileJS() {
  log(chalk.red.bold('---------------COMPILE CUSTOM.JS---------------'));
  return src(['src/assets/js/**/*.js'])
    .pipe(babel())
    .pipe(dest('dist/assets/js/'))
    .pipe(browserSync.stream());
}

// RESET PANINI'S CACHE OF LAYOUTS AND PARTIALS
function resetPages(done) {
  log(chalk.red.bold('---------------CLEARING PANINI CACHE---------------'));
  panini.refresh();
  done();
}

// SCSS LINT
function scssLint() {
  log(chalk.red.bold('---------------SCSS LINTING---------------'));
  return src('src/assets/scss/**/*.scss')
    .pipe(sassLint({
      configFile: '.scss-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

// HTML LINTER
function htmlLint() {
  log(chalk.red.bold('---------------HTML LINTING---------------'));
  return src('dist/**/*.html')
    .pipe(htmllint({}, htmllintReporter));
}

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      log(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
    });
    process.exitCode = 1;
  } else {
    log(chalk.green.bold('---------------NO HTML LINT ERROR---------------'));
  }
}

// JS LINTER
function jsLint() {
  return src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

// WATCH FILES
function watchFiles() {
  watch('src/**/*.html', compileHTML);
  watch(['src/assets/scss/**/*.scss', 'src/assets/scss/*.scss'] , compileSCSS);
  watch('src/assets/js/*.js', compileJS);
  watch('src/assets/img/**/*', copyImages);
}


// BROWSER SYNC
function browserSyncInit(done) {
  log(chalk.red.bold('---------------BROWSER SYNC INIT---------------'));
  browserSync.init({
    server: './dist'
  });
  return done();
}

// DEPLOY TO GIT
function deploy() {
  return src('/*')
    .pipe(ghPages({
      remoteUrl: 'https://github.com/johndavemanuel/bootstrap4-gulp-starter-template.git',
      branch: 'master',
      message: 'Automated push of contents via gulp'
    }));
}

// ------------ OPTIMIZATION TASKS -------------

// COPIES AND MINIFY IMAGE TO DIST
function copyImages() {
  log(chalk.red.bold('---------------OPTIMIZING IMAGES---------------'));
  return src('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(newer('dist/assets/img/'))
    .pipe(imagemin())
    .pipe(dest('dist/assets/img/'))
    .pipe(browserSync.stream());
}

// PLACES FONT FILES IN THE DIST FOLDER
function copyFont() {
  log(chalk.red.bold('---------------COPYING FONTS INTO DIST FOLDER---------------'));
  return src([
      'src/assets/font/*',
    ])
    .pipe(dest('dist/assets/fonts'))
    .pipe(browserSync.stream());
}

// COPY JS VENDOR FILES
function jsVendor() {
  log(chalk.red.bold('---------------COPY JAVASCRIPT VENDOR FILES INTO DIST---------------'));
  return src([
      'src/assets/vendor/js/*',
    ])
    .pipe(dest('dist/assets/vendor/js'))
    .pipe(browserSync.stream());
}

// COPY CSS VENDOR FILES
function cssVendor() {
  log(chalk.red.bold('---------------COPY CSS VENDOR FILES INTO DIST---------------'));
  return src([
      'src/assets/vendor/css/*',
    ])
    .pipe(dest('dist/assets/vendor/css'))
    .pipe(browserSync.stream());
}

// PRETTIFY HTML FILES
function prettyHTML() {
  log(chalk.red.bold('---------------HTML PRETTIFY---------------'));
  return src('dist/**/*.html')
    .pipe(prettyHtml({
      indent_size: 4,
      indent_char: ' ',
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
    }))
    .pipe(dest('dist'));
}

// DELETE DIST FOLDER
function cleanDist(done) {
  log(chalk.red.bold('---------------REMOVING OLD FILES FROM DIST---------------'));
  del.sync('dist');
  return done();
}

// CREATE DOCS FOLDER FOR DEMO
function generateDocs() {
  log(chalk.red.bold('---------------CREATING DOCS---------------'));
  return src([
      'dist/**/*',
    ])
    .pipe(dest('docs'))
    .pipe(browserSync.stream());
}

// ACCESSIBILITY CHECK
function HTMLAccessibility() {
  return src('dist/**/*.html')
    .pipe(accessibility({
      force: true
    }))
    .on('error', console.log)
    .pipe(accessibility.report({
      reportType: 'txt'
    }))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(dest('accessibility-reports'));
}

// ------------ PRODUCTION TASKS -------------

// CHANGE TO MINIFIED VERSIONS OF JS AND CSS
function renameSources() {
  log(chalk.red.bold('---------------RENAMING SOURCES---------------'));
  return src('dist/**/*.html')
    .pipe(htmlreplace({
      'js': 'assets/js/main.min.js',
      'css': 'assets/css/main.min.css'
    }))
    .pipe(dest('dist/'));
}

// CONCATINATE JS SCRIPTS
function concatScripts() {
  log(chalk.red.bold('---------------CONCATINATE SCRIPTS---------------'));
  return src([
      'src/assets/vendor/js/jquery.js',
      'src/assets/vendor/js/popper.js',
      'src/assets/vendor/js/bootstrap.js',
      'src/assets/js/util/autoPadding.js',
      'src/assets/js/util/crossPlatform.js',
      'src/assets/js/*'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/assets/js'))
    .pipe(browserSync.stream());
}

// MINIFY SCRIPTS
function minifyScripts() {
  log(chalk.red.bold('---------------MINIFY SCRIPTS---------------'));
  return src('dist/assets/js/main.js')
    .pipe(removeLog())
    .pipe(removeCode({
      production: true
    }))
    .pipe(uglify().on('error', console.error))
    .pipe(rename('main.min.js'))
    .pipe(dest('dist/assets/js'));
}

// MINIFY CSS
function minifyCss() {
  log(chalk.red.bold('---------------MINIFY CSS---------------'));
  return src([
      'src/assets/vendor/css/**/*',
      'dist/assets/css/main.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(dest('dist/assets/css'));
}

// DEVELOPMENT
exports.development = series(cleanDist, copyFont, jsVendor, cssVendor, copyImages, compileHTML, compileJS, resetPages, prettyHTML, compileSCSS, browserSyncInit, watchFiles);

// PRODUCTION
exports.production = series(cleanDist, compileSCSS, copyFont, copyImages, compileHTML, concatScripts, minifyScripts, minifyCss, renameSources, prettyHTML, generateDocs, browserSyncInit);

// RUN ALL LINTERS
exports.lint = series(htmlLint, scssLint, jsLint);

// RUN ACCESSIBILITY CHECK
exports.a11y = HTMLAccessibility;
