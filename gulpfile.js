"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean:dist", function() {
 return del(['dist/**/*']);
});

gulp.task("tsc", function () {
 return tsProject.src()
 .pipe(tsProject())
 .js.pipe(gulp.dest("dist"));
});

gulp.task('default', ['clean:dist','tsc'], function () {
});