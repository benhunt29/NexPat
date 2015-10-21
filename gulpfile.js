// dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var merge = require('merge-stream');
var jade = require('gulp-jade');

var config = {
    paths: {
        public: './public/javascripts',
        js: ['./client/javascripts/main.js','./client/javascripts/**/*.js'],
        css: './public/stylesheets/'
    }
};

// create a default task and just log a message
gulp.task('default', ['copy', 'build-js', 'build-css','jade-templates'], function () {
    gutil.log('Gulp ran.');
});

// copy vendor files
gulp.task('copy', function () {
    var angular = gulp.src('node_modules/angular/angular.min.js',{base: 'node_modules'}).pipe(gulp.dest('./public/vendors/'));
    var angularMaterial = gulp.src('node_modules/angular-material/angular-material.min.js',{base: 'node_modules'}).pipe(gulp.dest('./public/vendors/'));
    var angularAnimate = gulp.src('node_modules/angular-animate/angular-animate.min.js',{base: 'node_modules'}).pipe(gulp.dest('./public/vendors/'));
    var angularAria = gulp.src('node_modules/angular-aria/angular-aria.min.js',{base: 'node_modules'}).pipe(gulp.dest('./public/vendors/'));
    var angularRoute = gulp.src('node_modules/angular-route/angular-route.min.js',{base: 'node_modules'}).pipe(gulp.dest('./public/vendors/'));
    var angularMaterialCSS = gulp.src('node_modules/angular-material/angular-material.min.css',{base:'node_modules'}).pipe(gulp.dest('./public/stylesheets/'));

    var angularMessages = gulp.src('node_modules/angular-messages/angular-messages.min.js',{base:'node_modules'}).pipe(gulp.dest('./public/vendors/'));

    var angularValidationMatch = gulp.src('node_modules/angular-validation-match/dist/angular-validation-match.min.js',{base:'node_modules'}).pipe(gulp.dest('./public/vendors/'));

    return merge(angular,angularMaterial,angularAnimate,angularAria,angularRoute,angularMaterialCSS,angularMessages,angularValidationMatch);//angularMaterial,angularAnimate,angularAria,angularRoute);
});


gulp.task('build-js', function () {
    return gulp.src(config.paths.js)
        // create .map files
        .pipe(sourcemaps.init())
        // compile into bundle.min.js
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        // write the maps files
        .pipe(sourcemaps.write())
        // write the concat file
        .pipe(gulp.dest(config.paths.public))
});

gulp.task('build-css', function () {
    return gulp.src('client/stylesheets/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.css))
});

gulp.task('jade-templates', function() {

    gulp.src('./client/**/*.jade')
        .pipe(jade({ }))
        .pipe(gulp.dest('./public/'))
});