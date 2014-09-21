var gulp = require('gulp');
var traceur = require('gulp-traceur');

/**
 * Default task
 */
gulp.task('default', function () {
    return gulp.src('src/**/*.js')
        .pipe(traceur({
            modules: 'amd'
        }))
        .pipe(gulp.dest('dist'));
});