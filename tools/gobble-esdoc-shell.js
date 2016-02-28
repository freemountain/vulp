const path = require('path');
const esdoc = require('esdoc');
const publisher = require('esdoc/out/src/Publisher/publish');

module.exports = function esdocShell(inputdir, outputdir, options, cb) {
  const source = path.resolve(inputdir, options.source || '');
  const destination = path.resolve(outputdir, options.source || '');
  const esdocOptions = Object.assign({}, options, { source, destination });

  esdoc.generate(Object.assign({}, esdocOptions), publisher);
  cb();
};
