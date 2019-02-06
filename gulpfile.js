// The require statement tells Node to look into the node_modules folder for a package
// Once the package is found, we assign its contents to the variable
// gulp.src tells the Gulp task what files to use for the task
// gulp.dest tells Gulp where to output the files once the task is completed.

var gulp = require('gulp'),
    log = require('fancy-log'),
    colors = require('ansi-colors'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    csscomb = require('csscomb'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del'),
    panini = require('panini'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin'),
    removeCode = require('gulp-remove-code'),
    removeLog = require('gulp-remove-logging'),
    prettyHtml = require('gulp-pretty-html'),
    sassLint = require('gulp-sass-lint'),
    htmllint = require('gulp-htmllint'),
    htmlreplace = require('gulp-html-replace'),
    autoprefixer = require('gulp-autoprefixer');

// ------------ DEVELOPMENT TASKS -------------

// COMPILE SASS INTO CSS
gulp.task('sass', function() {
    console.log('COMPILING SCSS');
    return gulp.src(['src/assets/scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: 'map',
            sourceMap: 'sass',
            outputStyle: 'nested'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/assets/css"))
        .pipe(browserSync.stream());
});


// USING PANINI, TEMPLATE, PAGE AND PARTIAL FILES ARE COMBINED TO FORM HTML MARKUP
gulp.task('compile-html', function() {
    console.log('COMPILING HTML WITH PANINI');
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


gulp.task('compile-js', function() {
    console.log('COMPILE THEME.JS');
    return gulp.src(['src/assets/js/theme.js'])
        .pipe(removeLog())
        .pipe(removeCode({ production: true }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js/'));
});




// RESET PANINI'S CACHE OF LAYOUTS AND PARTIALS
gulp.task('resetPages', (done) => {
    console.log('CLEARING PANINI CACHE');
    panini.refresh();
    done();
});


// SASS LINT
gulp.task('sassLint', function() {
    return gulp.src('src/assets/custom/scss/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

// HTML LINTER
gulp.task('htmlLint', function() {
    console.log('---------------HTML LINTING---------------');
    return gulp.src("dist/*.html")
        .pipe(htmllint({}, htmllintReporter));
});

function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        issues.forEach(function(issue) {
            log(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
        });
        process.exitCode = 1;
    }
}


// WATCHES FOR CHANGES WHILE GULP IS RUNNING
gulp.task('watch', ['sass'], function() {
    console.log('WATCHING FOR CHANGES');
    browserSync.init({
        server: "./dist"
    });

    gulp.watch(['src/**/*.html'], ['resetPages', 'compile-html', browserSync.reload]);
    gulp.watch(['src/assets/scss/**/*'], ['sass', browserSync.reload]);
    gulp.watch(['src/assets/js/*.js'], ['compile-js', browserSync.reload]);
    gulp.watch(['src/assets/img/**/*'], ['images', browserSync.reload]);
});


// ------------ OPTIMIZATION TASKS -------------

// COPIES IMAGE FILES TO DIST
gulp.task('images', function() {
    console.log('OPTIMIZING IMAGES')
    return gulp.src('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/img/'));;
});



// PLACES FONT FILES IN THE DIST FOLDER
gulp.task('font', function() {
    console.log('COPYING FONTS INTO DIST FOLDER');
    return gulp.src([
            'src/assets/font/*',
        ])
        .pipe(gulp.dest("dist/assets/fonts"))
        .pipe(browserSync.stream());
});

// CONCATENATING JS FILES
gulp.task('jsVendor', function() {
    console.log('CONCATENATING JAVASCRIPT FILES INTO SINGLE FILE');
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('./'))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/assets/vendor/js'))
        .pipe(browserSync.stream());
});


// CONCATENATING CSS FILES
gulp.task('cssVendor', function() {
    console.log('CONCATENATING CSS FILES INTO SINGLE FILE');
    return gulp.src([
            'src/assets/vendor/css/*',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/assets/vendor/css'))
        .pipe(browserSync.stream());
});


// PRETTIFY HTML FILES
gulp.task('prettyHTML', function() {
    console.log('---------------HTML PRETTIFY---------------');
    return gulp.src('dist/*.html')
        .pipe(prettyHtml({
            indent_size: 4,
            indent_char: ' ',
            unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
        }))
        .pipe(gulp.dest('dist'))
});



// CLEANING/DELETING FILES NO LONGER BEING USED IN DIST FOLDER
gulp.task('clean:dist', function() {
    console.log('REMOVING OLD FILES FROM DIST');
    return del.sync('dist');
});


// CREATE DOCS FOLDER FOR DEMO
gulp.task('docs', function() {
    console.log('CREATING DOCS');
    return gulp.src([
            'dist/**/*',
        ])
        .pipe(gulp.dest("docs"))
        .pipe(browserSync.stream());
});


// ------------ PROD TASKS -------------

gulp.task('renameSources', function() {
  return gulp.src('*.html')
    .pipe(htmlreplace({
        'js': 'assets/js/main.min.js',
        'css': 'assets/css/main.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});


// ------------ BUILD SEQUENCE -------------

// SIMPLY RUN 'GULP' IN TERMINAL TO RUN LOCAL SERVER AND WATCH FOR CHANGES
gulp.task('default', ['clean:dist', 'font', 'jsVendor', 'cssVendor', 'images', 'compile-html', 'compile-js', 'resetPages', 'prettyHTML', 'watch']);

// CREATES PRODUCTION READY ASSETS IN DIST FOLDER
gulp.task('build', function() {
    console.log('Building production ready assets');
    runSequence('clean:dist', 'sass', ['jsVendor', 'cssVendor', 'images', 'font', 'compile-js', 'compile-html', ])
});