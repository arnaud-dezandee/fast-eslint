'use babel';

/**
 * Dependencies
 */

import path from 'path';
import module from 'module';
import uniq from 'lodash.uniq';
import CLIEngine from 'eslint/lib/cli-engine.js';
import { allowUnsafeNewFunction } from 'loophole';

/**
 * Private
 */

// eslint plugin load patch
let appModulePaths = [];
const oldResolveLookupPaths = module.Module._resolveLookupPaths;
module.Module._resolveLookupPaths = (request, parent) => {
  if (request.indexOf('eslint-plugin') !== -1) {
    parent.paths = uniq((parent.paths || []).concat(appModulePaths));
  }
  return oldResolveLookupPaths.call(this, request, parent);
};

const engine = new CLIEngine();

/**
 * Interface
 */
export default function exec(filePath, fileText) {
  appModulePaths = module.Module._nodeModulePaths(path.dirname(filePath));

  return new Promise((resolve, reject) => {
    try {
      allowUnsafeNewFunction(() => {
        resolve(engine.executeOnText(fileText, filePath));
      });
    } catch (error) {
      reject(error);
    }
  });
}
