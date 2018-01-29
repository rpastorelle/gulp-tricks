const gulp = require('gulp');
const gulputil = require('gulp-util');
const mergeStream = require('merge-stream');
const path = require('path');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');

const config = require('../utils/config');
const getBundler = require('../utils/getBundler');

// ---------------------------------------------
// watchjs
// watch for updates & re-bundle
// ---------------------------------------------
const watchjsTask = function(done) {
	const { jsEntries, jsCommons } = config;

	const tasks = jsEntries.map(entry => {
		let bundler = getBundler(true);

		jsCommons.forEach(pkg => bundler.external(pkg));

		bundler.add(entry);

		function doBundle() {
			return bundler.bundle()
				.pipe(source(path.basename(entry)))
				.pipe(rename({
					// dirname: 'public/js',
					extname: '.bundle.js'
				}))
				.pipe(gulp.dest('public/js'));
		}

		bundler.on('update', ids => {
			ids = ids.map(id => path.basename(id));
			gulputil.log('Rebundling', gulputil.colors.cyan(ids));
			doBundle();
		});
		bundler.on('log', msg => gulputil.log(gulputil.colors.magenta(msg)));

		return doBundle();
	});

	return mergeStream(tasks);

};

module.exports = watchjsTask;
gulp.task('watchjs', watchjsTask);
