var gulp = require('gulp');
var traceur = require('gulp-traceur');
var webserver = require('gulp-webserver');
/**
 * Default task
 */
gulp.task('es5', function () {
    return gulp.src('src/**/*.js')
        .pipe(traceur({
            modules: 'amd'
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});


gulp.task('default', ['es5', 'webserver']);