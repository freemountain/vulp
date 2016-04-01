require('babel-register');

const path = require('path');
const repl = require('repl');

const replServer = repl.start({
  prompt: 'vulp > '
});

replServer.context.t = require('tcomb');
replServer.context.flyd = require('flyd');
replServer.context.vulp = require(path.join(__dirname, '..', 'src'));
