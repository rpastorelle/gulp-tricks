const gulp = require('gulp');
const requireDir = require('require-dir');

const build = ['commonjs', 'js'];

// Require all tasks in gulp/tasks
requireDir('./gulp/tasks');

gulp.task('watch', ['watchjs']);
gulp.task('build', build);
gulp.task('default', build);
