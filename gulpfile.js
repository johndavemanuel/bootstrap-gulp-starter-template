// The require statement tells Node to look into the node_modules folder for a package
// Once the package is found, we assign its contents to the variable
// gulp.src tells the Gulp task what files to use for the task
// gulp.dest tells Gulp where to output the files once the task is completed.
'use strict';
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const bourbon = require('node-bourbon').includePaths;
const cssmin = require('gulp-cssmin');
const csscomb = require('csscomb');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');
const panini = require('panini');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
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

// ------------ DEVELOPMENT TASKS -------------

// COMPILE SASS INTO CSS
function sass() {
  console.log('---------------COMPILING SCSS---------------');
  return src(['src/assets/scss/main.scss'])
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: 'map',
      sourceMap: 'sass',
      includePaths: bourbon
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream());
}

gulp.task('sass', function () {
  console.log('---------------COMPILING SCSS---------------');
  return gulp.src(['src/assets/scss/main.scss'])
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: 'map',
      sourceMap: 'sass',
      includePaths: bourbon
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
});


// USING PANINI, TEMPLATE, PAGE AND PARTIAL FILES ARE COMBINED TO FORM HTML MARKUP
gulp.task('compile-html', function () {
  console.log('---------------COMPILING HTML WITH PANINI---------------');
  return gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      // pageLayouts: {
      //     // All pages inside src/pages/blog will use the blog.html layout
      //     'blog': 'blog'
      // }
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(gulp.dest('dist'));
});

// COPY CUSTOM JS
gulp.task('compile-js', function () {
  console.log('---------------COMPILE CUSTOM.JS---------------');
  return gulp.src(['src/assets/js/custom.js'])
    .pipe(babel())
    .pipe(gulp.dest('dist/assets/js/'));
});


// RESET PANINI'S CACHE OF LAYOUTS AND PARTIALS
gulp.task('resetPages', function () {
  console.log('---------------CLEARING PANINI CACHE---------------');
  panini.refresh();
});


