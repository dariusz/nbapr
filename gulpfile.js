var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('default', function () {
});

gulp.task('images', function () {
	return gulp.src('src/img/**')
		.pipe(gulp.dest('dist/img'))
});

gulp.task('useref', function () {
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
	return del.sync('dist');
})

gulp.task('build', function(callback) {
	runSequence('clean', ['images', 'useref'], callback);
});
