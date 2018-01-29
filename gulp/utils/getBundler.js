const browserify = require('browserify');
const watchify = require('watchify');

module.exports = function(watch) {
	// get bundler instance
	// watch: bool - is watchify
	// ---------------------------------------------
	const baseProps = require('../../package.json').browserify;
	const props = Object.assign({}, baseProps, {
		debug: true,
		cache: {},
		packageCache: {},
	});

	return watch ? watchify(browserify(props)) : browserify(props);
};
