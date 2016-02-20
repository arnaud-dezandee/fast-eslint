'use babel';

/**
 * Dependencies
 */

import path from 'path';
import module from 'module';
import { allowUnsafeNewFunction } from 'loophole';
import resolveModule from 'eslint/node_modules/resolve';
import CLIEngine from 'eslint/lib/cli-engine.js';

/**
 * Private
 */

let projectPaths = [];

const resolveModuleSync = resolveModule.sync;
resolveModule.sync = (x, opts) => {
  opts.paths = projectPaths;
  return resolveModuleSync(x, opts);
}

const engine = new CLIEngine();

/**
 * Interface
 */
export default function exec(filePath, fileText) {
  projectPaths = module.Module._nodeModulePaths(path.dirname(filePath));

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
