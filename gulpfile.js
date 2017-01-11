'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const base64 = require('gulp-base64');
const uglify = require('gulp-uglify');

gulp.task('sass', function () {
	return gulp.src('./src/scss/**/*.scss')
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(gulp.dest('./dist/css'));
});

gulp.task('base64', ['sass'], function () {
	return gulp.src('./dist/css/*.css')
			.pipe(base64({
				extensions: ['png'],
				maxImageSize: 20 * 1024 // bytes
			}))
			.pipe(gulp.dest('./dist/css'));
});

gulp.task('compress', function () {
	return gulp.src('./dist/js/*.js')
			.pipe(uglify())
			.pipe(gulp.dest('./dist/js/'));
});
gulp.task('default', ['sass', 'base64', 'compress']);