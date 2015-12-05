'use babel';

/**
 * Dependencies
 */

import module from 'module';
import { allowUnsafeNewFunction } from 'loophole';
import cli from 'eslint/lib/cli.js';
import uniq from './uniq.js';

/**
 * Private
 */

const Module = module.Module;
const previousResolveLookupPaths = Module._resolveLookupPaths;
const previousProcessCwd = process.cwd();
const previousConsoleLog = console.log;

/**
 * Interface
 */

export default function exec(executionPath, filePath, fileText) {
  const nodeModulePaths = Module._nodeModulePaths(executionPath);

  Module._resolveLookupPaths = (request, parent) => {
    if (parent.filename.match(/fast-eslint\/node_modules\/eslint/)) {
      parent.paths = uniq((parent.paths || []).concat(nodeModulePaths));
    }
    return previousResolveLookupPaths.call(this, request, parent);
  };

  return new Promise((resolve, reject) => {
    try {
      process.chdir(executionPath);
      console.log = (json) => {
        resolve(JSON.parse(json));
      };
      allowUnsafeNewFunction(() => {
        cli.execute(['node', 'eslint', '-f', 'json', filePath], fileText);
      });
    } catch (error) {
      reject(error);
    } finally {
      Module._resolveLookupPaths = previousResolveLookupPaths;
      process.chdir(previousProcessCwd);
      console.log = previousConsoleLog;
    }
  });
}
