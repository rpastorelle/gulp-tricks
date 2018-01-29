// App entry points. These are files that should be included as the source on a HTML page.
// These will be output as <filename>.bundle.js in public/js
const jsEntries = [
	'src/js/base.js',
	'src/js/fancy.js',
];

const jsCommons = [
	'jquery',
	'moment',
];

module.exports = {
  jsEntries,
  jsCommons,
};
