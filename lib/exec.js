'use babel';

/**
 * Dependencies
 */

import path from 'path';
import module from 'module';
import uniq from 'lodash.uniq';
import { allowUnsafeNewFunction } from 'loophole';
import resolveModule from 'eslint/node_modules/resolve';
import CLIEngine from 'eslint/lib/cli-engine.js';

/**
 * Private
 */

const engine = new CLIEngine();

// eslint config-file load patch
let appBasedir;
const old_resolveModuleSync = resolveModule.sync;

resolveModule.sync = (x, opts) => (
  old_resolveModuleSync(x, { basedir: appBasedir }) || old_resolveModuleSync(x, opts)
)

// eslint plugin load patch
let appModulePaths = [];
const old_resolveLookupPaths = module.Module._resolveLookupPaths;

module.Module._resolveLookupPaths = (request, parent) => {
  if (request.indexOf('eslint-plugin') !== -1) {
    parent.paths = uniq((parent.paths || []).concat(appModulePaths));
  }
  return old_resolveLookupPaths.call(this, request, parent);
};

/**
 * Interface
 */
export default function exec(filePath, fileText) {
  appBasedir = path.dirname(filePath);
  appModulePaths = module.Module._nodeModulePaths(appBasedir);

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
