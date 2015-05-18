var gulp = require('gulp'),
    concat = require('gulp-concat'),
    strip = require('gulp-strip-comments'),
    sass = require('gulp-sass');

var sources = {
    scss: "scss/**/*.scss",
    serverJs: [
        "node_scripts/requires.js",
        "node_scripts/schemas/staffSchema.js",
        "node_scripts/schemas/classSchema.js",
        "node_scripts/schemas/roomSchema.js",
        "node_scripts/schemas/groupSchema.js",
        "node_scripts/schemas/scheduleSchema.js",
        "node_scripts/rfeStaff.js",
        "node_scripts/rfeClasses.js",
        "node_scripts/rfeRooms.js",
        "node_scripts/rfeGroups.js",
        "node_scripts/rfeSchedule.js"
    ],
    clientJs: ["scripts/main.js", "scripts/**/*.js", "materialize-directives/**/*.js"],
    bowerComponentsJs: [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/jquery-ui/jquery-ui.js",
        "bower_components/moment/min/moment.min.js",
        "bower_components/materialize/dist/js/materialize.js",
        "bower_components/iscroll/build/iscroll.js",
        "bower_components/fuse/src/fuse.min.js",
        "bower_components/angular/angular.js",
        "bower_components/checklist-model/checklist-model.js",
        "bower_components/angular-dragdrop/src/angular-dragdrop.js",
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
    serverJs: {
        file: "serverScripts.js",
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
    'concat-server-js',
    'concat-client-js',
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

gulp.task('concat-client-js', function () {
    gulp.src(sources.clientJs)
        .pipe(concat(destinations.clientJs.file))
        .pipe(strip())
        .pipe(gulp.dest(destinations.clientJs.path));
});

gulp.task('concat-server-js', function () {
    gulp.src(sources.serverJs)
        .pipe(concat(destinations.serverJs.file))
        .pipe(strip())
        .pipe(gulp.dest(destinations.serverJs.path));
});

gulp.task('sass', function () {
    gulp.src(sources.scss)
        .pipe(sass())
        .pipe(concat(destinations.css.file))
        .pipe(gulp.dest(destinations.css.path));
});

gulp.task('watch', function () {
    gulp.watch(sources.scss, ['sass']);
    gulp.watch('scripts/**/*.js', ['concat-client-js']);
    gulp.watch('node_scripts/**/*.js', ['concat-server-js']);
});
