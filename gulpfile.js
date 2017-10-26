var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var download = require("gulp-download-stream");

gulp.task('default', function () {
	// nothing
});

gulp.task('images', function () {
	return gulp.src('src/img/**')
		.pipe(gulp.dest('dist/img'))
});

gulp.task('vendor', function () {
	return gulp.src('src/vendor/**')
		.pipe(gulp.dest('dist/vendor'))
});

gulp.task('useref', function () {
	return gulp.src('src/*.html')
		.pipe(useref())
		//.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
	return del.sync('dist');
})

gulp.task('build', function(callback) {
	runSequence('clean', ['dl_ranks', 'dl_sources'], ['images', 'useref', 'vendor'], callback);
});

gulp.task('dl_ranks', function() {
	return download({
		"url": "https://spreadsheets.google.com/feeds/list/1nK_9dsvKj4F22hqJPFJOBE-ftTVMac3vFIkp9ULjSbo/1/public/values?alt=json-in-script&callback=nbapr.loadRankings",
		"file": "rankings.js"
	}).pipe(gulp.dest("dist/data/"));
});

gulp.task('dl_sources', function () {
	return download({
		"url": "https://spreadsheets.google.com/feeds/list/1nK_9dsvKj4F22hqJPFJOBE-ftTVMac3vFIkp9ULjSbo/2/public/values?alt=json-in-script&callback=nbapr.loadSources",
		"file": "sources.js"
	}).pipe(gulp.dest("dist/data/"));
});
