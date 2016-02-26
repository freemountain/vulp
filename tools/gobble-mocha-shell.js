const path = require('path');
const childProcess = require('child_process');

module.exports = function mochaShell(inputdir, options, cb) {
  const mochaCmd = path.join(process.cwd(), './node_modules/.bin/_mocha');
  const dest = `${path.join(inputdir, options.files)}`;

  const compiler = Object
    .keys(options.compiler || {})
    .map(ext => `${ext}:${options.compiler[ ext ]}`)
    .join(' ');

  const mochaArgs = compiler === '' ? [] : ['--compilers', compiler];

  mochaArgs.push(dest);

  const cmd = childProcess.spawn(mochaCmd, mochaArgs, { stdio: 'inherit' });

  cmd.on('exit', () => cb());
}
