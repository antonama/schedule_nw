var gulp = require('gulp'),
    concat = require('gulp-concat'),
    strip = require('gulp-strip-comments'),
    sass = require('gulp-sass');

var sources = {
    scss: "scss/**/*.scss",
    clientJs: ["scripts/main.js", "scripts/**/*.js", "materialize-directives/**/*.js"]
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
    }
};

gulp.task('default', ['sass', 'concat-js', 'watch']);

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
