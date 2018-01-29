const gulp = require('gulp');
const bowerResolve = require('bower-resolve');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');

const config = require('../utils/config');
const getBundler = require('../utils/getBundler');


// ---------------------------------------------
// common js bundle
// bundle the common js files using browserify
// outputs: js/bundles/
// ---------------------------------------------
const commonjsTask = function() {
	let bundler = getBundler(false);
	const { jsCommons } = config;

	jsCommons.forEach(expose => {
		let resolvedPath = bowerResolve.fastReadSync(expose);
		bundler.require(resolvedPath, { expose });
	});

	return bundler.bundle()
		.pipe(source('common.js'))
		.pipe(rename({
			dirname: 'js',
			extname: '.bundle.js'
		}))
		.pipe(gulp.dest('public'));
};

gulp.task('commonjs', commonjsTask);
module.exports = commonjsTask;
