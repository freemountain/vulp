const rewire = require("rewire");
const eslint = rewire('gobble-eslint');

eslint.__set__('linter', require('eslint').linter);

module.exports = function esdocShell(inputdir, options) {
  return eslint.call(this, inputdir, {});
};
