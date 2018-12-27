"use strict";

// INIT GULP PLUGINS 
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    nunjucks = require('gulp-nunjucks'),
    data = require('gulp-data'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    htmlreplace = require('gulp-html-replace'),
    cssmin = require('gulp-cssmin'),
    csscomb = require('gulp-csscomb'),
    htmllint = require('gulp-htmllint'),
    fancyLog = require('fancy-log'),
    colors = require('ansi-colors'),
    bourbon = require('node-bourbon');
bourbon.includePaths;

// ALL JS CONCATINATE INTO ONE FILE
gulp.task("concatScripts", function() {
    return gulp.src([
            'src/js/vendor/jquery-3.3.1.min.js',
            'src/js/vendor/popper.min.js',
            'src/js/vendor/bootstrap.min.js'
        ])
        .pipe(maps.init())
        .pipe(concat('main.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('src/js'))
        .pipe(browserSync.stream());
});

// JS MINIFY AFTER CONCATINATE
gulp.task("minifyScripts", ["concatScripts"], function() {
    return gulp.src("src/js/main.js")
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('build/src/js'));
});

// SASS to CSS
gulp.task('compileSass', function() {
    return gulp.src("src/css/scss/*.scss")
        .pipe(maps.init())
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(maps.write('./'))
        .pipe(csscomb())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});


// MINIFY CSS AFTER COMPILE
gulp.task("minifyCss", ["compileSass"], function() {
    return gulp.src("src/css/main.css")
        .pipe(csscomb())
        .pipe(cssmin())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/src/css'));
});

// MAKE CSS BEAUTIFUL SYNTAX
gulp.task('csscomb', function() {
    return gulp.src('src/css/theme.css')
        .pipe(csscomb())
        .pipe(gulp.dest('build/src/csscomb'));
});

// IMAGEMIN
gulp.task('csscomb', function() {
    return gulp.src('src/css/theme.css')
        .pipe(csscomb())
        .pipe(gulp.dest('build/src/csscomb'));
});


// IMAGEMIN
gulp.task('imagemin', function() {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,svg}')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('build/src/img'));
});

// WATCH SCSS-HTML-JS FILES
gulp.task('watchFiles', function() {
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch('src/css/**/*.scss', ['compileSass']);
    gulp.watch('src/js/*.js', ['concatScripts']);
})


// RENAME HTML FILES - CSS AND JS INTO MINIFIED VERSION
gulp.task('renameSources', function() {
    return gulp.src('*.html')
        .pipe(htmlreplace({
            'js': 'src/js/main.min.js',
            'css': 'src/css/main.min.css'
        }))
        .pipe(gulp.dest('build/'));
});


// DELETE MAIN.CSS AND ALL JS IN SRC
gulp.task('clean', function() {
    // del(['build', 'src/css/main.css*', 'src/js/main*.js*']);
});


// CREATE FOLDER FOR BUILD
gulp.task("build", ['minifyScripts', 'minifyCss'], function() {
    return gulp.src(['*.html', '*.php', '*.css', 'favicon.ico',
            "src/img/**", "src/css/theme.css", "src/js/theme.js", "src/fonts/**"
        ], { base: './' })
        .pipe(gulp.dest('build'));
});

// SERVE AND WATCH HTML, CCSS AND JS
gulp.task('server', ['watchFiles'], function() {
    browserSync.init({
        server: "./"
    });
});

// SYNC BRROWSER
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


// DEFAULT TASK
gulp.task("default", ['build'], function() {
    gulp.start('renameSources');
});

// HTML LINT
gulp.task('htmllint', function() {
    return gulp.src("index.html")
        .pipe(htmllint({}, htmllintReporter));
});


function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        issues.forEach(function(issue) {
            fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
        });

        process.exitCode = 1;
    }
}