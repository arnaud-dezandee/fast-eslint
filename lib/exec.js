'use babel';

/**
* Dependencies
*/
import fs from 'fs';
import path from 'path';
import module from 'module';
import childProcess from 'child_process';
import { CLIEngine } from 'eslint/lib/cli-engine/cli-engine';
import { IgnorePattern } from 'eslint/lib/cli-engine/config-array/ignore-pattern';
import { allowUnsafeNewFunction } from 'loophole';

/**
* Private
*/
let engine;

const toModulePaths = (projectPaths) => (
  projectPaths.reduce((accumulator, projectPath) => (
    accumulator.concat(module.Module._nodeModulePaths(projectPath))
  ), [])
);

/**
* Installed Nodejs/npm global node_modules directory detection
*/
let nodeLibPath = path.normalize('/usr/local/lib/node_modules');
childProcess.exec('npm config get prefix', (error, stdout) => {
  if (error) return;
  nodeLibPath = path.join(stdout.split('\n')[0], 'lib/node_modules');
});

/**
* Atom currently opened projects module paths
*/
let atomProjectsPaths = toModulePaths(atom.project.rootDirectories.map((project) => project.path));
atom.project.onDidChangePaths((projectPaths) => { atomProjectsPaths = toModulePaths(projectPaths); });

/**
* ESLint ModuleResolver & require() patch with AtomProjectsPaths and NodeLibPath
*/
const oldFindPath = module._findPath;
module._findPath = (name, lookupPaths) => {
  if (lookupPaths.length > 1) {
    lookupPaths = lookupPaths.concat(atomProjectsPaths, nodeLibPath);
  }
  return oldFindPath.call(this, name, lookupPaths);
};

/**
* Interface
*/

export function isIgnored(ignoreFile, filePath) {
  const patterns = fs.readFileSync(ignoreFile, 'utf8')
    .replace(/^\ufeff/u, '')
    .split(/\r?\n/gu)
    .filter((line) => line.trim() !== '' && !line.startsWith('#'));
  const ignorePattern = new IgnorePattern(patterns, path.dirname(ignoreFile));
  const ignoredPaths = IgnorePattern.createIgnore([ignorePattern]);
  return ignoredPaths(filePath);
}

export function initEngine(presets) {
  const baseConfig = (presets.length === 0) ? false : {
    extends: presets,
  };
  allowUnsafeNewFunction(() => {
    engine = new CLIEngine({ baseConfig });
  });
}

export function exec(filePath, fileText) {
  return new Promise((resolve) => {
    try {
      allowUnsafeNewFunction(() => {
        resolve(engine.executeOnText(fileText, filePath));
      });
    } catch (error) {
      // Rather than displaying a big error, treat the error as a normal lint error so it shows
      // in the footer rather than a pop-up toast error message.
      resolve({ results: [{ messages: [{ line: 1, message: error, ruleId: NaN, severity: 2 }] }] });
    }
  });
}
