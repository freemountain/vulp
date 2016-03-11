'use strict';

require('shelljs/global');

const semver = require('semver');
const fs = require('fs');
const os = require('os');
const path = require('path');

function getPkgJson(x) {
  const target = x ? x : './package.json';
  const data = cat(target);

  return JSON.parse(data);
}

function getEnv() {
  const result = {};
  result.gh_token = process.env.GITHUB_TOKEN;
  result.repo = 'vulp';
  result.owner = 'freemountain';

  return result;
}

function run(command, opts) {
  opts = opts || {};
  const silent = opts.silent || false;
  const ignoreCode = opts.ignoreCode || false;
  if(!silent) console.log('$ ' + command + '...\n');

  const result = exec(command);

  if(ignoreCode !== true && result.code !== 0) {
    if(!silent)
      console.log('\nCommand: ' + command +' returned ' + result.code + '\nExit...');
    process.exit(result.code);
  }

  return result;
}

function assertCleanWorkingDir() {
  const output = run('git status --porcelain').stdout;

  if(output.length === 0) return;

  console.log('\nworking dir is not clean\nExit...');
  process.exit(-1);
}

function asserMasterBranch() {
  const output = run('git rev-parse --abbrev-ref HEAD').stdout.trim();

  if(output === 'master') return;

  console.log('\ncurrent Branch should be master.\nExit...');
  process.exit(-1);
}

function bumbVersionAndTag(delta) {
  const pkgJson = getPkgJson();
  const currentVersion = pkgJson.version;
  const newVersion = semver.inc(currentVersion, delta);
  pkgJson.version = newVersion;

  console.log('Bump version from', currentVersion, 'to', newVersion);
  JSON.stringify(pkgJson, null, '  ').to('./package.json');

  run('git add package.json');

  return newVersion;
}

function bumpExamples(vulpVersion) {
  const pkgJson = getPkgJson('./examples/package.json');
  pkgJson.dependencies.vulp = vulpVersion;
  JSON.stringify(pkgJson, null, '  ').to('./examples/package.json');

  run('git add examples/package.json');
}

function uploadDocs() {
  const cwd = process.cwd();
  const tmpDir = path.join('/tmp', 'docs-' + Date.now());

  mkdir(tmpDir);
  process.chdir(tmpDir);
  run('git init');
  run('git remote add origin https://github.com/freemountain/vulp.git');
  run('git checkout --track -b origin/gh-pages');
  run('git pull origin gh-pages');
  run('git rm -rf .');
  run('cp -R ' + path.join(cwd, 'dist', 'docs/*') + ' ' + tmpDir);
  run('git add --all .');
  run('git commit -m "updating docs.."');
  run('git push origin HEAD:gh-pages');
  process.chdir(cwd);
  rm('-rf', tmpDir);
}

const delta = process.argv[ 2 ];

if(['patch', 'minor', 'major'].indexOf(delta) === -1)
  throw new Error('illegal delta');

assertCleanWorkingDir();
asserMasterBranch();
const version = bumbVersionAndTag(delta);
bumpExamples(version);

run('git commit -m "Bump version to ' + version + '"');
run('git push');
run('git tag -a "v' + version + '" -m "Release ' + version + '"');
run('git push --tags');
run('git pull');
run('npm run build');
run('npm publish dist/pkg');

uploadDocs();
