'use babel';

/**
 * Dependencies
 */

import path from 'path';
import module from 'module';
import uniq from 'lodash.uniq';
import { allowUnsafeNewFunction } from 'loophole';
import CLIEngine from 'eslint/lib/cli-engine.js';

/**
 * Private
 */

const Module = module.Module;
const previousResolveLookupPaths = Module._resolveLookupPaths;

const engine = new CLIEngine({
  extensions: ['.js'],
  ignore: true,
  useEslintrc: true,
  parser: 'espree',
  cache: false,
  allowInlineConfig: true,
});

/**
 * Interface
 */
export default function exec(filePath, fileText) {
  const nodeModulePaths = Module._nodeModulePaths(path.dirname(filePath));

  Module._resolveLookupPaths = (request, parent) => {
    if (parent.filename.match(/fast-eslint\/node_modules\/eslint/)) {
      parent.paths = uniq((parent.paths || []).concat(nodeModulePaths));
    }
    return previousResolveLookupPaths.call(this, request, parent);
  };

  return new Promise((resolve, reject) => {
    try {
      allowUnsafeNewFunction(() => {
        resolve(engine.executeOnText(fileText, filePath));
      });
    } catch (error) {
      reject(error);
    } finally {
      Module._resolveLookupPaths = previousResolveLookupPaths;
    }
  });
}
