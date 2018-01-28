let gulp = require('gulp');
let gulputil = require('gulp-util');
let browserify = require('browserify');
let bowerResolve = require('bower-resolve');
let mergeStream = require('merge-stream');
let path = require('path');
let rename = require('gulp-rename');
let source = require('vinyl-source-stream');
let watchify = require('watchify');

const jsEntries = [
	'./src/js/base.js',
	'./src/js/fancy.js',
];

const jsCommons = [
	'jquery',
	'moment',
];

function getBundler(watch, opts) {
  if (typeof opts === "undefined") {
    opts = {};
  }

  const baseProps = require('./package.json').browserify;
  const props = Object.assign({}, baseProps, opts, {
    debug: true,
    cache: {},
    packageCache: {},
  });

  return watch ? watchify(browserify(props)) : browserify(props);
}

// -----------------------
// watch js bundles
// -----------------------
gulp.task('watch', function(){
  var tasks = jsEntries.map(entry => {
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
});

// -----------------------
// js app bundle(s)
// -----------------------
gulp.task('js', function(){
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
});

// -----------------------
// common js bundle
// - fetch from bower_components -
// -----------------------
gulp.task('common', () => {
  let bundler = getBundler(false);

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
});

gulp.task('default', ['common', 'js']);
