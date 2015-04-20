var gulp = require('gulp'),
    concat = require('gulp-concat'),
    strip = require('gulp-strip-comments'),
    sass = require('gulp-sass');

var sources = {
    scss: "scss/main.scss",
    clientJs: ["scripts/main.js", "scripts/**/*.js", "materialize-directives/**/*.js"],
    bowerComponentsJs: [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/materialize/bin/materialize.js",
        "bower_components/iscroll/build/iscroll.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-ui-router/release/angular-ui-router.js",
        "bower_components/angular-loading-bar/build/loading-bar.js"
    ],
    bowerComponentsCss: [
        "bower_components/angular-loading-bar/build/loading-bar.css"
    ]
};

var destinations = {
    scss: {
        path: "./scss"
    },
    css: {
        file: "styles.css",
        path: "./"
    },
    clientJs: {
        file: "clientScripts.js",
        path: "./"
    },
    bowerComponentsJs: {
        file: "bowerComponents.js",
        path: "./"
    },
    bowerComponentsCss: {
        file: "bowerComponents.css",
        path: "./"
    }
};

gulp.task('default', [
    'sass',
    'bower-components-js',
    'bower-components-css',
    'concat-js',
    'watch'
]);

gulp.task('bower-components-js', function () {
    gulp.src(sources.bowerComponentsJs)
        .pipe(concat(destinations.bowerComponentsJs.file))
        .pipe(gulp.dest(destinations.bowerComponentsJs.path));
});

gulp.task('bower-components-css', function () {
    gulp.src(sources.bowerComponentsCss)
        .pipe(concat(destinations.bowerComponentsCss.file))
        .pipe(gulp.dest(destinations.bowerComponentsCss.path));
});

gulp.task('concat-js', function () {
    gulp.src(sources.clientJs)
        .pipe(concat(destinations.clientJs.file))
        .pipe(strip())
        .pipe(gulp.dest(destinations.clientJs.path));
});

gulp.task('sass', function () {
    gulp.src(sources.scss)
        .pipe(sass())
        .pipe(concat(destinations.css.file))
        .pipe(gulp.dest(destinations.css.path));
});

gulp.task('watch', function () {
    gulp.watch(sources.scss, ['sass']);
    gulp.watch('scripts/**/*.js', ['concat-js']);
});