// SASS LINT
gulp.task('sassLint', function () {
  console.log('---------------SASS LINTING---------------');
  return gulp.src('src/assets/scss/**/*.scss')
    .pipe(sassLint({
      configFile: '.scss-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// HTML LINTER
gulp.task('htmlLint', function () {
  console.log('---------------HTML LINTING---------------');
  return gulp.src('dist/*.html')
    .pipe(htmllint({}, htmllintReporter));
});

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      log(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
    });
    process.exitCode = 1;
  } else {
    console.log('---------------NO HTML LINT ERROR---------------');
  }
}

// JS LINTER
gulp.task('jsLint', function () {
  return gulp.src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// RUN ALL LINTERS
gulp.task('linters', ['htmlLint', 'sassLint', 'jsLint'], function () {
  console.log('---------------DONE ALL LINTERS---------------');
});


// WATCHES FOR CHANGES WHILE GULP IS RUNNING
gulp.task('watch', ['sass', 'browserSyncInit'], function () {
  console.log('---------------WATCHING FOR CHANGES---------------');
  gulp.watch(['src/**/*.html'], ['resetPages', 'compile-html', browserSync.reload]);
  gulp.watch(['src/assets/scss/**/*'], ['sass', browserSync.reload]);
  gulp.watch(['src/assets/js/*.js'], ['compile-js', browserSync.reload]);
  gulp.watch(['src/assets/img/**/*'], ['images', browserSync.reload]);
});


// BROWSER SYNC
gulp.task('browserSyncInit', function () {
  console.log('---------------BROWSER SYNC---------------');
  browserSync.init({
    server: './dist'
  });
});

// DEPLOY TO GIT 
gulp.task('deploy', function () {
  return gulp.src('/*')
    .pipe(ghPages({
      remoteUrl: 'https://github.com/johndavemanuel/bootstrap4-gulp-starter-template.git',
      branch: 'master',
      message: 'Automated update of contents via gulp'
    }));
});

// ------------ OPTIMIZATION TASKS -------------

// COPIES AND MINIFY IMAGE TO DIST
gulp.task('images', function () {
  console.log('---------------OPTIMIZING IMAGES---------------');
  return gulp.src('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(newer('dist/assets/img/'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img/'));
});


// PLACES FONT FILES IN THE DIST FOLDER
gulp.task('font', function () {
  console.log('---------------COPYING FONTS INTO DIST FOLDER---------------');
  return gulp.src([
      'src/assets/font/*',
    ])
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(browserSync.stream());
});

// COPY JS VENDOR FILES
gulp.task('jsVendor', function () {
  console.log('---------------COPY JAVASCRIPT FILES INTO DIST---------------');
  return gulp.src([
      // 'node_modules/jquery/dist/jquery.js',
      // 'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
      'src/assets/vendor/js/*',
    ])
    .pipe(gulp.dest('dist/assets/vendor/js'))
    .pipe(browserSync.stream());
});


// COPY CSS VENDOR FILES
gulp.task('cssVendor', function () {
  console.log('---------------COPY CSS FILES INTO DIST---------------');
  return gulp.src([
      'src/assets/vendor/css/*',
    ])
    .pipe(gulp.dest('dist/assets/vendor/css'))
    .pipe(browserSync.stream());
});


// PRETTIFY HTML FILES
gulp.task('prettyHTML', function () {
  console.log('---------------HTML PRETTIFY---------------');
  return gulp.src('dist/*.html')
    .pipe(prettyHtml({
      indent_size: 4,
      indent_char: ' ',
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
    }))
    .pipe(gulp.dest('dist'));
});


// DELETE DIST FOLDER
gulp.task('clean:dist', function () {
  console.log('---------------REMOVING OLD FILES FROM DIST---------------');
  return del.sync('dist');
});


// CREATE DOCS FOLDER FOR DEMO
gulp.task('docs', function () {
  console.log('---------------CREATING DOCS---------------');
  return gulp.src([
      'dist/**/*',
    ])
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.stream());
});

// ACCESSIBILITY CHECK
gulp.task('accessibility', function () {
  return gulp.src('dist/*.html')
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
    .pipe(gulp.dest('accessibility-reports'));
});

// ------------ PRODUCTION TASKS -------------

// CHANGE TO MINIFIED VERSIONS
gulp.task('renameSources', function () {
  console.log('---------------RENAMING SOURCES---------------');
  return gulp.src('dist/*.html')
    .pipe(htmlreplace({
      'js': 'assets/js/main.min.js',
      'css': 'assets/css/main.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});

// CONCATINATE SCRIPTS
gulp.task('concatScripts', function () {
  console.log('---------------CONCATINATE SCRIPTS---------------');
  return gulp.src([
      'dist/assets/vendor/js/jquery.js',
      'dist/assets/vendor/js/popper.js',
      'dist/assets/vendor/js/bootstrap.js',
      'dist/assets/js/*'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/assets/vendor/js'))
    .pipe(browserSync.stream());
});

// MINIFY SCRIPTS
gulp.task('minifyScripts', ['concatScripts'], function () {
  console.log('---------------MINIFY SCRIPTS---------------');
  return gulp.src('dist/assets/vendor/js/main.js')
    .pipe(removeLog())
    .pipe(removeCode({
      production: true
    }))
    .pipe(uglify().on('error', console.error))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('dist/assets/js'));
});

// MINIFY CSS
gulp.task('minifyCss', function () {
  console.log('---------------MINIFY CSS---------------');
  return gulp.src([
      'dist/assets/vendor/css/**/*',
      'dist/assets/css/main.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('dist/assets/css'));
});


// ------------ BUILD SEQUENCE -------------

// SIMPLY RUN 'GULP DEV' IN TERMINAL TO RUN LOCAL SERVER AND WATCH FOR CHANGES
gulp.task('dev', ['clean:dist', 'font', 'jsVendor', 'cssVendor', 'images', 'compile-html', 'compile-js', 'resetPages', 'prettyHTML', 'watch']);

// CREATES PRODUCTION READY ASSETS IN DIST FOLDER
gulp.task('build', function () {
  console.log('---------------BUILDING PRODUCTION READY ASSETS---------------');
  runSequence('clean:dist', 'sass', ['jsVendor', 'cssVendor', 'images', 'font', 'compile-js', 'compile-html'], 'minifyScripts', 'minifyCss', 'renameSources', 'prettyHTML', 'browserSyncInit', 'docs');
});
