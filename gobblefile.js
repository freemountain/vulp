const gobble = require('gobble');
const browserify = require('./tools/gobble-browserify');
const mocha = require('./tools/gobble-mocha-shell');
const esdoc = require('./tools/gobble-esdoc-shell');
const eslint = require('./tools/gobble-eslint');
const replace = require('./tools/gobble-replace');

const pkg = gobble([
  gobble('LICENSE'),
  gobble('README.md'),
  gobble('package.json').transform(function(input) {
    const json = JSON.parse(input);
    delete json.scripts;
    delete json.devDependencies;

    return JSON.stringify(json, null, ' ');
  }),
  gobble('src')
    .observe(eslint)
    .transform('babel', {})
    .moveTo('lib')
    .observe(mocha, {
      files: 'lib/**/tests/*.js'
    })
]).moveTo('pkg');

const starter = gobble('examples')
  .exclude(['node_modules', 'dist', 'src/fux.js', '.DS_Store'])
  .transform(replace, {})
  .moveTo('examples')
  .transform('zip', {
    dest: 'examples.zip'
  });

const doc = gobble('src').transform(esdoc).moveTo('docs');

const examples = gobble([
  gobble([
    gobble('src').moveTo('src'),
    gobble('examples/src').moveTo('examples')
  ])
    .transform('babel', {})
    .transform(browserify, {
      entries:    'examples/index.js',
      dest:       'examples.js',
      standalone: 'examples'
    }),

  gobble('examples/src')
    .include(['**/*.html'])
]).moveTo('examples');

module.exports = gobble([
  pkg,
  examples,
  doc,
  starter
]);
