const gulp = require('gulp');
const mergeStream = require('merge-stream');
const path = require('path');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');

const config = require('../utils/config');
const getBundler = require('../utils/getBundler');


// ---------------------------------------------
// js app bundle(s)
// outputs to: `public/js`
// ---------------------------------------------
const jsTask = function() {
	const { jsEntries, jsCommons } = config;
  var tasks = jsEntries.map(entry => {
    let bundler = getBundler(false);

    jsCommons.forEach(pkg => bundler.external(pkg));

    bundler.add(entry);

    return bundler.bundle()
      .pipe(source(path.basename(entry)))
      .pipe(rename({
        dirname: 'js',
        extname: '.bundle.js'
      }))
      .pipe(gulp.dest('public'));
  });

  return mergeStream(tasks);
};

gulp.task('js', jsTask);
module.exports = jsTask;
