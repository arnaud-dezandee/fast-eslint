'use babel';

/**
 * Dependencies
 */

import path from 'path';
import { allowUnsafeNewFunction } from 'loophole';
import CLIEngine from 'eslint/lib/cli-engine.js';

/**
 * Private
 */

const atomCwd = process.cwd();
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
  return new Promise((resolve, reject) => {
    try {
      process.chdir(path.dirname(filePath));
      allowUnsafeNewFunction(() => {
        resolve(engine.executeOnText(fileText, filePath));
      });
    } catch (error) {
      reject(error);
    } finally {
      process.chdir(atomCwd);
    }
  });
}
